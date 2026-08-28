# Innovation — eight AI businesses that cost nothing to run

Researched 2026-08-28. **A standalone project.** Nothing here is shared with,
derived from, or cross-referenced against anything else in this repository.

---

## The idea behind the ideas

The brief was: as innovative as Trueline, **similar in nothing else**, built on
AI, real demand, and it has to pay.

Two of those requirements fight. *AI is the product* and *zero marginal cost per
customer* cannot both be true if the model lives on a server — every call costs
money per customer, which is why nearly every AI product on the market meters.

The only resolution is **the model running on the device**. And that resolution
is the whole search, because it means the only markets worth entering are the
ones where a server is not merely undesirable but **disqualifying** — by
statute, by professional duty, or because there is no signal in the building.

Every idea here sits in such a market. Every one of them attacks an incumbent
that charges **per note, per session, per page, per gigabyte, or per minute of
video**.

**Start with [`00-OVERVIEW.md`](00-OVERVIEW.md)** for the scoring, the ranking
and what to do this week. Then [`00-METHOD.md`](00-METHOD.md) — the gate every
idea had to clear, and the good ideas that failed it.

---

## The eight

| # | Idea | Field | The wedge |
|---|---|---|---|
| [1](ideas/01-privilege.md) | **Privilege** | Solo/small-firm litigation | Discovery with zero gigabytes billed — and a tool that refuses to let you waive privilege |
| [2](ideas/02-verbatim-record.md) | **The verbatim record** | Court reporting | A transcript that colours which words a human verified, and won't certify until all of them are |
| [3](ideas/03-redaction.md) | **Redaction** | Small law enforcement records | Unlimited video redaction against a field charging ~$95 per hour of footage |
| [4](ideas/04-chronology.md) | **The chronology** | Personal injury | Every timeline row one click from the actual page — and missing records as the headline output |
| [5](ideas/05-evaluation.md) | **The evaluation** | School psychology | Installs without a district data-privacy review, because nothing leaves the laptop |
| [6](ideas/06-investigation.md) | **The investigation** | Workplace investigators | The contradiction map — what six interviews disagree about |
| [7](ideas/07-part-2-note.md) | **The Part 2 note** | Substance use treatment | Unlimited notes where a federal rule stricter than HIPAA applies |
| [8](ideas/08-home-visit.md) | **The home visit** | In-home social services | One spoken account fills every form, in a house with no signal |

## Ranked

| # | Idea | Total | Break-even | Payback for the buyer |
|---|---|:-:|---:|---|
| 6 | The investigation | **27** | 105 @ $199 | 90 minutes saved per month |
| 1 | Privilege | **26** | 140 @ $149 | one month of a 20 GB case |
| 2 | The verbatim record | **26** | 140 @ $149 | ~25 transcript pages |
| 4 | The chronology | **23** | 70 @ $299 | one outsourced case a year |
| 8 | The home visit | **22** | 426 @ $49 | 20 minutes per visit |
| 3 | Redaction | **21** | 70 @ $299 | 62% under Veritone, unlimited |
| 5 | The evaluation | **21** | 354 @ $59 | one afternoon per report |
| 7 | The Part 2 note | **20** | 535 @ $39 | same price, no note cap |

Scored 1–5 on innovation, need, advantage, buildability, creativity and money.
**The scores are judgement, not measurement**; the reasoning is in each brief.

## The recommendation, in three lines

- **Strongest business: 1, Privilege.** Largest buyer pool, highest price, and a
  moat made of a professional duty rather than a feature.
- **Best idea: 6, The investigation.** The contradiction map is the real
  professional work product *and* impossible for a cloud competitor to build.
- **Best evidence: 2, The verbatim record.** A workforce down 21% in a decade,
  and the only idea whose break-even I can state as a market share (~0.8%).

**Do not start with 7** — its entire premise is my reading of a regulation. One
call to a healthcare attorney confirms or kills it.

## Read this before you believe any number

- **No price here was read off a vendor's own page.** The network egress proxy
  blocked every direct fetch. Everything is third-party-reported and several
  sources are competitors of the products they price. **Verify by phone.**
- **Nothing was measured on a device.** Every accuracy figure comes from a
  published benchmark, and none of those benchmarks used field audio.
- **Buyer counts are missing for five of the eight.** Break-even is therefore
  stated as a customer count, not a market share, everywhere but idea 2.

Everything unknown is listed in [`SOURCES.md`](SOURCES.md) under *Figures
deliberately NOT claimed*.

## Four days that settle all eight

No code. In order:

1. **The transcription afternoon** — four realistic recordings, on device,
   measure word error rate on jargon and speaker attribution at turn boundaries.
   **Five of the eight ideas depend on this and it is one correlated risk.**
2. **Ten phone calls** — five workplace investigators, five private in-home
   providers. Scripts and decision rules are in the briefs. Write the rule down
   before dialling.
3. **One call to SageReport** as a prospective customer, for idea 5's real
   competitive price.
4. **The privilege recall test** — 200 hand-labelled documents, a local model,
   measure recall on the privileged set.

Each brief ends with **one test that settles it** and a decision rule to write
down *before* running it. Running the tests is cheap. Building first and
discovering the model cannot hold the standard is not.

---

- The gate the device must clear: [`research/00-PLATFORM-GATE.md`](research/00-PLATFORM-GATE.md)
- Every URL consulted: [`SOURCES.md`](SOURCES.md)
