/** Port of FlatlineCore. Floor-prep screening. */

import {
  type Nanometres, type Provenanced, type Quote, type Report, type Section,
  type SquareMillimetres, type SurfaceSample, formatMoney, formatted, inches, isIssuable,
  isQuoteIssuable, feet, lengthCell, lineTotal, mark, money, quantityOf,
  render as renderReport, squareFeetValue, subtotal, text, tolerance as toleranceCell,
  unitLabel, worstGapUnderStraightedge,
} from "../measurekit/index.js";

/**
 * A flooring manufacturer's flatness tolerance, in its own terms.
 *
 * Written as "1/8 inch over 6 feet", never as an F-number, so the model matches
 * the specification rather than approximating it.
 */
export interface FlatnessTolerance {
  readonly gap: Nanometres; readonly span: Nanometres; readonly source: string;
}

export const toleranceSummary = (t: FlatnessTolerance): string =>
  `${formatted(t.gap)} over ${formatted(t.span)}`;

export const LVP_SIX_FOOT: FlatnessTolerance = {
  gap: inches(0, 1, 8), span: feet(6),
  source: "Typical LVP manufacturer requirement, 1/8 in over 6 ft",
};
export const LVP_FOUR_FOOT: FlatnessTolerance = {
  gap: inches(0, 1, 8), span: feet(4),
  source: "Alternate published requirement, 1/8 in over 4 ft",
};
export const TEN_FOOT: FlatnessTolerance = {
  gap: inches(0, 3, 16), span: feet(10),
  source: "Published requirement, 3/16 in over 10 ft",
};
export const ALL_TOLERANCES = [LVP_SIX_FOOT, LVP_FOUR_FOOT, TEN_FOOT];

/**
 * THE REFUSAL, printed on every output this product makes.
 *
 * ASTM E1155 needs precision on the order of ±0.5 mm over 5 m. A phone is not
 * within an order of magnitude of that.
 */
export const E1155_REFUSAL =
  "This is NOT an ASTM E1155 test and must not be used as one. It produces no FF or FL number. "
  + "It is a relative survey that ranks where to place a straightedge, plus the measurements a "
  + "person then took with one.";

export interface Suspect {
  readonly id: string;
  readonly along: Nanometres;
  /** What the scan thinks. Always `scanned` - never issued as fact. */
  readonly scannedGap: Nanometres;
  /** What a person read with a real straightedge, once they did. */
  readonly measuredGap?: Nanometres;
}

/** The number that counts: the person's, if they took one. */
export const suspectGap = (s: Suspect): Provenanced<Nanometres> =>
  s.measuredGap !== undefined
    ? { value: s.measuredGap, provenance: "measured" }
    : { value: s.scannedGap, provenance: "scanned" };

export const exceeds = (s: Suspect, t: FlatnessTolerance): boolean =>
  suspectGap(s).value > t.gap;

export interface FloorSurvey {
  readonly roomName: string;
  readonly tolerance: FlatnessTolerance;
  readonly samples: readonly SurfaceSample[];
  readonly suspects: readonly Suspect[];
  readonly area: SquareMillimetres;
}

export const worstScannedGap = (f: FloorSurvey): Nanometres =>
  worstGapUnderStraightedge(f.samples, f.tolerance.span);

export const failing = (f: FloorSurvey): Suspect[] =>
  f.suspects.filter((s) => exceeds(s, f.tolerance));

export const unverifiedSuspects = (f: FloorSurvey): Suspect[] =>
  f.suspects.filter((s) => s.measuredGap === undefined);

/** The refusal: a floor is not called out as failing on a scan alone. */
export const isIssuableSurvey = (f: FloorSurvey): boolean =>
  f.suspects.length > 0 && failing(f).every((s) => isIssuable(suspectGap(s).provenance));

/**
 * The carry list: where to put the straightedge, worst first.
 *
 * Gap decides; id breaks ties, because a list somebody works down with a tape
 * cannot reorder itself between runs.
 */
export const carryList = (f: FloorSurvey, limit = 6): Suspect[] =>
  f.suspects
    .filter((s) => s.measuredGap === undefined)
    .sort((a, b) => (a.scannedGap !== b.scannedGap
      ? (b.scannedGap > a.scannedGap ? 1 : -1)
      : a.id.localeCompare(b.id)))
    .slice(0, limit);

