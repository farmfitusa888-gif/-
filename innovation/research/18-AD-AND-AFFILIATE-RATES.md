# What a Flood Facts session is actually worth

Written 2026-09-01. Commissioned to replace the working assumption in
`14-NO-CUSTOMER-STRUCTURES.md` (a flat $25 session RPM, used as a placeholder
for "a decent niche") with a rate specific to insurance and personal finance,
and to test whether the affiliate half of the revenue plan survives the
constraint that the operator never becomes an insurance producer.

Document 14 did the general arithmetic. This one does the category.

---

## Verdict

| | | Confidence |
|---|---|---|
| **Session value to plan on, year one** | **$8 per 1,000 sessions.** That is AdSense or Journey money, because those are the only doors open below 25,000 pageviews. | Low-moderate |
| **Session value to plan on, once a premium network accepts the site** | **$20 per 1,000 sessions** outside Q4. Band $12–35. Deliberately below the $25–60 the blogs quote for finance, for two reasons given in section 1. | Low |
| **Sessions for $5,000/month** | **250,000/month** at $20. **625,000** at $8. Neither is a year-one number. | High (arithmetic) |
| **Does the affiliate half survive the no-licence constraint?** | **Half of it survives, and it is the smaller half.** A flat fee per referral is permitted to an unlicensed website in New York and Washington. A commission contingent on the reader buying a policy is not. Nearly every insurance affiliate programme worth naming pays the second way. | Moderate |
| **Can a sole proprietor be accepted by the ad networks?** | **Yes, on the evidence, for all of them.** No network was found to require an entity. This is the one recurring trap in this project that does not close here. | Moderate |
| **The finding that should change the plan** | The README's claim that Flood Facts "survives what killed the ad-supported category, because the answer requires the reader's own address" **does not hold up.** The largest study available found that long queries trigger AI Overviews roughly five times as often as short ones. Specificity is the trigger, not the shield. Section 7. | Moderate |
| **The second finding that should change the plan** | Mediavine's stated content bar is original, manually created, long-form writing. A programmatically generated county-and-zone site is the shape of thing both Mediavine and Google's scaled-content-abuse policy describe when they describe what they reject. Section 2. | Moderate |

Nothing is committed here. This is input to a decision the owner makes.

---

## Read this first

**Every primary source was blocked.** The egress proxy answered 403 to CONNECT
on `help.raptive.com`, `help.mediavine.com`, `www.mediavine.com`,
`support.google.com`, `ahrefs.com`, `thewebsiteflip.com`,
`www.insurancejournal.com`, `www.dfs.ny.gov`, `www.insurance.wa.gov` and
`lawfilesext.leg.wa.gov`. Ten hosts, one attempt each. A direct `curl` to the
Washington advisory returned `CONNECT tunnel failed, response 403`, which is the
same wall.

So there is **not one `[verified]` claim in this file** and I am not going to
dress one up as if there were.

| Label | Meaning | Where it applies |
|---|---|---|
| `[verified]` | Primary document read in full | **Nowhere. Zero claims.** |
| `[review]` | Search-index summary of a named source | Almost everything |
| `[conflict]` | Sources disagree | Sections 1, 2, 7 |
| `[NOT ESTABLISHED]` | Could not find it, refusing to guess | Section 8 |

**A second warning that matters more than the first.** The RPM-by-niche figures
circulating online are almost entirely published by sites that sell ad-tech
services, affiliate plugins, or SEO tools. Several of the pages that surfaced
for these searches carry the marks of machine generation: a 2026 date stamp, a
round-number range, no methodology, no sample size, no named publisher. Neither
Mediavine nor Raptive publishes network-wide RPM by vertical. **There is no
auditable source for "what an insurance site earns per session."** Every figure
in section 1 is somebody's marketing content until proven otherwise, and I have
weighted my planning number down accordingly.

No rate, threshold, percentage or payout in this document was invented.

---

