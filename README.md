# Eight ideas shaped like Trueline

Researched and written 2026-08-27.

Trueline is not "a scanning app." It is a specific shape: **a sensor measures, a
human overrides, the model re-solves around the override, every figure carries
its provenance, and the whole job — not a slice of it — comes out the other end
priced and signed.** Sold flat and unlimited into a field that meters, with no
server behind it.

These are eight other places that shape fits.

**Start with [`ideas/00-OVERVIEW.md`](ideas/00-OVERVIEW.md)** for the scoring and the ranking, then [`ideas/00-METHOD.md`](ideas/00-METHOD.md) — it sets out the gate
every idea had to clear and the sourcing rules. Then read the briefs.

---

## The eight

| # | Idea | Industry | The one-line wedge |
|---|---|---|---|
| [1](ideas/01-templating.md) | **Templating** | Stone / countertop fabrication | A phone template that refuses to export to CNC until a tape has touched every cut edge |
| [2](ideas/02-fire-life-safety.md) | **Fire & life-safety inspection** | Fire protection | Works in the basement; the report says what was tested and what was assumed |
| [3](ideas/03-moving-survey.md) | **The binding estimate** | Household goods moving | The estimate prints what was measured and what was guessed |
| [4](ideas/04-livestock.md) | **The honest weight** | Cattle production | The only one that publishes its error band instead of claiming ±3% |
| [5](ideas/05-range-of-motion.md) | **Range of motion** | Physical therapy / chiro | No server means PHI never reaches infrastructure you own |
| [6](ideas/06-slab-readiness.md) | **Floor prep** | Flooring installation | Doesn't certify the slab — tells you where to put the straightedge, then prices the prep |
| [7](ideas/07-ada-barrier.md) | **Barrier survey** | Accessibility compliance | A survey is evidence, and evidence has provenance or it is worthless |
| [8](ideas/08-prewall-record.md) | **What's behind this wall** | Construction / property | Sells the homeowner a permanent record — a new invoice line, not a cost |

## Scored on the six axes you named

1–5 each. **These scores are my judgement, not a measurement** — they are here to
force a ranking, and the reasoning behind every one of them is in the brief.

| # | Idea | Innov. | Need | Advantage | Build | Creative | Money | **Total** |
|---|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| 7 | Barrier survey | 4 | 4 | **5** | 4 | 4 | **5** | **26** |
| 8 | What's behind this wall | **5** | 3 | **5** | 4 | **5** | 4 | **26** |
| 1 | Templating | 4 | **5** | 4 | **5** | 3 | 4 | **25** |
| 6 | Floor prep | 3 | **5** | 4 | **5** | 3 | 3 | **23** |
| 2 | Fire & life-safety | 3 | **5** | 4 | 2 | 3 | **5** | **22** |
| 3 | The binding estimate | 4 | 4 | 3 | 3 | 4 | 4 | **22** |
| 5 | Range of motion | 4 | 4 | 4 | 3 | 4 | 3 | **22** |
| 4 | The honest weight | 3 | 3 | 2 | 3 | **5** | 2 | **18** |

**Buildability is scored against the Trueline constraint** — solo, iOS + web,
offline, no server, zero marginal cost — not against "could a team build it."

## How much of Trueline each one reuses

The reason several of these score 4–5 on buildability is that Trueline has
already compiled and tested the hard parts. Rough share of each idea already
built, as code in the existing repository:

| Idea | Reuses | Est. already built |
|---|---|---|
| 1 Templating | geometry, solver, angled walls, DXF, carry list, takeoff | **~35%** |
| 6 Floor prep | LiDAR capture, plane fitting, carry list, change order | **~35%** |
| 8 Behind the wall | posed photos, capture, provenance, self-contained client file | **~30%** |
| 7 Barrier survey | geometry, provenance, posed photos, price book, PDF, re-scan diff | **~30%** |
| 2 Fire & life-safety | posed photos, provenance, price book, proposal, invoicing, offline sync | **~30%** |
| 3 Binding estimate | volume, provenance, price book, proposal, offline sync | **~25%** |
| 5 Range of motion | provenance, override-and-re-solve, PDF pipeline | **~15%** |
| 4 Honest weight | volume from depth, provenance, offline | **~15%** |

## The recommendation

**7 — the barrier survey — is the strongest business.** The buyer already bills
**$1,700–$4,500 per survey**, so the return on a subscription is one line of
arithmetic rather than an argument. A barrier survey is read in litigation, which
makes "what was measured versus what was assumed" a professional necessity rather
than a nice-to-have. Its risk is distribution, not product.

**8 — what's behind this wall — is the best idea.** It is the only one of the
eight where the operator **makes** money instead of spending it: a $150–$400 line
item on a job where the walls were already open. That is a far shorter sale than
any subscription pitch, and it is the most defensible of the eight — nobody in
the category has noticed that the person who benefits most is the homeowner, not
the contractor. Its risk is that the value arrives four years late, and latent
value has to be sold rather than bought.

**1 and 6 are the fastest to a working prototype**, and each is gated on a single
unmeasured accuracy figure that one afternoon would settle.

**Do not build 4.** It is the most creative idea here and it is genuinely late —
four phone-based competitors already ship, one using the same sensor.

## Before writing any code

Every brief ends with **one test that settles it**, chosen to cost a day or less
and to be runnable before the first commit. Idea 1's test costs one slab; idea
6's costs one afternoon; idea 8's costs five phone calls.

**Run the test first.** Several of these ideas are gated on an accuracy figure
that does not exist in public sources and was not measured here. Those gates are
named in each brief and listed together in `SOURCES.md`. Running the test is
cheap; building first and finding the sensor cannot hold the tolerance is not.

---

Sources for every figure: [`SOURCES.md`](SOURCES.md). \
The whole set as one print-ready document: [`build/Eight-Business-Ideas.pdf`](build/Eight-Business-Ideas.pdf) — 37 pages.
