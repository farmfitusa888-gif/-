/**
 * The artefact: one self-contained HTML file the homeowner owns.
 *
 * The whole promise of this product is that the file still opens in 2036. That
 * makes one rule absolute: NOTHING may be fetched at view time. No stylesheet,
 * no font, no script, no image URL, no analytics. Everything is inlined, images
 * as data URIs. A record that needs a server in ten years is not a record.
 *
 * `renderRecord` is a pure function of its input, so the same job always renders
 * the same bytes, and it can be tested without a phone.
 */

import { type Provenance, PROVENANCE_LABEL } from "./provenance.js";
import { type Run, SERVICE_LABEL, summarise } from "./runs.js";
import { formatFeetInches, NM_PER_INCH, type Nanometres } from "./units.js";

export interface Photo {
  readonly id: string;
  readonly caption: string;
  /** Base64 payload only - no `data:` prefix, no URL. */
  readonly base64: string;
  readonly mimeType: "image/jpeg" | "image/png" | "image/webp";
}

export interface RoomRecord {
  readonly name: string;
  readonly runs: readonly Run[];
  readonly photos: readonly Photo[];
}

export interface RecordInput {
  readonly propertyAddress: string;
  readonly capturedOn: string;      // ISO date, supplied - never Date.now()
  readonly contractorName: string;
  readonly homeownerName?: string;
  readonly rooms: readonly RoomRecord[];
}

const ESCAPES: Record<string, string> = {
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
};

const replace = (value: string, pattern: RegExp): string =>
  value.replace(pattern, (ch) => ESCAPES[ch] ?? ch);

/**
 * Escape a value going into TEXT content.
 *
 * Quotes are deliberately left alone here: they carry no meaning outside an
 * attribute, and escaping them would render every measurement in this document
 * as `3&#39;` instead of `3'`. Use `escapeAttr` inside an attribute.
 */
export const escapeHtml = (value: string): string => replace(value, /[&<>]/g);

