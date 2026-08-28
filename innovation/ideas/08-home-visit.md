# 8 — The home visit

**Documentation that finishes in the driveway, in a house with no signal.**

Industry: in-home social, behavioural and child welfare services · Buyer: the worker, then the small agency · Platform: iPhone

---

## The gap

The documentation burden in in-home social services is the most extreme in this
entire document, and it is measured.

| Figure | Source class |
|---|---|
| Social workers spend **15% of their week face-to-face with clients** | [review] |
| **~400 forms, ~2,500 pages per case**; 40–80 cases handled monthly | [review] |
| Caseworker turnover: **30–40%** | [review] |
| Cost per departure: **70–200% of annual salary** | [review] |
| Texas DFPS estimate per departing caseworker: **$54,000** | [review] |
| **61.6%** of Texas CPS caseworkers agree "even working overtime I cannot finish all of my work" | [review] |
| **64%** of human services leaders say compliance reporting limits time serving families | [review] |

**Fifteen percent.** The other 85% is largely documentation and driving. This is
not an efficiency opportunity; it is a workforce collapsing under paperwork, at
a measured cost of $54,000 every time one of them quits.

The same shape holds in adjacent in-home work. ABA therapy is instructive: RBTs
deliver services in family homes, notes must support the billing, and **"notes
that are vague, missing required elements, or completed days after the session
create audit risk, [with] some payers conduct[ing] retrospective reviews and
recoup[ing] payments if documentation doesn't hold up"** [review]. Getting the
note done *at the house* is worth real money — it is the difference between
getting paid and giving the money back.

## Why cloud is disqualified

Two independent reasons, and the first is physical:

1. **There is frequently no signal.** Rural homes, apartment interiors,
   basements, trailer parks. Cloud dictation fails at the exact moment of use.
   This is the same physical fact that made Trueline offline-first, arriving
   from a completely different direction.
2. The recording contains a **child's disclosure of abuse**, a family's
   psychiatric and substance history, immigration status, addresses of domestic
   violence survivors. Some of it is Part 2 material; some is evidence in a
   criminal matter; nearly all of it is sealed in juvenile proceedings.

## What it is

A phone app for a worker between visits, in the car.

- Speak the visit — on-device transcription with no signal required — and get
  the structured note before starting the engine.
- **Maps one spoken account onto multiple required forms.** The 400-forms
  problem is not that any one form is long; it is that the same facts are
  retyped into a dozen of them. The app extracts facts once and populates every
  form that needs them. **This is the entire product.**
- **Observation and inference are separated and stay separated.** What the
  worker saw, versus what the worker concluded. This is drilled into social work
  training, it is the first thing attacked in a hearing, and no scribe respects
  it because no scribe was built for a document that gets cross-examined.
- **Mandatory-reporting and safety-threshold triggers are surfaced, never
  decided.** If the account contains language matching a statutory threshold,
  the app flags it as *requiring the worker's determination* — it does not make
  one. A model deciding whether a child is safe is the single most
  irresponsible product in this document, and refusing to build it is the point.
- Every field carries whether it was spoken, derived or typed.

## The innovation

Everyone building for this sector sells the agency a case management system —
enterprise software, bought by procurement, hated by workers. **This sells the
worker the twenty minutes in the driveway**, and it works in a house with no
bars because the model is on the phone. One-to-many form population, not
one-to-one dictation, is the mechanism nobody has built.

## Money — and this is where the idea is weakest

| Price | Customers for $250k/yr |
|---|---|
| $29/mo (individual) | 719 |
| $49/mo (individual) | 426 |
| $199/mo (small agency, 5 seats) | 105 agencies |

**Test C is the problem, and it is severe.** A public CPS caseworker will not
buy this personally — they are underpaid, and their employer mandates a state
case management system they must type into anyway. The evidence of pain is
overwhelming and the buyer is wrong. **That is exactly why CPS-sold-to-the-agency
was cut from this set in the method file.**

The idea survives only if aimed at people who are **both in the home and
self-employed or in a small private agency**: private ABA practices, in-home
therapists, private case managers, guardians ad litem, hospice social workers,
contracted foster care agencies. **Whether that population is large enough was
not established, and it is the deciding unknown.**

## Risks

- **The wrong-buyer risk above is the dominant one.** Read the money section as
  the risk section.
- **The state system still has to be typed into.** If the note must be re-keyed
  into a mandated CMS with no import path, the time saving is halved and the
  product is a dictation app with extra steps.
- **Highest liability exposure in the set.** A missed safety indicator in a
  case that ends badly is the kind of failure that ends a company. The
  surface-never-decide rule is the mitigation and it must be absolute.
- The audio is evidence. It is discoverable, subpoena-able, and a subpoena to
  the worker's phone is a scenario the product must have a documented answer for.

## The one test that settles it

**Cost: five phone calls.** Not to CPS caseworkers — the answer there is already
known and it is "my agency decides." Call five **private** in-home providers:
an ABA practice owner, an independent case manager, a hospice social worker, a
contracted foster agency supervisor, a private guardian ad litem.

Ask: *how long after a visit does your note get written, does your system work
with no signal, and who buys your software.*

**Decision rule, written first:** if fewer than three say **they** buy their own
tools, this is an enterprise business and does not belong in this portfolio.
Cut it and move the effort to idea 6, which serves a similar workflow with a
buyer who definitely holds the credit card.
