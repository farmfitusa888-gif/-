# Innovation — the other side of the algorithm

Researched **2026-08-28**. A standalone project. Nothing here is shared with,
derived from, or compared against anything else in this repository.

---

## The one idea underneath all seven

**Both sides of every transaction were supposed to get automated. Only one did.**

Insurers put **95.2%** of Q1 2026 insurtech funding into AI — and the trade press
notes that wave is aimed at *"infrastructure providers rather than consumer-facing
disruptors."* Meanwhile the five largest home insurers closed **44%** of 2025
claims with no payment, up from 36% a decade ago. Hospitals bill with software;
**80%** of medical bills contain errors. Employers run automated payroll; **$40–60
billion a year** in wages goes missing and **about 1%** comes back. Governments
run eligibility systems; **$58 billion a year** in benefits goes unclaimed.

One side of each of those has software that never sleeps. The other side is a
person doing this for the first time, once, on the worst week of their year.

**That gap is the whole project.** Read [`00-THESIS.md`](00-THESIS.md) first — it
includes the most useful thing found all session: exactly how DoNotPay died, and
the three design rules every idea here inherits from the FTC's order.

## Why this is a business and not a hope

In **every single one** of these markets, a human being already charges a large
percentage to do the job by hand:

| Who | Takes |
|---|---|
| Public adjusters | **10–20%** of the settlement |
| Medical bill negotiators | **10–35%** of savings |
| Property tax appeal firms | **25–50%** of first-year savings |
| IEP advocates | **$75–300/hour** |
| Night nurses | **$35–85/hour** — $10,000–35,000 per family |

**Nobody has to be persuaded that this is worth money. The price is already set
and already being paid.** That is why this version contains no "make five phone
calls to find out if anyone wants it." The wanting is banked; what is unproven is
whether software can do the job, which is a build question.

## The seven

| # | Idea | Status | Who pays | The line |
|---|---|---|---|---|
| [1](ideas/01-paycheck.md) | **The paycheck auditor** | `proven pain · unbuilt` | worker / law firms / unions | $50bn a year is taken, ~1% comes back, because people don't know it happened |
| [2](ideas/02-claim.md) | **The claim advocate** | `proven` | homeowner, on contingency | Reading the policy becomes free, so small claims become worth fighting |
| [3](ideas/03-benefits.md) | **The benefits finder** | `proven` | hospitals & health plans | Screeners tell you that you qualify; this one files the application |
| [4](ideas/04-estimate.md) | **The second opinion** | `proven pain · contested` | drivers, or clubs/insurers | 77% distrust their mechanic and can't prove a thing in the waiting room |
| [5](ideas/05-multiplier.md) | **Arm the advocates** | `proven buyer` | the advocates themselves | Stop competing with the human taking 20% — sell them 5× throughput |
| [6](ideas/06-2am.md) | **The 2am line** | `need proven · delivery is a bet` | family caregivers | 97% want navigation help; the crisis is at night and the helpline is shut |
| [7](ideas/07-night-shift.md) | **The night shift** | `bet` | new parents | A night nurse costs $10–35k; half of what they do at 3am is answer a question |

## Scored

1–5 per axis. **Judgement, not measurement** — the reasoning is in each brief.
"Risk" scores *low risk high*.

| # | Idea | Novelty | Evidence | Money | Build | Channel | Risk | **Total** |
|---|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| 5 | Arm the advocates | 3 | 4 | **5** | 4 | 4 | 4 | **24** |
| 1 | The paycheck auditor | **5** | **5** | 4 | 3 | 4 | 2 | **23** |
| 2 | The claim advocate | 3 | **5** | **5** | 3 | 3 | 3 | **22** |
| 6 | The 2am line | 4 | **5** | 4 | 3 | 3 | 2 | **21** |
| 3 | The benefits finder | 4 | **5** | 3 | 3 | 2 | 3 | **20** |
| 7 | The night shift | 4 | 4 | 4 | 3 | 2 | 1 | **18** |
| 4 | The second opinion | 2 | 4 | 2 | 4 | 2 | 3 | **17** |

## What each needs to hit $30k/mo

Your target band was $20–50k/mo. Midpoint **$360,000/year**:

| # | Idea | Price | To hit $30k/mo | Buyer's payback |
|---|---|---|---|---|
| 2 | Claim advocate | 15% of an $8k uplift | **25 claims a month** | they pay only on winning |
| 5 | Arm the advocates | $299/mo | **101 customers total** | 1–2 billable hours |
| 1 | Paycheck auditor | 25% of recovery | **37 cases a month** | they pay only on winning |
| 7 | Night shift | $99/mo | **304 families** | ~12% of the cheapest human option |
| 6 | The 2am line | $49/mo | **613 families** | 4.7% of what they already spend |
| 3 | Benefits finder | $200/enrolment | **150 a month** | converts bad debt to revenue |
| 4 | Second opinion | $29/check | **1,035 a month** | one avoided upsell |

**None of these needs a large market. Several need about a hundred customers.**

## The call

**Best business: 5 — Arm the advocates.** The least exciting idea here and
probably the right one. **101 customers is the entire target**, the buyer bills
$150–300/hour so payback is under two hours, there is no consumer marketing spend,
no regulatory exposure, and it is the legally clean way to participate in ideas 2
and 4. Its one real unknown — how many such advocates exist — is answerable from
public licence registries in an afternoon at a desk.

**Best idea: 1 — The paycheck auditor.** $50bn a year taken, ~1% recovered, and
the reason given by the researchers is that *people don't recognise their pay is
being shorted.* Everyone else built for victims who already know. This tells
people who don't. I searched for a competitor and found none. It also has the
sharpest problem in the set: a worker shown proof they are owed $4,500 may
rationally choose to keep quiet, and no amount of good software fixes that.

**Strongest money: 2 — The claim advocate.** Thirteen to twenty-five claims a
month is a $360k business, one hailstorm produces thousands of candidates, and
95% of the sector's capital is pointed the other way.

**Don't start with 4.** The pain is real and the space already has a decade of
entrants, plus a press release using the exact statistic as its hook.

**Read 7 before falling for it.** It has the best emotional story and the worst
risk profile — an infant is the proxy user, and the decision rule in that brief is
that a single false negative on an escalation case kills it.

## Read this before believing any number

- **Direct page fetches are blocked** by the network proxy. Every figure here comes
  through a search-engine summary, not from reading the source page.
- **No verbatim complaints.** You named "people complaining at volume" as a proof
  standard; Reddit and similar are unreachable from here. Rather than paraphrase
  posts I have not read, the demand evidence rests on published surveys, government
  and industry statistics, and observable prices. **That is a real gap against your
  brief** and it is the first thing to fill.
- **Several sources sell the thing they are measuring.** Every night nurse rate
  comes from a night nurse agency; public adjuster fees from public adjusting
  firms. Flagged individually in [`SOURCES.md`](SOURCES.md).
- **One load-bearing number is mine:** the $8,000 average claim uplift in idea 2.

Everything unestablished is listed in [`SOURCES.md`](SOURCES.md) under *Figures
deliberately NOT claimed*.

## What I cut, and the lesson in it

[`CUT.md`](CUT.md) has six killed candidates with the evidence — including estate
settlement, which I had written up as the best idea in the set before checking the
market and finding **Alix at $30.65M raised with Schwab and Edward Jones behind
it, and Empathy shipping free through life insurers.**

Five of the six competitive cuts share a shape: a large, well-evidenced pain where
a funded company has **already locked a distribution channel.** In this category
the product is rarely the hard part — the channel is. The seven survivors were
kept disproportionately because their channel is still open.
