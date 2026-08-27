# Shared assumptions, and the sizing that reorders the list

Everything in the five buildouts rests on the numbers below. They are here once
rather than five times, so that changing one changes all five.

---

## 1. The finding that changes the order

The briefs ranked ideas on judgement. Sizing the markets changes the answer,
because **break-even is not a number of customers — it is a share of a market**,
and these five markets differ by a factor of twenty-one.

Assuming $6,000/month net personal target, Apple's 15% commission, and 4%
monthly churn:

| # | Idea | Buyers in US | Price | Break-even customers | **Share of market needed** |
|---|---|---:|---:|---:|---:|
| 2 | Fire & life-safety | 19,845 | $89 | 80 | **0.40%** |
| 8 | Behind the wall | 127,394 | $49 | 145 | **0.11%** |
| 6 | Floor prep | 13,108 | $39 | 181 | **1.38%** |
| 1 | Templating | 5,951 | $59 | 120 | **2.02%** |
| 7 | Barrier survey | **unknown** | $79 | 90 | **cannot be computed** |

**Prices above are the ones the briefs proposed.** Idea 1's buildout revises its
price from $59 to $119 precisely *because* of the 2.02% figure in this table — at
$119 it needs 60 customers, or 1.01%. The workbook uses the revised $119.

**Idea 1 needs eighteen times the market penetration idea 8 does.** Two percent
of every countertop shop in America is not an impossible number, but it is a
different kind of business from one-tenth of one percent of remodelers — it
needs near-total category awareness, and it has no room for a niche.

**Idea 7's denominator could not be established.** California's DSA publishes the
CASp list; the page is not reachable from this environment and no published count
was found. **That is not a gap in the research, it is the risk itself** — a market
you cannot count is a market you cannot forecast, and the buildout says what to
do about it before anything is built.

### What this does to the ranking

| Was | Now | Why |
|---|---|---|
| 7, 8, 1, 6, 2 | **8, 2, 7, 6, 1** | 8 has the largest denominator and the shortest sale. 2 needs the smallest share of its market and has structural retention. 7 is unquantified until you count it. 1 is a good product in a market that may be too small to carry it alone. |

The five buildouts are written in your order. **The recommendation at the end is
in this one.**

## 2. Market sizes

| Market | Count | Source |
|---|---:|---|
| Residential remodelers (NAICS 236118) | 127,394 businesses / 127,824 establishments (2020 Census) | [review] |
| Fire protection & security system installation contractors | 19,845 businesses; $22.1bn industry, 2026 | [review] IBISWorld |
| Flooring contractors (NAICS 238330) | 13,108 active companies, ~77,869 employed | [review] SICCODE |
| Countertop manufacturing | 5,951 (2024) / 5,967 (2025); $22.0bn market | [review] IBISWorld |
| Stone fabrication establishments (broader definition) | 8,694 with ~100,000 workers (2018) | [review] *Am. J. Industrial Medicine* |
| Certified Access Specialists (CASp), California | **not found** — DSA publishes a list; no count located | — |

**A note on these counts.** Establishment counts include every size of business,
and most of these industries are dominated by very small firms — countertop
manufacturing is described as "highly fragmented with no companies holding a
market share greater than 5%" [review]. That fragmentation is good for a
flat-priced tool and bad for any strategy that depends on landing a few large
accounts.

## 3. Platform economics

| | |
|---|---|
| **Apple commission** | **15%** under the App Store Small Business Program, for developers with up to **$1M in proceeds** in the prior calendar year, and for developers new to the App Store [vendor]. |
| **The threshold is on proceeds, not gross** — what Apple paid you, after commission and certain taxes [review]. | |
| **Crossing $1M** | Standard commission applies to future sales; you re-qualify the year after proceeds fall back under $1M [review]. |
| **Enrolment** | App Store Connect; approval roughly 15 days after fiscal-month end [review]. |
| **Marginal cost per customer** | **$0.** No server, no storage, no per-seat third-party service. This is the single most important number in every model below. |

**One thing to verify rather than assume.** Billing on the web instead of through
in-app purchase would replace Apple's 15% with a card processor's ~3%, and on
$89/month that is roughly $10.70 a month per customer. App Store rules on
external purchase links have been in active legal flux, and **nothing in this
research establishes what is currently permitted.** Treat web billing as a
question for a lawyer before launch, not a line in the model. Every figure below
assumes the full 15%.

