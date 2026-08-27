# Buildout — Idea 1: Templating

**Working name: TEMPLATE.** Digital templating for fabrication shops, on a phone
instead of a $25,000 rig.

**Read §2 first.** The sizing work found a problem this idea did not have when it
was ranked on judgement alone.

---

## 1. The business in one page

**What it is.** An iPhone/iPad app that captures the shape of a real, crooked
opening — a countertop run, a stair tread, a shower pan — hands back the
measurements worth a tape, takes the fabricator's typed numbers, re-solves the
outline around them, and exports a CNC-ready DXF plus a priced quote.

**Who pays.** The small fabrication shop that cannot justify $18,000–$45,000 of
templating hardware.

**The wedge.** A phone is not accurate enough to template a countertop, **and
that is the product.** The scan gets the outline; the human confirms the edges
that matter; the app refuses to export to CNC while any cut edge rests on a
sensor's guess. Nobody scraps a slab because a tape was wrong — they scrap it
because a number nobody checked looked exactly like a number somebody had.

**Why now.** Phone LiDAR plus a solver that re-closes a polygon around typed
measurements can, in principle, do the geometric job. **Whether it can hold the
tolerance is unmeasured, and it is the whole risk.**

## 2. Who buys it — and the problem with the count

**Primary ICP.** The 2–10 person countertop or stone fabrication shop doing
roughly 4–20 kitchens a month, currently templating with cardboard, or
subcontracting it.

| | |
|---|---|
| Countertop manufacturing businesses, US | **5,951 (2024) / 5,967 (2025)** [review] |
| Stone fabrication establishments, broader definition (2018) | **8,694**, ~100,000 workers [review] |
| Industry market size | $22.0bn [review] |
| Structure | "Highly fragmented, no company above 5% share" [review] |

### The problem

| | |
|---|---|
| Break-even customers at $59/mo | **120** |
| **Share of market required** | **2.02%** |

**Two percent of every countertop shop in America, just to reach $6,000 a
month.** Idea 8 needs 0.11%. **This idea needs eighteen times the penetration.**

That is not fatal — 120 shops is a knowable, callable list, and fragmentation
means no incumbent blocks you. But it changes the strategy completely:

- **There is no niche to hide in.** You need near-total category awareness.
- **Price is doing too little work.** At $59 you need 120 shops; at $119 you need
  60, which is 1.0% of the market. **Given the alternative is an $18,000 capital
  purchase, $59 is probably underpriced.** See §7.
- **Adjacent shapes matter.** Stair treads, shower pans, glass, solid surface,
  splash-backs. The same engine, a wider denominator.

## 3. Product — v1 scope

**Thesis: one countertop run, captured, verified, cut, and it fits.**

### In scope

| Screen | What it does |
|---|---|
| **Job setup** | Customer, material, edge profile, thickness |
| **Capture** | Walk the cabinet run. LiDAR builds the outline; walls, returns, and the front edge |
| **The carry list** | The app ranks the measurements worth a tape — back wall length, each return, diagonal — and asks for them, in order |
| **Override + re-solve** | Type the real number; the outline re-solves. Angled runs are held fixed while square ones absorb the error, so a chamfer's angle is never quietly stretched |
| **The refusal** | **Any cut edge carrying a `scanned` dimension blocks DXF export.** Non-negotiable |
| **Cut-outs** | Sink, cooktop, faucet holes, from a library, positioned and dimensioned |
| **Seam plan** | Where seams fall, against slab size |
| **Export** | DXF with dimensions, provenance on every one |
| **Quote** | Square footage → price book → edge, cut-out and seam charges → a priced quote |

### Explicitly out of v1

- **Slab nesting / yield optimisation.** The hardest problem here and not
  required to prove the concept.
- **Photogrammetry fallback for non-LiDAR phones.** v1 requires a LiDAR device.
- **Direct machine post-processing.** DXF out; the shop's CAM takes it from there.
- **Anything not rectilinear-plus-angles.** Curves are v2.

## 4. Technical architecture

