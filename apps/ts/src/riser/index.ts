/** Port of RiserCore. Fire and life-safety inspection. */

import {
  type Provenance, type Quote, type Report, type Section, isQuoteIssuable, lineTotal,
  formatMoney, mark, money, quantityOf, render as renderReport, subtotal, text,
  unitLabel,
} from "../measurekit/index.js";

export type Severity = "critical" | "nonCritical" | "impairment" | "advisory";

export const SEVERITY_LABEL: Record<Severity, string> = {
  critical: "Critical", nonCritical: "Non-critical",
  impairment: "Impairment", advisory: "Advisory",
};

const SEVERITY_ORDER: Record<Severity, number> = {
  critical: 0, impairment: 1, nonCritical: 2, advisory: 3,
};

export const severityLessThan = (a: Severity, b: Severity): boolean =>
  SEVERITY_ORDER[a] < SEVERITY_ORDER[b];

/**
 * Why something could not be checked.
 *
 * A free-text excuse is not enough - an adjuster reading this later needs a
 * category they can act on.
 */
export type NotVerifiedReason =
  | "inaccessible" | "aboveHardCeiling" | "valveSeized" | "tenantRefusedEntry"
  | "obstructed" | "noWaterAvailable" | "deviceMissing" | "unsafeToAccess";

export const REASON_LABEL: Record<NotVerifiedReason, string> = {
  inaccessible: "Could not reach it",
  aboveHardCeiling: "Above a hard ceiling",
  valveSeized: "Valve would not operate",
  tenantRefusedEntry: "Tenant refused entry",
  obstructed: "Obstructed by stored goods",
  noWaterAvailable: "No water available on site",
  deviceMissing: "Device not found where recorded",
  unsafeToAccess: "Unsafe to access",
};

export const ALL_REASONS = Object.keys(REASON_LABEL) as NotVerifiedReason[];

/**
 * The answer to one inspection question.
 *
 * `notVerified` is the whole point of this product. Elsewhere an inspector who
 * cannot reach a device writes nothing and the report reads as a clean pass.
 * Here it is a first-class answer that cannot be left blank, and it prints.
 */
export type Answer =
  | { readonly kind: "pass" }
  | { readonly kind: "fail"; readonly severity: Severity; readonly note: string }
  | { readonly kind: "notVerified"; readonly reason: NotVerifiedReason; readonly note: string }
  | { readonly kind: "notApplicable"; readonly note: string };

export const isFailure = (a: Answer): boolean => a.kind === "fail";
export const isVerified = (a: Answer): boolean => a.kind === "pass" || a.kind === "fail";

export const answerProvenance = (a: Answer): Provenance => {
  switch (a.kind) {
    case "pass": case "fail": return "measured";
    case "notVerified": return "scanned";
    case "notApplicable": return "derived";
  }
};

export type DeviceKind =
  | "sprinklerHead" | "controlValve" | "gauge" | "fireDepartmentConnection"
  | "alarmDevice" | "backflowPreventer" | "extinguisher" | "standpipe" | "pump";

export type Frequency =
  | "weekly" | "monthly" | "quarterly" | "semiannual" | "annual" | "threeYear" | "fiveYear";

export const FREQUENCY_MONTHS: Record<Frequency, number> = {
  weekly: 0, monthly: 1, quarterly: 3, semiannual: 6, annual: 12, threeYear: 36, fiveYear: 60,
};

/**
 * One question from a standard, held as data.
 *
 * The edition is stored WITH the checkpoint. An inspection done in 2027 must be
 * re-printable in 2032 against the edition that governed it.
 */
export interface Checkpoint {
  readonly id: string;
  readonly standard: string;
  readonly edition: string;
  readonly clause: string;
  readonly text: string;
  readonly appliesTo: DeviceKind;
  readonly frequency: Frequency;
}

export const citation = (c: Checkpoint): string => `${c.standard} ${c.edition} §${c.clause}`;

export interface Device {
  readonly id: string; readonly kind: DeviceKind;
  readonly tag?: string; readonly location: string;
}

export interface CheckResult {
  readonly deviceID: string;
  readonly checkpoint: Checkpoint;
  readonly answer: Answer;
}

export const resultID = (r: CheckResult): string => `${r.deviceID}/${r.checkpoint.id}`;

export interface Building {
  readonly name: string; readonly address: string; readonly devices: readonly Device[];
}

export interface Inspection {
  readonly building: Building;
  /** Supplied, never `new Date()`, so a report is reproducible and testable. */
  readonly performedOn: string;
  readonly inspectorName: string;
  readonly licenceNumber?: string;
  readonly results: readonly CheckResult[];
}

export const failures = (i: Inspection): CheckResult[] => i.results.filter((r) => isFailure(r.answer));
export const unverified = (i: Inspection): CheckResult[] =>
  i.results.filter((r) => r.answer.kind === "notVerified");

/**
 * Every checkpoint has an answer, and none is blank.
 *
 * A report is complete because every question was answered, including with
 * "I could not check this" - not because the inspector stopped typing.
 */
export function unanswered(i: Inspection, expected: readonly string[]): string[] {
  const answered = new Set(i.results.map(resultID));
  return expected.filter((id) => !answered.has(id));
}

export const editionsCited = (i: Inspection): string[] =>
  [...new Set(i.results.map((r) => `${r.checkpoint.standard} ${r.checkpoint.edition}`))].sort();

