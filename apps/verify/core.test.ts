import { describe, expect, it } from "vitest";
import {
  areaOf, bags, carryList, combine, feet, formatLength, formatMoney, formatTolerance,
  frac, inches, isBarrier, isDueNow, isIssuable, isOverdue, meanDepth, monthsUntilDue,
  shoelaceArea, squareFeet, squareFeetValue, upcoming, writeDXF,
  type Provenance, type Due,
} from "./core.js";

describe("money formatting, hand-rolled without a locale formatter", () => {
  it("groups thousands correctly", () => {
    expect(formatMoney(266_500n)).toBe("$2,665.00");
    expect(formatMoney(123_456_789n)).toBe("$1,234,567.89");
    expect(formatMoney(100_000n)).toBe("$1,000.00");
  });

  it("pads the cents and handles small values", () => {
    expect(formatMoney(5n)).toBe("$0.05");
    expect(formatMoney(50n)).toBe("$0.50");
    expect(formatMoney(0n)).toBe("$0.00");
    expect(formatMoney(999n)).toBe("$9.99");
  });

  it("puts the sign outside the dollar mark", () => {
    expect(formatMoney(-1234n)).toBe("-$12.34");
    expect(formatMoney(-123_456_789n)).toBe("-$1,234,567.89");
  });

  it("does not group a value that needs no grouping", () => {
    expect(formatMoney(99_999n)).toBe("$999.99");
    expect(formatMoney(100_099n)).toBe("$1,000.99");
  });
});

describe("area", () => {
  it("round-trips whole square feet", () => {
    expect(squareFeet(200)).toBe(18_580_600n);
    expect(squareFeetValue(squareFeet(200))).toBeCloseTo(200, 9);
    expect(squareFeetValue(squareFeet(1000))).toBeCloseTo(1000, 9);
  });

  it("agrees with a product of two lengths to within a rounding step", () => {
    // 10 ft x 20 ft = 200 sq ft, via millimetre truncation on each side.
    expect(squareFeetValue(areaOf(feet(10), feet(20))))
      .toBeCloseTo(squareFeetValue(squareFeet(200)), 2);
  });
});

describe("the shoelace area of a template", () => {
  const p = (xIn: number, yIn: number) => ({ x: inches(xIn), y: inches(yIn) });

  it("measures a 96 x 25 inch run", () => {
    const edges = [
      { from: p(0, 0), to: p(96, 0) }, { from: p(96, 0), to: p(96, 25) },
      { from: p(96, 25), to: p(0, 25) }, { from: p(0, 25), to: p(0, 0) },
    ];
    // 2400 sq in = 16.667 sq ft; millimetre truncation costs about 0.003.
    expect(squareFeetValue(shoelaceArea(edges))).toBeCloseTo(2400 / 144, 2);
  });

  it("is unsigned, so winding direction does not matter", () => {
    const cw = [
      { from: p(0, 0), to: p(10, 0) }, { from: p(10, 0), to: p(10, 10) },
      { from: p(10, 10), to: p(0, 10) }, { from: p(0, 10), to: p(0, 0) },
    ];
    const ccw = [...cw].reverse().map((e) => ({ from: e.to, to: e.from }));
    expect(shoelaceArea(cw)).toBe(shoelaceArea(ccw));
    expect(shoelaceArea(cw)).toBeGreaterThan(0n);
  });

  it("returns zero for anything that is not a polygon", () => {
    expect(shoelaceArea([])).toBe(0n);
    expect(shoelaceArea([{ from: p(0, 0), to: p(1, 0) }])).toBe(0n);
  });
});

