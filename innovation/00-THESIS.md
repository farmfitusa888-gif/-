# The asymmetry

Researched 2026-08-28. One idea holds this whole project together.

---

## Both sides of every transaction were supposed to get automated. Only one did.

Look at what the research turned up, all of it from the same eighteen months:

| The institution's side | The person's side |
|---|---|
| **95.2%** of all insurtech funding in Q1 2026 went to AI companies — and "the current wave of insurtech focuses on infrastructure providers rather than consumer-facing disruptors" [review] | The homeowner has a phone and an afternoon |
| **65%** of insurers plan scaled AI agents for claims in 2026; AI claims automation resolves **75% faster** at **30–40% lower cost** [review] | **44%** of 2025 claims at the five largest home insurers closed with **no payment** — up from 36% a decade earlier [review] |
| Hospitals bill with revenue-cycle software | **80%** of medical bills contain at least minor errors [review] |
| Employers run automated payroll | **$40–60 billion** a year in wage theft; **$19 billion** of it unpaid overtime [review] |
| Assessors value property with models | **30–60%** of homes are over-assessed in a given year [review] |
| Government runs eligibility systems | **$58 billion/year** in benefits goes unclaimed by older adults alone [review] |
| Shops price with systems; markups run **25–80%** [review] | **77%** of drivers distrust repair shops [review] |

**Every row is the same story.** One side of the transaction acquired software that
never gets tired, never misses a deadline, and knows the rules exactly. The other
side is a person who has never done this before, is doing it once, and is doing it
on the worst week of their year.

That gap is not a market segment. It is the market.

## Why it is open right now

Three things changed, and all three are recent:

1. **The work is language work.** Reading a denial letter, finding the clause that
   contradicts it, drafting the appeal, tracking the deadline. This is precisely
   what models became good at, and it is why the institutions automated first.
2. **Computer-use agents crossed into usable.** Reliability now runs **70–95%**
   by task type; the best open framework scores **89.1%** on WebVoyager [review].
   The relevant part: they work on systems with **no API** — which is every state
   portal, insurer site and payroll system a person has to fight through.
3. **The intermediary already exists and already has a price.** Public adjusters
   take **10–20%**. Medical bill negotiators take **10–35%**. Property tax appeals
   take **25–50%**. IEP advocates charge **$75–300/hour**. Executors' estates spend
   **$4,000** in legal fees.

That third point is the one that matters most, and it is why this project looks
nothing like the last one. **We do not have to prove anyone wants this. There is
already a human being charging a fifth of the recovery to do it by hand.** The
price is set. The demand is banked. The only question is whether software can do
the job — which is a build question, not a market question.

## The corpse in the room

**DoNotPay** is the famous attempt at exactly this, and it is essential to
understand how it died.

In February 2025 the FTC finalised an order requiring DoNotPay to pay **$193,000**
and to stop advertising that its service performs like a real lawyer without
evidence. A parallel class action settled for **$193,000**. The FTC's finding was
specific and it was not about demand:

> the company **did not test** whether its "AI lawyer" operated at the level of a
> human lawyer, and **did not hire or retain attorneys** to test the quality and
> accuracy of its law-related features [standard — FTC].

Read that carefully. DoNotPay had users, press and revenue. **It did not die
because people didn't want an advocate. It died because it never measured whether
its advocate was any good, and then advertised that it was.** The category's most
visible player discredited itself and left the field open.

So every idea in this project inherits three non-negotiable design rules, taken
directly from that order:

1. **Measure the outcome, always.** Win rate, dollars recovered, error rate —
   tracked from the first customer, because the claim you make in marketing must be
   a number you can produce.
2. **A licensed human where the law requires one.** Not as a disclaimer. In the
   loop, on the file, paid.
3. **Never claim to be the professional.** The product assists, prepares, finds and
   drafts. It does not "replace your lawyer," and it says so.

Those rules cost margin. They are also the entire difference between this category
and a $193,000 consent order.

## What this rules out

Ideas where the pain is real but the money isn't visible, and ideas where a
well-funded company already occupies the ground. Both lists, with the evidence
behind each cut, are in [`CUT.md`](CUT.md) — including two ideas I had written up
before the competitive check killed them.
