# Claimable, the operating plan

Finds the government benefits a low-income older adult already qualifies for,
and files the application. Sold to whoever gets richer when that person is
enrolled. Written 2026-08-31.

Budget assumption throughout: **under $1,000**. Solo operator. No paid ads.
Every channel below is a public file, a free directory, or something published
and given away.

---

## 1. The one-sentence version

**$58 billion a year in benefits goes unclaimed because free screeners hand the
hardest part of the job back to the person least able to do it, so complete the
application instead, prove the enrolment, and bill the hospital, plan or
operator whose economics improved, at $200 a head, 150 a month.**

---

## 2. Why this one is fifth of seven, and why you should not start here

The idea is right. The money is measured and appropriated. The buyer's ROI is
arithmetic rather than persuasion. **And it is still the wrong first move for a
solo operator with under $1,000, for three reasons that have nothing to do with
whether the product works.**

| | Claimable | Countercite (the one to start) |
|---|---|---|
| Buyer known by name and address | **No.** No buyer list pulled. See §3 | Yes — 1,708 Texas individuals, 1,203 Florida firms |
| Time to first dollar | **Months.** Hospital and health-plan procurement | Weeks |
| Cash lag after the work is done | **Adjudication + net-30/60. Possibly 3–5 months** | Card charged on signup |
| Regulatory exposure | **Unresolved, and one question could kill the pricing model** | None |
| Per-case human labour | **The binding constraint. See §5** | Zero — it is software |
| Can a solo operator carry 150/month | **Not established, and doubtful at current assumptions** | Yes |

**Three things make this a second business, not a first one:**

1. **There is a legal question that must be answered before anything is built.**
   Paying a per-head fee to a third party for enrolling patients into a federal
   healthcare programme sits close to the federal Anti-Kickback Statute and to
   state patient-brokering law. I do not know the answer. **Nobody should write
   a line of code for the hospital segment until counsel does.** See §9.
2. **Payment on verified enrolment means you do the work months before you get
   paid.** Under a $1,000 budget that is not a cash-flow inconvenience, it is a
   structural problem, and the fix. A paid pilot fee up front, is an
   [ASSUMPTION] about buyer behaviour that has not been tested.
3. **The brief's own risk note is correct: this is the slowest sales cycle in
   the portfolio.** It probably does not clear a 6–12 month revenue target. §7
   says so with numbers instead of hedging.

### The version of this that *is* available immediately

**Hospital and clinic financial counsellors are Countercite's segment C.**
They do this work by hand today. The eligibility rules engine described below,
sold to them as a monthly software seat instead of billed per enrolment, has:
no adjudication lag, no per-head payment question, no per-case labour on your
side, and a buyer already in another plan in this portfolio.

**That is not a different business. It is the same engine with the risk taken
out.** If the counsel question in §9 comes back badly, this is where Claimable
goes, and the work already done is not wasted.

---

## 3. The customer, with real numbers

### The beneficiary side is the best-measured population in the portfolio

| Figure | Source class |
|---|---|
| Benefits unclaimed by older adults per year | **$58 billion** [NCOA] |
| Older adults SNAP-eligible but not enrolled | **~9 million** |
| Older-adult SNAP participation rate | **~30%** — around **60% of eligible seniors do not enrol** |
| Taxpayers not claiming EITC each year | **~5 million**, worth **~$7 billion** |
| Share of eligible EITC filers not claiming | **~20%**, up to **$8,231** each |
| Dementia caregivers who say coordinating care is stressful | **70%** |
| Dementia caregivers with difficulty finding resources | **66%** |

Against 9 million unenrolled seniors in SNAP alone, **150 enrolments a month is
a rounding error.** Supply of eligible people is not a risk in this business and
should never be treated as one.

### The buyer side is not measured, and that is the honest headline

**I have not pulled a buyer list.** Countercite's plan works because a state
licence file put 1,708 names on the desk. Claimable has no equivalent file
pulled, and every count below is **[NOT ESTABLISHED]**.

