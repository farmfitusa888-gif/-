/**
 * Float vector and rigid-transform maths, used only for ray geometry.
 *
 * Nothing here is ever stored. Results cross into exact nanometres through
 * `quantiseMetres` and are marked as sensor-derived when they do.
 */

export interface Vec3 {
  readonly x: number;
  readonly y: number;
  readonly z: number;
}

/** A 4x4 rigid transform in COLUMN-MAJOR order, matching ARKit's simd_float4x4. */
export type Mat4 = readonly number[];

export const vec = (x: number, y: number, z: number): Vec3 => ({ x, y, z });

export const add = (a: Vec3, b: Vec3): Vec3 => vec(a.x + b.x, a.y + b.y, a.z + b.z);
export const sub = (a: Vec3, b: Vec3): Vec3 => vec(a.x - b.x, a.y - b.y, a.z - b.z);
export const scale = (a: Vec3, k: number): Vec3 => vec(a.x * k, a.y * k, a.z * k);
export const dot = (a: Vec3, b: Vec3): number => a.x * b.x + a.y * b.y + a.z * b.z;
export const length = (a: Vec3): number => Math.sqrt(dot(a, a));

export const cross = (a: Vec3, b: Vec3): Vec3 =>
  vec(a.y * b.z - a.z * b.y, a.z * b.x - a.x * b.z, a.x * b.y - a.y * b.x);

export function normalise(a: Vec3): Vec3 {
  const len = length(a);
  if (len === 0) throw new RangeError("cannot normalise a zero-length vector");
  return scale(a, 1 / len);
}

const col = (m: Mat4, i: number): Vec3 => {
  const x = m[i * 4], y = m[i * 4 + 1], z = m[i * 4 + 2];
  if (x === undefined || y === undefined || z === undefined) {
    throw new RangeError(`transform must have 16 elements, got ${m.length}`);
  }
  return vec(x, y, z);
};

export const translationOf = (m: Mat4): Vec3 => col(m, 3);

/** Rotate a direction into world space. Translation is deliberately ignored. */
export const transformDirection = (m: Mat4, v: Vec3): Vec3 =>
  add(add(scale(col(m, 0), v.x), scale(col(m, 1), v.y)), scale(col(m, 2), v.z));

export const transformPoint = (m: Mat4, v: Vec3): Vec3 =>
  add(transformDirection(m, v), translationOf(m));

/**
 * Inverse of a rigid transform, exploiting orthonormality: the rotation inverts
 * by transpose. A general 4x4 inverse would be slower and less accurate, and the
 * camera transform is always rigid.
 */
export function invertRigid(m: Mat4): Mat4 {
  const c0 = col(m, 0), c1 = col(m, 1), c2 = col(m, 2), t = col(m, 3);
  const tx = -dot(c0, t), ty = -dot(c1, t), tz = -dot(c2, t);
  return [
    c0.x, c1.x, c2.x, 0,
    c0.y, c1.y, c2.y, 0,
    c0.z, c1.z, c2.z, 0,
    tx,   ty,   tz,   1,
  ];
}

/**
 * Build a camera transform placing the camera at `eye` looking toward `target`,
 * in ARKit's convention: -Z forward, +Y up, +X right.
 */
export function lookAt(eye: Vec3, target: Vec3, up: Vec3 = vec(0, 1, 0)): Mat4 {
  const forward = normalise(sub(target, eye));
  const zAxis = scale(forward, -1);
  const xAxis = normalise(cross(up, zAxis));
  const yAxis = cross(zAxis, xAxis);
  return [
    xAxis.x, xAxis.y, xAxis.z, 0,
    yAxis.x, yAxis.y, yAxis.z, 0,
    zAxis.x, zAxis.y, zAxis.z, 0,
    eye.x,   eye.y,   eye.z,   1,
  ];
}
