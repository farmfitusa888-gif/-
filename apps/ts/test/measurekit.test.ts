/** Port of MeasureKitTests.swift + SurfaceAndMoneyTests.swift. */
import { describe, expect, it } from "vitest";
import * as M from "../src/measurekit/index.js";

const NM_IN = M.NM_PER_INCH, NM_FT = M.NM_PER_FOOT;

describe("Length", () => {
  it("holds an inch exactly", () => {
    expect(M.inches(1)).toBe(NM_IN);
    expect(M.inches(12)).toBe(NM_FT);
  });

  it("represents three eighths exactly", () => {
    expect(M.inches(0, 3, 8)).toBe(9_525_000n);
    expect(M.formatted(M.inches(0, 3, 8))).toBe('3/8"');
  });

  it("has 1/32 inch as the verified constant", () => {
    expect(M.inches(0, 1, 32)).toBe(793_750n);
  });

  it("formats feet, inches and a reduced fraction", () => {
    expect(M.formatted(2n * NM_FT + 10n * NM_IN + M.inches(0, 3, 8))).toBe(`2' 10 3/8"`);
    expect(M.formatted(NM_IN / 2n)).toBe('1/2"');
    expect(M.formatted(0n)).toBe('0"');
    expect(M.formatted(-M.inches(1))).toBe('-1"');
  });

  it("round-trips every sixteenth over eight feet", () => {
    for (let s = 0; s <= 8 * 12 * 16; s++) {
      const nm = (BigInt(s) * NM_IN) / 16n;
      expect(M.parse(M.formatted(nm))).toBe(nm);
    }
  });

  it("parses the forms a person types", () => {
    expect(M.parse(`2' 10 3/8"`)).toBe(2n * NM_FT + 10n * NM_IN + (3n * NM_IN) / 8n);
    expect(M.parse(`34"`)).toBe(34n * NM_IN);
    expect(M.parse(`3'`)).toBe(3n * NM_FT);
    expect(M.parse(`  6 1/2"  `)).toBe(6n * NM_IN + NM_IN / 2n);
  });

  /** The bug: a lazy group reads `11/16` as `1` and `1/16`, wrong by an inch. */
  it("parses a bare fraction without eating the digit", () => {
    expect(M.parse(`11/16"`)).toBe((11n * NM_IN) / 16n);
    expect(M.parse(`11/16"`)).not.toBe(NM_IN + NM_IN / 16n);
  });

  it("refuses nonsense instead of guessing", () => {
    expect(M.parse("about a yard")).toBeNull();
    expect(M.parse("")).toBeNull();
    expect(M.parse(`1 1/0"`)).toBeNull();
  });

  it("rejects a denominator a tape does not have", () => {
    expect(() => M.formatted(NM_IN, 3)).toThrow(RangeError);
  });

  it("refuses a non-finite sensor reading", () => {
    expect(() => M.sensorMetres(NaN)).toThrow(RangeError);
    expect(() => M.sensorMetres(Infinity)).toThrow(RangeError);
  });

  it("floors the integer square root", () => {
    expect(M.isqrt(143n)).toBe(11n);
    expect(M.isqrt(144n)).toBe(12n);
    expect(M.isqrt(10n ** 14n)).toBe(10n ** 7n);
    expect(() => M.isqrt(-1n)).toThrow(RangeError);
  });
});

describe("Geometry", () => {
  it("gets a 3-4-5 triangle exactly right", () => {
    expect(M.distance({ x: 3n * NM_FT, y: 4n * NM_FT, z: 0n }, M.ORIGIN)).toBe(5n * NM_FT);
  });

  it("does not overflow at room scale", () => {
    const ten = 10_000_000_000n;
    expect(M.distance({ x: ten, y: ten, z: ten }, M.ORIGIN)).toBe(17_320_508_000n);
  });

  it("holds precision to a micrometre", () => {
    expect(M.distance({ x: 1_000n, y: 0n, z: 0n }, M.ORIGIN)).toBe(1_000n);
  });

  /** The one thing bigint would otherwise hide about the Swift. */
  it("proves the Swift stays inside Int64 at building scale", () => {
    const km = 1_000_000_000_000n;   // 1 km in nanometres
    expect(() => M.distance({ x: km, y: km, z: km }, M.ORIGIN)).not.toThrow();
    const tooFar = 10_000n * km;     // 10,000 km - past the Int64 headroom
    expect(() => M.distance({ x: tooFar, y: tooFar, z: tooFar }, M.ORIGIN)).toThrow(RangeError);
  });
});

