# 2 — The inspection that has to hold up

**Fire and life-safety inspection, done offline in a mechanical room, ending in
a signed report and a priced repair quote.**

An NFPA inspection report is not a work product. It is a **legal document** that
an authority having jurisdiction, an insurer and eventually a lawyer will read.

---

## The job today

A one-truck fire-protection contractor inspects sprinkler systems, extinguishers,
alarms and backflow preventers. The work happens in basements, mechanical rooms,
stairwells and riser closets — **the places with no signal**. The inspector
writes on paper, drives back, and retypes everything that evening.

Then the deficiencies found get retyped a second time into whatever produces the
repair quote, and a third time into whatever invoices it.

## Where it sits

| Product | What it is | Price | Source class |
|---|---|---|---|
| Inspect Point | Fire inspection & service software | **not published** | [vendor] |
| BuildingReports / ScanSeries | Barcode-scanned device inspection, compliance reporting | **"Contact for pricing"** | [vendor] |
| iWorQ | Fire inspection management, AHJ-side | not published | [vendor] |
| SafetyCulture | General inspection checklists | published tiers | [vendor] |
| **This** | Offline inspection → deficiency → priced repair → signed report | flat, published | — |

**The finding worth more than any price I could have found: there is no price.**
Both category leaders quote. Neither publishes a number. I searched for
per-device pricing and the result was that both "use custom/quote-based pricing
models rather than transparent per-device pricing structures" [review].

A market where nobody publishes a price is a market where the small buyer is
being charged what they will bear, and where a **published, flat, unlimited
number is itself the marketing**. That is Trueline's flat-vs-metered argument,
handed to you by the competition's own pricing page.

## The wedge

Three things, in the order a buyer cares:

**1. It works in the basement.** Offline-first is a checkbox in every competitor's
feature list and the actual daily reality of this trade. Trueline is already
built full-offline with real conflict resolution on sync. Here that is not a
nice-to-have — it is the job.

**2. The report says what was tested and what was assumed.** A device the
inspector could not reach, a valve that could not be exercised, a head hidden
above a hard ceiling — today these silently become a clean line on a report.
Trueline's provenance model marks each one, and the report prints the
distinction. **An inspector's signature is on that document.** Being able to
prove what you did and did not verify is not a feature; it is professional
indemnity.

**3. The deficiency becomes money the same day.** Found → photographed with
camera pose → priced off the price book → quoted → signed, before leaving the
building. Today that is three products and two rounds of retyping, and a
meaningful share of deficiencies never get quoted at all because the retyping
never happens.

## The four-pattern check

- **A — trusted data.** Provenance on a legal document, where "not verified" is
  a real and currently invisible category.
- **B — whole job.** Inspection software + quoting + invoicing is two or three
  subscriptions that share no data.
- **C — sensor → money.** Camera with pose, measured travel distances and head
  spacing, barcode/QR device identity → deficiency → priced repair → e-signature.
- **D — small operator.** Quote-based pricing is metering with the meter hidden.

## What gets built

Reuses the Trueline halves almost wholesale: photos-with-pose, the provenance
model, the price book, the proposal with e-signature and audit trail, the
scheduling and invoicing, the offline sync, the PDF pipeline.

**New:** the NFPA form logic (25 for sprinkler, 10 for extinguishers, 72 for
alarms), device inventory with barcode identity, and inspection *frequency*
tracking — annual, quarterly, five-year — which is the recurring revenue engine
of the whole trade and the reason a customer never churns.

**The frequency tracker is the retention mechanism.** A contractor whose next
twelve months of inspection obligations live in your app does not cancel in
month four. Compare that to Trueline's own stated risk, where churn "is the one
number that decides whether this is a business."

## The gate and the price

- **Free forever** — inspect, photograph, one building's device inventory.
- **Paid** — reports, deficiency quoting, unlimited buildings, frequency
  scheduling, e-signature.

**$89/month, flat, unlimited buildings and devices, price published on the
page.** Being the only published price in the category is the pitch.

## Where it fails, ranked by likelihood

1. **The forms are the product, and the forms are enormous.** *(Most likely.)*
   NFPA 25 alone is a large, versioned, jurisdictionally-varied body of
   requirements, and AHJs accept different formats. This is a research and
   maintenance burden that never ends, and it is not a burden a solo builder
   carries lightly. **This is the single biggest risk in the set.**
2. **Certification and liability.** *(Plausible.)* If the app formats a report
   an AHJ rejects, the contractor is exposed. Some jurisdictions mandate
   specific systems outright.
3. **BuildingReports owns the barcode.** *(Plausible.)* Their model puts a
   scannable tag on every device in a building. A building already tagged is a
   building already switched — that is a real moat and it is already installed.

## The one test that settles it

Take one real NFPA 25 annual sprinkler report that an AHJ has already accepted,
and reproduce it exactly from the app's data model. If the form logic for one
report type is a week, this is buildable. **If it is a month, it is not** — and
you will know inside that first week.
