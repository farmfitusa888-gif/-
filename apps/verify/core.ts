/**
 * Reference port of the remaining MeasureKit / app-core algorithms.
 *
 * `vectors.ts` covers the geometry. This file covers everything else whose
 * expected value appears in a Swift test: money formatting, areas, the shoelace
 * area, the DXF writer's structure, the inspection schedule, the accessibility
 * evaluator, leveller quantities, and the provenance lattice.
 *
 * Structurally identical to the Swift on purpose. If the two disagree, one of
 * them is wrong.
 */

const NM_PER_MM = 1_000_000n;
const NM_PER_INCH = 25_400_000n;
const NM_PER_FOOT = 304_800_000n;
const MM2_PER_SQFT = 92_903n;

export const inches = (n: number) => BigInt(n) * NM_PER_INCH;
export const feet = (n: number) => BigInt(n) * NM_PER_FOOT;
export const frac = (num: number, den: number) => (BigInt(num) * NM_PER_INCH) / BigInt(den);

// ------------------------------------------------------------------- money

/** Mirrors Money.formatted - a hand-rolled grouping, no locale formatter. */
export function formatMoney(cents: bigint): string {
  const negative = cents < 0n;
  const total = negative ? -cents : cents;
  let whole = String(total / 100n);
  let grouped = "";
  while (whole.length > 3) {
    grouped = "," + whole.slice(-3) + grouped;
    whole = whole.slice(0, -3);
  }
  grouped = whole + grouped;
  const fraction = String(total % 100n).padStart(2, "0");
  return (negative ? "-$" : "$") + grouped + "." + fraction;
}

// -------------------------------------------------------------------- area

export const squareFeet = (v: number): bigint => BigInt(Math.round(v * Number(MM2_PER_SQFT)));
export const squareFeetValue = (mm2: bigint): number => Number(mm2) / Number(MM2_PER_SQFT);

/** Mirrors Area.of - millimetre reduction before multiplying. */
export const areaOf = (a: bigint, b: bigint): bigint => (a / NM_PER_MM) * (b / NM_PER_MM);

// ---------------------------------------------------------------- lengths

/** Mirrors Length.formatted. */
export function formatLength(nm: bigint, denominator = 16): string {
  if (denominator < 1 || (denominator & (denominator - 1)) !== 0) {
    throw new RangeError("denominator must be a power of two");
  }
  const negative = nm < 0n;
  const total = negative ? -nm : nm;
  const denom = BigInt(denominator);
  const ticks = (total * denom * 2n + NM_PER_INCH) / (NM_PER_INCH * 2n);
  const ticksPerFoot = denom * 12n;
  const ft = ticks / ticksPerFoot;
  const rest = ticks % ticksPerFoot;
  const inch = rest / denom;
  let num = rest % denom;
  let den = denom;
  while (num !== 0n && num % 2n === 0n && den % 2n === 0n) { num /= 2n; den /= 2n; }
  const parts: string[] = [];
  if (ft !== 0n) parts.push(`${ft}'`);
  if (num === 0n) {
    if (inch !== 0n || ft === 0n) parts.push(`${inch}"`);
  } else if (inch === 0n) {
    parts.push(`${num}/${den}"`);
  } else {
    parts.push(`${inch} ${num}/${den}"`);
  }
  return (negative ? "-" : "") + parts.join(" ");
}

/** Mirrors ReportRenderer.formatTolerance - never rounds down to a false zero. */
export function formatTolerance(nm: bigint): string {
  const thirtySecond = NM_PER_INCH / 32n;
  const magnitude = nm < 0n ? -nm : nm;
  if (magnitude === 0n) return '0"';
  if (magnitude < thirtySecond) return '&lt; 1/32"';
  return formatLength(nm, 32);
}

// ------------------------------------------------------------- provenance

export type Provenance = "scanned" | "triangulated" | "measured" | "derived" | "adjusted";

export const isObserved = (p: Provenance) => p !== "derived";
export const isIssuable = (p: Provenance) => p === "measured" || p === "adjusted";

const STRENGTH: Record<Provenance, number> = {
  derived: 0, scanned: 1, triangulated: 2, adjusted: 3, measured: 4,
};

/** Mirrors MeasureKit.combine - a span is as strong as its weaker end. */
export const combine = (a: Provenance, b: Provenance): Provenance =>
  STRENGTH[a] <= STRENGTH[b] ? a : b;

// ---------------------------------------------------------------- shoelace

export interface Pt { x: bigint; y: bigint }

/** Mirrors Template.area - shoelace over closed edges, in square millimetres. */
export function shoelaceArea(edges: { from: Pt; to: Pt }[]): bigint {
  if (edges.length < 3) return 0n;
  let twice = 0n;
  for (const e of edges) {
    const x1 = e.from.x / NM_PER_MM, y1 = e.from.y / NM_PER_MM;
    const x2 = e.to.x / NM_PER_MM, y2 = e.to.y / NM_PER_MM;
    twice += x1 * y2 - x2 * y1;
  }
  return (twice < 0n ? -twice : twice) / 2n;
}