```
┌──────────────── iOS (Swift / SwiftUI) ────────────────┐
│  ARKit LiDAR · guided capture · tape-entry UI          │
│  SQLite local · CloudKit private DB                    │
└────────────────────────┬───────────────────────────────┘
┌────────────────────────┴───────────────────────────────┐
│  core/  (TypeScript)                                    │
│    measure.ts   integer nanometres; ft-in-fraction I/O  │
│    solve.ts     re-close the polygon around typed values│
│                 angled runs FIXED, square runs absorb   │
│    provenance.ts scanned | measured | derived           │
│    cutout.ts    positioned openings, dimensioned        │
│    seam.ts      seam placement against slab size        │
│    dxf.ts       DXF w/ dimension entities + $INSUNITS   │
│    price.ts     sq ft, edge lf, cut-outs → cents        │
└─────────────────────────────────────────────────────────┘
```

**Three rules:**

1. **Integer arithmetic, feet-inches-fractions native.** This trade speaks in
   sixteenths. A shop that sees 34.9843" loses trust immediately.
2. **The angled-run rule.** A 203 mm chamfer at 70° is ordinary. When arithmetic
   must give somewhere, it gives in the square runs, never in the angle.
3. **`$INSUNITS` must be set correctly in the DXF.** A units header that is wrong
   or absent is the classic way a CAD export arrives at a machine off by a
   factor. **Test it against the shop's actual CAM, not a viewer.**

## 5. Build plan

| Phase | What ships | Weeks |
|---|---|---|
| **0. The slab test** | The accuracy answer. See §6 | 0.5 |
| **1. Engine** | measure, solve, provenance — the polygon re-solve | 3–4 |
| **2. Capture + carry list** | LiDAR outline, ranked tape list, override | 3 |
| **3. DXF** | Dimensioned, unit-correct, verified in the shop's CAM | 2–3 |
| **4. Cut-outs and edges** | Library, positioning, dimensions | 2 |
| **5. Seam plan** | Slab-size aware | 2 |
| **6. Quote** | Price book, edge/cut-out/seam charges | 2 |
| **7. Field hardening** | Ten real kitchens, cut and fitted | 4 |
| | **Total to sellable v1** | **18.5–20.5 weeks** |

## 6. Validate before you build

**Test 1 — the slab. This is the whole idea and it costs one slab.**

Template one real kitchen with a phone plus the human-verified path. Cut it. **Does
it fit?**

- Tolerance is roughly **±1.5 mm on a cut edge** [assumption — confirm with a
  fabricator; manufacturers and shops differ].
- **No accuracy figure for phone LiDAR templating exists in this research and
  none was measured.**
- Run it three times, three kitchens, before believing the answer.

**If it does not fit: stop. There is no version of this that works at any price.**

**Test 2 — the DXF.** Export to a real shop's CAM. Wrong units or missing
dimension entities is a silent, expensive failure mode.

**Test 3 — the price.** Ask ten shops: *"what would you pay monthly to template
without buying a rig?"* You are testing whether $59 is leaving money on the
table. Given they are comparing against $18,000+, expect a higher number.

## 7. Pricing and packaging — reconsidered

The brief said $59. **The sizing says that is probably wrong.**

| Tier | Price | What |
|---|---|---|
| **Free, forever** | $0 | Template, outline, dimensions, 2 templates kept |
| **Shop** | **$119/mo · $1,190/yr** | CNC export, cut-outs, seam plan, priced quote, unlimited |

**Why $119, not $59:**

| Price | Customers for $6k/mo | Share of 5,951 |
|---:|---:|---:|
| $59 | 120 | 2.02% |
| **$119** | **60** | **1.01%** |
| $199 | 36 | 0.60% |

The buyer is comparing against **$18,000–$45,000 of hardware** [review]. At $119
the app pays for itself against a used LT-55 at $3,599 [review] in thirty months,
and against a new rig in over twelve years. **$59 signals a toy in a trade where
the alternative costs as much as a truck.**

**[assumption] — and Test 3 is what tests it.**

## 8. Unit economics

At **$119/mo**, 4% churn, Apple 15%:

| | |
|---|---|
| Net after Apple's 15% | **$101.15** |
| Lifetime at 4% churn | 25 months |
| **LTV** | **$2,529** |
| **Break-even** | **60 customers (1.01% of market)** |
| Replace per month at 60 | 3 |

| Monthly churn | LTV | Replace/month at 60 |
|---:|---:|---:|
| 2% | $5,058 | 2 |
| **4%** | **$2,529** | **3** |
| 8% | $1,264 | 5 |

