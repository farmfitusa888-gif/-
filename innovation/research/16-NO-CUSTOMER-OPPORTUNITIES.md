# Opportunities where nobody is the customer

Written 1 September 2026. Brief: find specific things worth building where
revenue arrives from an advertiser, an affiliate, or a platform that is the
merchant of record. No outreach, no clients, under $1,000, built with AI, meant
to run itself.

## How to read the labels

Every factual claim below carries one of three marks, using this project's
existing convention:

- `[review]` means it came from a search summary. I did not open the primary
  document. **Almost everything here is `[review]`**, because the egress proxy
  on this machine blocks direct fetches. That is the same limitation recorded in
  the thirteen earlier research notes, and it has not changed.
- `[NOT ESTABLISHED]` means I could not evidence it and refused to guess. There
  are more of these than is comfortable, particularly on revenue.
- No mark means it is my judgement, offered as judgement.

There is no `[verified]` in this file. Nothing here was verified to the standard
that word should mean.

---

## 1. The fact that reorders everything in this category

Before the ideas, the thing that changes how they should be ranked.

Ad-supported informational content is in structural decline, and the decline
accelerated sharply in the last twelve months. An Ahrefs study published in
February 2026 found AI Overviews correlate with a **58% reduction in
click-through** for top-ranking pages, roughly double the 34.5% measured in
April 2025 `[review]`. Similarweb clickstream data covering January to April
2026 put **68% of US Google searches ending with no click at all** `[review]`.
Google referral traffic to publishers was reported down **38% year over year**
as of January 2026 `[review]`. Pew found that when an AI Overview is present,
8% of users click a traditional result, against 15% when it is absent
`[review]`.

