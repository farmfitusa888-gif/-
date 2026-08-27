/** Port of PlumbCoreTests.swift. */
import { describe, expect, it } from "vitest";
import * as M from "../src/measurekit/index.js";
import * as P from "../src/plumb/index.js";

const doorway = P.ADA_CHECKPOINTS.find((c) => c.id === "404.2.3")!;
const ramp = P.ADA_CHECKPOINTS.find((c) => c.id === "405.2")!;
const grabBar = P.ADA_CHECKPOINTS.find((c) => c.id === "604.5")!;

describe("the evaluator", () => {
  it("a minimum is exact at its boundary", () => {
    expect(P.isBarrierFinding(P.evaluateLength(doorway,
      M.provenanced(M.inches(32), "measured")))).toBe(false);
    expect(P.isBarrierFinding(P.evaluateLength(doorway,
      M.provenanced(M.inches(32) - 1n, "measured")))).toBe(true);
  });

  it("a range is inclusive at both ends", () => {
    for (const v of [M.inches(33), M.inches(34), M.inches(36)]) {
      expect(P.isBarrierFinding(P.evaluateLength(grabBar,
        M.provenanced(v, "measured")))).toBe(false);
    }
    expect(P.isBarrierFinding(P.evaluateLength(grabBar,
      M.provenanced(M.inches(33) - 1n, "measured")))).toBe(true);
    expect(P.isBarrierFinding(P.evaluateLength(grabBar,
      M.provenanced(M.inches(36) + 1n, "measured")))).toBe(true);
  });

  it("a slope checkpoint refuses a length and vice versa", () => {
    expect(P.evaluateLength(ramp, M.provenanced(M.inches(10), "measured")).kind)
      .toBe("notMeasured");
    const s = M.slope(M.inches(1), M.inches(12));
    expect(P.evaluateSlope(doorway,
      { fromInertial: s, fromGeometry: s, provenance: "measured" }).kind).toBe("notMeasured");
  });

  it("ramp slope is exact at one in twelve", () => {
    const check = (rise: bigint, run: bigint) => {
      const s = M.slope(rise, run);
      return P.isBarrierFinding(P.evaluateSlope(ramp,
        { fromInertial: s, fromGeometry: s, provenance: "measured" }));
    };
    expect(check(M.inches(1), M.inches(12))).toBe(false);
    expect(check(M.inches(1) + 1n, M.inches(12))).toBe(true);
    expect(check(M.inches(30), M.feet(30))).toBe(false);
    expect(check(M.inches(31), M.feet(30))).toBe(true);
  });

  /** The conservative rule: report the steeper of two disagreeing readings. */
  it("reports the steeper of two disagreeing slope readings", () => {
    const checked: M.CrossCheckedSlope = {
      fromInertial: M.slope(M.inches(1), M.inches(20)),   // compliant
      fromGeometry: M.slope(M.inches(2), M.inches(12)),   // a barrier
      provenance: "measured",
    };
    expect(P.isBarrierFinding(P.evaluateSlope(ramp, checked))).toBe(true);
    expect(M.disagrees(checked)).toBe(true);
  });
});

