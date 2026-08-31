# No-Guarantee and Testing Policy

How Countercite measures itself, and what it is allowed to say as a result.

---

> **A note before you read this.**
>
> This is a starting draft, written without a lawyer. Unlike the other documents
> in this folder, this one is mostly an internal operating rule rather than a
> customer contract, and it is the one the owner should follow whether or not
> anyone ever reviews it. Every `[[FILL: ...]]` marker is something the owner
> still has to complete.

---

## 1. Why this document exists

In February 2025 the FTC finalised an order against DoNotPay. The company paid
**$193,000**, had to notify every consumer who subscribed between 2021 and 2023,
and accepted a standing prohibition on claiming its service could substitute for
a professional without competent and reliable evidence `[review]`.

The charge was not that the product was bad. The charge was that the company
**never tested whether it performed at the level of a human lawyer, never
retained attorneys to check the accuracy of its law-related features, and
advertised anyway** `[review]`.

That is a self-inflicted wound, and it is the cheapest one on the entire risk
register to avoid. The FTC has since brought more than a dozen further Section 5
actions under Operation AI Comply, on the same theory: a claim about what AI can
do must be substantiated by competent and reliable evidence, and that
enforcement has continued through 2025 and into 2026 `[review]`.

**The rule this whole document reduces to: no claim without a record.**

`PLAN.md` §8 already says the first two accuracy metrics are tracked from
customer one and published, and that this is the direct lesson of the DoNotPay
order. This document is the machinery for doing it.

---

## 2. The gate before any selling

**No paying customer before the corpus is graded.** This is already
`PLAN.md` §7 days 1 to 30, and it is repeated here because it is the load-bearing
commitment.

| | |
|---|---|
| **Corpus** | 20 real denial letters, each with the policy it refers to |
| **Source** | Public consumer-complaint threads, law firm example pages, and documents contributed with written permission |
| **Grader** | **A licensed public insurance adjuster**, named, with a licence number and state. **[[FILL: name, licence number, state]]** |
| **Paid?** | **[[FILL: yes or no, and how much. Record it. A paid grader is fine; an undisclosed relationship is not]]** |
| **Method** | The grader reads each letter and policy independently and lists the discrepancies they find. Countercite's findings are then compared to that list |
| **Recorded** | Per finding: confirmed, false positive, or missed. Raw records retained per §6 |

**Kill criterion, from `PLAN.md` §11 and not renegotiable after the fact:** if
findings confirmed by the professional come in **below 70%**, do not sell it.
Fix the engine or kill the business.

**Why an adjuster rather than a lawyer.** DoNotPay's specific failure was not
retaining attorneys to check law-related features. Countercite's claim is
narrower: that its findings are the ones a working professional would make about
two documents. A licensed public adjuster is the right grader for that claim,
and the claim must be worded to match the grader. See §5.

---

## 3. What gets measured

Tied directly to `PLAN.md` §8. The first three are the ones that appear in
public claims. The rest are operating metrics and are not advertised.

| Metric | Target | Definition, tightly | Publishable? |
|---|---|---|---|
| **Findings confirmed by the professional** | **>85%** | Of all findings Countercite surfaces on a case, the share the reviewing professional marks `confirmed` rather than `dismissed` | **Yes**, with dataset |
| **False positives per case** | **<2** | Findings marked `dismissed` by the reviewer, divided by cases | **Yes**, with dataset |
| **False negatives per case** | **<0.5** | Discrepancies the grader found that Countercite did not surface, divided by cases. Measured by re-running closed cases where the answer is known | **Yes**, with dataset, and **it must be published alongside the other two.** Publishing a confirmation rate without a miss rate is the shape of a misleading claim |
| Hours saved per case | >4 | Self-reported by the customer, in their own words | **Only as an attributed customer statement**, never as a company claim. See §7 |
| Activation: first real case within 7 days | >70% | Operating metric | No |
| Monthly churn | <4% | Operating metric | No |
| Approach to trial | >10% | Operating metric | No |
| Trial to paid | >30% | Operating metric | No |

