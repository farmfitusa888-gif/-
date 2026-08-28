# 3 — The benefits finder

**$58 billion a year goes unclaimed because nobody tells people they qualify.**

`PROVEN — the money is measured` · Buyer: NOT the beneficiary · Form: B2B, paid per successful enrolment

---

## The gap

| Figure | Class |
|---|---|
| Benefits unclaimed by older adults, per year | **$58 billion** [review — NCOA] |
| Older adults eligible for SNAP but not enrolled | **~9 million** [review] |
| Older-adult SNAP participation rate | **30%** — i.e. **60% of eligible seniors don't enrol** [review] |
| Taxpayers who don't claim the EITC each year | **~5 million**, worth **~$7 billion** [review] |
| Share of eligible EITC filers not claiming | **~20%**, leaving up to **$8,231** each [review] |

This is not a story about fraud, scarcity orpolicy dispute. The money is
appropriated. The people qualify. **The benefit simply never reaches them, because
finding out you qualify requires knowing the programme exists, reading the rules,
and completing an application designed by an agency that is not trying to help
you find it.**

Meanwhile the same population is described elsewhere in this research as
overwhelmed: **70%** of dementia caregivers say coordinating care is stressful,
**66%** have difficulty finding resources and support, and **"insurance and
healthcare financing"** and **"legal resources"** each appear in the top ten
things caregivers say they need [review].

## The thing that makes this a business rather than a charity

**The beneficiary cannot pay.** By definition — the whole population is
low-income. Any model that charges them is both morally ugly and commercially
doomed.

But several parties have a direct financial interest in that person being
enrolled, and they can pay:

- **Hospitals and health systems.** An uninsured or underinsured patient enrolled
  in Medicaid or a Medicare Savings Program converts bad debt into reimbursement.
  Hospitals already employ financial counsellors to do exactly this by hand.
- **Medicare Advantage plans.** A member enrolled in a Medicare Savings Program or
  SNAP is a member with better adherence and lower acute utilisation, and
  social-needs screening is already a plan requirement.
- **Senior housing and home care operators**, whose residents' ability to keep
  paying is the entire business.
- **Employers**, for EITC and childcare credits — a genuinely popular benefit that
  costs them nothing but the software.

**This is the structural insight of the idea:** the market failure is not that the
service has no value, it is that the value lands on someone other than the person
who needs the service. Route the payment to where the value lands and it works.

## What it is

A screening engine that takes what is already known about a person — from an
intake form, a hospital admission record, or a five-minute conversation — and
returns **the specific programmes they qualify for, ranked by dollar value, with
the application prepared.**

- **Conversational intake, by voice.** The population is old, often not
  comfortable with forms, sometimes visually impaired. A phone conversation is the
  right interface and is now genuinely possible.
- **Rules across federal, state and county programmes.** Eligibility is a maze of
  income tests, asset tests, categorical eligibility and state options. This is a
  pure rules-engine problem with a large, tedious, valuable surface.
- **The application is filled, not merely recommended.** Telling someone they
  might qualify is what every existing benefits-screener website does, and the
  drop-off between "you may qualify" and a submitted application is where the $58
  billion actually goes.
- **Enrolment confirmed, then billed.** Payment on verified enrolment aligns
  everyone and makes the ROI arithmetic trivial for the buyer.

## The innovation

Benefits screeners exist and are free — and they have not moved the number,
because a screener hands the hardest part of the job back to the person least
able to do it. **This one completes the application and proves the enrolment.**
The billing model — paid by the party whose economics improve — is what makes
that affordable, and it is the part nobody has assembled.

## Money

| Price | To reach $30k/mo |
|---|---|
| $150 per verified enrolment | **2,400/yr — 200 a month** |
| $200 per verified enrolment | **1,800/yr — 150 a month** |
| $400 per verified enrolment | **900/yr — 75 a month** |

A single mid-sized hospital system or one regional Medicare Advantage plan can
supply that volume alone. Against 9 million unenrolled seniors in SNAP by itself,
**75 to 200 enrolments a month** is a rounding error.

## Risks

- **The sales cycle is the problem.** Hospitals and health plans buy slowly, and
  this is the slowest-to-first-dollar idea here. It may not clear the 6–12 month
  bar; a smaller first customer (senior housing operator, a single clinic) is the
  realistic entry.
- **Wrongly telling someone they qualify is a real harm**, not a bug report — a
  denied application can carry penalties and, for some immigrant applicants,
  consequences far worse. Precision matters more than recall here, which is the
  opposite of most products.
- **Rules churn constantly** across 50 states and thousands of counties.
- Some navigator functions are certified roles under the ACA and state Medicaid
  rules; the compliant structure needs checking with counsel before building.

## Where to start — no phone calls required

**Build one state, one programme, and grade it against ground truth.** Medicare
Savings Programs in a single state is the sharpest starting point: high dollar
value, well-documented rules, and a population already sitting in hospital
databases.

The measurement that decides it: **take 100 anonymised profiles with known
eligibility outcomes and measure false-positive rate.** Anything that tells people
they qualify when they don't is worse than nothing, and that is the number to
publish.
