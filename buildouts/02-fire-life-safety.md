# Buildout — Idea 2: Fire & life-safety inspection

**Working name: RISER.** The inspection that works in the basement and ends in a
signed report and a priced repair.

**Best unit economics of the five.** Also the hardest build — and §5 says exactly
where the difficulty is.

---

## 1. The business in one page

**What it is.** An iPhone/iPad app for fire-protection contractors. Inspect
sprinkler systems, extinguishers, alarms and backflow devices offline in a
mechanical room; record what was tested, what failed, and what could not be
reached; produce the compliance report and a priced repair quote off the same
data, before leaving the building.

**Who pays.** The 1–15 person fire-protection contractor.

**Three wedges, in the order the buyer cares:**

1. **It works in the basement.** Offline-first is a feature bullet for every
   competitor and the actual daily reality of this trade.
2. **The report says what was *assumed*.** A device that could not be reached, a
   valve that could not be exercised, a head above a hard ceiling — today these
   silently become a clean line on a report the inspector signs. This one marks
   them. **The inspector's signature is on that document**; being able to prove
   what was and was not verified is professional indemnity, not a feature.
3. **The deficiency becomes money the same day.** Found → photographed →
   priced → quoted → signed, on site. Today that is two or three products and
   two rounds of retyping, and a meaningful share of deficiencies never get
   quoted because the retyping never happens.

**The pricing finding that is itself the marketing.** Neither category leader
publishes a price. Inspect Point does not display pricing; BuildingReports lists
"Contact for pricing" [vendor]. A search for per-device pricing concluded both
"use custom/quote-based pricing models rather than transparent per-device pricing
structures" [review]. **A published, flat, unlimited number is a competitive act
in a market where nobody will say what they charge.**

## 2. Who buys it

**Primary ICP.** The small fire-protection contractor doing recurring inspection
and service — NFPA 25 sprinkler, NFPA 10 extinguishers, NFPA 72 alarms.

| | |
|---|---|
| Fire protection & security system installation contractors, US | **19,845 businesses** [review] |
| Industry size | **$22.1bn (2026)** [review], 3.0% CAGR 2020–2025 [review] |
| Break-even customers at $89/mo | **80** |
| **Share of market required** | **0.40%** |

**Note the count is broader than pure fire-sprinkler contractors** — it includes
security system installers. The true fire-only denominator is smaller and was not
separately found. **[assumption]: at least half, so ~10,000; break-even is then
0.8% of market, still the second-best of the five.**

**Secondary.** Facilities departments inspecting their own buildings.
**Tertiary.** Authorities having jurisdiction — a different product; do not chase.

## 3. Product — v1 scope

**Thesis: one NFPA 25 annual sprinkler inspection, done offline, accepted by an
AHJ.**

### In scope

| Screen | What it does |
|---|---|
| **Building + device inventory** | Systems, risers, devices, with barcode/QR identity per device |
| **Inspection run** | The NFPA 25 annual checklist, walked in order, entirely offline |
| **Three-state answers** | Pass / Fail / **Not verified — with a reason** (inaccessible, hard ceiling, valve seized, tenant refused entry) |
| **Evidence** | Photos with camera pose and timestamp, attached to the device |
| **Deficiency** | Each failure becomes a record with severity and NFPA reference |
| **Priced repair** | Deficiency → repair item → price book → quote, on site |
| **Signature** | Building rep signs on the device; audit trail retained |
| **Report** | The compliance PDF, with the not-verified items visible rather than absorbed |
| **Frequency tracker** | Next due dates — annual, quarterly, five-year — per system |
| **Sync** | When signal returns, with real conflict resolution |

### Explicitly out of v1

- **NFPA 10, 72, and backflow.** v1 is **NFPA 25 annual only.** This is the most
  important scope decision in the buildout — see §5.
- **AHJ electronic submission.** Every jurisdiction differs. Produce the PDF.
- **Barcode tag supply.** BuildingReports' model puts physical tags on devices.
  v1 reads existing tags and its own QR codes; it does not build a tagging
  business.
- **Dispatch and scheduling.** Frequency tracking says *what is due*. It does not
  become a scheduling product.

## 4. Technical architecture

```
┌────────────── iOS (Swift / SwiftUI) ──────────────┐
│  Camera + pose · barcode/QR · fully offline        │
│  SQLite (durable, conflict-aware) · CloudKit sync  │
└──────────────────────┬─────────────────────────────┘
┌──────────────────────┴─────────────────────────────┐
│  core/  (TypeScript)                                │
│   forms.ts       NFPA 25 checklist as VERSIONED DATA│
│   answer.ts      pass | fail | not-verified + reason │
│   deficiency.ts  failure → severity → NFPA ref       │
│   price.ts       deficiency → repair → cents         │
│   frequency.ts   due-date engine (annual/qtr/5yr)    │
│   report.ts      pure fn → compliance document       │
│   sync.ts        offline-first merge, explicit       │
│                  conflict resolution                 │
└─────────────────────────────────────────────────────┘
```

