# Countercite, legal posture

Written 2026-08-31. Covers unauthorized practice of law, public adjuster
licensing, the entity question, and the risk register.

---

## Read this before anything else

**I am not a lawyer, and neither is the owner of this business.** This document
is research and product design. It is not legal advice, it does not create any
kind of professional relationship, and nobody should rely on it the way they
would rely on advice from counsel. Its purpose is narrower and, I think, more
useful: to find where the legal lines actually sit, and to design the product
and the paperwork so the business stays a long way clear of them.

**A second admission, and it matters.** The environment this was researched in
blocks direct access to legal websites. Every statute, rule and case below was
found through a search index that returns summaries, not through reading the
primary text. So there is not a single `[verified]` label in this document. That
is not a formality. Section numbers get renumbered, statutes get amended, and a
summary can drop the one subsection that changes the answer. **Before any of
this is relied on, someone should open the actual statute and read it.**

Labels used throughout:

| Label | Meaning |
|---|---|
| `[verified]` | Primary source text read in full. **Zero items in this document carry this label.** |
| `[review]` | Search-index summary only. Section number and substance believed correct, text not read. |
| `[conflict]` | Sources disagree, or the section numbering is uncertain. |
| `[NOT ESTABLISHED]` | Could not be determined. Stated as unknown rather than guessed. |

Nothing here is invented. Where a section number could not be confirmed, it says
so instead of supplying one.

---

## 1. Unauthorized practice of law

This is the largest exposure in the business, and it is larger for the
policyholder-facing product than for the adjuster-facing one.

### 1.1 What each state's rule actually is

#### Texas

**Tex. Gov't Code § 81.101** defines the practice of law. Subsection (a) covers
preparing a document incident to an action or proceeding, managing an action on
behalf of a client, and also out-of-court services including giving advice or
rendering any service that requires the use of legal skill or knowledge
`[review]`. Subsection (b) reserves the definition to the judiciary `[review]`.

**Subsection (c) is the most important sentence in this entire document.**
As rendered by the search index `[review]`:

> the "practice of law" does not include the design, creation, publication,
> distribution, display, or sale, including publication, distribution, display,
> or sale by means of an Internet web site, of written materials, books, forms,
> computer software, or similar products if the products clearly and
> conspicuously state that the products are not a substitute for the advice of
> an attorney.

The subsection was added by Acts 1999, 76th Leg. (H.B. 1507), effective 18 June
1999 `[review]`. It carries one carve-out, for Gov't Code ch. 83, which concerns
charging for the preparation of instruments affecting title to real property:
deeds, deeds of trust, mortgages, lien releases `[review]`. **Chapter 83 has
nothing to do with insurance appeals**, so the safe harbour applies to this
product without qualification.

Enforcement runs through the Supreme Court of Texas Unauthorized Practice of Law
Committee `[review]`.

**Texas is the friendliest of the four states, and it is friendly because of a
software case.** See §1.2.

#### Florida

Florida has **no statutory definition** of the practice of law. The Supreme
Court of Florida holds the power to define it, and does so case by case
`[review]`. The Florida Bar's proposed rule 10-2.1 definition was withdrawn
before filing because the Bar concluded it needed refinement `[review]`.

**Fla. Stat. § 454.23** is the penalty provision. Practising law without a
licence, or holding oneself out as qualified to practise, is a **third-degree
felony** `[review]`. Chapter 10 of the Rules Regulating The Florida Bar governs
UPL proceedings `[review]`.

Florida is the harshest of the four: a felony grading, no software safe harbour,
and a Supreme Court with a recent record of reading UPL broadly.

#### California

**Cal. Bus. & Prof. Code § 6125**: no person shall practise law in California
unless an active member of the State Bar `[review]`.

**Cal. Bus. & Prof. Code § 6126(a)**: advertising or holding oneself out as
practising or entitled to practise law, or otherwise practising law, while not
an active member, is a **misdemeanor** `[review]`.

Like Florida, California leaves the definition of "practice of law" to case law.
But it also has something the other three do not, and it is the single most
useful drafting resource found in this research.

**Cal. Bus. & Prof. Code §§ 6400 to 6415** create and regulate **Legal Document
Assistants** `[review]`. Section 6411 lists what an LDA may not do. As rendered
by the search index `[review]`, an LDA is prohibited from

> giving any kind of advice, explanation, opinion, or recommendation to a
> consumer about possible legal rights, remedies, defenses, options, selection
> of forms, or strategies.

Registration does not immunise anyone from prosecution under §§ 6125, 6126,
6126.5 or 6127 `[review]`. Registration is with the **county clerk** of the
county of the principal place of business, plus any county where the work is
performed, and requires a **$25,000 surety bond** under § 6405 `[review]`.

That prohibited-acts list is the most precise sentence-level statement of the
line that exists anywhere in the four states. **The product rule set in §1.4 is
built on it**, and so is the disclaimer wording, because the whole online legal
forms industry already borrowed it.

#### Illinois

**705 ILCS 205/1**, the Attorney Act: no person may practise as an attorney or
counselor at law in Illinois without a licence from the Illinois Supreme Court;
no unlicensed person may receive compensation, directly or indirectly, for legal
services, or advertise or hold out as providing them; a person doing so is
**guilty of contempt of court** `[review]`.

Neither the Attorney Act nor the Illinois Supreme Court Rules define
"unauthorized practice of law," and the court has never published an exhaustive
list of what counts `[review]`. The settled formulation from Illinois case law
is that the practice of law is **the giving of advice or the rendering of any
service requiring the use of legal skill or knowledge** `[review]`.

Illinois guidance treats document preparation as sitting on the line: a
non-lawyer may fill in information supplied to them, but once they begin
altering the form itself or advising on content, they have crossed over
`[review]`. The Illinois State Bar Association enforces actively, and the remedy
is criminal contempt `[review]`.

**On specific Illinois case names:** the search returned an enforcement matter
against an individual (Charlene Marsh, found guilty of indirect criminal
contempt after charging roughly $23,000 for legal research and document
preparation) `[review]`. I could not confirm the citation, so it is offered as
an illustration of enforcement posture, not as authority. `[NOT ESTABLISHED]`

### 1.2 The precedents that matter

#### The Texas software case, and why Texas is safe

**Unauthorized Practice of Law Committee v. Parsons Technology, Inc.,
179 F.3d 956 (5th Cir. 1999)** `[review]`.

Parsons sold **Quicken Family Lawyer**, a program that supplied legal forms,
asked the user a series of questions to work out which form suited them, and
produced a customised document. The Texas UPL Committee sued. The district court
granted summary judgment against Parsons and **permanently enjoined the sale of
the software in Texas** `[review]`.

