# Business structures where nobody is your customer

Written 2026-09-01. Commissioned after the owner set six constraints that are
now hard rather than negotiable, the first of which is that **nobody pays them
directly for a product or service.** That single constraint is the one that
deletes the "form an LLC before you take money" advice, which the owner has
decided is a dealbreaker.

This document maps every structure where revenue arrives without a customer,
tests each against the constraints, and then does the arithmetic on what they
actually pay. Part 3 is the uncomfortable part and it is the reason this was
worth writing.

---

## Verdict

| | |
|---|---|
| **Top structure** | One owned content property, monetized by **display advertising and affiliate links together**. Two revenue lines on one asset. |
| **Realistic monthly ceiling, solo, no outreach** | **$2,000–$8,000/month at 24–36 months.** $10,000–$15,000 in a strong commercial niche with a good outcome. |
| **Does the $20,000–$50,000 target survive?** | **No.** Not in this constraint set, not for a solo operator, not in any timeframe worth planning around. |
| **The finding that matters most** | The constraint does less than it looks like it does. In the largest no-customer category (app stores), US law and the platforms' own contracts put the end-user relationship **back on the owner**. Removing the customer removes refunds, support and chargebacks. It does not remove publishing liability, copyright liability, FTC obligations, or tax. |
| **The real risk in this whole category** | Not legal. **Platform termination and algorithm change, with no appeal.** Every structure here is a tenancy. |

Nothing is committed. This is input to a decision the owner makes.

---

## Read this first

**I am not a lawyer and I am not an accountant.** This is business research. It
creates no professional relationship and should not be relied on the way advice
from counsel or a CPA would be. Said once, plainly, as instructed.

**Verification labels**, same scheme as the rest of the research folder:

| Label | Meaning |
|---|---|
| `[verified]` | Primary source read in full. |
| `[review]` | Search-index summary. Substance believed correct, page not opened. |
| `[conflict]` | Sources disagree, or the same fact has two published values. |
| `[NOT ESTABLISHED]` | Could not determine. Stated as unknown rather than guessed. |

The egress proxy on this machine blocks most primary sources. `irs.gov` and
`shopify.dev` were both refused during this session. One primary document was
retrieved and read in full: **Apple's Schedule 2 and 3 to the Developer Program
License Agreement, v126, dated 17 December 2025.** It turned out to be the most
load-bearing document in the whole file, and it says close to the opposite of
what the plan assumed. Everything else here is `[review]`.

No number, company, payout rate or policy in this document was invented. Where
something could not be established it says so.

---

## Part 1 — the structures, and who the counterparty actually is

The question that sorts this list is not "do I have a customer" but **"who has
the contract with the person who ends up holding the thing."** Those come apart
more often than expected.

### 1. Advertising-supported content (display)

**Counterparty:** the ad network. Mediavine, Raptive, Ezoic, Google AdSense. The
network buys inventory on your pages from advertisers and pays you a share.

**Legal relationship with the end user:** none, in either direction. The reader
downloads a page and leaves. There is no purchase, no licence, no delivery
obligation, no refund. This is the cleanest structure in the entire set and it
is the only one where "nobody is my customer" is literally true.

**What you owe:** accurate content and the network's policies. That is all.

### 2. Advertising-supported video and short-form (YouTube, TikTok)

**Counterparty:** the platform, which sells the ads and pays you a share.
YouTube keeps 45% of long-form ad revenue and pays 55% `[review]`.

**Legal relationship with the end user:** none. Same as above.

### 3. Affiliate and referral revenue

**Counterparty:** the merchant, or a network standing in for the merchant
(Amazon Associates, Impact, ShareASale, CJ).

**Legal relationship with the end user:** none. The buyer's contract is with the
merchant. You are paid for a referral, after the fact, on the merchant's
accounting, with no ability to audit it.

**The catch that is not a legal relationship but behaves like one:** the FTC
treats your recommendation as advertising. See Part 4.

