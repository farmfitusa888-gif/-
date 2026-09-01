// check-features.mjs
//
// Stops the site from selling something nobody has built.
//
// The FTC fined DoNotPay $193,000 for advertising a service it never tested.
// A pricing page with a "Start free trial" button beside nineteen unwritten
// features is that same case with a different logo, and it would be entirely
// self-inflicted. So the rule is enforced here rather than remembered.
//
// The rule: a site may present itself as SELLING only when every claim on its
// pricing page maps to a ledger entry that is shipped or partial. While
// anything material is still planned, the site runs in WAITLIST mode, the
// call to action collects an address instead of a card, and planned features
// carry a visible marker.
//
// Exit 1 fails the build.

import { readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const ledger = JSON.parse(readFileSync(join(root, "platform/feature-ledger.json"), "utf8"));
const byClaim = new Map();
for (const f of ledger.features) {
  byClaim.set(f.claim, f);
  for (const a of f.aliases || []) byClaim.set(a, f);
}

let errors = 0, warnings = 0;
const err = (m) => { errors++; console.log(`  ERROR    ${m}`); };
const warn = (m) => { warnings++; console.log(`  warning  ${m}`); };

// 1. Evidence paths must exist. A ledger citing a file that was deleted is
//    worse than no ledger, because it reads as verified.
for (const f of ledger.features) {
  for (const key of ["evidence", "tests"]) {
    if (f[key] && !existsSync(join(root, f[key]))) {
      err(`${f.id}: ${key} path does not exist: ${f[key]}`);
    }
  }
  if (f.status === "shipped" && !f.tests) {
    err(`${f.id}: marked shipped with no test file. Shipped means tested.`);
  }
}

// 2. Every claim the site makes must be in the ledger, and the ledger must
//    not carry claims the site never makes.
const sitePath = join(root, "platform/sites/countercite.json");
const site = JSON.parse(readFileSync(sitePath, "utf8"));
const claims = new Set();

for (const tier of site.pricing) for (const i of tier.includes) claims.add(i);
const pricingPage = site.pages.find((p) => p.path === "/pricing");
for (const b of pricingPage.blocks) {
  if (b.type === "table" && b.headers?.[0] === "") {
    for (const r of b.rows) if (!r[0].startsWith("<strong>")) claims.add(r[0]);
  }
}

// Rolled-up bullets ("Everything in Solo") and pure quantities are not
// features and are not expected in the ledger.
const NOT_A_FEATURE = /^(Everything in |One seat$|Up to five seats$|Unlimited seats$|Annual price$)/;

const unmatched = [];
for (const c of claims) {
  if (NOT_A_FEATURE.test(c)) continue;
  if (!byClaim.has(c)) unmatched.push(c);
}

// 3. The mode rule.
const mode = site.launchStatus;
if (!["waitlist", "selling"].includes(mode)) {
  err(`site.launchStatus must be "waitlist" or "selling", got ${JSON.stringify(mode)}`);
}

const planned = ledger.features.filter((f) => f.status === "planned");
if (mode === "selling" && planned.length) {
  err(`launchStatus is "selling" but ${planned.length} features are still planned: ` +
      planned.slice(0, 5).map((f) => f.id).join(", ") + (planned.length > 5 ? ", ..." : ""));
}

if (mode === "waitlist") {
  const cta = (site.cta?.label || "").toLowerCase();
  if (/trial|buy|subscribe|start free/.test(cta)) {
    err(`launchStatus is "waitlist" but the call to action reads "${site.cta.label}". ` +
        `A waitlist collects an address, not a card.`);
  }
  for (const t of site.pricing) {
    const c = (t.cta || "").toLowerCase();
    if (/trial|buy|subscribe|start free/.test(c)) {
      err(`launchStatus is "waitlist" but tier "${t.name}" offers "${t.cta}".`);
    }
  }
}

// 4. The audience rule.
//
// Selling flat-fee software to licensed professionals is the posture the legal
// work assessed as safe. Selling the same thing direct to a policyholder is
// where every unauthorized-practice and licensing question in this project
// comes from. That distinction is worth more than any feature on the roadmap,
// and it is exactly the kind of thing that erodes one well-meant landing page
// at a time. So it is checked rather than remembered.
//
// These patterns match copy addressed to the affected individual. Describing a
// policyholder in the third person is fine and expected, since that is the
// customer's client.
const CONSUMER_SELL = [
  /\byour (claim|denial|policy) (was|has been|is) denied\b/i,
  /\bif your claim was denied\b/i,
  /\bupload your denial letter\b/i,
  /\bwe(?:'| wi)ll fight your (claim|insurer|denial)\b/i,
  /\bget your claim (paid|approved|overturned)\b/i,
  /\bhomeowners?,? (start|sign up|upload)\b/i,
  /\bfor policyholders\b/i,
];

if (site.audience !== "licensed-professionals-only") {
  err(`site.audience must be "licensed-professionals-only", got ${JSON.stringify(site.audience)}. ` +
      `Changing it is a legal-posture decision, not a copy decision.`);
} else {
  const prose = JSON.stringify(site);
  for (const re of CONSUMER_SELL) {
    const m = prose.match(re);
    if (m) err(`copy sells direct to the affected individual: "${m[0]}". ` +
               `See legal/00-LEGAL-POSTURE.md section 2.3.`);
  }
}

// Unmatched claims are only fatal when selling. Before launch they are a list
// of things to add to the ledger.
for (const c of unmatched) {
  (mode === "selling" ? err : warn)(`claim not in the ledger: "${c}"`);
}

const counts = ledger.features.reduce((a, f) => ((a[f.status] = (a[f.status] || 0) + 1), a), {});
console.log(`\n  mode: ${mode}`);
console.log(`  ledger: ${counts.shipped || 0} shipped, ${counts.partial || 0} partial, ${counts.planned || 0} planned`);
console.log(`  ${errors} errors, ${warnings} warnings\n`);
process.exit(errors ? 1 : 0);
