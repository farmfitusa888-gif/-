/** Port of TemplatCore. Countertop templating. */

import {
  type Cents, type Nanometres, type Provenanced, type Provenance, type Quote, type QuoteLine,
  type SquareMillimetres, NM_PER_MILLIMETRE, abs, formatted, inches, isIssuable, isqrt,
  NM_PER_MICROMETRE, squareFeetValue, toInches,
} from "../measurekit/index.js";

export interface Point2 { readonly x: Nanometres; readonly y: Nanometres }

export const point2 = (xInches: number, yInches: number): Point2 =>
  ({ x: inches(xInches), y: inches(yInches) });

export function distance2(a: Point2, b: Point2): Nanometres {
  const dx = (a.x - b.x) / NM_PER_MICROMETRE;
  const dy = (a.y - b.y) / NM_PER_MICROMETRE;
  return isqrt(dx * dx + dy * dy) * NM_PER_MICROMETRE;
}

/**
 * One edge of the outline.
 *
 * Whether an edge will be CUT is the most important flag here: a cut edge is
 * what a slab is sawn to, and it is what the export refuses to release on a
 * scanned number.
 */
export interface Edge {
  readonly id: string;
  readonly from: Point2;
  readonly to: Point2;
  readonly isCut: boolean;
  readonly provenance: Provenance;
  readonly measuredLength?: Nanometres;
}

export const scannedLength = (e: Edge): Nanometres => distance2(e.from, e.to);

/** The number that counts. */
export const edgeLength = (e: Edge): Provenanced<Nanometres> =>
  e.measuredLength !== undefined
    ? { value: e.measuredLength, provenance: "measured" }
    : { value: scannedLength(e), provenance: e.provenance };

/** How far the tape disagreed with the scan. The honest error, kept. */
export const discrepancy = (e: Edge): Nanometres | undefined =>
  e.measuredLength === undefined ? undefined : abs(e.measuredLength - scannedLength(e));

export type CutoutKind =
  | "undermountSink" | "dropInSink" | "cooktop" | "faucetHole" | "soapDispenser" | "outlet";

export const CUTOUT_LABEL: Record<CutoutKind, string> = {
  undermountSink: "Undermount sink", dropInSink: "Drop-in sink", cooktop: "Cooktop",
  faucetHole: "Faucet hole", soapDispenser: "Soap dispenser", outlet: "Outlet",
};

/** A cut-out a slab is SAWN around needs the same verification as an edge. */
export const isSawn = (k: CutoutKind): boolean =>
  k !== "faucetHole" && k !== "soapDispenser" && k !== "outlet";

export interface Cutout {
  readonly id: string; readonly kind: CutoutKind; readonly centre: Point2;
  readonly width: Provenanced<Nanometres>; readonly depth: Provenanced<Nanometres>;
}

export interface Template {
  readonly name: string; readonly material: string; readonly thickness: Nanometres;
  readonly edges: readonly Edge[]; readonly cutouts: readonly Cutout[];
}

/** Shoelace area over the closed outline, in exact square millimetres. */
export function templateArea(t: Template): SquareMillimetres {
  if (t.edges.length < 3) return 0n;
  let twice = 0n;
  for (const e of t.edges) {
    const x1 = e.from.x / NM_PER_MILLIMETRE, y1 = e.from.y / NM_PER_MILLIMETRE;
    const x2 = e.to.x / NM_PER_MILLIMETRE, y2 = e.to.y / NM_PER_MILLIMETRE;
    twice += x1 * y2 - x2 * y1;
  }
  return (twice < 0n ? -twice : twice) / 2n;
}

export const cutEdges = (t: Template): Edge[] => t.edges.filter((e) => e.isCut);

export const unverifiedCutEdges = (t: Template): Edge[] =>
  cutEdges(t).filter((e) => !isIssuable(edgeLength(e).provenance));

export const unverifiedCutouts = (t: Template): Cutout[] =>
  t.cutouts.filter((c) => isSawn(c.kind)
    && (!isIssuable(c.width.provenance) || !isIssuable(c.depth.provenance)));

/**
 * THE REFUSAL.
 *
 * Nobody scraps a slab because a tape was wrong. They scrap it because a number
 * nobody checked looked exactly like a number somebody had.
 */
export const canExportToCNC = (t: Template): boolean =>
  t.edges.length > 0 && unverifiedCutEdges(t).length === 0 && unverifiedCutouts(t).length === 0;

export function refusalReasons(t: Template): string[] {
  const reasons: string[] = [];
  if (t.edges.length === 0) reasons.push("The template has no edges.");
  for (const e of unverifiedCutEdges(t)) {
    reasons.push(`Cut edge ${e.id} has never had a tape on it (${edgeLength(e).provenance}).`);
  }
  for (const c of unverifiedCutouts(t)) {
    reasons.push(`Cut-out ${c.id} (${CUTOUT_LABEL[c.kind]}) is not verified.`);
  }
  return reasons;
}

/**
 * The carry list: edges worth a tape, longest cut edges first.
 *
 * Ranked by length because an error on a long run costs more; id breaks ties so
 * the list never reorders between runs.
 */
export const carryList = (t: Template, limit = 4): Edge[] =>
  unverifiedCutEdges(t)
    .sort((a, b) => {
      const la = scannedLength(a), lb = scannedLength(b);
      return la !== lb ? (lb > la ? 1 : -1) : a.id.localeCompare(b.id);
    })
    .slice(0, limit);

/** The only accuracy figure this product has, and it comes from real jobs. */
export function worstDiscrepancy(t: Template): Nanometres | undefined {
  const all = t.edges.map(discrepancy).filter((d): d is Nanometres => d !== undefined);
  return all.length === 0 ? undefined : all.reduce((a, b) => (a > b ? a : b));
}

