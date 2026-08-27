/** Port of MeasureKit/Money.swift. Integer cents; no float touches a price. */

import type { Provenance } from "./provenance.js";
import { isIssuable } from "./provenance.js";

export type Cents = bigint;

export const dollars = (d: number): Cents => {
  if (!Number.isFinite(d)) throw new RangeError("cannot make money from a non-finite value");
  return BigInt(Math.round(d * 100));
};

/** Hand-rolled grouping, matching the Swift - no locale formatter. */
export function formatMoney(cents: Cents): string {
  const negative = cents < 0n;
  const total = negative ? -cents : cents;
  let whole = String(total / 100n);
  let grouped = "";
  while (whole.length > 3) {
    grouped = "," + whole.slice(-3) + grouped;
    whole = whole.slice(0, -3);
  }
  grouped = whole + grouped;
  return (negative ? "-$" : "$") + grouped + "." + String(total % 100n).padStart(2, "0");
}

export type PriceUnit = "each" | "lf" | "sf" | "cy" | "hour" | "bag";

export const unitLabel = (u: PriceUnit): string =>
  u === "hour" ? "hr" : u === "each" ? "ea" : u;

export interface PriceItem {
  readonly code: string;
  readonly description: string;
  readonly unit: PriceUnit;
  readonly unitPrice: Cents;
}

export interface QuoteLine {
  readonly item: PriceItem;
  /** Thousandths, so 12.5 lf is exact. */
  readonly quantityMilli: bigint;
  readonly provenance: Provenance;
  readonly note?: string;
}

export const quantityOf = (l: QuoteLine): number => Number(l.quantityMilli) / 1000;

/** Rounded half-up at the last cent, once, so a total never drifts from its lines. */
export const lineTotal = (l: QuoteLine): Cents =>
  (l.item.unitPrice * l.quantityMilli + 500n) / 1000n;

export interface Quote { readonly lines: readonly QuoteLine[] }

export const subtotal = (q: Quote): Cents =>
  q.lines.reduce((sum, l) => sum + lineTotal(l), 0n);

/** Lines resting on numbers nobody verified. */
export const unverifiedLines = (q: Quote): QuoteLine[] =>
  q.lines.filter((l) => !isIssuable(l.provenance));

/**
 * The refusal every product here shares: a sensor's guess never leaves the
 * building as a price.
 */
export const isQuoteIssuable = (q: Quote): boolean =>
  unverifiedLines(q).length === 0 && q.lines.length > 0;
