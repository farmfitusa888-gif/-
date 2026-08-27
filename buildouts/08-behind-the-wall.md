# Buildout — Idea 8: What's behind this wall

**Working name: OPENWALL.** The pre-drywall record, sold to the homeowner as a
line on the invoice.

**The strongest business of the five.** Largest market, shortest sale, and the
only one where the contractor makes money rather than spends it.

---

## 1. The business in one page

**What it is.** For the two or three days a renovation has its walls open, the
contractor walks each room with a phone. LiDAR captures the geometry; the camera
photographs continuously with its exact position attached. The app turns that
into a permanent, positioned record of every pipe, wire, duct and stud — and
issues it as a self-contained file the homeowner keeps forever.

**Who pays.** The contractor pays a subscription. **The homeowner pays the
contractor $150–$400 for the record** [assumption].

**The wedge — and it is a business-model wedge, not a technical one.** Every
competitor sells a contractor a subscription to store photos. This sells the
contractor **a product to resell at 100% margin on a job where the walls were
already open.** Nobody in the category has noticed that the person who benefits
most is not the contractor at all.

**Why the contractor says yes.** It is a differentiator on the bid, a margin line
on the invoice, and twenty minutes of work. The pitch to the homeowner writes
itself: *"When you sell this house, or the next guy opens this wall, you'll have
this."*

**Why it is defensible.** Not the computer vision — that is copyable. **The
artefact.** A record format that homeowners own, that transfers with the
property, and that accumulates in the housing stock. Every record issued is a
homeowner who expects one on their next job, and asks the next contractor for it.

## 2. Who buys it

**Primary ICP.** The residential remodeler doing whole-room or whole-house work
— kitchens, baths, additions — where walls come open. Two to fifteen people.
**127,394 businesses in the US** [review].

**Secondary.** Electricians and plumbers, who could sell the record on their own
rough-in.

**Tertiary.** Custom home builders, where the record is a closing document.

**The end beneficiary is the homeowner**, and they are the one you eventually
market to — but they are not the buyer, and confusing the two kills the plan.

### Why the denominator matters here more than anywhere

| | |
|---|---|
| Residential remodelers | **127,394** [review] |
| Break-even customers at $49/mo | **145** |
| **Share of market required** | **0.11%** |

**One-tenth of one percent.** Compare idea 1, which needs 2.02%. This is the
difference between needing category dominance and needing a niche.

## 3. Product — v1 scope

**The thesis of v1: one room, walls open, twenty minutes, one file the homeowner
can open in ten years.**

### In scope

| Screen | What it does |
|---|---|
| **Job setup** | Address, homeowner name, rooms |
| **Capture** | Walk the open room. LiDAR builds the wall geometry; the camera shoots continuously with pose attached |
| **Trace** | Tap a pipe or cable in one frame, tap it again in another from a different angle. The app triangulates a real 3D position. Label it: cold water, 12-2 romex, 3" waste, HVAC supply |
| **Provenance** | A run seen and triangulated is `measured`. A run inferred between two visible points is `derived` and prints differently |
| **Verify** | A tape on one wall per axis anchors the room, same as any measured space |
| **Issue** | One self-contained file — geometry, positioned runs, photographs, the provenance legend — that opens in any browser with no app and no login |
| **Invoice** | The record becomes a priced line item |

### Explicitly out of v1

- **Automatic pipe recognition.** v1 is tap-to-triangulate. A human is standing
  there and a wrong automatic answer is worse than no answer. *(See §6 — this is
  the single most important scope decision in the buildout.)*
- **A hosted vault.** Needs a server. The homeowner owns the file. Named as a
  later tier, priced separately, not in the model.
- **Property transfer / title integration.** Later, and probably a partnership.
- **Whole-house at once.** v1 does rooms.

### The one thing v1 must get right

**The file has to still open in 2036.** That is the whole promise. Self-contained
HTML with everything inlined — no CDN, no font host, no external image, no
runtime dependency. **A record that needs a server in ten years is not a record.**

## 4. Technical architecture

```
┌─────────────────────────── iOS (Swift / SwiftUI) ────────────────────────────┐
│  Capture    ARKit LiDAR mesh · continuous photo w/ ARCamera transform +      │
│             intrinsics · IMU                                                  │
│  Store      SQLite + photo files, app container                              │
│  Sync       CloudKit private DB (contractor's own iCloud)                    │
└──────────────────────────────────┬───────────────────────────────────────────┘
                                   │
┌──────────────────────────────────┴───────────────────────────────────────────┐
│  core/  (TypeScript)                                                          │
│    measure.ts      integer nanometre geometry                                 │
│    triangulate.ts  two posed 2D taps → one 3D point. THE CORE ASSET           │
│    runs.ts         points → labelled runs; measured vs. derived spans         │
│    provenance.ts   per-point and per-span marking                             │
│    record.ts       pure fn: (room, runs, photos, company) → the artefact      │
└──────────────────────────────────┬───────────────────────────────────────────┘
                                   │
┌──────────────────────────────────┴───────────────────────────────────────────┐
│  The artefact — one self-contained .html. Inlined images as data URIs,        │
│  inlined CSS/JS, no network of any kind. Opens offline, forever.              │
└──────────────────────────────────────────────────────────────────────────────┘
```

