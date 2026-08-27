/** Port of MeasureKit/Triangulate.swift. */

import { type Ray, type Tap, rayThroughTap } from "./camera.js";
import { type Nanometres, sensorMetres } from "./units.js";
import { type Vec3, add, cross, dot, length, scale, sub } from "./vec.js";

export interface Triangulation {
  readonly point: Vec3;
  /** How far apart the rays were at closest approach, in metres. The error. */
  readonly missDistance: number;
  readonly depths: readonly [number, number];
  readonly isDegenerate: boolean;
}

export const missLength = (t: Triangulation): Nanometres =>
  Number.isFinite(t.missDistance) ? sensorMetres(t.missDistance) : 0n;

/** Half a degree: below this a one-pixel tap error swamps the depth. */
const MIN_SIN_ANGLE = Math.sin((0.5 * Math.PI) / 180);

const degenerate = (p: Vec3): Triangulation => ({
  point: p, missDistance: Number.POSITIVE_INFINITY,
  depths: [NaN, NaN], isDegenerate: true,
});

export function triangulateRays(a: Ray, b: Ray): Triangulation {
  const da = a.direction, db = b.direction;
  if (length(cross(da, db)) < MIN_SIN_ANGLE) return degenerate(a.origin);

  const w0 = sub(a.origin, b.origin);
  const bDot = dot(da, db);
  const d = dot(da, w0);
  const e = dot(db, w0);
  const denom = 1 - bDot * bDot;      // da·da = db·db = 1

  const s = (bDot * e - d) / denom;
  const t = (e - bDot * d) / denom;
  const pa = add(a.origin, scale(da, s));
  const pb = add(b.origin, scale(db, t));

  return {
    point: scale(add(pa, pb), 0.5),
    missDistance: length(sub(pa, pb)),
    depths: [s, t],
    isDegenerate: false,
  };
}

export const triangulateTaps = (a: Tap, b: Tap): Triangulation =>
  triangulateRays(rayThroughTap(a), rayThroughTap(b));

/**
 * Take the pair that agreed best.
 *
 * Averaging every pair lets one bad tap drag the answer; taking the best pair
 * and reporting its miss keeps the number defensible.
 */
export function triangulateBestPair(taps: readonly Tap[]): {
  readonly result: Triangulation; readonly pairsConsidered: number;
} {
  if (taps.length < 2) {
    throw new RangeError(`need at least two taps to triangulate, got ${taps.length}`);
  }
  let best: Triangulation | undefined;
  let pairsConsidered = 0;
  for (let i = 0; i < taps.length; i++) {
    for (let j = i + 1; j < taps.length; j++) {
      const a = taps[i]!, b = taps[j]!;
      pairsConsidered++;
      const candidate = triangulateTaps(a, b);
      if (candidate.isDegenerate) continue;
      if (!best || candidate.missDistance < best.missDistance) best = candidate;
    }
  }
  return {
    result: best ?? degenerate(rayThroughTap(taps[0]!).origin),
    pairsConsidered,
  };
}