**Four rules:**

1. **The forms are data, versioned by NFPA edition and effective date.** A 2027
   inspection must be re-printable in 2032 against the edition that governed it.
   **Store the edition with the inspection.** Hard-coding a checklist is the
   single most expensive mistake available here.
2. **"Not verified" is a first-class answer**, never a blank and never silently
   a pass. This is the entire differentiator and the data model must make it
   impossible to omit.
3. **Offline is the default path, not a fallback.** Everything works with the
   radio off; sync is an afterthought that runs later. Building it the other way
   round always produces an app that fails in a riser closet.
4. **Sync conflicts surface to a human.** Two inspectors, one building, no
   signal. Silent last-write-wins loses an inspection record — which, on a legal
   document, is unacceptable.

## 5. Build plan — and the honest problem

| Phase | What ships | Weeks |
|---|---|---|
| **0. The form test** | The go/no-go. See §6 | 1 |
| **1. Offline core** | SQLite, sync, conflict resolution. Built first because retrofitting offline never works | 3 |
| **2. Form engine** | Versioned checklist data + renderer + three-state answers | 3 |
| **3. NFPA 25 annual** | **The actual checklist content. Research, not coding** | **4–8** |
| **4. Capture** | Photos w/ pose, barcode/QR device identity | 2 |
| **5. Deficiency → quote** | Price book, repair mapping, on-site quote | 2.5 |
| **6. Signature + report** | E-signature, audit trail, compliance PDF | 2.5 |
| **7. Frequency tracker** | Due dates, the retention engine | 2 |
| **8. AHJ acceptance** | Get one real report accepted. Iterate | 3 |
| | **Total to sellable v1** | **23–29 weeks** |

**Phase 3 is the risk and it is not a programming risk.** NFPA 25 is large,
versioned, and applied differently by different AHJs. Encoding one report type
correctly is research work. **This is the longest and least certain build of the
five**, and it is why the idea scored 2/5 on buildability despite excellent
economics.

## 6. Validate before you build

**Test 1 — reproduce one accepted report. One week. This is the go/no-go.**

Get one real NFPA 25 annual sprinkler report that an AHJ has already accepted.
Reproduce it exactly from a paper data model — every field, every device row,
every signature block.

- **If encoding one report type takes a week → buildable. Proceed.**
- **If it takes a month → the other seven report types will take a year. Stop, or
  narrow to a single jurisdiction and a single system type.**

**You will know inside that first week**, and it costs nothing but time.

**Test 2 — the "not verified" question.** Ask five inspectors: *"what do you do
today when you can't reach a device?"* If they say "I note it in the comments" or
go quiet, the differentiator is real. If they have a clean, confident answer, it
is weaker than it looks.

**Test 3 — the deficiency-to-quote gap.** Ask: *"what share of the deficiencies
you find actually get quoted?"* If it is near 100%, the money argument
evaporates. If it is 40%, you have found the budget and the headline.

## 7. Pricing and packaging

| Tier | Price | What |
|---|---|---|
| **Free, forever** | $0 | Inspect, photograph, one building's device inventory. The whole inspecting tool |
| **Contractor** | **$89/mo · $890/yr** | Reports, deficiency quoting, unlimited buildings and devices, frequency tracking, e-signature |

**Published on the pricing page, in the largest type on it.** In a category where
both leaders quote, the number itself is the campaign.

**Flat and unlimited, explicitly per-contractor and not per-device.** Per-device
pricing punishes the contractor who lands a large campus — exactly the customer
you want succeeding.

## 8. Unit economics

**Churn assumption is different here, and deliberately so.**

The frequency tracker means a contractor's next twelve months of inspection
obligations live in the app. Ripping that out mid-year is painful in a way that
cancelling a scanning tool is not. **Base case 2.5% monthly [assumption],
against the 4% used elsewhere.**

| | |
|---|---|
| Price | $89/mo |
| Net after Apple's 15% | **$75.65** |
| Lifetime at 2.5% churn | 40 months |
| **LTV** | **$3,026** |
| **Break-even** | **80 customers (0.40% of market)** |
| Replace per month at 80 | 2 |

| Monthly churn | Lifetime | LTV | Replace/mo at 80 |
|---:|---:|---:|---:|
| **2.5% (base)** | **40 mo** | **$3,026** | **2** |
| 4% | 25 mo | $1,891 | 4 |
| 8% | 12.5 mo | $946 | 7 |

**Highest LTV of the five, by a wide margin**, and the lowest replacement
treadmill. **At 300 contractors: $22,695/month, ~$272k/year, on 1.5% of the
market.**