## 1. What display advertising pays for insurance and personal finance

### The reported figures, with the network attached

| Figure | Network | Year | Source type | Label |
|---|---|---|---|---|
| 68% revenue share to the publisher on AdSense for Content, unchanged since 2003 | Google AdSense | stated as current | Google support page, via summary | `[review]` |
| Average RPM $2.34 | AdSense | cited 2026 | third-party comparison | `[review]` |
| Session RPM commonly $15–40, "some crossing $50 during Q4" | Mediavine | 2026 publisher-reported | blog aggregation | `[review]` |
| RPM $12–30 average | Mediavine | 2026 | competing blog aggregation | `[conflict]` with the row above |
| Finance-niche RPM $25–60 | Mediavine | April 2026 | single low-quality source | `[review]`, weak |
| One publisher: Jan 2026 ~$34, Feb 2026 ~$44 | Mediavine | 2026 | individual report, niche not stated | `[review]` |
| Average RPM $31.55 | Mediavine | cited 2026 | third-party study, methodology not seen | `[review]` |
| RPM $18–50+ | Raptive | 2026 | blog aggregation | `[review]` |
| One publisher: $45–55 settling near $50 after switching Oct 2025; Q4 near $60 | Raptive | 2025–26 | individual report | `[review]` |
| $12.69 average RPM, first 90 days | Journey by Mediavine | 2026 | individual report, **travel** blog | `[review]` |
| Roughly $10–30/month at 1,000 sessions | Journey by Mediavine | 2026 | blog | `[review]` |
| Insurance $40–80 RPM, US-focused | "AdSense" | 2026 | SEO listicle | `[review]`, **discard** |

That last row is why the warning above exists. An AdSense RPM of $40–80 is
several times the same page's own stated AdSense average, on the same page, with
no reconciliation. It is a keyword-bait number. I am recording it and throwing
it out.

### The one figure that behaves like a market price

Programmatic benchmarks published from the buy side triangulate better than
publisher-side blog claims, because advertisers have to reconcile them against
spend:

- Open-exchange CPM $1–4; private-marketplace CPM $5–15 `[review]`
- Google Display Network average CPM $3.12; PMP average $8.20 `[review]`
- **Financial services carries the highest average programmatic CPM at $6.80**,
  attributed to compliance restrictions shrinking eligible inventory while
  in-market audiences stay contested `[review]`

Here is the arithmetic that follows, which is mine and can be checked. A page
carrying five viewable slots at a $6.80 advertiser-side CPM grosses $34 per
thousand pageviews before anyone takes a cut. The ad-tech supply chain takes a
share between the advertiser and the network, and the network then takes 25–30%.
I could not establish the size of the supply-chain take `[NOT ESTABLISHED]`, so
this cannot be resolved to a point. But at a total pass-through of 50–60%, the
publisher sees roughly **$17–20 per thousand pageviews**. That lands inside the
$15–40 band the blogs report and nowhere near the $40–80 the listicles claim.

### Why I am planning below the reported band, not inside the top of it

**Pages per session.** Session RPM is page RPM multiplied by pages per session.
Flood Facts is a lookup. Somebody arrives on a county page, reads the median
premium and the paid-share figure, and leaves. A recipe blog or a personal
finance explainer gets three or four pages out of a visit. If Flood Facts gets
1.2, then the same page RPM produces roughly a third of the session RPM, and the
$15–40 "Mediavine session RPM" band is not the right comparator at all. This is
the single largest reason the premium-vertical uplift may not arrive.

**The finance premium is real but it is not the only variable.** Geography
matters as much as topic: traffic outside the US, UK, Canada and Australia is
reported to earn 50–80% less `[review]`. Flood Facts traffic would be almost
entirely US, which is the good side of that. Set against it, insurance
advertisers buy in-market intent, and a reader looking up what a policy costs in
their county is closer to in-market than a reader of a general explainer. Those
two pull in opposite directions and I cannot net them out with the evidence
available.

