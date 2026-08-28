# Eight ideas — scored, ranked, and what to do first

Researched 2026-08-28. Read [`00-METHOD.md`](00-METHOD.md) for the gate, and
[`research/00-PLATFORM-GATE.md`](research/00-PLATFORM-GATE.md) for what an
iPhone can actually do alone.

---

## The thesis in one paragraph

You asked for AI products that cost nothing per customer. Those two things
collide, and the only resolution is **the model running on the device.** That
resolution turns out to be the search itself: if inference is free and local,
the only markets worth entering are the ones where sending data to a server is
**disqualifying** — by statute, by professional duty, or because there is no
signal. Every idea below sits in such a market, and every one of them attacks an
incumbent that meters: **per note, per session, per page, per gigabyte, per
minute of video.**

## The eight

| # | Idea | Field | The wedge |
|---|---|---|---|
| [1](ideas/01-privilege.md) | **Privilege** | Solo/small-firm litigation | Discovery with zero gigabytes billed — and a tool that refuses to let you waive privilege |
| [2](ideas/02-verbatim-record.md) | **The verbatim record** | Court reporting | A transcript that colours which words a human verified, and won't certify until all of them are |
| [3](ideas/03-redaction.md) | **Redaction** | Small law enforcement records | Unlimited video redaction against a field that charges ~$95 per hour of footage |
| [4](ideas/04-chronology.md) | **The chronology** | Personal injury | Every timeline row one click from the actual page — and a missing-records list as the headline output |
| [5](ideas/05-evaluation.md) | **The evaluation** | School psychology | Installs without a district data-privacy review, because nothing leaves the laptop |
| [6](ideas/06-investigation.md) | **The investigation** | Workplace investigators | The contradiction map — what six interviews disagree about |
| [7](ideas/07-part-2-note.md) | **The Part 2 note** | SUD treatment | Unlimited notes where a stricter federal rule than HIPAA applies |
| [8](ideas/08-home-visit.md) | **The home visit** | In-home social services | One spoken account fills all the forms, in a house with no signal |

## Scored on the six axes

1–5 each. **These are my judgement, not a measurement.** They exist to force a
ranking; the reasoning is in each brief.

| # | Idea | Innov. | Need | Advantage | Build | Creative | Money | **Total** |
|---|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| 6 | The investigation | **5** | 4 | **5** | 4 | **5** | 4 | **27** |
| 1 | Privilege | 4 | **5** | **5** | 3 | 4 | **5** | **26** |
| 2 | The verbatim record | **5** | **5** | 4 | 3 | **5** | 4 | **26** |
| 4 | The chronology | 4 | 4 | 3 | 3 | 4 | **5** | **23** |
| 8 | The home visit | 4 | **5** | 3 | 4 | 4 | 2 | **22** |
| 3 | Redaction | 3 | **5** | 4 | 3 | 3 | 3 | **21** |
| 5 | The evaluation | 3 | **5** | 3 | 4 | 3 | 3 | **21** |
| 7 | The Part 2 note | 3 | 4 | 4 | 4 | 3 | 2 | **20** |

**Buildability is scored against your constraints** — solo, on-device, offline,
no server, zero marginal cost — not against "could a funded team build it."

## What each one needs to break even

At **$250,000/year**, before tax and Apple's cut.

| # | Idea | Price | Customers needed | Payback for the buyer |
|---|---|---:|---:|---|
| 6 | Investigation | $199/mo | **105** | 90 minutes saved per month |
| 1 | Privilege | $149/mo | **140** | one month of a 20 GB case |
| 2 | Verbatim record | $149/mo | **140** | ~25 pages at $6/page |
| 4 | Chronology | $299/mo | **70** | one outsourced case per year |
| 3 | Redaction | $299/mo | **70** | 62% under Veritone, unlimited |
| 5 | Evaluation | $59/mo | **354** | one afternoon per report |
| 7 | Part 2 note | $39/mo | **535** | same price, no note cap |
| 8 | Home visit | $49/mo | **426** | 20 minutes per visit |

