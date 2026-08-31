/**
 * Tests for the contradiction engine.
 *
 * Written against the failure modes that would destroy the product rather than
 * the ones that would embarrass the code. In rough order of how much damage
 * each would do:
 *
 *   1. A finding that points at the wrong page. The whole product is "check my
 *      work in seconds"; a wrong page makes that a lie.
 *   2. A confident finding on a denial that was actually correct. Sending an
 *      adjuster to fight a fair denial costs them a client.
 *   3. Silently reporting something the model invented.
 *   4. Exporting a document with unreviewed findings in it.
 *
 * Run: node --test innovation/engines/contradiction/core.test.mjs
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import {
  Doc, Locator, Finding, FINDING_KINDS,
  extractCitations, resolveCitation, findCarveBacks, letterQuotesCarveBack,
  analyse, canExport, reviewFinding, abstainingJudge,
} from "./core.mjs";

/* ---------------- fixtures ---------------- */

const POLICY_PAGES = [
  `HOMEOWNERS POLICY\nDECLARATIONS\nNamed Insured: Jane Doe\nDwelling Limit: $340,000\nDeductible: $2,500`,
  `SECTION I - PERILS INSURED AGAINST\nWe insure against risk of direct physical loss to property described in Coverage A.`,
  `SECTION I - EXCLUSIONS\nExclusion 3. Water Damage\nWe do not cover loss caused by water damage, meaning:\na. flood, surface water, waves, tidal water;\nb. water below the surface of the ground.\nThis exclusion does not apply to sudden and accidental discharge from a plumbing system located within the dwelling.`,
  `SECTION I - CONDITIONS\nCondition 2. Your Duties After Loss\nYou must give us proof of loss within 60 days after our request.`,
];

const policy = () => new Doc("policy.pdf", POLICY_PAGES);

const LETTER_MISQUOTED = new Doc("denial.pdf", [
  `Dear Ms Doe,\n\nWe have completed our review of claim 88-4412.\n\nYour claim is denied. Under Exclusion 3, Water Damage, the policy does not cover any loss involving water from any source. Accordingly no payment will be made.\n\nSincerely,\nClaims Department`,
]);

const LETTER_CORRECT = new Doc("denial2.pdf", [
  `Dear Ms Doe,\n\nOur inspection found the loss was caused by rising surface water entering at ground level during heavy rainfall.\n\nUnder Exclusion 3, Water Damage, we do not cover loss caused by flood or surface water. This exclusion does not apply to sudden and accidental discharge from a plumbing system within the dwelling, and no plumbing discharge was involved here.\n\nYour claim is therefore denied.`,
]);

const LETTER_VAGUE = new Doc("denial3.pdf", [
  `Dear Ms Doe,\n\nAfter review, your claim is denied because the loss is not covered under the terms and conditions of your policy.\n\nSincerely,\nClaims Department`,
]);

/** Judges that let us test the engine without a model. */
const alwaysDisagrees = async () => ({ agrees: false, confidence: 0.9, rationale: "Provision is narrower than described." });
const alwaysAgrees   = async () => ({ agrees: true,  confidence: 0.9, rationale: "Provision supports the stated reason." });
const lowConfidence  = async () => ({ agrees: false, confidence: 0.2, rationale: "Unclear." });
const throwingJudge  = async () => { throw new Error("model unavailable"); };

/* ---------------- Locator: the trust primitive ---------------- */

test("a Locator cannot exist without a document, a page and a quote", () => {
  assert.throws(() => new Locator({ page: 1, quote: "x" }), /docId/);
  assert.throws(() => new Locator({ docId: "a", quote: "x" }), /page/);
  assert.throws(() => new Locator({ docId: "a", page: 1 }), /quoted text/);
  assert.throws(() => new Locator({ docId: "a", page: 0, quote: "x" }), /page/);
});