**On the false negative.** `PLAN.md` §8 contains a correction the owner made
against himself: a false positive is visible and annoying, while a missed
contradiction is invisible until the claim settles low with the professional's
name on it. That correction is also why the miss rate has to be published rather
than held back. A number that only flatters is a number a regulator reads as a
selection.

**What is never measured and never claimed:** whether appeals succeed, how much
anyone recovered, or how Countercite compares to a lawyer or an adjuster. We
do not have that data, we cannot get it reliably, and claiming it is the
DoNotPay fact pattern exactly.

---

## 4. Whose documents the measurements come from

Three sources, and the rules differ for each.

### 4.1 The graded corpus (pre-launch)

Public documents and documents contributed with **written permission**. Every
contributed document needs a record of who gave it, when, and on what terms.
**[[FILL: keep this as a simple list. Name, date, what was contributed, and the
words they agreed to.]]**

### 4.2 The founding cohort (first 20 customers)

`PLAN.md` §5 prices the founding cohort at $199/month locked for life **in
exchange for a testimonial after 60 days and the right to quote their numbers**.
That exchange has to be written down, because an undisclosed price concession in
return for a testimonial is a disclosure problem under the FTC's endorsement
rules.

Requirements:

- **Written consent**, obtained separately from the terms of service, saying
  what may be quoted and how they may be identified.
- **The consideration disclosed** wherever the testimonial appears. The plain
  version: *"[Name] receives a reduced founding-customer rate. They were not paid
  for this statement."* Adjust to whatever is actually true.
- **The customer may withdraw** consent at any time, and the quote comes down.
- **No editing that changes meaning.** Trimming for length is fine. Trimming a
  qualifier is not.

### 4.3 Ongoing production measurement (every customer)

Every finding a customer marks `confirmed` or `dismissed` through the existing
review gate is a data point. This is a by-product of a feature that already
exists in the engine, which is why the measurement costs nothing to run.

- **Aggregate only.** Published production numbers are counts and rates across
  customers. No customer's documents, cases or identity appear in any published
  figure.
- **Opt-out available.** A customer who does not want their review outcomes in
  the aggregate can say so. **[[FILL: build the toggle, or state plainly in the
  privacy policy that aggregate counts are used and cannot be separated.]]**
- **False negatives cannot be measured in production**, because nobody knows
  what was missed. They are measured only on the graded corpus and on re-runs of
  closed cases, and any published miss rate must say which.

---

## 5. How results are recorded: the claims register

**One row per published claim. No row, no claim.** Keep it as a file in the
repository so it is versioned, dated, and impossible to quietly edit.

Suggested location: `innovation/legal/claims-register.md`, created when the
first measurement exists.

Each entry:

| Field | What goes in it |
|---|---|
| **Claim ID** | `CW-2026-001` and upward |
| **The exact sentence** | Word for word as it will appear in public. Not a summary of it |
| **The number** | The figure, with its denominator |
| **Dataset** | What it was measured on, with n. "138 findings across 20 denial letters and their policies" |
| **Period** | The dates the data covers |
| **Who graded it** | Name, role, licence number and state where applicable. "The founder" is an acceptable answer for operating metrics and is **not** acceptable for accuracy claims |
| **Relationship to us** | Paid, unpaid, customer, founding customer, independent |
| **Method** | Two or three sentences. Enough that someone else could repeat it |
| **Raw data location** | Path to the file holding the underlying records |
| **Where published** | Every page, email, deck and post the sentence appears on |
| **Approved by / date** | The owner, with the date |
| **Review due** | The date this claim must be re-measured or withdrawn. See §8 |

**A worked example**, to be replaced with a real one:

> **CW-2026-001**
> **Sentence:** "In our pre-launch test, a licensed Texas public adjuster
> confirmed 87% of the findings Countercite produced across 20 real denial
> letters."
> **Number:** 87% (120 of 138 findings)
> **Dataset:** 138 findings across 20 denial letters and their matching policies
> **Period:** [[FILL: dates]]
> **Graded by:** [[FILL: name]], Texas public adjuster licence [[FILL: number]]
> **Relationship:** [[FILL: paid $X for the review / unpaid]]
> **Method:** The grader read each letter and policy without seeing our output
> and listed every discrepancy found. Our findings were then matched against
> that list. A finding was counted as confirmed only where the grader had
> independently identified the same discrepancy or agreed with it on review.
> **Raw data:** [[FILL: path]]
> **Published on:** [[FILL: pages]]
> **Approved:** [[FILL: name, date]]
> **Review due:** [[FILL: date, no more than 12 months out]]

