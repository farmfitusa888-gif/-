# 7 — The Part 2 note

**The clinical note for records that a stricter law says cannot be shared.**

Industry: substance use disorder treatment · Buyer: the clinician / small program · Platform: iPhone + Mac

---

## The gap

The AI therapy-notes category is crowded and well funded. It is also, almost
without exception, **metered** [review, 2026]:

| Product | Price | Metering |
|---|---|---|
| Mentalyc | $19.99 (40 notes) / $39.99 (100) / $69.99 (160) / $119.99 (330) | **explicitly by note count** |
| Upheal | $1 per session, **capped at $69/mo** | per session |
| Blueprint | from $29/mo, or $0.99–$1.49 per session | per session option |

Mentalyc's ladder is the metering pattern written out in full: **the price of
the product is the number of humans you helped.** A clinician who takes on more
clients pays more for the privilege of documenting them.

But general therapy notes fail this project's test A — HIPAA permits cloud
processing under a business associate agreement, so cloud is uncomfortable, not
disqualified. **That is why the general category was cut** (see
[`../00-METHOD.md`](../00-METHOD.md)).

**One sub-field is different, as a matter of federal law.**

## Why cloud is disqualified here specifically

**42 CFR Part 2** governs the confidentiality of substance use disorder patient
records, and it is **stricter than HIPAA** [standard]:

- Part 2 **requires written patient consent for most disclosures — including
  disclosures for treatment and payment** — where HIPAA permits those without
  authorisation [review of the regulation].
- The 2024 final rule aligned parts of Part 2 with HIPAA but **preserved
  heightened protections for SUD counselling notes and for legal disclosures**,
  and maintains **strict limits on using SUD records against patients in legal
  proceedings** [review].
- **Compliance with the updated rule was required by 16 February 2026**
  [review] — six months before this research. The category is actively
  re-papering its vendor agreements right now, which is the single best moment
  to arrive.

The population served makes this concrete in a way HIPAA does not: SUD records
are used against patients in custody disputes, criminal proceedings, employment
and immigration matters. The heightened protection exists because the harm from
disclosure is not embarrassment — it is losing your children, your job, or your
liberty. **A clinician telling a patient "this recording never leaves my phone"
is making a materially different promise than one pointing at a BAA.**

## What it is

A phone app that records a session, transcribes on device, and drafts the
clinical note locally. Flat price, **no note limit, ever.**

- **Nothing leaves the device.** No BAA required because there is no business
  associate. For a Part 2 program that is not a marketing line, it is one fewer
  disclosure pathway to document and defend.
- **Consent handling is built into the recording flow**, not bolted on — the app
  will not start recording without a logged consent state, and the note records
  which consent was in effect.
- Every clause of the note is tagged with the passage of session audio that
  produced it. A clinician can defend any sentence in an audit, which is what
  documentation is *for*.
- **It refuses to draft anything a payer would treat as a clinical
  determination** — no diagnosis, no risk level, no level-of-care
  recommendation. It documents what was said and done. Those judgements are the
  clinician's licence, and a model producing them is producing a liability.
- The delete affordance is real: destroy the audio and the note stands alone,
  with the provenance links marked as expired rather than silently broken.

## The innovation

The entire category competes on note quality. **This one competes on the two
things the category structurally cannot offer: a price that does not rise with
your caseload, and a disclosure surface of zero** — and it targets the one
sub-field where the second of those is a federal statute rather than a
preference.

## Money

| Price | Against | Customers for $250k/yr |
|---|---|---|
| $39/mo unlimited | beats Mentalyc's $39.99 **at 100 notes**, unlimited above | 535 |
| $59/mo unlimited | cheaper than Mentalyc Pro, no cap | 354 |
| $79/mo unlimited | above Upheal's $69 cap — a harder sell | 264 |

At $39/mo the message is one line: *the same price as their 100-note tier,
with no limit, and the audio never leaves your phone.*

**535 customers is the highest headline customer count in this set** —
consumer-priced software needs volume, and volume needs marketing. That is the
real weakness here and it is a distribution problem, not a product one.

**The number of Part 2 programs and SUD clinicians in the US was not
established** in this research. It must be before any sizing.

## Risks

- **Crowded, well-funded, established.** Mentalyc, Upheal and Blueprint have
  brand, integrations and content marketing. Being right about metering does not
  get you found.
- **No EHR integration is the practical killer.** These competitors write into
  the EHR. A note in an app that must be copy-pasted is a worse workflow, and
  offline-first with no server makes integration genuinely hard. **This is the
  central product problem and it has no clean answer under the constraints.**
- Lowest price point in the set means the weakest unit economics per customer.
- I have **asserted** that Part 2 makes cloud disqualifying. That is a reasoned
  reading of a regulation, **not a legal opinion**, and it is the load-bearing
  claim of the entire idea.

## The one test that settles it

**Cost: one consultation fee — and this one is not optional.** Put the specific
question to a healthcare attorney who practises Part 2: *does processing SUD
session audio through a third-party cloud vendor under a BAA require patient
consent that on-device processing would not?*

**Decision rule, written first:** if the answer is "a BAA covers it the same as
HIPAA," **this idea collapses into the general therapy-notes category that was
already cut**, and should be abandoned. Everything else here depends on that one
answer. Ask it before writing a line of code.