describe("Triangulation", () => {
  const intr = M.intrinsics(1450, 1450, 960, 720);
  const pipe = M.vec(0.30, 0.20, -2.00);
  const frame = (id: string, eye: M.Vec3): M.CameraFrame => ({
    id, transform: M.lookAt(eye, pipe), intrinsics: intr,
    imageWidth: 1920, imageHeight: 1440,
  });

  it("recovers a known point from two synthetic views", () => {
    const a = frame("a", M.vec(0, 0, 0)), b = frame("b", M.vec(1.2, 0.1, 0));
    const pa = M.project(a, pipe), pb = M.project(b, pipe);
    expect(pa.isOnImage).toBe(true);
    expect(pb.isOnImage).toBe(true);
    const t = M.triangulateTaps({ frame: a, x: pa.x, y: pa.y }, { frame: b, x: pb.x, y: pb.y });
    expect(t.isDegenerate).toBe(false);
    expect(M.length(M.sub(t.point, pipe))).toBeLessThan(1e-9);
    expect(t.missDistance).toBeLessThan(1e-9);
    expect(t.depths[0]).toBeGreaterThan(0);
  });

  it("projection and unprojection are inverses", () => {
    const f = frame("f", M.vec(0.5, 1.2, 0.4));
    const p = M.project(f, pipe);
    const ray = M.rayThroughPixel(f, p.x, p.y);
    const rebuilt = M.add(ray.origin, M.scale(ray.direction, M.length(M.sub(pipe, ray.origin))));
    expect(M.length(M.sub(rebuilt, pipe))).toBeLessThan(1e-9);
  });

  it("reports a real miss when the taps disagree", () => {
    const a = frame("a", M.vec(0, 0, 0)), b = frame("b", M.vec(1.2, 0.1, 0));
    const pa = M.project(a, pipe), pb = M.project(b, pipe);
    const sloppy = M.triangulateTaps({ frame: a, x: pa.x, y: pa.y + 5 },
                                     { frame: b, x: pb.x, y: pb.y });
    expect(sloppy.isDegenerate).toBe(false);
    expect(sloppy.missDistance).toBeGreaterThan(0);
    expect(Number.isFinite(sloppy.missDistance)).toBe(true);
  });

  it("a wider baseline beats a narrow one for the same tap error", () => {
    const a = frame("a", M.vec(0, 0, 0));
    const err = (x: number) => {
      const b = frame("b", M.vec(x, 0, 0));
      const pa = M.project(a, pipe), pb = M.project(b, pipe);
      const t = M.triangulateTaps({ frame: a, x: pa.x + 3, y: pa.y },
                                  { frame: b, x: pb.x, y: pb.y });
      return M.length(M.sub(t.point, pipe));
    };
    expect(err(1.5)).toBeLessThan(err(0.08));
  });

  it("refuses to answer when the rays are parallel", () => {
    const ray = { origin: M.ZERO, direction: M.vec(0, 0, -1) };
    expect(M.triangulateRays(ray, ray).isDegenerate).toBe(true);
    expect(M.triangulateRays(ray, ray).missDistance).toBe(Infinity);
  });

  it("picks the best-agreeing pair of three", () => {
    const a = frame("a", M.vec(0, 0, 0)), b = frame("b", M.vec(1.2, 0.1, 0));
    const c = frame("c", M.vec(-1.1, 0.3, 0.2));
    const pa = M.project(a, pipe), pb = M.project(b, pipe), pc = M.project(c, pipe);
    const { result, pairsConsidered } = M.triangulateBestPair([
      { frame: a, x: pa.x, y: pa.y },
      { frame: b, x: pb.x, y: pb.y + 12 },   // one sloppy tap
      { frame: c, x: pc.x, y: pc.y },
    ]);
    expect(pairsConsidered).toBe(3);
    expect(M.length(M.sub(result.point, pipe))).toBeLessThan(1e-6);
  });

  it("needs two taps before it will answer", () => {
    const f = frame("a", M.vec(0, 0, 0));
    expect(() => M.triangulateBestPair([{ frame: f, x: 10, y: 10 }])).toThrow(RangeError);
  });
});