**At 300 shops (5% of the market — a genuinely hard number):** $30,345/month,
~$364k/year. **The ceiling here is real**, and it is set by the denominator, not
the product.

## 9. Go-to-market

### First 10

1. **Walk into shops.** This buyer is a physical location with a saw in it. Ten
   visits in a metro area is two days.
2. **Bring the fitted countertop.** Not a demo — the actual piece that came off
   a phone template and fitted. That is the only argument that works.
3. **Template one job with them, free, in person.**

### First 100

| Channel | Why |
|---|---|
| **Stone distributors and slab yards** | Every fabricator visits one weekly. The single highest-leverage relationship in this trade |
| **ISFA / trade associations, StonExpo** | Where shops evaluate equipment |
| **Fabricator forums and Facebook groups** | Highly active, deeply sceptical, and they will test your claims publicly — which is why you must never overclaim accuracy |
| **Used-equipment adjacency** | Shops browsing used rigs at $3,599–$8,995 [review] are shops that have decided they need templating and cannot afford new |

### The sales script

> *"How do you template today?"* — cardboard, or subbing it out.
>
> *"What does a scrapped slab cost you?"* — let them say the number.
>
> *"This won't let you cut until you've put a tape on the edges that matter."*

**Never lead with accuracy.** You do not have a measured figure, this audience
will test it, and being caught overclaiming in a fabricator forum ends the
product.

## 10. Battle card

| Competitor | Position | They win | You win |
|---|---|---|---|
| **Laser Products LT-2D3D** | $18,000–$25,000, largest US installed base [review] | Proven, trained operators, trusted | Capital cost. A shop without one is not a competitor's customer — they are a non-consumer |
| **Prodim Proliner** | $20,000–$45,000 [review] | Complex and curved work | Price, and curves are v2 anyway |
| **Used LT-55** | $3,599–$8,995 [review] | Cheap entry | Decade-old hardware, no quoting, no provenance |
| **Cardboard** | Free | Universal, trusted | Slow, warps, no digital output, no quote |
| **Polycam / Scaniverse** | ~$150/yr [review] | Great meshes | A mesh is not a template. No closed outline, no tolerance, no DXF a saw accepts |

**The line:** *The rig costs more than the truck you drive to the job. This costs
less than the slab you scrapped last month.*

## 11. Legal and risk

| Risk | Posture |
|---|---|
| **A scrapped slab blamed on the app** | The refusal is the defence: the app will not export while a cut edge is unverified. **Log the verification** so the record shows the fabricator typed the number |
| **Overclaiming accuracy** | Publish no accuracy figure you have not measured on your own devices, across a real sample. This is both an integrity rule and a legal one |
| **"Confident amateur" risk** | A phone makes templating look easy. Templating is a trade. The guided carry list is partly a teaching device — design it that way |
| **Liability cap** | EULA reviewed by a lawyer. Consider explicitly disclaiming consequential damages (i.e. the slab) |

## 12. Metrics and kill criteria

1. **Templates per shop per month**
2. **DXF exports per template** — the conversion from measuring to cutting
3. **Percentage of cut edges human-verified** — should be ~100%; if not, the
   refusal is being worked around
4. **Month-3 retention**

| Signal | Window | Action |
|---|---|---|
| The slab does not fit, three attempts | Week 1 | **Stop. No recovery.** |
| DXF fails in real CAM | Week 4 | Fixable, but fix before selling |
| Ten shops, none will pay $119 | Month 4 | Reprice to $59 and re-run the market math — or stop |
| Cannot name 300 reachable shops | Month 6 | The denominator is binding. Pivot to adjacent shapes or stop |

## 13. The 90-day plan

| Weeks | Focus | Done means |
|---|---|---|
| **1–2** | **The slab test, three kitchens.** Nothing else | A measured answer on whether this can work at all |
| **3–6** | `core/` — solver, provenance, ft-in-fractions | A polygon that re-closes correctly around typed values |
| **7–9** | Capture and the carry list on device | A real cabinet run captured and verified |
| **10–12** | DXF, verified in a real shop's CAM | **A countertop cut from a phone template, fitted in a real kitchen** |

**Day 90 milestone: a fitted countertop.** If week 2 says it cannot fit, you have
spent one slab and two weeks instead of five months.