describe("the survey", () => {
  const survey = (observations: P.Observation[]): P.Survey => ({
    siteName: "Corner Store", address: "2 Main St", surveyedOn: "2026-08-27",
    surveyorName: "S. Surveyor", credential: "CASp-000",
    standard: P.ADA_2010, observations,
  });

  const obs = (id: string, value: bigint, p: M.Provenance): P.Observation => ({
    id, checkpoint: doorway, location: "Front door",
    finding: P.evaluateLength(doorway, M.provenanced(value, p)),
  });

  it("collects barriers with what was found and what is required", () => {
    const s = survey([obs("o1", M.inches(30), "measured")]);
    expect(P.barriers(s)).toHaveLength(1);
    expect(P.barriers(s)[0]!.found).toBe(`2' 6"`);
    expect(P.barriers(s)[0]!.required).toContain("at least");
  });

  /** The central refusal of the product. */
  it("will not issue a survey whose barrier rests on a scanned number", () => {
    const scanned = survey([obs("o1", M.inches(30), "scanned")]);
    expect(P.isSurveyIssuable(scanned)).toBe(false);
    expect(P.unverifiedBarriers(scanned)).toHaveLength(1);
    expect(P.isSurveyIssuable(survey([obs("o1", M.inches(30), "measured")]))).toBe(true);
  });

  it("a compliant scanned value does not block issue", () => {
    // Only BARRIERS need a tape - a compliant scan calls out nobody.
    const s = survey([obs("o1", M.inches(36), "scanned")]);
    expect(P.barriers(s)).toHaveLength(0);
    expect(P.isSurveyIssuable(s)).toBe(true);
  });

  it("an empty survey is not issuable", () => {
    expect(P.isSurveyIssuable(survey([]))).toBe(false);
  });

  it("records what could not be measured rather than omitting it", () => {
    const s = survey([{ id: "o1", checkpoint: doorway, location: "Rear door",
                        finding: { kind: "notMeasured", reason: "blocked by stock" } }]);
    expect(P.notMeasured(s)).toHaveLength(1);
    expect(P.barriers(s)).toHaveLength(0);
  });
});

describe("the report", () => {
  const render = (observations: P.Observation[], quote?: M.Quote) =>
    P.render({ siteName: "S", address: "A", surveyedOn: "2026-08-27", surveyorName: "N",
               standard: P.ADA_2010, observations }, quote);

  it("refuses loudly when a barrier is unverified", () => {
    const html = render([{ id: "o1", checkpoint: doorway, location: "Door",
      finding: P.evaluateLength(doorway, M.provenanced(M.inches(30), "scanned")) }]);
    expect(html).toContain("cannot be issued as evidence");
    expect(html).toContain("no tape confirmed");
  });

  it("states it is not a legal opinion", () => {
    const html = render([{ id: "o1", checkpoint: doorway, location: "Door",
      finding: P.evaluateLength(doorway, M.provenanced(M.inches(36), "measured")) }]);
    expect(html).toContain("not a legal opinion");
    expect(html).toContain("does not certify compliance");
  });

  it("prints the standard edition that governed it", () => {
    expect(render([{ id: "o1", checkpoint: doorway, location: "Door",
      finding: P.evaluateLength(doorway, M.provenanced(M.inches(36), "measured")) }]))
      .toContain("2010");
  });

  it("flags slope disagreement", () => {
    const checked: M.CrossCheckedSlope = {
      fromInertial: M.slope(M.inches(1), M.inches(40)),
      fromGeometry: M.slope(M.inches(2), M.inches(12)),
      provenance: "measured",
    };
    expect(render([{ id: "o1", checkpoint: ramp, location: "Ramp",
      finding: P.evaluateSlope(ramp, checked) }])).toContain("Slope readings disagreed.");
  });

  it("fetches nothing at view time", () => {
    const html = render([{ id: "o1", checkpoint: doorway, location: "D",
      finding: P.evaluateLength(doorway, M.provenanced(M.inches(36), "measured")) }]);
    expect(html).not.toContain("<script");
    expect(html).not.toContain("https://");
  });
});

describe("the checkpoint library", () => {
  it("every checkpoint has a citation and a summary", () => {
    for (const c of P.ADA_CHECKPOINTS) {
      expect(P.checkpointCitation(c).length).toBeGreaterThan(0);
      expect(P.requirementSummary(c.requirement).length).toBeGreaterThan(0);
      expect(c.text.length).toBeGreaterThan(0);
    }
  });

  it("filters by area", () => {
    const parking = P.checkpointsFor("parking");
    expect(parking.length).toBeGreaterThan(0);
    expect(parking.every((c) => c.area === "parking")).toBe(true);
  });

  it("checkpoint ids are unique", () => {
    const ids = P.ADA_CHECKPOINTS.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