| Segment | Why they pay | Count | What would settle it |
|---|---|---|---|
| **Senior housing / assisted living operators** | Resident's ability to keep paying rent *is* the business | **[NOT ESTABLISHED]** | Every state licenses these and publishes the register free — e.g. Texas HHS long-term-care provider search, Florida AHCA facility locator. One afternoon per state, same method as the Texas adjuster file |
| **FQHCs and community health centres** | Patients are precisely this population; they already employ enabling-services staff | **[NOT ESTABLISHED]** | HRSA publishes the health-centre directory free |
| **Hospitals and health systems** | Uninsured bad debt converts to Medicaid reimbursement | **[NOT ESTABLISHED]** | CMS publishes Hospital General Information and the Provider of Services file free on data.cms.gov — name, address, ownership, beds, for every US hospital |
| **Medicare Advantage plans** | Better adherence, lower acute use; social-needs screening is already required of them | **[NOT ESTABLISHED]** | CMS publishes monthly enrolment by contract, plan and state, free |
| **Home care agencies** | Same logic as senior housing, smaller balance sheet | **[NOT ESTABLISHED]** | State home-care licensure registers |
| **Employers, for EITC** | Popular, costs them nothing | — | **Cut. Different population, different season, different sale. It is a distraction from a business that already has too many segments.** |

**Rank them by how fast they can say yes, not by how much they can pay:**

```
Senior housing operator   →  FQHC / clinic  →  Hospital system  →  MA plan
    weeks, one owner          months            6-12 months        12-24 months
    small dollars                                                  large dollars
```

**Start at the left.** A 90-bed assisted living operator has one decision-maker,
no procurement committee, no InfoSec review, and an obvious problem. A Medicare
Advantage plan has all four and a compliance department. The brief's own note
already said this, *"a smaller first customer (senior housing operator, a single
clinic) is the realistic entry"*. And the 90-day plan below takes it literally.

### The ROI argument, and why I am not putting a number on it

The temptation is to write "the average converted Medicaid inpatient admission is
worth $X." **I do not have that number and will not invent it.**

The sales asset is not a number I claim. **It is a one-page calculator the buyer
fills in with their own figures**, their uninsured self-pay volume, their bad
debt write-off rate, their average reimbursement, because a buyer who computes
the answer themselves believes it, and a buyer handed a vendor's average does not.

The only thing to assert is the direction, which is safe: **$200 is trivially
small next to any inpatient reimbursement, any month of assisted-living rent, or
any year of Part B premiums paid by a Medicare Savings Program.** The published
annual Part B premium is the cleanest single figure for that argument, it is
published by CMS each year, it is **[NOT ESTABLISHED here]**, and it should be
looked up and used verbatim rather than approximated.

---

## 4. Positioning

**Claimable finds the benefit, files the application, and proves the enrolment.
You pay when it is confirmed.**

Against what the buyer would otherwise do:

| Alternative | Why they leave it |
|---|---|
| **Their own financial counsellors, by hand** | This is the real competitor and it already exists. Claimable wins on volume per counsellor and on the applications nobody had time to file — never on doing it better than a good counsellor does |
| **A free screener they link from their patient portal** | It produces a "you may qualify" page and a drop-off. **The gap between that page and a submitted application is where the $58 billion actually goes.** This is the whole positioning |
| **A community partner / Area Agency on Aging referral** | Genuinely good, genuinely free, and capacity-limited. Position as complementary and as a referral partner, never as a replacement — see §6 |
| **Nothing** | The honest default, and the most common one |

**The line that does the work:** *a screener tells someone they might qualify.
This files it and shows you the enrolment letter.*

**And the second line, which matters more to a compliance officer than the first:**
*we publish our false-positive rate.* Nobody in this category does. It is the
only defensible claim available and it is the one DoNotPay never bought.

**What we never say:** that we are a certified navigator, a benefits counsellor,
an ACA assister, or an immigration adviser. That we guarantee enrolment. That we
give legal or immigration advice. That we are "AI-powered" as the headline.

---

## 5. Pricing, and the constraint nobody mentions

| Model | Price | To reach $30k/mo |
|---|---|---:|
| Per verified enrolment | $150 | 200/month |
| **Per verified enrolment** | **$200** | **150/month** |
| Per verified enrolment | $400 | 75/month |
| **Pilot fee (proposed)** | **$2,500–5,000 for a fixed cohort of 50 cases** [ASSUMPTION] | — |

**Payment on verified enrolment is the right model and the reason this business
is hard to finance.** It aligns everyone, it makes the buyer's arithmetic
trivial, and it means you do the work now and get paid much later.