### 4. Platform-as-seller marketplaces, where the platform genuinely is the seller

This is the category the plan needs, and it is smaller than the plan assumed.

- **Amazon KDP.** Amazon sells the book. You receive a royalty of 70% (list
  price $2.99–$9.99, eligible territories, less a delivery fee of roughly $0.15
  per megabyte) or 35% otherwise `[review]`. Kindle Unlimited pays per
  normalized page read out of a monthly fund, recently around $0.0043–$0.0048
  per page `[review]`.
- **Amazon Merch on Demand.** Amazon prints, sells, ships and handles returns.
  You license a design and receive a royalty `[review]`.
- **Adobe Stock, Shutterstock, Pond5.** The platform licenses your asset to the
  buyer under the platform's licence. Adobe pays a flat 33% on non-video and 35%
  on video, with a per-download floor of $0.33 rising to $0.38 at very high
  volume `[review]`. Shutterstock runs six tiers from 15% to 40% that reset every
  January `[review]`.
- **Udemy, Skillshare.** The platform sells the seat. Udemy pays 37% on organic
  marketplace sales and 97% on sales you drive yourself `[review]`.
- **Gumroad.** Merchant of record on every sale since 1 January 2025, which
  means Gumroad calculates, collects and remits sales tax, VAT and GST. Flat 10%
  plus $0.50 per transaction, with card processing on top `[review]`.

### 5. Platform-as-*agent* marketplaces, where you are still the seller

**This is the trap, and it contains the app stores.**

- **Apple App Store.** Read in full `[verified]`. Schedule 2 §1.1 appoints Apple
  as "Your agent" in one set of regions and "Your commissionaire" in another.
  §1.3: *"their relationship under this Schedule 2 is, and shall be, that of
  principal and agent, or principal and commissionaire… and that You, as
  principal, are, and shall be, solely responsible for any and all claims and
  liabilities involving or relating to, the Licensed Applications."* §4.3: *"the
  EULA for each of the Licensed Applications is solely between You and the
  End-User."* §6.2 makes you solely responsible for breach of warranty claims,
  product liability claims, and third-party IP claims arising from the app.
  Apple collects the money (§3.1) and takes 30%, or 15% under the Small Business
  Program at under $1,000,000 of annual proceeds (§3.4). Which region list the
  United States sits on is **`[NOT ESTABLISHED]`** — Exhibit A is maintained in
  App Store Connect and is not in the PDF. It does not matter much: agent or
  commissionaire, you are the principal and you carry the liability either way.
- **Google Play.** Google is merchant of record for the EEA and UK, acting as
  the developer's agent with the developer as principal. **The developer is the
  merchant of record for all other users, which includes the United States**
  `[review]`.
- **Envato (ThemeForest, CodeCanyon).** `[conflict]`. Envato is described as
  supplier of record for Australian GST, while Envato's own user terms are
  reported to say buyers and authors transact directly and that any legal claim
  about an item must be brought against the author, not Envato `[review]`. Do
  not treat Envato as a shield. Author fee moves to a flat 50% on 1 July 2026,
  down from up to 87.5% retained by top exclusive authors `[review]`.
- **Chrome Web Store.** Google shut down its own payments between 2020 and 2021
  `[review]`. There is no platform-as-seller option. Any paid extension bills
  the user through your own processor, which is a direct customer relationship.

### 6. Creator funds and revenue-share pools

**Counterparty:** the platform, paying from a pool it sizes itself.

- **YouTube Partner Program.** New applicants from 1 February need 1,000
  subscribers plus 8,000 qualified watch hours in 365 days, or 20 million
  qualified Shorts views in 90 days `[review]`. A lower tier at 500 subscribers
  and 3,000 watch hours opens non-ad features `[review]`.
- **TikTok Creator Rewards.** Paid on qualified views, not public view counts
  `[review]`.