Two facts from the district court record are directly instructive for
Countercite's interface design `[review]`:

1. The program **asked questions and then selected the form** for the user.
   Selection of forms is on the California § 6411 prohibited list too.
2. The disclaimer **appeared only on first start-up**. It was not on the
   packaging, and it did not reappear on subsequent uses.

While the appeal was pending, the Texas Legislature passed H.B. 1507, adding
§ 81.101(c). The Fifth Circuit **vacated the injunction and judgment and
remanded** in light of the amendment `[review]`.

**What this means in practice.** Texas resolved the software question by
statute, and the statute's price of admission is a disclaimer that is *clear and
conspicuous*. Parsons' disclaimer failed on conspicuousness at the district
court. So the safe harbour is real, and the way to lose it is to hide the
disclaimer. That drives the placement rules in `DISCLAIMERS.md`, which are
deliberately more aggressive than a designer would like.

#### The Florida case that should worry us

**The Florida Bar v. TIKD Services LLC, 326 So. 3d 1073 (Fla. 2021)** `[review]`.

TIKD ran a website where drivers with traffic tickets paid a flat fee. TIKD then
routed the ticket to a licensed Florida attorney it contracted with, and paid
the attorney's costs. TIKD was not a law firm and its CEO was not a lawyer.
A referee found no UPL, holding TIKD supplied only administrative and financial
services. **The Florida Supreme Court disapproved that finding, held TIKD was
engaged in the unauthorized practice of law, and permanently enjoined it**
`[review]`.

The reasoning `[review]`: as a non-lawyer, TIKD lacked the skill or training to
ensure the quality of the legal services delivered through the attorneys it
contracted with, and could not ensure compliance with the Rules of Professional
Conduct. The majority objected to a "bifurcation of responsibilities between
lawyers and nonlawyers with respect to the provision of legal services." It also
noted the potential conflict between TIKD's profit interest and the lawyer's
duty to the client, and the fact that a non-lawyer was holding funds outside a
trust account. The court was **closely divided** `[review]`.

**Why Countercite is distinguishable, and it is worth being explicit.** TIKD
inserted itself between a consumer and a lawyer, took money for a legal outcome,
held the funds, and stood behind the result. Countercite has no lawyers in the
loop at all, holds no client money, promises no outcome, and never stands
between the customer and anyone. **The TIKD risk is a risk of becoming TIKD**,
and the way it would happen is by adding a "we'll connect you with an attorney"
feature or by taking a share of what the customer recovers. Both are on the
never-do list in §1.4.

#### The document-preparation line, drawn twice in Florida

**The Florida Bar v. Brumbaugh, 355 So. 2d 1186 (Fla. 1978)** `[review]`.
Marilyn Brumbaugh ran a secretarial service typing do-it-yourself divorce
papers. The court's holding is the cleanest statement of the line in any of the
four states `[review]`: it is **not** improper to type the forms **provided she
only copies information given to her in writing by the client**, and she **must
not** advise clients on the remedies available to them or otherwise assist in
preparing the forms.

Read that twice, because it is more restrictive than most people expect.
Transcription is fine. Choosing what goes in the document is not.

**The Florida Bar v. We The People Forms and Service Center of Sarasota, Inc.,
883 So. 2d 1280 (Fla. 2004)** `[review]`. A national document-preparation
franchise. The Bar pleaded nine counts of UPL. The court **enjoined the
respondents and assessed a $9,000 monetary penalty, jointly and severally**
`[review]`. The Bar had sought $9,000, and got it `[review]`.

That is the realistic shape of a first enforcement event against a small
operator: an injunction plus a four-figure penalty, and the end of the business
in that state.

#### The North Carolina settlement, and the condition that cuts against us

**LegalZoom.com, Inc. v. North Carolina State Bar, 2015 NCBC 96**, resolved by
**consent judgment signed 22 October 2015** `[review]`. North Carolina is not a
launch state, but the six conditions LegalZoom accepted are the closest thing
that exists to a published compliance specification for this category. As
rendered by the search index `[review]`:

1. LegalZoom provides the consumer a way to **see the blank template or the
   completed document before purchase**.
2. **A North Carolina licensed attorney has reviewed each blank template**,
   including every part that may appear in the completed document; the reviewing
   attorney's name and address are kept on file and given to the consumer on
   written request.
3. LegalZoom **communicates to the consumer that the forms are not a substitute
   for the advice or services of an attorney**.
4. LegalZoom **discloses its legal name and physical location and address**.
5. LegalZoom **does not disclaim any warranties or liability and does not limit
   the recovery of damages or other remedies** by the consumer.
6. LegalZoom **does not require the consumer to agree to jurisdiction or venue
   in any state other than North Carolina**.

North Carolina then codified a definition at **N.C.G.S. § 84-2.2** `[review]`.

**Condition 5 is the uncomfortable one and I am not going to bury it.** A state
regulator, presented with a document-generation product aimed at consumers,
extracted a promise **not to limit liability**. That is the opposite of what a
standard terms of service does, and it is the opposite of what the owner wants.
It does not bind anyone outside North Carolina. But it tells you how a regulator
reads an aggressive liability cap in a consumer legal-adjacent product: as
evidence of a business trying to sell something it will not stand behind. The
terms of service drafted in this folder are deliberately moderate for that
reason, and §3.3 explains the trade.

#### The advertising case

**FTC v. DoNotPay.** Final order approved by unanimous 5-0 Commission vote on
16 January 2025, announced 11 February 2025, following charges from September
2024 `[review]`. Terms `[review]`: **$193,000** in monetary relief; notice to
consumers who subscribed between 2021 and 2023; and a prohibition on claiming
the ability to substitute for any professional service without competent and
reliable evidence.

The FTC's stated theory is the part that should shape behaviour: DoNotPay
**never tested** whether its service performed at the level of a human lawyer,
and **never hired or retained attorneys** to check the accuracy of its
law-related features `[review]`.

This sits inside a broader programme. The FTC launched **Operation AI Comply**
on 25 September 2024 and has brought more than a dozen Section 5 actions on the
theory that claims about AI capability must be substantiated by competent and
reliable evidence `[review]`. Enforcement continued through 2025 and into 2026
across a change of administration `[review]`.

`NO-GUARANTEE-AND-TESTING-POLICY.md` in this folder is the answer to this case.

### 1.3 Where the line actually sits

The question posed was where the boundary falls between showing someone that
page 47 of their own policy contains a carve-back the denial letter never
mentions, and telling them they have a valid claim.