### The cash conversion cycle

```
intake → documents → file → agency adjudicates → enrolment letter → invoice →
buyer AP pays
  day 0     +2wk      +3wk        + weeks              + days        + net 30-60
```

The adjudication window is **[NOT ESTABLISHED in this document]**. Federal SNAP
rules set a processing standard measured in weeks, with a shorter expedited
track, and state Medicare Savings Program timelines vary. **Look up the exact
federal SNAP standard and the MSP timeline for your launch state before
modelling cash flow. It is a published rule, it takes ten minutes, and it sets
the entire working-capital requirement of the business.**

[ASSUMPTION] end to end, work-to-cash is **3–5 months**. Against a $1,000 budget
that is the difference between a business and a hobby, and it is why the pilot
fee above is not a nice-to-have. **A buyer unwilling to pay anything up front is
a buyer asking a solo operator to finance their revenue cycle.**

### The constraint that actually caps this business

Not the sale. Not the model. **The human minutes per case.**

Every case needs intake, document chase (proof of income, assets, residency),
filing, and follow-up through adjudication. Some need an interview scheduled.
Assume the software does the eligibility determination and drafts the
application perfectly, a human still touches every one.

| Minutes per case [ASSUMPTION] | Hours/month at 150 cases | Solo operator verdict |
|---:|---:|---|
| 30 | 75 | Workable alongside other work |
| 45 | 112 | Full-time, nothing else |
| 60 | 150 | Full-time and fragile |
| 90 | **225** | **Not possible for one person** |

**So $30k/month at $200 a head is not a sales problem, it is a labour problem,
and it is unsolved until minutes-per-case is measured on real files.** That
measurement is a gate in §7 and a kill criterion in §11.

Three ways out, and they should be chosen deliberately rather than hoped for:
raise price to $400 and halve the volume; push intake onto the buyer's existing
staff and charge only for determination and filing; or automate document
collection and status-checking, which is where computer-use agents earn their
keep and where the build effort belongs.

### Unit economics, per enrolment

| Line | Value |
|---|---|
| Price | $200 |
| Inference and infrastructure | **$3–10** [ASSUMPTION] |
| Human minutes at 45/case, valued at $30/hr | **$22.50** |
| Applications filed per enrolment achieved | **[NOT ESTABLISHED]** — if 3 filings produce 2 enrolments, unpaid work is 50% overhead on every paid one |
| Contribution margin | **Cannot be stated honestly until the line above is measured** |

**That third line is the one to watch.** Payment on outcome means every denial is
work you did for free. A model tuned for precision files fewer, better
applications. Which is also the safety requirement, so precision and margin
push the same direction here. That is a rare piece of luck and the plan leans on it.

---

## 6. Go to market, $0, and specific

### Channel 1, State assisted-living and home-care registers (primary)

Every state licenses these facilities and **publishes the register free**. Texas
HHS long-term-care provider search and Florida AHCA facility locator are the two
to pull first, for the same reason Countercite started with Texas and Florida:
the files are public, downloadable and carry addresses.

**Filter to independent operators of 40–150 beds.** Large chains have procurement.
A single-property operator has an owner who answers email.

**Approach with the resident's arithmetic, not a pitch:** the number of their
residents statistically likely to be eligible-but-unenrolled for a Medicare
Savings Program, and what that is worth to a resident's ability to keep paying.

### Channel 2, HRSA's health centre directory

Free, public, names every FQHC. FQHCs serve exactly this population, already
employ enabling-services and outreach staff, and are mission-aligned in a way
that makes the `.org` domain choice pay off. **Smaller decision loop than a
hospital, larger patient volume than a care home.**

### Channel 3, Publish the false-positive number

**This is the content asset, and it is the only one worth building.**

Nobody in benefits screening publishes accuracy. A short, honest, methods-first
write-up, *"we ran 100 profiles with known outcomes through an eligibility
engine, here is how often it was wrong, and here is the direction it was wrong
in"*. Is publishable to an audience of benefits professionals who have never
seen such a thing.

Target search intents, all low-competition and high-intent:
- "Medicare Savings Program eligibility [state]" · "QMB SLMB QI income limits"
- "hospital financial counselor Medicaid enrollment"
- "senior SNAP application help"

