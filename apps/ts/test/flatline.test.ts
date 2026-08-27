/** Port of FlatlineCoreTests.swift. */
import { describe, expect, it } from "vitest";
import * as M from "../src/measurekit/index.js";
import * as F from "../src/flatline/index.js";

const sample = (posIn: number, thou: number): M.SurfaceSample =>
  ({ position: M.inches(posIn), height: (BigInt(thou) * M.NM_PER_INCH) / 1000n });

const survey = (suspects: F.Suspect[], samples: M.SurfaceSample[] = []): F.FloorSurvey =>
  ({ roomName: "Kitchen", tolerance: F.LVP_SIX_FOOT, samples, suspects,
     area: M.squareFeet(200) });

describe("tolerances", () => {
  it("are held in their own terms", () => {
    expect(F.toleranceSummary(F.LVP_SIX_FOOT)).toBe(`1/8" over 6'`);
    expect(F.toleranceSummary(F.TEN_FOOT)).toBe(`3/16" over 10'`);
  });

  it("every tolerance says where it came from", () => {
    for (const t of F.ALL_TOLERANCES) expect(t.source.length).toBeGreaterThan(0);
  });

  it("the E1155 refusal is explicit", () => {
    expect(F.E1155_REFUSAL).toContain("NOT an ASTM E1155 test");
    expect(F.E1155_REFUSAL).toContain("no FF or FL number");
  });
});

describe("the floor survey", () => {
  it("uses the straightedge model for the worst scanned gap", () => {
    const dip = [sample(0, 0), sample(12, 0), sample(24, 0), sample(36, -125),
                 sample(48, 0), sample(60, 0), sample(72, 0)];
    expect(F.worstScannedGap(survey([], dip))).toBe(M.inches(0, 1, 8));
  });

  it("ranks the carry list worst first and drops measured ones", () => {
    const s = survey([
      { id: "a", along: M.feet(2), scannedGap: M.inches(0, 1, 16) },
      { id: "b", along: M.feet(8), scannedGap: M.inches(0, 1, 4) },
      { id: "c", along: M.feet(14), scannedGap: M.inches(0, 1, 8) },
      { id: "d", along: M.feet(20), scannedGap: M.inches(0, 1, 2),
        measuredGap: M.inches(0, 1, 2) },
    ]);
    expect(F.carryList(s).map((x) => x.id)).toEqual(["b", "c", "a"]);
  });

  it("breaks carry-list ties by id so it never reorders", () => {
    const s = survey([
      { id: "z", along: M.feet(1), scannedGap: M.inches(0, 1, 8) },
      { id: "a", along: M.feet(2), scannedGap: M.inches(0, 1, 8) },
    ]);
    expect(F.carryList(s).map((x) => x.id)).toEqual(["a", "z"]);
  });

  it("a measured gap overrides the scan", () => {
    const s: F.Suspect = { id: "a", along: M.feet(2), scannedGap: M.inches(0, 1, 4),
                           measuredGap: M.inches(0, 1, 16) };
    expect(F.suspectGap(s).provenance).toBe("measured");
    expect(F.suspectGap(s).value).toBe(M.inches(0, 1, 16));
    expect(F.exceeds(s, F.LVP_SIX_FOOT)).toBe(false);
  });

  /** The central refusal. */
  it("will not issue while a failing location rests on a scan", () => {
    expect(F.isIssuableSurvey(survey([
      { id: "a", along: M.feet(2), scannedGap: M.inches(0, 1, 4) },
    ]))).toBe(false);
    expect(F.isIssuableSurvey(survey([
      { id: "a", along: M.feet(2), scannedGap: M.inches(0, 1, 4),
        measuredGap: M.inches(0, 1, 4) },
    ]))).toBe(true);
  });

  it("a passing scan does not block issue", () => {
    const s = survey([{ id: "a", along: M.feet(2), scannedGap: M.inches(0, 1, 32) }]);
    expect(F.failing(s)).toHaveLength(0);
    expect(F.isIssuableSurvey(s)).toBe(true);
  });

  it("an empty survey is not issuable", () => {
    expect(F.isIssuableSurvey(survey([]))).toBe(false);
  });
});

describe("leveller quantities", () => {
  it("mean depth is half the gap, because a hollow is a wedge", () => {
    expect(F.meanDepth([
      { id: "a", along: 0n, scannedGap: M.inches(0, 1, 4), measuredGap: M.inches(0, 1, 4) },
      { id: "b", along: 0n, scannedGap: M.inches(0, 1, 4), measuredGap: M.inches(0, 1, 2) },
    ])).toBe(M.inches(0, 3, 16));
    expect(F.meanDepth([])).toBe(0n);
  });

  it("rounds bags up, because arriving short stops the job", () => {
    expect(F.bags(M.squareFeet(200), M.inches(0, 1, 4), 40)).toBe(2);
  });

  it("scales with depth", () => {
    expect(F.bags(M.squareFeet(1000), M.inches(0, 1, 8), 40, 0)).toBe(4);
    expect(F.bags(M.squareFeet(1000), M.inches(0, 1, 4), 40, 0)).toBe(7);
  });

  it("returns zero rather than dividing by zero", () => {
    expect(F.bags(0n, M.inches(1), 40)).toBe(0);
    expect(F.bags(M.squareFeet(100), 0n, 40)).toBe(0);
    expect(F.bags(M.squareFeet(100), M.inches(1), 0)).toBe(0);
  });
});

describe("the change order", () => {
  const render = (suspects: F.Suspect[], quote?: M.Quote) =>
    F.render(survey(suspects), quote, "I", "A", "2026-08-27");

  it("always prints the E1155 refusal", () => {
    const html = render([{ id: "a", along: 0n, scannedGap: M.inches(0, 1, 32) }]);
    expect(html).toContain("Not an ASTM E1155 test.");
    expect(html).toContain("no FF or FL number");
  });

  it("refuses to issue while a failing location is unmeasured", () => {
    const html = render([{ id: "a", along: 0n, scannedGap: M.inches(0, 1, 4) }]);
    expect(html).toContain("cannot be issued yet");
    expect(html).toContain("still need a straightedge");
  });

  it("says quantities are estimates", () => {
    expect(render([{ id: "a", along: 0n, scannedGap: M.inches(0, 1, 32) }]))
      .toContain("estimates with a stated waste factor, not exact counts");
  });

  it("fetches nothing at view time", () => {
    const html = render([{ id: "a", along: 0n, scannedGap: M.inches(0, 1, 32) }]);
    expect(html).not.toContain("<script");
    expect(html).not.toContain("https://");
  });
});
