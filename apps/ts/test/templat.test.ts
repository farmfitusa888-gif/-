/** Port of TemplatCoreTests.swift. */
import { describe, expect, it } from "vitest";
import * as M from "../src/measurekit/index.js";
import * as T from "../src/templat/index.js";

const p = T.point2;

/** A 96 x 25 in run: three cut edges and one wall edge. */
function run(measured: boolean, cutoutVerified = true): T.Template {
  const prov: M.Provenance = measured ? "measured" : "scanned";
  const edge = (id: string, a: T.Point2, b: T.Point2, cut: boolean): T.Edge => ({
    id, from: a, to: b, isCut: cut,
    provenance: cut ? prov : "scanned",
    ...(cut && measured ? { measuredLength: T.distance2(a, b) } : {}),
  });
  return {
    name: "Kitchen run", material: "Quartz", thickness: M.inches(1, 1, 4),
    edges: [
      edge("back", p(0, 0), p(96, 0), false),
      edge("right", p(96, 0), p(96, 25), true),
      edge("front", p(96, 25), p(0, 25), true),
      edge("left", p(0, 25), p(0, 0), true),
    ],
    cutouts: [{
      id: "sink", kind: "undermountSink", centre: p(40, 12),
      width: M.provenanced(M.inches(30), cutoutVerified ? "measured" : "scanned"),
      depth: M.provenanced(M.inches(18), cutoutVerified ? "measured" : "scanned"),
    }],
  };
}

describe("the template", () => {
  it("computes area by shoelace", () => {
    expect(M.squareFeetValue(T.templateArea(run(true)))).toBeCloseTo(2400 / 144, 2);
  });

  it("a measured length overrides the scan", () => {
    const e: T.Edge = { id: "e", from: p(0, 0), to: p(96, 0), isCut: true,
                        provenance: "scanned", measuredLength: M.inches(95, 1, 2) };
    expect(T.edgeLength(e).provenance).toBe("measured");
    expect(M.toInches(T.edgeLength(e).value)).toBeCloseTo(95.5, 6);
  });

  it("keeps the disagreement between tape and scan", () => {
    const bare: T.Edge = { id: "e", from: p(0, 0), to: p(96, 0), isCut: true,
                           provenance: "scanned" };
    expect(T.discrepancy(bare)).toBeUndefined();
    const taped = { ...bare, measuredLength: M.inches(95, 3, 4) };
    expect(M.toInches(T.discrepancy(taped)!)).toBeCloseTo(0.25, 6);
  });

  /** THE REFUSAL - the whole product in one assertion. */
  it("will not export while a cut edge is unverified", () => {
    expect(T.canExportToCNC(run(false))).toBe(false);
    expect(T.canExportToCNC(run(true))).toBe(true);
  });

  it("an unverified cut-out also blocks export", () => {
    expect(T.canExportToCNC(run(true, false))).toBe(false);
  });

  it("a faucet hole does not block export because it is drilled, not sawn", () => {
    const t: T.Template = { ...run(true), cutouts: [{
      id: "f", kind: "faucetHole", centre: p(20, 4),
      width: M.provenanced(M.inches(1, 1, 2), "scanned"),
      depth: M.provenanced(M.inches(1, 1, 2), "scanned"),
    }] };
    expect(T.canExportToCNC(t)).toBe(true);
  });

  it("wall edges do not need a tape because nothing is sawn to them", () => {
    expect(T.carryList(run(false)).some((e) => e.id === "back")).toBe(false);
  });

  it("ranks the longest cut edge first and is deterministic", () => {
    // front is 96 in; left and right are both 25 in, so the id breaks the tie.
    expect(T.carryList(run(false)).map((e) => e.id)).toEqual(["front", "left", "right"]);
    expect(T.carryList(run(false)).map((e) => e.id))
      .toEqual(T.carryList(run(false)).map((e) => e.id));
  });

  it("refusal reasons name the offending edges", () => {
    const reasons = T.refusalReasons(run(false));
    expect(reasons.some((r) => r.includes("front"))).toBe(true);
    expect(reasons.every((r) => r.length > 0)).toBe(true);
  });

  it("area is unsigned, so winding direction does not matter", () => {
    const cw = run(true);
    const ccw: T.Template = { ...cw,
      edges: [...cw.edges].reverse().map((e) => ({ ...e, from: e.to, to: e.from })) };
    expect(T.templateArea(ccw)).toBe(T.templateArea(cw));
    expect(T.templateArea(cw)).toBeGreaterThan(0n);
  });

  it("the carry list honours its limit", () => {
    expect(T.carryList(run(false), 2)).toHaveLength(2);
    expect(T.carryList(run(false), 99)).toHaveLength(3);
  });

  it("an empty template cannot export", () => {
    const empty: T.Template = { name: "t", material: "m", thickness: M.inches(1),
                                edges: [], cutouts: [] };
    expect(T.canExportToCNC(empty)).toBe(false);
    expect(T.templateArea(empty)).toBe(0n);
  });

  it("surfaces the worst tape-to-scan disagreement", () => {
    const t = run(true);
    const edges = t.edges.map((e) =>
      e.id === "right" ? { ...e, measuredLength: M.inches(25, 1, 2) } : e);
    expect(M.toInches(T.worstDiscrepancy({ ...t, edges })!)).toBeCloseTo(0.5, 6);
  });
});

