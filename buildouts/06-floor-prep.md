# Buildout — Idea 6: Floor prep

**Working name: FLATLINE.** Find the high and low spots, quantify the leveller,
price the prep, win the argument.

**This idea was rewritten once already.** The original — a phone that produces an
ASTM E1155 F-number — is impossible, and §1 says why. What survived is narrower
and better.

---

## 1. The business in one page

**What it is.** A flooring installer scans a slab or subfloor before installing.
The app produces a relative deviation map, ranks the spots worth a straightedge,
takes the real gaps the installer measures, computes how much self-levelling
underlayment the floor actually needs, and produces a priced floor-prep change
order with the map and photos attached as evidence.

**Who pays.** The flooring installer or contractor.

**The correction, stated up front.** ASTM E1155 is the accepted standard for slab
flatness [standard], and automating it requires accuracy on the order of
**±0.5 mm over 5 m** [review]. **A phone cannot reach that, and any product
claiming an F-number from a phone is wrong.** The app therefore prints a refusal:
*this is not an ASTM E1155 test and must not be used as one.*

**Why that refusal costs nothing.** An installer never needed an F-number. They
need to know whether this floor meets the flooring manufacturer's tolerance, and
who is paying to fix it.

**The real tolerances**, which are what the product is actually built against:

| Tolerance | Source class |
|---|---|
| 3/16" over 10 feet | [review] |
| **1/8" over 6 feet — "most LVP manufacturers"** | [review] |
| 1/8" over 4 feet | [review] |

**The stakes.** Installing over an out-of-tolerance subfloor produces "lippage,
hollow spots, popping seams, or full plank failure within 12–24 months, and most
manufacturer warranties will be voided" [review]. It "usually becomes a 'pay
twice' situation" [review].

**So there is a real, recurring, expensive argument on every flooring job — and
the installer currently loses it because they have no evidence.**

## 2. Who buys it

**Primary ICP.** The 1–10 person flooring installation contractor doing LVP, LVT
and engineered wood in residential and light commercial.

| | |
|---|---|
| Flooring contractors (NAICS 238330), US | **13,108 active companies**, ~77,869 employed [review] |
| Break-even customers at $39/mo | **181** |
| **Share of market required** | **1.38%** |

**Secondary.** General contractors and remodelers who sub out flooring and get
billed for prep they cannot verify — they are the *other* side of the same
argument and may value it more.

**Tertiary.** Concrete contractors, who want to prove their slab *was* in
tolerance when they left.

**That third group is strategically interesting**: the same scan settles the
argument from both sides, which means the market is bigger than the flooring
count alone — but it is also a conflict, and v1 should pick one side and serve it
properly.

## 3. Product — v1 scope

**Thesis: scan a floor, know where to put the straightedge, price the prep.**

### In scope

| Screen | What it does |
|---|---|
| **Job setup** | Room, flooring product, the tolerance that product requires |
| **Scan** | Walk the floor. LiDAR builds a point set; the app fits a reference plane |
| **Deviation map** | A heat map of relative highs and lows. **Relative, and labelled as such** |
| **The straightedge list** | Ranked suspect locations — *"put a 6-foot straightedge here, and here"* — as an on-screen list and a printable card |
| **Measured entry** | The installer types each real gap. The map re-solves around the measured points |
| **Verdict** | Pass or fail against the product's own tolerance, with the failing spans listed |
| **Leveller quantity** | Volume by depth over the failing areas → bags, with waste factor |
| **Change order** | Priced prep, with the map, the measured gaps, and photos attached |
| **The refusal** | Printed on every output: not an ASTM E1155 test |

### Explicitly out of v1

- **Any F-number or E1155 claim.** Permanently, not just in v1.
- **Moisture testing.** A different instrument entirely — but it is the natural
  second product for this buyer.
- **Grinding / high-spot removal quantities.** v1 does fill; v2 does grind.
- **Elevated slabs and deflection.** Slab-on-grade and wood subfloor only.

## 4. Technical architecture