describe("Slope", () => {
  it("is exact at the ramp boundary", () => {
    expect(M.exceedsOneIn(M.slope(M.inches(1), M.inches(12)), M.SLOPE_LIMIT.ramp)).toBe(false);
    expect(M.exceedsOneIn(M.slope(NM_IN + 1n, M.inches(12)), M.SLOPE_LIMIT.ramp)).toBe(true);
  });

  it("is exact at the cross-slope boundary", () => {
    expect(M.exceedsOneIn(M.slope(M.inches(1), M.inches(48)), M.SLOPE_LIMIT.cross)).toBe(false);
    expect(M.exceedsOneIn(M.slope(NM_IN + 1n, M.inches(48)), M.SLOPE_LIMIT.cross)).toBe(true);
  });

  it("treats a fall the same as a rise", () => {
    expect(M.exceedsOneIn(M.slope(-M.inches(2), M.inches(12)), M.SLOPE_LIMIT.ramp)).toBe(true);
  });

  it("catches a ramp that is just too steep", () => {
    expect(M.exceedsOneIn(M.slope(M.inches(31), M.feet(30)), M.SLOPE_LIMIT.ramp)).toBe(true);
    expect(M.exceedsOneIn(M.slope(M.inches(30), M.feet(30)), M.SLOPE_LIMIT.ramp)).toBe(false);
  });

  it("formats as one-in", () => {
    expect(M.formattedAsOneIn(M.slope(M.inches(1), M.inches(12)))).toBe("1:12");
    expect(M.formattedAsOneIn(M.slope(0n, M.inches(12)))).toBe("level");
  });

  it("keeps the disagreement between two methods and reports the steeper", () => {
    const c: M.CrossCheckedSlope = {
      fromInertial: M.slope(M.inches(1), M.inches(12)),
      fromGeometry: M.slope(M.inches(1), M.inches(20)),
      provenance: "scanned",
    };
    expect(M.reported(c).run).toBe(M.inches(12));
    expect(M.disagrees(c)).toBe(true);
    expect(M.disagreementDegrees(c)).toBeGreaterThan(0);
  });

  it("refuses a zero run", () => {
    expect(() => M.slope(M.inches(1), 0n)).toThrow(RangeError);
  });
});

describe("Money", () => {
  const item = (cents: bigint): M.PriceItem =>
    ({ code: "X", description: "x", unit: "each", unitPrice: cents });

  it("rounds half up at the last cent, once", () => {
    expect(M.lineTotal({ item: item(1000n), quantityMilli: 1500n, provenance: "measured" }))
      .toBe(1500n);
    expect(M.lineTotal({ item: item(1n), quantityMilli: 500n, provenance: "measured" })).toBe(1n);
    expect(M.lineTotal({ item: item(1n), quantityMilli: 499n, provenance: "measured" })).toBe(0n);
  });

  it("does not drift across many lines", () => {
    const lines = Array.from({ length: 100 }, () =>
      ({ item: item(1999n), quantityMilli: 1333n, provenance: "measured" as const }));
    expect(M.lineTotal(lines[0]!)).toBe(2665n);
    expect(M.subtotal({ lines })).toBe(266_500n);
  });

  it("formats with thousands separators", () => {
    expect(M.formatMoney(266_500n)).toBe("$2,665.00");
    expect(M.formatMoney(5n)).toBe("$0.05");
    expect(M.formatMoney(-1234n)).toBe("-$12.34");
    expect(M.formatMoney(123_456_789n)).toBe("$1,234,567.89");
    expect(M.formatMoney(0n)).toBe("$0.00");
  });

  it("groups correctly either side of the first comma", () => {
    expect(M.formatMoney(99_999n)).toBe("$999.99");
    expect(M.formatMoney(100_000n)).toBe("$1,000.00");
    expect(M.formatMoney(100_099n)).toBe("$1,000.99");
    expect(M.formatMoney(50n)).toBe("$0.50");
    expect(M.formatMoney(-123_456_789n)).toBe("-$1,234,567.89");
  });

  /** The refusal every product here shares. */
  it("will not issue a quote resting on unverified numbers", () => {
    const sf = { code: "A", description: "a", unit: "sf" as const, unitPrice: 500n };
    expect(M.isQuoteIssuable({ lines: [{ item: sf, quantityMilli: 1000n, provenance: "scanned" }] }))
      .toBe(false);
    expect(M.isQuoteIssuable({ lines: [{ item: sf, quantityMilli: 1000n, provenance: "measured" }] }))
      .toBe(true);
    expect(M.isQuoteIssuable({ lines: [] })).toBe(false);
  });
});

