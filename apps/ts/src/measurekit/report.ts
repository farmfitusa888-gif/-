/**
 * Port of MeasureKit/Report.swift.
 *
 * One absolute rule: the rendered file fetches NOTHING at view time. No script,
 * no stylesheet link, no font host, no image URL, no analytics.
 */

import { type Cents, formatMoney } from "./money.js";
import { type Provenance, PROVENANCE_LABEL } from "./provenance.js";
import { type Nanometres, NM_PER_INCH, abs, formatted } from "./units.js";

export type NoticeKind = "warning" | "refusal" | "info";

export interface Notice { readonly kind: NoticeKind; readonly heading: string; readonly body: string }

export type Cell =
  | { readonly kind: "text"; readonly value: string }
  | { readonly kind: "mark"; readonly value: Provenance }
  | { readonly kind: "money"; readonly value: Cents }
  | { readonly kind: "length"; readonly value: Nanometres }
  | { readonly kind: "tolerance"; readonly value: Nanometres };

export const text = (value: string): Cell => ({ kind: "text", value });
export const mark = (value: Provenance): Cell => ({ kind: "mark", value });
export const money = (value: Cents): Cell => ({ kind: "money", value });
export const lengthCell = (value: Nanometres): Cell => ({ kind: "length", value });
export const tolerance = (value: Nanometres): Cell => ({ kind: "tolerance", value });

export interface Table {
  readonly caption?: string;
  readonly columns: readonly string[];
  readonly rows: readonly (readonly Cell[])[];
}

export interface Photo {
  readonly caption: string;
  /** Base64 payload only - no `data:` prefix, no URL. */
  readonly base64: string;
  readonly mimeType: string;
}

export interface Section {
  readonly heading: string;
  readonly summary?: string;
  readonly tables?: readonly Table[];
  readonly photos?: readonly Photo[];
}

export interface Report {
  readonly title: string;
  readonly subtitle: string;
  readonly facts: readonly (readonly [string, string])[];
  readonly notices?: readonly Notice[];
  readonly sections: readonly Section[];
  readonly footer: string;
}

export class ReportError extends Error {}

/**
 * Escape for TEXT content.
 *
 * Quotes are deliberately left alone: they mean nothing outside an attribute, and
 * escaping them would render every measurement as `3&#39;` instead of `3'`.
 */