**This is the best business of the five on economics alone.** It is fourth on
the recommendation only because of phase 3.

## 9. Go-to-market

### First 10

1. **Ride along on ten inspections.** Not demos — carry the clipboard. This trade
   cannot be understood from a spec.
2. **Find the deficiency-to-quote gap** in each and put a dollar figure on it.
   That figure is your pitch.
3. **Charge from customer one.**

### First 100

| Channel | Why |
|---|---|
| **AFSA and NFSA (fire sprinkler contractor associations)** | Where this buyer's continuing education and standards discussion happens |
| **NICET certification communities** | Inspectors hold NICET credentials; that is where they gather professionally |
| **Fire-protection distributors** | Same weekly-visit leverage as the other trades |
| **The report itself** | Every report reaches a building owner and an AHJ with your footer on it |
| **AHJ relationships** | An AHJ who finds your report format clear will say so to contractors. **The most under-priced channel in this trade** |
| **The published price** | Write the comparison post nobody else can write, because nobody else publishes a price |

### The sales script

> *"What do you do when you can't reach a device?"*
>
> *"How many of the deficiencies you found last month actually got quoted?"*
>
> — That second number is the whole sale. Do not fill the silence.

## 10. Battle card

| Competitor | Position | They win | You win |
|---|---|---|---|
| **BuildingReports / ScanSeries** | Barcode-scanned device inspection; "Contact for pricing" [vendor] | **Real moat: a building already tagged is a building already switched.** Deep AHJ familiarity | Opaque pricing, per-application licensing, aimed at larger operations |
| **Inspect Point** | Fire inspection & service software; pricing not published [vendor] | Purpose-built, established | No published price. Not offline-first by design |
| **iWorQ** | AHJ-side inspection management | Municipal relationships | Different buyer |
| **SafetyCulture** | General checklists, published tiers [vendor] | Cheap, flexible, transparent | Generic — no NFPA logic, no deficiency pricing, no compliance report |
| **Paper** | What many still use | Free, trusted, works everywhere | Retyped twice; deficiencies never quoted |

**The line:** *Everyone else makes you call for a price. Ours is on the page, it's
flat, and it works in the basement.*

**On BuildingReports' tag moat, honestly:** you will not win a building already
tagged. Target contractors *not* on a tag system, and new buildings.

## 11. Legal and risk

**Highest regulatory exposure of the five.**

| Risk | Posture |
|---|---|
| **An AHJ rejects a report format** | Test 1 and phase 8 exist for this. **Get one report accepted before selling to anyone** |
| **A missed deficiency contributes to a fire** | The "not verified" record is the defence. It must be impossible to omit — enforced in the data model, not the UI |
| **Jurisdictions mandating specific systems** | Some do. Qualify for it on the first call; do not discover it after onboarding |
| **NFPA copyright** | **Get advice before shipping.** NFPA standards are copyrighted. Encoding *what to inspect* as your own checklist is different from reproducing standard text, and the line needs a lawyer, not a guess |
| **Stale editions** | Store the edition with every inspection; print it on the report |
| **Insurance** | E&O before the first paying customer |

**The NFPA copyright question is a blocking item.** Resolve it in week one,
alongside Test 1.

## 12. Metrics and kill criteria

1. **Inspections completed per contractor per month**
2. **Deficiencies quoted ÷ deficiencies found** — the money metric and the pitch
3. **"Not verified" answers per inspection** — proves the differentiator is used
4. **Reports accepted by an AHJ without rework**
5. **Month-3 retention**

| Signal | Window | Action |
|---|---|---|
| One report type takes over a month to encode | Week 4 | **Stop, or narrow to one jurisdiction and one system type** |
| NFPA copyright advice comes back restrictive | Week 2 | Re-scope to a self-authored checklist, or stop |
| An AHJ rejects the format twice after iteration | Month 6 | Format is not the problem — the market is. Stop |
| Deficiency-to-quote ratio already near 100% in the field | Month 2 | The money argument is gone. Re-pitch on offline + provenance alone, at a lower price |

## 13. The 90-day plan

| Weeks | Focus | Done means |
|---|---|---|
| **1** | **Test 1 (reproduce one accepted report) + NFPA copyright advice** | A go/no-go on the two blocking risks |
| **2–4** | Offline core: store, sync, conflict resolution | Full function with the radio off; conflicts surface to a human |
| **5–7** | Form engine + three-state answers | One NFPA 25 section runs end to end offline |
| **8–11** | NFPA 25 annual checklist content | A complete real inspection, run in the app, in a real building |
| **12** | Report + one AHJ conversation | **An AHJ has looked at a report from your app and said what they think** |

**Day 90 milestone: an AHJ has read one of your reports.** Everything downstream
depends on that answer, so buy it as early as possible.
