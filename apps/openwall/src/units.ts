/**
 * Lengths are exact integers in nanometres, held in bigint.
 *
 * Why: a record that says a pipe is 34 3/8" off the east wall must say exactly
 * that in ten years, on any device, with no accumulated float drift. Binary
 * floating point cannot represent 3/8 of an inch, and a record is read by people
 * who work in sixteenths.
 *
 * The sensor boundary is the one place a float is allowed, and it is explicit:
 * `quantiseMetres` is the only door from float geometry into a stored length.
 */

export type Nanometres = bigint;

export const NM_PER_MM = 1_000_000n;
export const NM_PER_INCH = 25_400_000n;
export const NM_PER_FOOT = 304_800_000n;

export const fromMillimetres = (mm: number): Nanometres => quantise(mm, NM_PER_MM);
export const fromInches = (inches: number): Nanometres => quantise(inches, NM_PER_INCH);
export const fromFeet = (feet: number): Nanometres => quantise(feet, NM_PER_FOOT);

/**
 * The sensor boundary. ARKit works in float metres; everything downstream works
 * in exact nanometres. Rounding happens here, once, and never again.
 */
export const quantiseMetres = (metres: number): Nanometres =>
  quantise(metres * 1000, NM_PER_MM);

export const toMetres = (nm: Nanometres): number => Number(nm) / 1e9;
export const toInchesApprox = (nm: Nanometres): number => Number(nm) / Number(NM_PER_INCH);

function quantise(value: number, unit: Nanometres): Nanometres {
  if (!Number.isFinite(value)) {
    throw new RangeError(`cannot quantise a non-finite length: ${value}`);
  }
  return BigInt(Math.round(value * Number(unit)));
}

export const abs = (n: Nanometres): Nanometres => (n < 0n ? -n : n);

/** Integer square root, so a 3D distance stays exact-by-construction. */
export function isqrt(value: bigint): bigint {
  if (value < 0n) throw new RangeError("isqrt of a negative value");
  if (value < 2n) return value;
  let x = value;
  let y = (x + 1n) / 2n;
  while (y < x) {
    x = y;
    y = (x + value / x) / 2n;
  }
  return x;
}

/**
 * Format as feet, inches and a vulgar fraction: `2' 10 3/8"`.
 *
 * `denominator` is the finest fraction shown, and must be a power of two -
 * a tape is not marked in thirds.
 */
export function formatFeetInches(nm: Nanometres, denominator = 16): string {
  if (denominator < 1 || (denominator & (denominator - 1)) !== 0) {
    throw new RangeError(`denominator must be a power of two, got ${denominator}`);
  }
  const negative = nm < 0n;
  const total = abs(nm);
  const denom = BigInt(denominator);

  // Round to the nearest 1/denominator of an inch, half away from zero.
  const ticks = (total * denom * 2n + NM_PER_INCH) / (NM_PER_INCH * 2n);

  const ticksPerFoot = denom * 12n;
  const feet = ticks / ticksPerFoot;
  const rest = ticks % ticksPerFoot;
  const inches = rest / denom;
  let num = rest % denom;
  let den = denom;
  while (num !== 0n && num % 2n === 0n && den % 2n === 0n) {
    num /= 2n;
    den /= 2n;
  }

  const parts: string[] = [];
  if (feet !== 0n) parts.push(`${feet}'`);
  if (num === 0n) {
    if (inches !== 0n || feet === 0n) parts.push(`${inches}"`);
  } else {
    parts.push(inches === 0n ? `${num}/${den}"` : `${inches} ${num}/${den}"`);
  }
  return (negative ? "-" : "") + parts.join(" ");
}

/**
 * Three shapes, tried in order, and the order matters:
 *   `10 3/8`  whole inches and a fraction, which MUST be space-separated
 *   `11/16`   a bare fraction
 *   `34`      whole inches alone
 *
 * Without the explicit alternation, a lazy `(\d+)?` ahead of the fraction reads
 * `11/16` as `1` and `1/16`, which is wrong by an inch.
 */
const FEET_INCHES =
  /^\s*(-)?\s*(?:(\d+)\s*')?\s*(?:(\d+)\s+(\d+)\/(\d+)|(\d+)\/(\d+)|(\d+))?\s*"?\s*$/;

/** Parse `2' 10 3/8"`, `10 3/8"`, `11/16"`, `34"`, `2'`. Throws on anything else. */
export function parseFeetInches(text: string): Nanometres {
  const m = FEET_INCHES.exec(text);
  if (!m) throw new SyntaxError(`not a feet-and-inches measurement: ${JSON.stringify(text)}`);

  const sign = m[1];
  const feet = m[2];
  const inches = m[3] ?? m[8];
  const num = m[4] ?? m[6];
  const den = m[5] ?? m[7];

  if (feet === undefined && inches === undefined && num === undefined) {
    throw new SyntaxError(`not a feet-and-inches measurement: ${JSON.stringify(text)}`);
  }
  if (den !== undefined && BigInt(den) === 0n) {
    throw new SyntaxError(`fraction with zero denominator: ${JSON.stringify(text)}`);
  }

  let nm = 0n;
  if (feet !== undefined) nm += BigInt(feet) * NM_PER_FOOT;
  if (inches !== undefined) nm += BigInt(inches) * NM_PER_INCH;
  if (num !== undefined && den !== undefined) {
    nm += (BigInt(num) * NM_PER_INCH) / BigInt(den);
  }
  return sign === "-" ? -nm : nm;
}