**The triangulation, precisely.** Two camera poses are known from ARKit. The user
taps the same pipe in each. Two rays are cast into world space; their closest
approach is the point. **The distance between the two rays at closest approach is
the error, and it is reported rather than hidden** — a wide miss means the taps
disagreed and the app asks for a third.

That reported miss distance is the whole trust model. It is also the thing that
makes an automatic recogniser unnecessary in v1.

**Why no server, restated as a product requirement:** the artefact must outlive
your company. If OPENWALL shuts down in 2030, every record ever issued still
opens. Say that in the sales conversation — a contractor who has been burned by
a dead SaaS understands it immediately.

## 5. Build plan

| Phase | What ships | Weeks |
|---|---|---|
| **0. Five phone calls** | The demand test. Not code | 0.25 |
| **1. Capture + pose** | LiDAR room, continuous posed photos, on device | 3 |
| **2. Triangulation** | Two taps → a 3D point with a reported error. **Prototype this before anything else** | 2–3 |
| **3. Runs and labels** | Points into labelled runs; measured vs. derived spans | 2 |
| **4. The artefact** | Self-contained HTML, fully inlined, opens offline | 3 |
| **5. Room anchoring** | Tape on one wall per axis; the room re-solves | 2 |
| **6. Issue and invoice** | Branding, the priced line item | 1.5 |
| **7. Field hardening** | Ten real open-wall rooms | 3 |
| | **Total to sellable v1** | **16.75–17.75 weeks** |

**Fastest of the five to a sellable product**, because there is no standards
library to encode — the thing being recorded is just geometry.

## 6. Validate before you build

**Test 1 — five phone calls. Do this today.**

> *"If it took twenty minutes with the walls already open, would you put $250 on
> the invoice for a permanent record of everything behind the drywall?"*

**You are testing whether they will sell it, not whether they would use it.**
Every contractor will say they would use a free useful thing. The question is
whether they will stand in a kitchen and ask a homeowner for $250.

- **Four or five yes → build it.**
- **Two or three → the price is wrong, or it needs to be bundled. Ask what they'd
  charge.**
- **Zero or one → stop.** The latent-value problem is real and no product fixes it.

**Test 2 — triangulate one pipe.** A weekend prototype: two posed taps, one 3D
point, printed miss distance. Then put a tape on the real pipe. **Is it within an
inch?** An inch is the useful threshold — good enough to find a run, never good
enough to cut blind, which the record says explicitly.

**Test 3 — the ten-year file.** Build the self-contained artefact and open it in
Safari, Chrome, Firefox, and on an Android phone, **with the network turned off.**
If anything fails to render, the promise is broken.

## 7. Pricing and packaging

| Tier | Price | What |
|---|---|---|
| **Free, forever** | $0 | Capture, trace, view. One record kept. The whole tool |
| **Pro** | **$49/mo · $490/yr** | Issue records, unlimited, own branding, the invoice line |
| **Later: Vault** | +$29/mo | Hosted, re-sendable. Needs a server. Priced separately, never absorbed |

**The contractor charges $150–$400 per record** [assumption — untested, and
Test 1 is what tests it].

**The arithmetic that closes the sale:** one record a month at $250 pays for five
months of subscription. **Two records pays for the year.** Everything after is
margin on work already being done.

**This is the only one of the five where the pitch is "this makes you money."**
Lead with it and never with features.

## 8. Unit economics

| | |
|---|---|
| Price | $49/mo |
| Net after Apple's 15% | **$41.65** |
| Lifetime at 4% churn | 25 months |
| **LTV** | **$1,041** |
| **Break-even** | **145 customers** |
| **Share of 127,394 remodelers** | **0.11%** |
| New customers/month to hold 145 | 6 |

### Sensitivity — churn matters here more than price

| Monthly churn | Lifetime | LTV | Replace/month at 145 |
|---:|---:|---:|---:|
| 2% | 50 mo | $2,083 | 3 |
| **4%** | **25 mo** | **$1,041** | **6** |
| 8% | 12.5 mo | $521 | 12 |

