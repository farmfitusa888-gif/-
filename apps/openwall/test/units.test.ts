import { describe, expect, it } from "vitest";
import {
  NM_PER_FOOT, NM_PER_INCH, formatFeetInches, fromInches, isqrt,
  parseFeetInches, quantiseMetres,
} from "../src/units.js";

describe("exact lengths", () => {
  it("holds an inch exactly", () => {
    expect(fromInches(1)).toBe(NM_PER_INCH);
    expect(fromInches(12)).toBe(NM_PER_FOOT);
  });

  it("represents 3/8 of an inch exactly, which a float cannot", () => {
    const threeEighths = (3n * NM_PER_INCH) / 8n;
    expect(threeEighths).toBe(9_525_000n);
    expect(formatFeetInches(threeEighths)).toBe('3/8"');
  });

  it("formats feet, inches and a reduced fraction", () => {
    const v = 2n * NM_PER_FOOT + 10n * NM_PER_INCH + (3n * NM_PER_INCH) / 8n;
    expect(formatFeetInches(v)).toBe(`2' 10 3/8"`);
  });

  it("reduces fractions rather than printing 8/16", () => {
    expect(formatFeetInches(NM_PER_INCH / 2n)).toBe('1/2"');
    expect(formatFeetInches(NM_PER_INCH / 4n)).toBe('1/4"');
  });

  it("prints zero rather than an empty string", () => {
    expect(formatFeetInches(0n)).toBe('0"');
  });

  it("keeps the sign", () => {
    expect(formatFeetInches(-NM_PER_INCH)).toBe('-1"');
  });

  it("round-trips every sixteenth of an inch over eight feet", () => {
    for (let sixteenths = 0; sixteenths <= 8 * 12 * 16; sixteenths++) {
      const nm = (BigInt(sixteenths) * NM_PER_INCH) / 16n;
      expect(parseFeetInches(formatFeetInches(nm))).toBe(nm);
    }
  });

  it("parses the forms a person actually types", () => {
    expect(parseFeetInches(`2' 10 3/8"`)).toBe(
      2n * NM_PER_FOOT + 10n * NM_PER_INCH + (3n * NM_PER_INCH) / 8n,
    );
    expect(parseFeetInches(`34"`)).toBe(34n * NM_PER_INCH);
    expect(parseFeetInches(`3'`)).toBe(3n * NM_PER_FOOT);
    expect(parseFeetInches(`  6 1/2"  `)).toBe(6n * NM_PER_INCH + NM_PER_INCH / 2n);
  });

  it("refuses nonsense instead of guessing", () => {
    expect(() => parseFeetInches("about a yard")).toThrow(SyntaxError);
    expect(() => parseFeetInches("")).toThrow(SyntaxError);
    expect(() => parseFeetInches(`1 1/0"`)).toThrow(SyntaxError);
  });

  it("rejects a denominator a tape does not have", () => {
    expect(() => formatFeetInches(NM_PER_INCH, 3)).toThrow(RangeError);
  });

  it("refuses to quantise a non-finite sensor reading", () => {
    expect(() => quantiseMetres(Number.NaN)).toThrow(RangeError);
    expect(() => quantiseMetres(Number.POSITIVE_INFINITY)).toThrow(RangeError);
  });

  it("computes integer square roots exactly", () => {
    expect(isqrt(0n)).toBe(0n);
    expect(isqrt(1n)).toBe(1n);
    expect(isqrt(144n)).toBe(12n);
    expect(isqrt(10n ** 18n)).toBe(10n ** 9n);
    expect(isqrt(143n)).toBe(11n); // floors, never rounds up
    expect(() => isqrt(-1n)).toThrow(RangeError);
  });
});
