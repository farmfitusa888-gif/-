/** Port of MeasureKit/Surface.swift. */

import { type Nanometres } from "./units.js";
import type { Vec3 } from "./vec.js";

export interface Plane { readonly a: number; readonly b: number; readonly c: number }

export const planeHeight = (p: Plane, x: number, y: number): number => p.a * x + p.b * y + p.c;
export const planeDeviation = (p: Plane, v: Vec3): number => v.z - planeHeight(p, v.x, v.y);

export class PlaneFitError extends Error {}

/** Gaussian elimination with partial pivoting. Null when singular. */
export function solve3x3(matrix: number[][], rhs: number[]): number[] | null {
  const m = matrix.map((r) => [...r]);
  const v = [...rhs];
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

/**
 * Least-squares plane minimising VERTICAL distance.
 *
 * A floor is a height field, and the question asked of it is always "how far
 * above or below", never "how far away".
 */
export function fitPlane(points: readonly Vec3[]): Plane {
  if (points.length < 3) throw new PlaneFitError("degenerate");
  let sx = 0, sy = 0, sz = 0, sxx = 0, sxy = 0, syy = 0, sxz = 0, syz = 0;
  for (const p of points) {
    sx += p.x; sy += p.y; sz += p.z;
    sxx += p.x * p.x; sxy += p.x * p.y; syy += p.y * p.y;
    sxz += p.x * p.z; syz += p.y * p.z;
  }
  const n = points.length;
  const s = solve3x3([[sxx, sxy, sx], [sxy, syy, sy], [sx, sy, n]], [sxz, syz, sz]);
  if (!s) throw new PlaneFitError("degenerate");
  return { a: s[0]!, b: s[1]!, c: s[2]! };
}

export interface SurfaceSample { readonly position: Nanometres; readonly height: Nanometres }

/**
 * Deepest drop below the upper convex hull of a window.
 *
 * A straightedge rests on the high points and bridges the hollows, so within any
 * window the reference is the upper hull, not the plane.
 */
export function deepestDropBelowHull(window: readonly SurfaceSample[]): Nanometres {
  const hull: SurfaceSample[] = [];
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

/**
 * The largest gap under a straightedge of `span`, anywhere along the line.
 *
 * This is the primitive the flooring tolerance is written in - "1/8 inch over 6
 * feet" - so the code matches the specification's own language.
 */
export function worstGapUnderStraightedge(
  samples: readonly SurfaceSample[], span: Nanometres,
): Nanometres {
  const sorted = [...samples].sort((a, b) => (a.position < b.position ? -1 : 1));
  if (sorted.length < 2 || span <= 0n) return 0n;
  let worst = 0n;
  for (let start = 0; start < sorted.length; start++) {
    const to = sorted[start]!.position + span;
    const window: SurfaceSample[] = [];
    for (let i = start; i < sorted.length && sorted[i]!.position <= to; i++) {
      window.push(sorted[i]!);
    }
    if (window.length < 2) continue;
    const gap = deepestDropBelowHull(window);
    if (gap > worst) worst = gap;
  }
  return worst;
}
