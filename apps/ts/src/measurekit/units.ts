/**
 * Port of MeasureKit/Length.swift.
 *
 * Swift holds lengths in `Int64` nanometres; TypeScript uses `bigint`, which is
 * arbitrary precision. That difference matters in exactly one place - overflow -
 * so `distance` below keeps the Swift's micrometre reduction rather than taking
 * the freedom, because the point of this file is to prove the SWIFT correct.
 */

export type Nanometres = bigint;

export const NM_PER_MICROMETRE = 1_000n;
export const NM_PER_MILLIMETRE = 1_000_000n;
export const NM_PER_INCH = 25_400_000n;
export const NM_PER_FOOT = 304_800_000n;

/** Int64 bounds, so the port can assert the Swift would not overflow. */
export const INT64_MAX = 9_223_372_036_854_775_807n;
export const INT64_MIN = -9_223_372_036_854_775_808n;

export const fitsInInt64 = (v: bigint): boolean => v >= INT64_MIN && v <= INT64_MAX;

function quantise(value: number, unit: Nanometres): Nanometres {
  if (!Number.isFinite(value)) throw new RangeError(`cannot quantise ${value}`);
  return BigInt(Math.round(value * Number(unit)));
}

export const millimetres = (mm: number): Nanometres => quantise(mm, NM_PER_MILLIMETRE);
export const feet = (v: number): Nanometres => quantise(v, NM_PER_FOOT);

/** Whole inches plus a fraction, the way a tape is read. Matches Length.inches(_:_:_:). */
export function inches(whole: number, numerator = 0, denominator = 1): Nanometres {
  if (denominator <= 0) throw new RangeError("denominator must be positive");
  return BigInt(whole) * NM_PER_INCH
    + (BigInt(numerator) * NM_PER_INCH) / BigInt(denominator);
}

/** The sensor boundary. Rounding happens here, once, and never again. */
export function sensorMetres(metres: number): Nanometres {
  if (!Number.isFinite(metres)) throw new RangeError("cannot quantise a non-finite length");
  return quantise(metres * 1000, NM_PER_MILLIMETRE);
}

export const toMetres = (nm: Nanometres): number => Number(nm) / 1e9;
export const toInches = (nm: Nanometres): number => Number(nm) / Number(NM_PER_INCH);
export const abs = (nm: Nanometres): Nanometres => (nm < 0n ? -nm : nm);
export const maxOf = (a: Nanometres, b: Nanometres): Nanometres => (a > b ? a : b);

/** Integer square root. Floors, never rounds up. */
export function isqrt(value: bigint): bigint {
  if (value < 0n) throw new RangeError("square root of a negative value");
  if (value < 2n) return value;
  let x = value;
  let y = (x + 1n) / 2n;
  while (y < x) { x = y; y = (x + value / x) / 2n; }
  return x;
}

/** Format as `2' 10 3/8"`. `denominator` must be a power of two. */
export function formatted(nm: Nanometres, denominator = 16): string {
  if (denominator < 1 || (denominator & (denominator - 1)) !== 0) {
    throw new RangeError(`denominator must be a power of two, got ${denominator}`);
  }
  const negative = nm < 0n;
  const total = abs(nm);
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

/**
 * Three shapes, tried in order, and the order matters:
 *   `10 3/8`  whole inches and a fraction, which MUST be space-separated
 *   `11/16`   a bare fraction
 *   `34`      whole inches alone
 *
 * Without the explicit alternation a lazy group reads `11/16` as `1` and `1/16`,
 * which is wrong by a whole inch.
 */
const FEET_INCHES =
  /^\s*(-)?\s*(?:(\d+)\s*')?\s*(?:(\d+)\s+(\d+)\/(\d+)|(\d+)\/(\d+)|(\d+))?\s*"?\s*$/;

/** Returns null rather than guessing, matching Swift's `Length.parse` -> `Length?`. */
export function parse(text: string): Nanometres | null {
  const m = FEET_INCHES.exec(text);
  if (!m) return null;
  const [, sign, ft, inchWithFrac, numA, denA, numB, denB, inchAlone] = m;
  const inch = inchWithFrac ?? inchAlone;
  const num = numA ?? numB;
  const den = denA ?? denB;
  if (ft === undefined && inch === undefined && num === undefined) return null;
  if (den !== undefined && BigInt(den) === 0n) return null;

  let nm = 0n;
  if (ft !== undefined) nm += BigInt(ft) * NM_PER_FOOT;
  if (inch !== undefined) nm += BigInt(inch) * NM_PER_INCH;
  if (num !== undefined && den !== undefined) nm += (BigInt(num) * NM_PER_INCH) / BigInt(den);
  return sign === "-" ? -nm : nm;
}
