# 6 — The investigation

**The workplace investigation report, from interviews that never touch a server.**

Industry: independent workplace / HR investigators · Buyer: the investigator · Platform: iPhone + Mac

---

## The gap

An external workplace investigation — harassment, discrimination, retaliation —
is a defined professional product with a defined deliverable [review]:

> all interviews with **summary statements drafted by the investigator**, and a
> comprehensive report containing all evidence, **detailed analysis of each
> allegation, credibility analyses**, and factual conclusions on a preponderance
> standard.

And it is billed by the hour [review]:

| Line | Rate |
|---|---|
| Hourly | **$85–$225/hr** (average ~$132) |
| Retainer | **$1,500–$5,000** |
| Structure | hourly, **not** flat fee |

Most of those hours are not investigation. They are transcribing interviews,
drafting summary statements, and cross-referencing six accounts of the same
meeting to find where they diverge. **An investigator billing $150/hour is
spending a large fraction of it typing** — and because it is billed hourly, the
client is paying $150/hour for typing.

## Why cloud is disqualified

This is the sharpest test-A case in the set after idea 1, and it is sharp for a
reason most people miss.

- Investigation interviews are conducted under an **expectation of
  confidentiality** given verbally to every witness. That promise is what
  produces candour, and candour is the entire product.
- The investigation is usually **conducted at the direction of counsel to
  preserve privilege**. A third-party AI vendor in the chain is an argument the
  opposing side will make for waiver, and the investigator will have to answer
  it on the stand.
- These recordings are **litigation-bound by design** — the report exists
  because someone anticipates a claim. Every artefact is discoverable, including
  vendor logs.
- Investigators are frequently retained precisely because they are *outside* the
  organisation. Routing the interviews through a cloud vendor quietly puts a
  fourth party inside an engagement whose value proposition is containment.

An investigator who can tell a witness *"this recording never leaves this
device"* — and mean it literally — gets better interviews. **The privacy
property is not a compliance checkbox here; it materially improves the raw
material.**

## What it is

An iPhone app for the interview, a Mac app for the report.

- Record on device. Transcribe on device. Never syncs anywhere but the
  investigator's own iCloud.
- **Allegation-indexed, not interview-indexed.** The investigator defines the
  allegations; every passage from every interview is filed against the
  allegation it speaks to. The report is assembled per allegation, which is how
  it must be written and is not how the recordings arrive.
- **The contradiction map — the core feature.** Across six interviews, surface
  every place two accounts of the same event diverge, with both passages side by
  side and the audio timestamps. **This is the actual work product of an
  investigation.** No one is selling it, because doing it requires the whole
  corpus and the whole corpus is the most confidential thing in the building.
- **It refuses to generate a credibility analysis.** Credibility is the
  investigator's professional judgement and, in litigation, the thing they will
  be cross-examined on for hours. The tool assembles the evidence bearing on
  credibility — consistency, corroboration, contemporaneous documents — and
  stops. A model's opinion on whether a person is lying is a liability with no
  upside.
- Every sentence in the draft carries the interview and timestamp it came from.

## The innovation

The contradiction map. Everyone else is building a scribe that summarises one
conversation. **The value in an investigation is not in any one interview — it
is in the differences between them**, and that comparison is only possible for a
tool that holds every interview at once, which is only acceptable if that tool
is a device the investigator owns.

The constraint and the feature are the same fact. That is the Trueline move.

## Money

At $132/hour average, **a tool that saves four hours per investigation returns
$528**. That is the entire pitch, and it needs no adjustment for the client's
budget because the client is paying by the hour.

| Price | Pays for itself | Customers for $250k/yr |
|---|---|---|
| $99/mo | 45 min/month saved | 211 |
| $199/mo | 90 min/month saved | 105 |
| $299/mo | ~2.3 hrs/month saved | 70 |

**70–105 investigators.** The payback threshold is under two hours a month,
which is the lowest bar in this document.

## Risks

- **The buyer population is not established** and may be small. Independent
  workplace investigators are a real profession — many are employment lawyers or
  ex-HR — but **no headcount was found.** This is the largest open question and
  it is unglamorous market research, not product work.
- **Recording consent law varies by state** (all-party consent in California and
  ten-ish others). Many investigators deliberately do not record, taking notes
  instead. **If most do not record, the product's premise fails** — and it can
  be checked with five phone calls.
- Employment-lawyer investigators may be barred by their own firm's tooling
  policy.
- Demand is episodic; churn risk between engagements is real.

## The one test that settles it

**Cost: five phone calls.** Call five independent workplace investigators.
Ask exactly three questions: *do you record your interviews or take notes; how
many hours does a typical report take you; and what would you pay for a tool
that never uploads the audio.*

**Decision rule, written before dialling:** if **three or more do not record**,
kill it — there is no audio to work with and the product is a note-taking app.
If four or more record and name a number, this is the highest revenue-per-hour
idea in the set.
