# Buildout — Idea 7: Barrier survey

**Working name: PLUMB.** Accessibility barrier surveys where every dimension
carries proof of how it was obtained.

---

## 1. The business in one page

**What it is.** An iPad and iPhone app that walks an accessibility consultant
through a building, measures clearances and slopes, checks each against the
governing threshold, and produces two documents off one data set: a barrier
report built to be read in litigation, and a priced remediation plan the owner
can budget from.

**Who pays.** The consultant, not the building owner.

**The wedge.** A barrier survey is evidence. Every dimension in it will
eventually be read by somebody with an incentive to attack it. **No existing tool
records how a number was obtained** — measured with a tape, read off a sensor,
or estimated because the surveyor could not reach. This one marks each, prints
the mark, and refuses to certify a barrier finding that rests on an unverified
number.

**Why the consultant cares more than anyone.** Their name is on the report. The
provenance record is not a feature they like; it is the file they will want the
day somebody questions their work.

**Why now.** Phone LiDAR plus the device's own inertial sensors can capture
clearance and slope together, which is the pair this survey actually needs. That
combination did not exist in a consultant's pocket five years ago.

## 2. Who buys it

**Primary ICP.** The solo or two-person accessibility consultant who performs
barrier surveys as their main business. In California they hold a CASp
certification. Outside California they are ADA consultants, accessibility
specialists, or architects with an accessibility practice.

**Secondary.** Facilities and compliance staff at multi-site operators — retail
chains, school districts, municipalities — who survey their own portfolio.

**Tertiary, and do not chase it first.** Architects doing pre-construction
accessibility review.

### The sizing problem, stated plainly

**The number of accessibility consultants in the United States could not be
established from public sources.** California's Division of the State Architect
publishes a list of certified access specialists; that page was unreachable from
this environment, and no published total was found anywhere else. CASp is a
California credential and **not a national licence** [review], so outside
California there is no register at all.

**This is the single biggest unknown in the buildout, and it is not a research
gap you can wait out — it is the first task.**

| What you need | How to get it | Cost |
|---|---|---|
| CASp count in California | Download the DSA public list at `dgs.ca.gov/casp`, or call the CASp Program directly at the number DSA publishes | An afternoon |
| National consultant count | Count members of the accessibility professional bodies; count firms advertising barrier surveys in the ten largest metros and extrapolate | Two days |

**Do this before writing a line of code.** If the answer is 400 people, this is a
lifestyle tool, not a business, and the correct move is to reposition toward the
multi-site owner instead.

**What is known:** BlueDAG charges **$2,500–$4,500 per site** for done-for-you
surveys [vendor], and a CASp inspection for a small business averages
**~$1,700** [review]. Whoever the buyers are, they bill in four figures per job.

## 3. Product — v1 scope

**The thesis of v1: one surveyor, one site, one report that survives scrutiny.**

### In scope

| Screen | What it does |
|---|---|
| **Site setup** | Address, jurisdiction (which standard governs), building type, photos of the frontage |
| **Capture** | Walk and scan. LiDAR gives room geometry; the device's motion sensors give running slope and cross-slope; the camera photographs with pose attached |
| **Checkpoint run** | The app walks the surveyor through checkpoints by area — parking, path of travel, entrance, restroom, counters. Each has a threshold and a pass/fail |
| **The override** | Every sensor value can be replaced by a typed measurement. Typing one re-solves the geometry around it and flips the mark from `scanned` to `measured` |
| **The refusal** | A barrier finding resting on a `scanned` value cannot be issued. The app lists what still needs a tape, ranked |
| **Barrier list** | Every failure, with its measured value, the threshold it missed, a photo, and its severity |
| **Remediation plan** | Each barrier mapped to a fix, priced off the surveyor's own price book, grouped into phases |
| **Report** | One PDF: findings, evidence, provenance legend, priced plan |

### Explicitly out of v1

Recorded so scope does not creep in silently:

