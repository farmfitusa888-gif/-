/**
 * Traced points become labelled runs of a service, with exact geometry.
 *
 * Positions arrive from triangulation as float metres and cross into exact
 * nanometres here, once, through `quantiseMetres`. Everything downstream -
 * lengths, offsets, what gets printed on the record - is integer arithmetic.
 */

import { type Provenance, spanProvenance } from "./provenance.js";
import { type Nanometres, isqrt, quantiseMetres } from "./units.js";
import type { Vec3 } from "./vec.js";

export type Service =
  | "cold-water" | "hot-water" | "waste" | "vent" | "gas"
  | "electrical" | "low-voltage" | "hvac-supply" | "hvac-return"
  | "structural" | "other";

export const SERVICE_LABEL: Record<Service, string> = {
  "cold-water": "Cold water",
  "hot-water": "Hot water",
  waste: "Waste",
  vent: "Vent",
  gas: "Gas",
  electrical: "Electrical",
  "low-voltage": "Low voltage",
  "hvac-supply": "HVAC supply",
  "hvac-return": "HVAC return",
  structural: "Structural",
  other: "Other",
};

/** A position in the room's frame, in exact nanometres. */
export interface Point3 {
  readonly x: Nanometres;
  readonly y: Nanometres;
  readonly z: Nanometres;
}

export interface TracePoint {
  readonly id: string;
  readonly position: Point3;
  readonly provenance: Provenance;
  /** Ray disagreement at this point, in nanometres. Absent for tape measurements. */
  readonly missDistance?: Nanometres;
  readonly note?: string;
}

export interface Span {
  readonly fromId: string;
  readonly toId: string;
  readonly provenance: Provenance;
  readonly length: Nanometres;
}

export interface Run {
  readonly id: string;
  readonly service: Service;
  readonly label: string;
  readonly points: readonly TracePoint[];
  readonly spans: readonly Span[];
}

export const fromMetres = (v: Vec3): Point3 => ({
  x: quantiseMetres(v.x),
  y: quantiseMetres(v.y),
  z: quantiseMetres(v.z),
});

/** Exact 3D distance: integer square root of an exact sum of squares. */
export function distance(a: Point3, b: Point3): Nanometres {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  const dz = a.z - b.z;
  return isqrt(dx * dx + dy * dy + dz * dz);
}

/**
 * Build a run from traced points in order.
 *
 * Spans are derived, never supplied: a span's trustworthiness follows from its
 * two ends and cannot be asserted independently of them.
 */
export function buildRun(
  id: string,
  service: Service,
  label: string,
  points: readonly TracePoint[],
): Run {
  if (points.length < 2) {
    throw new RangeError(`a run needs at least two points, got ${points.length}`);
  }
  const seen = new Set<string>();
  for (const p of points) {
    if (seen.has(p.id)) throw new RangeError(`duplicate point id in run ${id}: ${p.id}`);
    seen.add(p.id);
  }

  const spans: Span[] = [];
  for (let i = 1; i < points.length; i++) {
    const a = points[i - 1]!;
    const b = points[i]!;
    spans.push({
      fromId: a.id,
      toId: b.id,
      provenance: spanProvenance(a.provenance, b.provenance),
      length: distance(a.position, b.position),
    });
  }
  return { id, service, label, points, spans };
}

export const runLength = (run: Run): Nanometres =>
  run.spans.reduce((total, s) => total + s.length, 0n);

export interface RunSummary {
  readonly totalLength: Nanometres;
  readonly observedLength: Nanometres;
  readonly inferredLength: Nanometres;
  /** Largest ray disagreement across the run, if any point carries one. */
  readonly worstMiss: Nanometres | undefined;
}

export function summarise(run: Run): RunSummary {
  let observed = 0n;
  let inferred = 0n;
  for (const s of run.spans) {
    if (s.provenance === "derived") inferred += s.length;
    else observed += s.length;
  }
  let worstMiss: Nanometres | undefined;
  for (const p of run.points) {
    if (p.missDistance === undefined) continue;
    if (worstMiss === undefined || p.missDistance > worstMiss) worstMiss = p.missDistance;
  }
  return {
    totalLength: observed + inferred,
    observedLength: observed,
    inferredLength: inferred,
    worstMiss,
  };
}
