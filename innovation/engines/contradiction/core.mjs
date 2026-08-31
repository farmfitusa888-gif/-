/**
 * core.mjs, the contradiction engine.
 *
 * This is the thing Counterweight sells. A denial letter says a claim is not
 * covered and cites a policy provision. The engine reads both documents, finds
 * the cited provision, and reports whether the provision actually says what the
 * letter claims it says.
 *
 * THE DESIGN DECISION THAT MATTERS MOST
 *
 * A language model is used for exactly one narrow job here: judging whether two
 * passages of text agree. Everything else is deterministic code, because
 * everything else can be. Finding a citation, resolving it to a provision,
 * detecting a carve-back, checking a deadline, and assembling the output are all
 * ordinary programming problems, and ordinary programming problems solved with a
 * model are how you get a product that cannot explain itself.
 *
 * Concretely, the engine can never report a finding it cannot point at a page
 * for. That is not a policy applied afterwards. It is structural: a Finding
 * without a Locator cannot be constructed.
 *
 * THE FAILURE THIS IS BUILT AROUND
 *
 * In February 2025 the FTC required DoNotPay to pay $193,000 for advertising a
 * service it had never tested. So this file ships with its accuracy harness
 * (grade.mjs) rather than promising one, and the plan forbids selling anything
 * until 20 real denial letters have been graded by a licensed adjuster.
 *
 * WHAT IT DOES NOT DO
 *
 * It does not decide whether a claim should be paid. It does not give legal or
 * insurance advice. It reports what two documents say and where they disagree,
 * and a licensed human decides what that means.
 */

/* ------------------------------------------------------------------ *
 * Locators: the reason a finding can be trusted
 * ------------------------------------------------------------------ */

/**
 * A pointer to an exact place in a document. Every assertion the engine makes
 * carries one, so the reviewer can open the page and check the work in seconds.
 */
export class Locator {
  constructor({ docId, page, charStart, charEnd, quote }) {
    if (!docId) throw new Error("Locator requires docId");
    if (!Number.isInteger(page) || page < 1) throw new Error("Locator requires a 1-based page number");
    if (!quote || !quote.trim()) throw new Error("Locator requires the quoted text");
    this.docId = docId;
    this.page = page;
    this.charStart = charStart ?? null;
    this.charEnd = charEnd ?? null;
    this.quote = quote.trim();
  }
  toString() { return `${this.docId} p.${this.page}`; }
}

export const FINDING_KINDS = {
  MISQUOTED_PROVISION: "misquoted_provision",
  CARVE_BACK_IGNORED: "carve_back_ignored",
  PROVISION_NOT_FOUND: "provision_not_found",
  NO_PROVISION_CITED: "no_provision_cited",
  DEADLINE: "deadline",
  DENIAL_SUPPORTED: "denial_supported",
};

/** Higher means look at it first. Ordering by stakes, not by discovery order. */
const KIND_WEIGHT = {
  [FINDING_KINDS.MISQUOTED_PROVISION]: 100,
  [FINDING_KINDS.CARVE_BACK_IGNORED]: 90,
  [FINDING_KINDS.NO_PROVISION_CITED]: 70,
  [FINDING_KINDS.PROVISION_NOT_FOUND]: 60,
  [FINDING_KINDS.DEADLINE]: 80,
  [FINDING_KINDS.DENIAL_SUPPORTED]: 10,
};

/**
 * A single reported observation.
 *
 * Note what the constructor refuses. A finding with no supporting locators
 * cannot exist, which is what makes "every finding cites its page" a property
 * of the type rather than a promise in the marketing.
 */
export class Finding {
  constructor({ kind, summary, letterLocator, policyLocators = [], confidence, rationale }) {
    if (!Object.values(FINDING_KINDS).includes(kind)) throw new Error(`Unknown finding kind: ${kind}`);
    if (!(letterLocator instanceof Locator)) throw new Error("Finding requires a Locator into the letter");
    if (kind !== FINDING_KINDS.NO_PROVISION_CITED && kind !== FINDING_KINDS.DEADLINE) {
      if (!policyLocators.length) throw new Error(`Finding ${kind} requires at least one policy Locator`);
    }
    for (const l of policyLocators) {
      if (!(l instanceof Locator)) throw new Error("policyLocators must all be Locator instances");
    }
    if (typeof confidence !== "number" || confidence < 0 || confidence > 1) {
      throw new Error("Finding requires a confidence between 0 and 1");
    }
    this.kind = kind;
    this.summary = summary;
    this.letterLocator = letterLocator;
    this.policyLocators = policyLocators;
    this.confidence = confidence;
    this.rationale = rationale ?? null;
    this.reviewed = false;
    this.reviewOutcome = null;
  }
  get weight() { return KIND_WEIGHT[this.kind] * this.confidence; }
}

