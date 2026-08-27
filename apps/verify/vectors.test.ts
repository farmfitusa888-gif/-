import { describe, expect, it } from "vitest";
import {
  deepestDropBelowHull, distance, exceedsOneIn, feet, fitPlane, frac,
  inches, isqrt, lineTotal, solve3x3, worstGapUnderStraightedge, type Sample,
} from "./vectors.js";

const sample = (posInches: number, heightThou: number): Sample => ({
  position: inches(posInches),
  // heightThou is thousandths of an inch, the unit a floor is argued in.
  height: (BigInt(heightThou) * inches(1)) / 1000n,
});

describe("distance, as MeasureKit computes it", () => {
  it("gets a 3-4-5 triangle exactly right", () => {
    expect(distance([feet(3), feet(4), 0n], [0n, 0n, 0n])).toBe(feet(5));
  });

  it("holds precision to a micrometre, which is 800x finer than 1/32 inch", () => {
    const oneMicrometre = 1_000n;
    expect(distance([oneMicrometre, 0n, 0n], [0n, 0n, 0n])).toBe(oneMicrometre);
    // 1/32" is 793,750 nm - the micrometre reduction is far below the printed
    // resolution of any of these products.
    expect(frac(1, 32)).toBe(793_750n);
  });

  it("does not overflow at room scale", () => {
    // 10 m in micrometres is 1e7; squared is 1e14, well inside Int64.
    const tenMetres = 10_000_000_000n;
    expect(distance([tenMetres, tenMetres, tenMetres], [0n, 0n, 0n]))
      .toBe(17_320_508_000n); // 10*sqrt(3) m, to the micrometre
  });
});

describe("integer square root", () => {
  it("floors and never rounds up", () => {
    expect(isqrt(143n)).toBe(11n);
    expect(isqrt(144n)).toBe(12n);
    expect(isqrt(10n ** 14n)).toBe(10n ** 7n);
  });
});

describe("slope thresholds, compared without dividing", () => {
  it("is exact at the 1:12 boundary", () => {
    expect(exceedsOneIn(inches(1), inches(12), 12n)).toBe(false); // exactly 1:12 passes
    expect(exceedsOneIn(inches(1) + 1n, inches(12), 12n)).toBe(true); // one nanometre over fails
  });

  it("is exact at the 1:48 cross-slope boundary", () => {
    expect(exceedsOneIn(inches(1), inches(48), 48n)).toBe(false);
    expect(exceedsOneIn(inches(1) + 1n, inches(48), 48n)).toBe(true);
  });

  it("treats a fall the same as a rise", () => {
    expect(exceedsOneIn(-inches(2), inches(12), 12n)).toBe(true);
  });

  it("catches a real ramp that is just too steep", () => {
    // 30 ft run, 31 in rise. 1:12 allows 30 in.
    expect(exceedsOneIn(inches(31), feet(30), 12n)).toBe(true);
    expect(exceedsOneIn(inches(30), feet(30), 12n)).toBe(false);
  });
});

describe("money rounding", () => {
  it("rounds half up at the last cent, once", () => {
    expect(lineTotal(1000n, 1500n)).toBe(1500n);   // $10.00 x 1.5 = $15.00
    expect(lineTotal(333n, 1000n)).toBe(333n);
    expect(lineTotal(1n, 500n)).toBe(1n);          // 0.5c rounds up to 1c
    expect(lineTotal(1n, 499n)).toBe(0n);
  });

  it("does not drift across many lines", () => {
    const lines = Array.from({ length: 100 }, () => lineTotal(1999n, 1333n));
    expect(lines[0]).toBe(2665n);
    expect(lines.reduce((a, b) => a + b, 0n)).toBe(266_500n);
  });
});

