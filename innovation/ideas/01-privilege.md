# 1 — Privilege

**The discovery review that never leaves the laptop.**

Industry: solo and small-firm litigation · Buyer: the lawyer · Platform: Mac (+ iPad companion)

---

## The gap

Discovery is priced by the gigabyte. Not by the value of the case, not by the
hours worked — by the size of the pile.

Typical 2026 rates [review]:

| Line | Rate |
|---|---|
| Processing | $3–$10 / GB |
| Hosting | $5–$15 / GB **per month** |
| Review and production | $15–$30 / GB |
| Logikcull entry price | **$395 / month** |
| GenAI-assisted review (EDRM Winter 2026 survey) | $0.11–$0.50 / document |

A modest 50 GB case runs **$250–$500/month in data charges alone**, before user
fees, processing and production [review].

Read that as an operator, not a lawyer. A solo with one contested case a year
pays a monthly hosting bill for a year to hold documents that sit still. The
per-gigabyte model is built for a firm running forty matters, and it is charged
to the firm running one. **This is the metering pattern in its purest form: the
low-volume operator subsidises the high-volume one, and the low-volume operator
is most of the market.**

**More than 75% of US law firms have fewer than six attorneys, and roughly 40%
are one-lawyer practices** — of 437,839 firms [review]. Seven in ten
private-practice lawyers are solo or small-firm [review].

## Why cloud is disqualified, not merely disliked

This is the strongest test-A case in the set, because the profession has written
the rule down.

- **ABA Formal Opinion 512** (July 2024) — the first formal ABA guidance on
  generative AI. Lawyers must understand how the tool handles data, and must
  take reasonable precautions to protect confidential client information
  [review].
- Informed client consent is advised **before** using a third-party generative
  AI product where confidential information would be disclosed to it [review].
- **New York Formal Opinion 2025-6** addresses AI recording and transcription of
  client meetings specifically [review].
- **Texas Opinion 705** (Feb 2025) requires human oversight of AI work product
  [review].

Uploading an opposing party's production to a third-party server is a question
a lawyer must answer to a client. Running the model on the lawyer's own laptop
is a question that does not arise. **The product's core claim is that there is
no third party to disclose to.**

## What it is

A Mac application. Drag in the production — PDFs, emails, scans. Everything
happens locally: OCR, embedding, indexing, review, privilege screening,
production numbering.

Four things it does that a cloud tool structurally cannot:

1. **Zero gigabytes billed, ever.** The 50 GB case costs the same as the 5 GB
   case: the subscription. Flat and unlimited, against a field that meters by
   volume.
2. **A privilege log that shows its work.** Every call — privileged, partially
   privileged, responsive, non-responsive — carries the passage that triggered
   it and whether a human confirmed it. Borrowed from Trueline's provenance
   discipline, applied to a document instead of a wall.
3. **It refuses to produce.** No production set is exported while any document
   the model flagged as *possibly privileged* is still unreviewed by a human.
   The catastrophic error in document review is the inadvertent privilege
   waiver, and the product's opinion is that a machine may not be the last thing
   to touch that decision.
4. **An affidavit-ready methodology export.** A page describing exactly what
   search and review process was run, in the form a court asks for when
   completeness is challenged.

## The innovation

Everyone else made review cheaper per document. **This makes the per-document
price zero and sells the refusal instead** — the tool's value is that it will
not let you waive privilege, and it can say that credibly because nothing left
the building.

## Money

**Buyers:** ~328,000 US firms under six attorneys [derived: 437,839 firms
× >75%] — though only the litigating subset is addressable, and **that fraction
is not established here.**

| Price | Against | Customers for $250k/yr |
|---|---|---|
| $99/mo | one month of a 20 GB case | 211 |
| $149/mo | below Logikcull's $395 floor | 140 |
| $199/mo | exactly half Logikcull’s floor | 105 |

At $149/mo, **140 customers**. Against a pool in the hundreds of thousands,
that is a rounding error — which is the point: this idea does not need
penetration, it needs to be found.

## Risks, stated plainly

- **Mac-only excludes most law firms.** Windows dominates legal. This is a real
  ceiling and the honest answer is that the first version serves the Mac
  minority and the model has to work there before any port is considered.
- **Local inference on a huge corpus is slow.** A 50 GB case on an M-series Mac
  is an overnight index, not a coffee break. Must be honest about it in the UI.
- **On-device models are ~2–3B parameters.** Privilege judgement is subtle.
  This is the gating unknown.
- **Court-admissibility of an AI-assisted review methodology** is unsettled and
  varies by jurisdiction. The product must position as attorney-supervised, and
  the refusal-to-produce gate is what makes that claim true rather than stated.

## The one test that settles it

**Cost: one weekend, no code.** Take a public document corpus with known
privileged material — any published litigation production. Hand-label 200
documents for privilege. Run a 3B on-device-class model over them locally with
the intended prompt and measure **recall on the privileged set.**

**The decision rule, written down before running it:** false negatives are
career-ending, false positives are merely expensive. If recall on privileged
documents is below **98%**, the product cannot be the last line and must be
repositioned as a first-pass triage tool — a different, smaller business. Decide
which business you are in before writing a line of code.
