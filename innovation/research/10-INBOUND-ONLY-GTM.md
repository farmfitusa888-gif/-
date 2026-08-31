# Inbound-only go to market, after the outbound ban and the two-state ruling

Written 2026-08-31, against `../buildouts/05-countercite/PLAN.md`,
`../legal/00-LEGAL-POSTURE.md` and `06-FREE-CREDITS.md`.

Two constraints landed at once. The owner will not initiate contact with
anyone. And policyholder-direct sales are limited to Texas and California, with
Florida and Illinois policyholders excluded on the legal read in
`00-LEGAL-POSTURE.md` §2.3.

Between them they delete Channel 1, Channel 1b, Channel 2 and most of Channel 4
from the plan. That is the primary channel, the strongest channel, the
association channel and the catastrophe channel. What survives is Channel 3
(SEO) and Channel 5 (referral), and referral cannot start until customers exist.

---

## Labels

| Label | Means |
|---|---|
| `[verified]` | Primary source read in full. **Zero items here carry it.** The proxy blocks direct fetches; every fetch attempted was refused |
| `[review]` | Search-index summary. Substance believed correct, page not read |
| `[NOT ESTABLISHED]` | Could not determine. Stated as unknown rather than guessed |

Every third-party benchmark below is `[review]`. None of it belongs in the
financial model as a fact. It belongs there as a dial with a range attached.

---

## 1. Does the target survive?

### The short answer

**No, not as stated.** 100 self-serve customers at $299/month inside 6 to 12
months, inbound only, from a domain with no history, in a category with no
existing search demand for the product name, is not a thing anyone found doing
it has done. The comparables that reached roughly $30k MRR without outbound took
**two to three years**, and every one of them started with an advantage this
business does not have.

The plan's own financial model already said month 19 for $30k, at 9 adds a month
with outbound running. Removing outbound does not make that number better.

### The comparables, with what they actually had

