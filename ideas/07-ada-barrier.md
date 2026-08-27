# 7 — Evidence, not opinion

**ADA and accessibility barrier surveys: measured clearances and slopes, a
ranked barrier list, a priced remediation plan, and a report built to be read in
litigation.**

---

## The job today

A building owner gets a demand letter alleging ADA barriers. Or they are buying
a property, renewing a lease, or trying to get ahead of both. Someone walks the
site with a tape, a smart level, a clipboard and a camera, and measures: door
clearances, counter heights, ramp slopes, cross-slopes, reach ranges, turning
radii, parking-stall dimensions.

**Almost every one of those is a number with a hard pass/fail threshold**, and
almost every one of them is currently written on a clipboard and retyped twice —
once into a report, once into whatever prices the remediation.

The slope numbers matter most and are the worst to capture: a running slope over
1:12 and a cross-slope over 1:48 are failures, and they are read off a two-foot
level held by a person crouching on a ramp.

## Where it sits

| Product | What it is | Price | Source class |
|---|---|---|---|
| BlueDAG | ADA inspection software suite | subscription **not published**; enterprise services from **$125/hr** | [vendor] |
| BlueDAG inspection services | Done-for-you site survey | **$2,500–$4,500 per site** | [vendor] |
| CASp inspection (California) | Certified Access Specialist survey | **~$1,700 average, small business** | [review] |
| iWorQ and general inspection tools | Checklists, AHJ-side | various | [vendor] |
| Tape, smart level, clipboard | What most surveys actually use | ~$60 | — |
| **This** | Measured survey → barrier list → priced remediation → litigation-grade report | flat, ~$79/mo | — |

**The economics are unusually good.** A single survey is billed at
**$1,700–$4,500**. A tool that saves a solo consultant half a day per survey is
trivially worth $79/month — and unlike most of the ideas in this set, **the
buyer already charges by the survey**, so the ROI arithmetic is one line long.

And once again the category leader does not publish a subscription price.

## The wedge

**A barrier survey is evidence, and evidence has provenance or it is worthless.**

This is the strongest fit for Trueline's core idea of the eight — stronger, in
one specific way, than Trueline itself. A remodeler's wrong dimension costs a
cabinet run. **A barrier survey's wrong dimension gets read out in a deposition.**

So:

- **Every dimension is `measured` or `scanned`, printed on the report.** A
  barrier called out on a scanned number that no tape ever confirmed is an
  expert witness's afternoon.
- **The slope comes off the device's own inertial sensors**, cross-checked
  against the scan geometry, with the disagreement between the two reported as a
  number rather than averaged away — the same move Trueline makes with loop
  closure, which it "reports rather than smooths away."
- **A barrier the surveyor could not reach or could not measure is a marked
  category**, not a silent omission. Today it is a silent omission.
- **Then the money:** each barrier → remediation item → priced off the price
  book → a phased plan the owner can actually execute and budget.

That last step is the whole-job move. Today the survey report ends at "this is
non-compliant," and the owner has to go find someone to tell them what fixing it
costs. **The barrier list and the priced plan are the same document.**

## The four-pattern check

- **A — trusted data.** Litigation-grade, pass/fail against published thresholds,
  currently zero provenance.
- **B — whole job.** Survey → report → remediation pricing → re-inspection are
  all separate and all retyped.
- **C — sensor → money.** LiDAR + inclinometer → clearance and slope → barrier →
  priced remediation → signed report.
- **D — small operator.** A solo accessibility consultant competing against a
  firm charging $2,500–$4,500 a site.

## What gets built

Trueline's geometry, provenance, photos-with-pose, offline capture, price book,
PDF pipeline and report generator carry over nearly intact. The device's motion
sensors give slope. **`docs/v3.md` already plans re-scan and diff — here that
becomes re-inspection after remediation, which is a second billable event on
every job and the retention mechanism.**

New: the checkpoint library — 2010 ADA Standards thresholds, and California's
CBC Chapter 11B where it differs. **This is a large, versioned, jurisdictional
body of rules, and it is the real work.** Smaller than NFPA 25 and better
documented, but not small.

## The gate and the price

- **Free forever** — measure clearances and slopes against thresholds, 1 site.
- **Paid** — barrier list, priced remediation plan, report, re-inspection diff,
  unlimited sites.

**$79/month flat.** One survey a month at $1,700 makes this a rounding error to
the buyer.

## Where it fails, ranked by likelihood

1. **The market may be too small.** *(Most likely.)* CASp is a **California**
   credential, not a national licence [review]. Outside California the buyer is a
   loose population of accessibility consultants, architects and facilities
   people with no register to sell into. **Distribution, not product, is the
   binding constraint** — and this is the idea in the set where I am least able
   to size the buyer population from public sources.
2. **Liability by association.** *(Plausible.)* If a survey done in your app
   misses a barrier and the owner is sued, you will be named. The provenance
   model is a genuine defence — it records exactly what was and was not verified
   — but it must be designed as a defence from the first commit.
3. **Standards maintenance never stops**, and a stale threshold is worse than no
   product.

## The one test that settles it

Take one real CASp or ADA barrier report and reproduce it from the app's data
model, then ask the consultant who wrote it a single question: **"would you
put your name on this version?"** Their hesitation, if any, is the product spec.