### Channel 4. The professional networks, entered with results rather than a pitch

- **HFMA** (Healthcare Financial Management Association), local chapters, the
  revenue-cycle audience, meetings that cost little and admit outsiders who have
  something to say
- **LeadingAge** and **Argentum**, senior living operator associations
- **NCOA's Benefits Enrollment Center network**, they do this work by hand today
  and are the best available source of ground truth about what a case really costs
- **SHIP** (State Health Insurance Assistance Programs), free counsellors in
  every state, referral partners, and the fastest way to learn where the rules
  actually bite

**These are referral and credibility channels, not sales channels.** One
association newsletter mention reaches more qualified buyers than a month of cold
email. The same logic as Countercite's channel 2, and it works here for the
same reason.

### Channel 5. Area Agencies on Aging and the Eldercare Locator network

Not buyers. **Referrers, and the reality check.** An AAA that will take your
overflow, or send you theirs, tells you more about demand in one call than any
amount of desk research.

### What we are NOT doing

- **No direct-to-beneficiary marketing.** They cannot pay, and a business that
  markets to low-income older adults about money they are owed looks, from the
  outside, exactly like the scams that already target them. Do not go near it.
- **No cold-calling hospital CFOs.** A solo operator with no track record does not
  win that call, and burning the introduction is worse than not making it.
- **No building 50 states.** One state, one programme. See §7.
- **No free screener as a lead magnet.** A screener that tells someone they
  qualify and then does nothing is the exact failure this business exists to fix.

---

## 7. The 90-day plan

### Days 1–10, Answer the legal question before building anything

| | |
|---|---|
| **Goal** | Know whether per-enrolment pricing is lawful for the healthcare segments |
| **Do** | One paid hour with a healthcare regulatory lawyer. Three questions: (1) does a per-head fee for Medicaid/MSP enrolment implicate the federal Anti-Kickback Statute or state patient-brokering law; (2) does the launch state restrict who may be paid to assist with a benefits application; (3) does any of this require ACA navigator or state assister certification |
| **Spend** | **$400–800 — the single best use of the budget in this plan** |
| **Gate** | **If per-head pricing is not clean, do not proceed to §7 day 11. Move the engine to the software-seat model in §2 instead.** |

**This comes first because it can invalidate the business model, and everything
after it assumes an answer.**

### Days 11–40. One state, one programme, graded against ground truth

| | |
|---|---|
| **Goal** | An eligibility engine for **Medicare Savings Programs in one state**, measured |
| **Why MSP** | High dollar value, well-documented rules, single-programme scope, and the population is already sitting in the databases of every buyer in §3 |
| **Do** | Encode the rules. Assemble **100 profiles with known eligibility outcomes.** Run them. Measure false positives, false negatives, and where the errors cluster |
| **Ship** | A published false-positive rate |
| **Spend** | Domain, ~$12. Inference, under $50 |
| **Gate** | **False positives on QUALIFIES verdicts above 2% → stop and fix. Do not file a single real application before this number exists.** |

**The hard input here is ground truth, and it may not be obtainable.** Where do
100 profiles with known outcomes come from? Candidate sources: state-published
eligibility examples and worked scenarios, SHIP and NCOA counsellor training
materials, published case studies, or synthetic profiles graded by a working
benefits counsellor. **If none of these yields a defensible graded set, you cannot
run the gate. And being unable to measure the thing is itself the answer.** That
is written into §11.

### Days 41–70, One paying pilot, not ten customers

| | |
|---|---|
| **Goal** | **One** senior housing operator or FQHC, paying a fixed pilot fee for a 50-case cohort |
| **Do** | Work channels 1 and 2. Show the accuracy number, not a demo. Sit in on the first five intakes yourself |
| **Ship** | One signed pilot, and the first real measurement of minutes per case |
| **Gate** | **If 40 approaches produce zero pilots, the offer is wrong, not the volume. Rewrite once.** |

### Days 71–90. Run cases end to end and count the minutes

| | |
|---|---|
| **Goal** | 30–50 real cases through the whole pipe, to verified enrolment or denial |
| **Ship** | Minutes per case. Filings-per-enrolment. Days from intake to enrolment letter. The first invoice |
| **Gate** | **Minutes per case above 60 → the $30k target is not reachable solo at $200. Reprice to $400, or push intake to the buyer, before selling another pilot.** |

