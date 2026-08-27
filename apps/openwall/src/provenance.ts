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

/** Whether anything actually saw this. Only `derived` was never observed. */
export const isObserved = (p: Provenance): boolean => p !== "derived";

/**
 * How much weight each carries, weakest first.
 *
 * An earlier version of this file kept a set of "observed" values that left
 * `adjusted` out, which made `spanProvenance("adjusted", "measured")` return
 * `derived` - claiming nothing had seen a span that a tape measurement had
 * moved - and left the `adjusted` branch below unreachable. An explicit ordering
 * cannot go subtly wrong in that way.
 */
const STRENGTH: Record<Provenance, number> = {
  derived: 0,
  triangulated: 1,
  adjusted: 2,
  measured: 3,
};

/** A span is exactly as trustworthy as its weaker end. */
export const spanProvenance = (a: Provenance, b: Provenance): Provenance =>
  STRENGTH[a] <= STRENGTH[b] ? a : b;