- **Medium Partner Program.** Pool distribution, rebalanced repeatedly through
  2026 `[review]`.
- **Music streaming via a distributor.** DistroKid at $24.99/year flat, artist
  keeps the payout `[review]`.

**Legal relationship with the end user:** none. But the pool size is entirely
the platform's decision and it has been cut repeatedly across the industry.
Udemy's business-subscription share went 25% → 20% → 17.5% → 15% between January
2024 and January 2026 `[review]`.

### 7. Sponsorship

**Counterparty:** the brand. **This is a customer.** You owe a deliverable, on a
date, to a specification, and you can be sued for not delivering it. Inbound
sponsorship marketplaces (beehiiv's ad network, Paved) move the counterparty
back to the platform and remove the negotiation, at a large discount to
direct-sold rates. Direct sponsorship requires outreach and fails constraint 3
outright.

### 8. Licensing to a single business buyer

**Counterparty:** the buyer. This is a customer with a contract, a renewal, and
an expectation of support. It is out by definition of constraint 1, and it is
also the structure the existing Backpay work is built on. Noted once, not
argued.

### 9. Data and dataset sales through a marketplace

**Counterparty:** the marketplace.

**AWS Data Exchange** requires providers to be "a valid legal entity domiciled
in the United States or a member state of the EU," to be a permanent resident or
citizen in an eligible jurisdiction *or a business entity organized or
incorporated* there, to have a defined customer support process and support
organization, and to pass a manual review by the AWS Data Exchange business
operations team `[review]`. **Snowflake Marketplace** monetized listings are
open to "qualified partners" who demonstrate go-to-market readiness, with a
vetting call `[review]`.

The entity language is ambiguous enough that a sole proprietor might qualify.
The "customer support process and support organization" requirement is not
ambiguous. It fails constraints 3 and 5 regardless.

### 10. Bug bounty programmes

**Counterparty:** HackerOne, Bugcrowd, or the program owner. No customer, no
outreach, no entity, and payment is per accepted finding. It is skilled piecework
rather than an asset that compounds, and it does not run itself. Listed for
completeness because the structure genuinely admits it.

### 11. Domain parking, expired-domain rebuilds, site flipping

**Counterparty:** a parking network, or a one-time buyer on a marketplace.
Flipping produces a single lump rather than monthly revenue, and the underlying
asset still has to be built first. It is an exit, not a structure.

---

## Part 2 — every structure against the six constraints

Entity column reads: **Required** means the platform's own terms demand a
registered legal entity. **Not required** means an individual can enrol and
supplies a W-9 with an SSN. That distinction was checked rather than assumed,
because it decides several rows.

| Structure | Customer exists? | Platform between you and end user? | Entity required by terms? | What goes wrong, and who gets sued | Runs without outreach? |
|---|---|---|---|---|---|
| **Display ads on owned site** | No | Total. No end-user contract at all | **Not required.** Individual publishers enrol with a W-9 | You publish something false or infringing. **You get sued.** Advertiser has no claim on you | **Yes**, if the traffic source is search or social recommendation |
| **YouTube / TikTok ad share** | No | Total | **Not required.** AdSense accounts may be individual, in your legal name `[review]` | Content strike, copyright claim, demonetization. Rarely a lawsuit | **Yes** |
| **Affiliate links** | No | Total. Buyer contracts with the merchant | **Not required.** W-9 with SSN, tick "individual/sole proprietor" `[review]` | Undisclosed material connection, or an earnings claim. **FTC comes to you personally** | **Yes** |
| **Amazon KDP** | No | Yes. Amazon sells | **Not required** | Plagiarism or IP claim on the manuscript. **You** | **Yes** |
| **Amazon Merch on Demand** | No | Yes. Amazon prints, sells, ships, refunds | **Not required** | Design infringes a trademark. Account terminated, royalties withheld. **You** on the IP claim | Base tier yes. **Higher royalty tiers explicitly require external traffic**, which is marketing |
| **Adobe Stock / Shutterstock** | No | Yes. Platform licenses to the buyer | **Not required** | Model or property release missing, or an AI-provenance dispute. **You**, via the contributor indemnity | **Yes** |
| **Udemy / Skillshare** | No | Yes. Platform sells the seat | **Not required** | Course content claim, or a plagiarism takedown. **You** | **Yes**, but 37% vs 97% means the platform pays you a third for not marketing |
| **Gumroad** | Effectively yes | Gumroad is merchant of record `[review]` | **Not required** | You still have to send the buyer somewhere. Discovery is on you | **No.** MoR fixes the tax, not the demand |
| **Apple App Store** | **Yes** | **No.** Apple is your agent; you are principal `[verified]` | Individual enrolment is allowed and is the correct choice for a sole proprietor `[review]` | Product liability, breach of warranty, IP claim, all **explicitly yours** under Schedule 2 §6.2 `[verified]` | Discovery yes; support obligations no |
| **Google Play** | **Yes** | **No** in the US. You are merchant of record `[review]` | Personal accounts allowed. D-U-N-S is organization-only `[review]` | Same as Apple, plus you handle refunds | Personal accounts created after 13 Nov 2023 need **12 testers for 14 continuous days** before production `[review]` |
| **Chrome Web Store** | Yes, if paid | **No.** Store payments deprecated | Not required | You are the seller and the tax filer | No |
| **Envato** | `[conflict]` | `[conflict]`. Claims may lie against the author `[review]` | Not required | IP claim on a theme. Possibly **you** | Yes, on a declining marketplace |
| **AWS Data Exchange** | No | Yes | **Required, or close enough.** "Valid legal entity," plus a "support organization" `[review]` | — | **No** |
| **Snowflake Marketplace** | No | Yes | Partner vetting call `[review]` | — | **No** |
| **Direct sponsorship** | **Yes** | No | Not required | Non-delivery, non-disclosure | **No** |
| **Newsletter ad network** | No | Yes | Not required | Same as display | Yes |
| **Licensing to one business** | **Yes** | No | Not required, but strongly advised | Contract claim | No |
| **Bug bounty** | No | Yes | Not required | Scope violation | Yes, but it is hourly work |

Three rows deserve calling out.

**The app stores fail the test they were expected to pass.** The plan's premise
was that a store stands between the developer and the user. Apple's own contract
says the opposite in four separate places, and Google's says the developer is
merchant of record everywhere outside the EEA and UK. If the reason for avoiding
an entity is personal exposure, the app stores are the *worst* row in this table
rather than the best, because they combine a real end-user relationship with an
explicit contractual allocation of all liability to the developer.

**The entity requirement is real in exactly one place.** Data marketplaces. Every
other platform surveyed accepts an individual with a W-9. The generic advice the
owner objected to is, on this evidence, generic.

**Google Play's 12-tester rule** is a small thing that quietly costs weeks and,
for a person with no audience and no outreach, is genuinely hard.

---

## Part 3 — the honest ceiling

This is the part that decides the question. Every figure below is arithmetic on
the rates in Part 1. The rates are `[review]`; the arithmetic is mine and can be
checked.

### Display advertising

Mediavine sites commonly report $15–$40 session RPM, Raptive $18–$50+, AdSense
roughly $3–$12 `[review]`. Use **$25** as a working mid-point for a decent niche
outside Q4.

| Target | Sessions per month required at $25 RPM |
|---|---|
| $1,000 | 40,000 |
| $5,000 | 200,000 |
| **$10,000** | **400,000** |
| **$30,000** | **1,200,000** |

For scale: the entry threshold to Mediavine has historically been 50,000
monthly sessions, and is now reported as $5,000 per year in ad revenue, which is
about $17/day `[review]`. Raptive dropped to 25,000 monthly pageviews in October
2025 `[review]`. Ezoic moved the *other* way in February 2026, from 10,000 users
a month to 250,000 `[review]`.

A commonly cited benchmark puts 30,000–50,000 monthly views at roughly 18 months
and about 125 posts `[review]`. That benchmark predates the current search
environment. Google referral traffic to publishers is reported down 38%
year-on-year, organic CTR down 61% on queries where an AI Overview appears, and
around 58% of searches now ending without a click `[review]`. Affiliate review
sites specifically averaged a 58% traffic loss through the helpful-content
changes `[review]`.

**So: 400,000 sessions a month, from zero, solo, no outreach, in a search
environment losing referral volume every quarter. Three to five years, and it is
not certain at the end of it.** $30,000/month on display alone is 1.2 million
sessions. That is a small media company.

### Affiliate

Amazon Associates runs 1% to 10%, with most high-volume categories at 3–6%
`[review]`. At 4% on a $100 order, a conversion is worth $4.

$10,000/month is **2,500 conversions a month.** On typical funnel rates that
implies roughly the same 400,000–1,000,000 monthly pageviews as the display
math, which is the point: it is the same audience, monetized twice. That is why
the two belong on one asset.

The arithmetic changes completely at higher commission values. A $100 SaaS or
finance commission needs 100 conversions a month for $10,000. That is a real
route, and it is the only place in this entire document where the required
audience is small enough to be plausible for one person. It is also the exact
content category where Google now applies full E-E-A-T scrutiny `[review]`, and
where a solo operator with no credentials has the hardest time ranking.

### YouTube

Long-form RPM commonly $1–$7, with finance, B2B and insurance reaching $20+, and
gaming and broad entertainment near $0.50 `[review]`. Shorts are $0.03–$0.10 per
1,000 `[review]`.

| Target | Views/month at $5 RPM | At $15 RPM (high-value niche) |
|---|---|---|
| $10,000 | 2,000,000 | 667,000 |
| $30,000 | 6,000,000 | 2,000,000 |

Shorts at $0.05 RPM would need **200 million views a month** for $10,000. That
number is not a typo and it is why short-form funds are not a business.

### TikTok Creator Rewards

$0.40–$1.00 per 1,000 qualified views, with $0.20–$0.40 also widely reported
`[conflict]` `[review]`. At $0.60, $10,000/month is **16.7 million qualified
views every month, forever.**

### Amazon KDP

A $4.99 ebook at 70% pays roughly $3.30 after delivery fee. **$10,000/month is
about 3,000 sales a month.** On Kindle Unlimited at $0.0045 per page, a
300-page book read all the way through pays about $1.35, so $10,000/month is
roughly **2.2 million pages read per month.**

### Stock assets

Adobe Stock at 33%, floor $0.33 per download `[review]`. **$10,000/month is
25,000–40,000 downloads a month.** Shutterstock **does not accept AI-generated
content from external tools** at all `[review]`, which removes the obvious
AI-scale play on the larger of the two libraries. Adobe accepts it with
provenance conditions `[review]`.

### Amazon Merch on Demand

Base Creator tier pays $2.44 on a $19.99 shirt. Plus tier ($4.88) requires 15%
of monthly US sales from external traffic; Premium ($5.27) requires over 35%
`[review]`. **$10,000/month at base rate is about 4,100 shirts a month.** The
higher tiers are, by design, a payment for doing marketing. Under the no-outreach
constraint the owner is permanently on the base tier.

### Udemy

An analysis of hundreds of thousands of courses put average instructor earnings
at **$3,306 a year**, with **75% of instructors under $1,000 a year** and about
**1% above $50,000 a year** `[review]`. $10,000/month is $120,000 a year, which
is inside that top 1% and above it.

### Apps

The median app earns under $1,000 a month; about 81% never cross that in two
years; roughly 4.6% reach $10,000 MRR; the top 1% of publishers take about 90%
of store revenue `[review]`. A second source puts the median under $50/month
after a year `[conflict]`.

### Music streaming

$0.003–$0.005 per stream `[review]`. $10,000/month is **2 to 3.3 million streams
a month.**

### Newsletter advertising via a network

Direct-sold primary placements run $30–$60 CPM, B2B and finance $40–$120
`[review]`. Network rates are set by the advertiser and are materially lower; a
$5 CPM example appears in beehiiv's own documentation `[review]`. A
10,000-subscriber list at a 40% open rate is 4,000 opens; at $15 CPM that is
**$60 per send.** The $30–$60 CPM numbers are what you get for selling, which is
outreach.

### The summary nobody wants

| Structure | $10,000/month needs | $30,000/month needs | Plausible solo, no outreach? |
|---|---|---|---|
| Display ads | 400k sessions/mo | 1.2M sessions/mo | $10k: hard, 3–5 yrs. $30k: no |
| Affiliate, low ticket | ~2,500 conversions/mo | ~7,500/mo | Same audience as above |
| Affiliate, high ticket | ~100 conversions/mo | ~300/mo | **The one plausible route** |
| YouTube long-form | 2M views/mo | 6M views/mo | $10k: maybe. $30k: top tier |
| Shorts / TikTok | 17M–200M views/mo | 3x that | No |
| KDP | ~3,000 sales/mo | ~9,000/mo | No |
| Stock assets | 25–40k downloads/mo | 75–120k/mo | No |
| Merch on Demand | ~4,100 shirts/mo | ~12,300/mo | No |
| Udemy | Top ~1% of instructors | Well beyond it | No |
| Apps | Top ~5% | Top ~1% | Fails constraint 1 anyway |

**Stated plainly: a no-customer structure does not reach $30,000 a month for a
solo operator who will not do outreach, in any timeframe worth planning around.**
It is not that nobody does it. It is that the people who do are either running
a team, doing sales, or sitting on a decade-old asset.

The achievable range, on this evidence, is **$2,000 to $8,000 a month at 24 to 36
months**, with **$10,000 to $15,000** reachable if the niche has high-value
affiliate offers, the content survives the search environment, and the owner
gets a good outcome rather than an average one.

One correction against myself, because the earlier framing deserves it: I went
into this expecting the app stores to be the answer, on the theory that a store
is a shield. Reading Apple's Schedule 2 killed that. The document is unusually
blunt about it and it says you are the principal.

---

## Part 4 — what liability actually remains, ranked by likelihood of biting

Removing the customer removes the refund, the chargeback, the support ticket and
the buyer's contract claim. Here is what it does not remove, most likely first.

### 1. Platform termination and algorithm change — near certain over five years

This is the real risk in the entire category and it is not a legal risk. There
is no court, no appeal that works, and no insurance.

- **AdSense.** An account disabled for invalid traffic serves no ads and the
  publisher may not use Google ad products in future. Appeals are rarely
  successful. Accounts closed for invalid traffic may not open a new account, and
  outstanding balances are refunded to advertisers rather than paid `[review]`.
- **Amazon Associates.** Either party may terminate at any time, with or without
  cause, on seven days' notice. Accounts are closed automatically without three
  sales in the first 180 days. Outstanding commissions are not paid if you are
  out of compliance `[review]`.
- **Apple.** Schedule 2 §7.3, read in full: Apple *"reserves the right to cease
  marketing, offering, and allowing download by End-Users of the Licensed
  Applications **at any time, with or without cause**"* `[verified]`. §7.1 lets
  Apple withhold payments on mere suspicion of an improper act `[verified]`.
- **Amazon Merch.** Termination withholds all royalty payments, takes down all
  designs, and prohibits a new account `[review]`.
- **Google Search.** The helpful-content system folded into core ranking in
  March 2024; publishers reported 30–90% losses; affiliate review sites averaged
  -58%; the December 2025 core update extended full E-E-A-T scrutiny into
  affiliate and how-to content `[review]`.
- **Google's scaled content abuse policy.** Manual actions and full
  deindexing have been issued in waves since roughly June 2025, and the March
  2026 core update named scaled content abuse as a primary target, with sites
  publishing large volumes of unedited AI pages reporting 50–80% drops
  `[review]`.

That last one is aimed directly at "solo operator building with AI." The policy
does not prohibit AI content; it prohibits volume without value, and it does not
distinguish by how the text was produced `[review]`. Whatever gets built here has
to survive that test on the merits.

### 2. Tax — 100% certain, and unaffected by any of this

- Self-employment tax is 15.3% on 92.35% of net earnings: 12.4% Social Security
  up to a 2026 wage base reported as $184,500, plus 2.9% Medicare uncapped
  `[review]`.
- Schedule C plus Schedule SE. Quarterly estimated payments are required if you
  expect to owe $1,000 or more; 2026 due dates 15 April, 15 June, 15 September,
  and 15 January 2027 `[review]`.
- The QBI deduction of up to 20% applies below $197,300 single / $394,600 joint
  and is now permanent `[review]`.
- **Form 1099-K reverted to $20,000 and 200 transactions** for 2025 onward under
  the July 2025 tax act `[review]`. Maryland, Massachusetts, Vermont and Virginia
  set $600 with no transaction minimum `[review]`. Income is taxable whether or
  not a form arrives; the threshold governs the platform's paperwork, not your
  obligation.
- Every platform surveyed accepts a W-9 with an SSN, ticking "individual/sole
  proprietor" `[review]`. Google requires US tax info from every monetizing
  YouTube creator worldwide before first payment `[review]`.
- Sales tax is mostly not your problem here, and that is a genuine benefit of
  the structure. Marketplace facilitator laws put collection on the platform, and
  Gumroad, Amazon and Etsy all handle it `[review]`.

Nothing above changes if an LLC is formed. A single-member LLC is a disregarded
entity by default, which the project's own `legal/01-ENTITY-AND-TAX.md` already
records.

### 3. Copyright and image licensing — likely, and cheap to prevent

Getty runs automated image-recognition crawling against its licence database and
sends settlement demands when it finds no match. Reported demands include $380
and $1,430 `[review]`. Statutory damages for proven innocent infringement can
drop to $200 `[review]`.

This bites bloggers constantly and it is almost entirely avoidable: use only
assets you generated or licensed, and keep the receipt. There is no entity that
protects against it that a filing habit does not protect against better.

### 4. FTC disclosure — moderate for a warning, low for a penalty

An affiliate commission is a material connection and requires a clear and
conspicuous disclosure in or before the content, every time, on each piece rather
than once on an About page `[review]`. Maximum civil penalty per violation is
reported at $50,120, $51,744 and $53,088 in different places `[conflict]`; these
are the same inflation-adjusted figure at different dates.

The 2024 enforcement pattern is instructive. The FTC went after **earnings
claims**, and it named the individual influencers alongside the company in Total
Wealth Academy `[review]`. A missing disclosure on a product review is a warning
letter. A claim about how much money the reader will make is a case.

Practical read: disclose on every page, never make an income or health claim, and
this drops to near zero.

### 5. Defamation and factual error — least likely, worst tail

Section 230 protects you for what other people post. It does not protect your own
words. Defending even a baseless defamation claim can exceed $50,000 `[review]`.
Media liability insurance for small publishers runs roughly $500–$2,500 a year,
or $50–$150 a month `[review]`, with minimum limits typically $500,000 to $1
million `[review]`.

For most niches the exposure is near zero, because the risk is a function of
whether you write about named people and companies. A site about mattresses does
not get sued for defamation. A site that says a named supplement company is
running a scam might. That is a content choice, made once, not a structural
problem.

**The ranking, condensed:** platform termination is the one that will happen. Tax
is the one that already applies. Copyright is the one that is cheap to avoid.
FTC is the one that behaves if you behave. Defamation is the one you can simply
decline to take on.

---

## Part 5 — ranking by expected earnings per hour of the owner's time

Given: no outreach, solo, building with AI, under $1,000 to start.

**1. One owned content property, display ads plus affiliate.**
Highest ceiling of the compliant set, and the only one where two revenue lines
sit on a single asset so the work compounds. AI genuinely helps with drafting and
with programmatic page generation, subject to the scaled-content-abuse
constraint. Zero setup cost beyond a domain. No end-user relationship in either
direction, which makes it the only structure where "nobody is my customer" is
literally rather than approximately true. The weakness is severe and should not
be glossed: the entire demand side is one company's ranking algorithm, and that
algorithm is currently taking traffic away from exactly this kind of site.

**2. Ad-supported long-form video.**
Better revenue per unit of audience than a blog, and the discovery engine still
recommends rather than answers, which is a real structural advantage over search
right now. It ranks second only because video production is hours of the owner's
time per unit in a way that text is not, and because the YPP entry bar just
doubled to 8,000 watch hours `[review]`.

**3. High-ticket affiliate in a narrow commercial niche.**
Ranked separately from #1 because the arithmetic is genuinely different. 100
conversions a month for $10,000 is the only figure in Part 3 that a single person
could plausibly hit. It is also the hardest content to rank without credentials.
Best expected value per hour if it works; highest chance of returning zero.

**4. Digital asset marketplaces (KDP, Adobe Stock).**
Truly no-customer, truly no-outreach, genuinely AI-scalable, and the per-unit
economics are so thin that the required volume is out of reach. Worth running as
a secondary line off assets produced for #1, never as the main plan.

**5. Apps.**
Best per-user economics in the document and it fails constraint 1 on the
contract language. You are the principal, the EULA is yours, and Apple's §6.2
hands you every product liability and IP claim `[verified]`. If the owner's
objection to an entity is personal exposure, this row is the one to avoid, not
the one to pick.

**6. Creator funds and short-form.**
Worst earnings per hour in the set by an order of magnitude. The arithmetic in
Part 3 is not close.

**7. Data marketplaces, sponsorship, single-buyer licensing.**
Excluded. Entity and support-organization requirements, or outreach, or an actual
customer.

### What I would pick

**#1, built in a niche chosen for #3.** One site. Text. Commercial-intent
queries with high-value affiliate offers behind them, display advertising layered
on once traffic clears a network's bar. It is the only structure in this document
that satisfies all six constraints without a caveat, costs about $12 to start,
and produces an asset the owner owns rather than a position in someone's payout
pool.

I would plan for **$3,000–$6,000 a month at 24 months** and treat anything above
$10,000 as an outcome rather than a forecast.

### And the conclusion the evidence forces

**The constraint set is too tight for $20,000–$50,000 a month.** Not marginally.
By roughly a factor of four at the low end of the target.

Two of the six constraints are doing nearly all of the damage, and it is not the
two the owner expects. It is not "no entity" — that costs nothing, and only one
platform surveyed required one. It is **no customer** combined with **no
outreach**. Together they mean the only possible source of demand is a platform's
recommendation algorithm, which converts the whole business into a tenancy and
caps it at whatever the algorithm feels like sending.

The owner should decide against real numbers rather than against a feeling. The
numbers are: **$2,000–$8,000 a month is a realistic target under these
constraints. $10,000–$15,000 is a good outcome. $30,000 is not a plan.**

If $20,000–$50,000 is the number that matters more than the constraints, then one
of the two constraints has to move, and the cheaper one to move is almost
certainly "no customer" rather than "no outreach" — the existing Backpay work
already sits on the customer side of that line with a liability posture that was
screened and came back low. That is the owner's call and this document does not
make it.