describe("Provenance", () => {
  it("only measured and adjusted may be issued", () => {
    expect(M.isIssuable("measured")).toBe(true);
    expect(M.isIssuable("adjusted")).toBe(true);
    for (const p of ["scanned", "triangulated", "derived"] as M.Provenance[]) {
      expect(M.isIssuable(p)).toBe(false);
    }
  });

  it("is exactly the weaker of the two ends, in both orders", () => {
    const order: M.Provenance[] = ["derived", "scanned", "triangulated", "adjusted", "measured"];
    for (let i = 0; i < order.length; i++) {
      for (let j = 0; j < order.length; j++) {
        const expected = order[Math.min(i, j)]!;
        expect(M.combine(order[i]!, order[j]!)).toBe(expected);
        expect(M.combine(order[j]!, order[i]!)).toBe(expected);
      }
    }
  });

  it("a scanned end drags the pair to scanned, not to derived", () => {
    expect(M.combine("triangulated", "scanned")).toBe("scanned");
    expect(M.combine("measured", "scanned")).toBe("scanned");
    expect(M.combine("adjusted", "measured")).toBe("adjusted");
    expect(M.combine("derived", "scanned")).toBe("derived");
  });

  it("a typed measurement replaces the sensor value rather than averaging", () => {
    const v = M.override(M.provenanced(M.inches(36), "scanned", M.inches(0, 1, 4)),
                         M.inches(35));
    expect(v.value).toBe(35n * NM_IN);
    expect(v.provenance).toBe("measured");
    expect(v.tolerance).toBeUndefined();
  });
});

describe("Area", () => {
  it("round-trips whole square feet", () => {
    expect(M.squareFeet(200)).toBe(18_580_600n);
    expect(M.squareFeetValue(M.squareFeet(200))).toBeCloseTo(200, 9);
  });

  it("agrees with a product of two lengths", () => {
    expect(M.squareFeetValue(M.areaOf(M.feet(10), M.feet(20))))
      .toBeCloseTo(M.squareFeetValue(M.squareFeet(200)), 2);
  });

  it("formats for a takeoff", () => {
    expect(M.formattedSquareFeet(M.squareFeet(16.6639))).toBe("16.7 sq ft");
  });

  it("adds, subtracts and orders", () => {
    expect(M.squareFeetValue(M.squareFeet(10) + M.squareFeet(5))).toBeCloseTo(15, 9);
    expect(M.squareFeetValue(M.squareFeet(10) - M.squareFeet(4))).toBeCloseTo(6, 9);
    expect(M.squareFeet(1) < M.squareFeet(2)).toBe(true);
  });
});

