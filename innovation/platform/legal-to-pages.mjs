// legal-to-pages.mjs
//
// Publishes the drafted legal documents as real pages on the site.
//
// Why this is a generator and not four hand-copied pages: the terms are going
// to change, and a copy of a legal document that has drifted from the version
// you think is in force is worse than no copy. legal/*.md stays the single
// source. Run this and the site catches up.
//
// It also enforces the rule that matters. A terms of service still containing
// [[FILL: ...]] markers is a draft, and publishing a draft that says "operated
// by [[FILL: legal entity name]]" to a paying customer is not a typo, it is an
// unenforceable contract. So: blanks are reported always, and are a hard
// failure once the site declares itself selling.

import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

const DOCS = [
  { file: "legal/TERMS-OF-SERVICE.md", path: "/terms", eyebrow: "Terms",
    h1: "Terms of service", title: "Terms of service",
    description: "What Countercite does, what it does not do, what you are responsible for, and how either side ends the arrangement. Written to be read." },
  { file: "legal/PRIVACY-POLICY.md", path: "/privacy", eyebrow: "Privacy",
    h1: "Privacy policy", title: "Privacy policy",
    description: "What happens to the documents you upload, who else touches them, how long they are kept, and how to delete them. In plain words." },
  { file: "legal/DISCLAIMERS.md", path: "/disclaimers", eyebrow: "Disclaimers",
    h1: "What Countercite is not", title: "What Countercite is not",
    description: "Countercite is not a law firm, not a licensed adjuster and not a medical provider. The exact limits of what it does, stated once, in full." },
  { file: "legal/NO-GUARANTEE-AND-TESTING-POLICY.md", path: "/accuracy", eyebrow: "Accuracy",
    h1: "How accuracy is measured", title: "How accuracy is measured",
    description: "What gets measured, on which documents, how the numbers are recorded, and what may be said about them publicly. Written before any number existed." },
];

// A deliberately small Markdown subset. The legal drafts use headings,
// paragraphs, lists, tables, blockquotes, bold, italic and inline code. Adding
// a parser dependency to render four documents would be the wrong trade.
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const inline = (s) =>
  esc(s)
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/(^|[^*])\*([^*]+)\*/g, "$1<em>$2</em>")
    .replace(/\[\[FILL:\s*([^\]]*)\]\]/g, '<mark class="fill">to be completed: $1</mark>')
    // Internal provenance labels. [review] means "I read a search summary, not
    // the primary source" and is how the research files stay honest with
    // themselves. On a page a customer reads it looks like an editing artifact,
    // so it is stripped here while staying in the markdown source.
    .replace(/\s*\[(review|verified|conflict|NOT ESTABLISHED|derived[^\]]*)\]/gi, "")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

