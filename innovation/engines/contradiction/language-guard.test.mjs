// Tests for the UPL output filter.
//
// Written adversarially. A guard that only passes the sentences it was written
// from proves nothing, so most of what follows is either a forbidden sentence
// dressed up to look innocent, or a permitted sentence built out of words the
// guard dislikes. The interesting failures are in the second group: a filter
// that blocks legitimate output gets switched off, and a filter that is off
// protects nobody.

import { scan } from "./language-guard.mjs";
import { strict as assert } from "node:assert";

let pass = 0, fail = 0;
const t = (name, fn) => {
  try { fn(); pass++; console.log(`  PASS  ${name}`); }
  catch (e) { fail++; console.log(`  FAIL  ${name}\n        ${e.message}`); }
};
const blocked = (s, o) => assert.ok(scan(s, o).length > 0, `should have been blocked: ${s}`);
const allowed = (s, o) => assert.deepEqual(scan(s, o), [], `should have been allowed: ${s}`);

console.log("\nlanguage guard\n");

// --- the sentences the product exists to produce --------------------------

t("a plain contradiction, cited, is allowed", () =>
  allowed("The letter cites Exclusion B.3. Exclusion B.3 on page 47 contains a carve-back for sudden and accidental discharge, which the letter does not mention."));

t("a neutral description of a missing provision is allowed", () =>
  allowed("The letter refers to a wear and tear exclusion. No provision using that phrase appears in the policy as uploaded."));

t("a deadline statement is allowed", () =>
  allowed("The letter is dated 3 March. The policy allows 60 days to request reconsideration, which would end on 2 May."));

t("saying the denial appears correct is allowed", () =>
  allowed("The exclusion the letter cites matches the policy text, and no carve-back applies to these facts as described."));

// --- the sentences that would move this into legal advice -----------------

t("telling the customer they have a valid claim is blocked", () =>
  blocked("You have a valid claim and should appeal this denial."));

t("predicting an outcome is blocked", () =>
  blocked("You will likely win this appeal."));

t("recommending a course of action is blocked", () =>
  blocked("We recommend that you sue the insurer for bad faith."));

t("guaranteeing anything is blocked", () =>
  blocked("We guarantee your claim will be overturned."));

// --- disguised forms, which is where a naive filter dies ------------------

t("advice hedged with 'in our opinion' is still blocked", () =>
  blocked("In our opinion you are legally entitled to the full replacement cost."));

t("advice in the passive voice is still blocked", () =>
  blocked("It is our assessment that you have a strong case here."));

t("a contingency fee offer is blocked", () =>
  blocked("No win, no fee. We only take a percentage of your settlement."));

// --- the false-positive traps --------------------------------------------
//
// These are the cases that decide whether anyone leaves the guard switched on.

t("the word 'attorney' passes inside a disclaimer", () =>
  allowed("Countercite is not a law firm and does not provide legal advice. Consult an attorney about your legal rights.",
          { isDisclaimer: true }));

t("the same sentence is blocked outside a disclaimer", () =>
  blocked("Consult an attorney about your legal rights."));

t("a negated disclaimer sentence is not read as advice", () =>
  allowed("Nothing in this report is legal advice.", { isDisclaimer: true }));

t("quoting the policy's own word 'entitled' is allowed", () =>
  allowed("The policy states that the insured is entitled to replacement cost once repairs are complete. The letter offers actual cash value."));

t("empty and whitespace input is allowed rather than crashing", () => {
  allowed(""); allowed("   \n  ");
});

// --- the guard must not be silently bypassable ----------------------------

t("scan returns rule ids, so a failure can be diagnosed", () => {
  const hits = scan("You should sue them.");
  assert.ok(hits.length > 0);
  assert.ok(hits.every((h) => typeof h === "string" && h.length > 0));
});

t("isDisclaimer does not disable the outcome-promise rules", () =>
  blocked("We guarantee your claim will be overturned.", { isDisclaimer: true }));


// --- the evasion class that produced the only two real bugs ---------------
//
// Both holes the first run found were one inserted adverb. Kept as a named
// group so a future rule that forgets ADV fails here rather than in production.

t("an adverb between subject and verb does not defeat the guard", () => {
  blocked("You are legally entitled to the full replacement cost.");
  blocked("You are clearly covered under this policy.");
  blocked("You will likely win this appeal.");
  blocked("You would probably prevail on these facts.");
});

t("the adverb allowance does not reach across a clause boundary", () =>
  allowed("The policy is unusually clearly drafted. The insured is entitled to replacement cost."));

console.log(`\n${pass} passed, ${fail} failed\n`);
process.exit(fail ? 1 : 0);
