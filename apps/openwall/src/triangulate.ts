/**
 * Two taps on two photographs become one point in space - and one honest number
 * saying how much the two taps disagreed.
 *
 * That disagreement is the whole trust model. Two rays cast from two camera
 * positions through the same pipe should intersect. Real ones never quite do.
 * The distance between them at their closest approach is the error, and it is
 * reported rather than hidden, because somebody is going to cut into a wall
 * using this.
 */

import { type Ray, type Tap, rayThroughTap } from "./camera.js";
import { type Vec3, add, cross, dot, length, scale, sub } from "./vec.js";

export interface Triangulation {
  /** Midpoint of the segment joining the two closest points. */
  readonly point: Vec3;
  /** How far apart the rays were at closest approach, in metres. The error. */
  readonly missDistance: number;
  /** Distance from each camera to its closest point. Negative means behind. */
  readonly depths: readonly [number, number];
  /** True when the rays are too near parallel to intersect meaningfully. */
  readonly degenerate: boolean;
}

/**
 * Rays nearer than this to parallel carry no usable depth: a small angular error
 * moves the solution arbitrarily far along the line. Half a degree is roughly
 * where a one-pixel tap error on a phone camera swamps the result.
 */
const MIN_SIN_ANGLE = Math.sin((0.5 * Math.PI) / 180);

const DEGENERATE = (point: Vec3): Triangulation => ({
  point,
  missDistance: Number.POSITIVE_INFINITY,
  depths: [Number.NaN, Number.NaN],
  degenerate: true,
});

export function triangulateRays(a: Ray, b: Ray): Triangulation {
  const da = a.direction;
  const db = b.direction;

  // Both directions are unit length, so |da x db| is the sine of the angle.
  if (length(cross(da, db)) < MIN_SIN_ANGLE) return DEGENERATE(a.origin);

  const w0 = sub(a.origin, b.origin);
  const bDot = dot(da, db);
  const d = dot(da, w0);
  const e = dot(db, w0);
  const denom = 1 - bDot * bDot; // dot(da,da) = dot(db,db) = 1

  const s = (bDot * e - d) / denom;
  const t = (e - bDot * d) / denom;

  const pa = add(a.origin, scale(da, s));
  const pb = add(b.origin, scale(db, t));

  return {
    point: scale(add(pa, pb), 0.5),
    missDistance: length(sub(pa, pb)),
    depths: [s, t],
    degenerate: false,
  };
}

export const triangulateTaps = (a: Tap, b: Tap): Triangulation =>
  triangulateRays(rayThroughTap(a), rayThroughTap(b));

export interface BestPair extends Triangulation {
  readonly pairsConsidered: number;
}

/**
 * Fold in a third or fourth tap by taking the pair that agreed best.
 *
 * Averaging every pair would let one bad tap quietly drag the answer; taking the
 * best pair and reporting its miss keeps the number defensible. The number of
 * pairs considered is returned so the record can say how hard it looked.
 */
export function triangulateBestPair(taps: readonly Tap[]): BestPair {
  if (taps.length < 2) {
    throw new RangeError(`need at least two taps to triangulate, got ${taps.length}`);
  }
  let best: Triangulation | undefined;
  let pairsConsidered = 0;
  for (let i = 0; i < taps.length; i++) {
    for (let j = i + 1; j < taps.length; j++) {
      const a = taps[i];
      const b = taps[j];
      if (!a || !b) continue;
      pairsConsidered++;
      const candidate = triangulateTaps(a, b);
      if (candidate.degenerate) continue;
      if (!best || candidate.missDistance < best.missDistance) best = candidate;
    }
  }
  const first = taps[0];
  return best
    ? { ...best, pairsConsidered }
    : { ...DEGENERATE(rayThroughTap(first!).origin), pairsConsidered };
}
