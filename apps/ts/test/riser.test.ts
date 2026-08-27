/** Port of RiserCoreTests.swift. */
import { describe, expect, it } from "vitest";
import * as M from "../src/measurekit/index.js";
import * as R from "../src/riser/index.js";

const checkpoint = (id: string, clause = "5.2.1.1"): R.Checkpoint => ({
  id, standard: "NFPA 25", edition: "2023", clause,
  text: "Sprinklers shall be free of corrosion, foreign materials and paint.",
  appliesTo: "sprinklerHead", frequency: "annual",
});

const inspection = (results: R.CheckResult[]): R.Inspection => ({
  building: { name: "Mill Building", address: "1 Mill St",
              devices: [{ id: "SP-1", kind: "sprinklerHead", location: "Riser room" }] },
  performedOn: "2026-08-27", inspectorName: "S. Inspector",
  licenceNumber: "NICET-II-12345", results,
});

describe("Answer", () => {
  /** The differentiator, enforced in the type system rather than the UI. */
  it("notVerified is never a pass", () => {
    const a: R.Answer = { kind: "notVerified", reason: "aboveHardCeiling", note: "hard lid" };
    expect(R.isVerified(a)).toBe(false);
    expect(R.isFailure(a)).toBe(false);
    expect(R.answerProvenance(a)).toBe("scanned");
    expect(M.isIssuable(R.answerProvenance(a))).toBe(false);
  });

  it("a pass is issuable", () => {
    expect(R.isVerified({ kind: "pass" })).toBe(true);
    expect(M.isIssuable(R.answerProvenance({ kind: "pass" }))).toBe(true);
  });

  it("orders critical first", () => {
    expect(R.severityLessThan("critical", "impairment")).toBe(true);
    expect(R.severityLessThan("impairment", "nonCritical")).toBe(true);
    expect(R.severityLessThan("nonCritical", "advisory")).toBe(true);
  });

  it("every not-verified reason has a label an adjuster can read", () => {
    for (const r of R.ALL_REASONS) expect(R.REASON_LABEL[r].length).toBeGreaterThan(0);
  });
});

describe("Inspection", () => {
  it("separates failures from unverified", () => {
    const i = inspection([
      { deviceID: "SP-1", checkpoint: checkpoint("c1"),
        answer: { kind: "fail", severity: "critical", note: "painted head" } },
      { deviceID: "SP-2", checkpoint: checkpoint("c2"),
        answer: { kind: "notVerified", reason: "aboveHardCeiling", note: "" } },
      { deviceID: "SP-3", checkpoint: checkpoint("c3"), answer: { kind: "pass" } },
    ]);
    expect(R.failures(i)).toHaveLength(1);
    expect(R.unverified(i)).toHaveLength(1);
  });

  it("reports which checkpoints were never answered", () => {
    const i = inspection([{ deviceID: "SP-1", checkpoint: checkpoint("c1"),
                            answer: { kind: "pass" } }]);
    expect(R.unanswered(i, ["SP-1/c1", "SP-1/c2", "SP-2/c1"])).toEqual(["SP-1/c2", "SP-2/c1"]);
  });

  it("cites the edition it was run against", () => {
    expect(R.editionsCited(inspection([
      { deviceID: "SP-1", checkpoint: checkpoint("c1"), answer: { kind: "pass" } },
    ]))).toEqual(["NFPA 25 2023"]);
  });

  it("orders deficiencies worst first", () => {
    const i = inspection([
      { deviceID: "A", checkpoint: checkpoint("c1"),
        answer: { kind: "fail", severity: "advisory", note: "minor" } },
      { deviceID: "B", checkpoint: checkpoint("c2"),
        answer: { kind: "fail", severity: "critical", note: "major" } },
      { deviceID: "C", checkpoint: checkpoint("c3"),
        answer: { kind: "fail", severity: "nonCritical", note: "middling" } },
    ]);
    expect(R.deficiencies(i).map((d) => d.deviceID)).toEqual(["B", "C", "A"]);
  });

  it("falls back to the checkpoint text when no note was written", () => {
    const i = inspection([{ deviceID: "A", checkpoint: checkpoint("c1"),
                            answer: { kind: "fail", severity: "critical", note: "" } }]);
    expect(R.deficiencies(i)[0]!.description).toContain("corrosion");
  });
});

