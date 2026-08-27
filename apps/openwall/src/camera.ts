/**
 * Turning a tap on a photograph into a ray in world space, and back again.
 *
 * ARKit gives each frame a camera transform and intrinsics. Those two things are
 * what make a photograph of a stud bay into a measurement rather than a picture.
 */

import {
  type Mat4, type Vec3, invertRigid, normalise, transformDirection,
  translationOf, transformPoint, vec,
} from "./vec.js";

/** Pinhole intrinsics in pixels, as ARKit reports them. */
export interface Intrinsics {
  readonly fx: number;
  readonly fy: number;
  readonly cx: number;
  readonly cy: number;
}

export interface CameraFrame {
  readonly id: string;
  /** Camera-to-world, column-major, ARKit convention (-Z forward, +Y up). */
  readonly transform: Mat4;
  readonly intrinsics: Intrinsics;
  readonly imageWidth: number;
  readonly imageHeight: number;
}

export interface Ray {
  readonly origin: Vec3;
  /** Unit length. */
  readonly direction: Vec3;
}

/** A tap on a photograph, in pixels, origin top-left. */
export interface Tap {
  readonly frame: CameraFrame;
  readonly x: number;
  readonly y: number;
}

function assertIntrinsics({ fx, fy }: Intrinsics): void {
  if (fx === 0 || fy === 0) {
    throw new RangeError("focal length cannot be zero");
  }
}

/**
 * Unproject a pixel into a world-space ray.
 *
 * Image y runs down and camera y runs up, so the y term is negated. Camera z is
 * -1 because ARKit's camera looks down its own -Z.
 */
export function rayThroughPixel(frame: CameraFrame, px: number, py: number): Ray {
  assertIntrinsics(frame.intrinsics);
  const { fx, fy, cx, cy } = frame.intrinsics;
  const inCamera = vec((px - cx) / fx, -(py - cy) / fy, -1);
  return {
    origin: translationOf(frame.transform),
    direction: normalise(transformDirection(frame.transform, inCamera)),
  };
}

export const rayThroughTap = (tap: Tap): Ray => rayThroughPixel(tap.frame, tap.x, tap.y);

export interface Projection {
  readonly x: number;
  readonly y: number;
  /** False when the point is behind the camera, where the maths still yields numbers. */
  readonly inFront: boolean;
  /** True when the pixel also falls inside the image bounds. */
  readonly onImage: boolean;
}

/**
 * Project a world point back onto a frame - what draws a traced run over the
 * photograph it was traced in.
 */
export function projectToPixel(frame: CameraFrame, world: Vec3): Projection {
  assertIntrinsics(frame.intrinsics);
  const { fx, fy, cx, cy } = frame.intrinsics;
  const p = transformPoint(invertRigid(frame.transform), world);
  const depth = -p.z;
  if (depth === 0) {
    return { x: Number.NaN, y: Number.NaN, inFront: false, onImage: false };
  }
  const x = (fx * p.x) / depth + cx;
  const y = cy - (fy * p.y) / depth;
  const inFront = depth > 0;
  return {
    x, y, inFront,
    onImage:
      inFront && x >= 0 && y >= 0 && x <= frame.imageWidth && y <= frame.imageHeight,
  };
}