test("page numbers are 1-based and land on the right page", () => {
  const p = policy();
  // The water exclusion is on page 3.
  const idx = p.text.indexOf("Exclusion 3. Water Damage");
  assert.equal(p.locate(idx).page, 3, "an off-by-one here sends the reviewer to the wrong page");
  // The proof-of-loss condition is on page 4.
  const idx2 = p.text.indexOf("proof of loss");
  assert.equal(p.locate(idx2).page, 4);
  // First character is page 1.
  assert.equal(p.locate(0).page, 1);
});

test("a locator's quote is the text actually at that offset", () => {
  const p = policy();
  const idx = p.text.indexOf("This exclusion does not apply");
  const loc = p.locatorAt(idx, 29);
  assert.equal(loc.quote, "This exclusion does not apply");
  assert.equal(p.text.slice(loc.charStart, loc.charEnd), loc.quote);
});

/* ---------------- Finding: cannot exist without evidence ---------------- */

test("a finding cannot be constructed without a locator into the letter", () => {
  assert.throws(() => new Finding({
    kind: FINDING_KINDS.MISQUOTED_PROVISION, summary: "x", confidence: 0.9,
  }), /Locator into the letter/);
});

test("a substantive finding cannot be constructed without a policy locator", () => {
  const l = new Locator({ docId: "d", page: 1, quote: "q" });
  assert.throws(() => new Finding({
    kind: FINDING_KINDS.MISQUOTED_PROVISION, summary: "x", letterLocator: l, confidence: 0.9,
  }), /requires at least one policy Locator/);
});

test("confidence outside 0..1 is rejected", () => {
  const l = new Locator({ docId: "d", page: 1, quote: "q" });
  for (const c of [-0.1, 1.5, "high", undefined]) {
    assert.throws(() => new Finding({
      kind: FINDING_KINDS.NO_PROVISION_CITED, summary: "x", letterLocator: l, confidence: c,
    }), /confidence/);
  }
});

/* ---------------- citation extraction ---------------- */

test("finds an exclusion citation in a denial letter", () => {
  const c = extractCitations(LETTER_MISQUOTED);
  assert.ok(c.length >= 1);
  assert.ok(c.some((x) => /Exclusion 3/i.test(x.raw)), `got: ${c.map((x) => x.raw).join(" | ")}`);
});

test("every citation carries a locator into the letter", () => {
  for (const c of extractCitations(LETTER_MISQUOTED)) {
    assert.ok(c.locator instanceof Locator);
    assert.equal(c.locator.docId, "denial.pdf");
  }
});

test("a vague letter yields no citation", () => {
  assert.equal(extractCitations(LETTER_VAGUE).length, 0,
    "'terms and conditions of your policy' cites nothing and must not be treated as a citation");
});

test("the same citation is not reported twice", () => {
  const d = new Doc("x.pdf", ["Under Exclusion 3 we deny. As stated, Exclusion 3 applies. See Exclusion 3."]);
  const raws = extractCitations(d).map((c) => c.raw.toLowerCase());
  assert.equal(new Set(raws).size, raws.length);
});

/* ---------------- resolution: refusing to guess ---------------- */

test("resolves a real citation to the right page of the policy", () => {
  const p = policy();
  const cite = extractCitations(LETTER_MISQUOTED).find((c) => /Exclusion 3/i.test(c.raw));
  const hit = resolveCitation(p, cite);
  assert.ok(hit, "should resolve");
  assert.equal(hit.locator.page, 3);
  assert.match(hit.body, /Water Damage/);
});

test("returns null rather than guessing when the provision is absent", () => {
  const p = policy();
  const fake = { raw: "Endorsement HO-9987 44 12", index: 0, locator: new Locator({ docId: "l", page: 1, quote: "x" }) };
  assert.equal(resolveCitation(p, fake), null,
    "a wrong provision is worse than an admitted miss");
});

