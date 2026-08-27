# 1 — Trueline for the fabrication shop

**Digital templating for countertops, stair treads and flooring, on a phone
instead of a $25,000 rig.**

A template is the shape of a real, crooked opening, captured accurately enough
to cut stone against it. Get it wrong by 3 mm and you have scrapped a $2,000
slab.

---

## The job today

A small fabrication shop has three options, and all three are bad.

1. **Cardboard and hot glue.** Free, slow, and it warps in a hot truck.
2. **A digital templating rig.** Accurate, and priced like a car.
3. **Subcontract the templating** to somebody who owns a rig, and pay per job
   forever.

The rigs: Prodim Proliner is reported at **$20,000–$45,000** [review], with one
review site putting the common configuration at **$22,000–$30,000** [review].
Laser Products' LT-2D3D — described as the most widely used system in US
countertop shops — is reported at **$18,000–$25,000** [review]. The older LT-55
turns up used at **$3,599–$8,995** [review], which tells you what the second-hand
market thinks a decade-old rig is worth.

**That price is the whole market structure.** A shop doing four kitchens a month
cannot justify $25,000 of capital, so it stays on cardboard, or it subcontracts,
or it does not bid the job.

## Where it sits

| Product | What it is | Price | Source class |
|---|---|---|---|
| Prodim Proliner | Digital templating hardware, stone industry | $20,000–$45,000 | [review] |
| Laser Products LT-2D3D | Laser templating, largest US installed base | $18,000–$25,000 | [review] |
| Laser Products ScanTemplater | Camera/photogrammetry alternative | not published | [review] |
| Flexijet 3D, Leica 3D Disto | Complex 3D work | not published | [review] |
| Polycam, Scaniverse, Scandy Pro | General phone LiDAR, 3D mesh out | ~$150/yr Basic (Polycam) | [review] |
| **This** | Phone template → verified outline → CNC file → priced quote | flat subscription | — |

**The gap, stated precisely.** General phone-LiDAR apps produce a *mesh*. A
fabricator does not need a mesh; they need a **closed 2D outline with exact
lengths and angles, and a seam plan**. Nobody sells the phone-priced version of
the templating job — the search for one returns 3D scanner apps that "aren't
specifically designed for countertop templating workflows" [review].

## The wedge

**A phone is not accurate enough to template a countertop, and that is the
product.**

This is Trueline's argument, transplanted whole. The scan gets the outline and
the rough geometry. Then the app hands back **the four measurements worth a
tape** — ranked, exactly like Trueline's carry list — and the fabricator types
the real numbers. The outline re-solves around them: type the true back-wall
length and the sink cut-out, the overhang and the seam all move with it.

Every dimension exports marked `scanned` or `measured`. **A template with any
scanned dimension on a cut edge will not export to CNC.** The app refuses.

That refusal is the sales demo. Nobody scraps a slab because a tape was wrong.
They scrap it because a number nobody checked looked exactly like a number
somebody had.

## The four-pattern check

- **A — trusted data.** A cut edge is pass/fail at ±1.5 mm. Every general
  scanning app hands over a number with no provenance.
- **B — whole job.** Templating rig → drawing software → quoting → CNC post is
  four things today. Here the square footage that priced the job is the same
  polygon that drives the cutter.
- **C — sensor → money.** Outline → sq ft → priced quote with edge profile and
  cut-out charges → signed → DXF to the saw.
- **D — small operator.** The gate is a $25,000 capital purchase, which is the
  most brutal metering there is: not per-scan, per-*shop*.

## What gets built

Most of it exists in Trueline already:

| Needed | State |
|---|---|
| Exact integer geometry, nanometre lengths | **Built** — `core/` |
| Feet-inches-fractions parsing and formatting | **Built** |
| Provenance model (`scanned`/`measured`/`derived`) | **Built** |
| Re-solve around a typed measurement | **Built** — the rectilinear solver |
| Angled walls held fixed while square ones absorb error | **Built** — exactly what a chamfered counter needs |
| DXF with dimensions | **Built** |
| Ranked "worth a tape" carry list | **Built** |
| Takeoff and price book | **Built** |
| Seam planning, edge profiles, cut-out library | New |
| Slab yield / nesting | New, and the hardest part |

**Realistically 30–40% of this is already compiled and passing tests in
Trueline.** That is the strongest buildability score in the set.

## The gate and the price

- **Free forever** — template, outline, dimensions, 2 templates kept at once.
- **Paid** — CNC export, seam plan, priced quote, unlimited templates.

**$59/month, flat, unlimited.** Above a general scanning app, far below the
$18,000 floor of the alternative. The comparison a fabricator makes is not
against software; it is against a capital purchase they have already decided
they cannot make.

## Where it fails, ranked by likelihood

1. **Accuracy, and it is not close to a footnote.** *(Most likely.)* A
   fabricator's tolerance is roughly ±1.5 mm on a cut edge. **No accuracy figure
   for phone LiDAR templating exists in this research, and none was measured.**
   If the human-verified path cannot hold that tolerance in a real kitchen, this
   is not a product at any price. *The tell:* the first scrapped slab.
2. **Templating is a trade, not a task.** *(Plausible.)* Rig operators are
   trained. A phone that makes templating look easy may produce confident
   amateurs, whose scrapped slabs become your App Store reviews.
3. **The shop with a rig will not switch**, and the shop without one may not be
   a buyer at all.

## The one test that settles it

Template one real kitchen with a phone and the human-verified path. Cut it.
Does it fit? That test costs one slab and about a day, and it decides the whole
idea before a line of the new code is written.

**Do that test before building anything.**
