#!/usr/bin/env node
// Where the project actually is, counted from the repo rather than remembered.
//
// Written because "how much is left" deserves an answer that cannot drift from
// the truth between one telling and the next. Everything below is measured:
// tests are run, pages are counted off disk, and the ledger is read.

import { execSync } from "node:child_process";
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const R = (p) => join(ROOT, p);

const SUITES = [
  ["wage engine", "engines/ca-wage/rules.test.mjs", /^# pass (\d+)/m],
  ["bulk damages schedule", "engines/ca-wage/schedule.test.mjs", /(\d+) passed/],
  ["contradiction engine", "engines/contradiction/core.test.mjs", /^# pass (\d+)/m],
  ["UPL language guard", "engines/contradiction/language-guard.test.mjs", /(\d+) passed/],
];

let total = 0;
console.log("\nTESTS");
console.log("=".repeat(64));
for (const [name, file, re] of SUITES) {
  let n = 0, ok = false;
  try {
    const out = execSync(`node ${JSON.stringify(R(file))}`, { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
    n = Number((out.match(re) || [])[1] || 0);
    ok = !/fail [1-9]|[1-9]\d* failed/.test(out);
  } catch { ok = false; }
  total += n;
  console.log(`  ${ok ? "pass" : "FAIL"}  ${String(n).padStart(3)}  ${name}`);
}
try {
  const out = execSync(`python3 ${JSON.stringify(R("tools/paga_firm_census.py"))} --self-test`,
    { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
  const n = Number((out.match(/(\d+)\/(\d+) passed/) || [])[1] || 0);
  total += n;
  console.log(`  pass  ${String(n).padStart(3)}  PAGA firm census`);
} catch { console.log("  FAIL    ?  PAGA firm census"); }
console.log(`  ${"".padStart(6)}${String(total).padStart(3)}  total, plus 2 browser-driven suites`);

console.log("\nSITES");
console.log("=".repeat(64));
for (const f of readdirSync(R("platform/sites"))) {
  const s = JSON.parse(readFileSync(R(`platform/sites/${f}`), "utf8"));
  const slug = f.replace(".json", "");
  console.log(`  ${slug.padEnd(14)} ${String(s.pages.length).padStart(3)} pages   mode: ${s.launchStatus}`);
}

console.log("\nFEATURE LEDGER (Countercite)");
console.log("=".repeat(64));
const led = JSON.parse(readFileSync(R("platform/feature-ledger.json"), "utf8"));
const by = led.features.reduce((a, f) => ((a[f.status] = (a[f.status] || 0) + 1), a), {});
for (const k of ["shipped", "partial", "planned"]) console.log(`  ${k.padEnd(9)} ${String(by[k] || 0).padStart(3)}`);

console.log("\nOPEN QUESTIONS STILL MARKED NOT ESTABLISHED");
console.log("=".repeat(64));
let open = 0;
const walk = (d) => {
  for (const e of readdirSync(R(d), { withFileTypes: true })) {
    const p = `${d}/${e.name}`;
    if (e.isDirectory()) { walk(p); continue; }
    if (!e.name.endsWith(".md")) continue;
    const hits = (readFileSync(R(p), "utf8").match(/\[NOT ESTABLISHED/g) || []).length;
    if (hits) { console.log(`  ${String(hits).padStart(3)}  ${p}`); open += hits; }
  }
};
for (const d of ["research", "buildouts", "legal"]) walk(d);
console.log(`  ${String(open).padStart(3)}  total`);

console.log("\nLEGAL DOCUMENT BLANKS");
console.log("=".repeat(64));
let blanks = 0;
for (const f of readdirSync(R("legal"))) {
  if (!f.endsWith(".md")) continue;
  const n = (readFileSync(R(`legal/${f}`), "utf8").match(/\[\[FILL:/g) || []).length;
  if (n) { console.log(`  ${String(n).padStart(3)}  legal/${f}`); blanks += n; }
}
console.log(`  ${String(blanks).padStart(3)}  total. The site cannot go from waitlist to selling until this is 0.`);
console.log();
