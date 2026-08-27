import { describe, expect, it } from "vitest";
import { type CameraFrame, projectToPixel, rayThroughPixel } from "../src/camera.js";
import { triangulateBestPair, triangulateRays, triangulateTaps } from "../src/triangulate.js";
import { length, lookAt, sub, vec, type Vec3 } from "../src/vec.js";

/** Plausible iPhone-ish intrinsics. Exact values do not matter; consistency does. */
const INTRINSICS = { fx: 1_450, fy: 1_450, cx: 960, cy: 720 };

const frameAt = (id: string, eye: Vec3, target: Vec3): CameraFrame => ({
  id,
  transform: lookAt(eye, target),
  intrinsics: INTRINSICS,
  imageWidth: 1920,
  imageHeight: 1440,
});

/** The pipe we are pretending to tap on. */
const PIPE = vec(0.30, 0.20, -2.00);

describe("triangulation", () => {
  it("recovers a known point from two synthetic views", () => {
    // Project the true point into two frames, then triangulate back from the
    // pixels. This is the whole product in one test.
    const a = frameAt("a", vec(0, 0, 0), PIPE);
    const b = frameAt("b", vec(1.2, 0.1, 0), PIPE);

    const pa = projectToPixel(a, PIPE);
    const pb = projectToPixel(b, PIPE);
    expect(pa.onImage).toBe(true);
    expect(pb.onImage).toBe(true);

    const result = triangulateTaps(
      { frame: a, x: pa.x, y: pa.y },
      { frame: b, x: pb.x, y: pb.y },
    );

    expect(result.degenerate).toBe(false);
    expect(length(sub(result.point, PIPE))).toBeLessThan(1e-9);
    expect(result.missDistance).toBeLessThan(1e-9);
    expect(result.depths[0]).toBeGreaterThan(0);
    expect(result.depths[1]).toBeGreaterThan(0);
  });

  it("projection and unprojection are inverses", () => {
    const f = frameAt("f", vec(0.5, 1.2, 0.4), PIPE);
    const p = projectToPixel(f, PIPE);
    const ray = rayThroughPixel(f, p.x, p.y);
    const distance = length(sub(PIPE, ray.origin));
    const reconstructed = {
      x: ray.origin.x + ray.direction.x * distance,
      y: ray.origin.y + ray.direction.y * distance,
      z: ray.origin.z + ray.direction.z * distance,
    };
    expect(length(sub(reconstructed, PIPE))).toBeLessThan(1e-9);
  });

  it("reports a real miss distance when the taps disagree", () => {
    const a = frameAt("a", vec(0, 0, 0), PIPE);
    const b = frameAt("b", vec(1.2, 0.1, 0), PIPE);
    const pa = projectToPixel(a, PIPE);
    const pb = projectToPixel(b, PIPE);

    // Nudge one tap by five pixels, as a thumb on glass would.
    const sloppy = triangulateTaps(
      { frame: a, x: pa.x, y: pa.y + 5 },
      { frame: b, x: pb.x, y: pb.y },
    );

    expect(sloppy.degenerate).toBe(false);
    expect(sloppy.missDistance).toBeGreaterThan(0);
    // The error is reported, not hidden - that is the entire trust model.
    expect(Number.isFinite(sloppy.missDistance)).toBe(true);
  });

  it("a wider baseline beats a narrow one for the same tap error", () => {
    const a = frameAt("a", vec(0, 0, 0), PIPE);
    const narrow = frameAt("narrow", vec(0.08, 0, 0), PIPE);
    const wide = frameAt("wide", vec(1.5, 0, 0), PIPE);

    const err = (b: CameraFrame): number => {
      const pa = projectToPixel(a, PIPE);
      const pb = projectToPixel(b, PIPE);
      const t = triangulateTaps(
        { frame: a, x: pa.x + 3, y: pa.y },
        { frame: b, x: pb.x, y: pb.y },
      );
      return length(sub(t.point, PIPE));
    };

    expect(err(wide)).toBeLessThan(err(narrow));
  });

  it("refuses to answer when the rays are effectively parallel", () => {
    const a = frameAt("a", vec(0, 0, 0), vec(0, 0, -1));
    const b = frameAt("b", vec(0.001, 0, 0), vec(0.001, 0, -1));
    const pa = projectToPixel(a, vec(0, 0, -5));
    const pb = projectToPixel(b, vec(0.001, 0, -5));

    const result = triangulateTaps(
      { frame: a, x: pa.x, y: pa.y },
      { frame: b, x: pb.x, y: pb.y },
    );
    expect(result.degenerate).toBe(true);
    expect(result.missDistance).toBe(Number.POSITIVE_INFINITY);
  });

  it("picks the best-agreeing pair out of three taps", () => {
    const a = frameAt("a", vec(0, 0, 0), PIPE);
    const b = frameAt("b", vec(1.2, 0.1, 0), PIPE);
    const c = frameAt("c", vec(-1.1, 0.3, 0.2), PIPE);
    const pa = projectToPixel(a, PIPE);
    const pb = projectToPixel(b, PIPE);
    const pc = projectToPixel(c, PIPE);

    const best = triangulateBestPair([
      { frame: a, x: pa.x, y: pa.y },
      { frame: b, x: pb.x, y: pb.y + 12 }, // one sloppy tap
      { frame: c, x: pc.x, y: pc.y },
    ]);

    expect(best.pairsConsidered).toBe(3);
    // The clean a-c pair should win, so the answer stays close to truth.
    expect(length(sub(best.point, PIPE))).toBeLessThan(1e-6);
  });

  it("needs two taps before it will answer at all", () => {
    const a = frameAt("a", vec(0, 0, 0), PIPE);
    expect(() => triangulateBestPair([{ frame: a, x: 10, y: 10 }])).toThrow(RangeError);
  });

  it("treats identical rays as degenerate rather than dividing by zero", () => {
    const ray = { origin: vec(0, 0, 0), direction: vec(0, 0, -1) };
    const result = triangulateRays(ray, ray);
    expect(result.degenerate).toBe(true);
  });
});