**Planning number: $20 per 1,000 sessions once on a premium network, $8 before.**
Lower than document 14's generic $25 despite this being a higher-value category,
because a one-page-per-visit tool in a premium vertical is not the same asset as
a multi-page site in an average one.

---

## 2. The ladder, and the thresholds that actually bind

Thresholds first, because for a site starting at zero they are the constraint
that decides everything else.

| Network | Entry threshold | Exclusive? | Revenue share | Reported RPM |
|---|---|---|---|---|
| **Google AdSense** | None stated. 18+, own content, policy-compliant | No | **68%** on AdSense for Content | $2.34 average `[review]` |
| **Journey by Mediavine** | **1,000 sessions/month**, from 15 Jan 2026. Grow plugin required | Yes, for programmatic display | **70%** | $12.69 in one travel-niche report `[review]` |
| **Monumetric — Propel** | **10,000 pageviews/month**, **$99 setup fee** | Yes | **70%** | not established for finance |
| **Raptive** | **25,000 pageviews/month** (cut from 100,000 in Oct 2025). 25k–99,999 needs ≥50% US/UK/CA/AU/NZ; 100k+ needs 40% | Yes, for programmatic display | not established | $18–50+ `[review]` |
| **Monumetric — Ascend** | 80,000–500,000 pageviews, no setup fee | Yes | **75%** | not established |
| **Mediavine — Official** | **$5,000 trailing-12-month ad revenue**, replacing the old 50,000-session rule | Yes, for programmatic display | **75%** | $15–40 session RPM `[review]` |
| **Playwire** | 100,000 pageviews/month | not established | not established | not established |
| **Ezoic** | **250,000 monthly users**, from 19 Feb 2026 | not established | not established | not established |
| **Freestar** | 1,000,000 pageviews + 6 months of history | not established | not established | not established |
| **Sovrn** | No stated minimum; manual quality review | not established | not established | not established |
| **Mediavine — Select** | $100,000–$249,999 annual ad revenue | Yes | **80%** | — |

All figures `[review]`.

**Two structural things fall out of that table.**

The ladder is no longer a traffic ladder at the top. Mediavine moved from a
session threshold to a revenue threshold, and Journey auto-promotes a site to
the main network once it clears $5,000 of trailing-twelve-month ad revenue. So
the question "how much traffic do I need for Mediavine" has been replaced by
"can I earn $5,000 a year on Journey's 70% share first." At Journey's reported
$12.69 RPM that is about 33,000 sessions a month sustained for a year, which is
in the same territory as the old 50,000-session rule and not obviously easier.

Ezoic went the wrong way and is now out of reach. It raised its floor to 250,000
monthly users on 19 February 2026, grandfathering existing publishers only while
they stay integrated `[review]`. There are references to an "Access Now"
self-serve route for sites under 10,000 pageviews and an "Incubator" taking
twenty publishers a month below the threshold `[review]`, which sits oddly
against a 250,000-user floor. `[conflict]`. Ezoic should be treated as closed
until one of those is confirmed.

**Exclusivity.** Mediavine and Raptive both require exclusivity over programmatic
display, and both allow affiliate links, direct-sold placements and sponsored
work alongside `[review]`. Both are terminable on thirty days' written notice,
and Mediavine's cannot be terminated during the set-up period `[review]`. That
is a tenancy, as document 14 said of the whole category, but a short one.

### The content bar, which is the real problem

Mediavine's stated requirement is content that is **original, high quality and
created manually**, with programmatic content named as a rejection reason, and
an average post length usually above 1,000 words `[review]`. Raptive is
described as looking for the same long-form depth plus design polish `[review]`.

Flood Facts, as designed, is one generator producing thousands of county-and-zone
pages from a FEMA extract. That is exactly the shape Google's scaled content
abuse policy describes when it names "pure template-with-variable substitution at
scale" and "aggregator sites that added no additional context beyond the source
data" `[review]`. Sites hit by that policy are reported to have lost 60–90% of
rankings inside fourteen days of a rollout `[review]`.

