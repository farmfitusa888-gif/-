# Trademark screen — results and three renames

Run 2026-08-28.

## What this is, and what it is not

**This is not a trademark clearance search.** `tmsearch.uspto.gov` is blocked by
this environment's egress policy, so I could not query the federal register.
What I ran instead is a **conflict screen**: searching for each name as an
operating business in or near its category, which reliably catches the loud
collisions and reliably misses the quiet ones.

> **A registered mark with no web presence will not appear in this screen.**
> Before spending money on any of these names, run the real search — free, at
> `tmsearch.uspto.gov`, in the relevant class (42 software, 36 insurance and
> financial, 44 medical and health, 45 legal and personal services).

With that said, the screen found three problems worth acting on immediately,
because a rename costs nothing today and costs a rebuild later.

---

## Results

| Name | Idea | Risk | What the screen found |
|---|---|:-:|---|
| **Backpay** | 1 · paycheck auditor | **LOW** | No operating conflict surfaced. Note it is *descriptive* of the service, which makes it easy to use and hard to protect. |
| **Overturn** | 2 · claim advocate | **LOW** | No operating conflict surfaced. |
| **Overquote** | 4 · second opinion | **LOW** | No operating conflict surfaced. |
| **Counterweight** | 5 · advocate software | **MEDIUM** | **Counterforce Health** — founded 2025, does AI-assisted health insurance claim appeals. Not the same word, but similar construction in an adjacent category. Different enough to proceed; close enough to check properly. |
| **Threshold** | 3 · benefits finder | **HIGH** | **Threshold Enterprises** (health products distributor since 1978, 309 employees), **Threshold VC**, **Threshold Brands**. A common word with an established health-sector user. |
| **Nightlight** | 7 · newborn nights | **HIGH** | Crowded and generic *in the exact category*: `getnightlightapp.com`, `babynightlight.app`, and multiple baby nightlight apps on both app stores. A descriptive term in its own category is the weakest possible mark. |
| **Steady** | 6 · 2am dementia line | **HIGH** | **Steady** — Atlanta gig-economy income app, $15M Series B, Shaquille O'Neal-backed, with a Wikipedia entry. One source suggests the service later folded, but **a folded company's mark does not automatically free up**, and the name is strongly associated. |

---

## The three renames

Decided and applied rather than left open, because nothing is built on these
three yet and the cost of deciding now is zero. **All three are reversible with a
find-and-replace in one config field.**

### Idea 6 — `Steady` → **Hearth**

`hearth.care`

The fire you keep going through the night; the centre of a home; the place
someone sits with you. Warm without being saccharine, domestic rather than
clinical, one syllable, and it carries *presence* rather than *treatment* —
which is exactly and honestly what the product provides at 2am.

Alternates: **Nocturne** (`nocturne.care`), **Vigil** (`vigil.care` — apt, but
the end-of-life association is a real risk for a dementia audience).

### Idea 7 — `Nightlight` → **Fourth**

`fourth.care`

From "fourth trimester" — the term new parents already use for exactly the
period this product serves. It is instantly meaningful to the buyer, means
nothing generic to a competitor, and is short enough to say at 3am. Crucially it
is **not descriptive of the goods**, which is what makes a mark protectable.

Alternates: **Wick** (`wick.care`), **Threshold** — no, see above.

### Idea 3 — `Threshold` → **Claimable**

`claimable.org`

Says the entire thesis in one word: this money is *claimable* and nobody claimed
it. Distinctive as a brand, obviously meaningful, and it avoids a 47-year-old
health-sector incumbent. The `.org` is deliberate — the buyer is hospitals,
health plans and senior services, and the domain signals mission rather than
extraction, which matters in that sale.

Alternates: **Unclaimed** (`unclaimed.org`), **Owed** (`owed.care`).

---

## Counterweight — keeping it, with a condition

Counterforce Health is close enough to notice and far enough to proceed:
different word, different second element, different customer (they serve
patients; Counterweight serves professional advocates).

**The condition: run the real TESS search in class 42 before printing anything
or filing.** If the register shows a live mark for "Counterforce" or
"Counterweight" covering claim-related software, take one of the alternates in
`00-NAMES.md` — Fulcrum or Sidebar — and change one config field.

## Final name list

| # | Idea | Name | Domain | Screen |
|---|---|---|---|:-:|
| 1 | Paycheck auditor | **Backpay** | `backpay.co` | LOW |
| 2 | Claim advocate | **Overturn** | `overturn.co` | LOW |
| 3 | Benefits finder | **Claimable** | `claimable.org` | *renamed* |
| 4 | Second opinion | **Overquote** | `overquote.com` | LOW |
| 5 | Advocate software | **Counterweight** | `counterweight.app` | MEDIUM |
| 6 | 2am dementia line | **Hearth** | `hearth.care` | *renamed* |
| 7 | Newborn nights | **Fourth** | `fourth.care` | *renamed* |

## The 20-minute job that finishes this properly

For each of the seven, at `tmsearch.uspto.gov`:

1. Search the exact word. Filter to **live** marks.
2. Check classes **42** (software), **36** (insurance/financial), **44**
   (medical/health), **45** (legal/personal services).
3. A live mark in a *different* class is usually survivable. A live mark in
   **your** class is a stop.
4. Then check the domain and both app stores.

**This is the cheapest risk in the entire project to retire, and the screen above
does not substitute for it.**