**The boundary is between describing a document and characterising a legal
consequence.** Everything on the safe side is a statement about text. Everything
on the far side is a statement about the customer's position.

Here is the same finding written six ways, walking across the line.

| # | Sentence | Verdict | Why |
|---|---|---|---|
| 1 | "The denial letter quotes Exclusion 7 on page 2. Exclusion 7 appears on page 47 of your policy. The quoted passage ends at the word 'water'; the provision continues for four more lines." | **Safe** | Pure comparison of two texts. No legal skill applied, no conclusion drawn. Nothing here that a page-number index could not produce. |
| 2 | "Those four lines begin 'This exclusion does not apply' and are not quoted anywhere in the denial letter." | **Safe** | Reports an absence. Still a statement about documents. This is the highest-value sentence the product produces and it is comfortably inside the line. |
| 3 | "Provisions that begin 'This exclusion does not apply' are commonly called carve-backs. In general, they describe circumstances in which coverage is restored." | **Safe, with care** | General published information, identical for every customer, not tied to this person's facts. Keep it in a glossary, not in the finding. The moment it appears inside a personalised finding it starts to read as an explanation of this customer's rights, which Cal. B&P § 6411 names directly. |
| 4 | "The carve-back on page 47 may apply to your loss." | **Not safe** | Applies the policy to this customer's facts. This is also, almost word for word, what Illinois defines as adjusting a claim: "applying the loss circumstances to insurance policy provisions" (215 ILCS 5/1510) `[review]`. It fails the UPL test and the licensing test at the same time. |
| 5 | "Because the carve-back applies, the denial was improper." | **Not safe** | A legal conclusion about the customer's rights. |
| 6 | "You have a valid claim and should appeal." | **Not safe** | Advice and a recommendation. Prohibited in all four states, and the exact conduct Brumbaugh forbade. |

**Rows 1 and 2 are the product. Rows 4, 5 and 6 are the business the owner is
not in.** Row 3 is the one that will drift if nobody watches it, because it is
genuinely helpful and it feels harmless.

#### The engine already enforces most of this, deliberately

`innovation/engines/contradiction/core.mjs` was written with this in mind and it
shows. Three properties are load-bearing legally, not just technically:

- **A `Finding` cannot be constructed without a `Locator`.** Every assertion is
  anchored to a document, a page and a quoted passage. A product whose findings
  are all statements about text is a product that structurally cannot give
  advice. Keep this invariant. It is the strongest single argument available if
  anyone ever asks.
- **`resolveCitation` returns `null` rather than guessing** when overlap falls
  below the floor, and the code comment says why: a wrong provision sends the
  reviewer to the wrong page. That refusal to guess is also a refusal to
  fabricate a legal position.
- **`canExport` blocks export while any finding is unreviewed**, and
  `reviewFinding` requires a human outcome of confirmed, dismissed or
  needs-more-info. The human is in the loop by construction. That is what keeps
  the customer, not the software, the author of what gets sent.

One thing the engine does **not** yet enforce: the `summary` and `rationale`
strings are free text, and where they come from a model verdict (`verdict
.rationale`) they are model-authored. **That is the leak.** The rule set below
exists to close it, and it needs to run as an output filter, not as a prompt
instruction.

Two existing summary strings are worth a second look. `"The cited provision does
not appear to say what the letter claims it says"` is a statement about two
documents and is fine. `"The cited provision appears to support the stated
reason for denial"` is close to a legal conclusion in the customer's disfavour;
"appears to support" is doing characterising work. Suggested replacement, for
the owner to weigh: `"The cited provision was located and its text is consistent
with the letter's description of it."` This is a suggestion about wording, not a
finding that the current string is unlawful.

#### The appeal letter is the hardest part, and here is the honest read

Generating a document that a customer sends to an insurer is the closest this
product comes to the line, and no amount of disclaimer changes what the document
does. `[NOT ESTABLISHED]` whether any court in the four states has ruled on
software that drafts an insurance appeal letter. I could not find one.

The design that keeps it defensible: **the letter is a container for
quotations, not an argument.**

Each paragraph of the generated letter should contain, and contain only:

1. What the denial letter says, quoted, with its page.
2. What the policy says at the provision cited, quoted, with its page.
3. A neutral statement that the two passages differ, or that the second contains
   text the first does not address.
4. A request: that the insurer explain the discrepancy, or reconsider in light
   of the full text.

What the letter must never contain: an assertion that the denial was wrong, that
coverage applies, that the insurer breached anything, that a statute or
regulation was violated, a demand for a specific sum, a deadline threat, or a
reference to litigation, bad faith or regulatory complaint.

And the customer must edit and approve it. The export gate already forces
per-finding review; the letter builder should force the same, paragraph by
paragraph, with an editable text area and no one-click send. **There is no send
button. Ever.** The product produces a file. The customer sends it.

### 1.4 The rule set

Three lists. The first two are for whoever writes the templates. The third is a
test fixture.

#### 1.4.1 Sentence forms the product MAY generate

Each is a template. Slots in `{braces}` are filled from `Locator` data or quoted
text, never from model prose.

```
A1  The denial letter cites {citation} on page {letterPage}.
A2  {citation} appears in your policy on page {policyPage}.
A3  The letter quotes: "{letterQuote}"
A4  Your policy at page {policyPage} reads: "{policyQuote}"
A5  The quoted passage in the letter ends at "{lastWordQuoted}". The provision
    in your policy continues for {n} more {lines|sentences}.
A6  The following text appears in your policy at page {policyPage} and does not
    appear anywhere in the denial letter: "{policyQuote}"
A7  The denial letter does not cite any specific policy provision.
A8  The letter cites {citation}. No provision matching that citation was found
    in the documents you uploaded.
A9  The letter states a deadline of {date} at page {letterPage}.
A10 This finding has not been reviewed. Open it and confirm or dismiss it
    before exporting.
A11 Countercite located {n} passages in your policy that the denial letter
    quotes in part. Each is listed below with its page number.
A12 The provision cited in the letter was located at page {policyPage}. Its
    text is consistent with the letter's description of it.
```

The common property: **every one of these is checkable by opening the page.**
That is the test. If a sentence cannot be confirmed or refuted by a reader
looking at the cited page, it does not belong in the output.

#### 1.4.2 Sentence forms the product may NEVER generate