There is an exception, and Flood Facts arguably sits inside it: the policy is
reported to spare programmatic pages built on genuinely unique structured data,
naming comparison tools with live pricing as an example `[review]`. FEMA's
transaction files are unique structured data by any reading, and the median,
claim-frequency and paid-share figures are computed rather than scraped.

But that exception protects the site from Google. It does not obviously get it
past a human reviewer at Mediavine who has been told to reject programmatic
content and to expect thousand-word posts. **This is a live risk to the entire
premium-network path and it is not resolvable from here.** It would need a real
application to test, which costs nothing but requires the traffic first.

---

## 3. Can a sole proprietor with no company be accepted

This has been the trap in this project three times. It does not close here.

| Network | Individual accepted? | Evidence | Label |
|---|---|---|---|
| **Google AdSense** | **Yes.** The account type field is "Individual" or "Organization", with no difference in service or payment structure. Individual accounts pay to the account holder's own name, which must match the bank record. Requirements are 18+, a Google account, and original content | Google support pages via summary | `[review]` |
| **Ezoic** | **Yes.** Ezoic collects W-9 from US publishers and issues **1099-NEC** to publishers paid $600 or more, explicitly noting the forms are not sent to corporations | Ezoic support pages via summary | `[review]` |
| **Mediavine** | **Yes, on the evidence.** Mediavine's help centre has a "Choosing a Tax Document" page directing US publishers to a W-9 and advising them to work with an accountant. Nothing found requires an entity | Mediavine help centre via summary | `[review]` |
| **Raptive** | **No entity requirement found.** Published requirements are pageviews, geography, Google Analytics connection, organic traffic, content quality. Entity status is not among them | multiple secondary reviews | `[review]`, absence of evidence |
| **Monumetric** | **No entity requirement found**, but Monumetric-specific tax documentation was not established | secondary | `[NOT ESTABLISHED]` |

The Ezoic 1099-NEC detail is the strongest signal in the table, and it is
indirect rather than direct. A 1099-NEC is the form you issue to an individual
or a sole proprietor. Corporations are exempt from it. A network that routinely
issues them is a network whose publishers routinely are individuals.

**Honest reading:** for AdSense this is close to settled. For Mediavine, Raptive
and Monumetric it is an absence of any entity requirement in published material
rather than a stated welcome, and the publisher agreements that would settle it
are behind a wall this machine cannot reach. I would plan on yes and expect to be
right.

---

## 4. Affiliate economics in flood and home insurance

### First, a structural fact that removes most of the opportunity

**FEMA sets NFIP rates. They are identical whether the policy is bought direct
from the NFIP or through any Write Your Own carrier** `[review]`. FEMA pays WYO
companies a flat **15% of premium** for agent commissions, a figure negotiated
when the programme was built in 1983 `[review]`.

Read that twice, because it deletes a business model. There is no price
comparison to make on an NFIP policy. There is no carrier that can pay a
publisher more than another carrier for the same referral, because they are all
selling the same product at the same federally set price out of the same fixed
15%. The "compare quotes and take a cut" structure that funds every auto and
home insurance affiliate site does not exist for the NFIP.

What is left is the private flood market, which is real but small: roughly
**569,000 private residential flood policies in 2024**, up from about half that
in 2020, against **4.5 to 4.7 million NFIP policies** `[review]` `[conflict]`
on the exact NFIP count. Private insurers' share of direct premium rose from
about 13% a decade ago to about 27% in 2024 `[review]`.

### The programmes, and what they are reported to pay

No flood-specific affiliate programme was found. `[NOT ESTABLISHED]`. Neptune
Flood, the largest private flood writer, sells almost entirely through appointed
independent agents who must be licensed in the state being quoted `[review]`.
That is an agent appointment, not an affiliate programme, and it is exactly the
thing the constraint set rules out.