## 4. Churn, and the assumption that decides everything

| | |
|---|---|
| SMB SaaS monthly churn, industry benchmark | **3–5%**, with 3–8% also reported [review] |
| Under 3%/month is considered solid for SMB | [review] |
| **43% of SMB customer losses occur in the first 90 days** | [review] |

**Base case throughout: 4% monthly churn** — mid-range, and an **[assumption]**
in every model. At 4% the average customer lasts 25 months. At 8% they last 12
and half the business is replacing last year's customers.

That 43%-in-90-days figure is the most actionable number in this document. It
means **onboarding is not a polish task, it is the retention strategy**, and every
buildout below treats first-job success as a product requirement rather than a
support function.

## 5. The standard model

Applied identically to all five:

```
net per customer per month  = price × 0.85          (Apple's 15%)
lifetime months             = 1 ÷ monthly churn
LTV                         = net per month ÷ monthly churn
break-even customers        = monthly target ÷ net per month
new customers needed/month  = existing customers × monthly churn
```

**Monthly target: $6,000 net.** Change it in the spreadsheet and every figure
moves.

## 6. What is deliberately not modelled

Recorded so a gap is not later mistaken for an oversight:

- **Customer acquisition cost.** No CAC figure appears in these buildouts because
  none was measured and none was found for these specific trades. Every
  go-to-market section below is built on **direct, unpaid channels** for exactly
  that reason — trade associations, distributor relationships, forums, and the
  phone. Paid acquisition is not modelled and should not be attempted until a
  real CAC exists.
- **Support cost.** Assumed zero, which is wrong. At 100+ customers it is a real
  fraction of a person.
- **Any revenue that requires a server.** Hosted links, team seats, and shared
  archives are named where relevant and excluded from every model.

## 7. What the model says once you run it

The workbook (`build/Five-Business-Models.xlsx`) projects 24 months at an assumed
sales rate. Running it produced one result worth more than the rest of the
arithmetic combined.

**Steady state = new customers per month ÷ monthly churn.** It is the ceiling a
given sales rate can ever reach. Beyond it, every new customer is cancelled out
by one leaving.

| Idea | New/mo [assumption] | Churn | **Steady-state ceiling** | Break-even | Verdict |
|---|---:|---:|---:|---:|---|
| 2 Fire & life-safety | 3 | 2.5% | **120** | 80 | Clears comfortably |
| 1 Templating | 3 | 4% | **75** | 60 | Clears |
| 7 Barrier survey | 4 | 4% | **100** | 90 | Clears, narrowly |
| 8 Behind the wall | 6 | 4% | **150** | 145 | Clears, barely |
| **6 Floor prep** | **7** | **4%** | **175** | **181** | **Never breaks even** |

**Floor prep, at seven new customers every month forever, never reaches
$6,000/month.** Churn eats it first. It is the only one of the five where the
assumed sales rate cannot reach the target at any point in time — and it is the
idea whose churn is most likely to be *worse* than the 4% assumed, because it has
the lowest usage frequency.

**None of the five reaches break-even inside 24 months at these sales rates.**
That is not a reason to abandon them; it is a correction to the timeline. Reaching
$6,000/month net is a **two-to-four year** project at these rates, not a
twelve-month one. If that is too slow, the dial to move is **price**, not effort:
idea 1 needed 120 customers at $59 and needs 60 at $119.

**Three consequences, and they change what to do:**

1. **Floor prep should not be built standalone.** Bundle it — flatness plus
   moisture plus takeoff, at a higher price and higher frequency — or skip it.
   The model says the standalone version is arithmetically unable to get there.
2. **Sales rate is the binding constraint everywhere, not product quality.**
   Every one of these clears break-even eventually except floor prep; what none of
   them do is clear it *quickly*. Time should go to distribution, not features.
3. **Price is underused across the board.** Every one of these buyers is compared
   against a four-or-five-figure alternative. These prices were set conservatively
   and the model says conservatism is expensive.

**All of this rests on assumed sales rates.** Change the `New customers / month`
column on the Dials tab and every one of these conclusions can move.
