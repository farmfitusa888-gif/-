/** Port of PlumbCore. Accessibility barrier survey. */

import {
  type CrossCheckedSlope, type Nanometres, type Provenanced, type Provenance, type Quote,
  type Report, type Section, type Slope, SLOPE_LIMIT, disagrees, exceedsOneIn, formatMoney,
  formattedAsOneIn, formatted, inches, isIssuable, isQuoteIssuable, lineTotal, mark, money,
  quantityOf, render as renderReport, reported, subtotal, text, unitLabel,
} from "../measurekit/index.js";

/** Which rule book governs. Stored WITH the survey, never compiled in. */
export interface Standard { readonly name: string; readonly edition: string }

export const ADA_2010: Standard = {
  name: "2010 ADA Standards for Accessible Design", edition: "2010",
};
export const CBC_11B: Standard = {
  name: "California Building Code Chapter 11B", edition: "2022",
};

export type Requirement =
  | { readonly kind: "minimum"; readonly value: Nanometres }
  | { readonly kind: "maximum"; readonly value: Nanometres }
  | { readonly kind: "range"; readonly min: Nanometres; readonly max: Nanometres }
  | { readonly kind: "maxSlopeOneIn"; readonly n: bigint };

export function requirementSummary(r: Requirement): string {
  switch (r.kind) {
    case "minimum": return `at least ${formatted(r.value)}`;
    case "maximum": return `no more than ${formatted(r.value)}`;
    case "range": return `${formatted(r.min)} to ${formatted(r.max)}`;
    case "maxSlopeOneIn": return `no steeper than 1:${r.n}`;
  }
}

export type SurveyArea =
  | "parking" | "exteriorRoute" | "entrance" | "interiorRoute"
  | "restroom" | "counters" | "signage";

export const AREA_LABEL: Record<SurveyArea, string> = {
  parking: "Parking", exteriorRoute: "Exterior route", entrance: "Entrance",
  interiorRoute: "Interior route", restroom: "Restroom",
  counters: "Counters and service", signage: "Signage",
};

export interface SurveyCheckpoint {
  readonly id: string; readonly standard: Standard; readonly clause: string;
  readonly area: SurveyArea; readonly text: string; readonly requirement: Requirement;
}

export const checkpointCitation = (c: SurveyCheckpoint): string =>
  `${c.standard.name} §${c.clause}`;

/**
 * A starting library: deliberately small and explicit rather than exhaustive.
 * Each entry is a threshold somebody can check against the published standard,
 * and adding one is a data change, not a code change.
 */
export const ADA_CHECKPOINTS: readonly SurveyCheckpoint[] = [
  { id: "404.2.3", standard: ADA_2010, clause: "404.2.3", area: "entrance",
    text: "Clear width of a doorway, measured with the door open 90 degrees.",
    requirement: { kind: "minimum", value: inches(32) } },
  { id: "403.5.1", standard: ADA_2010, clause: "403.5.1", area: "interiorRoute",
    text: "Clear width of an accessible route.",
    requirement: { kind: "minimum", value: inches(36) } },
  { id: "405.2", standard: ADA_2010, clause: "405.2", area: "exteriorRoute",
    text: "Ramp running slope.",
    requirement: { kind: "maxSlopeOneIn", n: SLOPE_LIMIT.ramp } },
  { id: "403.3", standard: ADA_2010, clause: "403.3", area: "exteriorRoute",
    text: "Cross slope of an accessible route.",
    requirement: { kind: "maxSlopeOneIn", n: SLOPE_LIMIT.cross } },
  { id: "308.2.1", standard: ADA_2010, clause: "308.2.1", area: "counters",
    text: "Unobstructed forward reach, high.",
    requirement: { kind: "maximum", value: inches(48) } },
  { id: "308.2.1lo", standard: ADA_2010, clause: "308.2.1", area: "counters",
    text: "Unobstructed forward reach, low.",
    requirement: { kind: "minimum", value: inches(15) } },
  { id: "904.4.1", standard: ADA_2010, clause: "904.4.1", area: "counters",
    text: "Height of a sales or service counter above the finished floor.",
    requirement: { kind: "maximum", value: inches(36) } },
  { id: "604.5", standard: ADA_2010, clause: "604.5", area: "restroom",
    text: "Height of a water closet grab bar above the finished floor.",
    requirement: { kind: "range", min: inches(33), max: inches(36) } },
  { id: "304.3.1", standard: ADA_2010, clause: "304.3.1", area: "restroom",
    text: "Diameter of a circular turning space.",
    requirement: { kind: "minimum", value: inches(60) } },
  { id: "502.2", standard: ADA_2010, clause: "502.2", area: "parking",
    text: "Width of a car accessible parking space.",
    requirement: { kind: "minimum", value: inches(96) } },
  { id: "502.3", standard: ADA_2010, clause: "502.3", area: "parking",
    text: "Width of an access aisle serving a car space.",
    requirement: { kind: "minimum", value: inches(60) } },
  { id: "502.4", standard: ADA_2010, clause: "502.4", area: "parking",
    text: "Slope of a parking space or access aisle, any direction.",
    requirement: { kind: "maxSlopeOneIn", n: SLOPE_LIMIT.cross } },
];

