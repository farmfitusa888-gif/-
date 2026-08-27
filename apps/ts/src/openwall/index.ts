/** Port of OpenWallCore. The pre-drywall record. */

import {
  type Nanometres, type Photo, type Point3, type Provenance, type Report, type Section,
  type Table, type Tap, combine, distance, formatted, lengthCell, mark, maxOf, missLength,
  pointFromMetres, render as renderReport, tolerance as toleranceCell, text,
  triangulateBestPair,
} from "../measurekit/index.js";

export type Service =
  | "coldWater" | "hotWater" | "waste" | "vent" | "gas"
  | "electrical" | "lowVoltage" | "hvacSupply" | "hvacReturn" | "structural" | "other";

export const SERVICE_LABEL: Record<Service, string> = {
  coldWater: "Cold water", hotWater: "Hot water", waste: "Waste", vent: "Vent", gas: "Gas",
  electrical: "Electrical", lowVoltage: "Low voltage", hvacSupply: "HVAC supply",
  hvacReturn: "HVAC return", structural: "Structural", other: "Other",
};

/** Cutting into these is the one that hurts. */
export const isHazardous = (s: Service): boolean => s === "electrical" || s === "gas";

export interface TracePoint {
  readonly id: string;
  readonly position: Point3;
  readonly provenance: Provenance;
  readonly tolerance?: Nanometres;
  readonly note?: string;
}

/** Build a point from two or more taps. Null when the views cannot place it. */
export function triangulatedPoint(id: string, taps: readonly Tap[], note?: string):
    TracePoint | null {
  if (taps.length < 2) return null;
  const { result } = triangulateBestPair(taps);
  if (result.isDegenerate) return null;
  return {
    id, position: pointFromMetres(result.point), provenance: "triangulated",
    tolerance: missLength(result), ...(note === undefined ? {} : { note }),
  };
}

export interface Span {
  readonly fromID: string; readonly toID: string;
  readonly provenance: Provenance; readonly length: Nanometres;
}

export interface Run {
  readonly id: string;
  readonly service: Service;
  readonly label: string;
  readonly points: readonly TracePoint[];
  readonly spans: readonly Span[];
}

export class RunError extends Error {}

/** Spans are derived, never supplied: trust follows from the two ends. */
export function buildRun(id: string, service: Service, label: string,
                         points: readonly TracePoint[]): Run {
  if (points.length < 2) throw new RunError(`a run needs at least two points, got ${points.length}`);
  const seen = new Set<string>();
  for (const p of points) {
    if (seen.has(p.id)) throw new RunError(`duplicate point id in run ${id}: ${p.id}`);
    seen.add(p.id);
  }
  const spans: Span[] = [];
  for (let i = 1; i < points.length; i++) {
    const a = points[i - 1]!, b = points[i]!;
    spans.push({
      fromID: a.id, toID: b.id,
      provenance: combine(a.provenance, b.provenance),
      length: distance(a.position, b.position),
    });
  }
  return { id, service, label, points, spans };
}

export const totalLength = (r: Run): Nanometres =>
  r.spans.reduce((t, s) => t + s.length, 0n);
export const observedLength = (r: Run): Nanometres =>
  r.spans.filter((s) => s.provenance !== "derived").reduce((t, s) => t + s.length, 0n);
export const inferredLength = (r: Run): Nanometres =>
  r.spans.filter((s) => s.provenance === "derived").reduce((t, s) => t + s.length, 0n);

export function worstTolerance(r: Run): Nanometres | undefined {
  const all = r.points.map((p) => p.tolerance).filter((t): t is Nanometres => t !== undefined);
  return all.length === 0 ? undefined : all.reduce(maxOf);
}

export interface Room {
  readonly id: string; readonly name: string;
  readonly runs: readonly Run[]; readonly photos?: readonly Photo[];
}

export interface Job {
  readonly propertyAddress: string;
  /** Supplied by the caller, never `new Date()`, so a record is reproducible. */
  readonly capturedOn: string;
  readonly contractorName: string;
  readonly homeownerName?: string;
  readonly rooms: readonly Room[];
}

/**
 * Not optional and not configurable.
 *
 * Somebody will cut into a wall holding this document. Everything else in the
 * product is a convenience; this paragraph is why it is defensible to ship.
 */
export const CUTTING_WARNING = {
  kind: "warning",
  heading: "Read this before cutting into any wall.",
  body: "This is a record, not a locator. It describes what was visible on the date above; "
    + "later work may have changed it. Positions marked \"inferred\" were never directly seen, "
    + "and every position carries a margin of error. Always scan the wall immediately before "
    + "you cut, every time. This document does not replace that.",
} as const;

function runTable(run: Run): Table {
  let caption = `${run.label} - ${SERVICE_LABEL[run.service]}. `
    + `Total ${formatted(totalLength(run))}`;
  if (inferredLength(run) > 0n) {
    caption += `, of which ${formatted(inferredLength(run))} was inferred`;
  }
  if (isHazardous(run.service)) caption += " - HAZARDOUS SERVICE";

  return {
    caption,
    columns: ["Point", "X", "Y", "Z (height)", "How it is known", "Ray disagreement", "Note"],
    rows: run.points.map((p) => [
      text(p.id), lengthCell(p.position.x), lengthCell(p.position.y), lengthCell(p.position.z),
      mark(p.provenance),
      p.tolerance === undefined ? text("—") : toleranceCell(p.tolerance),
      text(p.note ?? ""),
    ]),
  };
}

const LEGEND: Section = {
  heading: "How to read this",
  summary: "Positions are given from the room's origin corner: X along the wall, "
    + "Y into the room, Z as height above the finished floor.",
  tables: [{
    columns: ["Mark", "Means"],
    rows: [
      [mark("triangulated"), text("Seen in two or more photographs and computed from them. "
        + "A sensor result, with its error shown.")],
      [mark("measured"), text("Somebody put a tape on it. The most reliable figure here.")],
      [mark("derived"), text("Inferred between two known points and never directly seen. "
        + "Treat with the most caution.")],
      [mark("adjusted"), text("Moved when a later tape measurement corrected the geometry.")],
    ],
  }],
};

export function buildReport(job: Job): Report {
  const facts: [string, string][] = [
    ["Property", job.propertyAddress],
    ["Recorded", job.capturedOn],
    ["Recorded by", job.contractorName],
  ];
  if (job.homeownerName) facts.push(["Prepared for", job.homeownerName]);

  const notices = [CUTTING_WARNING as { kind: "warning"; heading: string; body: string }];
  if (job.rooms.some((r) => r.runs.some((run) => inferredLength(run) > 0n))) {
    notices.push({
      kind: "warning", heading: "Some of this was inferred.",
      body: "Parts of one or more runs were never directly seen - they were reasoned between "
        + "two points that were. Those spans are marked, and they are the ones to be most "
        + "careful of.",
    });
  }

  return {
    title: "What's behind these walls",
    subtitle: "A record of the services inside the walls of this property, "
      + "made while they were open.",
    facts, notices,
    sections: [
      ...job.rooms.map((room): Section => ({
        heading: room.name,
        tables: room.runs.map(runTable),
        ...(room.photos === undefined ? {} : { photos: room.photos }),
      })),
      LEGEND,
    ],
    footer: "This file is self-contained. It needs no app, no login and no internet connection, "
      + "and it will keep working if the company that made it does not. "
      + "Keep a copy with the deeds.",
  };
}

export const render = (job: Job): string => renderReport(buildReport(job));
