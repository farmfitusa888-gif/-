import { describe, expect, it } from "vitest";
import { type Provenance, spanProvenance } from "../src/provenance.js";
import {
  buildRun, distance, fromMetres, runLength, summarise, type TracePoint,
} from "../src/runs.js";
import { NM_PER_FOOT, NM_PER_INCH, formatFeetInches } from "../src/units.js";
import { vec } from "../src/vec.js";

const at = (
  id: string,
  x: bigint, y: bigint, z: bigint,
  provenance: TracePoint["provenance"] = "triangulated",
): TracePoint => ({ id, position: { x, y, z }, provenance });

describe("runs", () => {
  it("measures a 3-4-5 triangle exactly", () => {
    const a = { x: 0n, y: 0n, z: 0n };
    const b = { x: 3n * NM_PER_FOOT, y: 4n * NM_PER_FOOT, z: 0n };
    expect(distance(a, b)).toBe(5n * NM_PER_FOOT);
  });

  it("sums span lengths exactly, with no float drift", () => {
    const run = buildRun("r1", "cold-water", "Cold water to sink", [
      at("p1", 0n, 0n, 0n),
      at("p2", 3n * NM_PER_FOOT, 0n, 0n),
      at("p3", 3n * NM_PER_FOOT, 4n * NM_PER_FOOT, 0n),
    ]);
    expect(runLength(run)).toBe(7n * NM_PER_FOOT);
    expect(formatFeetInches(runLength(run))).toBe(`7'`);
  });

  it("derives spans from their ends rather than accepting a claim", () => {
    const run = buildRun("r2", "electrical", "Kitchen circuit", [
      at("p1", 0n, 0n, 0n, "triangulated"),
      at("p2", NM_PER_FOOT, 0n, 0n, "derived"),
      at("p3", 2n * NM_PER_FOOT, 0n, 0n, "triangulated"),
    ]);
    // Either end unobserved makes the whole span inferred.
    expect(run.spans[0]?.provenance).toBe("derived");
    expect(run.spans[1]?.provenance).toBe("derived");
  });

  it("keeps observed and inferred length apart in the summary", () => {
    const run = buildRun("r3", "waste", "Main waste", [
      at("p1", 0n, 0n, 0n, "triangulated"),
      at("p2", 2n * NM_PER_FOOT, 0n, 0n, "triangulated"),
      at("p3", 5n * NM_PER_FOOT, 0n, 0n, "derived"),
    ]);
    const s = summarise(run);
    expect(s.observedLength).toBe(2n * NM_PER_FOOT);
    expect(s.inferredLength).toBe(3n * NM_PER_FOOT);
    expect(s.totalLength).toBe(5n * NM_PER_FOOT);
  });

  it("surfaces the worst ray disagreement in the run", () => {
    const run = buildRun("r4", "gas", "Gas line", [
      { ...at("p1", 0n, 0n, 0n), missDistance: NM_PER_INCH / 4n },
      { ...at("p2", NM_PER_FOOT, 0n, 0n), missDistance: NM_PER_INCH },
      at("p3", 2n * NM_PER_FOOT, 0n, 0n, "measured"),
    ]);
    expect(summarise(run).worstMiss).toBe(NM_PER_INCH);
  });

  it("crosses the sensor boundary once, at fromMetres", () => {
    const p = fromMetres(vec(0.0254, 0.3048, 1));
    expect(p.x).toBe(NM_PER_INCH);
    expect(p.y).toBe(NM_PER_FOOT);
    expect(p.z).toBe(1_000_000_000n);
  });

  it("refuses a run that is not a run", () => {
    expect(() => buildRun("bad", "vent", "x", [at("p1", 0n, 0n, 0n)])).toThrow(RangeError);
  });

  it("refuses duplicate point ids, which would corrupt the spans", () => {
    expect(() =>
      buildRun("dup", "vent", "x", [at("p1", 0n, 0n, 0n), at("p1", NM_PER_FOOT, 0n, 0n)]),
    ).toThrow(RangeError);
  });
});

describe("span provenance", () => {
  it("only calls a span measured when both ends were taped", () => {
    expect(spanProvenance("measured", "measured")).toBe("measured");
    expect(spanProvenance("measured", "triangulated")).toBe("triangulated");
  });

  it("never upgrades an inferred end", () => {
    expect(spanProvenance("measured", "derived")).toBe("derived");
    expect(spanProvenance("triangulated", "derived")).toBe("derived");
  });

  /// The bug this replaced: `adjusted` was missing from the observed set, so a
  /// span an actual tape had moved came back as "inferred, not seen".
  it("treats an adjusted end as seen, because a measurement moved it", () => {
    expect(spanProvenance("adjusted", "measured")).toBe("adjusted");
    expect(spanProvenance("adjusted", "adjusted")).toBe("adjusted");
    expect(spanProvenance("adjusted", "triangulated")).toBe("triangulated");
    expect(spanProvenance("adjusted", "derived")).toBe("derived");
  });

  it("is exactly the weaker of the two ends, in both orders", () => {
    const order: Provenance[] = ["derived", "triangulated", "adjusted", "measured"];
    for (let i = 0; i < order.length; i++) {
      for (let j = 0; j < order.length; j++) {
        const expected = order[Math.min(i, j)]!;
        expect(spanProvenance(order[i]!, order[j]!)).toBe(expected);
        expect(spanProvenance(order[j]!, order[i]!)).toBe(expected);
      }
    }
  });
});
