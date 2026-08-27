/** Port of MeasureKit/Provenance.swift. */

import type { Nanometres } from "./units.js";

export type Provenance = "scanned" | "triangulated" | "measured" | "derived" | "adjusted";

export const PROVENANCE_LABEL: Record<Provenance, string> = {
  scanned: "Scanned, not verified",
  triangulated: "Seen and computed",
  measured: "Measured",
  derived: "Inferred, not seen",
  adjusted: "Adjusted by a later measurement",
};

/** Whether anything actually saw this. Only `derived` was never observed. */
export const isObserved = (p: Provenance): boolean => p !== "derived";

/** Whether a document may be issued on this value alone. */
export const isIssuable = (p: Provenance): boolean => p === "measured" || p === "adjusted";

/** How much weight each carries, weakest first. */
const STRENGTH: Record<Provenance, number> = {
  derived: 0, scanned: 1, triangulated: 2, adjusted: 3, measured: 4,
};

/** A span is exactly as strong as its weaker end. */
export const combine = (a: Provenance, b: Provenance): Provenance =>
  STRENGTH[a] <= STRENGTH[b] ? a : b;

export interface Provenanced<T> {
  readonly value: T;
  readonly provenance: Provenance;
  readonly tolerance?: Nanometres;
}

export const provenanced = <T>(
  value: T, provenance: Provenance, tolerance?: Nanometres,
): Provenanced<T> => (tolerance === undefined
  ? { value, provenance }
  : { value, provenance, tolerance });

/** A human types the real number. The sensor's value is replaced, not averaged. */
export const override = <T>(_v: Provenanced<T>, measured: T): Provenanced<T> =>
  ({ value: measured, provenance: "measured" });