### What month 12 honestly looks like

**Not $30,000/month.** Writing anything else would be the same overselling the
rest of this portfolio refuses to do.

At [ASSUMPTION] one new buyer per quarter after the first pilot, each supplying
[ASSUMPTION] 20–30 verified enrolments a month at steady state, month 12 is
**three or four buyers and 60–120 enrolments a month, $12,000 to $24,000.** And
because payment lags enrolment, **cash collected in month 12 reflects work done
in month 9.**

**$30k/month is a month 15–20 outcome on these dials**, and the way to pull it
left is not more selling. It is one Medicare Advantage plan or one hospital
system that supplies 150 enrolments alone, which is the slowest sale in the
portfolio, which is the whole problem, and which is why this ranks fifth.

---

## 8. Metrics

| Metric | Target | Why it is the one that matters |
|---|---|---|
| **False-positive rate on QUALIFIES verdicts** | **<2%** | Wrongly telling someone they qualify is a harm, not a bug. This is the number that gets published |
| **Applications filed that reach enrolment** | **>70%** [ASSUMPTION target] | Every denial is unpaid work. This is margin and safety at once |
| **Minutes of human time per case** | **<45** | The real cap on the business. See §5 |
| Days from intake to verified enrolment | Track, do not target | Sets working capital |
| Days sales outstanding after invoice | <45 | Under a $1,000 budget this is survival |
| Approach → pilot | >5% | Below this the offer is wrong |
| Buyer's own stated ROI after 50 cases | >10× | Their number, in their words, or it does not count |

**The first two are tracked from case one and published.** That is the direct
lesson of the FTC's DoNotPay order: it was not punished for a bad product, it was
punished for never measuring and advertising anyway.

---

## 9. Legal posture

**What Claimable is:** software that determines eligibility and prepares
applications, operated with a human reviewing every filing, under contract to an
organisation that serves the applicant.

**What it is not, in the terms and on the site:** a certified ACA navigator, a
state-certified application assister, a benefits counsellor, an immigration
adviser, a law firm, or a provider of legal advice.

| Exposure | Handling |
|---|---|
| **Federal Anti-Kickback Statute / state patient-brokering** | **The open question, and the biggest one.** A per-head fee for enrolling patients into a federal healthcare programme is close enough to remuneration-for-referral that it must be cleared before the hospital and MA segments are approached. **Counsel first, day 1–10. If it does not clear, the fee moves to a flat subscription and the engine moves to the model in §2.** |
| **ACA navigator and state assister certification** | Some navigator and assister functions are certified roles under the ACA and state Medicaid rules. **Whether preparing and submitting an application on someone's behalf for a fee requires certification in the launch state is a counsel question and is not answered here.** |
| **SNAP authorized representative rules** | SNAP has a formal designation for someone acting on an applicant's behalf. Confirm the exact requirements and whether a paid third party can hold it |
| **State prohibitions on charging for application assistance** | Some states restrict this. Check the launch state before the first case |
| **Immigrant applicants** | **Hard product rule, not a warning banner: the system refuses to auto-file for any household with a non-citizen member and routes to a licensed immigration referral.** The consequences of a wrong filing here are not financial. This is a refusal, not a caution |
| **PHI and HIPAA** | Any hospital, clinic or plan buyer will require a **Business Associate Agreement**. Have one drafted before the first pilot conversation, not during it |
| **501(r) financial assistance obligations** | Nonprofit hospitals operate under IRS requirements for financial assistance policies — **verify the specifics with counsel**; it is the natural hook for the hospital sale and must be described accurately or not at all |
| **FTC deceptive claims** | No enrolment guarantees. No claim to be a certified counsellor. Accuracy claims backed by the published measurement or not made |

**The precision architecture, because it is a legal control and not just a
product decision.** Three verdicts, and only three:

1. **QUALIFIES**. File it. Requires every rule satisfied on verified inputs.
2. **LIKELY, PENDING VERIFICATION**. Names the two or three specific facts that
   must be confirmed before anything is filed. Never shown to the applicant as
   "you qualify."
3. **DO NOT FILE / REFER**, including every mixed-immigration-status household.

