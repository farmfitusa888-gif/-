# 7 — The night shift

**A night nurse costs $10,000–35,000. Most of what they do at 3am is answer a question.**

`BET — pain proven, product unproven` · Buyer: new parents · Form: subscription

---

## The gap

| Figure | Class |
|---|---|
| Night nurse / newborn care specialist | **$35–85/hour** [review] |
| Average night nanny rate | **$43/hour**, most between $25–70 [review] |
| Typical family total spend | **$10,000–35,000+** over **8–16 weeks** [review] |
| Three nights a week, 8 hours, at $45/hr | **$1,080/week** [review] |

That is a service priced entirely out of reach for almost everyone, paid
out-of-pocket, in the most financially fragile month a household will ever have.

And the stakes are not comfort. The published consequence of the sleep
deprivation this addresses: **higher rates of postpartum mood disorders, delayed
physical healing, impaired cognitive function and decision-making** [review].
Well-rested parents are described as *"more responsive to feeding cues"* and
better able to care for older children [review].

## The honest framing

**An AI cannot hold a baby.** That is not a limitation to be engineered around;
it is the actual job for a large part of the shift, and any product pretending
otherwise is the DoNotPay error repeated with an infant in the room.

But the night nurse's work has two halves, and only one of them requires hands:

1. **Doing** — feeding, changing, settling, so the parent sleeps.
2. **Knowing** — is this rash normal, is this breathing normal, is this cry
   hunger or pain, is 4 hours between feeds too long at this age, is this amount
   of spit-up a problem, do I wake the paediatrician.

**The second half is where the terror lives**, and it is the half that keeps
parents awake even when the baby is asleep. It is also the half a very good
information product can genuinely serve.

## What it is

A voice line and app for the fourth trimester that **knows your specific baby** —
birth weight, gestational age, feeding method, the log of the last 72 hours — and
answers the 3am question in fifteen seconds without turning on a screen.

- **Voice, hands-free, in the dark**, because the parent is holding a baby.
- **Answers grounded in the baby's own log.** "Is this too long between feeds" has
  a different answer for a 36-week baby at day 9 than for a term baby at week 6.
  A generic search cannot know that; this can.
- **The pattern report**, which is the sleeper feature. Parents cannot see their
  own week. A calm summary — what actually changed, what is normal drift, what to
  raise at the two-week visit — is worth more than any single answer.
- **Screens the parent, not just the baby.** Postpartum mood disorder risk is the
  documented consequence in the source above. A service that talks to a mother
  every night at 3am is uniquely placed to notice, and it should — with a warm
  handoff, never a diagnosis.
- **Escalation is absolute and conservative.** Breathing, colour, fever in a
  newborn, dehydration signs, lethargy: emergency services or the paediatric line,
  immediately, every time, no cleverness.

## The innovation

The category sells either **a $10,000 human** or **a free forum full of strangers
guessing.** There is nothing in between, and the gap is enormous: the information
half of a night nurse's value, at a price a normal family can pay, available on
the first night home rather than after a two-week booking.

Reframing "night nurse" as two separable products — hands and knowledge — and
selling only the half that scales is the move.

## Money

| Price | To reach $30k/mo | vs. the human |
|---|---|---|
| $79/mo | **380 families** | 1.8 hours of a night nurse |
| $99/mo | **304 families** | 2.2 hours |
| $149/mo | **202 families** | 3.3 hours |

At $99/mo, a full year costs **$1,188 — about 12% of the cheapest end of the
$10,000–35,000 human option**, and roughly one night of coverage.

**Around 300 families.** US births run into the millions annually; this needs a
number of customers you could fit in a school hall.

## Risks — the highest-liability idea in this set

- **An infant is the user's proxy, and the downside is unbounded.** Every other
  idea here risks money. This one risks a baby. That asymmetry should govern every
  product decision and it is why escalation must be tuned to be annoying.
- **Regulatory exposure is genuine.** The line between infant care information and
  medical advice is thin, and paediatric advice is the wrong place to discover
  where it is. **This one needs a healthcare attorney before it needs an
  engineer**, and possibly a paediatrician on staff, not on a landing page.
- **Trust at 3am must be earned before 3am.** A parent will not ask an unfamiliar
  service whether their baby is breathing correctly.
- **Short lifecycle** — the acute need is 8–16 weeks, so churn is structural.
  Extending into the first year is the obvious answer and dilutes the wedge.
- Competitors exist adjacent (sleep training apps, Huckleberry and similar), and
  paediatric telehealth is one product decision away from this.

## Where to start — no phone calls required

**The gating question is not "do parents want this" — the $10,000–35,000 spend
already answers that. It is whether the answers are safe.**

Build the escalation classifier first, before any conversational product, and
grade it against **200 real newborn questions with paediatrician-graded correct
answers**, drawn from published parenting-question corpora and paediatric triage
protocols, which exist precisely because nurse phone lines already use them.

**The decision rule: any false negative on an escalation case kills the idea.**
Not "counts against it" — kills it. That is the standard this specific product has
to meet, and it is worth knowing whether you can meet it before falling in love
with it.
