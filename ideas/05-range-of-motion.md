# 5 — The measurement the claim depends on

**Range-of-motion and functional assessment for the solo physical therapist,
chiropractor and hand therapist — measured on device, documented for
reimbursement, and no patient data ever leaves the phone.**

---

## The job today

A physical therapist measures a shoulder with a plastic goniometer, reads it to
the nearest five degrees, and writes it into a note. That number justifies the
plan of care, supports medical necessity, and is what an insurer reads when
deciding whether to pay.

**It is the single most consequential number in the encounter, and it is taken
with an instrument described in the literature as "over 40 years old"** with
known "measurement discrepancies" [review].

Then it gets retyped into the EMR.

## Where it sits

| Product | What it is | Price | Source class |
|---|---|---|---|
| WebPT | PT EMR | **from $99/provider/month**; SMS, telehealth and prior-auth billed separately | [review] |
| Jane App | Multi-discipline EHR/PM | **from $54/month**; $100–150/mo typical for a US PT practice with billing | [review] |
| PT EMR category generally | EMR + billing + outcomes | **$150–$300/provider/month** | [review] |
| Halo | Digital goniometer (hardware) | claims accuracy within 1° | [vendor] |
| GeniusPT, PivotalPT, PhysioMaster | ROM capture apps | various | [vendor] |
| **This** | Measured ROM with provenance → billable documentation → claim-ready note | flat, ~$49/mo | — |

**Two facts that make this a Trueline shape.**

1. **The measurement layer and the money layer are different products.** The ROM
   app measures; the EMR bills; the therapist retypes between them. Same seam,
   same retyping, same eleven-at-night as the remodeler with magicplan and
   Jobber.
2. **The category has a validation problem it admits in print.** "Goniometer
   apps need to be validated as reliable clinical tools before being integrated
   into regular physical therapy practice," and of the apps in a 2014 systematic
   review, **only five are still on the market** [review]. A field littered with
   abandoned measurement apps is a field where nobody trusted the numbers.

## The wedge

**Three things, and the third is the one nobody can copy.**

**1. The vision estimate never overrides the clinician.** On-device pose
estimation gives a fast ROM figure. The therapist's goniometer reading overrides
it and the record re-solves — same rule as a typed wall width. Every value in
the note is marked `vision-estimated` or `clinician-measured`. **An insurer
auditing the chart can see which is which.** No competitor does this, and it is
precisely the thing an auditor cares about.

**2. The measurement lands in the note already billable.** ROM deficit →
documented functional limitation → the note that supports medical necessity.
One artefact, not two products.

**3. No server, and here that is a regulatory superpower rather than a
constraint.** Trueline's zero-marginal-cost architecture — everything on device,
storage in the customer's own iCloud, AI provider off by default — means
**protected health information never transits infrastructure you own.** You are
not a business associate for data you never receive. Every competitor is a
cloud EMR carrying full HIPAA business-associate exposure, breach liability and
the audit burden that follows.

That is the same architectural decision Trueline already made, worth an order of
magnitude more in this industry than in construction.

## The four-pattern check

- **A — trusted data.** A number an insurer relies on, taken with a 40-year-old
  instrument, recorded with no provenance.
- **B — whole job.** Measurement app + EMR + billing, retyped between.
- **C — sensor → money.** Camera pose → measured ROM → documented limitation →
  claim.
- **D — small operator.** $99–$300 per provider per month, with the category's
  own reviewers saying that for a 1–5 provider clinic "the complexity and cost
  often outweigh the benefits" [review].

## What gets built

The provenance model, the override-and-re-solve pattern, offline-first, the PDF
pipeline and the document generator carry over. Apple's Vision framework does
on-device body pose; no server, no API, no per-patient cost.

**Deliberately not built: billing submission.** Clearinghouse integration is a
server, a per-claim cost and a compliance surface. This produces the
**documentation**; it does not become an EMR. That boundary is the same one
Trueline draws with Plumbline — a clean seam rather than a swallowed scope.

## The gate and the price

- **Free forever** — measure ROM, track a patient's progress, 2 patients kept.
- **Paid** — note generation, export, unlimited patients, re-assessment
  comparison.

**$49/month per clinician, flat.** Half of WebPT's starting price, and it is not
trying to be WebPT.

## Where it fails, ranked by likelihood

1. **Clinical validation is the entire product and it is expensive.**
   *(Most likely.)* Selling a measurement into a clinical record means somebody
   will ask for the validation study. **No accuracy figure for on-device pose
   estimation against goniometry exists in this research and none was measured.**
   The literature's own verdict is that these apps need validating first.
2. **Regulatory classification.** *(Plausible, and it is a hard stop if it
   lands.)* A measurement used in diagnosis or treatment planning can be
   regulated as a medical device. The honest position — this reports the
   clinician's measurement and marks its own estimates as estimates — is a
   better place to stand than most, but it is not a legal opinion and one should
   be obtained early.
3. **Therapists already own a goniometer, and it costs $12.** The sale is the
   documentation, never the measurement. Lead with the wrong half and lose.

## The one test that settles it

Sit with one solo PT for one afternoon. Time how long ROM documentation takes
per patient, times patients per day, times days. **If it is under fifteen
minutes a day there is no budget here**, however good the product is.