function toHtml(md) {
  const out = [];
  const lines = md.split("\n");
  let i = 0, para = [], list = null;

  const flushPara = () => { if (para.length) { out.push(`<p>${inline(para.join(" "))}</p>`); para = []; } };
  const flushList = () => { if (list) { out.push(`</${list}>`); list = null; } };

  while (i < lines.length) {
    const l = lines[i];

    if (/^\s*$/.test(l)) { flushPara(); flushList(); i++; continue; }
    if (/^---+\s*$/.test(l)) { flushPara(); flushList(); out.push("<hr>"); i++; continue; }

    const h = l.match(/^(#{1,4})\s+(.*)$/);
    if (h) {
      flushPara(); flushList();
      // The document's own H1 is dropped; the page already has one.
      const level = Math.min(h[1].length + 1, 4);
      if (h[1].length > 1) out.push(`<h${level}>${inline(h[2])}</h${level}>`);
      i++; continue;
    }

    if (/^>\s?/.test(l)) {
      flushPara(); flushList();
      const buf = [];
      while (i < lines.length && /^>\s?/.test(lines[i])) { buf.push(lines[i].replace(/^>\s?/, "")); i++; }
      // Join wrapped lines back into paragraphs. Markdown hard-wraps at 80
      // columns; treating each wrapped line as its own paragraph turns a
      // three-sentence note into nine ragged fragments. Blank lines separate.
      const paras = [];
      let cur = [];
      for (const b of buf) {
        if (b.trim()) cur.push(b.trim());
        else if (cur.length) { paras.push(cur.join(" ")); cur = []; }
      }
      if (cur.length) paras.push(cur.join(" "));
      out.push(`<blockquote>${paras.map((b) => `<p>${inline(b)}</p>`).join("")}</blockquote>`);
      continue;
    }

    if (/^\|/.test(l) && /^\|[\s:|-]+\|\s*$/.test(lines[i + 1] || "")) {
      flushPara(); flushList();
      const cells = (r) => r.replace(/^\||\|$/g, "").split("|").map((c) => c.trim());
      const head = cells(l); i += 2;
      const rows = [];
      while (i < lines.length && /^\|/.test(lines[i])) { rows.push(cells(lines[i])); i++; }
      out.push(`<div class="scroller"><table><thead><tr>${head.map((c) => `<th>${inline(c)}</th>`).join("")}</tr></thead>` +
               `<tbody>${rows.map((r) => `<tr>${r.map((c) => `<td>${inline(c)}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`);
      continue;
    }

    const li = l.match(/^\s*([-*]|\d+\.)\s+(.*)$/);
    if (li) {
      flushPara();
      const want = /^\d/.test(li[1]) ? "ol" : "ul";
      if (list !== want) { flushList(); out.push(`<${want}>`); list = want; }
      out.push(`<li>${inline(li[2])}</li>`);
      i++; continue;
    }

    flushList();
    para.push(l.trim());
    i++;
  }
  flushPara(); flushList();
  return out.join("\n");
}

const sitePath = join(root, "platform/sites/countercite.json");
const site = JSON.parse(readFileSync(sitePath, "utf8"));
let totalBlanks = 0;
const report = [];

for (const doc of DOCS) {
  const md = readFileSync(join(root, doc.file), "utf8");
  const blanks = (md.match(/\[\[FILL:/g) || []).length;
  totalBlanks += blanks;
  report.push({ path: doc.path, blanks, words: md.split(/\s+/).length });

  const page = {
    path: doc.path,
    kind: "page",
    title: `${doc.title} | Countercite`,
    h1: doc.h1,
    description: doc.description,
    keywords: [`countercite ${doc.eyebrow.toLowerCase()}`, `advocate software ${doc.eyebrow.toLowerCase()}`,
                `${doc.h1.toLowerCase()}`],
    blocks: [
      { type: "hero", eyebrow: doc.eyebrow, h1: doc.h1, lede: doc.description, cta: site.cta.label },
      { type: "prose", body: toHtml(md) },
      { type: "disclaimer" },
    ],
  };

  const at = site.pages.findIndex((p) => p.path === doc.path);
  if (at >= 0) site.pages[at] = page; else site.pages.push(page);
}

// Keep the footer honest about what exists.
const wanted = DOCS.map((d) => ({ path: d.path, label: d.eyebrow }));
site.footerLegal = wanted.map((w) => ({ path: w.path, label: w.label }));

writeFileSync(sitePath, JSON.stringify(site, null, 2) + "\n");

console.log("\n  published from legal/ into the site:\n");
for (const r of report) {
  console.log(`  ${r.path.padEnd(14)} ${String(r.words).padStart(5)} words   ${r.blanks} blank${r.blanks === 1 ? "" : "s"}`);
}
console.log(`\n  ${totalBlanks} blanks total.`);

if (totalBlanks && site.launchStatus === "selling") {
  console.log(`\n  ERROR: cannot sell with ${totalBlanks} unfilled blanks in the legal pages.\n`);
  process.exit(1);
}
if (totalBlanks) {
  console.log(`  Fine while the site is a waitlist. Every one must be filled before the`);
  console.log(`  first paying customer, and check-features.mjs will refuse to flip to`);
  console.log(`  selling until they are.\n`);
}