- **Every jurisdiction except two.** v1 ships the 2010 ADA Standards and
  California CBC Chapter 11B. Nothing else.
- **Web/digital accessibility.** A different product with different skills.
- **Multi-surveyor collaboration.** Needs a server.
- **The re-inspection diff.** Ships in v2 and is the second billable event — but
  it needs v1's data format to be right, which is why the format is designed for
  it now.
- **Anything that submits or files.** This produces a document. It never becomes
  the system of record for a legal proceeding.

## 4. Technical architecture

```
┌─────────────────────────── iOS (Swift / SwiftUI) ────────────────────────────┐
│  Capture         LiDAR (ARKit) · CMMotionManager for slope · camera + pose   │
│  Local store     SQLite, file-backed, in the app container                   │
│  Sync            CloudKit private database — the customer's own iCloud       │
└──────────────────────────────────┬───────────────────────────────────────────┘
                                   │  one shared engine, compiled to both
┌──────────────────────────────────┴───────────────────────────────────────────┐
│  core/  (TypeScript, no I/O, no framework)                                   │
│    measure.ts     exact integer lengths — nanometres in bigint, never float  │
│    slope.ts       rise/run as an exact ratio; sensor and geometry cross-check │
│    provenance.ts  scanned | measured | derived | adjusted, on every value     │
│    checkpoints.ts the threshold library, versioned by standard and year       │
│    solve.ts       re-solve geometry around a typed measurement                │
│    price.ts       remediation items → money, in cents                         │
│    report.ts      pure function: (site, findings, prices) → document model    │
└──────────────────────────────────┬───────────────────────────────────────────┘
                                   │
┌──────────────────────────────────┴───────────────────────────────────────────┐
│  web/  (Vite + TypeScript)  — review, edit, print. Static. No backend.        │
└──────────────────────────────────────────────────────────────────────────────┘
```

**Five architectural rules, each with a reason:**

1. **No float touches a measurement.** Lengths in integer nanometres, slopes as
   exact rise/run ratios, money in cents. A survey that reports 1:12.0000001 in
   court is a survey that gets attacked.
2. **The threshold library is data, not code**, versioned by standard and
   effective date. A survey done in 2027 must be re-printable in 2031 against the
   thresholds that governed it. **Store the standard version with the survey.**
3. **The engine is shared, not reimplemented.** One `core/` compiled for the
   phone and the web. Two implementations means two answers.
4. **No server, and it is a legal advantage.** Survey data describes buildings and
   often names deficiencies before an owner has fixed them. Data you never
   receive is data you cannot be compelled to produce or lose in a breach.
5. **Slope is measured twice and the disagreement is reported.** Inertial sensors
   and scan geometry each give a slope. Averaging them hides an error; printing
   the difference is the honest move and is exactly what an expert witness will
   look for.

## 5. Build plan

Estimated in solo weeks. **These are [assumption]s** — they are ranges because
the checkpoint library is the unknown.

| Phase | What ships | Weeks |
|---|---|---|
| **0. Count the market** | The denominator. Not code | 0.5 |
| **1. The engine** | `core/` — measurement, slope, provenance, solver. Tested to the standard of the numbers it produces | 3–4 |
| **2. One checkpoint, end to end** | Restroom clear floor space: capture → threshold → override → refusal → PDF. Proves the whole spine | 2–3 |
| **3. The checkpoint library** | Parking, path of travel, entrance, restroom, counters — 2010 ADA. **The real work** | 4–6 |
| **4. Capture** | LiDAR, slope, posed photos, on-device | 3–4 |
| **5. The report** | Findings, evidence, provenance legend, print | 2 |
| **6. Remediation pricing** | Price book, barrier→fix mapping, phased plan | 2 |
| **7. CBC 11B** | California's deltas over the ADA baseline | 2–3 |
| **8. Field hardening** | Ten real surveys, fix what breaks | 3 |
| | **Total to a sellable v1** | **21–29 weeks** |

