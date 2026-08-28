# 2 — The verbatim record

**The transcript that marks which words a human actually verified.**

Industry: court reporting / deposition · Buyer: the independent reporter · Platform: iPhone/iPad + Mac

---

## The gap

The court reporting workforce is collapsing, and the numbers are not subtle.

| Figure | Source class |
|---|---|
| Workforce **shrunk 21% in a decade**, to ~23,000 stenographers | [review] |
| Projected shortage of **5,500 certified reporters by 2030** | [review] |
| **Fewer than 300 enter** the field a year; **over 1,000 retire** | [review] |
| Average NCRA member age **~56** | [review] |
| California: **1.7M+ legal proceedings with no verbatim record since 2023** | [review] |
| 76% of legal professionals cite scheduling difficulty; 55% report higher costs | [review] |

**A conflict I am not going to paper over:** one source puts the US total at
~17,700 court reporters, another at ~23,000 stenographers [both review]. They
may be counting different populations — all reporters versus stenographers
specifically. **The real number is not established here.** It does not change
the direction of the trend, which every source agrees on, but it does change any
market sizing, so no sizing below leans on it.

## The money already moving

Per deposition [review]:

- Transcript: **$3.00–$8.00 per page** (certified: $4.50–$7.00)
- Reporter time: **$100–$200/hour**
- Appearance fee: **$150–$400**
- Expedite surcharge: **50%–100%**
- A standard deposition transcript: **$300 to over $1,500**
- A 4-hour deposition at $4.25/page: **$637–$1,062 for the transcript alone**

The reporter is an **independent contractor who buys their own equipment.**
Test C passes cleanly — this is the rare professional shortage where the person
in pain personally holds the credit card.

## Why cloud is disqualified

Three reasons, and the third is the one that matters:

1. Sealed proceedings, in-camera testimony, grand jury material, minors, trade
   secrets under protective order. A reporter uploading that audio to a
   transcription service has made a disclosure decision they were not asked to
   make.
2. Courthouses have poor connectivity and restrictive device policies.
3. **The reporter's certification is a personal legal attestation.** They sign
   that the transcript is a true and correct record. A tool whose output they
   cannot fully inspect and correct is a tool that puts their certification at
   risk — and their certification is their entire livelihood.

## What it is

Not "AI replaces the reporter." That product exists, the profession hates it,
and it deserves to be hated: it produces a transcript nobody will certify.

This is the inverse. **A tool that makes one reporter able to certify more
transcripts, by making verification — not typing — the job.**

- On-device long-form transcription and speaker separation, produced live.
- **A two-colour transcript.** Every word is either *machine-heard* or
  *reporter-verified*. The reporter scrubs the audio, confirms passages, and
  the colour changes. This is Trueline's provenance idea moved from a measured
  wall to a spoken word.
- **It will not export a certified transcript while any word is still
  machine-only.** The certification page is generated only when the document is
  100% verified, and it states the method. Uncertified working drafts export
  freely and are watermarked as such.
- Local jargon dictionary per matter — party names, expert terms, drug names —
  because Apple's new speech framework **dropped custom vocabulary** (see the
  platform gate), making this a product requirement, not a nicety.

## The innovation

The category is fighting over whether AI transcripts are good enough to replace
a reporter. **This product refuses to have that argument.** It says the
machine's output is never certifiable and builds the entire interface around
converting machine-heard words into human-verified ones as fast as possible.
That reframing is the whole business: it is sold *to* the profession that is
being disrupted, as the thing that lets them absorb the shortage instead of
being replaced by it.

## Money

| Price | Against | Customers for $250k/yr |
|---|---|---|
| $99/mo | ~12–33 transcript pages | 211 |
| $149/mo | ≈ one appearance fee | 140 |
| $249/mo | ~1/4 of one 4-hour transcript | 84 |

At $149/mo, **140 reporters.** If the workforce is even 17,700, that is **0.8%**
of it. This is the most favourable break-even-as-share-of-market in the set —
and the only one where I can compute the share at all, with the caveat above
that the denominator is contested.

## Risks

- **Diarisation quality is the whole product** and it is unmeasured. Multi-party
  depositions with cross-talk are the hardest case in speech recognition.
- **The profession is defensive**, with reason. NCRA-aligned reporters may read
  any AI tool as the enemy. Positioning is not marketing here, it is survival.
- **Digital reporting is already the incumbent response** (AAERT-certified
  digital reporters, 85% using digital machines [review]). This competes with
  that transition, and agencies like Steno, Lexitas and Rev are already in it.
- Recording rules vary by jurisdiction and some courts forbid it outright.

## The one test that settles it

**Cost: one afternoon.** Get one real multi-speaker deposition-style recording —
four speakers, cross-talk, a speakerphone, legal jargon. Run Apple's
`SpeechTranscriber` on device. Measure two things separately:

1. **Word error rate** on the legal-jargon passages specifically, not overall.
2. **Speaker attribution accuracy** across turn changes.

**Decision rule, written before running:** if speaker attribution is below 95%
at turn boundaries, a reporter will spend longer fixing attribution than typing
from scratch, and the product has negative value. Kill it that day.