**Plausible Analytics.** Launched paid subscriptions May 2019. It took **324
days to reach $400 MRR**, then **nine months from $400 to $10,000 MRR**, then
**ten months from $10k to $500k ARR** (about $41.7k MRR) `[review]`. So $30k MRR
landed somewhere around late 2021, roughly **two and a half years** after the
first paid subscriber. Zero paid advertising, no affiliate programme, no sales
team `[review]`. Acquisition was SEO against an existing high-volume category
("Google Analytics alternative", "GDPR compliant analytics", "cookie-free
analytics"), open source distribution, and a Hacker News audience `[review]`.

Two founders, not one. An open-source repo that generated inbound links for
free. And a search category where hundreds of thousands of people already typed
the competitor's name every month. Countercite has none of those three.

**Bannerbear.** Solo founder. **Two years to $10k MRR**, **three years to $50k
MRR**, crossed $1M ARR in September 2025 `[review]`. Primary channel was
Twitter/X and building in public, not SEO `[review]`. Building in public is
publishing, not outreach, so it is compatible with the constraint. It is also an
audience business, and the owner does not have an audience.

**The general shape.** One aggregation of solo-founder milestones puts $10k to
$30k MRR at **18 to 24 months** on compounding SEO and reviews `[review]`. That
source is low quality and probably machine-written, so I am not leaning on it.
It agrees with the two named cases, which is the only reason it is here.

### Why this specific business is slower than those, not faster

**The traffic arithmetic.** Take the self-serve funnel benchmarks at face value
`[review]`:

| Model | Visitor to signup | Signup to paid | Visitor to paid |
|---|---:|---:|---:|
| Freemium, organic traffic | 13.3% | 2.6% | **0.35%** |
| Opt-in trial, no card | 8.5% | 18.2% | **1.55%** |
| Card-required trial | 2.5% | 31% to 49% | **0.8% to 1.2%** |

These are B2B SaaS medians. A distressed consumer buying under time pressure may
convert better on intent and far worse on price. Treat the range as the honest
spread and not as a prediction.

At **1.55%**, 100 paying customers needs about **6,500 monthly visitors** if
nobody ever churns. At **0.35%**, it needs about **29,000**. Nobody ever
churning is not a thing, and the churn maths in §6 makes the real number several
times higher.

**Can a new domain get 6,500 to 29,000 monthly visitors in 6 to 12 months in
this category?** The evidence says probably not. Ahrefs' study of two million
pages found **5.7% of pages reached the top 10 for at least one keyword within a
year**, and **0.3% did so for a high-volume keyword** `[review]`. A more recent
figure of 1.74% circulates `[review]` `[conflict]`; I could not confirm which is
current. Both numbers point the same way.

Insurance is **YMYL**. Google applies its heaviest E-E-A-T scrutiny to money and
health topics, and the SERPs for denied-claim queries are already held by law
firms, carriers and national personal-finance publishers. A new domain with no
named author, no credentials and no citations is starting from behind on the one
ranking dimension that matters most here.

**And the clicks are shrinking under everyone.** Pew's March 2025 browsing panel
found users who hit an AI summary clicked a traditional link **8% of the time**
versus **15%** with no summary, and ended the session 26% of the time versus 16%
`[review]`. Median zero-click rate on AI Overview searches is reported at
**80%** `[review]`. Position-one CTR with an AI Overview present has been
reported down to about **1.6%** `[review]`. The informational half of the query
set (what does this exclusion mean, why was my claim denied) is exactly the half
AI Overviews answer without a click.

**Two states.** Texas and California together are roughly a fifth of the US
population `[review]`. National SEO delivers national traffic, and four visitors
in five will land on a page for a product they cannot buy. That is not wasted
effort, because the pages still earn links and the professional product is
national, but it means the effective conversion rate on consumer traffic is
about a fifth of the benchmark unless the pages are geo-targeted from the start.

### The realistic range

| Milestone | Inbound only, solo, from zero domain authority |
|---|---|
| First paying customer | **Month 3 to 6**, and month 3 only if a paid-search test runs |
| 10 paying | Month 6 to 10 |
| $10k MRR | **Month 12 to 20** |
| $30k MRR | **Month 22 to 36**, and only with the buyer and price change in §6 |

That is slower than the plan's own model, which already said month 19 with
outbound working. Removing the primary channel and two states and adding no
compensating channel should move the number in one direction only.

---

## 2. Inbound channels, ranked by customers per owner-hour

Every channel that requires the owner to initiate contact with a stranger is
struck out at the bottom. What is left is ranked on expected customers per hour
of owner time, which is the metric asked for and which punishes channels that
need constant feeding.

| # | Channel | Cash | Owner hours to stand up | First customer | Forced contact | Customers per hour |
|---|---|---|---:|---|---|---|
| 1 | **Free tool that ingests a denial letter** (§4) | ~$40/mo inference at a capped rate | 60 to 100 | Month 2 to 4 | Support replies only | **Highest**, and it is the only channel that also produces the corpus, the reviews and the pages |
| 2 | **Programmatic pages built on real form language** (§3) | $12 domain | 120 to 200 | Month 4 to 9 | None | High, with a long lag and a real chance of zero |
| 3 | **YouTube: screen recordings of anonymised denial letters read against a policy** | $0 | 4 to 6 per video | Month 3 to 8 | Comments, ignorable | Medium. Compounds, and is not eaten by AI Overviews |
| 4 | **Paid search on exact-match long tail** | $200 to $600 total, which is the whole test | 8 to 12 | **Week 1 to 3** | None | Low volume, fastest signal. See the CPC warning below |
| 5 | **Directory and review listings** (Capterra, G2, AlternativeTo) | $0 for a listing | 6 to 10 | Month 4+ | None to list. Reviews need customers first | Low early, compounds later |
| 6 | **Launch sites** (Product Hunt and similar) | $0 | 10 to 15 | One day, then nothing | Comment replies | **Near zero here.** Median 115 signups in the first 7 days `[review]`, and the audience is builders, not people whose roof claim was denied |

**On paid search, the number that decides it.** Reported top CPC for insurance
keywords is **$54.91**, for attorney keywords **$47.07**, with the legal
industry averaging **$8.58** and single keywords reaching $210 `[review]`. A
budget under $1,000 buys somewhere between 15 and 100 clicks on anything near
the money. At a 1.5% visitor-to-paid rate that is an expected zero customers.

So paid search is not a channel here. It is a **measurement instrument**. Spend
$200 on tightly matched long-tail phrases for two weeks to learn which wording
people actually click and what they do on the page, then turn it off and point
the organic pages at the winners. That is the correct use of the money and it
requires no contact with anyone.

**On directories.** ClaimWizard already sits in the public-adjuster software
space and is listed on G2 `[review]`. The category exists, which is good news
and bad. Good: there is a shelf to stand on. Bad: G2 and Capterra rank vendors
largely on review count, and reviews come from customers you do not yet have.
The chicken-and-egg is real and there is no way to shortcut it without contact.

### Struck out by the constraint

- Cold email to the 1,203 Florida firms or the 1,708 Texas licensees.
- Cold calls, DMs, conference approaches, association pitches, partnership
  conversations.
- **Answering questions where they are already asked.** This one hurts more than
  the others. Reddit rose to the second most visible site in US Google results
  and its citation share in AI answers grew at least 73% between October 2025
  and January 2026 `[review]`. The place your buyer asks the question is a place
  you have ruled out playing. Accept the loss and stop looking at it.

### The two lists, plainly

**As an outreach channel both are dead.** Neither the 3,708-name Florida file
nor the 1,708-name Texas file can be mailed, called or messaged.

**Non-outreach value they retain, honestly graded:**

1. **Market sizing and pricing evidence. Real, and already extracted.** The
   licence-issuance curve (Florida firm licences: 278 in 2021, 387 in 2022, 125
   in 2023, 172 in 2024, 159 in 2025, 82 to August 2026) tells you the
   professional population is flat to shrinking, not growing. That changes the
   ceiling estimate and it costs nothing to know.

2. **A public directory of licensed adjusters, built from the public register.
   Genuinely valuable, and legally awkward.** "Public adjuster near me" and
   "public adjuster [city]" are among the highest-intent queries a denied
   policyholder types `[review]`. A clean, free, complete directory of licensed
   adjusters would rank and would pull exactly the right traffic. It also has
   the property that adjusters find their own listing and contact **you**, which
   is inbound by construction.

   Three problems. First, `00-LEGAL-POSTURE.md` rule N5 forbids telling the
   customer whom to contact, and rule N7 forbids positioning against a licensed
   professional. A neutral reproduction of a public register is publishing, not
   recommending, but the line moves the moment the directory ranks or sorts
   anyone. Second, the TIKD risk in §1.2 of that document is precisely the risk
   of becoming the thing that stands between a consumer and a professional. Do
   not take a referral fee, ever, from anyone, for any reason. Third, whether
   state licence data may be republished commercially is `[NOT ESTABLISHED]` and
   differs by state.

   My read: buildable, worth building, and it needs one paragraph of the lawyer
   hour already budgeted. Build it for **Texas and California**, not Florida,
   because a Florida directory attracts Florida policyholders who cannot be sold
   the consumer product.

3. **Seasonality and geography for content timing.** 42.6% of Texas licensees
   living out of state tells you when catastrophe traffic spikes and where.
   Publishing ahead of a named storm is inbound. Emailing during one is not.

4. **As an email list, no value at all.** Not reduced value. None. It is the one
   use the constraint forbids outright.

---

## 3. The query set, and how many pages it actually supports

### What people type

I could not obtain search volumes. Every keyword tool sits behind a login the
proxy blocks, so **every volume figure below is `[NOT ESTABLISHED]`** and the
patterns come from what ranks, from what the law-firm and public-adjuster SEO
material says people search, and from the structure of the problem `[review]`.

**This is the single cheapest gap in this document to close.** Google Keyword
Planner is free with an Ads account, needs no contact with anyone, and one hour
in it converts the whole of this section from a hypothesis to a plan. Do that
before building 200 pages, not after.

Five clusters, ordered by how close the searcher is to paying:

**Cluster A. The denial just happened. Highest intent, lowest volume.**
```
[carrier] denied my claim
[carrier] denied my roof claim
my homeowners insurance claim was denied what now
insurance denial letter what does it mean
what does closed without payment mean insurance
denial letter says wear and tear but it was the storm
```

**Cluster B. The reason, named. High intent, and the spine of the page set.**
Documented common denial reasons `[review]`: wear and tear, lack of
maintenance, late reporting, policy exclusion, flood exclusion, roof age or
deterioration, cosmetic damage, under-deductible, pre-existing damage, disputed
cause of loss, incomplete documentation, suspected misrepresentation.
```
wear and tear exclusion homeowners insurance
roof claim denied due to age
water damage claim denied
claim denied for late reporting
is cosmetic damage covered by homeowners insurance
```

**Cluster C. Process. Medium intent, and the cluster AI Overviews eats first.**
```
how to appeal a denied homeowners insurance claim
how to write an insurance appeal letter
insurance appeal letter template
Texas Department of Insurance complaint
California Department of Insurance complaint
```

**Cluster D. Professional help. Highest commercial intent in the whole set, and
mostly not your customer.**
```
public adjuster near me
public adjuster [city]
insurance claim denied lawyer texas
should I hire a public adjuster
```

**Cluster E. The professional buyer. Tiny volume, high value.**
```
public adjuster software
claim documentation software public adjuster
[competitor] alternative
```
Cluster E almost certainly has volume in the low tens per month nationally.
`[NOT ESTABLISHED]`, but the category is small enough that this is close to
arithmetic rather than a guess. **Do not build an SEO plan whose professional
revenue depends on cluster E.** The professional finds you through the consumer
content, which is what `PLAN.md` §6 already predicted.

### The architecture, and where the line is

The dimensions that multiply:

| Dimension | Real values | Notes |
|---|---:|---|
| Denial reason | **12 to 15** | The documented list above. Anything beyond this is invention |
| Carrier | ~25 writing meaningfully in TX and CA | Beyond the top 25 there is no query volume |
| State | **2** | TX and CA only for the consumer product |
| Policy type | 6 | HO-3, HO-5, HO-6, HO-4, DP-3, NFIP flood |

Naive multiplication gives 15 × 25 × 2 × 6 = **4,500 pages**. Do not build that.

Google's March 2024 policy defines **scaled content abuse** as "generating many
pages primarily to manipulate search rankings, with little or no value added for
users," deliberately shifting the test from *how* pages were made to *why*
`[review]`. The March 2024 enforcement deindexed sites outright rather than
demoting them `[review]`. Programmatic pages are fine. Programmatic pages that
are one template with the nouns swapped are the thing the policy was written
for.

**The test that decides each page: does it contain something that exists on no
other page on the internet?** For this product there is exactly one thing that
qualifies, and it is the reason the business exists: **the actual quoted text of
the policy provision, with its page location, next to the actual language
denial letters use when they cite it.**

So the page count is capped not by the dimensions but by how much real artifact
the corpus holds. Three tiers:

| Tier | Pages | What makes each one unique | Ship gate |
|---|---:|---|---|
| **1. Reason pillars** | **12 to 15** | Full standard form language quoted, the carve-back structure shown, the specific words denial letters use, a worked anonymised example | Hand written and hand edited. No generation |
| **2. Reason × state** | **24 to 30** | Only where TX and CA genuinely differ: appraisal clause practice, prompt-payment rules, the California Fair Claims Settlement Practices Regulations, wildfire and smoke damage handling | A named state rule that changes the answer. No rule, no page |
| **3. Reason × carrier** | **grows to 50 to 150 over a year** | One real artifact from that carrier's letters in the corpus. Their actual citation formatting, the provisions they lean on | **No artifact, no page.** This is the whole discipline |

Total in year one: **roughly 100 to 200 pages**, not thousands. Policy type
becomes a section inside a reason page rather than its own axis, because the
searcher does not know their form number.

**On the 294 metadata signals against a baseline of 21.** It is a real
engineering advantage and it is not the advantage the owner thinks it is.
Structured data and metadata are tie-breakers between pages of comparable
quality and comparable authority. They do not create authority, they do not
substitute for the artifact, and they will not rank a thin page. Where they earn
their keep is in AI answer surfaces, where a well-marked-up page with quotable
structured facts is more citable than a wall of prose. Build them, expect them
to matter at the margin, and do not let them justify page 201.

**Carrier names in titles.** Nominative use of a trademark to describe a factual
comparison is generally defensible, and a carrier's legal department can still
send a letter that costs a day to answer. Keep the pages factual, quote rather
than characterise, use no logos and no brand colours, and expect at least one
complaint if the pages work. `[review]`, and worth one line of the lawyer hour.

---

## 4. The free tool that does the acquiring

The competitive fact that should shape all three options: in the adjacent health
insurance appeals category, **Counterforce Health is free to individuals**,
funded by an impact fund, **Fight Health Insurance offers a free AI appeal
generator**, and **Claimable charges around $40 per appeal** `[review]`. That is
the price anchor a consumer arrives with. Property claims are a different
product with different economics, and the number in their head is still going to
be zero to forty dollars.

### Option A. The Denial Letter Decoder

Upload the denial letter alone. No policy required. The tool returns: every
provision the letter cites, where in the letter it appears, the plain-language
glossary entry for each term, every date the letter states, and a checklist of
every document the letter says you must supply.

It never touches the policy, so it never compares anything, so it stays on rows
1 and 2 of the `00-LEGAL-POSTURE.md` §1.3 table by construction. Output is a
clean printable page the user can share.

**Why it converts.** The decoder answers "what does this letter say." The next
question, unavoidably, is "does my policy actually say that." That is the paid
product, and the handoff is the most natural one available.

**Friction: lowest of the three.** One document, which the user is holding,
already scanned or photographed, at the moment they are angriest.

### Option B. The Policy Provision Finder

Upload the policy alone. Ask where something is. Get page-anchored quotes back.
No denial letter, no comparison, no finding.

Genuinely useful standing alone, because nobody can find anything in a 60-page
policy with three endorsement packets stapled to it. Adjusters would use it too.

**Why it converts less well.** The user has to have their policy to hand, which
many do not, and the value is quieter. It is the same engine with the
interesting half withheld, and that can read as a crippled demo rather than a
gift.

### Option C. The Exclusion Library

A browsable, linkable reference of standard policy form language: each common
exclusion quoted in full, the carve-back structure shown, the phrasing denial
letters use when citing it. No upload. Pure content.

**Why it matters more than its conversion rate.** It is the artifact that makes
tier 1 and tier 2 of the page architecture non-thin. It is the thing lawyers,
adjusters and Reddit threads link to, which is how a YMYL domain earns the
authority it cannot buy. And it needs no inference budget at all.

### Ranking

| | Shareability | Free user becomes paying |
|---|---|---|
| **A. Decoder** | High. People share the output of their own crisis | **Highest.** One question away |
| **B. Finder** | Medium | High, but fewer people reach it |
| **C. Library** | **Highest.** Reference pages earn links; crisis tools rarely do | Lowest. Indirect |

**Build A first, C alongside it, B not at all in year one.** A is the
acquisition engine. C is what makes A's pages rank. B is a feature of the paid
product wearing a costume.

**Two costs nobody budgets.** Free users consume inference, and a free tool that
reads uploaded PDFs is the easiest thing in the world to point a script at. Cap
it hard from day one: one document per session, a daily ceiling, and a kill
switch. Second, the moment a free tool ingests a denial letter, every obligation
in `PRIVACY-POLICY.md` attaches to users who have paid nothing. Retention on the
free tool should be minutes, not days, and the page should say so above the
upload button.

---

## 5. What breaks without human contact

Bluntly, in order of how much revenue each one costs.

### Trust at $299 with no salesperson

This is the biggest one and it does not have a clean fix. A stranger is being
asked to upload their insurance policy and their denial letter to a website they
found through Google, run by a person they have never spoken to, and then pay
$299 a month.

Mechanisms that work without the owner initiating anything:

- **A live public sample case.** A real anonymised denial letter against a real
  policy, findings visible, before any signup. This also satisfies condition 1
  of the LegalZoom North Carolina consent judgment (see the document before
  purchase), which `00-LEGAL-POSTURE.md` §1.5 already adopts voluntarily.
- **Published accuracy numbers with the method and the dataset.** The FTC
  DoNotPay order punished the absence of measurement, not the presence of a bad
  product. Publishing the grading protocol is simultaneously the compliance
  answer and the strongest trust asset available to someone with no logos.
- **A named human, a face, and a real postal address.** North Carolina condition
  4, and a plain requirement of consumer trust. The LLC in
  `00-LEGAL-POSTURE.md` §3.5 needs filing anyway.
- **No card on the trial.** Card-required trials convert trial-to-paid two to
  three times better `[review]`, and they convert visitor-to-trial three times
  worse. With no salesperson and no brand, the top of the funnel is the scarce
  thing.
- **Third-party review profiles**, which cannot exist until customers do.

The honest gap: **the first ten customers have no mechanism.** No reviews, no
case studies, no numbers. The only lever left is price, which is the argument in
§6.

### Onboarding and activation

`PLAN.md` targets 70% first-real-case-within-7-days and calls it the best
predictor of retention. The plan reached that number by sitting with each
customer on their first case. That is gone.

Replacement: the product is the onboarding. One upload, first finding inside two
minutes, no configuration, no setup wizard, no invite step. A three-minute
screen recording on the empty state. The preloaded sample case so the first
experience needs nothing from the user at all. Then an automated nudge at day 3
if no document has been uploaded, sent by the product, not by the owner.

### Refunds

Refund friction is the single largest generator of forced human contact in
self-serve software. Somebody wants their money back, cannot get it, and now
there is a conversation.

Mechanism: **self-serve cancel and self-serve refund inside the account**, with
a stated no-questions window. It costs less than the argument, it removes the
angriest support thread from existence, and it is a trust signal on the pricing
page. A refund button is cheaper than a refund email.

### Churn diagnosis

Losing customers without knowing why is how a business burns a year. The plan's
method was talking to them.

Mechanism: a **mandatory one-click reason menu in the cancel flow**, with the
options written before launch, plus telemetry on activation and case volume. The
catch to say out loud: a reason menu you retrofit in month nine leaves the first
cohort's churn permanently unexplained. Build it before the first customer or do
not bother.

### The accuracy corpus

`PLAN.md` §7 gates everything on grading 20 real denial letters against a
professional's read. The plan sourced documents by asking. That is out.

Sources that need no contact:

1. **Court records.** Coverage disputes attach denial letters as exhibits.
   Federal opinions and dockets are public.
2. **State department of insurance complaint files and market conduct exams**,
   public in both target states `[review]`.
3. **Law firm and public adjuster sample denial letters**, published by the
   hundred for exactly the SEO reasons in §3.
4. **Policy forms filed with state regulators.** Form filings are public record
   `[review]`. This is the source for the Exclusion Library and it is better
   than anything a customer would have sent.
5. **An in-product opt-in.** A per-case toggle: contribute this case,
   anonymised, to the accuracy test set. The customer offers; the owner never
   asks.
6. **Synthetic letters generated from real form language**, graded against known
   ground truth. Good for regression testing. Useless as evidence of real-world
   accuracy, and it must never be described as such.

**The one place the constraint genuinely bites.** The day 1 to 30 gate requires
a **licensed professional's graded read**, and no amount of public documents
supplies that. Hiring one means initiating contact with a stranger. The only
inbound-compatible form is to **post a paid job listing and let applicants
come**. It is slower and it works. Do not skip the gate; it is the difference
between this business and the one the FTC fined.

---

## 6. The verdict

**The plan needs a different price and a different primary buyer.** The timeline
is also wrong, by roughly a year, but the price and buyer error is the one that
changes what gets built next week.

### The argument

**A denied claim is an event, not a condition.** The homeowner needs this
product once. They use it for two to six weeks and then their claim is resolved
or it is not, and either way they are done. Consumer-facing subscription
software already churns at **6% to 8% a month** with an ongoing need `[review]`.
A product tied to a single episode churns at a multiple of that.

Run the plan's own steady-state formula, adds ÷ churn, on a policyholder base:

| Monthly churn | Adds needed to hold 100 paying |
|---:|---:|
| 8% (consumer benchmark, assumes ongoing need) | 8 |
| 25% (generous for an episodic need) | 25 |
| 50% (what an event-shaped product actually does) | **50** |

Fifty new paying customers every month, forever, to stand still at $30k. At the
1.55% visitor-to-paid benchmark that is **3,200 visitors a month**; at 0.35% it
is **14,300**. In two states, in YMYL, from a domain with no history, with AI
Overviews taking most of the clicks on the informational half of the query set.

The price is also wrong in the other direction. The nearest comparable products
charge **$0 and about $40 per appeal** `[review]`. $299 a month is a
professional's price presented to a consumer, and the consumer's first reaction
will be to compare it to the deductible they are arguing about.

**Meanwhile the buyer for whom $299 a month is obviously correct still exists.**
A public adjuster carries cases continuously, bills 10% to 20% of settlements,
and needs the tool every week. Their churn benchmark is 3.5%, not 8%
`[review]`. At 4% churn, holding 100 professional customers needs **4 adds a
month**, which is the difference between a plan and a fantasy. The professional
product also has no state restriction: Florida and Illinois were only closed to
**policyholder-direct** sales, and the Florida firm population remains the
single best-defined buyer in the project. It just has to find you instead of
being found.

### What the revenue should look like instead

| Line | Price shape | At $30k/month |
|---|---|---:|
| **Professional subscription**, national, all four states | $149 / $299 / $599 monthly, unchanged | **70 customers ≈ $20,900** |
| **Policyholder, TX and CA** | **One-time, per case, $99 to $199.** Not a subscription | **60 to 90 cases/month ≈ $9,000** |
| **Free decoder** | $0 | The traffic, the corpus, the reviews |

Two things this fixes at once. The consumer price stops fighting the customer's
mental model, and the consumer volume stops being load-bearing for the MRR
number. The consumer side's job becomes what it is actually good at: generating
the search footprint and the evidence that make the professional product
credible to a professional who arrives without ever having spoken to anyone.

Note what it costs. One-time consumer revenue means the traffic requirement goes
**up**, not down, per dollar earned. It is still the right call, because 200
one-time customers a month is a marketing problem and 50 net new subscribers a
month against 50% churn is an arithmetic impossibility.

### The revised targets, written down before the test

| By | Target | Kill criterion |
|---|---|---|
| Month 3 | Decoder live, 15 pillar pages, the paid-search test run and stopped | No page indexed and ranking for anything by month 4: the SEO thesis is wrong, stop building pages |
| Month 6 | 500 monthly visitors, 10 paying of any kind | Under 100 visitors: the query set is wrong, redo the keyword hour |
| Month 12 | **$8k to $12k MRR blended**, 25 to 35 professional subscribers | Under $4k: inbound-only does not work for this product. Either the constraint changes or the business does |
| Month 24 | **$25k to $35k** | Under $15k: revisit price and buyer again |

### What I got wrong on the way here

I started this expecting the answer to be "the timeline is wrong," because that
is the polite answer and the plan's own model already pointed at it. The churn
arithmetic changed my mind. A one-off need sold as a monthly subscription does
not have a slow timeline. It has a ceiling, and the ceiling in the worst case
sits below the break-even count no matter how long the business runs. That is
the same failure mode `PLAN.md` §7 already identified as the one that kills this
business, and applying the plan's own formula to the new buyer is what surfaced
it. The model won again.

---

## Sources

Everything below is `[review]`. None was read at the source; all came through a
search index.

- Plausible Analytics growth milestones: https://plausible.io/blog/bootstrapping-saas · https://plausible.io/blog/growing-saas-mrr · https://plausible.io/blog/open-source-saas
- Bannerbear solo-founder timeline: https://www.starterstory.com/stories/bannerbear-breakdown · https://www.indiehackers.com/podcast/208-jon-yongfook
- Health-appeal price anchors: https://www.counterforcehealth.org/ · https://en.wikipedia.org/wiki/Counterforce_Health
- Trial and freemium conversion benchmarks: https://www.shno.co/marketing-statistics/free-trial-conversion-statistics · https://www.artisangrowthstrategies.com/blog/freemium-conversion-rate-benchmarks · https://firstpagesage.com/seo-blog/saas-free-trial-conversion-rate-benchmarks/
- Churn benchmarks: https://churnkey.co/blog/whats-a-normal-churn-rate-in-saas · https://recurly.com/research/churn-rate-benchmarks/
- Time to rank: https://ahrefs.com/blog/how-long-does-it-take-to-rank-in-google-and-how-old-are-top-ranking-pages/ · https://www.positional.com/blog/how-long-does-it-take-to-rank
- YMYL and E-E-A-T: https://ignitevisibility.com/ymyl-pages-what-are-ymyl-google-seo-pages/ · https://leadsurance.com/insurance-website-seo/
- AI Overviews and zero-click: https://searchengineland.com/google-zero-click-searches-2026-study-479717 · https://www.marketingcharts.com/digital-236587 · https://www.omnibound.ai/blog/zero-click-search-statistics
- Scaled content abuse policy: https://www.layer3labs.io/guides/scaled-content-abuse · https://growthengineer.ai/blog/programmatic-seo-google-penalty
- Reddit SERP and AI citation share: https://www.icrossing.com/insights/reddits-rise-in-search-results · https://www.emarketer.com/content/reddit-top-google-search-results-growing-ad-revenues-should-marketers-take-notes
- CPC ranges: https://www.wordstream.com/articles/most-expensive-keywords · https://www.ilawyermarketing.com/most-expensive-google-ads-keywords-legal-industry-2025/
- Denial rates and reasons: https://weissratings.com/en/weiss-news/15-large-u-s-insurers-denied-more-than-half-of-homeowner-claims-in-2025 · https://www.policygenius.com/homeowners-insurance/homeowners-insurance-statistics/ · https://www.legalreader.com/why-property-insurance-claims-get-denied-7-common-reasons/
- Public adjuster search behaviour and the software category: https://mapkings.us/best-marketing-strategies-for-public-adjusters-in-2026/ · https://www.g2.com/sellers/claimwizard
- Product Hunt outcomes: https://www.shno.co/marketing-statistics/product-hunt-launch-statistics · https://happysupport.ai/blog/product-hunt-launch-roundup-2026