export const escapeText = (s: string): string =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** Escape for an ATTRIBUTE, where a quote would break out of it. */
export const escapeAttribute = (s: string): string =>
  escapeText(s).replace(/"/g, "&quot;").replace(/'/g, "&#39;");

/**
 * Sub-1/32" tolerances print as a bound, never as `0"`, because zero would claim
 * a precision the sensor does not have.
 */
export function formatTolerance(nm: Nanometres): string {
  const thirtySecond = NM_PER_INCH / 32n;
  const magnitude = abs(nm);
  if (magnitude === 0n) return '0"';
  if (magnitude < thirtySecond) return '&lt; 1/32"';
  return escapeText(formatted(nm, 32));
}

/** Base64 is ASCII by definition - a Unicode-aware class would wave through junk. */
export const isPlainBase64 = (s: string): boolean =>
  s.length > 0 && /^[A-Za-z0-9+/]*={0,2}$/.test(s);

function renderCell(c: Cell): string {
  switch (c.kind) {
    case "text": return escapeText(c.value);
    case "money": return escapeText(formatMoney(c.value));
    case "length": return escapeText(formatted(c.value));
    case "tolerance": return formatTolerance(c.value);
    case "mark":
      return `<span class="tag p-${c.value}">${escapeText(PROVENANCE_LABEL[c.value])}</span>`;
  }
}

export function render(report: Report): string {
  let body = "";

  for (const n of report.notices ?? []) {
    body += `<div class="notice n-${n.kind}"><strong>${escapeText(n.heading)}</strong> `
      + `${escapeText(n.body)}</div>`;
  }

  for (const section of report.sections) {
    body += `<h2>${escapeText(section.heading)}</h2>`;
    if (section.summary) body += `<p class="sub">${escapeText(section.summary)}</p>`;
    for (const table of section.tables ?? []) {
      if (table.caption) body += `<h3>${escapeText(table.caption)}</h3>`;
      body += "<table><thead><tr>"
        + table.columns.map((c) => `<th>${escapeText(c)}</th>`).join("")
        + "</tr></thead><tbody>";
      for (const row of table.rows) {
        body += "<tr>" + row.map((c) => `<td>${renderCell(c)}</td>`).join("") + "</tr>";
      }
      body += "</tbody></table>";
    }
    const photos = section.photos ?? [];
    if (photos.length > 0) {
      body += '<div class="photos">';
      for (const p of photos) {
        if (!isPlainBase64(p.base64)) {
          throw new ReportError(
            `photo "${p.caption}" is not plain base64; the record must not reference a URL`);
        }
        body += `<figure><img alt="${escapeAttribute(p.caption)}" `
          + `src="data:${p.mimeType};base64,${p.base64}">`
          + `<figcaption>${escapeText(p.caption)}</figcaption></figure>`;
      }
      body += "</div>";
    }
  }

  const facts = report.facts
    .map(([k, v]) => `<div><b>${escapeText(k)}</b>${escapeText(v)}</div>`)
    .join("");

  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${escapeText(report.title)}</title>
<style>${CSS}</style></head>
<body><div class="wrap">
<h1>${escapeText(report.title)}</h1>
<p class="sub">${escapeText(report.subtitle)}</p>
<div class="meta">${facts}</div>
${body}
<footer>${escapeText(report.footer)}</footer>
</div></body></html>`;
}

export const CSS = `
:root{--ink:#16191d;--muted:#5b6470;--rule:#d9dee5;--accent:#1f4e79;--warn:#a32d1e}
*{box-sizing:border-box}
body{margin:0;background:#fff;color:var(--ink);
 font:15px/1.55 "Iowan Old Style",Palatino,Georgia,serif;padding:24px}
.wrap{max-width:960px;margin:0 auto}
h1,h2,h3,th{font-family:"Helvetica Neue",Helvetica,Arial,sans-serif}
h1{font-size:26px;margin:0 0 4px}
h2{font-size:16px;margin:28px 0 8px;color:var(--accent)}
h3{font-size:13px;margin:16px 0 6px}
.sub{color:var(--muted);margin:0 0 16px}
.meta{display:flex;flex-wrap:wrap;gap:10px 26px;padding:12px 0;
 border-top:1px solid var(--rule);border-bottom:1px solid var(--rule);
 font-family:"Helvetica Neue",Helvetica,Arial,sans-serif;font-size:13px}
.meta b{display:block;color:var(--muted);font-weight:600;font-size:11px;
 text-transform:uppercase;letter-spacing:.06em}
.notice{margin:18px 0;padding:12px 14px;border-radius:4px;border:2px solid var(--warn);
 background:#fdecea;color:#7d2116}
.notice strong{color:var(--warn)}
.n-refusal{border-color:#8a5a00;background:#fdf3e0;color:#6b4600}
.n-refusal strong{color:#8a5a00}
.n-info{border-color:var(--accent);background:#eef3f8;color:#1b3a57}
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
.p-scanned{color:#a32d1e;background:#fdecea}
.p-adjusted{color:#5b3a86;background:#f1ebfa}
figure{margin:0 0 14px}
img{max-width:100%;height:auto;border:1px solid var(--rule);border-radius:3px;display:block}
figcaption{color:var(--muted);font-size:12px;margin-top:5px}
.photos{display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:14px}
footer{margin-top:32px;padding-top:12px;border-top:1px solid var(--rule);
 color:var(--muted);font-size:12px}
@media print{body{padding:0}.notice{border-color:#000}}
`.trim();