**Precision over recall, permanently.** Missing someone who qualified costs them
a benefit they were already not receiving. Telling someone they qualify when they
do not can cost them a penalty, and for some applicants far worse. **Those two
errors are not symmetric and the product must never treat them as if they are.**

**Budget $1,500–3,000 for counsel** across the day 1–10 question, terms, privacy
policy and the BAA. Treat it as the first real cost of the business, exactly as
Countercite does.

---

## 10. Risks, ranked by what actually kills it

**1. Per-head pricing may not be lawful in the healthcare segments.** Anti-kickback
and patient-brokering exposure would remove the pricing model that makes the whole
idea work. *Mitigation: it is the first ten days of the plan, before any build,
and the fallback in §2 is already specified.*

**2. Work-to-cash is 3–5 months and the budget is $1,000.** You can be right about
everything and still run out of money waiting for a state agency to adjudicate.
*Mitigation: pilot fee up front. An untested [ASSUMPTION], and a first buyer
small enough to pay it from a chequebook rather than a purchase order.*

**3. The sales cycle does not clear the 6–12 month target.** Stated in the brief,
confirmed by §7's honest month-12 number. *Mitigation: enter left-to-right on the
buyer ladder and stop pretending the MA plan is a year-one customer.*

**4. Human minutes per case exceed what one person can carry.** 150 enrolments a
month at 90 minutes each is 225 hours. *Mitigation: measure it in days 71–90,
before scaling anything; automate document chase and status polling first.*

**5. A false positive harms a real person.** *Mitigation: the three-verdict
architecture, the 2% gate, the hard refusal on mixed-status households, and a
human reviewing every filing.*

**6. Rules churn across 50 states and thousands of counties.** *Mitigation: one
state, one programme, and no second state until the first is measured. The cost
of maintaining rules is the reason not to expand on enthusiasm.*

**7. Ground truth may not be obtainable.** If you cannot assemble 100 profiles with
known outcomes, you cannot publish accuracy, and the only defensible claim in the
positioning disappears. *Mitigation: none available in advance. It is a kill
criterion, not a risk to manage.*

**8. Free screeners are entrenched and buyers may believe they suffice.** *Mitigation:
the entire positioning is the gap between "you may qualify" and a filed
application, and it is provable with the buyer's own drop-off data.*

---

## 11. Kill criteria

Written now, while it is cheap to be honest.

| By | If | Then |
|---|---|---|
| Day 10 | Counsel says **per-head pricing is not clean** for healthcare buyers | **Stop this version.** Move the engine to the software-seat model in §2. Do not negotiate with the answer |
| Day 40 | **No graded set of 100 profiles can be assembled** | **Stop.** You cannot measure it, so you cannot honestly sell it, and the only defensible claim is gone |
| Day 40 | **False positives above 2%** on QUALIFIES verdicts | **Stop and fix.** Do not file a real application. Below 5% and falling, one more cycle; above 5%, kill |
| Day 70 | **Zero pilots from 40 real approaches** | Offer is wrong. Rewrite once. A second 40 with no pilot kills the buyer thesis |
| Day 90 | **Minutes per case above 90** | The unit does not work solo. Reprice to $400 and halve the target, or stop |
| Month 6 | **Under 30 verified enrolments a month, or DSO above 90 days** | The cash cycle is beating the business. Convert to the subscription model or stop |
| Month 12 | **Under $10,000/month collected** | The sales cycle is what the pessimistic read said it was. Stop investing time here and put it into the businesses that reached revenue |

**The rule that makes these real: write the number down before the test, and do
not renegotiate it afterwards.**

---

## The honest summary

**The idea is good and the timing is wrong.** The money is measured, the buyer's
incentive is real, the failure of free screeners is documented, and the structural
insight. Route the payment to where the value lands, is correct.

**What is wrong with it is everything downstream of that insight:** the buyer list
is not pulled, the pricing model has an unanswered legal question in front of it,
the cash arrives months after the work, the labour per case is unmeasured and
might cap the business below target, and the buyers who could supply the volume
buy on a timescale a solo operator with $1,000 cannot wait out.

**Start it second. Answer the counsel question first. And if that answer is bad,
this becomes a Countercite segment rather than a business, which is a good
outcome, not a failure.**