describe("Surface", () => {
  const sample = (posIn: number, thou: number): M.SurfaceSample =>
    ({ position: M.inches(posIn), height: (BigInt(thou) * NM_IN) / 1000n });

  it("recovers a plane it was given", () => {
    const p = M.fitPlane([
      M.vec(0, 0, 0.5), M.vec(1, 0, 0.52), M.vec(0, 1, 0.49),
      M.vec(2, 3, 0.51), M.vec(5, 1, 0.59),
    ]);
    expect(p.a).toBeCloseTo(0.02, 9);
    expect(p.b).toBeCloseTo(-0.01, 9);
    expect(p.c).toBeCloseTo(0.5, 9);
  });

  it("refuses a degenerate cloud rather than inventing a plane", () => {
    expect(() => M.fitPlane([M.vec(0, 0, 0), M.vec(1, 1, 1)])).toThrow(M.PlaneFitError);
    expect(M.solve3x3([[1, 2, 3], [2, 4, 6], [3, 6, 9]], [1, 2, 3])).toBeNull();
  });

  it("reads zero on a flat floor", () => {
    const flat = [0, 12, 24, 36, 48, 60, 72].map((i) => sample(i, 0));
    expect(M.worstGapUnderStraightedge(flat, M.feet(6))).toBe(0n);
  });

  it("measures a hollow as the drop below the straightedge", () => {
    const dip = [sample(0, 0), sample(12, 0), sample(24, 0), sample(36, -125),
                 sample(48, 0), sample(60, 0), sample(72, 0)];
    expect(M.worstGapUnderStraightedge(dip, M.feet(6))).toBe(M.inches(0, 1, 8));
  });

  /** The intuitive wrong answer this test exists to rule out. */
  it("pivots on a hump rather than reading it as a dip", () => {
    const hump = [sample(0, 0), sample(12, 0), sample(24, 0), sample(36, 125),
                  sample(48, 0), sample(60, 0), sample(72, 0)];
    const gap = M.worstGapUnderStraightedge(hump, M.feet(6));
    expect(gap).toBe(2_116_667n);
    expect(gap).not.toBe(M.inches(0, 1, 8));
  });

  it("finds a dip only when the span bridges it", () => {
    const dip = [sample(0, 0), sample(24, -125), sample(48, 0)];
    expect(M.worstGapUnderStraightedge(dip, M.feet(6))).toBe(M.inches(0, 1, 8));
    expect(M.worstGapUnderStraightedge(dip, M.feet(1))).toBe(0n);
  });

  it("reports the deepest window, not the first", () => {
    const two = [sample(0, 0), sample(12, -63), sample(24, 0),
                 sample(36, 0), sample(48, -250), sample(60, 0)];
    expect(M.worstGapUnderStraightedge(two, M.feet(6))).toBe((250n * NM_IN) / 1000n);
  });

  it("a tilted but planar floor has no gap", () => {
    const tilted = [0, 12, 24, 36, 48, 60, 72].map((i) => sample(i, i * 10));
    expect(M.worstGapUnderStraightedge(tilted, M.feet(6))).toBe(0n);
  });
});

describe("Report renderer", () => {
  const minimal = (photos: M.Photo[] = []): M.Report => ({
    title: "T", subtitle: "S", facts: [["A", "B"]],
    notices: [{ kind: "warning", heading: "Careful.", body: "Read this." }],
    sections: [{ heading: "Sec", tables: [{ columns: ["C"], rows: [[M.mark("measured")]] }],
                 photos }],
    footer: "F",
  });

  /** The ten-year promise, tested rather than asserted. */
  it("fetches nothing at view time", () => {
    const html = M.render(minimal());
    expect(html).not.toContain("<script");
    expect(html).not.toContain("@import");
    expect(html).not.toContain("http://");
    expect(html).not.toContain("https://");
  });

  it("refuses a photo that is a URL", () => {
    expect(() => M.render(minimal([
      { caption: "remote", base64: "https://example.com/p.jpg", mimeType: "image/jpeg" },
    ]))).toThrow(M.ReportError);
  });

  it("refuses non-ASCII that merely looks alphanumeric", () => {
    expect(() => M.render(minimal([
      { caption: "c", base64: "०१२", mimeType: "image/png" },
    ]))).toThrow(M.ReportError);
  });

  it("escapes text without mangling the quotes in a measurement", () => {
    expect(M.escapeText(`<>&"'`)).toBe(`&lt;&gt;&amp;"'`);
    expect(M.escapeAttribute(`<>&"'`)).toBe("&lt;&gt;&amp;&quot;&#39;");
  });

  it("formats larger tolerances in feet and inches", () => {
    expect(M.formatTolerance(M.inches(25))).toBe(`2' 1"`);
    expect(M.formatTolerance(M.inches(0, 1, 32))).toBe('1/32"');
  });

  it("never rounds a tiny tolerance down to zero", () => {
    expect(M.formatTolerance(1n)).toBe('&lt; 1/32"');
    expect(M.formatTolerance(0n)).toBe('0"');
    expect(M.formatTolerance(M.inches(0, 1, 2))).toBe('1/2"');
    expect(M.formatTolerance(M.inches(0, 1, 32) - 1n)).toBe('&lt; 1/32"');
  });
});