---

## 6. Keeping the substantiation

- **Raw records are kept for at least [[FILL: 3]] years** after the claim stops
  being published. Grader worksheets, per-finding outcomes, the dated export of
  the production data, and the consent records.
- **Nothing is overwritten.** A re-measurement is a new claim ID, and the old one
  is marked superseded with its date, not deleted.
- **Customer documents are not part of the substantiation record.** Keep the
  grades, the counts and the method. Delete the documents on the ordinary
  retention schedule in the privacy policy. The evidence is the measurement, not
  the underlying files.

---

## 7. What may be advertised

**Permitted, with a register entry and the D6 dataset sentence from
`DISCLAIMERS.md` beside it:**

- The confirmation rate, the false-positive rate and the false-negative rate,
  **published together**, with the dataset and the date.
- A description of what the software does mechanically: that every finding cites
  a page and a passage in the customer's own documents; that the engine reports
  where a denial letter quotes a provision in part; that it refuses to report a
  finding it cannot locate. These are claims about a mechanism and they are
  verifiable by using the product. They still need to be true.
- A customer's own words about their own experience, attributed, with any
  consideration disclosed, and with the D8 disclaimer beside it.
- Prices, plan contents, the fair use ceiling, and anything else factual about
  the offering.

**Permitted only in this form:** hours saved. Never "Countercite saves you six
hours a case." Always "[Name], a public adjuster in [city], told us it saved
them about six hours on a hail claim in March," with D8 beside it.

## 8. What may never be advertised

- **Any outcome claim.** Win rates, success rates, reversal rates, dollars
  recovered, "get what you're owed", "we'll get your claim paid".
- **Any comparison to a professional.** Better than, as good as, replaces,
  instead of hiring, "you don't need a lawyer". This is the exact claim the
  DoNotPay order prohibits without competent and reliable evidence, and we will
  never have that evidence because we will never run that test.
- **Any accuracy number without its dataset sentence and its register entry.**
- **A confirmation rate published without the miss rate.**
- **Any capability claim about the model** as the headline. `PLAN.md` §4 already
  rules out "AI-powered" as the lead, and this is the reason.
- **Any number from a demo, a hand-picked example, or a single impressive case**
  presented as typical.
- **Any figure carried forward past its review date.**

## 9. Before anything is published

Six checks. They take fifteen minutes and they are the whole policy in practice.

1. Does every number in this piece have a claims register entry?
2. Does the D6 dataset sentence sit next to each one, in the body, not a
   footnote?
3. If a confirmation rate appears, does the miss rate appear with it?
4. Does any sentence compare Countercite to a lawyer or an adjuster? Remove it.
5. Does any sentence promise, predict or imply an outcome? Remove it.
6. Run the blocked-phrase fixture from `00-LEGAL-POSTURE.md` §1.4.3 over the
   copy. Zero hits.

## 10. When a claim goes stale

Every claim carries a review date, and **no review date is more than 12 months
out**. On that date the claim is either re-measured with fresh data under a new
ID, or **taken down everywhere it appears**.

"Everywhere" includes the site, sales emails, decks, the press page, and social
posts. **[[FILL: keep the list of publication locations current in the register,
because a claim you cannot find is a claim you cannot withdraw.]]**

If a re-measurement produces a worse number, publish the worse number or publish
nothing. Quietly keeping the old figure while knowing the new one is the
behaviour the DoNotPay order exists to punish.

## 11. Who signs off

Today, the owner, and there is nobody else to check the work. That is a real
weakness and it is worth naming rather than pretending otherwise. Two cheap
partial substitutes:

- **The claims register is in version control**, so every claim has a commit,
  an author and a date, and changing one leaves a trace.
- **[[FILL: name one outside person, the grading adjuster is the obvious
  candidate, who reads any accuracy claim before it goes public. An hour a
  quarter. It is the only real check available at this size.]]**
