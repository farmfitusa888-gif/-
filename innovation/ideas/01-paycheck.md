# 1 — The paycheck auditor

**Most wage theft is never noticed. That is a detection problem, and detection is what machines are for.**

`PROVEN PAIN · UNBUILT SOLUTION` · Buyer: the worker · Form: consumer app + contingency

---

## The gap

| Figure | Class |
|---|---|
| Wage theft, all forms | **$40–60 billion/year** [review] |
| Unpaid overtime alone | **$19 billion/year** [review] |
| Minimum-wage violations, 10 most populous states | **2.4 million workers**, **$8 billion/year**, averaging **$3,300 per worker** [review] |
| Recovered by DOL, state agencies and class actions, 2021–2023 | **$1.5 billion** — across three years [review] |
| Recovered 2017–2020 | **$3 billion** [review] |

Set those side by side. Roughly **$50 billion a year** is taken and roughly
**$500 million a year** comes back. **About 1% is recovered** [derived: $1.5bn recovered over three years against $40–60bn taken per year].

The Economic Policy Institute's explanation of why is the entire product spec:

> Wage theft persists because most victims never report it, enforcement agencies
> lack the staff to pursue every case, and **many workers don't recognize their pay
> is being shorted in the first place.** [review]

For scale: the total taken from workers each year **exceeds all robberies,
burglaries, larcenies and motor vehicle thefts combined** [review].

## Why nobody has built it

Because everyone framed it as a *legal* problem. Employment lawyers take these
cases on contingency and do it well — but a lawyer can only act on a case that
walks through the door, and the EPI finding is that the worker never knows to
walk. **The binding constraint is not representation. It is noticing.**

Noticing is arithmetic against a rulebook: hours worked versus hours paid,
overtime thresholds, off-the-clock time, break rules, misclassification tests,
tip credits, illegal deductions, state-by-state minimums. It is exactly the kind
of tedious cross-referencing a model does perfectly and a tired person does
never.

**I searched for a product that does this and did not find one.** That absence is
this idea's whole thesis and also its main risk — see below.

## What it is

Photograph or forward your pay stub each period. The app knows your state's rules
and your schedule, and it does one thing: **tells you when the number is wrong.**

- **Passive and continuous.** The user does nothing after setup. Most people will
  never have a finding, and that is fine — the ones who do have one have it every
  single pay period, often for years, which is what makes the recovery large.
- **Plain-language explanation with the rule cited.** "You worked 46 hours. You
  were paid 46 hours at straight time. Six of those should have been at 1.5×
  under [rule]. Shortfall this period: $87."
- **The cumulative number is the product.** $87 is ignorable. "$4,500 over
  nineteen months, and it is still happening" is not. Nobody currently computes
  that figure for the person it happened to.
- **A handoff, not a lawsuit.** A complete, evidenced summary the worker can take
  to HR, to the state labour agency, or to an employment lawyer — who takes it on
  contingency because the work of finding and proving it is already done.

## The innovation

Every other product in this space helps someone who already knows they were
robbed. **This one tells people who don't know.** It converts a legal service,
which requires the victim to initiate, into a monitoring service, which does not.
That inversion is the idea, and it is the reason the 99% gap exists.

## Money

Two models, and the second is much better:

| Model | Unit | To reach $30k/mo |
|---|---|---|
| Contingency, 25% of recovery | $825 per successful case (25% of the $3,300 average) | **437 cases/yr — 37 a month** |
| Subscription, $9.99/mo | $120/yr | **3,004 subscribers** |

**But the real buyer is probably neither.** The people most affected — low-wage,
hourly, often immigrant workers — are the least able to pay a subscription. Three
routes where someone else pays:

1. **Employment law firms** pay for qualified leads. This is a mature referral
   market and the leads here arrive pre-evidenced.
2. **Unions** buy it for members as a benefit. A union with 20,000 members is one
   sale.
3. **Contingency on recovery**, taken only on success, which is how every adjacent
   professional in this document already prices.

At 25% contingency, **37 successful cases a month** is the whole target. Against
2.4 million affected workers in ten states, that is not a market-share problem.

## Risks — stated honestly

- **The absence of a competitor might mean I missed one**, or might mean there is
  a reason it fails. Both are possible. I searched and found nothing; I cannot
  prove a negative.
- **Retaliation is the real barrier**, not detection. A worker shown proof they
  are owed $4,500 may rationally decide not to risk the job. **This is the single
  biggest threat to the model** and it is not solved by better software. The
  honest mitigations are anonymity, aggregation across many workers at one
  employer, and routing to agencies rather than confrontation.
- **Getting the pay data is the hard build.** Stub photography is unreliable;
  payroll integrations (ADP, Paychex, Gusto) are the real answer and are gated.
- Rules vary by state and city and change constantly. This is a maintenance
  burden forever, and it is also the moat.

## Where to start — no phone calls required

**Build the rule engine for one state and one violation type: overtime in
California.** Overtime is the largest single category ($19B), California has the
most protective and best-documented rules, and a pay stub is a small structured
document.

Then measure the only number that matters, on real stubs collected from
volunteers: **what fraction of stubs produce a finding, and what fraction of
findings survive review by an employment lawyer.** The FTC's DoNotPay order is
the reason that second measurement is not optional.
