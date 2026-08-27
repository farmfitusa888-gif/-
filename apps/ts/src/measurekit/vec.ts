/** Port of MeasureKit/Geometry.swift float half. Nothing here is ever stored. */

export interface Vec3 { readonly x: number; readonly y: number; readonly z: number }

export const vec = (x: number, y: number, z: number): Vec3 => ({ x, y, z });
export const ZERO: Vec3 = vec(0, 0, 0);

export const add = (a: Vec3, b: Vec3): Vec3 => vec(a.x + b.x, a.y + b.y, a.z + b.z);
export const sub = (a: Vec3, b: Vec3): Vec3 => vec(a.x - b.x, a.y - b.y, a.z - b.z);
export const scale = (a: Vec3, k: number): Vec3 => vec(a.x * k, a.y * k, a.z * k);
export const dot = (a: Vec3, b: Vec3): number => a.x * b.x + a.y * b.y + a.z * b.z;
export const cross = (a: Vec3, b: Vec3): Vec3 =>
  vec(a.y * b.z - a.z * b.y, a.z * b.x - a.x * b.z, a.x * b.y - a.y * b.x);
export const length = (a: Vec3): number => Math.sqrt(dot(a, a));

export function normalise(a: Vec3): Vec3 {
  const l = length(a);
  if (l === 0) throw new RangeError("cannot normalise a zero-length vector");
  return scale(a, 1 / l);
}

/** Column-major, matching ARKit's simd_float4x4. */
export type Transform = readonly number[];

export const IDENTITY: Transform = [1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1];

function column(m: Transform, i: number): Vec3 {
  const x = m[i * 4], y = m[i * 4 + 1], z = m[i * 4 + 2];
  if (x === undefined || y === undefined || z === undefined) {
    throw new RangeError(`a transform has 16 elements, got ${m.length}`);
  }
  return vec(x, y, z);
}

export const translation = (m: Transform): Vec3 => column(m, 3);

export const direction = (m: Transform, v: Vec3): Vec3 =>
  add(add(scale(column(m, 0), v.x), scale(column(m, 1), v.y)), scale(column(m, 2), v.z));

export const point = (m: Transform, v: Vec3): Vec3 => add(direction(m, v), translation(m));

/** Rigid inverse: the rotation inverts by transpose. */
export function invertRigid(m: Transform): Transform {
  const c0 = column(m, 0), c1 = column(m, 1), c2 = column(m, 2), t = translation(m);
  return [
    c0.x, c1.x, c2.x, 0,
    c0.y, c1.y, c2.y, 0,
    c0.z, c1.z, c2.z, 0,
    -dot(c0, t), -dot(c1, t), -dot(c2, t), 1,
  ];
}

/** ARKit convention: -Z forward, +Y up. */
export function lookAt(eye: Vec3, target: Vec3, up: Vec3 = vec(0, 1, 0)): Transform {
  const zAxis = normalise(sub(eye, target));
  const xAxis = normalise(cross(up, zAxis));
  const yAxis = cross(zAxis, xAxis);
  return [
    xAxis.x, xAxis.y, xAxis.z, 0,
    yAxis.x, yAxis.y, yAxis.z, 0,
    zAxis.x, zAxis.y, zAxis.z, 0,
    eye.x, eye.y, eye.z, 1,
  ];
}
