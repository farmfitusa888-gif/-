# 4 — The chronology

**A medical timeline built on a laptop, priced per firm instead of per page.**

Industry: personal injury / disability / med-mal litigation · Buyer: the firm · Platform: Mac

---

## The gap

Before a personal injury case can be valued, someone reads every page of the
medical records and builds a dated chronology. It is the least glamorous and
most unavoidable task in the practice, and it is priced by the page.

2026 rates [review]:

| Route | Price |
|---|---|
| Offshore human reviewer | **$25/hour**; a 600-page case = 4–8 hrs = **$100–$200** |
| Full demand-ready chronology, 1,000–1,500 pages | **$3,000–$6,000 per case** |
| AI platforms | from **$400/month for 1,000 pages** |

Note the spread: $200 to $6,000 for roughly the same document count. The
difference is whether a clinician reads it. Note also the AI pricing — **$400 a
month for a thousand pages** is metering by the page with extra steps. One
serious case blows the allowance.

"Many personal injury and medical malpractice firms still rely on manual
processes that consume paralegal time and delay case evaluation" [review].

## Why cloud is disqualified

Medical records are PHI, and a plaintiff's firm handling them is a HIPAA
business associate of nobody — it holds the records under a signed
authorisation from its own client, whose entire medical history is in the file:
psychiatric admissions, substance use, HIV status, reproductive care. Records
predating the accident and irrelevant to it are in there too, because providers
send the whole chart.

Uploading that to a vendor — frequently an offshore one — is a disclosure the
client did not contemplate when they signed a medical release for their car
accident. **The strongest version of this product's pitch is aimed at the
client, not the lawyer: your records never left your lawyer's office.**

## What it is

A Mac application. Drop in the PDF pile — usually a mess of faxed, scanned,
duplicated, out-of-order provider records.

- On-device OCR and document classification: which provider, which visit, which
  date, which document type.
- **De-duplication first.** Provider record productions are 30–60% duplicates
  [assumption — this ratio is widely reported anecdotally and was **not
  sourced or measured**; it is the second thing to verify]. Collapsing them is
  the single biggest time saving and requires no clinical judgement at all.
- A dated chronology where **every row links to the source page image.** Not a
  citation — the actual pixels. One click from the summary line to the page it
  came from.
- **Gap detection**: the defence's favourite argument is a treatment gap. The
  tool surfaces every gap over 30 days, and every referral that has no matching
  record — meaning records are still missing, which is a task, not a finding.
- **It refuses to export a chronology containing any row a human has not
  opened.** Same discipline as ideas 1, 2 and 3.

## The innovation

Every competitor sells a summary and asks you to trust it. **This one sells a
chronology where trust is unnecessary, because every line is one click from the
page that produced it** — and it treats "records are missing" as the primary
output rather than an afterthought. A missing-records list is worth more to a
case than a prose summary, and no one leads with it.

## Money

Against a firm paying **$3,000–$6,000 per case**, or $400/month capped at 1,000
pages, an unlimited desktop subscription is an easy arithmetic argument.

| Price | Pays for itself when | Customers for $250k/yr |
|---|---|---|
| $199/mo | ~1 case/year avoided | 105 |
| $299/mo | ~1 case/year avoided | 70 |
| $499/mo | ~1–2 cases/year | 42 |

**42–105 firms.** Against >75% of 437,839 US firms having under six attorneys
[review], and PI being one of the largest solo/small-firm practice areas, the
required share is negligible. **The count of PI-practising small firms was not
established** and should be verified before sizing.

## Risks

- **Clinical judgement is the hard part and a 3B on-device model may not have
  it.** Extracting "MRI, L4-L5 disc herniation, 2024-03-12" is achievable.
  Deciding it is *causally related* is not, and the product must never pretend
  to. Scope it to extraction and let the lawyer do the medicine.
- **OCR on bad faxes** is the actual technical risk, more than the LLM. Faxed
  handwritten nursing notes defeat everything.
- Competitors are well funded (EvenUp, Tavrn, Legalyze) and moving fast.
- Volume: a 5,000-page record set on a laptop is an overnight job.

## The one test that settles it

**Cost: one day, no code.** Obtain one real de-identified record production of
1,000+ pages. Run on-device OCR plus a local model over it. Measure exactly two
things:

1. **Date-and-provider extraction accuracy** per document.
2. **Duplicate detection rate** against a hand count.

**Decision rule, written first:** if date-and-provider extraction is below 95%,
the paralegal must re-check every row and the tool has saved nothing. If
duplicate detection alone exceeds 90%, **the product is viable even if the
summarisation is mediocre** — de-duplication by itself is worth the
subscription, and that is the cheapest possible version to ship first.
