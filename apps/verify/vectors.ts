/**
 * Reference implementation of MeasureKit's numerical core.
 *
 * Swift cannot be compiled in this environment, so every expected value used in
 * the Swift XCTest suites is computed HERE, by a line-for-line port of the same
 * algorithms, and checked against hand-derived answers. The Swift tests then
 * carry verified numbers rather than invented ones.
 *
 * If the Swift and this file ever disagree, one of them is wrong - that is the
 * point of keeping them structurally identical.
 */

const NM_PER_INCH = 25_400_000n;
const NM_PER_FOOT = 304_800_000n;
const NM_PER_MICROMETRE = 1_000n;

export const inches = (n: number) => BigInt(n) * NM_PER_INCH;
export const feet = (n: number) => BigInt(n) * NM_PER_FOOT;
export const frac = (num: number, den: number) => (BigInt(num) * NM_PER_INCH) / BigInt(den);

export function isqrt(v: bigint): bigint {
  if (v < 0n) throw new RangeError("negative");
  if (v < 2n) return v;
  let x = v, y = (x + 1n) / 2n;
  while (y < x) { x = y; y = (x + v / x) / 2n; }
  return x;
}

/** Mirrors MeasureKit.distance - micrometre reduction before squaring. */
export function distance(a: bigint[], b: bigint[]): bigint {
  const d = a.map((v, i) => (v - b[i]!) / NM_PER_MICROMETRE);
  const sq = d.reduce((s, v) => s + v * v, 0n);
  return isqrt(sq) * NM_PER_MICROMETRE;
}

/** Mirrors Slope.exceedsOneIn - exact, no division. */
export const exceedsOneIn = (rise: bigint, run: bigint, n: bigint): boolean =>
  (rise < 0n ? -rise : rise) * n > (run < 0n ? -run : run);

/** Mirrors QuoteLine.total - half-up at the last cent, once. */
export const lineTotal = (unitCents: bigint, qtyMilli: bigint): bigint =>
  (unitCents * qtyMilli + 500n) / 1000n;

// ---------------------------------------------------------------- plane fit

export type Vec = { x: number; y: number; z: number };

export function solve3x3(mIn: number[][], vIn: number[]): number[] | null {
  const m = mIn.map((r) => [...r]);
  const v = [...vIn];
  for (let col = 0; col < 3; col++) {
    let pivot = col;
    for (let r = col + 1; r < 3; r++) {
      if (Math.abs(m[r]![col]!) > Math.abs(m[pivot]![col]!)) pivot = r;
    }
    if (Math.abs(m[pivot]![col]!) < 1e-12) return null;
    if (pivot !== col) {
      [m[pivot], m[col]] = [m[col]!, m[pivot]!];
      [v[pivot], v[col]] = [v[col]!, v[pivot]!];
    }
    for (let r = col + 1; r < 3; r++) {
      const f = m[r]![col]! / m[col]![col]!;
      if (f === 0) continue;
      for (let k = col; k < 3; k++) m[r]![k]! -= f * m[col]![k]!;
      v[r]! -= f * v[col]!;
    }
  }
  const out = [0, 0, 0];
  for (let r = 2; r >= 0; r--) {
    let acc = v[r]!;
    for (let k = r + 1; k < 3; k++) acc -= m[r]![k]! * out[k]!;
    out[r] = acc / m[r]![r]!;
  }
  return out;
}

export function fitPlane(points: Vec[]): { a: number; b: number; c: number } {
  if (points.length < 3) throw new Error("degenerate");
  let sx = 0, sy = 0, sz = 0, sxx = 0, sxy = 0, syy = 0, sxz = 0, syz = 0;
  for (const p of points) {
    sx += p.x; sy += p.y; sz += p.z;
    sxx += p.x * p.x; sxy += p.x * p.y; syy += p.y * p.y;
    sxz += p.x * p.z; syz += p.y * p.z;
  }
  const n = points.length;
  const s = solve3x3([[sxx, sxy, sx], [sxy, syy, sy], [sx, sy, n]], [sxz, syz, sz]);
  if (!s) throw new Error("degenerate");
  return { a: s[0]!, b: s[1]!, c: s[2]! };
}

// ------------------------------------------------------------- straightedge

export interface Sample { position: bigint; height: bigint }

/** Mirrors deepestDropBelowHull. */
export function deepestDropBelowHull(window: Sample[]): bigint {
  const hull: Sample[] = [];
  for (const p of window) {
    while (hull.length >= 2) {
      const a = hull[hull.length - 2]!, b = hull[hull.length - 1]!;
      const lhs = (b.position - a.position) * (p.height - a.height);
      const rhs = (p.position - a.position) * (b.height - a.height);
      if (lhs >= rhs) hull.pop(); else break;
    }
    hull.push(p);
  }
  let deepest = 0n;
  let segment = 0;
  for (const p of window) {
    while (segment + 1 < hull.length - 1 && hull[segment + 1]!.position < p.position) segment++;
    if (hull.length < 2) break;
    const a = hull[segment]!, b = hull[Math.min(segment + 1, hull.length - 1)]!;
    const run = b.position - a.position;
    const hullHeight = run === 0n
      ? (a.height > b.height ? a.height : b.height)
      : a.height + ((b.height - a.height) * (p.position - a.position)) / run;
    const drop = hullHeight - p.height;
    if (drop > deepest) deepest = drop;
  }
  return deepest;
}

/** Mirrors worstGapUnderStraightedge. */
export function worstGapUnderStraightedge(samples: Sample[], span: bigint): bigint {
  const sorted = [...samples].sort((a, b) => (a.position < b.position ? -1 : 1));
  if (sorted.length < 2 || span <= 0n) return 0n;
  let worst = 0n;
  for (let start = 0; start < sorted.length; start++) {
    const to = sorted[start]!.position + span;
    const window: Sample[] = [];
    for (let i = start; i < sorted.length && sorted[i]!.position <= to; i++) window.push(sorted[i]!);
    if (window.length < 2) continue;
    const gap = deepestDropBelowHull(window);
    if (gap > worst) worst = gap;
  }
  return worst;
}