**The pattern is worth naming: the ideas that need the fewest customers are the
ones sold to people who bill by the hour.** Ideas 7 and 8 need four to eight
times as many customers as ideas 4 and 3, and that is a marketing problem you
would be solving forever.

## The one thing that decides five of the eight

**Ideas 2, 5, 6, 7 and 8 all depend on on-device transcription working on real
field audio.** Apple's `SpeechTranscriber` benchmarks well — 2.12% WER on clean
LibriSpeech, better than Whisper Small [review] — but LibriSpeech is read
audiobook speech. It contains no cross-talk, no barn, no moving car, no crying
child, no speakerphone, no accent, no legal or clinical jargon. And the new
framework **dropped the custom-vocabulary feature** the old one had.

**This is a correlated risk across most of the portfolio, and it costs one
afternoon to retire.** Record four realistic scenarios, run the framework on
device, measure word error rate on the jargon and speaker attribution at turn
boundaries. Do this before anything else in this document.

## The recommendation

**Idea 1 — Privilege — is the strongest business.** The buyer pool is the
largest here (>75% of 437,839 US law firms have under six attorneys [review]),
the price is the highest the market will bear, and the moat is a professional
duty rather than a feature. It also does not depend on the transcription gate
above. Its risk is that Mac-only excludes most of legal, and that a 3B model may
not be subtle enough for privilege — both testable in a weekend with no code.

**Idea 6 — The investigation — is the best idea.** The contradiction map is the
only feature in this document that is *both* the actual professional work
product *and* impossible for a cloud competitor to build, because holding every
interview at once is only acceptable on a device the investigator owns. The
payback threshold — under two hours a month against a $132/hour rate — is the
lowest here. **Its risk is not the product, it is that I could not establish how
many independent workplace investigators exist.** Five phone calls settle both
that and whether they record at all.

**Idea 2 — The verbatim record — has the strongest demand evidence.** A
workforce down 21% in a decade, over 1,000 retiring against fewer than 300
entering per year, 1.7 million California proceedings with no record since 2023
[review]. It is also the only idea where I can compute break-even as a share of
market: **roughly 0.8%.** The reframe — sell to the disrupted profession as the
thing that saves them — is the most commercially interesting move in the set.

**Do not start with 7.** Its entire premise is my reading of 42 CFR Part 2, and
if a healthcare attorney says a BAA covers cloud processing the same as HIPAA,
the idea collapses into the crowded category I already cut. One consultation
answers it. Ask before building.

**Idea 3 is the one I would most like to be wrong about.** The need evidence is
excellent and the metering is the most egregious in the document — but the buyer
is a municipal records office, and that is the failure mode that cut child
protective services from this set entirely.

## What to do this week, in order

1. **The transcription afternoon.** Four realistic recordings, on-device, measure
   WER on jargon and speaker attribution. Retires or exposes the risk under five
   of eight ideas. *Cost: an afternoon.*
2. **Ten phone calls.** Five workplace investigators (idea 6), five private
   in-home providers (idea 8). Both scripts, both decision rules, are written
   into the briefs — **write the rule down before dialling.** *Cost: an
   afternoon.*
3. **One call to SageReport** as a prospective customer, for the real price of
   idea 5's competitor. *Cost: ten minutes.*
4. **The privilege recall test** for idea 1 — 200 hand-labelled documents, a
   local model, measure recall. *Cost: a weekend, no code.*

**Four days of work, no code written, and every one of the eight is either
confirmed, repositioned, or dead.** Building first and discovering the model
cannot hold the standard is the expensive path.

## What this document does not know

Listed so a gap is not mistaken for an oversight. Full list in
[`SOURCES.md`](SOURCES.md).

- **No price here was read off a vendor's own page.** The egress proxy blocked
  every direct fetch. All pricing is third-party-reported and must be verified
  by phone.
- **Nothing was measured on a device.** Every accuracy figure is from a published
  benchmark, and no benchmark here used field audio.
- **Buyer counts are missing for five of the eight** — school psychologists,
  workplace investigators, Part 2 programs, private in-home providers, and law
  enforcement agencies. Break-even is stated as a customer count for that
  reason, never as a market share, except for idea 2 where the denominator
  exists and is itself contested.