describe("the DXF writer's structure", () => {
  const p = (xIn: number, yIn: number) => ({ x: inches(xIn), y: inches(yIn) });
  const edges = [
    { id: "back", from: p(0, 0), to: p(96, 0), isCut: false, provenance: "scanned" as Provenance },
    { id: "right", from: p(96, 0), to: p(96, 25), isCut: true, provenance: "measured" as Provenance },
    { id: "front", from: p(96, 25), to: p(0, 25), isCut: true, provenance: "measured" as Provenance },
    { id: "left", from: p(0, 25), to: p(0, 0), isCut: true, provenance: "measured" as Provenance },
  ];

  /// The bug that would have cut every slab 25.4x too small.
  it("declares inches, and the assertion the Swift test makes holds", () => {
    const dxf = writeDXF(edges, 1);
    expect(dxf).toContain("$INSUNITS");
    const after = dxf.split("$INSUNITS")[1]!;
    expect(after.startsWith("\n70\n1\n")).toBe(true);
    // What the wrong value would have looked like. Note the third argument -
    // writeDXF(edges, 4) sets CUTOUTS to 4 and leaves units alone, which is how
    // this assertion first passed by accident.
    const wrong = writeDXF(edges, 1, 4);
    expect(wrong.split("$INSUNITS")[1]!.startsWith("\n70\n4\n")).toBe(true);
    expect(wrong.split("$INSUNITS")[1]!.startsWith("\n70\n1\n")).toBe(false);
  });

  it("writes one LINE per edge and one polyline per cut-out", () => {
    const dxf = writeDXF(edges, 1);
    expect(dxf.split("\nLINE\n").length - 1).toBe(4);
    expect(dxf.split("LWPOLYLINE").length - 1).toBe(1);
  });

  it("ends with EOF and carries the sections a reader expects", () => {
    const dxf = writeDXF(edges, 1);
    expect(dxf.endsWith("0\nEOF\n")).toBe(true);
    expect(dxf).toContain("ENTITIES");
    expect(dxf).toContain("CUT_MEASURED");
    expect(dxf).toContain("REFERENCE");
  });

  it("writes coordinates in inches, not millimetres", () => {
    const dxf = writeDXF(edges, 1);
    expect(dxf).toContain("96.000000");
    expect(dxf).not.toContain("2438.4");
  });
});

describe("the inspection schedule", () => {
  const due = (deviceID: string, frequencyMonths: number, monthsSinceLast: number): Due =>
    ({ deviceID, frequencyMonths, monthsSinceLast });

  it("computes what is due, and due today is not yet overdue", () => {
    expect(monthsUntilDue(due("a", 12, 11))).toBe(1);
    expect(isDueNow(due("a", 12, 11))).toBe(false);
    expect(isDueNow(due("a", 12, 12))).toBe(true);
    expect(isOverdue(due("a", 12, 12))).toBe(false);
    expect(isOverdue(due("a", 12, 13))).toBe(true);
  });

  it("orders overdue first, then soonest", () => {
    const items = [due("c", 3, 1), due("a", 12, 18), due("b", 12, 12)];
    expect(upcoming(items, 6).map((i) => i.deviceID)).toEqual(["a", "b", "c"]);
  });

  it("breaks ties by device so the order is stable", () => {
    const items = [due("z", 12, 12), due("a", 12, 12), due("m", 12, 12)];
    expect(upcoming(items, 6).map((i) => i.deviceID)).toEqual(["a", "m", "z"]);
  });

  it("excludes what is beyond the window", () => {
    expect(upcoming([due("a", 60, 1), due("b", 3, 1)], 6).map((i) => i.deviceID))
      .toEqual(["b"]);
  });
});

describe("the accessibility evaluator, at its boundaries", () => {
  it("a minimum is exact to the nanometre", () => {
    const doorway = { kind: "minimum", value: inches(32) } as const;
    expect(isBarrier(doorway, inches(32))).toBe(false);
    expect(isBarrier(doorway, inches(32) - 1n)).toBe(true);
    expect(isBarrier(doorway, inches(36))).toBe(false);
  });

  it("a maximum is exact to the nanometre", () => {
    const reach = { kind: "maximum", value: inches(48) } as const;
    expect(isBarrier(reach, inches(48))).toBe(false);
    expect(isBarrier(reach, inches(48) + 1n)).toBe(true);
  });

  it("a range is inclusive at both ends", () => {
    const grabBar = { kind: "range", min: inches(33), max: inches(36) } as const;
    expect(isBarrier(grabBar, inches(33))).toBe(false);
    expect(isBarrier(grabBar, inches(36))).toBe(false);
    expect(isBarrier(grabBar, inches(33) - 1n)).toBe(true);
    expect(isBarrier(grabBar, inches(36) + 1n)).toBe(true);
  });
});

describe("leveller quantities", () => {
  it("mean depth is half the gap, because a hollow is a wedge", () => {
    expect(meanDepth([frac(1, 4), frac(1, 2)])).toBe(frac(3, 16));
    expect(meanDepth([])).toBe(0n);
  });

  it("rounds bags up, because arriving short stops the job", () => {
    // 200 sq ft at 1/4 in, 40 sq ft per bag at 1 in => 1.25 bags, +10% => 2.
    expect(bags(squareFeet(200), frac(1, 4), 40)).toBe(2);
  });

  it("scales with depth", () => {
    expect(bags(squareFeet(1000), frac(1, 8), 40, 0)).toBe(4);
    expect(bags(squareFeet(1000), frac(1, 4), 40, 0)).toBe(7);
  });

  it("returns zero rather than dividing by zero", () => {
    expect(bags(0n, inches(1), 40)).toBe(0);
    expect(bags(squareFeet(100), 0n, 40)).toBe(0);
    expect(bags(squareFeet(100), inches(1), 0)).toBe(0);
  });
});

