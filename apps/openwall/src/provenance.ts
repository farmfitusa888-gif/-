/**
 * How every position in a record came to be known.
 *
 * A record is read by somebody about to cut into a wall. The difference between
 * "we saw this and computed where it is" and "we assumed it carries on behind
 * that joist" is the difference between a useful document and a dangerous one,
 * so it is carried on every point and printed on the artefact.
 *
 * Note on naming: a triangulated point is NOT `measured`. It is a sensor result,
 * however good. `measured` is reserved for a number a human put a tape on. The
 * distinction is the point of the product.
 */

export type Provenance =
  /** Computed from two or more posed observations. A sensor result. */
  | "triangulated"
  /** A human put a tape on it. Overrides any sensor value. */
  | "measured"
  /** Inferred between known points, never directly observed. */
  | "derived"
  /** Moved by a re-solve after a measurement elsewhere changed. */
  | "adjusted";

export const PROVENANCE_LABEL: Record<Provenance, string> = {
  triangulated: "Seen and computed",
  measured: "Tape-measured",
  derived: "Inferred, not seen",
  adjusted: "Adjusted by a later measurement",
};

/** Only these may be presented as observed fact. */
export const OBSERVED: ReadonlySet<Provenance> = new Set<Provenance>(["triangulated", "measured"]);

export const isObserved = (p: Provenance): boolean => OBSERVED.has(p);

/**
 * A span between two points is only as trustworthy as its weaker end, and an
 * unobserved end makes the whole span inferred.
 */
export function spanProvenance(a: Provenance, b: Provenance): Provenance {
  if (a === "measured" && b === "measured") return "measured";
  if (!isObserved(a) || !isObserved(b)) return "derived";
  if (a === "adjusted" || b === "adjusted") return "adjusted";
  return "triangulated";
}