/* ------------------------------------------------------------------ *
 * Documents
 * ------------------------------------------------------------------ */

/**
 * A document as pages of text. Page numbers are 1-based because that is what a
 * human sees on the page, and an off-by-one here would send a reviewer to the
 * wrong page, which destroys the only thing the product is selling.
 */
export class Doc {
  constructor(id, pages) {
    if (!Array.isArray(pages) || !pages.length) throw new Error("Doc requires a non-empty array of page texts");
    this.id = id;
    this.pages = pages;
  }
  get text() { return this.pages.join("\n"); }
  /** Absolute character offset -> { page, offsetInPage }. */
  locate(absOffset) {
    let acc = 0;
    for (let i = 0; i < this.pages.length; i++) {
      const len = this.pages[i].length + 1;
      if (absOffset < acc + len) return { page: i + 1, offsetInPage: absOffset - acc };
      acc += len;
    }
    return { page: this.pages.length, offsetInPage: 0 };
  }
  locatorAt(absOffset, length, quoteOverride) {
    const { page } = this.locate(absOffset);
    const quote = quoteOverride ?? this.text.slice(absOffset, absOffset + length);
    return new Locator({ docId: this.id, page, charStart: absOffset, charEnd: absOffset + length, quote });
  }
}

/* ------------------------------------------------------------------ *
 * Citation extraction, deterministic
 * ------------------------------------------------------------------ */

/**
 * Patterns for how insurers actually refer to policy provisions. Deliberately
 * ordered most specific first, because "Section I" should not swallow
 * "Section I(A)(2)".
 */
const CITATION_PATTERNS = [
  /\b(?:Section|Sec\.?|§)\s*([IVXLC]+|\d+)\s*(\([A-Za-z0-9]+\))*\s*(?:,\s*)?(?:Paragraph|Para\.?|Subsection)?\s*(\([A-Za-z0-9]+\))?/gi,
  /\b(Exclusion|Endorsement|Condition|Definition|Provision)\s+(?:number\s+)?([A-Za-z0-9][A-Za-z0-9.\-()]*)/gi,
  /\b(?:Form|Endorsement)\s+([A-Z]{2,}\s?\d{2,}\s?\d{2,}(?:\s?\d{2,})?)/g,
  /\bunder\s+(?:the\s+)?["“]([^"”]{4,80})["”]\s+(?:provision|exclusion|clause|section)/gi,
];

/** A citation found in the denial letter, with where it was found. */
export function extractCitations(letter) {
  const out = [];
  const seen = new Set();
  const text = letter.text;
  for (const re of CITATION_PATTERNS) {
    re.lastIndex = 0;
    let m;
    while ((m = re.exec(text)) !== null) {
      const raw = m[0].trim().replace(/\s+/g, " ");
      const key = raw.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      out.push({ raw, index: m.index, locator: letter.locatorAt(m.index, m[0].length, raw) });
    }
  }
  return out.sort((a, b) => a.index - b.index);
}

/* ------------------------------------------------------------------ *
 * Resolving a citation to the policy text
 * ------------------------------------------------------------------ */

const norm = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

/**
 * Find where a cited provision lives in the policy.
 *
 * Exact-ish matching first, then a token-overlap fallback. Anything below the
 * floor returns null rather than a guess, because a wrong provision is worse
 * than an admitted miss: it sends the reviewer to the wrong page and burns the
 * trust the whole product runs on.
 */
export function resolveCitation(policy, citation, { minOverlap = 0.6 } = {}) {
  const text = policy.text;
  const target = norm(citation.raw);
  if (!target) return null;

  const direct = text.toLowerCase().indexOf(citation.raw.toLowerCase());
  if (direct !== -1) {
    const end = findProvisionEnd(text, direct);
    return {
      locator: policy.locatorAt(direct, end - direct),
      body: text.slice(direct, end),
      matchType: "exact",
      score: 1,
    };
  }

  const targetTokens = new Set(target.split(" ").filter((t) => t.length > 1));
  if (!targetTokens.size) return null;

  let best = null;
  const WINDOW = 400;
  for (let i = 0; i < text.length; i += WINDOW / 2) {
    const chunk = text.slice(i, i + WINDOW);
    const chunkTokens = new Set(norm(chunk).split(" "));
    let hit = 0;
    for (const t of targetTokens) if (chunkTokens.has(t)) hit++;
    const score = hit / targetTokens.size;
    if (score > (best?.score ?? 0)) best = { index: i, score };
  }
  if (!best || best.score < minOverlap) return null;

  const end = findProvisionEnd(text, best.index);
  return {
    locator: policy.locatorAt(best.index, end - best.index),
    body: text.slice(best.index, end),
    matchType: "fuzzy",
    score: best.score,
  };
}