// ------------------------------------------------------------------- DXF

export interface DxfEdge { id: string; from: Pt; to: Pt; isCut: boolean; provenance: Provenance }

/** Mirrors DXFWriter.export structure. 1 = inches; 4 would be millimetres. */
export function writeDXF(edges: DxfEdge[], cutouts: number, insunits = 1): string {
  let out = "";
  const pair = (code: number, value: string) => { out += `${code}\n${value}\n`; };
  const inchesOf = (nm: bigint) => (Number(nm) / Number(NM_PER_INCH)).toFixed(6);

  pair(0, "SECTION"); pair(2, "HEADER");
  pair(9, "$INSUNITS"); pair(70, String(insunits));
  pair(9, "$MEASUREMENT"); pair(70, "0");
  pair(0, "ENDSEC");

  pair(0, "SECTION"); pair(2, "TABLES");
  pair(0, "TABLE"); pair(2, "LAYER");
  for (const [name, colour] of [["CUT_MEASURED", 3], ["CUT_ADJUSTED", 5],
                                ["REFERENCE", 8], ["CUTOUT", 1], ["DIMENSIONS", 2]] as const) {
    pair(0, "LAYER"); pair(2, String(name)); pair(70, "0"); pair(62, String(colour));
    pair(6, "CONTINUOUS");
  }
  pair(0, "ENDTAB"); pair(0, "ENDSEC");

  pair(0, "SECTION"); pair(2, "ENTITIES");
  for (const e of edges) {
    const layer = e.isCut
      ? (e.provenance === "adjusted" ? "CUT_ADJUSTED" : "CUT_MEASURED")
      : "REFERENCE";
    pair(0, "LINE"); pair(8, layer);
    pair(10, inchesOf(e.from.x)); pair(20, inchesOf(e.from.y)); pair(30, "0.0");
    pair(11, inchesOf(e.to.x)); pair(21, inchesOf(e.to.y)); pair(31, "0.0");
  }
  for (let i = 0; i < cutouts; i++) {
    pair(0, "LWPOLYLINE"); pair(8, "CUTOUT"); pair(90, "4"); pair(70, "1");
  }
  pair(0, "ENDSEC");
  pair(0, "EOF");
  return out;
}

// -------------------------------------------------------------- schedule

export interface Due { deviceID: string; frequencyMonths: number; monthsSinceLast: number }

export const monthsUntilDue = (d: Due) => d.frequencyMonths - d.monthsSinceLast;
export const isOverdue = (d: Due) => monthsUntilDue(d) < 0;
export const isDueNow = (d: Due) => monthsUntilDue(d) <= 0;

/** Mirrors Schedule.upcoming - overdue first, then soonest, id breaks ties. */
export function upcoming(items: Due[], withinMonths: number): Due[] {
  return items
    .filter((i) => monthsUntilDue(i) <= withinMonths)
    .sort((a, b) => {
      const d = monthsUntilDue(a) - monthsUntilDue(b);
      return d !== 0 ? d : a.deviceID.localeCompare(b.deviceID);
    });
}

// ------------------------------------------------------------- evaluator

export type Requirement =
  | { kind: "minimum"; value: bigint }
  | { kind: "maximum"; value: bigint }
  | { kind: "range"; min: bigint; max: bigint };

/** Mirrors Evaluator.evaluate for lengths. Exact integer comparison. */
export function isBarrier(req: Requirement, measured: bigint): boolean {
  switch (req.kind) {
    case "minimum": return measured < req.value;
    case "maximum": return measured > req.value;
    case "range": return measured < req.min || measured > req.max;
  }
}

// -------------------------------------------------------------- leveller

/** Mirrors Leveller.bags - rounds UP, because arriving short stops the job. */
export function bags(areaMm2: bigint, meanDepthNm: bigint,
                     coverageSqFtPerBagAtOneInch: number, wasteFactor = 0.10): number {
  if (areaMm2 <= 0n || meanDepthNm <= 0n || coverageSqFtPerBagAtOneInch <= 0) return 0;
  const areaSqFt = squareFeetValue(areaMm2);
  const depthInches = Number(meanDepthNm) / Number(NM_PER_INCH);
  const coverage = coverageSqFtPerBagAtOneInch / depthInches;
  return Math.ceil((areaSqFt / coverage) * (1 + wasteFactor));
}

/** Mirrors Leveller.meanDepth - half the gap, because a hollow is a wedge. */
export function meanDepth(gaps: bigint[]): bigint {
  if (gaps.length === 0) return 0n;
  const total = gaps.reduce((a, b) => a + b, 0n);
  return total / BigInt(gaps.length) / 2n;
}

// --------------------------------------------------------------- ranking

export interface Ranked { id: string; size: bigint }

/** Mirrors carryList in Templat and Flatline - size desc, id breaks ties. */
export function carryList(items: Ranked[], limit: number): string[] {
  return [...items]
    .sort((a, b) => (a.size !== b.size ? (b.size > a.size ? 1 : -1)
                                       : a.id.localeCompare(b.id)))
    .slice(0, limit)
    .map((i) => i.id);
}