**The critical path is phase 3, and it is not a coding problem.** Reading the
standard, deciding what each checkpoint measures and how, and encoding the
thresholds correctly is research work. Budget it honestly or it will eat the
schedule.

## 6. Validate before you build

Three tests, in order. Each can kill the idea. **Total cost: about a week.**

**Test 1 — the denominator.** As §2. If California has fewer than ~800 CASps and
no plausible national multiple gets you past a few thousand consultants,
**stop and reposition to multi-site owners.**

**Test 2 — the report.** Get one real barrier survey report a consultant has
issued. Reproduce it from a paper data model — every field, every finding, every
photo. Then ask its author one question: *"would you put your name on this
version?"* Their hesitation is the spec.

**Test 3 — the slope.** Measure ten real ramps with the device's inertial
sensors and with a calibrated digital level. **A cross-slope threshold of 1:48 is
about 1.19°.** If the phone cannot resolve that reliably, slope must be
tape-and-level entry only, and the product is meaningfully weaker. **No figure
for phone inclinometer accuracy at this tolerance was found or measured.**

## 7. Pricing and packaging

| Tier | Price | What |
|---|---|---|
| **Free, forever** | $0 | Measure clearances and slopes against thresholds, see pass/fail, one site kept. The whole measuring tool |
| **Professional** | **$79/mo · $790/yr** | Barrier list, remediation pricing, the report, unlimited sites |
| **Later: Re-inspection** | +$29/mo | The post-remediation diff. v2 |

**Why $79.** The buyer bills **$1,700–$4,500 per survey** [vendor] [review]. At
one survey a month the subscription is under 5% of a single job's revenue. The
sale is not a price negotiation; it is one line of arithmetic.

**Why the free tier is safe here** — and this is the difference from a
consumer-adjacent tool. A free measuring app is useless to the buyer, because
**the buyer's product is the report**, not the measurement. Free gets them to
trust the numbers. Paid is the only way to get anything they can bill for.

## 8. Unit economics

Base case: **4% monthly churn [assumption]**, Apple 15%, $6,000/month target.

| | |
|---|---|
| Price | $79/mo |
| Net after Apple's 15% | **$67.15** |
| Average customer lifetime | 25 months |
| **LTV** | **$1,679** |
| **Break-even** | **90 customers** |
| New customers/month to hold 90 | 4 |
| Marginal cost per customer | **$0** |

### Sensitivity

| Monthly churn | Lifetime | LTV | Customers for $6k/mo |
|---:|---:|---:|---:|
| 2% | 50 mo | $3,358 | 90 |
| **4%** | **25 mo** | **$1,679** | **90** |
| 8% | 12.5 mo | $839 | 90 |

**Break-even is unchanged by churn — the treadmill is.** At 2% you replace 2
customers a month; at 8% you replace 7. Same revenue, completely different life.

**At 300 customers:** $20,145/month net, ~$242k/year. **At $1M in proceeds Apple's
commission doubles to 30%** [review] — that is roughly 1,240 customers, and the
model should not be run past it without re-checking the rate.

## 9. Go-to-market

**No paid acquisition.** No CAC figure exists for this buyer and inventing one
would be worthless.

### First 10 — by hand, by phone

1. Get the DSA CASp list. It is a public register of exactly your buyer.
2. Call thirty. Not email. **Offer to do their next survey with them, free,
   in person.** You are not selling; you are watching someone work.
3. Ship fixes between visits. The first ten customers should each see something
   they asked for appear.
4. **Charge from the first one.** A free pilot teaches you nothing about whether
   anyone will pay.

### First 100

| Channel | Why it works here |
|---|---|
| **The CASp register** | A published list of your entire California market. Most industries do not have this |
| **CASp continuing education** | Certification requires ongoing education. Being useful in that room reaches the buyer with their professional hat on |
| **The report itself** | Every survey lands on a building owner's desk with your name in the footer. That is distribution the customer pays *you* to perform |
| **Accessibility professional bodies** | Conferences and member directories |
| **Expert-witness adjacency** | Consultants who testify are the ones who care most about provenance. They are also the most credible references |