```
┌──────────── iOS (Swift / SwiftUI) ─────────────┐
│  ARKit LiDAR point capture · guided walk path  │
│  SQLite · CloudKit private DB                  │
└────────────────────┬───────────────────────────┘
┌────────────────────┴───────────────────────────┐
│  core/  (TypeScript)                            │
│   plane.ts      robust reference-plane fit      │
│   deviation.ts  per-point signed deviation      │
│   span.ts       simulated straightedge over any │
│                 span — the core primitive       │
│   rank.ts       suspect locations, ranked       │
│   solve.ts      re-fit around measured gaps     │
│   volume.ts     fill volume by depth → bags     │
│   price.ts      prep → cents → change order     │
└─────────────────────────────────────────────────┘
```

**The one algorithm that matters.** `span.ts` simulates laying a straightedge of
arbitrary length anywhere on the surface and reports the maximum gap beneath it.
That is precisely what the tolerance is written in terms of — *1/8" over 6 feet* —
so the product's core primitive should match the specification's own language.

**Why relative accuracy might work where absolute does not.** Fitting a plane
across thousands of points can resolve relative deviation better than any single
point's absolute accuracy. **By how much is unknown, unmeasured, and is the whole
risk.** See §6.

## 5. Build plan

| Phase | What ships | Weeks |
|---|---|---|
| **0. The slab test** | The accuracy answer | 0.5 |
| **1. Engine** | plane fit, deviation, span simulation, ranking | 3 |
| **2. Capture** | Guided walk, point capture, on-device | 2–3 |
| **3. Map + straightedge list** | Heat map, ranked list, printable card | 2 |
| **4. Measured entry + re-solve** | Type the gap, re-fit | 1.5 |
| **5. Leveller volume** | Depth → volume → bags with waste | 1.5 |
| **6. Change order** | Price book, evidence attachment, PDF | 2 |
| **7. Field hardening** | Ten real floors | 2.5 |
| | **Total to sellable v1** | **15–16 weeks** |

**Fastest build of the five.** Narrow scope, no standards library, one algorithm.

## 6. Validate before you build

**Test 1 — the ranked list. One afternoon, one slab.**

Scan a real slab. Then straightedge it properly, by hand, across a grid.

**The question is not whether the app gets the right number. It is whether the
app's ranked list contains the spots the straightedge actually found.**

- If the top 10 ranked locations include the real problem spots → **the product
  works**, even if the magnitudes are off, because the human measures the
  magnitude.
- If the ranking is uncorrelated with reality → **stop.** There is nothing here.

**Test 2 — resolution.** Can it detect a **3 mm** deviation at all? That is
1/8", the governing tolerance. Place known shims and see. **This figure is
unmeasured and unfound.**

**Test 3 — will they document it?** Ask ten installers: *"if you could prove the
slab was out of tolerance before you started, would you use it?"* Listen for
hesitation. **Some installers do not want the evidence**, because documenting a
bad slab means raising it, and raising it can lose the job. That reluctance is
risk #2 in §12 and this test is how you size it.

## 7. Pricing and packaging

| Tier | Price | What |
|---|---|---|
| **Free, forever** | $0 | Scan, deviation map, straightedge list, 2 floors kept |
| **Pro** | **$39/mo · $390/yr** | Leveller quantity, priced change order, report, unlimited |

**Why $39 and not more.** This is a narrow tool used a few times a month. Pricing
it like a platform gets it cancelled in month three. **The honest risk is that
$39 is still too much for a tool used twice a month** — see §12.

**The bundle question, and it is the important one.** A flooring installer would
plausibly pay $79 for *flatness plus moisture plus a materials takeoff*. **This
product may want to be the first module of a flooring contractor's tool rather
than a standalone subscription**, and that decision should be made before the
pricing page is written, not after the first churn cohort.

## 8. Unit economics

| | |
|---|---|
| Price | $39/mo |
| Net after Apple's 15% | **$33.15** |
| Lifetime at 4% churn | 25 months |
| **LTV** | **$829** |
| **Break-even** | **181 customers (1.38% of market)** |
| Replace per month at 181 | 8 |

| Monthly churn | LTV | Replace/month at 181 |
|---:|---:|---:|
| 2% | $1,658 | 4 |
| **4%** | **$829** | **8** |
| **8% (plausible for a narrow tool)** | **$414** | **15** |