The adjacent home and general insurance programmes, all `[review]` and all
`[conflict]`-ridden because the listicles disagree with each other:

| Programme | Reported payout | Network | Conflict |
|---|---|---|---|
| Liberty Mutual | $3–$10 per lead, 30-day cookie | CJ | — |
| USAA | $1–$36 per lead, 30-day cookie | CJ | — |
| Lemonade | $15 per lead / $25.50 per sale / $10–25 per policy | various | three different figures, three sources |
| Hippo | $5 flat per lead, 90 days / $25–50 per policy, 30 days | ShareASale | two irreconcilable descriptions |
| Policygenius | $15–100 per lead, up to $120 per sale | various | — |
| Category generally | $10–$150+ per lead; "average around $20"; sales 10–20% of something unspecified | — | — |

I am not going to average those. They come from pages that exist to rank for
"best insurance affiliate programs" and several of them contradict themselves
inside a single row.

### The licence question, which is the one that matters

Two states were examined because both have published guidance that reaches
websites directly.

**New York.** The Department of Financial Services' Office of General Counsel has
issued a long series of opinions on referral fees to non-licensees, including one
titled "Referral Fee to Websites." The rule that emerges, `[review]` across
several of them:

> A brokerage firm may pay a referral fee to websites that link to the
> brokerage firm's website, **based on the referral lead only, not on the
> user's purchase of an insurance policy.** No monetary cap is stated in the
> Insurance Law. The non-licensee must not discuss policy terms and conditions
> with the prospect, and the fee must not be contingent on the referred person
> buying.

**Washington.** Stricter, and it is the state that has actually enforced.
Technical Assistance Advisory 2021-01, issued 19 February 2021 by then
Commissioner Kreidler, takes the position that **insurance review websites
violate the Insurance Code when they are not licensed as producers and solicit
consumers by urging them to apply for a particular kind of insurance from a
particular insurer, and that such urging requires a producer licence even if the
website receives no compensation at all** `[review]`. Two enforcement actions
were reported as already completed at the time of the commentary: one against a
review website, one against a licensed producer for accepting its business
`[review]`.

Washington's separate published guidance on referral compensation adds that
payment to an unlicensed person must be **conditioned on the submission of an
application** rather than on a sale, and that the value given **must not exceed
$100 in any consecutive twelve-month period** `[review]`. Whether that cap is
per referring person, and whether it is aimed at customer-referral schemes rather
than at commercial publishers, I could not establish `[NOT ESTABLISHED]`. If it
applies as written to an affiliate publisher, Washington affiliate revenue is
capped at about the cost of a domain renewal.

### Whether the affiliate half survives

**Partly, and the surviving part is the part nobody pays well for.**

What survives, on this reading:

- A flat fee per referral or per lead, not contingent on the reader buying
- A link that does not discuss policy terms and does not urge the reader toward
  a named insurer
- Display advertising, which is not affected at all: the operator does not
  choose the advertisers, does not endorse them, and is not compensated per
  policy

What does not survive:

- **Any commission contingent on a sale.** Per-policy payouts, percentage of
  premium, revenue share on a bound policy. New York's opinions rule these out
  for an unlicensed referrer, and the reasoning is the standard Producer
  Licensing Model Act reasoning that most states share.
- **Comparison and recommendation.** "Here are the three best flood insurers for
  Harris County" is the exact conduct Washington's advisory describes.
- Anything that looks like soliciting in Washington, compensated or not.

The site's own design already avoids the worst of this. It collects no contact,
so the form always lives on somebody else's domain, and the operator never holds
a prospect's information. That is the right architecture. It is just not enough
on its own, because Washington's theory of liability does not turn on the form
or on the money. It turns on the urging.