describe("the DXF writer", () => {
  /** Regression for a factor-of-25.4 bug that would have cut every slab wrong. */
  it("declares inches, not millimetres", () => {
    const dxf = T.exportDXF(run(true));
    expect(dxf).toContain("$INSUNITS");
    expect(dxf.split("$INSUNITS")[1]!.startsWith("\n70\n1\n")).toBe(true);
    expect(T.INSUNITS_INCHES).toBe(1);
    expect(T.INSUNITS_INCHES).not.toBe(4);   // 4 is millimetres
    expect(dxf).toContain("$MEASUREMENT");
  });

  it("refuses to export unverified geometry", () => {
    expect(() => T.exportDXF(run(false))).toThrow(T.DXFRefusal);
    try { T.exportDXF(run(false)); } catch (e) {
      expect((e as T.DXFRefusal).reasons.length).toBeGreaterThan(0);
    }
  });

  it("writes a well-formed file", () => {
    const dxf = T.exportDXF(run(true));
    expect(dxf.endsWith("0\nEOF\n")).toBe(true);
    expect(dxf).toContain("SECTION");
    expect(dxf).toContain("ENTITIES");
    expect(dxf.split("\nLINE\n").length - 1).toBe(4);
    expect(dxf.split("LWPOLYLINE").length - 1).toBe(1);
  });

  it("puts verified cuts on their own layer", () => {
    const dxf = T.exportDXF(run(true));
    expect(dxf).toContain("CUT_MEASURED");
    expect(dxf).toContain("REFERENCE");
  });

  it("writes the measured number as dimension text", () => {
    const dxf = T.exportDXF(run(true));
    expect(dxf).toContain("MEASURED");
    expect(dxf.includes(`2' 1"`) || dxf.includes("8'")).toBe(true);
  });

  it("writes coordinates in inches", () => {
    const dxf = T.exportDXF(run(true));
    expect(dxf).toContain("96.000000");
    expect(dxf).not.toContain("2438.4");
  });
});

describe("the quote", () => {
  it("prices off verified geometry", () => {
    const q = T.quoteFor(run(true), 7500n, T.BULLNOSE, 15000n);
    expect(M.isQuoteIssuable(q)).toBe(true);
    expect(M.subtotal(q)).toBeGreaterThan(0n);
  });

  it("a quote on unverified geometry is not issuable", () => {
    const q = T.quoteFor(run(false), 7500n, T.BULLNOSE, 15000n);
    expect(M.isQuoteIssuable(q)).toBe(false);
    expect(M.unverifiedLines(q).length).toBeGreaterThan(0);
  });

  it("omits an edge line when the profile is free", () => {
    const q = T.quoteFor(run(true), 7500n, T.EASED, 15000n);
    expect(q.lines.some((l) => l.item.code === "EDG")).toBe(false);
  });
});