export const checkpointsFor = (area: SurveyArea): SurveyCheckpoint[] =>
  ADA_CHECKPOINTS.filter((c) => c.area === area);

export type Finding =
  | { readonly kind: "compliant"; readonly measured: Provenanced<Nanometres> }
  | { readonly kind: "barrier"; readonly measured: Provenanced<Nanometres> }
  | { readonly kind: "slopeCompliant"; readonly slope: CrossCheckedSlope }
  | { readonly kind: "slopeBarrier"; readonly slope: CrossCheckedSlope }
  | { readonly kind: "notMeasured"; readonly reason: string }
  | { readonly kind: "notApplicable"; readonly reason: string };

export const isBarrierFinding = (f: Finding): boolean =>
  f.kind === "barrier" || f.kind === "slopeBarrier";

export function findingProvenance(f: Finding): Provenance {
  switch (f.kind) {
    case "compliant": case "barrier": return f.measured.provenance;
    case "slopeCompliant": case "slopeBarrier": return f.slope.provenance;
    case "notMeasured": return "scanned";
    case "notApplicable": return "derived";
  }
}

/** Compare a measured length against a checkpoint. Exact integer comparison. */
export function evaluateLength(c: SurveyCheckpoint,
                               measured: Provenanced<Nanometres>): Finding {
  const v = measured.value;
  const r = c.requirement;
  switch (r.kind) {
    case "minimum": return v < r.value ? { kind: "barrier", measured } : { kind: "compliant", measured };
    case "maximum": return v > r.value ? { kind: "barrier", measured } : { kind: "compliant", measured };
    case "range":
      return (v < r.min || v > r.max)
        ? { kind: "barrier", measured } : { kind: "compliant", measured };
    case "maxSlopeOneIn":
      return { kind: "notMeasured", reason: "this checkpoint needs a slope, not a length" };
  }
}

export function evaluateSlope(c: SurveyCheckpoint, s: CrossCheckedSlope): Finding {
  if (c.requirement.kind !== "maxSlopeOneIn") {
    return { kind: "notMeasured", reason: "this checkpoint needs a length, not a slope" };
  }
  // The steeper of the two readings is reported: conservative by design.
  return exceedsOneIn(reported(s), c.requirement.n)
    ? { kind: "slopeBarrier", slope: s } : { kind: "slopeCompliant", slope: s };
}

export interface Observation {
  readonly id: string; readonly checkpoint: SurveyCheckpoint;
  readonly location: string; readonly finding: Finding;
}

export interface Barrier {
  readonly id: string; readonly checkpoint: SurveyCheckpoint; readonly location: string;
  readonly found: string; readonly required: string; readonly provenance: Provenance;
}

export interface Survey {
  readonly siteName: string; readonly address: string; readonly surveyedOn: string;
  readonly surveyorName: string; readonly credential?: string;
  readonly standard: Standard; readonly observations: readonly Observation[];
}

export function barriers(s: Survey): Barrier[] {
  return s.observations.flatMap((o): Barrier[] => {
    if (!isBarrierFinding(o.finding)) return [];
    const found = o.finding.kind === "barrier"
      ? formatted(o.finding.measured.value)
      : formattedAsOneIn(reported((o.finding as { slope: CrossCheckedSlope }).slope));
    return [{
      id: o.id, checkpoint: o.checkpoint, location: o.location, found,
      required: requirementSummary(o.checkpoint.requirement),
      provenance: findingProvenance(o.finding),
    }];
  });
}

export const unverifiedBarriers = (s: Survey): Barrier[] =>
  barriers(s).filter((b) => !isIssuable(b.provenance));

export const notMeasured = (s: Survey): Observation[] =>
  s.observations.filter((o) => o.finding.kind === "notMeasured");