**The affiliate line that is clearly safe is the one that has nothing to do with
insurance.** Sump pumps, backflow valves, water alarms, flood barriers, elevation
certificates. Amazon Associates pays **3%** on home improvement and tools
`[review]`, cut from 8% in April 2020 and never restored. On a $200 sump pump
that is six dollars. It is real revenue and it requires no licence, no entity
and no judgement about anyone's coverage. It is also small.

---

## 5. Seasonality, and the shape of the traffic

The intuition in the brief is right about the spike and probably wrong about the
conclusion.

**Traffic.** Atlantic hurricane season runs 1 June to 30 November, with the
majority of activity between mid-August and mid-October `[review]`. Search
interest tracks named storms rather than the calendar: the 2017 Harvey and Irma
sequence produced the highest hurricane-related Google search volume on record,
and searches from affected states in the run-up included flood insurance
specifically `[review]`.

**Ad rates.** Q4 CPMs are reported to rise 70–100% across the quarter, January to
fall 30–40% from the Q4 peak, and the "Q5" window from 26 December to 15 January
to fall 40–60% `[review]`. Google's own display CPM fell 14% from December 2023
to January 2024, $19.70 to $16.94 `[review]`.

Those two curves are **partly** aligned, which is better luck than this site
deserves. Peak storm interest in September and October sits on the rising edge of
Q4 rates. The trough of flood interest in January and February sits in the ad
market's own trough, so the bad months are bad twice rather than offsetting.

**Three things cut against "it earns most of its money in a few weeks."**

The NFIP has a **30-day waiting period** before coverage begins `[review]`. A
reader searching during a named storm cannot act on the answer. The programme is
built that way on purpose, because without it the fund would fail in one season.

Private carriers impose **binding moratoriums** once a storm is named, typically
24 to 48 hours before impact, lifting 24 to 78 hours after `[review]`. The NFIP
itself is reported not to be subject to a moratorium `[review]`. So at the exact
moment traffic peaks, the private market that pays affiliate commissions has
stopped writing business. The spike is worth display revenue and close to nothing
in affiliate revenue.

And the largest single driver of flood policy purchases is not weather at all. It
is **mortgage closings**. During the June 2010 NFIP lapse, an estimated 1,400+
home sale closings a day were cancelled or delayed for want of a policy, over
40,000 a month `[review]`. Lender-required purchase is year-round, follows the
housing market rather than the hurricane, and is the demand a cost-lookup page
actually serves. Somebody under contract on a house in a flood zone, three weeks
before closing, wanting to know what the premium will do to their monthly
payment. That reader exists in February.

**Conclusion on seasonality:** expect a pronounced August-to-October bulge on top
of a real year-round base, not a business that lives on three weeks. The bulge is
worth more per session than the base because it lands near Q4. The affiliate
value of the bulge is close to zero, because nobody can bind during it.

---

## 6. The arithmetic

Monthly sessions required, at the three rates in section 1. The rates are
`[review]` and weak; the arithmetic is mine.

| Target/month | At $8 RPM (entry tier) | At $20 RPM (planning) | At $35 RPM (good outcome) |
|---|---|---|---|
| $1,000 | 125,000 | 50,000 | 28,600 |
| **$5,000** | **625,000** | **250,000** | **142,900** |
| $10,000 | 1,250,000 | 500,000 | 285,700 |

Document 14's $25 placeholder put $5,000 at 200,000 sessions. This work moves
that to 250,000, and to 625,000 if the site never gets past the entry tier. The
premium vertical did not make the problem smaller. It made it slightly larger,
because the tool-shaped session is worth less than the article-shaped one.

### Against what a new site actually gets

A new domain with no backlinks is indexed in days to weeks, ranks for long-tail
low-competition terms in **2–4 months**, produces measurable traffic at **4–8
months**, and competes for head terms only after **12+ months** `[review]`.
Twelve months is described as the first serious checkpoint, not the payoff.