**The retention mechanism is unusual and worth naming.** A contractor who has
sold three records has three homeowners who expect one. The habit is reinforced
by his own customers, not by your app. **That should make churn lower than the
4% base case — but it is unproven, and the model does not assume it.**

**At 500 customers:** $20,825/month net, ~$250k/year, on 0.39% of the market.

## 9. Go-to-market

### First 10

1. **Your own network first.** Remodelers you can stand next to in a room with
   the walls open. Do the first record with them.
2. **Do one for free — for the homeowner, not the contractor.** Then watch the
   homeowner's reaction. That reaction is the entire sales asset, and if it is a
   shrug you have learned the most important thing early.
3. **Film it.** Twenty minutes compressed to ninety seconds, ending on the file
   opening in a browser. That video is the ad, the demo, and the pitch.

### First 100

| Channel | Why |
|---|---|
| **The artefact itself** | Every record lands with a homeowner, footer-branded. Homeowners ask their *next* contractor for one. **This is the only one of the five with an organic loop** |
| **Home inspectors** | They open walls, they meet homeowners at the moment they care, and they are natural referrers |
| **Remodeler forums and local NARI/NAHB chapters** | Where this buyer talks about winning bids |
| **Real estate agents** | A record is a listing feature. Long game, no cost |
| **Electricians and plumbers** | Sell the record on their own rough-in |

### The sales script

> *"What happens when someone needs to cut into a wall you closed up three years
> ago?"*
>
> — Let them describe the guessing.
>
> *"What if you'd handed the homeowner a file, and charged them $250 for it?"*

Then show the ninety-second video. **Do not demo the app.** Demo the artefact.

## 10. Battle card

| Competitor | Position | They win | You win |
|---|---|---|---|
| **ScanManifold** | $16/user/mo photo, $24 with 3D measure [review] | Cheap, shipping, no seat minimums | Photos in a timeline, not positions in a wall. It is a contractor cost; yours is contractor revenue |
| **DocuSketch** | 360° capture + scope, restoration-focused, hardware [vendor] | Fast walkthroughs, established in restoration | Aimed at restoration scoping, not a permanent record. Needs their hardware |
| **Procore / Fieldwire / Raken** | General construction documentation | Enterprise depth | Per-seat cost to a two-man shop, and no homeowner artefact |
| **The camera roll** | What actually happens | Free | Unfindable in four years, no scale, no position |

**The line:** *Everyone else sells you storage. We sell you something to sell.*

## 11. Legal and risk

| Risk | Posture |
|---|---|
| **Somebody cuts into a wall trusting the record and hits a line** | **The most serious risk in this buildout.** The record states on its face that it is a record, not a locator, and never replaces scanning the wall before cutting. `derived` spans are visually distinct from `measured` points. The reported triangulation error prints |
| **Contractor liability for what the record shows** | The record is dated and describes conditions at that moment. Later trades change things. Say so on the artefact |
| **Homeowner privacy** | The file contains the interior of somebody's home. The homeowner owns it; no copy reaches you. Zero breach surface by construction |
| **A record outliving the company** | Solved architecturally — self-contained, no runtime dependency. **This is a promise, so it must be tested every release** |

## 12. Metrics and kill criteria

1. **Records issued per customer per month** — the only number that matters
2. **Percentage of contractors who issue a second record** — habit formed or not
3. **Triangulation miss distance, median** — the trust metric
4. **Month-3 retention**

| Signal | Window | Action |
|---|---|---|
| Fewer than 4/5 say yes to the $250 question | Week 1 | **Stop.** Cheapest kill available |
| Triangulation cannot hit ~1 inch | Week 4 | Re-scope to photo-with-position only; re-score |
| Contractors use it but never charge for it | Month 4 | The model is wrong. Reprice as a cost-saving tool at a lower price, or stop |
| Under 40% issue a second record | Month 6 | Novelty, not habit. Stop |

## 13. The 90-day plan

| Weeks | Focus | Done means |
|---|---|---|
| **1** | Five phone calls. Triangulation weekend prototype | A go/no-go and a measured miss distance |
| **2–4** | Capture: LiDAR room + continuous posed photos | Walk a real open-wall room, get geometry and posed frames |
| **5–7** | Triangulation and runs in `core/`, with reported error | Tap a pipe twice, get a position within an inch of a tape |
| **8–10** | The artefact — self-contained, offline, cross-browser | Opens on four browsers with the network off |
| **11–12** | Issue, brand, invoice. One real paid record | **A homeowner has paid a contractor for a record made in your app** |

**Day 90 milestone: one real homeowner has paid for one real record.** Not a beta
list. A transaction.