/** Escape a value going into an ATTRIBUTE, where quotes would break out of it. */
export const escapeAttr = (value: string): string => replace(value, /[&<>"']/g);

const BASE64 = /^[A-Za-z0-9+/]*={0,2}$/;

function assertBase64(photo: Photo): void {
  if (!BASE64.test(photo.base64)) {
    throw new RangeError(
      `photo ${photo.id} is not plain base64; the record must not reference a URL`,
    );
  }
}

const offset = (nm: Nanometres): string => escapeHtml(formatFeetInches(nm));

/**
 * Ray disagreement is the trust number on this document, so it is never rounded
 * down to a comfortable zero. Sub-32nd values print as a bound instead, because
 * "0" would claim a precision the sensor does not have.
 */
function tolerance(nm: Nanometres): string {
  const thirtySecond = NM_PER_INCH / 32n;
  const magnitude = nm < 0n ? -nm : nm;
  if (magnitude === 0n) return escapeHtml('0"');
  if (magnitude < thirtySecond) return `&lt; ${escapeHtml('1/32"')}`;
  return escapeHtml(formatFeetInches(nm, 32));
}

const CSS = `
:root{--ink:#16191d;--muted:#5b6470;--rule:#d9dee5;--accent:#1f4e79;--warn:#a32d1e}
*{box-sizing:border-box}
body{margin:0;background:#fff;color:var(--ink);
 font:15px/1.55 "Iowan Old Style",Palatino,Georgia,serif;padding:24px}
.wrap{max-width:940px;margin:0 auto}
h1,h2,h3,th,.ui{font-family:"Helvetica Neue",Helvetica,Arial,sans-serif}
h1{font-size:26px;margin:0 0 4px;letter-spacing:-.01em}
h2{font-size:16px;margin:30px 0 8px;color:var(--accent)}
h3{font-size:13px;margin:18px 0 6px}
.sub{color:var(--muted);margin:0 0 18px}
.meta{display:flex;flex-wrap:wrap;gap:10px 26px;padding:12px 0;
 border-top:1px solid var(--rule);border-bottom:1px solid var(--rule);
 font-family:"Helvetica Neue",Helvetica,Arial,sans-serif;font-size:13px}
.meta b{display:block;color:var(--muted);font-weight:600;font-size:11px;
 text-transform:uppercase;letter-spacing:.06em}
.warn{margin:20px 0;padding:12px 14px;border:2px solid var(--warn);border-radius:4px;
 background:#fdecea;color:#7d2116}
.warn strong{color:var(--warn)}
table{width:100%;border-collapse:collapse;margin:8px 0 18px;
 font-family:"Helvetica Neue",Helvetica,Arial,sans-serif;font-size:13px}
th{background:var(--ink);color:#fff;text-align:left;padding:7px 8px}
td{padding:6px 8px;border:1px solid var(--rule);vertical-align:top}
tbody tr:nth-child(even) td{background:#f7f9fb}
.tag{display:inline-block;font-family:"Helvetica Neue",Helvetica,Arial,sans-serif;
 font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;
 padding:2px 5px;border-radius:3px;border:1px solid currentColor;white-space:nowrap}
.p-triangulated{color:#1c6b3f;background:#e8f5ee}
.p-measured{color:#1f4e79;background:#e9f0f7}
.p-derived{color:#8a5a00;background:#fdf3e0}
.p-adjusted{color:#5b3a86;background:#f1ebfa}
figure{margin:0 0 14px}
img{max-width:100%;height:auto;border:1px solid var(--rule);border-radius:3px;display:block}
figcaption{color:var(--muted);font-size:12px;margin-top:5px}
.photos{display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:14px}
footer{margin-top:34px;padding-top:12px;border-top:1px solid var(--rule);
 color:var(--muted);font-size:12px}
@media print{body{padding:0}.warn{border-color:#000}}
`.trim();

const tag = (p: Provenance): string =>
  `<span class="tag p-${p}">${escapeHtml(PROVENANCE_LABEL[p])}</span>`;

function renderRun(run: Run): string {
  const s = summarise(run);
  const rows = run.points
    .map((p) => {
      const miss =
        p.missDistance === undefined
          ? '<td class="ui">&mdash;</td>'
          : `<td>${tolerance(p.missDistance)}</td>`;
      return `<tr><td>${escapeHtml(p.id)}</td><td>${offset(p.position.x)}</td>` +
        `<td>${offset(p.position.y)}</td><td>${offset(p.position.z)}</td>` +
        `<td>${tag(p.provenance)}</td>${miss}` +
        `<td>${escapeHtml(p.note ?? "")}</td></tr>`;
    })
    .join("");

  const inferred =
    s.inferredLength > 0n
      ? ` &middot; <strong>${offset(s.inferredLength)} of this run was inferred, not seen</strong>`
      : "";

  return `
<h3>${escapeHtml(run.label)} &mdash; ${escapeHtml(SERVICE_LABEL[run.service])}</h3>
<p class="sub">Total ${offset(s.totalLength)}${inferred}${
    s.worstMiss === undefined ? "" : ` &middot; largest ray disagreement ${tolerance(s.worstMiss)}`
  }</p>
<table><thead><tr><th>Point</th><th>X</th><th>Y</th><th>Z (height)</th>
<th>How it is known</th><th>Ray disagreement</th><th>Note</th></tr></thead>
<tbody>${rows}</tbody></table>`;
}

function renderRoom(room: RoomRecord): string {
  for (const photo of room.photos) assertBase64(photo);
  const photos = room.photos.length
    ? `<div class="photos">${room.photos
        .map(
          (p) =>
            `<figure><img alt="${escapeAttr(p.caption)}" src="data:${p.mimeType};base64,${p.base64}">` +
            `<figcaption>${escapeHtml(p.caption)}</figcaption></figure>`,
        )
        .join("")}</div>`
    : "";
  return `<h2>${escapeHtml(room.name)}</h2>${room.runs.map(renderRun).join("")}${photos}`;
}

export function renderRecord(input: RecordInput): string {
  const homeowner = input.homeownerName
    ? `<div><b>Prepared for</b>${escapeHtml(input.homeownerName)}</div>`
    : "";

  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Behind the walls &mdash; ${escapeHtml(input.propertyAddress)}</title>
<style>${CSS}</style></head>
<body><div class="wrap">
<h1>What's behind these walls</h1>
<p class="sub">A record of the services inside the walls of this property, made
while they were open.</p>
<div class="meta">
  <div><b>Property</b>${escapeHtml(input.propertyAddress)}</div>
  <div><b>Recorded</b>${escapeHtml(input.capturedOn)}</div>
  <div><b>Recorded by</b>${escapeHtml(input.contractorName)}</div>
  ${homeowner}
</div>

<div class="warn">
  <strong>Read this before cutting into any wall.</strong>
  This is a <strong>record</strong>, not a locator. It describes what was visible
  on the date above; later work may have changed it. Positions marked
  <em>inferred</em> were never directly seen. Every position carries a margin of
  error. <strong>Always scan the wall immediately before you cut, every
  time.</strong> This document does not replace that.
</div>

${input.rooms.map(renderRoom).join("")}

<h2>How to read this</h2>
<table><thead><tr><th>Mark</th><th>Means</th></tr></thead><tbody>
<tr><td>${tag("triangulated")}</td><td>Seen in two or more photographs and computed from them. A sensor result, with the error shown.</td></tr>
<tr><td>${tag("measured")}</td><td>Somebody put a tape on it. The most reliable figure here.</td></tr>
<tr><td>${tag("derived")}</td><td>Inferred between two known points and never directly seen. Treat with the most caution.</td></tr>
<tr><td>${tag("adjusted")}</td><td>Moved when a later tape measurement corrected the geometry around it.</td></tr>
</tbody></table>
<p>Positions are given from the room's origin corner: <strong>X</strong> along the
wall, <strong>Y</strong> into the room, <strong>Z</strong> as height above the
finished floor.</p>

<footer>This file is self-contained. It needs no app, no login and no internet
connection, and it will keep working if the company that made it does not.
Keep a copy with the deeds.</footer>
</div></body></html>`;
}
