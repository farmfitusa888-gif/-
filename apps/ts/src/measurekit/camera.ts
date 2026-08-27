/** Port of MeasureKit/Camera.swift. */

import {
  type Transform, type Vec3, direction, invertRigid, normalise, point, translation, vec,
} from "./vec.js";

export interface Intrinsics {
  readonly fx: number; readonly fy: number; readonly cx: number; readonly cy: number;
}

export function intrinsics(fx: number, fy: number, cx: number, cy: number): Intrinsics {
  if (fx === 0 || fy === 0) throw new RangeError("focal length cannot be zero");
  return { fx, fy, cx, cy };
}

export interface CameraFrame {
  readonly id: string;
  readonly transform: Transform;
  readonly intrinsics: Intrinsics;
  readonly imageWidth: number;
  readonly imageHeight: number;
}

export interface Ray { readonly origin: Vec3; readonly direction: Vec3 }

export interface Tap { readonly frame: CameraFrame; readonly x: number; readonly y: number }

/**
 * Unproject a pixel into a world-space ray.
 *
 * Image y runs down and camera y runs up, so the y term is negated. Camera z is
 * -1 because ARKit's camera looks along its own -Z.
 */
export function rayThroughPixel(frame: CameraFrame, px: number, py: number): Ray {
  const { fx, fy, cx, cy } = frame.intrinsics;
  const inCamera = vec((px - cx) / fx, -(py - cy) / fy, -1);
  return {
    origin: translation(frame.transform),
    direction: normalise(direction(frame.transform, inCamera)),
  };
}

export const rayThroughTap = (t: Tap): Ray => rayThroughPixel(t.frame, t.x, t.y);

export interface Projection {
  readonly x: number; readonly y: number;
  readonly isInFront: boolean; readonly isOnImage: boolean;
}

/** Project a world point back onto a frame. */
export function project(frame: CameraFrame, world: Vec3): Projection {
  const { fx, fy, cx, cy } = frame.intrinsics;
  const p = point(invertRigid(frame.transform), world);
  const depth = -p.z;
  if (depth === 0) return { x: NaN, y: NaN, isInFront: false, isOnImage: false };
  const x = (fx * p.x) / depth + cx;
  const y = cy - (fy * p.y) / depth;
  const isInFront = depth > 0;
  return {
    x, y, isInFront,
    isOnImage: isInFront && x >= 0 && y >= 0
      && x <= frame.imageWidth && y <= frame.imageHeight,
  };
}