/** Provisions end at the next heading or a blank line, whichever comes first. */
function findProvisionEnd(text, start) {
  const HEADING = /\n\s*(?:(?:Section|Sec\.?|§|Exclusion|Endorsement|Condition|Definition)\b|[A-Z]\.\s|\d+\.\s)/g;
  HEADING.lastIndex = start + 1;
  const h = HEADING.exec(text);
  const blank = text.indexOf("\n\n", start + 1);
  const candidates = [h ? h.index : Infinity, blank === -1 ? Infinity : blank, start + 2500];
  return Math.min(...candidates, text.length);
}

/* ------------------------------------------------------------------ *
 * Carve-backs: the highest-value pattern in the whole product
 * ------------------------------------------------------------------ */

/**
 * Exclusions frequently end with language restoring coverage. A denial letter
 * that quotes the exclusion and stops before the carve-back is quoting
 * selectively, and that is the single most productive thing to look for in
 * a property claim.
 */
const CARVE_BACK_MARKERS = [
  /\bthis exclusion does not apply\b/i,
  /\bexcept\s+(?:that|when|where|if)\b/i,
  /\bunless\s+(?:the\s+)?(?:loss|damage|such)\b/i,
  /\bhowever[,]?\s+(?:we|this|coverage)\b/i,
  /\bwe do cover\b/i,
  /\bcoverage (?:is|shall be) (?:provided|afforded|restored)\b/i,
  /\bbut this (?:exclusion|limitation) does not\b/i,
  /\bnotwithstanding the foregoing\b/i,
];

export function findCarveBacks(provisionBody, provisionStartOffset, policy) {
  const out = [];
  for (const re of CARVE_BACK_MARKERS) {
    const m = re.exec(provisionBody);
    if (!m) continue;
    const abs = provisionStartOffset + m.index;
    const sentenceEnd = provisionBody.indexOf(".", m.index);
    const len = (sentenceEnd === -1 ? provisionBody.length : sentenceEnd + 1) - m.index;
    out.push({
      marker: m[0],
      locator: policy.locatorAt(abs, Math.min(len, 600)),
      text: provisionBody.slice(m.index, m.index + Math.min(len, 600)).trim(),
    });
  }
  return out;
}

/** Did the letter quote the carve-back, or stop before it? */
export function letterQuotesCarveBack(letterText, carveBack) {
  const needle = norm(carveBack.text).split(" ").filter((w) => w.length > 3).slice(0, 8);
  if (needle.length < 3) return false;
  const hay = norm(letterText);
  let hits = 0;
  for (const w of needle) if (hay.includes(w)) hits++;
  return hits / needle.length > 0.7;
}

/* ------------------------------------------------------------------ *
 * The agreement judge: the one place a model is used
 * ------------------------------------------------------------------ */

/**
 * Judges whether a provision supports the characterisation the letter gives it.
 *
 * Deliberately an injected function so the engine is model-agnostic: a hosted
 * API, a local open-weight model, or a human in a test harness all satisfy this
 * interface. The engine never imports a vendor SDK.
 *
 * Must resolve to { agrees: boolean, confidence: number, rationale: string }.
 */
export const AGREEMENT_PROMPT = `You compare two pieces of text from an insurance claim.

CLAIMED: what a denial letter says a policy provision means.
ACTUAL: the exact text of that provision.

Answer only this: does ACTUAL support CLAIMED?

Rules:
- Judge only the words given. Do not use outside knowledge of insurance law.
- If ACTUAL is silent on the point CLAIMED makes, that is NOT support.
- If ACTUAL contains an exception that CLAIMED omits, that is NOT support.
- If you are unsure, say so with a low confidence rather than guessing.

Reply as JSON only: {"agrees": true|false, "confidence": 0.0-1.0, "rationale": "one sentence"}`;

/** A judge that abstains. The safe default when nothing is wired up. */
export const abstainingJudge = async () => ({
  agrees: null,
  confidence: 0,
  rationale: "No agreement judge configured; comparison not performed.",
});

/* ------------------------------------------------------------------ *
 * The engine
 * ------------------------------------------------------------------ */

/**
 * Analyse a denial letter against its policy.
 *
 * @param {Doc} letter
 * @param {Doc} policy
 * @param {object} opts
 * @param {Function} [opts.judge] async ({claimed, actual}) => {agrees, confidence, rationale}
 * @param {number} [opts.minConfidence] below this a finding is withheld, not shown
 * @returns {Promise<{findings: Finding[], citations: object[], coverage: object, warnings: string[]}>}
 */