/**
 * The refusal. A survey with any barrier resting on an unverified number cannot
 * be issued as evidence.
 */
export const isSurveyIssuable = (s: Survey): boolean =>
  unverifiedBarriers(s).length === 0 && s.observations.length > 0;

export const slopeDisagreements = (s: Survey): Observation[] =>
  s.observations.filter((o) =>
    (o.finding.kind === "slopeCompliant" || o.finding.kind === "slopeBarrier")
      && disagrees(o.finding.slope));

export function buildReport(s: Survey, quote?: Quote): Report {
  const notices: { kind: "warning" | "refusal"; heading: string; body: string }[] = [];
  const unv = unverifiedBarriers(s);
  if (unv.length > 0) {
    notices.push({
      kind: "refusal", heading: "This survey cannot be issued as evidence.",
      body: `${unv.length} barrier(s) rest on a scanned value that no tape confirmed. `
        + "Measure them and re-issue. A barrier called out on an unverified number will not "
        + "survive being challenged.",
    });
  }
  const nm = notMeasured(s);
  if (nm.length > 0) {
    notices.push({
      kind: "warning", heading: `${nm.length} checkpoint(s) could not be measured.`,
      body: "Each is listed below with the reason. None is recorded as compliant.",
    });
  }
  const sd = slopeDisagreements(s);
  if (sd.length > 0) {
    notices.push({
      kind: "warning", heading: "Slope readings disagreed.",
      body: `On ${sd.length} surface(s) the inertial reading and the scan geometry differed by `
        + "more than half a degree. Those surfaces were re-checked with a level, or they are "
        + "flagged here so they can be.",
    });
  }

  const facts: [string, string][] = [
    ["Site", s.siteName], ["Address", s.address],
    ["Surveyed", s.surveyedOn], ["Surveyor", s.surveyorName],
  ];
  if (s.credential) facts.push(["Credential", s.credential]);
  facts.push(["Against", `${s.standard.name} (${s.standard.edition})`]);

  const bars = barriers(s);
  const sections: Section[] = [{
    heading: "Barriers found",
    summary: bars.length === 0
      ? "No barriers were found at the checkpoints surveyed."
      : `${bars.length} barrier(s). Each shows what was found, what is required, `
        + "and how the number was obtained.",
    ...(bars.length === 0 ? {} : { tables: [{
      columns: ["Location", "Requirement", "Found", "Required", "How measured"],
      rows: bars.map((b) => [text(b.location), text(b.checkpoint.text),
                             text(b.found), text(b.required), mark(b.provenance)]),
    }] }),
  }];

  if (nm.length > 0) {
    sections.push({
      heading: "Not measured",
      summary: "Recorded rather than omitted. None of these is a pass.",
      tables: [{
        columns: ["Location", "Checkpoint", "Why not"],
        rows: nm.map((o) => [text(o.location), text(o.checkpoint.clause),
                             text((o.finding as { reason: string }).reason)]),
      }],
    });
  }

  sections.push({
    heading: "Everything checked",
    tables: [{
      columns: ["Location", "Clause", "Checkpoint", "Result", "How measured"],
      rows: s.observations.map((o) => [
        text(o.location), text(o.checkpoint.clause), text(o.checkpoint.text),
        text(isBarrierFinding(o.finding) ? "Barrier" : "Compliant"),
        mark(findingProvenance(o.finding)),
      ]),
    }],
  });

  if (quote && quote.lines.length > 0) {
    sections.push({
      heading: "Remediation plan",
      summary: isQuoteIssuable(quote)
        ? `Total ${formatMoney(subtotal(quote))}. Phased worst-first.`
        : "NOT ISSUABLE - some lines rest on unverified quantities.",
      tables: [{
        columns: ["Work", "Qty", "Unit", "Basis", "Cost"],
        rows: quote.lines.map((l) => [
          text(l.item.description), text(quantityOf(l).toFixed(2)),
          text(unitLabel(l.item.unit)), mark(l.provenance), money(lineTotal(l)),
        ]),
      }],
    });
  }

  return {
    title: "Accessibility barrier survey",
    subtitle: `${s.siteName} - ${s.surveyedOn}`,
    facts, notices, sections,
    footer: "This survey records measurements and compares them to published thresholds. "
      + "It is not a legal opinion and does not certify compliance. Every figure shows how it "
      + "was obtained. This file is self-contained and opens without an internet connection.",
  };
}

export const render = (s: Survey, quote?: Quote): string => renderReport(buildReport(s, quote));
export type { Slope };
