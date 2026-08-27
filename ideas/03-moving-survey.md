# 3 — The binding estimate

**LiDAR inventory of a house → cubic feet → a binding moving estimate the mover
can actually stand behind.**

A moving estimate is a promise about a number nobody measured.

---

## The job today

A mover walks a house, eyeballs the contents, and writes a cube sheet from
memory and habit. That guess becomes a price. If the guess is low the mover eats
the difference or has a fight on the driveway on moving day; if it is high they
lose the job to whoever guessed lower.

**The entire industry runs on an unmeasured number that is contractually
binding.** It is difficult to invent a cleaner fit for Trueline's thesis.

## Where it sits

| Product | What it is | Price | Source class |
|---|---|---|---|
| Yembo | AI video survey → visual inventory → estimate | **not published**; per-survey model | [vendor] / [review] |
| HomeSurvey.ai | Virtual survey, positioned against Yembo | **$20 per survey**, no subscription | [review] |
| SmartMoving | Moving company CRM/ops | **from $399/month flat** | [vendor] / [review] |
| MoveitPro | Moving + storage ops | **$800–$3,000/month** | [review] |
| Movegistics | Moving ops | $1,000–$4,000/month | [review] |
| **This** | Measured inventory → cube → binding estimate → bill of lading | flat, ~$99/mo | — |

**Two structural facts, both exploitable.**

1. **The survey layer meters, the ops layer does not.** Yembo is per-survey;
   HomeSurvey.ai is explicitly **$20 per survey** [review]. A mover doing 60
   estimates a month to win 20 jobs pays for all 60. **The metering is on the
   losing bids.** That is the most punishing meter placement possible, and it
   falls hardest on the small mover with the lowest close rate.
2. **The ops layer starts at $399/month and runs to $3,000** [review] — and it
   does not measure anything. So the small mover pays twice, and the two halves
   share no number.

## The wedge

**Yembo estimates from video. This one measures, and says which is which.**

A video survey infers volume from pixels. LiDAR measures it. The difference is
that a measured sofa has a real dimension and an inferred sofa has a confident
guess — and on a *binding* estimate, the difference between those two is the
mover's margin.

So: scan the room, get the outline and the large items measured. Then the app
does the Trueline move — it hands back **the items worth a tape measure**,
ranked by how much cube they contribute and how uncertain they are, and the
mover types the real numbers. Everything re-solves.

Then the part nobody does: **the estimate prints what was measured and what was
estimated.** A customer disputing a moving bill and a mover defending it are
looking at the same document, and it tells the truth about its own inputs. The
packed-box allowance is an allowance and says so; the piano is measured and says
so.

## The four-pattern check

- **A — trusted data.** A binding contract built on an eyeballed number, with
  no provenance anywhere in the category.
- **B — whole job.** Survey tool + CRM + estimate + bill of lading, all separate,
  all retyped.
- **C — sensor → money.** LiDAR → cubic feet → weight → binding estimate →
  signed bill of lading. This is the most direct sensor-to-money line of the
  eight.
- **D — small operator.** Metering on *losing* bids, plus a $399 floor for the
  ops half.

## What gets built

Trueline's room capture, volume arithmetic, provenance model, price book,
proposal-with-signature and offline sync carry over.

**New:** an item recognition and cube library (sofa, dresser, king mattress →
standard cube), the cube-to-weight conversion, packing materials, and the bill
of lading. **Item recognition is the risk** — but note that it degrades safely:
the app can ask the mover to tap and name items rather than recognise them,
which is slower and still faster than a clipboard. It never needs a model that
works perfectly, because a human is standing there.

## The gate and the price

- **Free forever** — scan, inventory, cube total, 2 surveys kept.
- **Paid** — binding estimate, bill of lading, unlimited surveys, crew sheet.

**$99/month, flat, unlimited surveys.** Against $20/survey, this pays for itself
at five estimates a month, and every estimate after that is free. **Lead with
that arithmetic** — it is the entire sale, and it is aimed exactly at the small
mover the per-survey model punishes.

## Where it fails, ranked by likelihood

1. **Movers do not want an accurate number.** *(Most likely, and the deepest
   risk in the set.)* A binding estimate that is honestly high loses the job to
   a competitor who guessed low. The industry's tolerance for vagueness may be a
   *feature* of how movers win work, not a defect they want fixed. **If that is
   true, no product fixes it.**
   *The tell:* demos land well with operations, and sales says no.
2. **Yembo is funded and entrenched** with major van lines. Atlas Van Lines
   already runs a Yembo-powered estimator [vendor].
3. **The survey is often done by the customer, not the mover** — self-survey is
   one of Yembo's four modes [vendor]. A customer will not measure anything, and
   an app that demands verification cannot be handed to them.

## The one test that settles it

Ask three small movers one question: *"When your estimate is wrong, who pays?"*
If they say the customer, there is no product. If they say they eat it — and
they can tell you roughly how much a year — you have found the budget.
