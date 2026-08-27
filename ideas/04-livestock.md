# 4 — The honest weight

**Depth scan of an animal → weight estimate → market-priced lot → consignment
sheet.**

**Read the risk section first.** This is the most contested idea of the eight,
and it is in the set for a specific reason that is not "the space is empty."

---

## The job today

A cattle producer sells by weight. Knowing the weight before the animal is on
somebody else's scale decides when to sell, what to feed, and what a lot is
worth. The instrument for this is a chute scale, reported at **$3,000–$15,000**
[review], and running animals through a chute has a real biological cost —
stressed cattle "can lose up to 5% of body weight during a single weighing
event" [review].

So the small producer does not weigh. They eyeball it, and eyeballing weight is
a skill with a wide and unmeasured error band.

## Where it sits — and this is the problem

| Product | What it is | Claim / price | Source class |
|---|---|---|---|
| CattleWeight AI | Phone **LiDAR** weight estimation | **±3% accuracy**, 15-second scan; launching end of 2025 | [vendor] |
| Luzardo | Smartphone photo → AI weight | contactless, seconds | [vendor] |
| CattleWorth (MJE) | Photo → weight **and market value** | **97% accuracy** | [vendor] |
| Cattle Weight Pro | Tape-measure-assisted estimate | **$1.99 one-time** | [vendor] |
| Marubeni | Trial-launched cattle weight app | — | [vendor] |
| Chute scales (Tru-Test, Avery, AgriEID) | Physical weighing | $3,000–$15,000 | [review] |

**Four phone-based products already exist, one of them already does LiDAR, and
one already does weight-plus-market-value — which was going to be the wedge.**

That is a hard finding and it is stated here rather than buried, because a brief
that omitted it would have been worth nothing.

## Why it is still in the set

**Look at what those vendors are claiming: ±3%. 97%.**

Now read Trueline's own rule, from `docs/BUSINESS.md`:

> **Never lead with accuracy.** There is no measured accuracy figure. The
> research says so in writing: no accuracy claim in it was produced on a device
> we own. Claiming one is the fastest way to be caught.

**Every competitor in this market is leading with an accuracy claim, and I could
find no independent validation of any of them.** Not one published error band by
breed, by body condition, by camera angle, by lighting. "±3%" is a number in
marketing copy.

That is a market of confident claims, and confident claims break on contact with
a real sale barn — where the buyer's scale is the only number that counts and
your app was 40 lb off on a heavy-muscled bull.

**The wedge is therefore the inverse of the category's:** the product that
publishes its own error band, states it per breed and per condition, widens the
band when it cannot see the animal properly, and **refuses to produce a
consignment figure when the band is too wide to sell on.** Plus the whole job —
weight → current market price → lot value → consignment sheet → sale record
reconciled against the actual scale ticket, which is the thing that makes the
error band *real* instead of claimed. Every sale teaches the app what it got
wrong.

That reconciliation loop is the moat. It is also the only honest way anyone will
ever produce a validated accuracy figure in this category.

## The four-pattern check

- **A — trusted data.** Cleanly met, and by inversion: the whole category is
  making unvalidated claims.
- **B — whole job.** Weight, market price, lot composition and consignment are
  separate today. CattleWorth reaches furthest and still stops before the sale
  record.
- **C — sensor → money.** Depth scan → weight → cwt price → lot value →
  consignment sheet.
- **D — small operator.** A $3,000–$15,000 chute scale is a capital gate on a
  30-head producer.

## What gets built

Volume-from-depth, the provenance model, offline-first (cattle pens have no
signal) and the document pipeline carry over from Trueline. The reconciliation
ledger — predicted vs. actual scale ticket — is new and is the core asset.

**The hard part is not the app. It is the validation dataset**, and it cannot be
bought or reasoned into existence. It has to come from producers who scan, sell,
and report the real ticket back. That is a slow cold start with no server to
coordinate it.

## The gate and the price

- **Free forever** — scan, weight estimate with its honest band, herd list.
- **Paid** — market pricing, lot builder, consignment sheets, reconciliation
  history, unlimited animals.

**$29/month.** Agricultural software prices below trade software, and a $1.99
one-time competitor already anchors the low end.

## Where it fails, ranked by likelihood

1. **Four competitors, one funded conglomerate, and you are late.** *(Most
   likely.)* CattleWeight AI already ships the exact capture technology.
2. **The honesty pitch may not sell here.** *(Plausible, and this is the one
   that worries me.)* A producer comparing two apps sees "±3%" next to your
   "±8% on this animal, and I will not give you a number on that one." **The
   honest product looks worse on the shelf.** Trueline has the same problem, but
   sells to a contractor whose signature is on a document — a producer has no
   equivalent forcing function.
3. **Cold start.** The reconciliation loop needs volume to be worth anything, and
   it is worth nothing on day one.

## The recommendation

**Do not build this fourth.** It is here because it clears all four patterns
honestly and it is genuinely creative — but it is the only one of the eight
where a well-funded competitor already ships the same sensor into the same hand.

If it gets built, build it as an **honest-band engine plus reconciliation
ledger**, never as "another cattle weight app," and expect the validation
dataset to take a year.
