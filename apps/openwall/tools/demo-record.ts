/**
 * Drive the whole pipeline end to end and write a real artefact.
 *
 * Synthetic camera frames stand in for a phone walking a room: a known pipe
 * position is projected into two views, tapped (with a little human sloppiness),
 * triangulated back, and written into the record. Nothing is faked downstream -
 * this is the same code path the app would use.
 */

import { writeFileSync } from "node:fs";
import { type CameraFrame, projectToPixel } from "../src/camera.js";
import { renderRecord, type RecordInput } from "../src/record.js";
import { buildRun, fromMetres, type Service, type TracePoint } from "../src/runs.js";
import { triangulateTaps } from "../src/triangulate.js";
import { quantiseMetres } from "../src/units.js";
import { lookAt, vec, type Vec3 } from "../src/vec.js";

const INTRINSICS = { fx: 1450, fy: 1450, cx: 960, cy: 720 };

const frame = (id: string, eye: Vec3, target: Vec3): CameraFrame => ({
  id, transform: lookAt(eye, target), intrinsics: INTRINSICS,
  imageWidth: 1920, imageHeight: 1440,
});

/** A deterministic wobble standing in for a thumb on glass. No Math.random. */
const wobble = (n: number): number => ((n * 2654435761) % 7) - 3;

/** Observe a true position from two viewpoints and triangulate it back. */
function observe(id: string, truth: Vec3, index: number, note?: string): TracePoint {
  const a = frame(`${id}-a`, vec(-0.9, 1.1, 1.4), truth);
  const b = frame(`${id}-b`, vec(0.9, 1.2, 1.5), truth);
  const pa = projectToPixel(a, truth);
  const pb = projectToPixel(b, truth);
  const t = triangulateTaps(
    { frame: a, x: pa.x + wobble(index), y: pa.y + wobble(index + 1) },
    { frame: b, x: pb.x + wobble(index + 2), y: pb.y + wobble(index + 3) },
  );
  return {
    id,
    position: fromMetres(t.point),
    provenance: "triangulated",
    missDistance: quantiseMetres(t.missDistance),
    ...(note === undefined ? {} : { note }),
  };
}

function run(id: string, service: Service, label: string,
             truths: readonly [string, Vec3, string?][], seed: number) {
  return buildRun(id, service, label,
    truths.map(([pid, v, note], i) => observe(pid, v, seed + i * 4, note)));
}

const coldWater = run("r-cw", "cold-water", "Cold water to sink", [
  ["cw1", vec(0.42, 0.06, 0.35), "Riser from floor"],
  ["cw2", vec(0.42, 0.06, 0.78)],
  ["cw3", vec(1.18, 0.06, 0.78), "Stub-out, sink"],
], 1);

const waste = run("r-wa", "waste", "3in waste, sink to stack", [
  ["wa1", vec(1.22, 0.10, 0.55)],
  ["wa2", vec(2.05, 0.10, 0.48)],
], 21);

// One inferred point: the cable disappears behind a joist and is reasoned about.
const circuit = buildRun("r-el", "electrical", "20A kitchen circuit", [
  observe("el1", vec(0.30, 0.05, 1.15), 41, "Box, left of window"),
  { id: "el2", position: fromMetres(vec(1.40, 0.05, 1.15)), provenance: "derived",
    note: "Behind blocking - not directly seen" },
  observe("el3", vec(2.30, 0.05, 1.15), 45, "Box, counter height"),
]);

const record: RecordInput = {
  propertyAddress: "14 Example Street, Springfield",
  capturedOn: "2026-08-27",
  contractorName: "Example Remodeling LLC",
  homeownerName: "A. Homeowner",
  rooms: [{ name: "Kitchen - north wall", runs: [coldWater, waste, circuit], photos: [] }],
};

const html = renderRecord(record);
const out = new URL("../build/demo-record.html", import.meta.url);
writeFileSync(out, html, "utf8");
console.log(`wrote ${out.pathname}  ${html.length.toLocaleString()} bytes`);
console.log(`external references: ${/https?:\/\//.test(html) ? "FOUND - BUG" : "none"}`);