export interface Deficiency {
  readonly id: string; readonly deviceID: string; readonly severity: Severity;
  readonly description: string; readonly citation: string;
}

/** Worst first. */
export function deficiencies(i: Inspection): Deficiency[] {
  return failures(i)
    .map((r) => {
      const a = r.answer as Extract<Answer, { kind: "fail" }>;
      return {
        id: resultID(r), deviceID: r.deviceID, severity: a.severity,
        description: a.note === "" ? r.checkpoint.text : a.note,
        citation: citation(r.checkpoint),
      };
    })
    .sort((a, b) => SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity]);
}

export function buildReport(i: Inspection, defs: readonly Deficiency[],
                            quote?: Quote): Report {
  const notices: { kind: "warning" | "refusal"; heading: string; body: string }[] = [];
  const nv = unverified(i);
  if (nv.length > 0) {
    notices.push({
      kind: "refusal",
      heading: `${nv.length} item(s) could not be verified.`,
      body: "They are listed in full below with the reason each one could not be checked. "
        + "They are NOT passes, and this report does not claim they are.",
    });
  }
  if (defs.some((d) => d.severity === "critical")) {
    notices.push({
      kind: "warning", heading: "Critical deficiencies found.",
      body: "This system has critical deficiencies. They are listed first below.",
    });
  }

  const facts: [string, string][] = [
    ["Building", i.building.name], ["Address", i.building.address],
    ["Inspected", i.performedOn], ["Inspector", i.inspectorName],
  ];
  if (i.licenceNumber) facts.push(["Licence", i.licenceNumber]);
  facts.push(["Against", editionsCited(i).join(", ")]);

  const sections: Section[] = [];

  if (defs.length > 0) {
    sections.push({
      heading: "Deficiencies", summary: "Worst first.",
      tables: [{
        columns: ["Device", "Severity", "What is wrong", "Reference"],
        rows: defs.map((d) => [text(d.deviceID), text(SEVERITY_LABEL[d.severity]),
                               text(d.description), text(d.citation)]),
      }],
    });
  }

  if (nv.length > 0) {
    sections.push({
      heading: "Not verified",
      summary: "These were not checked, and the reason is recorded for each. "
        + "Treat none of them as a pass.",
      tables: [{
        columns: ["Device", "Checkpoint", "Why not", "Note", "Status"],
        rows: nv.map((r) => {
          const a = r.answer as Extract<Answer, { kind: "notVerified" }>;
          return [text(r.deviceID), text(r.checkpoint.clause),
                  text(REASON_LABEL[a.reason]), text(a.note), mark("scanned")];
        }),
      }],
    });
  }

  sections.push({
    heading: "Full results",
    tables: [{
      columns: ["Device", "Clause", "Requirement", "Result"],
      rows: i.results.map((r) => [text(r.deviceID), text(r.checkpoint.clause),
                                  text(r.checkpoint.text), mark(answerProvenance(r.answer))]),
    }],
  });

  if (quote && quote.lines.length > 0) {
    sections.push({
      heading: "Proposed repairs",
      summary: isQuoteIssuable(quote)
        ? `Total ${formatMoney(subtotal(quote))}.`
        : "NOT ISSUABLE - some lines rest on unverified quantities.",
      tables: [{
        columns: ["Item", "Qty", "Unit", "Basis", "Total"],
        rows: quote.lines.map((l) => [
          text(l.item.description), text(quantityOf(l).toFixed(2)),
          text(unitLabel(l.item.unit)), mark(l.provenance), money(lineTotal(l)),
        ]),
      }],
    });
  }

  return {
    title: "Fire and life-safety inspection",
    subtitle: `${i.building.name} - ${i.performedOn}`,
    facts, notices, sections,
    footer: "This report states what was tested and what was not. Items marked \"not verified\" "
      + "were not inspected and carry the reason why. This file is self-contained and needs no "
      + "internet connection to open.",
  };
}

export const render = (i: Inspection, defs: readonly Deficiency[], quote?: Quote): string =>
  renderReport(buildReport(i, defs, quote));

// ------------------------------------------------------------------ schedule

export interface DueItem {
  readonly id: string; readonly buildingName: string; readonly deviceID: string;
  readonly frequency: Frequency;
  /** Supplied rather than read from a clock, so the schedule is testable. */
  readonly monthsSinceLast: number;
}

export const monthsUntilDue = (d: DueItem): number =>
  FREQUENCY_MONTHS[d.frequency] - d.monthsSinceLast;
export const isOverdue = (d: DueItem): boolean => monthsUntilDue(d) < 0;
export const isDueNow = (d: DueItem): boolean => monthsUntilDue(d) <= 0;

/** Overdue first, then soonest. Device breaks ties so the order is stable. */
export const upcoming = (items: readonly DueItem[], withinMonths: number): DueItem[] =>
  items
    .filter((i) => monthsUntilDue(i) <= withinMonths)
    .sort((a, b) => (monthsUntilDue(a) !== monthsUntilDue(b)
      ? monthsUntilDue(a) - monthsUntilDue(b)
      : a.deviceID.localeCompare(b.deviceID)));

export const overdue = (items: readonly DueItem[]): DueItem[] =>
  items.filter(isOverdue).sort((a, b) => monthsUntilDue(a) - monthsUntilDue(b));