test("refuses a WEAK partial match rather than resolving it to the nearest thing", () => {
  // This is the dangerous case, not the absent one. "Exclusion 9, Earth
  // Movement" shares the token "exclusion" with the water exclusion that IS in
  // the policy, so a naive nearest-match resolver happily returns the wrong
  // provision and sends the reviewer to a page that does not support the
  // finding. The overlap floor exists to stop exactly this.
  const p = policy();
  const weak = {
    raw: "Exclusion 9, Earth Movement, Subsidence and Sinkhole Collapse",
    index: 0,
    locator: new Locator({ docId: "l", page: 1, quote: "x" }),
  };
  const hit = resolveCitation(p, weak);
  assert.equal(hit, null,
    "partial token overlap must not be treated as a resolution");
});

test("the overlap floor is honoured and is not decorative", () => {
  const p = policy();
  const weak = {
    raw: "Exclusion 9, Earth Movement, Subsidence and Sinkhole Collapse",
    index: 0,
    locator: new Locator({ docId: "l", page: 1, quote: "x" }),
  };
  // Drop the floor to zero and the same citation now resolves, which proves the
  // floor is what rejects it rather than an accident of the fixture.
  const forced = resolveCitation(p, weak, { minOverlap: 0 });
  assert.ok(forced, "with no floor a weak match resolves, so the floor is load-bearing");
  assert.ok(forced.score < 0.6, `weak match scored ${forced?.score}`);
});

/* ---------------- carve-backs ---------------- */

test("detects the carve-back inside the water exclusion", () => {
  const p = policy();
  const start = p.text.indexOf("Exclusion 3. Water Damage");
  const end = p.text.indexOf("SECTION I - CONDITIONS");
  const cbs = findCarveBacks(p.text.slice(start, end), start, p);
  assert.ok(cbs.length >= 1);
  assert.match(cbs[0].text, /does not apply/i);
  assert.equal(cbs[0].locator.page, 3);
});

test("knows when the letter DID quote the carve-back", () => {
  const p = policy();
  const start = p.text.indexOf("Exclusion 3. Water Damage");
  const end = p.text.indexOf("SECTION I - CONDITIONS");
  const cb = findCarveBacks(p.text.slice(start, end), start, p)[0];
  assert.equal(letterQuotesCarveBack(LETTER_CORRECT.text, cb), true,
    "the honest letter addressed the exception and must not be flagged");
  assert.equal(letterQuotesCarveBack(LETTER_MISQUOTED.text, cb), false);
});

/* ---------------- the whole analysis ---------------- */

test("flags a letter that overstates the exclusion", async () => {
  const r = await analyse(LETTER_MISQUOTED, policy(), { judge: alwaysDisagrees });
  const kinds = r.findings.map((f) => f.kind);
  assert.ok(kinds.includes(FINDING_KINDS.MISQUOTED_PROVISION));
  assert.ok(kinds.includes(FINDING_KINDS.CARVE_BACK_IGNORED),
    "the letter ignored 'This exclusion does not apply to sudden and accidental discharge'");
});

test("does NOT flag a carve-back the letter properly addressed", async () => {
  const r = await analyse(LETTER_CORRECT, policy(), { judge: alwaysAgrees });
  assert.equal(r.findings.filter((f) => f.kind === FINDING_KINDS.CARVE_BACK_IGNORED).length, 0,
    "false positives on honest denials cost the adjuster a client");
});

test("says so when a denial looks correct", async () => {
  const r = await analyse(LETTER_CORRECT, policy(), { judge: alwaysAgrees });
  assert.ok(r.findings.some((f) => f.kind === FINDING_KINDS.DENIAL_SUPPORTED),
    "being willing to say 'they were right' is what makes the tool credible");
});

test("a letter citing nothing produces that as the finding", async () => {
  const r = await analyse(LETTER_VAGUE, policy(), { judge: alwaysDisagrees });
  assert.equal(r.findings.length, 1);
  assert.equal(r.findings[0].kind, FINDING_KINDS.NO_PROVISION_CITED);
});