**This is the weakest LTV of the five, and the churn risk is the highest**,
because usage frequency is lowest. Fourteen replacements a month at 8% churn is a
treadmill.

**The fix is not pricing — it is scope.** Adding moisture testing and takeoff
raises both frequency and price, and turns a two-uses-a-month tool into a
daily one. **Model the bundle before committing to standalone.**

## 9. Go-to-market

### First 10

1. **Flooring distributors and supply houses.** Installers are there weekly, and
   the counter staff know exactly who has had a callback.
2. **Lead with a lost argument.** Find an installer who ate a floor-prep cost
   recently. They will tell you the number without being asked.
3. **Scan their next job with them.**

### First 100

| Channel | Why |
|---|---|
| **Flooring distributors** | Highest leverage. They also sell the leveller your app quantifies — an aligned interest |
| **Leveller manufacturers** | Your app tells installers how many bags to buy. That is a genuinely aligned partner, and a co-marketing conversation |
| **NWFA / NTCA / flooring trade groups** | Where installation standards get argued |
| **Installer Facebook groups and forums** | Callback horror stories are the daily content. Your product is the answer to them |
| **The change order itself** | Lands on a GC's desk with your branding — and the GC is your secondary ICP |

### The sales script

> *"When was the last time you ate a floor-prep cost you didn't bid?"*
>
> — Let them say the number. It is usually four figures.
>
> *"What if you'd had a map and a measured gap before you started?"*

## 10. Battle card

| Competitor | Position | They win | You win |
|---|---|---|---|
| **Allen Face D-Meter** | $8,995 [review] | The actual standard, court-grade | Price, and installers do not need E1155 |
| **Dipstick** | Not published; "less than some profilers" [vendor] | The original, trusted | Same |
| **Straightedge + flashlight** | $40, universal | Free, trusted, no learning curve | No map, no record, no quantity, no change order |
| **Laser scan + Geomagic** | Enterprise scan-to-heat-map [review] | Genuinely accurate | Enterprise cost and skill |

**The line:** *We don't certify your slab. We tell you where to put the
straightedge, and what the fix costs.*

**Never claim E1155.** The people who know the difference are the people whose
respect the product needs.

## 11. Legal and risk

| Risk | Posture |
|---|---|
| **Someone uses the output as an E1155 test** | The printed refusal is on every export. Repeat it in the app, the report, and the marketing |
| **A floor fails after the app said "pass"** | The pass is against measured gaps the installer typed, at the tolerance they selected. Log both. **The app never passes a floor on scanned values alone** |
| **Leveller quantity is short** | Quantities are estimates with a stated waste factor and say so. Never present bag counts as exact |
| **Warranty disputes** | The report is evidence of conditions at a moment, not a warranty |

## 12. Metrics and kill criteria

1. **Scans per customer per month** — the frequency number, and the one that
   decides whether this survives as a standalone product
2. **Change orders generated per scan** — the money conversion
3. **Percentage of scans where a straightedge measurement was actually entered**
4. **Month-3 and month-6 retention**

| Signal | Window | Action |
|---|---|---|
| Ranked list uncorrelated with real straightedge findings | Week 1 | **Stop** |
| Cannot resolve 3 mm | Week 2 | **Stop**, or re-scope to "very rough screening" and re-price far lower |
| Median under 2 scans/customer/month | Month 4 | Too narrow. **Bundle with moisture + takeoff or stop** |
| Month-6 retention under 50% | Month 6 | Confirms the narrow-tool thesis. Bundle or stop |

## 13. The 90-day plan

| Weeks | Focus | Done means |
|---|---|---|
| **1** | **The slab test and the 3 mm test** | A measured answer on whether ranking works |
| **2–4** | `core/` — plane fit, deviation, span simulation | Simulated straightedge matches a real one on a known surface |
| **5–7** | Capture and the deviation map on device | Scan a real floor, get a map an installer recognises |
| **8–10** | Straightedge list, measured entry, re-solve | A real floor passed/failed on measured gaps |
| **11–12** | Leveller volume and the priced change order | **A real installer has issued a real change order from the app** |

**Day 90 milestone: one issued change order.** And by then you will also know
the scans-per-month number, which decides whether this is a product or a feature.
