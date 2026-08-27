/** Port of MeasureKit/Geometry.swift exact half. */

import { type Nanometres, NM_PER_MICROMETRE, isqrt, sensorMetres, fitsInInt64 } from "./units.js";
import type { Vec3 } from "./vec.js";

export interface Point3 { readonly x: Nanometres; readonly y: Nanometres; readonly z: Nanometres }

export const ORIGIN: Point3 = { x: 0n, y: 0n, z: 0n };

export const pointFromMetres = (v: Vec3): Point3 => ({
  x: sensorMetres(v.x), y: sensorMetres(v.y), z: sensorMetres(v.z),
});

/**
 * Exact distance, mirroring the Swift's micrometre reduction.
 *
 * Nanometres squared overflows Int64 at room scale; micrometres leave headroom
 * to about 3,000 km. `assertNoOverflow` proves the Swift stays inside Int64,
 * which is the one thing bigint would otherwise hide.
 */
export function distance(a: Point3, b: Point3): Nanometres {
  const dx = (a.x - b.x) / NM_PER_MICROMETRE;
  const dy = (a.y - b.y) / NM_PER_MICROMETRE;
  const dz = (a.z - b.z) / NM_PER_MICROMETRE;
  const squared = dx * dx + dy * dy + dz * dz;
  if (!fitsInInt64(squared)) {
    throw new RangeError(
      `sum of squares ${squared} exceeds Int64 - the Swift would overflow here`);
  }
  return isqrt(squared) * NM_PER_MICROMETRE;
}
