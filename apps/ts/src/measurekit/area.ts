/** Port of MeasureKit/Area.swift. Integer square millimetres. */

import { type Nanometres, NM_PER_MILLIMETRE } from "./units.js";

export type SquareMillimetres = bigint;

export const MM2_PER_SQUARE_METRE = 1_000_000n;
/** 1 ft² = 92,903.04 mm², rounded to the square millimetre. */
export const MM2_PER_SQUARE_FOOT = 92_903n;

export const ZERO_AREA: SquareMillimetres = 0n;

export function squareFeet(v: number): SquareMillimetres {
  if (!Number.isFinite(v)) throw new RangeError("cannot make an area from a non-finite value");
  return BigInt(Math.round(v * Number(MM2_PER_SQUARE_FOOT)));
}

export function squareMetres(v: number): SquareMillimetres {
  if (!Number.isFinite(v)) throw new RangeError("cannot make an area from a non-finite value");
  return BigInt(Math.round(v * Number(MM2_PER_SQUARE_METRE)));
}

/** The product of two lengths, in millimetres to stay inside Int64. */
export const areaOf = (a: Nanometres, b: Nanometres): SquareMillimetres =>
  (a / NM_PER_MILLIMETRE) * (b / NM_PER_MILLIMETRE);

export const squareFeetValue = (mm2: SquareMillimetres): number =>
  Number(mm2) / Number(MM2_PER_SQUARE_FOOT);

export const formattedSquareFeet = (mm2: SquareMillimetres): string =>
  `${squareFeetValue(mm2).toFixed(1)} sq ft`;
