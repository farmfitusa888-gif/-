// language-guard.mjs
//
// The output filter that keeps generated prose on the right side of the
// unauthorized-practice-of-law line. Lifted out of legal/00-LEGAL-POSTURE.md
// section 1.4 so it is executable rather than advisory.
//
// Why this has to be a filter and not a prompt instruction: core.mjs already
// enforces the structural half of the legal posture through types. A Finding
// cannot exist without a Locator, resolveCitation returns null rather than
// guessing, and canExport blocks while anything is unreviewed. None of that
// constrains `summary` and `rationale`, which are free text that a model
// writes. A prompt asking the model not to give legal advice is a request. A
// regex that fails the build is a guarantee, and only one of those survives a
// model update.
//
// Run scan() on every generated string before it reaches a customer. A
// non-empty result is a bug, not a warning.

//
// Every string the product shows a customer or writes into an exported document
// must pass this filter. These are not style preferences. Each pattern maps to
// a sentence form that a state could read as legal advice, an outcome promise,
// or unlicensed adjusting. Written 2026-08-31 against the analysis in
// innovation/legal/00-LEGAL-POSTURE.md §1.4.
//
// Adding an exception requires a note saying which state's rule permits it.

// One optional adverb, allowed between a subject and its verb. Written once
// and reused, because forgetting it in a new rule is the easiest way to ship a
// pattern that looks right and blocks nothing.
const ADV = String.raw`(?:\s+\w+ly)?`;

export const BLOCKED = [
  // --- entitlement and outcome (rule N1, N4, N12) ---
  { id: "B01", re: new RegExp(String.raw`\byou (?:are|were|may be|might be|should be)` + ADV + String.raw` (?:entitled|covered|owed|due)\b`, "i") },
  { id: "B02", re: /\byou (have|may have|likely have|probably have) a (valid|strong|good|viable|legitimate) (claim|case|appeal|argument)\b/i },
  { id: "B03", re: new RegExp(String.raw`\b(?:should|will|would|is likely to|are likely to|can expect to)` + ADV + String.raw` (?:win|prevail|succeed|be paid|be reversed|be overturned)\b`, "i") },
  { id: "B04", re: /\b(good|strong|excellent|poor|weak) (chance|odds|prospects|likelihood)\b/i },
  { id: "B05", re: /\b\d{1,3}\s?% (chance|likely|likelihood|of (winning|success|reversal))\b/i },
  { id: "B06", re: /\b(guarantee|guaranteed|we guarantee|assured|certain to)\b/i },
  { id: "B07", re: /\b(recover|recoup|get back|win) (up to )?\$/i },

  // --- legal conclusions about the denial (rule N2, N8) ---
  { id: "B08", re: /\bthe denial (was|is) (wrong|improper|invalid|unlawful|illegal|unjustified|unreasonable|incorrect|baseless)\b/i },
  { id: "B09", re: /\b(bad faith|acted in bad faith|breach(ed)? (of )?(the )?(policy|contract|duty)|unfair claims? (settlement )?practice)\b/i },
  { id: "B10", re: /\bthe (insurer|carrier|company) (violated|breached|failed to comply|is required to|must)\b/i },
  { id: "B11", re: /\bwrongful(ly)? (denied|denial)\b/i },

  // --- applying the policy to the customer's facts (rule N3; also 215 ILCS 5/1510) ---
  { id: "B12", re: /\bthis (exclusion|provision|clause|exception|carve-?back) (applies|does not apply|would apply) to (your|the insured'?s?) (loss|damage|claim|situation|property)\b/i },
  { id: "B13", re: /\byour (loss|damage|claim) (is|is not|was|was not|would be) (covered|excluded|payable)\b/i },
  { id: "B14", re: /\b(coverage|the policy) (applies|does not apply|extends|should extend) (to|in) your\b/i },

  // --- advice and recommendation (rule N5, N7, N11) ---
  { id: "B15", re: /\byou (should|must|need to|ought to|are advised to|we recommend|we advise|we suggest)\b/i },
  { id: "B16", re: /\b(our|my) (advice|recommendation|opinion) (is|would be)\b/i },
  { id: "B17", re: /\byour (legal )?(rights|remedies|options|defen[cs]es) (are|include|would be)\b/i },
  { id: "B18", re: /\byou (do not|don'?t) need (a|an) (lawyer|attorney|adjuster)\b/i },
  { id: "B19", re: /\b(instead of|rather than|no need for) (hiring )?(a|an) (lawyer|attorney|public adjuster)\b/i },
  { id: "B20", re: /\b(file|submit|send) (a|your) (complaint|lawsuit|suit|appeal) (with|to|against)\b/i },

  // --- deadlines and limitation periods (rule N9) ---
  { id: "B21", re: /\byou have \d+ (days?|months?|years?) to\b/i },
  { id: "B22", re: /\b(statute of limitations|limitations? period|time[- ]barred|deadline (to|for) (appeal|sue|file))\b/i },

  // --- holding out as a professional (rule N13; Tex. Ins. Code 4102.001,
  //     Fla. Stat. 626.854, Cal. B&P 6126, 215 ILCS 5/1515) ---
  { id: "B23", re: /\b(your|our|an|a) (ai|robot|virtual|automated|digital) (lawyer|attorney|adjuster|advocate|counsel)\b/i },
  { id: "B24", re: /\b(as good as|better than|replaces?|substitute for|instead of) (a|an|your) (lawyer|attorney|public adjuster|professional)\b/i },
  { id: "B25", re: /\bwe (will |can |)?(negotiate|settle|adjust|handle|manage|pursue) your claim\b/i },
  { id: "B26", re: /\bwe (will |can |)?(contact|call|write to|deal with|represent you (before|to)) (your|the) (insurer|carrier|insurance company|adjuster)\b/i },
  { id: "B27", re: /\b(we|countercite) (represent|act for|act on behalf of|advocate for) you\b/i },
  // Negation must appear in the same sentence, ahead of the phrase. "Nothing in
  // this report is legal advice" passes; "here is some legal advice" does not.
  { id: "B28", re: /\b(legal|insurance) advice\b/i, unless: /\b(not|nothing|never|no|cannot|does not|is not)\b[^.!?]{0,60}\b(legal|insurance) advice\b/i },

  // --- fee structures that would make us a public adjuster (see section 2) ---
  { id: "B29", re: /\b(percentage|share|%) of (your|the) (settlement|recovery|payout|proceeds)\b/i },
  { id: "B30", re: /\b(no win,? no fee|only pay if|contingen(t|cy) fee)\b/i },
];

// Words allowed only in fixed, reviewed disclaimer strings. Anywhere else,
// a build failure. Keeps "attorney" and "adjuster" out of generated prose
// while leaving the disclaimers in DISCLAIMERS.md intact.
export const RESTRICTED_TO_DISCLAIMERS = [
  "attorney", "lawyer", "law firm", "public adjuster", "legal advice",
];

export function scan(text, { isDisclaimer = false } = {}) {
  const hits = [];
  for (const rule of BLOCKED) {
    if (rule.re.test(text) && !(rule.unless && rule.unless.test(text))) {
      hits.push(rule.id);
    }
  }
  if (!isDisclaimer) {
    for (const w of RESTRICTED_TO_DISCLAIMERS) {
      if (new RegExp(`\\b${w}\\b`, "i").test(text)) hits.push(`RESTRICTED:${w}`);
    }
  }
  return hits;
}