The competitive set is the problem. A search for "flood insurance cost" returned
Progressive, FEMA, LendingTree, Policygenius, NerdWallet and AAA, though this was
a search index rather than a live Google organic SERP and should be treated as
indicative `[review]`. State-level
pages ("how much is flood insurance in New York") are already published by
Policygenius and LendingTree. Those are companies with licensed insurance
operations, in-house legal, and domain authority accumulated over a decade. The
county-and-zone gap is genuinely open. It is open partly because the volume there
is thin, which is the same reason it is open.

And the environment is contracting under everyone. Google referral traffic to
publishers is reported down **38% year on year** as of January 2026, zero-click
searches at **69%** of queries `[review]`.

**So the honest answer on the gap.** From zero to 50,000 sessions a month, on a
genuinely differentiated public-data asset in a US-only vertical, is a
plausible eighteen-to-thirty-month project. That is the $1,000/month line at the
planning rate, and it assumes a premium network accepts a programmatic site,
which section 2 says is not safe to assume. From zero to 250,000 sessions is a
different category of undertaking, and document 14's estimate of three to five
years with an uncertain outcome stands. Nothing found here shortens it.

**Bridgeable to $1,000/month: probably, slowly. Bridgeable to $5,000/month:
not on the evidence, not solo, not in a timeframe worth planning around.**

### The affiliate line, sized honestly

I will not put a number on affiliate revenue, because doing so requires a
click-through rate and a lead-completion rate and I established neither.
`[NOT ESTABLISHED]`.

What can be done is inverting the unknown. At a $20 session RPM, display earns
$0.02 per session. For a flat per-referral programme paying $15 per lead to match
that, the site would need **one completed referral per 750 sessions**. At $5 per
lead, one per 250 sessions. Whether a county premium-lookup page converts at
those rates is the question, and it is answerable only by running it.

The useful thing about that framing: it shows the affiliate half is not
obviously smaller than the display half. One lead per 750 sessions is not an
absurd bar. But it also shows the whole affiliate case now rests on flat
per-referral programmes, which are the minority of what is offered, in a vertical
where the NFIP has no comparison shopping and the private market stops binding
exactly when traffic peaks.

---

## 7. The thing that could kill it, tested rather than assumed

The README argues Flood Facts survives AI Overviews because "the answer requires
the reader's own address, so an AI summary cannot pre-empt it."

I went looking for evidence for that argument and found evidence against it.

**The largest study available.** Ahrefs analysed **146 million SERPs** against 86
keyword traits `[review]`. Findings relevant here:

- AI Overviews appear on **21%** of keywords overall, baseline 20.5%
- **Single-word queries trigger them 9.5% of the time. Queries of seven or more
  words trigger them 46.4% of the time.**
- **99.9%** of AIO-triggering keywords are informational in intent
- YMYL queries overall trigger at **34.3%**; medical YMYL **44.1%**; safety
  **31.0%**; **financial YMYL 22.9%**
- Little correlation between CPC bucket and AIO appearance, most buckets within a
  couple of points of baseline

A separate study found long-tail phrases of four or more words trigger AI
summaries at roughly twice the rate of one- and two-word head terms `[review]`.

**"What does flood insurance cost in Harris County, Texas, in zone AE" is a
nine-word, informational, financial query.** On the query-length axis that is
the 46.4% bucket, not the 9.5% one. Specificity is what triggers the summary. The
argument in the README has the sign backwards.

**The counter-evidence, stated fairly.** Financial YMYL sits at 22.9%, barely
above the 20.5% baseline and half the medical rate. One source reports Google
holding high-risk YMYL trigger rates down to 11% `[review]`, evidently
deliberately. So Google is being more cautious with money questions than with
general information, and that caution is the site's real protection, not the
specificity of the answer. It is protection Google grants and can withdraw.