describe("plane fitting", () => {
  it("recovers a plane it was given exactly", () => {
    // z = 0.02x - 0.01y + 0.5
    const pts = [
      { x: 0, y: 0, z: 0.5 }, { x: 1, y: 0, z: 0.52 }, { x: 0, y: 1, z: 0.49 },
      { x: 2, y: 3, z: 0.5 + 0.04 - 0.03 }, { x: 5, y: 1, z: 0.5 + 0.1 - 0.01 },
    ];
    const p = fitPlane(pts);
    expect(p.a).toBeCloseTo(0.02, 12);
    expect(p.b).toBeCloseTo(-0.01, 12);
    expect(p.c).toBeCloseTo(0.5, 12);
  });

  it("returns the level plane for a level floor", () => {
    const pts = [
      { x: 0, y: 0, z: 0 }, { x: 3, y: 0, z: 0 },
      { x: 0, y: 3, z: 0 }, { x: 3, y: 3, z: 0 },
    ];
    const p = fitPlane(pts);
    expect(p.a).toBeCloseTo(0, 12);
    expect(p.b).toBeCloseTo(0, 12);
    expect(p.c).toBeCloseTo(0, 12);
  });

  it("refuses a singular system rather than inventing a plane", () => {
    // All points on one line in plan - no unique plane.
    expect(solve3x3([[1, 2, 3], [2, 4, 6], [3, 6, 9]], [1, 2, 3])).toBeNull();
  });
});

describe("the straightedge, which is what the tolerance is written in", () => {
  it("reads zero on a flat floor", () => {
    const flat = [0, 12, 24, 36, 48, 60, 72].map((i) => sample(i, 0));
    expect(worstGapUnderStraightedge(flat, feet(6))).toBe(0n);
  });

  it("measures a hollow as the drop below the straightedge, not below the plane", () => {
    // Flat, with a single 1/8 in (125 thou) dip in the middle.
    const dip = [
      sample(0, 0), sample(12, 0), sample(24, 0),
      sample(36, -125),
      sample(48, 0), sample(60, 0), sample(72, 0),
    ];
    const gap = worstGapUnderStraightedge(dip, feet(6));
    expect(gap).toBe(frac(1, 8));
  });

  it("pivots on a hump rather than reading it as a dip", () => {
    const hump = [
      sample(0, 0), sample(12, 0), sample(24, 0),
      sample(36, 125),                       // 1/8 in high spot, mid-span
      sample(48, 0), sample(60, 0), sample(72, 0),
    ];
    // A straightedge rests ON the hump and see-saws. The hull is
    // (0,0) -> (36,125) -> (72,0), so the deepest gap is NOT the hump's full
    // height: it is at the quarter points, 24 in from the peak along a 36 in
    // half-span, i.e. 125 x 24/36 = 83.33 thousandths.
    //
    // Hand-check in nanometres, the way the integer code does it:
    //   peak            = 125/1000 x 25,400,000            = 3,175,000
    //   drop at x = 48  = 3,175,000 - 3,175,000 x 12/36    = 2,116,667
    // (integer division truncates toward zero, in Swift and here alike)
    expect(worstGapUnderStraightedge(hump, feet(6))).toBe(2_116_667n);

    // And it is emphatically NOT the hump height, which is the intuitive
    // wrong answer this test exists to rule out.
    expect(worstGapUnderStraightedge(hump, feet(6))).not.toBe(frac(1, 8));
  });

  it("finds a dip only when the span is long enough to bridge it", () => {
    const dip = [sample(0, 0), sample(24, -125), sample(48, 0)];
    // A 6 ft edge spans it and sees the full 1/8 in.
    expect(worstGapUnderStraightedge(dip, feet(6))).toBe(frac(1, 8));
    // A 1 ft edge never bridges two samples 24 in apart, so it reads nothing.
    expect(worstGapUnderStraightedge(dip, feet(1))).toBe(0n);
  });

  it("reports the deepest window, not the first", () => {
    const two = [
      sample(0, 0), sample(12, -63), sample(24, 0),
      sample(36, 0), sample(48, -250), sample(60, 0),
    ];
    // The 250-thou dip wins over the 63-thou one.
    expect(worstGapUnderStraightedge(two, feet(6))).toBe((250n * inches(1)) / 1000n);
  });

  it("computes the hull drop for a simple wedge by hand-checkable arithmetic", () => {
    const window = [sample(0, 0), sample(6, -100), sample(12, 0)];
    // Hull is the straight line from 0 to 12 at height 0; the middle sits 100
    // thousandths below it.
    expect(deepestDropBelowHull(window)).toBe((100n * inches(1)) / 1000n);
  });

  it("handles a tilted floor: the straightedge follows the tilt", () => {
    // A perfectly planar 1:100 slope has no gap under any straightedge.
    const tilted = [0, 12, 24, 36, 48, 60, 72].map((i) => sample(i, i * 10));
    expect(worstGapUnderStraightedge(tilted, feet(6))).toBe(0n);
  });
});