// ---------------------------------------------------------------------- DXF

export class DXFRefusal extends Error {
  constructor(public readonly reasons: string[]) {
    super(`refused: ${reasons.join(" ")}`);
  }
}

/**
 * $INSUNITS: 0 unitless, 1 INCHES, 2 feet, 4 millimetres.
 *
 * This was briefly 4 during development, which is millimetres - while the
 * coordinates are written in inches. The file would have opened cleanly, looked
 * correct, and cut every slab 25.4x too small.
 */
export const INSUNITS_INCHES = 1;

export function exportDXF(t: Template): string {
  if (!canExportToCNC(t)) throw new DXFRefusal(refusalReasons(t));

  let out = "";
  const pair = (code: number, value: string) => { out += `${code}\n${value}\n`; };
  const inchesOf = (nm: Nanometres) => toInches(nm).toFixed(6);

  pair(0, "SECTION"); pair(2, "HEADER");
  pair(9, "$INSUNITS"); pair(70, String(INSUNITS_INCHES));
  pair(9, "$MEASUREMENT"); pair(70, "0");
  pair(0, "ENDSEC");

  pair(0, "SECTION"); pair(2, "TABLES");
  pair(0, "TABLE"); pair(2, "LAYER");
  for (const [name, colour] of [["CUT_MEASURED", 3], ["CUT_ADJUSTED", 5],
                                ["REFERENCE", 8], ["CUTOUT", 1], ["DIMENSIONS", 2]] as const) {
    pair(0, "LAYER"); pair(2, name); pair(70, "0"); pair(62, String(colour));
    pair(6, "CONTINUOUS");
  }
  pair(0, "ENDTAB"); pair(0, "ENDSEC");

  pair(0, "SECTION"); pair(2, "ENTITIES");
  for (const e of t.edges) {
    const layer = e.isCut
      ? (edgeLength(e).provenance === "adjusted" ? "CUT_ADJUSTED" : "CUT_MEASURED")
      : "REFERENCE";
    pair(0, "LINE"); pair(8, layer);
    pair(10, inchesOf(e.from.x)); pair(20, inchesOf(e.from.y)); pair(30, "0.0");
    pair(11, inchesOf(e.to.x)); pair(21, inchesOf(e.to.y)); pair(31, "0.0");
  }
  for (const c of t.cutouts) {
    const hw = c.width.value / 2n, hd = c.depth.value / 2n;
    const x0 = c.centre.x - hw, x1 = c.centre.x + hw;
    const y0 = c.centre.y - hd, y1 = c.centre.y + hd;
    pair(0, "LWPOLYLINE"); pair(8, "CUTOUT"); pair(90, "4"); pair(70, "1");
    for (const [x, y] of [[x0, y0], [x1, y0], [x1, y1], [x0, y1]] as const) {
      pair(10, inchesOf(x)); pair(20, inchesOf(y));
    }
  }
  for (const e of cutEdges(t)) {
    const midX = (e.from.x + e.to.x) / 2n, midY = (e.from.y + e.to.y) / 2n;
    pair(0, "TEXT"); pair(8, "DIMENSIONS");
    pair(10, inchesOf(midX)); pair(20, inchesOf(midY)); pair(30, "0.0");
    pair(40, "0.25");
    pair(1, `${formatted(edgeLength(e).value, 16)} MEASURED`);
  }
  pair(0, "ENDSEC");
  pair(0, "EOF");
  return out;
}

// -------------------------------------------------------------------- quote

export interface EdgeProfile { readonly name: string; readonly pricePerLinearFoot: Cents }

export const EASED: EdgeProfile = { name: "Eased", pricePerLinearFoot: 0n };
export const BULLNOSE: EdgeProfile = { name: "Full bullnose", pricePerLinearFoot: 1200n };
export const MITRED: EdgeProfile = { name: "Mitred", pricePerLinearFoot: 4500n };

/** Every line inherits the provenance of the measurement that produced it. */
export function quoteFor(t: Template, materialPerSquareFoot: Cents,
                         profile: EdgeProfile, cutoutPrice: Cents): Quote {
  const lines: QuoteLine[] = [];
  const areaProvenance: Provenance = canExportToCNC(t) ? "measured" : "scanned";
  const sqft = squareFeetValue(templateArea(t));

  lines.push({
    item: { code: "MAT", description: `${t.material}, supply and fabricate`,
            unit: "sf", unitPrice: materialPerSquareFoot },
    quantityMilli: BigInt(Math.round(sqft * 1000)),
    provenance: areaProvenance,
  });

  if (profile.pricePerLinearFoot > 0n) {
    const lf = cutEdges(t).reduce((sum, e) => sum + toInches(edgeLength(e).value) / 12, 0);
    lines.push({
      item: { code: "EDG", description: `${profile.name} edge`,
              unit: "lf", unitPrice: profile.pricePerLinearFoot },
      quantityMilli: BigInt(Math.round(lf * 1000)),
      provenance: unverifiedCutEdges(t).length === 0 ? "measured" : "scanned",
    });
  }

  for (const c of t.cutouts) {
    if (!isSawn(c.kind)) continue;
    lines.push({
      item: { code: "CUT", description: CUTOUT_LABEL[c.kind], unit: "each",
              unitPrice: cutoutPrice },
      quantityMilli: 1000n,
      provenance: isIssuable(c.width.provenance) && isIssuable(c.depth.provenance)
        ? "measured" : "scanned",
    });
  }

  return { lines };
}