Sources: [Search Engine Journal](https://www.searchenginejournal.com/impact-of-ai-overviews-how-publishers-need-to-adapt/556843/),
[TNW](https://thenextweb.com/news/google-ai-overviews-publisher-links-search-traffic),
[Omnibound](https://www.omnibound.ai/blog/google-ai-overviews-statistics).

So the obvious version of this brief, which is "build a content site and put
AdSense on it", is a worse business in 2026 than it was in 2024, and the
evidence for that is quantitative rather than vibes.

**The filter I applied instead.** An idea survives only if the answer cannot be
produced by a language model reading a page. That means one of three shapes:

1. The answer requires **the user's own private input** (their address, their
   employer, their loan balance). A model cannot pre-answer it, so the user must
   arrive at a tool.
2. The distribution channel **is not a search engine**. An app store, a
   marketplace, a printer's model library.
3. The underlying data **is not on the open web at all** in usable form, so
   there is nothing for a model to have read.

Everything ranked below passes at least one. Everything in the reject list fails
one, or is already taken.

## 2. Merchant of record is not the same as no contact

Worth separating, because the brief conflates them slightly and the distinction
decides three of the rankings.

A platform being merchant of record removes the **payment** relationship: no
invoicing, no chargebacks, no sales tax registration, no refund handling. It
does not remove the **support** relationship. A Shopify app has merchants who
email. A 3D model has makers who comment when it does not print. An iOS app has
one-star reviews demanding a feature.

Only two structures here have genuinely zero inbound: an ad-supported public
tool with no account, and a static data asset. Rankings 1, 2, 3 and 7 have that
property. Rankings 4, 5 and 6 pay better and cost some contact. That trade is
real and nobody should pretend otherwise.

---

## 3. The ranked list

| # | What | Who pays | Evidence | Build | Ceiling | Biggest risk |
|---|---|---|---|---|---|---|
| 1 | Flood cost and claim reality by address, from NFIP transaction data | Insurance advertisers, affiliates | Data confirmed, gap confirmed | 3-5 weeks | Mid-high | Insurance ad compliance |
| 2 | 401(k)/403(b) fee score from Form 5500 | Finance advertisers, rollover affiliates | Vacuum confirmed, data confirmed | 4 weeks | Mid-high | Data lag; regulated-advice line |
| 3 | Property tax reset estimator for cap and acquisition-value states | Mortgage and real-estate advertisers | Problem confirmed, gap partial | 3 weeks | Mid | Crowded by thin generic calculators |
| 4 | Shopify app, billed by Shopify | Shopify | Structure confirmed | 4 weeks | High | Support load; app review |
| 5 | iOS app on the on-device model, Apple as merchant | Apple | Capability confirmed | 4 weeks | Mid-high | Needs a Mac; device gating |
| 6 | Parametric part families on MakerWorld | Bambu Lab | Payout confirmed | 3 weeks | Low-mid | Needs a printer to verify |
| 7 | Student loan RAP decision tool, July 2026 window | Refinance affiliates, ads | Window confirmed | 2 weeks | Mid, time-boxed | Window closes; crowded |
| 8 | EU-verified device durability data, applied to buyers | Retail affiliates | Data and API confirmed | 3 weeks | Low-mid | Weak commissions |
| 9 | What is being proposed near this address, California only | Real-estate advertisers | Gap confirmed, value unclear | 4 weeks | Low | Diffuse audience |

Ranked on evidence strength first, then on whether the thing survives zero-click
search, then on revenue shape. Not on how interesting it is.

---

## 4. The detail

### 1. What flood insurance actually costs here, and what actually got paid out

**What it is.** FEMA publishes the entire National Flood Insurance Program as
two redacted bulk files: more than **80,000,000 policy transactions** and more
than **2,000,000 claims transactions**, updated roughly monthly `[review]`
([OpenFEMA policies](https://www.fema.gov/openfema-data-page/fima-nfip-redacted-policies-v2),
[OpenFEMA claims](https://www.fema.gov/openfema-data-page/fima-nfip-redacted-claims-v2)).
The site takes an address, resolves it to a census tract and flood zone, and
shows what policies in that tract actually cost, what fraction of them have ever
claimed, and what the claims paid.

**Who pays.** Advertisers and affiliates in home and flood insurance. The user
takes an answer and leaves. No account, no purchase, no relationship.

**Evidence.** FEMA's own framing calls it "the largest, most comprehensive
release of NFIP data coordinated by FEMA to date" and warns the files are too
large for Excel `[review]`. That warning is the opportunity: the data is public
and effectively unusable, which is exactly the pattern this project has already
proved out with the Texas licence file and the DOL enforcement file.

**Why it has not been done well.** Everything a consumer can currently find is
either a flood *risk* score (First Street's Risk Factor, embedded in Redfin and
Realtor) or a national *average* premium quoted in an article. US News gives
$1,122 a year as a national average; Policygenius gives $888 from 2023 FEMA
pricing `[review]`. ZipCheckup estimates from flood zone and housing age rather
than from paid premiums `[review]`. Nobody appears to have built the consumer
view of the transaction files themselves. Search results for it return articles,
FEMA's own map portal, and estimators, not a data explorer
([search evidence](https://protectmyzip.com/blog/flood-zone-lookup-by-address)).

**A month of work.** Download both files, load into DuckDB (there is already a
public `duckdb-fema-nfip` repo showing the shape of the job `[review]`),
aggregate by tract and flood zone and building characteristics, precompute
everything into static JSON, and ship a single-page lookup on free hosting. No
server. The heavy work is data cleaning, which is what AI is actually good for.

**Revenue shape.** Display and affiliate, driven by session value rather than
volume, because insurance is one of the higher-value ad categories. The specific
rate is `[NOT ESTABLISHED]`. I have no verified RPM or CPC figure and will not
invent one.

**What kills it.** Insurance advertising is regulated, and running a lead form
would make him a producer in many states. The answer is to run display and
plain affiliate links only, and never collect a contact. Second risk: FEMA
stopping publication.

---

### 2. The 401(k) fee score that stopped existing

**What it is.** You type your employer's name and get a straight answer: what
your retirement plan costs as a percentage of assets, where that sits against
plans of similar size, and what the difference compounds to over thirty years.
Built from the Department of Labor's Form 5500 filings, which cover roughly
**800,000 retirement and welfare plans** and are published as raw bulk datasets
`[review]` ([DOL EBSA data](https://www.dol.gov/agencies/ebsa/researchers/data)).

**Who pays.** Financial advertisers and rollover affiliates. Nobody signs up.

**Evidence, and this is the good part.** BrightScope used to do exactly this
free and public. It is gone: "BrightScope 401k is no longer a public service,
as they were acquired... The free 401K review tool is no longer available
following their acquisition by ISS" `[review]`
([Bogleheads discussion](https://www.bogleheads.org/forum/viewtopic.php?t=359076)).
The underlying database still exists and still gets used for the annual
BrightScope/ICI research report covering **more than 61,000 large private-sector
401(k) plans** `[review]` ([ICI 2025 report](https://www.ici.org/files/2025/25-rpt-dcplan-profile22-401k.pdf)).
The question itself is durable: ProPublica, Consumer Reports and NPR have all
written the "how do I know if my fees are too high" explainer, and Consumer
Reports' answer is a rule of thumb, 1.5% or more `[review]`
([ProPublica](https://www.propublica.org/article/401k-retirement-plan-fees-funds),
[Consumer Reports](https://www.consumerreports.org/fees-billing/how-high-is-too-high-for-401k-fees)).
A rule of thumb is what people fall back on when the tool is gone.

**Why it has not been done.** It partly has, and I want to be precise about
what is taken and what is not. Raw Form 5500 *filing search* is well served:
FreeERISA, ERISA360 and form5500search.com all exist and all offer free lookup
`[review]`. Every one of them is built for advisors and lead generation, showing
filings, service providers and holdings. None of them does the participant-facing
thing, which is a comparative fee number with a peer benchmark and a dollar
consequence. That specific product died with BrightScope and has not been
replaced. Beagle, the thing people get pointed to now, is a paid service with a
customer relationship `[review]`, which is the opposite of this brief.

**A month of work.** Ingest the bulk files, compute total plan cost per
participant and as a share of assets from Schedule H and Schedule C, bucket
peers by plan size, generate one static page per plan. Roughly 61,000 to 100,000
pages, each with a number that exists nowhere else. That last property matters:
it clears the thin-content bar the same way the Backpay query set was designed
to.

**Revenue shape.** Display plus rollover affiliate. Rate `[NOT ESTABLISHED]`.

**What kills it.** Two things. Form 5500 data lags by roughly two years, so
"your plan costs X" is always about a stale year, and that has to be said on
every page rather than hidden. And telling someone their plan is bad edges
toward investment advice. The fix is the same one this project already worked
out for Backpay: state facts from the filing, refuse to recommend an action, and
put a language guard in the generator.

---

### 3. What your property taxes become after you buy

**What it is.** In several states the previous owner's tax bill is actively
misleading, because the taxable value resets on transfer. Michigan uncaps under
Proposal A, California reassesses to sale price under Proposition 13, Florida
resets Save Our Homes, Texas resets the 10% homestead cap. A buyer sees the
listing's tax figure, budgets for it, and gets a different bill. The tool takes
address and purchase price and returns the number they will actually pay.

**Who pays.** Mortgage and real-estate advertisers. The user gets a number and
goes.

**Evidence.** The problem is widely documented: buyers "rely heavily on property
tax estimates provided during the home-buying process, only to discover later
that those numbers were outdated, incomplete, or based on the previous owner's
lower assessment" `[review]`
([The Free Financial Advisor](https://www.thefreefinancialadvisor.com/property-taxes-are-catching-homeowners-off-guard-especially-after-buying-or-renovating/)).
For Michigan specifically, one worked example puts a $2,200 bill on a $380,000
home at $4,200 to $5,600 after uncapping `[review]`
([Southfield](https://www.cityofsouthfield.com/departments/assessing/uncapping-residential-property-taxes-overview)).

**Why it has been done badly rather than not at all, and this is the honest
part.** There are dozens of "property tax calculator 2026" sites, most of them
recently built, generic, and wrong for exactly this case: they multiply a value
by a state effective rate and ignore transfer resets entirely
`[review]` ([examples](https://www.freefincalc.net/property-tax-calculator)).
Michigan has several uncapping calculators, and they are mortgage-lender lead
magnets `[review]`
([Treadstone](https://www.treadstonemortgage.com/tools/property-tax-calculator/)).
So the field is noisy, the individual state answers exist in places, and no
single correct multi-state tool does. That is a weaker gap than 1 or 2, which is
why this is third and not first.

**A month of work.** Do not attempt fifty states. Do the six where transfer
resets are statutory and severe, get the millage rates from county sources, and
be visibly more correct than the generic calculators. Correctness is the only
available differentiator.

**Revenue shape.** Display, in a high-value vertical. Rate `[NOT ESTABLISHED]`.

**What kills it.** Being drowned by the generic calculators in search, which is
a real possibility given the volume of them.

---

### 4. A Shopify app, where Shopify does the billing

**What it is.** Ship one narrow utility app into the Shopify App Store. Shopify
charges the merchant on their existing Shopify invoice and pays out.

**Who pays.** Shopify. Off-platform billing is banned: "Apps that use
off-platform billing cannot be distributed through the Shopify App Store"
`[review]` ([Shopify docs](https://shopify.dev/docs/apps/launch/billing)). There
is no way to have a payment relationship with a merchant even if he wanted one.

**Evidence.** Reported revenue share is 85% generally, 80% above $1M annual, and
**100% under $1M annually** with caveats `[review]`
([Karan Goyal](https://karangoyal.cc/blog/shopify-billing-api-legacy-app-pricing-submission)).
If that 0%-under-$1M figure holds, it is the most favourable platform economics
in this entire document, and it should be checked against Shopify's own partner
terms before anything is built. Also relevant: on **12 May 2026** Shopify made
"Shopify App Pricing" the default and moved the Billing API to legacy `[review]`,
so anything built from an older tutorial will be built against the wrong thing.

**Why it has not been done.** It has, thousands of times. The App Store is
crowded and the thing that is scarce is not the idea but the willingness to
answer merchant email for years. I am ranking it fourth rather than dismissing
it because the payment structure is genuinely the cleanest available, not
because I found an unserved app niche. **I did not find one.** Identifying the
specific gap is a separate piece of work and I would not start building without
it.

**What kills it.** Support load, which is the thing this brief is trying to
avoid. And platform dependence: Shopify can change pricing rules, as it just
did.

---

### 5. An iOS app whose AI costs nothing to run

**What it is.** Apple's Foundation Models framework, available with iOS 26,
gives an app a roughly 3-billion-parameter on-device model. Apple's own wording:
developers can build features "all while using AI inference that is free of
cost" `[review]`
([Apple Newsroom](https://www.apple.com/newsroom/2025/09/apples-foundation-models-framework-unlocks-new-intelligent-app-experiences/)).

**Why this is new rather than obvious.** Until this framework shipped, every
consumer AI app carried a per-user inference bill, which is why they all became
subscriptions, which is why they all needed a customer. That constraint is gone
on Apple hardware. An app can be free, ad-supported or paid once, work offline,
and cost the developer nothing per use. Apple is merchant of record for anything
sold. This is the clearest example in the whole document of a capability that
arrived recently and has not been widely pointed at an audience.

**Who pays.** Apple.

**Constraints, stated plainly.** It runs only on iPhone 15 Pro and newer,
Apple Silicon Macs, and M-series iPads `[review]`, so the addressable device
base is a fraction of iPhone users and skewed to recent hardware. Building
requires a Mac and a $99 developer account. Whether that fits under $1,000
depends entirely on what hardware he already owns, and I do not know.
`[NOT ESTABLISHED]`.

**What to build.** The natural fit is something that must work offline and must
not send data anywhere: a tool over documents the user already has on the phone.
I am not proposing a specific app here because I could not evidence demand for
one, and this document is supposed to be short on padding.

**What kills it.** Apple changing the framework's terms, device gating keeping
the audience small, or discovery in the App Store, which is its own problem.

---

### 6. Parametric part families on MakerWorld

**What it is.** MakerWorld is Bambu Lab's model library. Creators are paid by
Bambu, not by downloaders. The play is to generate large families of
dimensionally-exact parametric parts using code-CAD (OpenSCAD, build123d),
driven by published dimension standards, rather than hand-modelling one object
at a time.

**Who pays.** Bambu Lab. The person printing the model pays nothing and is not
a customer in any sense.

**Evidence.** The payout structure is documented: a 3% to 15% commission on
completed order amounts through a model's bill of materials, and an Exclusive
Model programme paying **$0.066 per Exclusive Point as of May 2026** with a $100
redemption floor `[review]`
([Bambu wiki](https://wiki.bambulab.com/en/makerworld/tutorials/creator-commission-incentives),
[MakerWorld exclusive policy](https://makerworld.com/en/exclusive-model-policy)).
Platform statistics as of 1 March 2026 reportedly show some creators earning over
$1,000 a month, and one source claims a few near $20,000 a month `[review]`. I
would treat the $20,000 figure as marketing until someone opens the primary
page. Regular points have no cash value, which is the trap: only the exclusive
and commission tracks pay money.

**Why the AI angle is real.** Code-CAD is text. A model that writes OpenSCAD can
produce a thousand dimensioned variants from a table of measurements, which is
tedious for a human and trivial for a generator. Almost nobody works this way on
these platforms.

**What kills it.** Models that do not print get rated badly, and verifying them
means owning a printer. That is a hardware purchase and a time cost, and it is
the honest reason this sits at six rather than three.

---

### 7. The student loan decision that 40 million people face this year

**What it is.** A calculator for the Repayment Assistance Plan, which became
available **1 July 2026** and is the only income-driven plan for Direct Loan
borrowers after that date `[review]`
([TICAS](https://ticas.org/affordability-2/upcoming-changes-to-income-driven-repayment-plans/),
[CRS](https://www.congress.gov/crs-product/IF13075)).

**Why the moment is sharp.** Borrowers on SAVE start receiving servicer
notifications and get **90 days** to choose. Miss it and they are placed into the
Standard or Tiered Standard plan, which generally costs more `[review]`. RAP
sets payments at 1% to 10% of adjusted gross income, or $10 a month under
$10,000 of income `[review]`. That is a forced, dated, high-stakes decision
arriving in staggered waves through 2026 to 2028.

**Who pays.** Refinance affiliates and display advertisers.

**Why it is only seventh.** It is genuinely crowded. Fidelity, Earnest,
SavingForCollege, EdTrust and Student Loan Planner all have explainers, and
Massachusetts publishes a state estimator `[review]`. The gap is narrow: nothing
found compares a borrower's actual loan mix across RAP, the tiered standard, and
remaining forgiveness paths in one pass. And the whole thing has an expiry date,
which is a bad property for an asset meant to compound.

**What kills it.** Congress amending it, servicers shipping a good calculator,
or the window simply closing.

---

### 8. The durability numbers the EU forces manufacturers to publish

**What it is.** Since **20 June 2025** every smartphone and tablet sold in the
EU carries an energy label with a repairability class A to E, a battery
endurance rating, a fall-reliability rating and an IP rating, and batteries must
survive at least **800 cycles at 80% capacity** `[review]`
([European Commission](https://single-market-economy.ec.europa.eu/news/new-eu-rules-durable-energy-efficient-and-repairable-smartphones-and-tablets-start-applying-2025-06-20_en)).
All of it lands in EPREL, the EU product database, which has free public access
and a public API `[review]`
([EPREL](https://energy-efficient-products.ec.europa.eu/eprel_en),
[API terms](https://ec.europa.eu/assets/move-ener/eprel/EPREL%20Public/Public%20API%20Term%20and%20Conditions/API_TERMS_AND_CONDITIONS_EN.pdf)).
The same database covers tyres, displays, washing machines, dryers, fridges and
light sources.

**The interesting bit.** This is standardised, lab-tested, legally-declared
performance data. Review sites test a handful of models inconsistently. EPREL
has everything, comparably, for free, and essentially no consumer-facing site in
the English-speaking world uses it. Tyres are the sharpest sub-case: wet grip
class, fuel efficiency, external noise and ice or snow grip for every model
sold, in a category where buyers currently rely on retailer star ratings.

**Who pays.** Retail affiliates.

**Why it is eighth.** Commissions in electronics and appliances are thin, model
numbers differ between EU and US markets, and TyreReviews already owns the tyre
comparison audience with its own testing. Real data, weak money.

**What kills it.** The commission rates, mostly.

---

### 9. What is being proposed near this address, in California

**What it is.** CEQAnet holds key information from every CEQA document submitted
to the State Clearinghouse since 1990, and full text of every environmental
document and notice since **March 2019** `[review]`
([CEQAnet](https://ceqanet.lci.ca.gov/Home/About)). That is a statewide,
document-level record of proposed development. Turn it into a map and an address
search.

**Who pays.** Real-estate and home-services advertisers.

**Evidence of the gap.** There is no national US tool for "what is proposed near
my address". A direct search returns individual city portals and one Irish
government map `[review]`. Every American result was a single jurisdiction.

**Why this is last.** The gap is real and the ceiling is unclear. CEQAnet is
explicitly incomplete, since not all documents go to the Clearinghouse
`[review]`, so an absence of results proves nothing, which is a bad property for
a tool people would use to make a decision. The audience is also diffuse: people
care intensely for about a week around a house purchase and never again.

**What kills it.** The incompleteness, if it turns out to be severe.

---

## 5. Considered and rejected

The more useful list. Each of these looked good for at least twenty minutes.

| Idea | Why it failed |
|---|---|
| **Lead service line lookup by address** | Taken. The October 2024 inventories are public `[review]`, but usleadpipecheck.com already does address lookup across CA, FL, NJ, NY, OH, PA and others, and NRDC published a national map with BlueConduit `[review]`. |
| **Consumer import duty calculator after the de minimis suspension** | Taken many times over. The exemption ended 29 August 2025 and at least eight calculators already rank for it, including Flexport's `[review]`. Several are also wrong, which was tempting, but being the ninth correct one is not a business. |
| **Assisted living inspection violations, national** | Taken, recently. The Care Audit covers 44,395 communities across 30 states and is free to families `[review]`. This looked like a clean gap because CMS Care Compare excludes assisted living. It closed. |
| **Drug shortage lookup** | Taken three times. Drugs.com, HelloPharmacist and Priya Life Science all publish daily trackers off the FDA feed `[review]`. |
| **Merchant descriptor lookup, "what is this charge"** | Taken, and by exactly the kind of operation described in this brief. UnknownCharges, ChargeLookupNow and DecoderAtlas all exist and all appear recently built `[review]`. |
| **Replacing SeatGuru** | The best cautionary tale in the file. SeatGuru shut down 31 October 2025 after 24 years `[review]`. Within months AeroLOPA, SeatMaps.com, SeatMap.app, SeatCompare.ai, FlightSeatmap and a rebuilt ExpertFlyer had filled it `[review]`. An obvious vacuum in a high-traffic consumer utility closes in under a year. |
| **Broadband price comparison from FCC label data** | The data is being switched off. The machine-readable label requirement, which existed specifically so third parties could build comparison tools, was **eliminated** in the FCC's 2026 streamlining `[review]` ([FCC](https://www.fcc.gov/broadbandlabels), [Womble](https://www.womblebonddickinson.com/us/insights/insights/102nhpw/fcc-streamlines-broadband-label-rules-easing-compliance-burdens-providers)). This was my favourite idea of the day for about an hour. |
| **Replacing ProPublica's Dollars for Docs** | The government already ships it. ProPublica's tool has been frozen since October 2019 `[review]`, but CMS runs openpaymentsdata.cms.gov with 15 million general payment records a year and filters by NPI, name, company and specialty `[review]`. The only genuinely new thing left is joining payments to Part D prescribing, and that is an investigation, not a business. |
| **Florida HOA and condo documents, now that associations must publish them** | Killed on an access question I could not resolve. Condo associations with 25+ units need a website by 1 January 2026, HOAs with 100+ parcels since 1 January 2025 `[review]`. But the statutes appear to require access **to members**, not to the public, and I could not establish otherwise `[NOT ESTABLISHED]`. If member-only, there is no corpus. |
| **Apps inside ChatGPT** | Too early. OpenAI's own monetization docs say developers "cannot submit an app with monetization for any digital products or services"; approval is limited to physical goods, and revenue share terms are unannounced `[review]` ([OpenAI](https://developers.openai.com/apps-sdk/build/monetization)). Worth revisiting when the directory and monetization ship later in 2026. |
| **Anything built on free PACER** | Not free yet. The Open Courts Act of 2026 (S. 4667) was introduced in June 2026 and has not passed `[review]` ([Justia](https://news.justia.com/senators-reintroduce-open-courts-act-to-make-pacer-free/)). Watch item, not an opportunity. |
| **A general ad-supported content site in any niche** | Fails on the numbers in section 1. Not a niche problem, a category problem. |
| **Chrome extension with an ad or affiliate model** | The Web Store is not a merchant of record, so payment goes back to him. Fails the brief structurally. |

### The pattern in the rejects

Five of the twelve were killed by the same thing: **somebody had already built
it, recently, and often with AI**. The tools that closed the lead pipe gap, the
descriptor gap and the SeatGuru gap all look like one-person AI builds shipped in
the last eighteen months. That is the competitive reality of this brief. The
edge is not in spotting a gap, because gaps are being spotted continuously by
people with the same tools. It is in gaps that require **work that is annoying at
a scale AI actually helps with**: an 80-million-row FEMA file, two decades of
Form 5500 schedules, six states of statutory tax mechanics. Those took longer
than an afternoon, and that is the entire moat.

---

## 6. What I could not establish

Stated so it is not mistaken for an oversight.

- **Every revenue figure.** No verified RPM, CPC or affiliate rate appears in
  this document, because I could not verify one. Anything framed as "high-value
  vertical" is my judgement, not a measurement.
- **Search volume for anything.** No keyword tool was available. Where I claim
  demand, it rests on the existence of published explainers and forum threads,
  which is weaker evidence and is labelled as such.
- **Shopify's 0% revenue share under $1M.** Reported by a third party `[review]`.
  It changes the ranking materially if wrong, and it should be read off
  Shopify's own partner terms before a line of code.
- **Whether he owns a Mac**, which decides whether idea 5 fits the budget.
- **Whether Florida association websites are public or member-only**, which is
  the single fact that revives or buries that idea.

Nothing here was fetched directly. The proxy blocked it, as it has blocked
every primary source in this project since the start.
