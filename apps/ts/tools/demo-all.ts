/**
 * Drive every core end to end and write one real artefact per product.
 *
 * Nothing here is faked: each document comes out of the same code path the
 * Swift app would use, so looking at the output is looking at the product.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import * as M from "../src/measurekit/index.js";
import * as O from "../src/openwall/index.js";
import * as R from "../src/riser/index.js";
import * as P from "../src/plumb/index.js";
import * as F from "../src/flatline/index.js";
import * as T from "../src/templat/index.js";

const OUT = new URL("../build/", import.meta.url);
mkdirSync(OUT, { recursive: true });
const DATE = "2026-08-27";

function write(name: string, html: string): void {
  writeFileSync(new URL(name, OUT), html, "utf8");
  const external = /https?:\/\//.test(html);
  console.log(`${name.padEnd(26)} ${String(html.length).padStart(7)} bytes  `
    + `external refs: ${external ? "FOUND - BUG" : "none"}`);
}

// ---------------------------------------------------------------- OpenWall
const intr = M.intrinsics(1450, 1450, 960, 720);
const wobble = (n: number) => ((n * 2654435761) % 7) - 3;   // deterministic, no Math.random

function observe(id: string, truth: M.Vec3, seed: number, note?: string): O.TracePoint {
  const a: M.CameraFrame = { id: `${id}-a`, transform: M.lookAt(M.vec(-0.9, 1.1, 1.4), truth),
    intrinsics: intr, imageWidth: 1920, imageHeight: 1440 };
  const b: M.CameraFrame = { id: `${id}-b`, transform: M.lookAt(M.vec(0.9, 1.2, 1.5), truth),
    intrinsics: intr, imageWidth: 1920, imageHeight: 1440 };
  const pa = M.project(a, truth), pb = M.project(b, truth);
  const point = O.triangulatedPoint(id, [
    { frame: a, x: pa.x + wobble(seed), y: pa.y + wobble(seed + 1) },
    { frame: b, x: pb.x + wobble(seed + 2), y: pb.y + wobble(seed + 3) },
  ], note);
  if (!point) throw new Error(`could not triangulate ${id}`);
  return point;
}

write("openwall-record.html", O.render({
  propertyAddress: "14 Example Street, Springfield", capturedOn: DATE,
  contractorName: "Example Remodeling LLC", homeownerName: "A. Homeowner",
  rooms: [{ id: "k", name: "Kitchen - north wall", runs: [
    O.buildRun("r-cw", "coldWater", "Cold water to sink", [
      observe("cw1", M.vec(0.42, 0.06, 0.35), 1, "Riser from floor"),
      observe("cw2", M.vec(0.42, 0.06, 0.78), 5),
      observe("cw3", M.vec(1.18, 0.06, 0.78), 9, "Stub-out, sink"),
    ]),
    O.buildRun("r-el", "electrical", "20A kitchen circuit", [
      observe("el1", M.vec(0.30, 0.05, 1.15), 21, "Box, left of window"),
      { id: "el2", position: M.pointFromMetres(M.vec(1.40, 0.05, 1.15)),
        provenance: "derived", note: "Behind blocking - not directly seen" },
      observe("el3", M.vec(2.30, 0.05, 1.15), 25, "Box, counter height"),
    ]),
  ] }],
}));

// ------------------------------------------------------------------- Riser
const cp = (id: string, clause: string, text: string): R.Checkpoint =>
  ({ id, standard: "NFPA 25", edition: "2023", clause, text,
     appliesTo: "sprinklerHead", frequency: "annual" });

const inspection: R.Inspection = {
  building: { name: "Mill Building", address: "1 Mill Street", devices: [] },
  performedOn: DATE, inspectorName: "S. Inspector", licenceNumber: "NICET-II-12345",
  results: [
    { deviceID: "SP-1", checkpoint: cp("c1", "5.2.1.1",
        "Sprinklers shall be free of corrosion, foreign materials and paint."),
      answer: { kind: "fail", severity: "critical", note: "Head painted over during last decorate" } },
    { deviceID: "SP-2", checkpoint: cp("c2", "5.2.1.1",
        "Sprinklers shall be free of corrosion, foreign materials and paint."),
      answer: { kind: "notVerified", reason: "aboveHardCeiling",
                note: "Plaster lid, no access panel fitted" } },
    { deviceID: "CV-1", checkpoint: cp("c3", "13.3.2",
        "Control valves shall be operated through their full range."),
      answer: { kind: "notVerified", reason: "valveSeized", note: "Handle will not move by hand" } },
    { deviceID: "GA-1", checkpoint: cp("c4", "13.2.7",
        "Gauges shall be replaced or tested every 5 years."), answer: { kind: "pass" } },
  ],
};
write("riser-inspection.html", R.render(inspection, R.deficiencies(inspection), {
  lines: [{ item: { code: "R1", description: "Replace painted sprinkler head",
                    unit: "each", unitPrice: 8500n },
            quantityMilli: 1000n, provenance: "measured" },
          { item: { code: "R2", description: "Free and lubricate control valve",
                    unit: "hour", unitPrice: 12500n },
            quantityMilli: 2000n, provenance: "measured" }],
}));

// ------------------------------------------------------------------- Plumb
const doorway = P.ADA_CHECKPOINTS.find((c) => c.id === "404.2.3")!;
const rampCp = P.ADA_CHECKPOINTS.find((c) => c.id === "405.2")!;
const counter = P.ADA_CHECKPOINTS.find((c) => c.id === "904.4.1")!;

write("plumb-survey.html", P.render({
  siteName: "Corner Store", address: "2 Main Street", surveyedOn: DATE,
  surveyorName: "S. Surveyor", credential: "CASp-000", standard: P.ADA_2010,
  observations: [
    { id: "o1", checkpoint: doorway, location: "Front entrance door",
      finding: P.evaluateLength(doorway, M.provenanced(M.inches(30), "measured")) },
    { id: "o2", checkpoint: counter, location: "Service counter",
      finding: P.evaluateLength(counter, M.provenanced(M.inches(42), "measured")) },
    { id: "o3", checkpoint: rampCp, location: "Ramp to side entrance",
      finding: P.evaluateSlope(rampCp, {
        fromInertial: M.slope(M.inches(2), M.inches(12)),
        fromGeometry: M.slope(M.inches(1), M.inches(40)), provenance: "measured" }) },
    { id: "o4", checkpoint: doorway, location: "Rear fire exit",
      finding: { kind: "notMeasured", reason: "Blocked by stored stock" } },
  ],
}));

// ---------------------------------------------------------------- Flatline
const line = [0, 12, 24, 36, 48, 60, 72, 84, 96].map((i) => ({
  position: M.inches(i),
  height: (BigInt(i === 36 ? -160 : i === 72 ? -70 : 0) * M.NM_PER_INCH) / 1000n,
}));
const suspects: F.Suspect[] = [
  { id: "s1", along: M.feet(3), scannedGap: M.inches(0, 5, 32),
    measuredGap: M.inches(0, 3, 16) },
  { id: "s2", along: M.feet(6), scannedGap: M.inches(0, 1, 16) },
  { id: "s3", along: M.feet(1), scannedGap: M.inches(0, 1, 32) },
];
write("flatline-changeorder.html", F.render(
  { roomName: "Kitchen", tolerance: F.LVP_SIX_FOOT, samples: line, suspects,
    area: M.squareFeet(180) },
  { lines: [{ item: { code: "SLU", description: "Self-levelling underlayment, supplied and placed",
                      unit: "bag", unitPrice: 3200n },
              quantityMilli: BigInt(F.bags(M.squareFeet(180),
                F.meanDepth(suspects.filter((s) => F.exceeds(s, F.LVP_SIX_FOOT))), 40)) * 1000n,
              provenance: "measured" }] },
  "Example Flooring", "14 Example Street", DATE));

// ----------------------------------------------------------------- Templat
const pt = T.point2;
const cut = (id: string, a: T.Point2, b: T.Point2): T.Edge =>
  ({ id, from: a, to: b, isCut: true, provenance: "measured",
     measuredLength: T.distance2(a, b) });
const template: T.Template = {
  name: "Kitchen run", material: "Quartz", thickness: M.inches(1, 1, 4),
  edges: [
    { id: "back", from: pt(0, 0), to: pt(96, 0), isCut: false, provenance: "scanned" },
    cut("right", pt(96, 0), pt(96, 25)),
    cut("front", pt(96, 25), pt(0, 25)),
    cut("left", pt(0, 25), pt(0, 0)),
  ],
  cutouts: [{ id: "sink", kind: "undermountSink", centre: pt(40, 12),
              width: M.provenanced(M.inches(30), "measured"),
              depth: M.provenanced(M.inches(18), "measured") }],
};
const dxf = T.exportDXF(template);
writeFileSync(new URL("templat-kitchen.dxf", OUT), dxf, "utf8");
console.log(`templat-kitchen.dxf         ${String(dxf.length).padStart(7)} bytes  `
  + `$INSUNITS: ${dxf.split("$INSUNITS")[1]!.split("\n")[2]} (1 = inches)`);
const q = T.quoteFor(template, 7500n, T.BULLNOSE, 15000n);
console.log(`templat quote                ${M.formatMoney(M.subtotal(q)).padStart(12)}  `
  + `issuable: ${M.isQuoteIssuable(q)}`);
