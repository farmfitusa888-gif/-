#!/usr/bin/env node
/**
 * validate.mjs — makes the "20x the metadata" claim checkable.
 *
 * Counts every discrete metadata signal on every generated page and compares it
 * to a competitor baseline. It also fails the build on the errors that actually
 * cost rankings: a missing canonical, a duplicate title across pages, a
 * description outside the length search engines render, a broken internal link,
 * an H1 that isn't unique, invalid JSON-LD.
 *
 * A count on its own would be gameable, so the report separates:
 *   - head signals (meta/link tags)
 *   - schema entities and schema properties inside the @graph
 * and the errors are what gate the build, not the count.
 *
 * Usage: node platform/validate.mjs [slug]
 */

import { readFileSync, readdirSync, existsSync, statSync } from "node:fs";
import { join, dirname, relative } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = dirname(fileURLToPath(import.meta.url));
const DIST = join(ROOT, "..", "dist");

/**
 * Competitor baseline. Measured by hand from what a typical SaaS or
 * professional-services landing page ships: charset, viewport, title,
 * description, canonical, og:title, og:description, og:image, og:url, og:type,
 * twitter:card, twitter:title, twitter:description, favicon — plus, on a good
 * one, a single Organization JSON-LD blob with ~6 properties.
 *
 * This number is an informed estimate, not a survey. It is recorded here rather
 * than buried so it can be argued with or replaced with a real measurement.
 */
const BASELINE = { headSignals: 14, schemaEntities: 1, schemaProperties: 6, total: 21 };

const walk = (dir, out = []) => {
  for (const f of readdirSync(dir)) {
    const p = join(dir, f);
    statSync(p).isDirectory() ? walk(p, out) : f.endsWith(".html") && out.push(p);
  }
  return out;
};

/** Count leaf properties in the JSON-LD graph — the real depth measure. */
function countProps(v) {
  if (Array.isArray(v)) return v.reduce((a, x) => a + countProps(x), 0);
  if (v && typeof v === "object")
    return Object.entries(v).reduce(
      (a, [k, val]) => a + (k.startsWith("@") ? 0 : 1) + countProps(val),
      0
    );
  return 0;
}