/**
 * Mean fill depth over the failing suspects. Half the gap, because a hollow is a
 * wedge rather than a trench.
 */
export function meanDepth(f: readonly Suspect[]): Nanometres {
  if (f.length === 0) return 0n;
  const total = f.reduce((t, s) => t + suspectGap(s).value, 0n);
  return total / BigInt(f.length) / 2n;
}

/** Bags of self-levelling underlayment. Rounds UP: arriving short stops the job. */
export function bags(area: SquareMillimetres, depth: Nanometres,
                     coverageSqFtPerBagAtOneInch: number, wasteFactor = 0.10): number {
  if (area <= 0n || depth <= 0n || coverageSqFtPerBagAtOneInch <= 0) return 0;
  const areaSqFt = squareFeetValue(area);
  const depthInches = Number(depth) / Number(inches(1));
  const coverage = coverageSqFtPerBagAtOneInch / depthInches;
  return Math.ceil((areaSqFt / coverage) * (1 + wasteFactor));
}

export function buildReport(f: FloorSurvey, quote: Quote | undefined,
                            installerName: string, jobAddress: string,
                            preparedOn: string): Report {
  const notices: { kind: "warning" | "refusal"; heading: string; body: string }[] = [
    { kind: "refusal", heading: "Not an ASTM E1155 test.", body: E1155_REFUSAL },
  ];
  const unv = unverifiedSuspects(f);
  if (unv.length > 0) {
    notices.push({
      kind: "warning",
      heading: `${unv.length} suspect location(s) still need a straightedge.`,
      body: "They are ranked below. Until a person measures them, the figures beside them are "
        + "the scan's guess and are marked as such.",
    });
  }
  if (!isIssuableSurvey(f)) {
    notices.push({
      kind: "refusal", heading: "This change order cannot be issued yet.",
      body: "One or more failing locations rest on a scanned value. Put a real straightedge on "
        + "them, type what you read, and re-issue.",
    });
  }

  const sections: Section[] = [{
    heading: "Where to put the straightedge",
    summary: "Ranked by how bad the scan thinks it is. The scan does not decide - "
      + "it just tells you where to look.",
    tables: [{
      columns: ["#", "Along the line", "Scan says", "You measured", "Basis"],
      rows: f.suspects.map((s, i) => [
        text(String(i + 1)), lengthCell(s.along), toleranceCell(s.scannedGap),
        s.measuredGap === undefined ? text("not yet") : lengthCell(s.measuredGap),
        mark(suspectGap(s).provenance),
      ]),
    }],
  }];

  const fail = failing(f);
  if (fail.length > 0) {
    sections.push({
      heading: "Out of tolerance",
      summary: `Against ${toleranceSummary(f.tolerance)} (${f.tolerance.source}).`,
      tables: [{
        columns: ["Along the line", "Gap", "Allowed", "Basis"],
        rows: fail.map((s) => [lengthCell(s.along), lengthCell(suspectGap(s).value),
                               lengthCell(f.tolerance.gap), mark(suspectGap(s).provenance)]),
      }],
    });
  }

  if (quote && quote.lines.length > 0) {
    sections.push({
      heading: "Floor preparation",
      summary: isQuoteIssuable(quote)
        ? `Total ${formatMoney(subtotal(quote))}.`
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
    title: "Floor preparation - change order",
    subtitle: `${f.roomName} - ${preparedOn}`,
    facts: [["Job", jobAddress], ["Prepared by", installerName],
            ["Date", preparedOn], ["Tolerance", toleranceSummary(f.tolerance)]],
    notices, sections,
    footer: "Quantities are estimates with a stated waste factor, not exact counts. This "
      + "document records the condition of the subfloor on the date above. It is "
      + "self-contained and opens without an internet connection.",
  };
}

export const render = (f: FloorSurvey, quote: Quote | undefined, installerName: string,
                       jobAddress: string, preparedOn: string): string =>
  renderReport(buildReport(f, quote, installerName, jobAddress, preparedOn));