export async function analyse(letter, policy, opts = {}) {
  const { judge = abstainingJudge, minConfidence = 0.5 } = opts;
  const findings = [];
  const warnings = [];

  const citations = extractCitations(letter);

  if (!citations.length) {
    // A letter citing nothing is itself the finding. Several states require a
    // specific reason, so an absence is worth writing about.
    findings.push(new Finding({
      kind: FINDING_KINDS.NO_PROVISION_CITED,
      summary: "The letter does not cite a specific policy provision.",
      letterLocator: letter.locatorAt(0, Math.min(240, letter.text.length)),
      confidence: 0.95,
      rationale: "No section, exclusion, endorsement or named provision reference was found anywhere in the letter.",
    }));
  }

  let resolved = 0;
  for (const cite of citations) {
    const hit = resolveCitation(policy, cite);
    if (!hit) {
      findings.push(new Finding({
        kind: FINDING_KINDS.PROVISION_NOT_FOUND,
        summary: `The letter cites "${cite.raw}" but no matching provision was found in the policy provided.`,
        letterLocator: cite.locator,
        policyLocators: [policy.locatorAt(0, Math.min(120, policy.text.length))],
        confidence: 0.7,
        rationale: "Either the provision sits in a document not supplied, such as an endorsement, or the citation is wrong.",
      }));
      continue;
    }
    resolved++;

    // Carve-back check runs first: it is deterministic and needs no model.
    const provisionStart = hit.locator.charStart;
    const carveBacks = findCarveBacks(hit.body, provisionStart, policy);
    for (const cb of carveBacks) {
      if (!letterQuotesCarveBack(letter.text, cb)) {
        findings.push(new Finding({
          kind: FINDING_KINDS.CARVE_BACK_IGNORED,
          summary: `The cited provision contains an exception beginning "${cb.marker}" that the letter does not address.`,
          letterLocator: cite.locator,
          policyLocators: [hit.locator, cb.locator],
          confidence: 0.8,
          rationale: "Exclusions often restore coverage in defined circumstances. A letter that stops before the exception is quoting selectively.",
        }));
      }
    }

    // Then the model, on one narrow question.
    const claimed = surroundingClaim(letter.text, cite.index);
    let verdict;
    try {
      verdict = await judge({ claimed, actual: hit.body, citation: cite.raw });
    } catch (err) {
      warnings.push(`Agreement judge failed for "${cite.raw}": ${err.message}`);
      continue;
    }
    if (verdict.agrees === null) {
      warnings.push(`No comparison performed for "${cite.raw}".`);
      continue;
    }
    if (verdict.confidence < minConfidence) {
      warnings.push(`Low-confidence comparison for "${cite.raw}" withheld (${verdict.confidence.toFixed(2)}).`);
      continue;
    }
    findings.push(new Finding({
      kind: verdict.agrees ? FINDING_KINDS.DENIAL_SUPPORTED : FINDING_KINDS.MISQUOTED_PROVISION,
      summary: verdict.agrees
        ? `The cited provision appears to support the stated reason for denial.`
        : `The cited provision does not appear to say what the letter claims it says.`,
      letterLocator: cite.locator,
      policyLocators: [hit.locator],
      confidence: verdict.confidence,
      rationale: verdict.rationale,
    }));
  }

  findings.sort((a, b) => b.weight - a.weight);

  return {
    findings,
    citations,
    coverage: {
      citationsFound: citations.length,
      citationsResolved: resolved,
      resolutionRate: citations.length ? resolved / citations.length : 0,
      policyPages: policy.pages.length,
      letterPages: letter.pages.length,
    },
    warnings,
  };
}

/** The sentences around a citation, which are what the letter claims it means. */
function surroundingClaim(text, index, radius = 500) {
  const start = Math.max(0, text.lastIndexOf(".", Math.max(0, index - radius)) + 1);
  const endDot = text.indexOf(".", index + radius);
  const end = endDot === -1 ? Math.min(text.length, index + radius) : endDot + 1;
  return text.slice(start, end).trim();
}

/* ------------------------------------------------------------------ *
 * Export gate
 * ------------------------------------------------------------------ */

/**
 * Counterweight refuses to export a finished document while any finding is
 * unreviewed. Same discipline as the wage engine: the machine may find, only a
 * person may clear.
 */
export function canExport(findings) {
  const unreviewed = findings.filter((f) => !f.reviewed);
  return {
    allowed: unreviewed.length === 0,
    unreviewedCount: unreviewed.length,
    reason: unreviewed.length
      ? `${unreviewed.length} finding(s) have not been reviewed. Every finding must be opened and confirmed or dismissed before export.`
      : null,
  };
}

export function reviewFinding(finding, outcome) {
  const allowed = ["confirmed", "dismissed", "needs-more-info"];
  if (!allowed.includes(outcome)) throw new Error(`Review outcome must be one of ${allowed.join(", ")}`);
  finding.reviewed = true;
  finding.reviewOutcome = outcome;
  return finding;
}
