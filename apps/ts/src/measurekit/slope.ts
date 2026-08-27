/** Port of MeasureKit/Slope.swift. */

import { type Nanometres, abs } from "./units.js";
import type { Provenance } from "./provenance.js";

export interface Slope { readonly rise: Nanometres; readonly run: Nanometres }

export function slope(rise: Nanometres, run: Nanometres): Slope {
  if (run === 0n) throw new RangeError("a slope needs a non-zero run");
  return { rise, run };
}

/** For display only. Never compare with this. */
export const ratio = (s: Slope): number => Number(s.rise) / Number(s.run);
export const degrees = (s: Slope): number => (Math.atan(ratio(s)) * 180) / Math.PI;

/** `1:n`, rounded down so the printed figure never flatters the slope. */
export function formattedAsOneIn(s: Slope): string {
  const r = abs(s.rise);
  if (r === 0n) return "level";
  return `1:${abs(s.run) / r}`;
}

/**
 * Exact comparison against a `1:n` threshold, with no division.
 *
 * `rise/run > 1/n` becomes `rise*n > run`, which cannot be wrong by a rounding
 * step at the boundary.
 */
export function exceedsOneIn(s: Slope, n: bigint): boolean {
  if (n <= 0n) throw new RangeError("threshold must be positive");
  return abs(s.rise) * n > abs(s.run);
}

export const SLOPE_LIMIT = { ramp: 12n, cross: 48n, walkingSurface: 20n } as const;

/**
 * A slope read two ways, with the disagreement kept rather than averaged.
 *
 * Averaging hides an error; reporting the difference is what a survey read by an
 * expert witness has to do.
 */
export interface CrossCheckedSlope {
  readonly fromInertial: Slope;
  readonly fromGeometry: Slope;
  readonly provenance: Provenance;
}

/** The steeper of the two. Reporting the worse case is the conservative choice. */
export const reported = (c: CrossCheckedSlope): Slope =>
  Math.abs(ratio(c.fromInertial)) >= Math.abs(ratio(c.fromGeometry))
    ? c.fromInertial : c.fromGeometry;

export const disagreementDegrees = (c: CrossCheckedSlope): number =>
  Math.abs(degrees(c.fromInertial) - degrees(c.fromGeometry));

export const disagrees = (c: CrossCheckedSlope, toleranceDegrees = 0.5): boolean =>
  disagreementDegrees(c) > toleranceDegrees;
