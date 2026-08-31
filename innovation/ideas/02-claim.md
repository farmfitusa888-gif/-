# 2 — The claim advocate

> **CORRECTED 2026-08-31, and the correction matters.** This brief quotes the
> national public adjuster fee range of 10-20% and models the business at 15%.
> **Both launch states cap it lower.** Texas Insurance Code § 4102.104 caps a
> public adjuster's total commission at **10% of the settlement**; Illinois
> (215 ILCS 5, Art. XLV) caps it at **10% for a personal residence**. The 15%
> and 20% figures below are unlawful in Texas and Illinois, and every money
> figure in this brief is therefore optimistic by a third to a half. The
> recomputed numbers are in [`../buildouts/02-overturn/PLAN.md`](../buildouts/02-overturn/PLAN.md).
>
> That plan also finds that the partnering structure chosen for this business
> is **not available in either launch state**. See the licensing section there
> before acting on anything below.
>
> Statute text reached this project through search summaries rather than the
> source pages, because the egress proxy blocks the statute sites. Verify with
> a Texas insurance-regulatory lawyer before relying on it.

**Insurers brought AI to the claim. The homeowner brought a phone call.**

`PROVEN — money already changing hands` · Buyer: the homeowner · Form: service with AI inside, contingency

---

## The gap

The clearest asymmetry in this entire document, and both halves are sourced.

**What the insurer has:**

- **95.2%** of all insurtech funding in Q1 2026 went to AI companies [review]
- **65%** of insurers plan scaled AI agents for claims processing in 2026 [review]
- AI claims automation resolves claims **75% faster** at **30–40% lower cost** [review]
- The named companies are large: Shift Technology ($320M raised), Snapsheet
  ($130M), Tractable ($100M+) [review]

**What the homeowner gets:**

- The five largest home insurers closed **more than 44%** of 2025 claims with **no
  payment** — up from **36%** a decade earlier [review]
- **15 large US insurers** closed at least **50%** of homeowner claims with no
  payout in 2025; the worst named was **78%** [review]

And the honest caveat, which the source itself supplies and I am not going to bury:
**"closed with no payment" also counts claims below the deductible and claims the
homeowner withdrew.** Not all of these are wrongful denials. But the *trend* — 36%
to 44% in a decade — is not explained by deductibles, and a withdrawn claim is
often just a homeowner who gave up.

**The most important sentence I found in this research** describes where all that
funding is going:

> The current wave of insurtech focuses on **infrastructure providers rather than
> consumer-facing disruptors.** [review]

Ninety-five percent of the money, aimed entirely at one side of the table.

## The price is already set

Public adjusters — licensed professionals who fight the claim for you — charge
**10–20% of the settlement**, typically **10–15%** on residential property.
Florida caps it by statute at **10%** in the year after a declared emergency and
**20%** otherwise [review]. They work on contingency, essentially universally.

That is a functioning market with an established price. Nobody has to be
convinced the service is worth buying.

For scale on a single common claim type: the average water damage claim is
**$15,400**, water and freezing are **23%** of all homeowner claims, and about
**1 in 60** insured homes files one each year [review].

## What it is

Not software sold to homeowners. **A service that takes claims on contingency** —
because that is how this market already buys, and because it aligns you with the
outcome instead of the subscription.

The AI does the part that makes public adjusting expensive and slow:

- **Reads the policy properly.** Declarations, endorsements, exclusions,
  sub-limits. The single most common reason a homeowner accepts a denial is that
  they cannot tell whether it was correct, and the policy is forty pages of
  cross-references written to be read by a professional.
- **Matches the denial letter against the policy** and finds the specific clause
  that contradicts it, or confirms the denial was right — which is a real and
  valuable answer, and the one an honest business must be willing to give.
- **Builds the evidence file** from photographs, contractor estimates and weather
  data, in the format the carrier's own system expects.
- **Tracks every statutory deadline.** Proof-of-loss windows, appraisal demands,
  and state prompt-payment clocks. Missing one is how homeowners lose claims that
  were valid.

## The innovation

Public adjusting doesn't scale because a licensed human must read every policy.
**This makes reading the policy free, so the human is spent only on the claims
worth fighting** — and it can therefore take small claims that no public adjuster
will touch, which is the majority of them and the entire underserved bottom of
the market.

## Money

| Fee | Per claim | To reach $30k/mo |
|---|---|---|
| 15% of an $8,000 uplift | $1,200 | **300 claims/yr — 25 a month** |
| 20% of an $8,000 uplift | $1,600 | **225 claims/yr — 19 a month** |
| 15% of a $15,400 claim | $2,310 | **156 claims/yr — 13 a month** |

**Thirteen to twenty-five claims a month** is the entire business. After any
significant hail or freeze event, a single affected metro produces thousands.

The **$8,000 uplift is my assumption**, not a sourced figure — it is the number
this model is most sensitive to and the first thing to establish from real files.

## Risks

- **Public adjuster licensing is real and state-by-state.** Negotiating a claim
  for a fee generally requires a licence, and unlicensed practice is enforced.
  **The compliant structure is to employ or partner with licensed adjusters and
  sell them leverage** — which is idea 5, and the two are natural siblings.
- **Post-catastrophe fee caps** compress the margin exactly when volume is highest.
- **Reputation risk is severe.** Post-disaster claim assistance is a category with
  genuine predators in it, and being mistaken for one is fatal.
- Carriers will deploy counter-AI. This becomes an arms race, and they are better
  funded.

## Where to start — no phone calls required

**Get twenty real denial letters and their policies** — they are widely posted in
public consumer complaint forums and by law firms as examples — and measure one
number: **how often the model finds a policy provision that contradicts the stated
denial reason, and how often a licensed adjuster agrees with it.**

That single measurement establishes whether the product works, and it is exactly
the test DoNotPay skipped.