```
N1   Any statement that the customer is entitled to coverage, payment,
     or any sum.
N2   Any statement that the denial was wrong, improper, invalid, unlawful,
     unreasonable, in bad faith, or in breach of anything.
N3   Any statement that a provision "applies to", "covers", "excludes" or
     "does not cover" the customer's loss, damage, or situation.
N4   Any prediction, estimate, likelihood, percentage or characterisation of
     the outcome of an appeal, complaint, claim or lawsuit.
N5   Any recommendation about what the customer should do, including whether
     to appeal, whether to accept an offer, whom to contact, or when to act.
N6   Any statement of what the law, a statute, a regulation, a bulletin or a
     court requires, permits or forbids, as applied to this customer.
N7   Any statement that the customer does or does not need a lawyer or an
     adjuster, or that Countercite is an alternative to either.
N8   Any characterisation of the insurer's conduct, motive or good faith.
N9   Any deadline, limitation period or time bar stated as applying to this
     customer. Quoting a date printed in the customer's own document is
     permitted (A9); calculating, extending or advising on one is not.
N10  Any selection among options on the customer's behalf, including which
     findings to include, which argument to make, or which form to use.
N11  Any statement of the customer's rights, remedies, defences or options.
N12  Any statement about the strength, merit, weakness or value of the claim.
N13  Any comparison of Countercite's output to the work of a lawyer,
     an adjuster, or any licensed professional.
```

N11 is lifted from **Cal. Bus. & Prof. Code § 6411**, near enough word for word,
on purpose. If California's legislature wrote the line for document preparers,
that is the line to sit behind.

#### 1.4.3 Blocked phrases, as a test fixture

Drop this in the engine's test directory. The check runs over every generated
`summary`, `rationale`, letter paragraph and UI string, in every locale, before
anything reaches a customer. **A hit is a build failure, not a warning.**

```js
// forbidden-language.fixture.mjs
//
// Every string the product shows a customer or writes into an exported document
// must pass this filter. These are not style preferences. Each pattern maps to
// a sentence form that a state could read as legal advice, an outcome promise,
// or unlicensed adjusting. Written 2026-08-31 against the analysis in
// innovation/legal/00-LEGAL-POSTURE.md §1.4.
//
// Adding an exception requires a note saying which state's rule permits it.

export const BLOCKED = [
  // --- entitlement and outcome (rule N1, N4, N12) ---
  { id: "B01", re: /\byou (are|were|may be|might be|should be) (entitled|covered|owed|due)\b/i },
  { id: "B02", re: /\byou (have|may have|likely have|probably have) a (valid|strong|good|viable|legitimate) (claim|case|appeal|argument)\b/i },
  { id: "B03", re: /\b(should|will|is likely to|are likely to|can expect to) (win|prevail|succeed|be paid|be reversed|be overturned)\b/i },
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
```

**Two honest caveats about this fixture.** It is a keyword filter, and a keyword
filter catches the sentence forms someone thought of. A model can express N4 in
words no regex here matches. So the fixture is the floor and not the ceiling;
the real control is that generated prose never reaches a customer unedited, and
that the summary strings are templates from §1.4.1 rather than free text. The
second caveat: B28 decides by looking for a negation earlier in the same
sentence, which is a crude stand-in for meaning. The fixture was run against
twelve strings, a mix of permitted templates from §1.4.1 and forbidden forms
from §1.4.2, and behaved correctly on all of them. That is a smoke test, not
coverage. "The letter offers legal advice, which we do not" would slip past
B28, and "advice on legal matters" is not caught at all. Every `unless` clause
here is a place a determined sentence can get around.

### 1.5 How existing products sit on the safe side, and the exact words they use

Four pieces of borrowed drafting, each with a reason attached.

**1. The Texas statutory phrase.** "Not a substitute for the advice of an
attorney." Use this exact wording, not a paraphrase, because it tracks
§ 81.101(c) `[review]`. A paraphrase gets you an argument about whether it is
equivalent. The statute's own words get you the safe harbour.

**2. LegalZoom's negative promise.** LegalZoom states it is not a law firm and
that its employees are not acting as the customer's attorney, and that it is
prohibited from providing any kind of advice, explanation, opinion or
recommendation about possible legal rights, remedies, defenses, options,
selection of forms or strategies `[review]`. That second half is
**Cal. B&P § 6411 restated as a promise to the customer.** It is the industry's
answer to the hardest state's statute, and it costs nothing to adopt. It is
disclaimer D1 in `DISCLAIMERS.md`.

LegalZoom also states that information the customer provides is not protected by
attorney-client privilege `[review]`. Countercite must say the same thing, and
say it before the customer uploads anything, because customers of a product like
this will assume otherwise.

**3. The North Carolina consent conditions.** Conditions 1 to 4 and 6 from §1.2
are adopted voluntarily in this folder even though North Carolina is not a
launch state. Condition 2, attorney review of every template, is the one
Countercite cannot afford today. It is named in the risk register as an open
item rather than quietly skipped.

**4. Florida's own contractor carve-out, as a legislative illustration.** Under
Fla. Stat. § 626.854, a licensed contractor may not adjust a claim without a
public adjuster licence, but **may discuss or explain a bid** for construction
or repair with the property owner or the insurer, for the usual and customary
fees stated in the contract `[review]`. The Florida legislature drew an
explain-versus-act line for a different trade. It is not authority for software,
but it shows the distinction is one the state recognises.

**What no existing product's language could be confirmed.** I attempted to read
the terms and disclaimers of the AI insurance-appeal products that are closest
to this one (Counterforce Health, Claimable, Fight Health Insurance). Every
fetch was blocked by the network. Their disclaimer wording is
`[NOT ESTABLISHED]`. Reading those three pages is a 20-minute job for the owner
on an unblocked machine and is worth doing before launch.

---

## 2. Public adjuster licensing

The second exposure, and the one where the answer differs sharply depending on
who the customer is.

### 2.1 What each state's licensing statute says

#### Texas: Tex. Ins. Code ch. 4102

**§ 4102.001** defines a public insurance adjuster as a person who, for
compensation, **acts on behalf of an insured in negotiating for or effecting the
settlement of a claim** for loss or damage under a policy covering real or
personal property; or who **advertises, solicits business, or holds out to the
public as an adjuster** of such claims; or who works on behalf of another public
adjuster investigating, settling or adjusting claims `[review]`.

**§ 4102.051**: a person may not act as a public insurance adjuster, or hold out
as one, without a licence or certificate from the commissioner `[review]`.

**§ 4102.002**, general exemptions `[review]`. The chapter does not apply to:
an attorney engaged in the performance of professional duties; a **photographer,
estimator, appraiser, engineer or arbitrator employed by a public insurance
adjuster exclusively for the purpose of furnishing technical assistance** to
that licensed adjuster; federal, state and local officers and employees on
official duties; admitted insurers and licensed agents on insurance
transactions; and salaried office employees performing exclusively clerical or
administrative duties.