describe("the provenance lattice", () => {
  it("only a pair of tape measurements stays measured", () => {
    expect(combine("measured", "measured")).toBe("measured");
    expect(combine("measured", "triangulated")).toBe("triangulated");
  });

  it("never upgrades an inferred end", () => {
    expect(combine("measured", "derived")).toBe("derived");
    expect(combine("triangulated", "derived")).toBe("derived");
    expect(combine("derived", "derived")).toBe("derived");
  });

  it("a raw scan drags the pair down to scanned, not to derived", () => {
    // The old ladder answered "derived" here, which claimed nothing had seen a
    // point a sensor had. A scanned end is unverified, not unseen.
    expect(combine("triangulated", "scanned")).toBe("scanned");
    expect(combine("measured", "scanned")).toBe("scanned");
    expect(combine("adjusted", "scanned")).toBe("scanned");
  });

  it("is exactly the weaker of the two ends", () => {
    const order: Provenance[] = ["derived", "scanned", "triangulated", "adjusted", "measured"];
    for (let i = 0; i < order.length; i++) {
      for (let j = 0; j < order.length; j++) {
        expect(combine(order[i]!, order[j]!)).toBe(order[Math.min(i, j)]!);
      }
    }
  });

  it("only measured and adjusted may be issued", () => {
    expect(isIssuable("measured")).toBe(true);
    expect(isIssuable("adjusted")).toBe(true);
    for (const p of ["scanned", "triangulated", "derived"] as Provenance[]) {
      expect(isIssuable(p)).toBe(false);
    }
  });

  it("is commutative, so the order of two ends never changes the answer", () => {
    const all: Provenance[] = ["scanned", "triangulated", "measured", "derived", "adjusted"];
    for (const a of all) for (const b of all) {
      expect(combine(a, b)).toBe(combine(b, a));
    }
  });
});

describe("carry-list ranking", () => {
  it("puts the largest first", () => {
    expect(carryList([
      { id: "a", size: frac(1, 16) },
      { id: "b", size: frac(1, 4) },
      { id: "c", size: frac(1, 8) },
    ], 6)).toEqual(["b", "c", "a"]);
  });

  it("breaks ties by id so the list never reorders between runs", () => {
    const items = [
      { id: "right", size: inches(25) },
      { id: "front", size: inches(96) },
      { id: "left", size: inches(25) },
    ];
    expect(carryList(items, 6)).toEqual(["front", "left", "right"]);
    expect(carryList(items, 6)).toEqual(carryList([...items].reverse(), 6));
  });

  it("honours the limit", () => {
    const items = Array.from({ length: 10 }, (_, i) => ({ id: `e${i}`, size: BigInt(i) }));
    expect(carryList(items, 4)).toHaveLength(4);
  });
});

describe("tolerance formatting", () => {
  it("never rounds a real disagreement down to zero", () => {
    expect(formatTolerance(1n)).toBe('&lt; 1/32"');
    expect(formatTolerance(0n)).toBe('0"');
    expect(formatTolerance(frac(1, 2))).toBe('1/2"');
    expect(formatTolerance(frac(1, 32))).toBe('1/32"');
    // Just under a 32nd is a bound, not a zero.
    expect(formatTolerance(frac(1, 32) - 1n)).toBe('&lt; 1/32"');
  });

  it("formats larger tolerances in feet and inches", () => {
    expect(formatTolerance(inches(25))).toBe(`2' 1"`);
  });
});

describe("length formatting at 32nds, used by every tolerance", () => {
  it("reduces fractions", () => {
    expect(formatLength(frac(16, 32), 32)).toBe('1/2"');
    expect(formatLength(frac(8, 32), 32)).toBe('1/4"');
    expect(formatLength(frac(3, 32), 32)).toBe('3/32"');
  });

  it("agrees with the 16ths formatter where both are exact", () => {
    for (const n of [0, 1, 2, 4, 8, 12, 15]) {
      expect(formatLength(frac(n, 16), 32)).toBe(formatLength(frac(n, 16), 16));
    }
  });
});