test("every finding in a real run carries a page reference", async () => {
  const r = await analyse(LETTER_MISQUOTED, policy(), { judge: alwaysDisagrees });
  assert.ok(r.findings.length > 0);
  for (const f of r.findings) {
    assert.ok(f.letterLocator instanceof Locator);
    assert.ok(f.letterLocator.page >= 1);
    for (const l of f.policyLocators) assert.ok(l.page >= 1 && l.quote.length > 0);
  }
});

test("findings are ordered by stakes, not by discovery order", async () => {
  const r = await analyse(LETTER_MISQUOTED, policy(), { judge: alwaysDisagrees });
  for (let i = 1; i < r.findings.length; i++) {
    assert.ok(r.findings[i - 1].weight >= r.findings[i].weight);
  }
});

/* ---------------- the model failing ---------------- */

test("with no judge configured, nothing is asserted and the gap is reported", async () => {
  const r = await analyse(LETTER_MISQUOTED, policy(), { judge: abstainingJudge });
  assert.equal(r.findings.filter((f) => f.kind === FINDING_KINDS.MISQUOTED_PROVISION).length, 0);
  assert.ok(r.warnings.some((w) => /No comparison performed/.test(w)),
    "silence about a check that did not run is the DoNotPay failure");
});

test("a low-confidence verdict is withheld and surfaced as a warning", async () => {
  const r = await analyse(LETTER_MISQUOTED, policy(), { judge: lowConfidence, minConfidence: 0.5 });
  assert.equal(r.findings.filter((f) => f.kind === FINDING_KINDS.MISQUOTED_PROVISION).length, 0);
  assert.ok(r.warnings.some((w) => /Low-confidence/.test(w)));
});

test("a crashing model degrades to a warning rather than a wrong answer", async () => {
  const r = await analyse(LETTER_MISQUOTED, policy(), { judge: throwingJudge });
  assert.ok(r.warnings.some((w) => /model unavailable/.test(w)));
  // Deterministic findings still stand.
  assert.ok(r.findings.some((f) => f.kind === FINDING_KINDS.CARVE_BACK_IGNORED));
});

/* ---------------- coverage honesty ---------------- */

test("reports how much of the letter it actually resolved", async () => {
  const r = await analyse(LETTER_MISQUOTED, policy(), { judge: alwaysDisagrees });
  assert.ok(r.coverage.citationsFound >= 1);
  assert.ok(r.coverage.resolutionRate > 0 && r.coverage.resolutionRate <= 1);
});

test("an unresolvable citation is reported, not hidden", async () => {
  const letter = new Doc("d.pdf", ["Denied under Endorsement HO-4471 09 22, which excludes this loss."]);
  const r = await analyse(letter, policy(), { judge: alwaysDisagrees });
  assert.ok(r.findings.some((f) => f.kind === FINDING_KINDS.PROVISION_NOT_FOUND));
});

/* ---------------- the export gate ---------------- */

test("export is blocked while any finding is unreviewed", async () => {
  const r = await analyse(LETTER_MISQUOTED, policy(), { judge: alwaysDisagrees });
  const gate = canExport(r.findings);
  assert.equal(gate.allowed, false);
  assert.equal(gate.unreviewedCount, r.findings.length);
});

test("export opens once every finding has been reviewed", async () => {
  const r = await analyse(LETTER_MISQUOTED, policy(), { judge: alwaysDisagrees });
  for (const f of r.findings) reviewFinding(f, "confirmed");
  assert.equal(canExport(r.findings).allowed, true);
});

test("dismissing a finding still counts as reviewing it", async () => {
  const r = await analyse(LETTER_MISQUOTED, policy(), { judge: alwaysDisagrees });
  for (const f of r.findings) reviewFinding(f, "dismissed");
  assert.equal(canExport(r.findings).allowed, true);
});

test("an invented review outcome is rejected", () => {
  const f = new Finding({
    kind: FINDING_KINDS.NO_PROVISION_CITED, summary: "x",
    letterLocator: new Locator({ docId: "d", page: 1, quote: "q" }), confidence: 0.9,
  });
  assert.throws(() => reviewFinding(f, "looks fine"), /must be one of/);
});