**§ 4102.104** caps a public adjuster's total compensation at **10% of the
amount of the insurance settlement** `[review]`. This is already established
elsewhere in the project.

**§ 4102.207** is titled criminal penalty and sanctions and sits in the
chapter's penalty subchapter `[review]`. **The grading of that offence is
`[NOT ESTABLISHED]`.** It was flagged as open in
`buildouts/02-overturn/PLAN.md` and I could not close it either. Do not state a
grading anywhere until the section is read.

> **`[conflict]` recorded 2026-08-31.** `research/11-LIABILITY-SCREEN.md`
> reports the criminal penalty at **§ 4102.206, a Class B misdemeanour**, and
> puts **§ 4102.207** as the insured's option to void the contract and owe
> nothing for services already rendered `[review]`. That contradicts the
> section number used here. Neither reading has been checked against the
> statute text, because the Texas legislature's site is blocked from this
> machine. Do not cite either number until one of them is read. Five minutes on
> an unblocked browser closes it: open the Texas Insurance Code chapter 4102,
> subchapter E, and read the titles of §§ 4102.206 and 4102.207.


**The Texas technical-assistance exemption is a weaker fit than it first looks.**
It requires the person to be **employed by** the public adjuster. A software
vendor selling a subscription is not employed by anyone. Compare Illinois below,
which uses "employed only for the purpose of," a phrase that reads more
naturally onto a service supplier. So Texas protects Countercite through the
*definition* rather than through the exemption: a vendor selling a tool does not
negotiate, does not effect settlement, and does not act on behalf of an insured.

#### Florida: Fla. Stat. § 626.854

The broadest of the four, and the one that should decide the launch plan. As
rendered by the search index `[review]`, a public adjuster is any person, except
a duly licensed attorney at law, who

> for money, commission, or any other thing of value, **directly or indirectly
> prepares, completes, or files an insurance claim** for an insured or
> third-party claimant or who, for money, commission, or any other thing of
> value, acts on behalf of, or aids an insured or third-party claimant in
> negotiating for or effecting the settlement of a claim or claims for loss or
> damage covered by an insurance contract or who advertises for employment as an
> adjuster of such claims.

Read those seven words again: **directly or indirectly prepares**. There is no
other state in the four whose definition reaches that far.

Fee caps `[review]`: **10%** of claim payments for claims arising from an event
subject to a gubernatorial state of emergency declaration, for claims made in
the year after the declaration; **20%** otherwise.

Contractor carve-out `[review]`: a licensed contractor under ch. 489 part I may
not adjust a claim without a public adjuster licence, but may **discuss or
explain a bid** for construction or repair with the owner or the insurer, for
the usual and customary fees stated in the contract.

#### California: Cal. Ins. Code art. 3, §§ 15006 to 15032

**`[conflict]` on the section number.** My search asked about § 15006 and the
index returned the definition under **§ 15007** in one result and left § 15006
unresolved in another. The definitional text below is consistent across results;
**the section number is not confirmed.** Cite it as "Cal. Ins. Code art. 3
(§§ 15006 to 15032), definition at § 15007 per secondary sources" until someone
reads the code.

A public insurance adjuster is a person who, for compensation, **acts on behalf
of or aids in any manner an insured in negotiating for or effecting the
settlement of a claim** under a policy covering real or personal property; or
who **advertises, solicits business or holds out to the public** as an adjuster
of those claims; **and any person who, for compensation, investigates, settles,
adjusts, advises, or assists an insured with reference to claims for those
losses on behalf of any public insurance adjuster** `[review]`.

**The structure of that last clause matters and is easy to misread.** The words
"advises, or assists an insured with reference to claims" look terrifying in
isolation. They are qualified by "**on behalf of any public insurance
adjuster**." So the advises-or-assists prong catches people working under a
licensed PA, not the general world. If that qualifier were read to attach only
to the final verb, California would be the harshest state of the four rather
than roughly the mildest. **This is the single most consequential reading in
this section and it rests on a search summary.** Get the actual text.

Licensing is by examination, and the commissioner may prosecute unlicensed
persons or entities that hold out or act as public insurance adjusters
`[review]`. SB 488 (2015-16) amended the chapter `[review]`.

#### Illinois: 215 ILCS 5, Art. XLV (the Public Adjusters Law)

**5/1501** short title `[review]`. **5/1505** purpose and scope: governs
licensing and duties, limiting licensure to assisting insureds in first-party
claims `[review]`.

**5/1510**, definitions `[review]`. A public adjuster is a person who, for
compensation or anything of value, on behalf of the insured: acts or aids,
solely in relation to first-party property claims, in **adjusting a claim**;
or advertises, solicits or holds out as a public adjuster; or directly or
indirectly solicits business, investigates or adjusts loss. And the definition
that matters most:

> "Adjusting a claim for loss or damage covered by an insurance contract" means
> negotiating values, damages, or depreciation or **applying the loss
> circumstances to insurance policy provisions**.

**5/1515** licence required: a person may not act, advertise, solicit or hold
out as a public adjuster, or as being in the business of adjusting insurance
claims, or attempt to obtain a public adjusting contract, unless licensed
`[review]`.