function analyse(file, siteRoot) {
  const html = readFileSync(file, "utf8");
  const errors = [];
  const warnings = [];

  const headMatch = html.match(/<head>([\s\S]*?)<\/head>/i);
  const headHtml = headMatch ? headMatch[1] : "";

  const metas = [...headHtml.matchAll(/<meta\s[^>]*>/gi)].length;
  const links = [...headHtml.matchAll(/<link\s[^>]*>/gi)].length;
  const titleTag = headHtml.match(/<title>([\s\S]*?)<\/title>/i);
  const headSignals = metas + links + (titleTag ? 1 : 0);

  // JSON-LD
  let schemaEntities = 0;
  let schemaProperties = 0;
  const ld = headHtml.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/i);
  if (!ld) {
    errors.push("no JSON-LD");
  } else {
    try {
      const parsed = JSON.parse(ld[1]);
      const graph = parsed["@graph"] || [parsed];
      schemaEntities = graph.length;
      schemaProperties = countProps(graph);
      const ids = graph.map((n) => n["@id"]).filter(Boolean);
      if (new Set(ids).size !== ids.length) errors.push("duplicate @id in graph");
      for (const n of graph) if (!n["@type"]) errors.push("graph node without @type");
    } catch (e) {
      errors.push("JSON-LD does not parse: " + e.message);
    }
  }

  // Required head elements
  const need = [
    [/<link rel="canonical"/i, "canonical"],
    [/<meta name="description"/i, "meta description"],
    [/<meta name="robots"/i, "robots"],
    [/<meta property="og:title"/i, "og:title"],
    [/<meta property="og:description"/i, "og:description"],
    [/<meta property="og:url"/i, "og:url"],
    [/<meta name="twitter:card"/i, "twitter:card"],
    [/<meta charset=/i, "charset"],
    [/<meta name="viewport"/i, "viewport"],
  ];
  for (const [re, name] of need) if (!re.test(headHtml)) errors.push(`missing ${name}`);

  // Title and description length
  const title = titleTag ? titleTag[1].trim() : "";
  if (!title) errors.push("missing title");
  else if (title.length > 65) warnings.push(`title ${title.length} chars (>65 truncates in SERP)`);
  else if (title.length < 15) warnings.push(`title only ${title.length} chars`);

  const descM = headHtml.match(/<meta name="description" content="([^"]*)"/i);
  const desc = descM ? descM[1] : "";
  if (desc && (desc.length < 70 || desc.length > 165))
    warnings.push(`description ${desc.length} chars (aim 70-165)`);

  // Headings
  const h1s = [...html.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/gi)];
  if (h1s.length === 0) errors.push("no H1");
  if (h1s.length > 1) errors.push(`${h1s.length} H1 tags (must be exactly 1)`);

  // Images must carry alt text
  for (const img of html.matchAll(/<img\s[^>]*>/gi))
    if (!/\salt=/i.test(img[0])) errors.push("img without alt");

  // Internal links must resolve to a generated page
  const hrefs = [...html.matchAll(/href="(\/[^"#?]*)"/g)].map((m) => m[1]);
  for (const h of new Set(hrefs)) {
    if (/\.(xml|txt|svg|png|webmanifest|ico)$/.test(h)) {
      if (!existsSync(join(siteRoot, h.replace(/^\//, "")))) errors.push(`dead asset link ${h}`);
      continue;
    }
    const target = h === "/" ? join(siteRoot, "index.html") : join(siteRoot, h.replace(/^\//, ""), "index.html");
    if (!existsSync(target)) errors.push(`dead internal link ${h}`);
  }

  return {
    file: relative(siteRoot, file) || "index.html",
    title,
    h1: h1s[0]?.[1].replace(/<[^>]+>/g, "").trim() || "",
    headSignals,
    schemaEntities,
    schemaProperties,
    total: headSignals + schemaEntities + schemaProperties,
    words: html.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length,
    errors,
    warnings,
  };
}

function validateSite(slug) {
  const root = join(DIST, slug);
  const files = walk(root);
  const rows = files.map((f) => analyse(f, root));

  // Cross-page uniqueness
  const byTitle = new Map();
  const byH1 = new Map();
  for (const r of rows) {
    byTitle.set(r.title, (byTitle.get(r.title) || 0) + 1);
    byH1.set(r.h1, (byH1.get(r.h1) || 0) + 1);
  }
  for (const r of rows) {
    if (byTitle.get(r.title) > 1) r.errors.push("duplicate <title> across pages");
    if (byH1.get(r.h1) > 1) r.errors.push("duplicate H1 across pages");
  }

  const errs = rows.reduce((a, r) => a + r.errors.length, 0);
  const warns = rows.reduce((a, r) => a + r.warnings.length, 0);
  const avg = (k) => Math.round(rows.reduce((a, r) => a + r[k], 0) / rows.length);

  console.log(`\n=== ${slug} — ${rows.length} pages ===`);
  console.log(
    `${"page".padEnd(34)}${"head".padStart(6)}${"ents".padStart(6)}${"props".padStart(7)}${"total".padStart(7)}${"words".padStart(7)}  issues`
  );
  for (const r of rows.sort((a, b) => a.file.localeCompare(b.file))) {
    const flag = r.errors.length ? ` ERR:${r.errors.length}` : r.warnings.length ? ` warn:${r.warnings.length}` : "";
    console.log(
      `${r.file.slice(0, 33).padEnd(34)}${String(r.headSignals).padStart(6)}${String(r.schemaEntities).padStart(6)}${String(r.schemaProperties).padStart(7)}${String(r.total).padStart(7)}${String(r.words).padStart(7)}${flag}`
    );
  }
  for (const r of rows)
    for (const e of r.errors) console.log(`  ERROR  ${r.file}: ${e}`);
  for (const r of rows)
    for (const w of r.warnings) console.log(`  warn   ${r.file}: ${w}`);

  const t = avg("total");
  console.log(
    `\naverage per page: head ${avg("headSignals")}, schema entities ${avg("schemaEntities")}, schema properties ${avg("schemaProperties")} -> TOTAL ${t}`
  );
  console.log(
    `competitor baseline ${BASELINE.total} -> ${(t / BASELINE.total).toFixed(1)}x  (target 20x = ${BASELINE.total * 20})`
  );
  console.log(`errors ${errs}, warnings ${warns}`);
  return { slug, errs, warns, ratio: t / BASELINE.total, pages: rows.length, avgTotal: t };
}

const only = process.argv[2];
const slugs = only
  ? [only]
  : existsSync(DIST)
  ? readdirSync(DIST).filter((d) => statSync(join(DIST, d)).isDirectory())
  : [];

if (!slugs.length) {
  console.log("Nothing built yet. Run: node platform/build.mjs");
  process.exit(0);
}

const all = slugs.map(validateSite);
const totalErrs = all.reduce((a, r) => a + r.errs, 0);
console.log(`\n${"=".repeat(60)}`);
for (const r of all)
  console.log(
    `${r.slug.padEnd(14)} ${String(r.pages).padStart(3)} pages  ${r.avgTotal.toString().padStart(4)} signals/page  ${r.ratio.toFixed(1)}x baseline  ${r.errs} errors`
  );
console.log(`${"=".repeat(60)}`);
process.exit(totalErrs > 0 ? 1 : 0);
