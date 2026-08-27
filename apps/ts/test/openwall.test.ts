/** Port of OpenWallCoreTests.swift. */
import { describe, expect, it } from "vitest";
import * as M from "../src/measurekit/index.js";
import * as O from "../src/openwall/index.js";

const at = (id: string, xFt: number, p: M.Provenance = "triangulated"): O.TracePoint =>
  ({ id, position: { x: M.feet(xFt), y: 0n, z: 0n }, provenance: p });

describe("Run", () => {
  it("sums span lengths exactly", () => {
    const run = O.buildRun("r1", "coldWater", "Cold water", [
      { id: "p1", position: M.ORIGIN, provenance: "triangulated" },
      { id: "p2", position: { x: M.feet(3), y: 0n, z: 0n }, provenance: "triangulated" },
      { id: "p3", position: { x: M.feet(3), y: M.feet(4), z: 0n }, provenance: "triangulated" },
    ]);
    expect(O.totalLength(run)).toBe(7n * M.NM_PER_FOOT);
    expect(M.formatted(O.totalLength(run))).toBe("7'");
  });

  it("derives spans from their ends rather than accepting a claim", () => {
    const run = O.buildRun("r2", "electrical", "Circuit",
      [at("p1", 0), at("p2", 1, "derived"), at("p3", 2)]);
    expect(run.spans[0]!.provenance).toBe("derived");
    expect(run.spans[1]!.provenance).toBe("derived");
    expect(O.inferredLength(run)).toBe(2n * M.NM_PER_FOOT);
    expect(O.observedLength(run)).toBe(0n);
  });

  it("refuses a run that is not a run", () => {
    expect(() => O.buildRun("x", "vent", "x", [at("p1", 0)])).toThrow(O.RunError);
  });

  it("refuses duplicate point ids which would corrupt the spans", () => {
    expect(() => O.buildRun("x", "vent", "x", [at("p1", 0), at("p1", 1)])).toThrow(O.RunError);
  });

  it("triangulates a point from two taps and keeps its error", () => {
    const intr = M.intrinsics(1450, 1450, 960, 720);
    const pipe = M.vec(0.3, 0.2, -2.0);
    const frame = (id: string, eye: M.Vec3): M.CameraFrame =>
      ({ id, transform: M.lookAt(eye, pipe), intrinsics: intr,
         imageWidth: 1920, imageHeight: 1440 });
    const a = frame("a", M.vec(0, 0, 0)), b = frame("b", M.vec(1.2, 0.1, 0));
    const pa = M.project(a, pipe), pb = M.project(b, pipe);
    const tp = O.triangulatedPoint("t1", [
      { frame: a, x: pa.x, y: pa.y }, { frame: b, x: pb.x, y: pb.y },
    ]);
    expect(tp).not.toBeNull();
    expect(tp!.provenance).toBe("triangulated");
    expect(tp!.tolerance).toBeDefined();
  });

  it("refuses to triangulate from one tap", () => {
    const f: M.CameraFrame = { id: "a", transform: M.IDENTITY,
      intrinsics: M.intrinsics(1450, 1450, 960, 720), imageWidth: 1920, imageHeight: 1440 };
    expect(O.triangulatedPoint("t", [{ frame: f, x: 10, y: 10 }])).toBeNull();
  });

  it("surfaces the worst tolerance across the run", () => {
    const run = O.buildRun("r", "gas", "Gas", [
      { ...at("p1", 0), tolerance: M.inches(0, 1, 4) },
      { ...at("p2", 1), tolerance: M.inches(1) },
      at("p3", 2, "measured"),
    ]);
    expect(O.worstTolerance(run)).toBe(M.inches(1));
  });
});

describe("the record", () => {
  const job = (inferred = false): O.Job => ({
    propertyAddress: "14 Example Street", capturedOn: "2026-08-27",
    contractorName: "Example Remodeling", homeownerName: "A. Homeowner",
    rooms: [{ id: "k", name: "Kitchen", runs: [O.buildRun("r", "coldWater", "Cold water", [
      { id: "p1", position: M.ORIGIN, provenance: "triangulated", tolerance: 1n },
      { id: "p2", position: { x: M.feet(3), y: 0n, z: 0n },
        provenance: inferred ? "derived" : "triangulated" },
    ])] }],
  });

  it("always carries the cutting warning", () => {
    const html = O.render(job());
    expect(html).toContain("Read this before cutting into any wall.");
    expect(html).toContain("scan the wall immediately before you cut");
  });

  it("adds a notice when anything was inferred", () => {
    expect(O.render(job(true))).toContain("Some of this was inferred.");
    expect(O.render(job(false))).not.toContain("Some of this was inferred.");
  });

  it("fetches nothing at view time", () => {
    const html = O.render(job());
    expect(html).not.toContain("<script");
    expect(html).not.toContain("https://");
  });

  it("never prints a tiny tolerance as zero", () => {
    expect(O.render(job())).toContain('&lt; 1/32"');
  });

  it("is a pure function of its input", () => {
    const j = job();
    expect(O.render(j)).toBe(O.render(j));
  });

  it("flags a hazardous service", () => {
    const j: O.Job = {
      propertyAddress: "x", capturedOn: "2026-08-27", contractorName: "y",
      rooms: [{ id: "r", name: "R", runs: [O.buildRun("r", "gas", "Gas line", [
        { id: "p1", position: M.ORIGIN, provenance: "measured" },
        { id: "p2", position: { x: M.feet(2), y: 0n, z: 0n }, provenance: "measured" },
      ])] }],
    };
    expect(O.render(j)).toContain("HAZARDOUS SERVICE");
  });

  it("omits the homeowner line when there is none", () => {
    const { homeownerName: _omit, ...rest } = job();
    expect(O.render(rest)).not.toContain("Prepared for");
  });
});