### The sales script

> *"How do you record which measurements you took with a tape and which you
> eyeballed?"*
>
> — Nobody has a good answer, because no tool asks for one.
>
> *"When somebody challenges a finding two years later, what do you show them?"*
>
> — This is the whole product. Let them arrive at it.

**Never lead with scanning speed.** Every scanning app leads with speed, they
have all heard it, and it is not what the buyer is afraid of.

## 10. Battle card

| Competitor | Their position | Where they win | Where you win |
|---|---|---|---|
| **BlueDAG** | The category software; also sells surveys at $2,500–$4,500/site [vendor] | Established, Title II focus, institutional relationships | They compete with their own customers by selling surveys. You never do. Their subscription price is unpublished; yours is on the page |
| **Tape, level, clipboard** | What most surveys actually use | Free, trusted, no learning curve | Retyping, no provenance record, no priced plan |
| **General scanning apps** | Polycam, Scaniverse | Great meshes | No thresholds, no pass/fail, no report, no provenance |
| **Doing nothing** | The real competitor | Costs nothing today | Only loses when a demand letter arrives |

**The line that does the work:** *BlueDAG sells surveys. We sell you the tool to
sell yours.*

## 11. Legal and risk

**This section is not optional and is worth a lawyer's hour before launch.**

| Risk | Posture |
|---|---|
| **A missed barrier leads to a suit, and you are named** | The provenance record is the defence — it shows exactly what was and was not verified. **Design it as a defence from the first commit**, not retrofitted |
| **Unauthorised practice** | The app never certifies compliance and never issues a legal opinion. It records measurements and compares them to published thresholds. **The consultant certifies. The app reports.** Say this in the product, not just the EULA |
| **Stale thresholds** | Every survey stores the standard version it was run against and prints it. A survey is re-printable years later against the rules that governed it |
| **"CASp report"** | A CASp report has statutory meaning in California. **Do not use the term** unless a California attorney confirms the output qualifies |
| **Insurance** | Professional liability / E&O before the first paying customer |
| **Data** | Surveys describe buildings and their unfixed deficiencies. No server means no breach surface, and say so in the sales conversation — it is a selling point |

## 12. Metrics and kill criteria

**Instrument almost nothing.** Four numbers, collected only from customers who
opt in:

1. **Surveys completed per customer per month** — the usage number that predicts renewal
2. **Percentage of dimensions human-verified** — if it is near 100%, the sensor adds nothing; if near 0%, nobody trusts it
3. **Free → paid conversion**
4. **Month-3 retention** — 43% of SMB losses happen in the first 90 days [review]

### Kill criteria — decide these now, while it is cheap

| Signal | Window | Action |
|---|---|---|
| Denominator under ~2,000 nationally | Week 1 | **Stop.** Reposition to multi-site owners |
| Phone inclinometer cannot resolve 1:48 | Week 1 | Slope becomes manual entry; re-score the idea |
| 10 surveys shipped, no consultant will pay | Month 4 | **Stop.** The report is not the bottleneck you thought |
| Month-3 retention under 60% | Month 6 | Onboarding, not features. Fix or stop |

## 13. The 90-day plan

| Weeks | Focus | Done means |
|---|---|---|
| **1** | Count the market. Slope test. Get one real report | A denominator, a slope accuracy figure, and a spec |
| **2–5** | `core/` — measurement, slope, provenance, solver | Engine tested to the standard of its own output |
| **6–8** | One checkpoint end to end, restroom clear floor space | Capture → override → refusal → PDF, on a phone, in a real restroom |
| **9–12** | Checkpoint library, 2010 ADA, five areas | A real survey of a real small business, done entirely in the app |

**At day 90 you should have walked one real building with one real consultant
and produced one report they would sign.** That is the milestone. Not a feature
count.