describe("the report", () => {
  const render = (results: R.CheckResult[], quote?: M.Quote) => {
    const i: R.Inspection = { building: { name: "B", address: "A", devices: [] },
                              performedOn: "2026-08-27", inspectorName: "I", results };
    return R.render(i, R.deficiencies(i), quote);
  };

  it("prints unverified items prominently rather than absorbing them", () => {
    const html = render([{ deviceID: "SP-9", checkpoint: checkpoint("c1"),
      answer: { kind: "notVerified", reason: "tenantRefusedEntry", note: "unit 4B" } }]);
    expect(html).toContain("could not be verified");
    expect(html).toContain("Tenant refused entry");
    expect(html).toContain("unit 4B");
    expect(html).toContain("Treat none of them as a pass.");
  });

  it("warns when a critical deficiency exists", () => {
    expect(render([{ deviceID: "SP-1", checkpoint: checkpoint("c1"),
      answer: { kind: "fail", severity: "critical", note: "painted" } }]))
      .toContain("Critical deficiencies found.");
  });

  it("marks a quote resting on unverified quantities", () => {
    const item: M.PriceItem = { code: "R1", description: "Replace head",
                                unit: "each", unitPrice: 8500n };
    const bad = { lines: [{ item, quantityMilli: 1000n, provenance: "scanned" as const }] };
    expect(render([{ deviceID: "SP-1", checkpoint: checkpoint("c1"),
                     answer: { kind: "pass" } }], bad)).toContain("NOT ISSUABLE");

    const good = { lines: [{ item, quantityMilli: 1000n, provenance: "measured" as const }] };
    const ok = render([{ deviceID: "SP-1", checkpoint: checkpoint("c1"),
                         answer: { kind: "pass" } }], good);
    expect(ok).not.toContain("NOT ISSUABLE");
    expect(ok).toContain("$85.00");
  });

  it("fetches nothing at view time", () => {
    const html = render([{ deviceID: "A", checkpoint: checkpoint("c1"),
                           answer: { kind: "pass" } }]);
    expect(html).not.toContain("<script");
    expect(html).not.toContain("https://");
  });
});

describe("the schedule", () => {
  const item = (id: string, frequency: R.Frequency, since: number): R.DueItem =>
    ({ id, buildingName: "B", deviceID: id, frequency, monthsSinceLast: since });

  it("computes what is due, and due today is not yet overdue", () => {
    expect(R.monthsUntilDue(item("a", "annual", 11))).toBe(1);
    expect(R.isDueNow(item("a", "annual", 11))).toBe(false);
    expect(R.isDueNow(item("a", "annual", 12))).toBe(true);
    expect(R.isOverdue(item("a", "annual", 12))).toBe(false);
    expect(R.isOverdue(item("a", "annual", 13))).toBe(true);
  });

  it("orders overdue first, then soonest", () => {
    const items = [item("c", "quarterly", 1), item("a", "annual", 18), item("b", "annual", 12)];
    expect(R.upcoming(items, 6).map((i) => i.deviceID)).toEqual(["a", "b", "c"]);
    expect(R.overdue(items).map((i) => i.deviceID)).toEqual(["a"]);
  });

  it("breaks ties by device so the order is stable", () => {
    const items = [item("z", "annual", 12), item("a", "annual", 12), item("m", "annual", 12)];
    expect(R.upcoming(items, 6).map((i) => i.deviceID)).toEqual(["a", "m", "z"]);
  });

  it("excludes what is beyond the window", () => {
    expect(R.upcoming([item("a", "fiveYear", 1), item("b", "quarterly", 1)], 6)
      .map((i) => i.deviceID)).toEqual(["b"]);
  });
});
