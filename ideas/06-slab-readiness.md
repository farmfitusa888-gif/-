# 6 — The floor prep argument

**Where the floor is out of tolerance, how much leveller it takes, and the
priced change order — before the flooring goes down.**

**This idea was wrong when it was first written, and the correction is the
interesting part.**

---

## The correction, up front

The original idea was: *a phone that produces an ASTM E1155 floor flatness
F-number, replacing an $8,995 profiler.*

**It cannot, and the standard says why.** ASTM E1155 is the accepted method for
quantifying finished slab quality [standard]. Research into automating it
reports accuracy requirements on the order of **±0.5 mm over 5 m** [review].
Phone LiDAR is not within an order of magnitude of that, and **no measured
figure for phone LiDAR against E1155 exists in this research**.

So the honest answer is: **a phone cannot certify an F-number, and any product
claiming it does is lying or has not checked.**

That killed the idea as conceived. What is below is what survived, and it is a
better business than the original.

## The job that is actually worth doing

An LVP or LVT installer's tolerance is not E1155. It is published by the
flooring manufacturer, in these terms:

- **3/16" over 10 feet** [review]
- **1/8" over 6 feet** — "most LVP manufacturers" [review]
- **1/8" over 4 feet** [review]

And the consequence of getting it wrong is specific and expensive: "lippage,
hollow spots, popping seams, or full plank failure within 12–24 months, and
**most manufacturer warranties will be voided**" [review]. Installing over an
out-of-tolerance subfloor "usually becomes a 'pay twice' situation" [review].

**So there is a real, recurring, high-stakes argument on every flooring job:**
is this slab flat enough, whose problem is it, and who pays for the leveller?
Today that argument is conducted with a 6-foot straightedge, a flashlight and
two people's memories, and the installer usually loses it because they have no
evidence.

## Where it sits

| Product | What it is | Price | Source class |
|---|---|---|---|
| Allen Face D-Meter | Floor profiler (E1155-class) | **$8,995** | [review] |
| Dipstick (Face Construction) | The original profiler | not published; "less than some other profilers" | [vendor] |
| Allen Face F-Meter | Rolling profiler | not published | [vendor] |
| Terrestrial laser scan + Geomagic | Scan-to-heat-map workflow | enterprise | [review] |
| Straightedge and a flashlight | What the installer actually uses | $40 | — |
| **This** | Deviation map → straightedge list → leveller quantity → priced change order | flat, ~$39/mo | — |

**Nothing sits between $40 and $8,995.** That gap is the entire business, and the
buyer in it is not a certifying engineer — it is a flooring installer who needs
to win an argument and price a prep.

## The wedge

**The phone does not certify. It tells you where to put the straightedge.**

This is Trueline's carry list — "the four walls worth a tape, ranked" —
transplanted exactly. Scan the floor, get a **relative** deviation map, and the
app hands back the ranked list of suspect locations. The installer puts a real
6-foot straightedge on each, types the real gap, and the map re-solves around
the measured points.

Then the money: measured deviations → volume of self-levelling underlayment at
the required thickness → bags → a **priced floor-prep change order**, with the
deviation map and the photographs attached as the evidence.

Every number marked `scanned` or `measured`. **And the report carries a printed
refusal: this is not an ASTM E1155 test and must not be used as one.** Saying
that plainly is what makes it credible to the people who know the difference —
and there is no downside, because an installer never needed an F-number.

## The four-pattern check

- **A — trusted data.** A relative map that is honest about being relative, in a
  dispute currently settled by memory.
- **B — whole job.** Straightedge → guess the bags → argue → maybe a change
  order. Nothing connects.
- **C — sensor → money.** Deviation → leveller volume → bags → priced change
  order → signed.
- **D — small operator.** A $8,995 instrument the flooring installer was never
  going to buy, for a standard they do not need.

## What gets built

Trueline's LiDAR capture, plane-fitting, exact integer geometry, provenance,
carry list, price book and change-order pipeline. **The change order already
exists in Trueline and is described as the lead sales argument** — here it is
the whole product.

New: relative plane-fit and deviation heat map, simulated straightedge across
an arbitrary span, and leveller volume by depth.

## The gate and the price

- **Free forever** — scan, deviation map, straightedge list, 2 floors kept.
- **Paid** — leveller quantity, priced change order, report, unlimited floors.

**$39/month, flat.** This is a narrow tool and it must be priced like one. It is
also the most plausible **first paid product** in the set, because the job is
small, the argument is universal, and the buyer feels the pain every week.

## Where it fails, ranked by likelihood

1. **Relative accuracy may still not reach 1/8" over 6 feet.** *(Most likely,
   and it is unmeasured.)* Plane-fitting many points can beat single-point
   accuracy — but by how much is **not known and not claimed here**. If the phone
   cannot reliably flag a 3 mm deviation, it cannot even rank where to put the
   straightedge, and there is no product. **Test this before anything else.**
2. **The installer may not want the evidence.** *(Plausible.)* An installer who
   documents an out-of-tolerance slab has to raise it, and raising it can lose a
   job. Some will prefer not to know.
3. **Too narrow to sustain a subscription.** A tool used twice a month gets
   cancelled in the third month. This may want to be a feature of a flooring
   estimating product rather than a product.

## The one test that settles it

Scan one real slab. Straightedge the same slab properly. **Does the app's ranked
list contain the spots the straightedge actually found?** It does not need the
right number — it needs the right *locations*. One afternoon, one slab, and the
idea lives or dies.