**5/1515(d)** exemptions `[review]`, tracking the NAIC Public Adjuster Licensing
Model Act (#228) `[review]`: an Illinois-admitted attorney acting professionally;
a person negotiating or settling life or health claims; **a person employed only
for the purpose of obtaining facts surrounding a loss or furnishing technical
assistance to a licensed public adjuster, including photographers, estimators,
private investigators, engineers and handwriting experts**; a licensed health
care provider or its employee preparing or filing a health claim for a patient;
and a person settling subrogation claims between insurers.

Fee cap: **10% of total payments on the claim** where the property is a personal
residence, already established elsewhere in this project.

**"Applying the loss circumstances to insurance policy provisions" is the
sharpest phrase in any of the four statutes**, and it is sharper than anything
in the UPL rules. It is exactly row 4 of the table in §1.3. A product that says
"this carve-back may apply to your loss" is doing what Illinois calls adjusting.
A product that says "this text appears on page 47 and is not quoted in your
denial letter" is not applying anything to anything. The distinction is real,
but it is one sentence wide.

### 2.2 The software vendor versus the service provider

Three facts decide which one you are.

| Fact | Vendor side | Provider side |
|---|---|---|
| **Who pays** | A licensed public adjuster, or the insured buying a tool they operate themselves | The insured, buying an outcome |
| **How the fee is set** | Flat, in advance, unrelated to the claim | Contingent on the settlement, or a percentage of it |
| **Who touches the carrier** | Nobody at the vendor, ever | The vendor, or someone the vendor arranges |

Every state's definition is built around **acting on behalf of an insured** in
dealing with an insurer. A tool the insured operates themselves, that never
speaks to the carrier and whose price does not move with the outcome, is not
acting on anyone's behalf. That is the whole argument, and it is a decent one.

**The contingent fee is the single fact that would destroy it.** A percentage of
the settlement is the defining commercial feature of public adjusting, it is the
thing all four states cap, and taking one would convert a software business into
an unlicensed adjusting business in every launch state at once. Flat pricing is
in `PLAN.md` §5 for product reasons. It is also, by luck or good instinct, the
licensing defence.

### 2.3 The plain verdicts, as asked

**Selling to licensed public adjusters as flat-fee software: safe.** This is the
strongest position available. The licensed professional remains the actor, the
fee is flat and paid by the professional, and Countercite never touches an
insured or a carrier. Illinois says so almost expressly at 5/1515(d)(3), the
"furnishing technical assistance to a licensed public adjuster" exemption
`[review]`, and Texas has a narrower version of the same idea at § 4102.002
`[review]`. Even where the exemption does not fit cleanly, the definitions do
not reach: no negotiating, no settling, no acting on behalf of an insured. The
residual risk here is not licensing. It is marketing, and it is handled by rules
B23 to B27 in the fixture above.

**Selling flat-fee subscriptions directly to policyholders: not equally safe,
and not equally safe across the four states.**

| State | Read | Why |
|---|---|---|
| **Texas** | **Acceptable risk** | The definition turns on negotiating or effecting settlement on behalf of an insured. A self-service tool does neither. Texas also has the § 81.101(c) software safe harbour on the UPL side, so both exposures point the same way. |
| **California** | **Acceptable risk**, subject to the § 15007 reading in §2.1 holding up | Definition also turns on acting on behalf of an insured in negotiating or effecting settlement. Separate question about LDA registration, below. |
| **Illinois** | **Elevated** | "Applying the loss circumstances to insurance policy provisions" reaches conduct that a poorly worded finding would fall into. The product rule set closes it, but the margin is one sentence. |
| **Florida** | **The one to hold back** | "Directly or indirectly prepares" an insurance claim, for money. An appeal letter is arguably not a claim form. "Indirectly prepares" is broad enough that the argument is not obviously winnable, and the penalty environment is the harshest of the four. |

**Recommendation, and it contradicts the plan.** `PLAN.md` §2 lists Countercite's
regulatory exposure as "**None.** Software sold to licensed professionals," and
§9 says every state's licensing statute is aimed at acting for a policyholder
for a fee, "which we do not do." **That was written when the only customer was a
licensed professional. It is no longer accurate now that policyholders are a
second customer type, and I am flagging the change rather than quietly leaving
the old line in place.** Selling directly to policyholders moves this from no
exposure to real exposure, and the plan should be updated to say so.

The cheapest way to keep almost all of the upside:

- **Launch policyholder-direct in Texas and California only.**
- **In Florida and Illinois, launch to licensed public adjusters only**, until
  an hour of counsel says otherwise. Florida is where the best list in the whole
  project lives (1,203 firms, all with email addresses), and every one of them
  is licensed. The Florida channel does not need the policyholder product at
  all.
- **Never take a contingent fee, in any state, from anyone.**
- **Never contact a carrier**, and never offer to.

That costs two states' worth of consumer revenue in the first months and buys
out the worst version of the risk.

**A separate California question that is not about insurance at all.** If
Countercite sells directly to California consumers and produces a document for
them, **Cal. B&P §§ 6400 to 6415** may require **Legal Document Assistant**
registration, which is done with the county clerk and needs a $25,000 bond under
§ 6405 `[review]`. Whether an insurance appeal letter counts as a legal document
for that chapter is `[NOT ESTABLISHED]`. It is one of the three lawyer questions
in §5.

---

## 3. The entity question

The owner asked how to avoid personal liability without incorporating.

### 3.1 The one clear sentence

**There is no substitute for an entity, and $300 is not a close call against
the downside.**

Everything below is the reasoning and the cheapest correct path.

### 3.2 What a sole proprietor is actually exposed to

A sole proprietorship is not a thing you form. It is what you are by default
when you take money without forming anything. There is no separation between the
business and the person, which means:

- **Every business debt is a personal debt.** A vendor invoice, a hosting bill,
  a subscription the business cannot pay, a customer refund claim. All of it
  reaches the owner's bank account, house and future wages, subject only to the
  state's homestead and exemption rules.
- **Every claim arising from the business is a claim against the owner
  personally.** A customer who says the analysis missed a provision and cost
  them a settlement sues the person, not a company, because there is no company.
- **Defence costs arrive before any judgment does.** A claim that is eventually
  dismissed can still cost five figures to get dismissed. This is the exposure
  people forget, and it is the one that arrives first.
- **A regulator's order names the person.** An injunction against unlicensed
  adjusting or UPL attaches to the individual and follows them.
- **There is nothing to sell, assign or wind up.** No entity means no clean way
  to stop, transfer or close the business away from the person.

### 3.3 Does insurance substitute for an entity? No, and here is the split

The two do different jobs, and neither does the other's.

| | An entity | Insurance |
|---|---|---|
| Stops a claimant reaching personal assets | Yes, for the entity's obligations | **No.** It pays claims; it does not move the line of who is liable |
| Pays defence costs | No | **Yes**, and this is often the larger benefit |
| Pays a judgment | No | Yes, up to the limit, subject to exclusions |
| Covers regulatory fines for unlicensed activity | No | **Usually excluded.** Assume not covered |
| Covers intentional acts | No | Excluded, in every policy |

Costs found, all `[review]` and all US small-business averages rather than
quotes:

| Cover | Typical cost |
|---|---|
| General liability, technology business | ~$37/month |
| Technology E&O (professional liability) | ~$110/month |
| Cyber liability | ~$179/month |
| **Tech E&O bundled with cyber, SaaS company** | **~$126/month, ~$1,516/year** |
| Solo developer, core coverage bundled | $100 to $200/month |
| Small professional services firm, E&O alone | $700 to $1,500/year; solo providers from ~$300 |

The bundle is the one to buy. **Technology E&O with cyber, around $1,500 a
year**, is the honest number to plan against, and it is roughly the same money
as the lawyer budget already in `PLAN.md` §9. Buy the entity first, because most
underwriters expect to insure a business rather than a person, and because the
policy is cheaper to underwrite when there is something to underwrite.

**The uncomfortable part, stated plainly.** An LLC does not protect an owner
from liability for the owner's own negligent acts `[review]`. A member is always
liable for their own torts and cannot use membership as a shield `[review]`. In
a one-person software business, nearly every act is the owner's own. So the
shield is thinner here than the internet suggests. What it genuinely does:

- It stops **contract and vendor claims** at the entity.
- It stops claims arising from the **business's** acts as distinct from the
  owner's hands-on ones, which becomes more of the surface area as soon as
  anyone else is involved.
- It is the container for the insurance, the bank account and the customer
  contract, which is what makes the limitation of liability clause in the terms
  of service mean anything at all.
- Texas veil-piercing is unusually hard to do. Under **Tex. Bus. Orgs. Code
  § 21.223**, applied to LLCs through **§ 101.002** `[review]`, a member is not
  liable for contractual obligations on alter-ego or similar theories, and the
  main exception requires proof that the owner used the company to **perpetrate
  an actual fraud** on the claimant, primarily for the owner's direct personal
  benefit `[review]`. Texas courts have rejected the Delaware-style factors,
  undercapitalisation, informality, one-person control, as legally irrelevant
  `[review]`. **Texas is a good state to form in**, and the owner is already
  there.

### 3.4 Do limitation-of-liability clauses in the terms actually help?

**Against a customer, partially. Against a regulator, not at all.** That second
half is the point most people miss.

Where courts decline to enforce, all `[review]`:

- **Gross negligence and intentional misconduct** cannot be limited under Texas
  law, and courts generally treat pre-injury releases covering gross negligence
  as against public policy.
- **Cal. Civ. Code § 1668** voids any contract exempting a party from
  responsibility for **fraud, wilful injury to person or property, or violation
  of law, whether wilful or negligent**. That last clause is broad, and it is
  California.
- **Consumer contracts get less deference than commercial ones.** A limitation
  on consequential damages in a consumer contract is treated as **prima facie
  unconscionable** in the UCC framing, whereas the same clause between
  businesses is routinely enforced.
- **Adhesion plus no bargaining power** is the unconscionability fact pattern,
  and it comes up far more in consumer contracts than commercial ones. A
  click-through agreement with a solo vendor and an individual policyholder is
  that fact pattern.

Two further points specific to this business:

1. **The dual customer base cuts both ways.** Against a licensed public
   adjuster, a business buying a tool for their practice, a liability cap is a
   commercial term between businesses and will usually be enforced. Against an
   individual policyholder it is a consumer term and is materially weaker. That
   is a reason to write the terms with two tiers rather than one, which the
   draft in this folder does.
2. **The LegalZoom condition again.** North Carolina's Bar required LegalZoom
   not to disclaim warranties or limit damages at all `[review]`. If a state bar
   or insurance regulator ever opens a file on Countercite, an aggressive
   liability cap is not a defence. It is an exhibit.

So the drafted terms limit liability, because it would be silly not to, but they
limit it **moderately**, they carve out what cannot lawfully be limited, they
keep venue local rather than forcing a distant forum, and they preserve small
claims. A clause a court will enforce beats a clause that reads well.

### 3.5 The cheapest correct path, in Texas, filed by the owner

| Step | What | Where | Cost |
|---|---|---|---|
| 1 | **Certificate of Formation, Limited Liability Company, Form 205** | Texas Secretary of State, online via **SOSDirect** or by mail | **$300**, plus a statutory card convenience fee of **2.7%** `[review]` |
| 2 | **Registered agent**, named on Form 205 | The owner may serve, with a Texas street address, not a PO box. Consent is on **Form 401-A**, which is **kept on file, not filed** `[review]` | $0, or roughly $50 to $150/year for a commercial agent `[review]` |
| 3 | **EIN** | IRS, online | $0 |
| 4 | **Business bank account** in the LLC's name | Any bank | $0 to low |
| 5 | **Written operating agreement**, single member | Not filed with anyone. Keep it | $0 |
| 6 | **Annual: Public Information Report, Form 05-102** | Texas Comptroller, due **15 May** each year. No franchise tax owed below the no-tax-due threshold, reported as **$2.65M** for 2026 to 2027, but the report is still required `[review]` | $0 |

Processing `[review]`: SOSDirect filings are typically approved in 2 to 3
business days; mail filings run 7 to 10 business days plus post.

**Total to get a shield: about $308.** No annual report to the Secretary of
State. One annual filing to the Comptroller. `[review]` on the fee and the
threshold; both are the kind of number that changes, so check them on the day.

One privacy note the guides skip: **the registered agent's address becomes
public record.** If the owner works from home and does not want that address in
a searchable state file, the $50 to $150 a year for a commercial agent is the
cheapest privacy the business will ever buy.

**What makes the shield real after filing**, and this part is free: a separate
bank account, no personal spending from it, contracts signed in the LLC's name
with a title, and the LLC's name on the website, the invoices and the terms. An
LLC that the owner treats as a nickname is an LLC a claimant will argue about.

---

## 4. What is in the rest of this folder

| File | What it is |
|---|---|
| `TERMS-OF-SERVICE.md` | Customer agreement, two tiers, moderate liability cap |
| `PRIVACY-POLICY.md` | Uploaded documents, retention, deletion, subprocessors |
| `DISCLAIMERS.md` | Exact wording and the exact place each one must appear |
| `NO-GUARANTEE-AND-TESTING-POLICY.md` | The measurement discipline behind every published number |

All four are starting drafts written without a lawyer. Every one carries a
`[[FILL: ...]]` marker where a fact is missing.

---

## 5. The risk register

Ranked by expected harm, which is likelihood multiplied by how bad it gets,
not by how likely it is on its own.

| # | Risk | What triggers it | Likely? | How bad? | What we already do | **What remains open** |
|---|---|---|---|---|---|---|
| 1 | **No entity, so every risk below lands on the owner personally** | Any claim, any regulatory order, any unpaid business debt, from the first paying customer onward | **Certain to apply** if anything at all goes wrong | **Severe.** House, savings, future wages. Defence costs arrive before any judgment | **Nothing.** No entity exists today | **This is the cheapest fix in the document and it has not been done.** $300 and a form. Until it is filed, every other row in this table is a personal exposure. Nothing else on this list should be worked on first |
| 2 | **Florida public adjuster licensing action** over policyholder-direct sales | Selling a policyholder subscription in Florida. A complaint from a licensed adjuster, a carrier, or DFS on its own initiative | Low, but **not remote**, and Florida's list is the channel the plan leans on hardest | **Severe.** Fla. Stat. § 626.854 reaches anyone who "directly or indirectly prepares" a claim for money. Cease and desist, penalties, and the end of the Florida channel | Recommendation in §2.3 to hold Florida to licensed adjusters only. Flat pricing, never contingent. No carrier contact ever | **Nobody has read § 626.854.** The whole assessment rests on a search summary of one subsection. "Indirectly prepares" may or may not reach an appeal letter, and I cannot tell you which |
| 3 | **UPL complaint in Florida or Illinois** | One generated sentence that advises rather than describes. A bar complaint, which any competitor or annoyed customer can file for free | Low, if the rule set holds | **Severe in Florida** (§ 454.23 grades unlicensed practice as a third-degree felony), injunction plus penalty in practice (We The People: $9,000). **Contempt in Illinois** | Rule set in §1.4. Locator invariant in the engine. Human review gate before export. No send button. Disclaimers per Texas § 81.101(c) | **The appeal letter template has never been read by a lawyer.** The blocked-phrase fixture is a keyword filter and catches only the phrasings someone thought of. Illinois's "applying the loss circumstances to policy provisions" is one sentence away from what the product does |
| 4 | **FTC or state AG deceptive-claims action** | Publishing an accuracy number without the dataset behind it. A testimonial implying a typical outcome. The words "AI lawyer" or "as good as an adjuster" anywhere | **Moderate**, because this is the failure mode of every product in this category and it is entirely self-inflicted | **High.** DoNotPay: $193,000, notice to every past subscriber, and a permanent substantiation order | `NO-GUARANTEE-AND-TESTING-POLICY.md`. The day 1 to 30 measurement gate in `PLAN.md` §7 that forbids selling before grading. Banned marketing terms B23 and B24 | **The eighteen pages already live in `dist/countercite/` have not been audited against these rules.** That is a half-day job and it should happen before the next customer, not after |
| 5 | **Breach or misuse of uploaded policies and denial letters** | A hosting compromise, a subprocessor incident, a misconfigured bucket, a laptop | Low per year, and it compounds with every document retained | **High.** These documents carry names, addresses, loss details, sometimes health and financial information. Reputational damage in a 1,203-firm community is unrecoverable | `PRIVACY-POLICY.md`: short retention, per-case deletion, encryption, no training on customer documents | **No cyber policy is in force.** No breach response plan has ever been tested. Whether the model provider's terms actually forbid training on submitted content is `[NOT ESTABLISHED]` and must be confirmed in writing, not assumed |
| 6 | **A missed contradiction costs a customer money** | The engine returns a false negative, the claim settles low, and the customer's name was on the letter | **Moderate.** `PLAN.md` §8 already identifies this as the failure the product cannot survive | Moderate to high. One professional's bad experience travels through a small community faster than any marketing | False-negative target below 0.5 per case, measured on closed cases. Per-finding review gate. Terms place the work product with the professional, where it already sits | The liability cap is **weak against an individual policyholder** (§3.4) and strong against a licensed firm. Consumer-side exposure is real and only insurance reduces it |
| 7 | **Model provider or OCR subprocessor terms are wrong** | Sending customer documents to a third party under terms that permit retention or training | Low | Moderate to high. Breaks a promise made in the privacy policy, which converts a vendor problem into a deceptive-practices problem | Subprocessor list published, with a commitment to notify before adding one | **The actual contractual terms have not been read.** Do not publish the privacy policy until they have |
| 8 | **A customer sends the draft unedited and it says something wrong** | One-click behaviour, which is what customers do | **High.** Assume it happens | Low to moderate for us, higher for them | No send button. Per-finding review before export. Per-paragraph approval in the letter builder. Disclaimer on the exported document itself | We cannot prevent it. The controls make it the customer's decision, documented, which is the most that is available |
| 9 | **A heavy user costs more than they pay** | Flat pricing meets a firm running thousand-page productions | Moderate | Low | Fair-use ceiling stated in the terms from day one | Nothing meaningful. It is a pricing problem, not a legal one |

### The three questions that genuinely need a lawyer

Each is written to be answerable inside a single paid hour. Each names the
statute so the hour is spent on the answer rather than on finding the question.

**Question 1. Florida licensing.**
> Under Fla. Stat. § 626.854(1), does a flat-fee software subscription sold to a
> Florida policyholder constitute "directly or indirectly prepar[ing]" an
> insurance claim for money, where the software compares the policyholder's own
> denial letter to their own policy, produces findings that quote and cite both
> documents, drafts a letter the policyholder edits and sends under their own
> name, and never communicates with the insurer? If yes, what specific change to
> the product or the fee structure removes the requirement? Please also confirm
> the § 626.854 subsection numbering and the current fee caps.

**Question 2. The output itself, in all four states.**
> Attached are (a) the twelve sentence templates the software may generate,
> (b) the thirteen forms it may never generate, and (c) the appeal letter
> template. In Texas, Florida, California and Illinois, does generating this
> output for a policyholder for a flat fee constitute the practice of law?
> Specifically: does Tex. Gov't Code § 81.101(c) cover it, and is our disclaimer
> placement "clear and conspicuous" for that subsection given the district court
> record in *Parsons*? Does 215 ILCS 5/1510's "applying the loss circumstances
> to insurance policy provisions" reach any of the twelve templates? Do
> Cal. B&P §§ 6400 to 6415 require Legal Document Assistant registration to sell
> to California consumers? **Mark any sentence template that must be removed.**

**Question 3. The paperwork.**
> Please review the attached terms of service, privacy policy and disclaimers
> for: (a) whether the limitation of liability is enforceable against an
> individual consumer in Texas, Florida, California and Illinois, given
> Cal. Civ. Code § 1668 and the unconscionability posture toward consumer
> contracts; (b) whether our venue, governing-law and dispute clauses create
> more risk than they remove, given that the North Carolina State Bar required
> LegalZoom to accept local venue and to drop damage limitations entirely; and
> (c) whether our disclosed handling of uploaded policy documents through a
> third-party model provider and OCR service needs anything beyond what is
> written, for a solo operator not otherwise subject to the TDPSA, CCPA or FDBR
> thresholds.

### If the budget only stretches to one hour

Take **Question 1**. It is the only one where the answer changes what gets built
and sold this quarter, and it is the only one where being wrong has a criminal
statute attached.

### Order of operations, cheapest first

1. **File Form 205.** $300. Nothing else on this list is worth doing first.
2. Run the blocked-phrase fixture over every string in the engine and every page
   in `dist/countercite/`. Free, half a day.
3. Put the disclaimers from `DISCLAIMERS.md` in the six required places. Free.
4. Read the model provider's and OCR vendor's actual terms. Free, one hour.
5. Buy technology E&O with cyber. Around $1,500 a year.
6. Grade 20 real denial letters before selling anything, per `PLAN.md` §7.
7. Then, and only then, the paid hour on Question 1.