**And it may already be withdrawing it.** Semrush reports finance saw the largest
growth of any industry in commercial queries triggering AI Overviews, **up 231%
in six months** `[review]`. One source puts insurance AI Overview presence at
**63%** as of March 2026 `[review]`, which is irreconcilable with Ahrefs'
financial-YMYL 22.9% and is marked `[conflict]`. Overall coverage estimates in
circulation run from 13% to 48% depending on the source, which tells you how
unstable this measurement is.

**Two further problems specific to this site.**

FEMA's files are public domain. US government works carry no copyright. Anything
Flood Facts computes, a language model with tool access can compute, a competitor
can recompute, and Google can publish itself. The moat is the pipeline and the
suppression rules, not the data, and a pipeline is a few weeks of work for anyone
who decides to do it.

Where an AI summary answers, it answers from a source. Being that source produces
a citation and possibly no click. Pew's finding is that with an AI Overview
present, **8%** of users click an organic result, against **15%** without
`[review]`.

**Verdict on the argument:** it fails as stated. A county-and-zone lookup does
not survive AI Overviews better than general informational content because of its
specificity. It may survive better because Google currently throttles AI
Overviews on financial YMYL queries, which is a different reason, a weaker one,
and one entirely outside the operator's control. The README should be corrected.

---

## 8. What could not be established

Listed rather than guessed.

1. Revenue share for Raptive, Playwire, Freestar, Sovrn and Monumetric's upper
   tiers.
2. Whether Monumetric requires or accepts an individual with no entity.
3. Whether Ezoic's "Access Now" and "Incubator" routes are live and what they
   require, given the 250,000-user floor. `[conflict]`
4. Any flood-specific affiliate programme, anywhere.
5. Whether Washington's $100 per twelve months referral cap applies per referring
   person, and whether it reaches commercial publishers or only customer
   referrals. This is the single most consequential unresolved item in the file.
6. Whether California caps referral fees to non-licensees, and at what figure.
   Searches surfaced no such cap and I am not going to assert one.
7. The ad-tech supply chain take rate between advertiser CPM and network payout.
8. Session RPM for any tool-shaped or data-lookup site in any vertical. Every
   published RPM figure is from an article site.
9. Whether Mediavine or Raptive have ever accepted a programmatically generated
   data site.
10. Search volume for county-level flood insurance cost queries. No keyword tool
    was reachable, and the answer determines whether the open gap is worth
    anything at all.

Item 10 is the one I would resolve first. Everything in section 6 assumes the
traffic exists to be won.

---

## 9. What this changes

Three corrections to the current plan, and one thing that held.

**The README's AI Overviews claim should be removed or rewritten.** It is the
load-bearing sentence in the "why it fits the constraints" section and the
evidence points the other way. The honest version is: this survives on Google's
current reluctance to summarise financial questions, which is a policy, not a
property of the content.

**The affiliate half should be re-planned around flat per-referral payouts and
non-insurance products.** Not because the design collects contacts, which it
correctly does not, but because sale-contingent commission is what an unlicensed
referrer may not take, and sale-contingent commission is what most insurance
programmes pay. Amazon at 3% on flood-mitigation hardware is licence-free and
small. That is the floor of the affiliate case, and it should be planned as the
floor rather than hoped past.

**The premium-network path needs a real test before it is planned on.** A
generator-built site meets Mediavine's stated rejection criteria on its face.
AdSense has no such bar and takes individuals without argument, so the site can
earn from day one, but the step from $8 to $20 per thousand sessions is the step
that makes the arithmetic work and it is not guaranteed to be available.

**What held:** the sole proprietor question. Every network examined pays
individuals, several of them by issuing the tax form you only issue to an
individual. After three documents in this project where the entity constraint
closed the door, this one does not. Worth saying, because the pattern had started
to look like a law.

---

*I am not a lawyer and I am not an insurance regulator. Sections 4 and 7 read
published regulatory guidance through search summaries because the primary
documents were unreachable from this machine. Before any affiliate link to an
insurance product goes live, the Washington advisory and the New York opinions
should be read in full by someone who can open them, and the operator's own state
checked, which this document does not do.*
