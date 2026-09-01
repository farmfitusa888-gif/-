# Who actually sells to the customer

Written 2026-09-01. Scope: which selling platforms genuinely stand between a
solo individual and the end user, what their terms actually say, and which ones
do not do the thing sellers assume they do.

The question behind this document is narrow and practical. Someone has decided
that forming a company is a dealbreaker and wants to sell only where the
platform is the legal seller, so that no customer relationship attaches to them
personally. That plan depends on two facts about each platform: whether it
really is the seller, and whether it will take an individual. Several of the
obvious candidates fail one or both.

---

## Verdict box

**The biggest surprise, and it inverts the premise of the brief.**
Apple is **not** the merchant of record in the United States. Schedule 2 of the
Paid Applications Agreement appoints Apple as *your agent*, with you as
*principal*, and says in terms that "You, as principal, are, and shall be,
solely responsible for any and all claims and liabilities involving or relating
to, the Licensed Applications." Section 4.3 adds that the end user licence "is
solely between You and the End-User." A customer relationship exists. It is
yours. Apple collects the money and remits the sales tax, which is what people
are seeing when they call Apple the merchant of record, but that is marketplace
facilitator tax law doing the work, not the contract. `[verified]`

Google Play, which the brief expected to be the weaker of the two, uses the same
agent-and-principal structure but then calls itself the merchant of record for a
defined list of countries, and says the developer is merchant of record for
everywhere else. `[review]` So the popular framing is roughly backwards on
Apple and roughly half right on Google.

**Pass, in the sense that the platform is the legal seller and takes an
individual:** Kindle Direct Publishing, Adobe Stock, Udemy, Redbubble, Amazon
Merch on Demand, Gumroad, itch.io (with the right payment setting), Teachable
via teachable:pay, Skool, Patreon, Envato Market, Creative Market.

**Fail outright:** Chrome Web Store (no payment system at all since 2021), the
WordPress.org directories (free products only), Printful and Printify (you are
the merchant, explicitly), Podia, Substack, Ko-fi, Buy Me a Coffee (all four put
tax collection on the creator).

**Mixed, and the reason matters:** Apple App Store and Google Play both take
individuals, both handle the tax, and both then publish the individual's real
identity. Apple displays your legal name as the seller and, under the EU
Digital Services Act, your address, phone number and email on the product page.
Google displays legal name, country and developer email, and personal accounts
with in-app purchases have their residential address published. `[review]`

**The second surprise.** The insulation people want from merchant-of-record
status is mostly tax insulation. It is not anonymity, and on the two largest
platforms it is close to the opposite of anonymity.

---

## Read this before anything else

**I am not a lawyer.** This is commercial research on contract terms. It is not
legal advice, it creates no professional relationship, and nothing here should
be relied on the way advice from counsel would be.

**The network on this machine blocks almost every primary source.** One host,
`developer.apple.com`, was reachable. Everything else was refused by the egress
proxy, including `play.google`, `gumroad.com`, `shopify.dev`, `wordpress.org`,
`kdp.amazon.com` and every other terms page I tried. So Apple is the only
platform in this document read from the contract itself.

| Label | Meaning | Count |
|---|---|---|
| `[verified]` | Primary document read in full. Apple only. | ~20 claims |
| `[review]` | Search-index summary. Substance believed correct, page not opened. | most of this file |
| `[conflict]` | Sources disagree, or a platform's own wording contradicts itself. | 5 |
| `[NOT ESTABLISHED]` | I could not find it and refuse to guess. | 9 |

No fee, threshold, percentage or policy clause below is invented. Where I do
not have the number, the row says so.

---

## The distinction that decides everything

Three arrangements get called "merchant of record" and only one of them does
what a solo seller wants.

**Reseller or retailer.** The platform buys or licenses from you and sells in
its own name. It sets or controls the price, owns the customer, handles tax,
refunds and chargebacks, and pays you a royalty. Amazon KDP, Adobe Stock,
Redbubble and Merch on Demand work this way. This is the real thing.

**Commissionaire.** A civil-law device. The platform sells in its own name but
on your account. The customer sees the platform. You remain the economic
principal. Apple uses this for the regions listed in Exhibit A Section 2, via
Apple Distribution International Ltd. in Cork. `[verified]`

**Agent, or marketplace facilitator.** The platform sells *in your name*, takes
a commission, and collects the transaction tax because tax statutes make
marketplaces do that. You are the seller. Apple in the United States. Google
Play outside its listed countries. Etsy, Shopify and most app stores sit here.

Marketplace facilitator laws are the reason the middle and bottom categories get
blurred. A platform that remits your sales tax is doing something genuinely
useful, and it is not the same as being the seller.

---

## 1. Apple App Store

Read from the Paid Applications Agreement (Schedules 2 and 3), the Exhibits to
Schedules 2 and 3, and the Apple Developer Program Licence Agreement, all
downloaded and parsed in full. Everything in this section is `[verified]`
unless marked otherwise.

**a) Merchant of record?** No, not in the US. Schedule 2 §1.1: you appoint Apple
as "(i) Your agent for the marketing and delivery of the Licensed Applications
to End-Users located in those regions listed on Exhibit A, Section 1 ... and
(ii) Your commissionaire ... to End-Users located in those regions listed on
Exhibit A, Section 2." Section 1.3 makes the consequence explicit: the
relationship is "that of principal and agent, or principal and commissionaire,
as the case may be ... and that You, as principal, are, and shall be, solely
responsible for any and all claims and liabilities involving or relating to, the
Licensed Applications."

Section 4.3: "the EULA for each of the Licensed Applications is solely between
You and the End-User ... and Apple shall not be responsible for, and shall not
have any liability whatsoever under, any EULA."

Apple does collect and remit. Exhibit C §15.2, United States: "If Apple, in its
reasonable belief, determines that any state or local sales, use or similar
transaction tax may be due ... Apple will collect and remit those taxes to the
competent tax authorities." Note the next clause. "To the extent that the
incidence of any such tax, or responsibility for collecting that tax, falls upon
You, You authorize Apple to act on" your behalf. The incidence stays with you.

**b) Individual or company?** Individual. The Programme Licence Agreement
defines "You" as "the person(s) or legal entity" that accepted the agreement.
A sole proprietor enrols as an individual and their legal name appears as the
seller on the App Store; Apple does not accept DBAs, trade names or fictitious
business names on individual accounts. `[review]` For the EU, Articles 30 and
31 of the Digital Services Act require Apple to verify and display trader
contact details, including an address, on the product page, and apps without a
declared trader status were pulled from the EU App Store in February 2025.
`[review]`

**c) Economics.** Commission 30% of all prices payable by the end user, dropping
to 15% on auto-renewing subscription renewals after a customer has accrued more
than one year of paid service in a Subscription Group (§3.4(a)). The App Store
Small Business Programme reduces this to 15% for developers whose accounts
earned no more than $1,000,000 in total proceeds in the prior calendar year
(§3.4(b)); crossing $1m mid-year moves you to the standard rate for the rest of
that year. Membership costs $99 a year. `[review]` **Payout threshold and
schedule: `[NOT ESTABLISHED]`.** Schedule 2 §3.5 says Apple deducts commission
and taxes and remits the balance, and sets no minimum. The operational minimum
lives in App Store Connect, which I could not reach. I am not going to quote a
number I have not seen.

**d) What you stay liable for.** More than most people expect.
- §3.3: "You shall indemnify and hold Apple harmless against any and all claims
  by any tax authority for any underpayment or overpayment of any sales, use,
  goods and services, value added, telecommunications or other tax or levy, and
  any penalties and/or interest thereon." Apple collects the tax and you carry
  the risk on it.
- §3.6 and §3.7 push withholding taxes and any levy Apple did not collect onto
  your account, with a further indemnity for underpayment.
- §6.3: when Apple refunds a customer, "You shall reimburse, or grant Apple a
  credit for, an amount equal to the price." Chargeback economics flow back.
- Programme Licence Agreement §10: you indemnify Apple, its directors, officers
  and employees against "any and all claims, losses, liabilities, damages,
  taxes, expenses and costs, including without limitation, attorneys' fees and
  court costs" arising from breach of the agreement, third-party IP claims
  against your product, or breach of the EULA.

There is no cap and no entity between the indemnity and the individual who
signed. That is the whole argument for a company, sitting inside the contract of
the platform most often described as insulating.

**e) Termination.** Schedule 2 §7.3: Apple may cease marketing your apps "at any
time, with or without cause, by providing notice of termination to You."
Programme Licence Agreement §11.2: termination is effective immediately on
notice for the listed grounds, with a 30-day cure window only for ordinary
breach; either party may terminate for convenience on 30 days' written notice.
Section 7.1 lets Apple withhold all payments on termination "for a period that
Apple determines is reasonable" to offset refunds, and lets Apple withhold
payments outright where it "determines or suspects" fraud.

Track record: Apple's own 2024 transparency report says 146,747 developer
accounts were terminated over fraud concerns and 139,000 enrolments rejected.
`[review]` Phillip Shoemaker, formerly head of App Store review, said publicly
in November 2025 that developers are terminated on suspicion of fraud with no
meaningful evidence, no clear appeal, and Apple holding unpaid revenue.
`[review]` Appeals to the App Review Board do sometimes succeed; at least one
2026 pending-termination case was rescinded. `[review]`

## 2. Google Play

All `[review]`.

**a) Merchant of record?** In part, and Google says so plainly. The Developer
Distribution Agreement reads, in substance: acting as your agent with you acting
as principal, Google is the merchant of record for products sold to users in
listed countries and territories, and "You are the merchant of record for
Products You sell or make available via Google Play to all other users." The
listed set began as the EEA and the UK and has grown. Which countries are on it
today: `[NOT ESTABLISHED]`. The structure is the same agent-and-principal frame
Apple uses; Google just applies the merchant-of-record label to itself in part
of it. `[conflict]` with the widespread claim that Google is never merchant of
record.

**b) Individual or company?** Individual, with conditions that are tightening.
Personal accounts must complete identity verification: government photo ID,
proof of address, phone verification. From September 2026 no new personal
account reaches production without it. Google displays your legal name, country
and developer email on Play. Personal developers verify with a residential
address, and that address is published if the app includes in-app purchases.
Organisations need a D-U-N-S number.

**c) Economics.** $25 one-time registration, no annual fee, unlimited apps.
Service fee 15% on the first $1m of earnings a year and 30% above that, subject
to enrolment in the reduced tier. Payout threshold and schedule:
`[NOT ESTABLISHED]`.

**d) What you stay liable for.** Standard developer indemnity plus the tax
consequence of the split: outside Google's merchant-of-record countries you are
the seller for transaction tax, which means registration and remittance are
yours wherever you have an obligation. `[NOT ESTABLISHED]` on the exact
indemnity wording, since I could not open the agreement.

**e) Termination.** Terminations citing section 8.3 with no specific violation
named are widely reported through early 2026, including for accounts with long
clean records. Appeals must be filed within 180 days or the case closes
permanently. Enforcement is now association-based: a shared IP subnet, device
fingerprint, payment method or phone number connected to a previously terminated
account can taint a new one.

## 3. Gumroad

All `[review]`.

**a) Merchant of record?** Yes, and this is the cleanest small-scale example in
the set. Gumroad has acted as full merchant of record on every transaction since
January 2025, calculating, collecting and remitting sales tax and VAT.

**b) Individual or company?** Individual. Identity verification affects your
payout threshold rather than your eligibility.

**c) Economics.** 10% flat, plus card processing. `[conflict]`: several 2026
summaries give 10% + $0.50 per transaction plus roughly 2.9% + $0.30 card fees,
others describe 10% as all-inclusive. Sales through Gumroad's own Discover
marketplace are charged at 30%. Payouts weekly on Fridays. In March 2026 the
standard minimum payout rose from $10 to $100; verified accounts drop back to
$10.

**d) What you stay liable for.** "Each Supplier agrees to indemnify and hold the
Gumroad Parties harmless from any losses, costs, liabilities, and expenses
(including reasonable attorneys' fees) relating to or arising out of ... such
Supplier's Products and Supplier Properties," carved back so it does not cover
Gumroad's own fraud, misrepresentation or unconscionable practice. It survives
termination of your account.

**e) Termination.** Section 8 lets Gumroad suspend an account and refund its
sales. The public record here is bad: creators with years of clean history
permanently banned, balances frozen, payouts marked skipped for risk review,
support unresponsive. Trustpilot sat at 1.4 out of 5 in March 2026 with 83% of
reviews at one star. PayPal ended its service relationship with Gumroad in
December 2024, which removed a payout route with no notice to sellers.

## 4. Chrome Web Store and other extension stores

All `[review]`.

**a) Merchant of record?** Neither, because there is no payment system. Google
shut Chrome Web Store Payments on 1 February 2021. Paid extensions now require
the developer to run their own checkout, which means the developer is the
merchant in every sense. Firefox Add-ons and Edge Add-ons never had a payments
layer either.

**b) Individual or company?** Individual, trivially.

**c) Economics.** Chrome Web Store: $5 one-time registration, up to 20 items.
Firefox and Edge charge nothing.

**d) What you stay liable for.** Everything commercial, since the store is only
distribution.

**e) Termination.** Removal is at Google's discretion and the Manifest V3
transition has already killed working extensions wholesale.

**This is the clearest fail in the set** and it fails for a structural reason:
the store is not in the money path.

## 5. Shopify App Store, WordPress marketplaces, Figma Community

**Shopify App Store** `[review]` `[conflict]`. Every app on the store must use
a Shopify billing solution. Shopify charges the merchant, then remits your share
"with tax included," and the developer documentation then says it is your
responsibility to remit taxes to the appropriate authorities, with joint
election forms in some jurisdictions. Those two statements sit awkwardly
together, so I am marking merchant-of-record status unresolved rather than
claiming it. Revenue share: 0% on the first $1,000,000 of gross app revenue
earned from 1 January 2025, 15% above that, with the 0% tier unavailable to
developers over $20m through the store or $100m company revenue. All billing
carries a 2.9% processing fee. One-time $19 per Partner account. Individuals can
hold a Partner account. Payout threshold: `[NOT ESTABLISHED]`.

**WordPress.org plugin and theme directories** `[review]`. Free products only.
The directory does not host paid items and has no payment system, so it cannot
be merchant of record for anything. Commercial WordPress work is sold through
your own site, through Envato, or through a third-party merchant of record.
Distribution channel, not a selling channel.

**Figma Community** `[review]`. Creators are approved, then must activate a
Stripe account before publishing paid resources. Figma handles purchase support,
content delivery, refund management and fraud monitoring, and "collects and
remits sales tax on your behalf." That last phrase is agent language, and the
Stripe requirement means a payment account exists in your name, so
merchant-of-record status is `[NOT ESTABLISHED]`. Fee 15%. Payout no sooner
than 30 US business days after a sale, at most one cash-out a week.

## 6. Stock asset marketplaces

**Adobe Stock** `[review]`. Adobe licenses the asset to its customer and pays
the contributor a royalty: 33% for non-video, 35% for video. Payout threshold
$25, requested by the contributor. Individuals accepted; without a valid tax
form on file Adobe withholds at up to 30%. Termination: Adobe can suspend or
permanently terminate for suspicious sales or refund activity, content spam or
fraud, an infringement takedown, or suspected breach of the contributor terms,
and permanently terminated accounts forfeit royalties. The contributor forums
carry a steady stream of deactivations with no specific reason given. Strong
insulation, real termination risk.

**Envato Market** `[review]`. You are not selling the item; you are making it
available for buyers to license. Envato acts as supplier for EU VAT and collects
and remits US sales tax. From 1 July 2026 exclusivity was removed entirely and
all authors moved to a single 50% author fee, meaning the author receives half
the item price component of the list price. Further amendments to the Market
Author Terms were proposed in May 2026. Envato Elements is separately
non-exclusive. Individuals accepted.

**Creative Market** `[review]`. Sellers receive 50% of net revenue on standard
licences. Minimum payout $20, handled through Tipalti. Sellers agree to pay
applicable taxes and Creative Market may withhold from payments as required by
law. Whether Creative Market is seller of record: `[NOT ESTABLISHED]`.

## 7. Print on demand

**Printful and Printify: fail, explicitly.** `[review]` Printful is a
fulfilment partner and is not a marketplace facilitator, so you collect and
remit sales tax in every state where you have economic nexus. Printify's own
help centre has a page titled "What am I responsible for as the Merchant of
Record?" for Pop-Up Store sellers, and the answer is that there are two
transactions, one between you and the customer and one between you and Printify,
and you are solely responsible for collecting, reporting and remitting all
applicable taxes. Printify does not collect sales tax as of 2026. These are
suppliers wearing a storefront. They put more on the individual, not less.

**Redbubble** `[review]` `[conflict]`. Redbubble presents itself as the
retailer to the customer and handles payment, fulfilment and refunds, but its
own help text says it "collects proceeds on behalf of the artist" and deducts
its service fee, shipping and the fulfiller's manufacturing fee before paying
the artist margin, which is agent phrasing. Default artist margin 20%,
adjustable, typically landing at 10-30% of purchase price. Minimum payout $20,
paid on the 15th for the previous month. Termination: suspended accounts have
any balance frozen under the user agreement, and sellers report deletion after
hundreds of dollars in sales with only a vague accusation of "misuse."

**Amazon Merch on Demand** `[review]`. Amazon is the retailer and pays a
royalty. Access is by application. From 1 June 2026 the flat royalty was
replaced by a three-tier structure keyed to the trailing two-month average of
non-organic traffic-driven sales, which cuts royalties by about half for sellers
who rely on Amazon's own traffic and raises them up to 2.16x for sellers driving
external traffic. Tiers now run on trailing 12-month performance, zero sales for
12 months can trigger a downgrade, and moving past tier 10 requires 80% slot
utilisation. Listings with no sales in their first 18 months are deleted
automatically. Strong insulation, and the platform rewrites your economics
without asking.

## 8. Course platforms

**Udemy** `[review]`. The terms say a student enrolling gets a licence from
Udemy and "Udemy is the licensor of record"; instructors grant Udemy the right
to sublicense. That is the seller relationship sitting with Udemy. Revenue
share: 37% to the instructor on marketplace sales, 97% when the student used the
instructor's own coupon or referral link. The subscription share fell to 20% in
January 2024, 17.5% in January 2025 and 15% in January 2026. Minimum payout $25.
Individuals accepted.

**Teachable** `[review]`. Teachable acts as merchant of record through the
teachable:pay gateway, calculating, collecting and remitting US sales tax and EU
VAT across a large country list and remitting VAT quarterly through OSS.
Merchant-of-record status is a property of the gateway you choose, not of the
platform, which is worth knowing before assuming it.

**Podia: fail.** `[review]` Podia connects to your own Stripe or PayPal
account. Tax filing and remittance stay with the creator. Checkout tax
calculation tools do not change who the seller is.

**Skool** `[review]`. Skool acts as merchant of record and handles VAT and
sales tax as a marketplace facilitator; EU members pay Skool directly and Skool
remits. Fees, payout terms and termination record: `[NOT ESTABLISHED]`.

## 9. Kindle Direct Publishing

All `[review]`.

**a) Merchant of record?** Yes, in the retailer sense. Amazon sells to the
customer and pays the author a royalty, and the KDP terms state that Amazon is
responsible for taxes on its sales to customers.

**b) Individual or company?** Individual. You must be 18 or the age of majority
and able to form a binding contract. A tax interview collects the tax
identification number; a sole proprietor supplies their own.

**c) Economics.** 35% or 70% royalty per title, chosen per book, with the 70%
tier carrying price-band and territory conditions. Royalties paid roughly 60
days after the end of the month of sale. No listing fee. Payment thresholds
vary by payout method and currency: `[NOT ESTABLISHED]`.

**d) What you stay liable for.** Content warranties and IP, backed by an
indemnity. Exact wording `[NOT ESTABLISHED]`.

**e) Termination.** The worst documented record in this document, and it is not
close. A November 2025 case: termination for unspecified "Content Guideline
violations," all titles removed, Amazon stating it would not reinstate the
account or pay outstanding royalties, decision final. A February 2026 case:
termination for "activities in your account trying to manipulate our services,"
no book named, no behaviour identified, no example given, books removed, unpaid
royalties kept. WritersWeekly has run this as a recurring series. The pattern is
termination plus forfeiture plus no explanation.

## 10. Substack, Patreon, Ko-fi, Buy Me a Coffee

All `[review]`.

**Substack: fail.** Substack is not a merchant of record. Each publisher is
responsible for registering as a seller and for collecting and remitting sales
taxes, because the Stripe account belongs to the publisher. Fee 10% plus Stripe
fees.

**Patreon: pass.** Patreon is the merchant of record and handles sales tax, and
is registered for EU VAT OSS in Ireland as a marketplace intermediary. Creator
pages published after 4 August 2025 are on a standard 10% platform fee plus
applicable taxes; earlier pages keep their old pricing. One-time purchases carry
platform fees of 5% to 12%. Minimum payout: `[NOT ESTABLISHED]`.

**Ko-fi: fail.** Ko-fi is not the merchant of record and does not process
payments; money moves through the creator's own Stripe or PayPal. Sales tax and
VAT are explicitly the creator's responsibility. 0% platform fee on the free
plan, $6/month Ko-fi Gold waives shop and membership fees.

**Buy Me a Coffee: fail.** Same shape. Stripe only, 5% platform cut, no VAT
handling.

## 11. Others worth knowing about

**itch.io** `[review]`. Selecting the "Collected by itch.io" payment mode makes
itch.io the merchant of record; the money reaches itch.io first and you request
a payout. The alternative mode pays you directly and makes you the merchant.
Revenue share is seller-set, 0% to 10%. No upfront cost. The only platform here
that lets the seller choose which side of the line to sit on.

**Steam** `[review]`. Valve is the seller. $100 Steam Direct fee per title,
recoupable once the game earns $1,000. 30% default share. Whether Valve accepts
an individual with no registered business: `[NOT ESTABLISHED]`.

**Paddle, FastSpring, Lemon Squeezy** `[review]`. Genuine merchants of record
for digital goods, handling EU VAT, US sales tax and GST. These are checkout
providers rather than marketplaces, so they solve the tax and seller-of-record
problem and bring no audience. Paddle and Lemon Squeezy both list at 5% + 50c;
FastSpring quotes privately. Whether they onboard an individual with no
registered entity: `[NOT ESTABLISHED]`, and it is the single most important open
question in this document for the plan as stated. Lemon Squeezy has been owned
by Stripe since July 2024; Stripe Managed Payments entered public preview in
February 2026 and Lemon Squeezy's own team is building it, with migration paths
announced. No shutdown date exists, but the direction is convergence.

---

## Comparison, ranked by how completely a solo individual is insulated

Ranking criterion: does the platform sell in its own name, does it take an
individual, does it keep the individual's identity off the customer-facing page,
and does it remove the need for the seller to register for tax anywhere.

| # | Platform | Legal seller | Takes individual | Identity published | Seller's cut | Insulation |
|---|---|---|---|---|---|---|
| 1 | Amazon KDP | Amazon, retailer | Yes | No | 35% / 70% royalty | Very high |
| 2 | Adobe Stock | Adobe, licensor | Yes | Contributor name only | 33% / 35% | Very high |
| 3 | Amazon Merch on Demand | Amazon, retailer | Yes, by application | No | Tiered royalty | Very high |
| 4 | Udemy | Udemy, licensor of record | Yes | Instructor profile | 37% / 97% | High |
| 5 | Redbubble | Redbubble, retailer `[conflict]` | Yes | Artist name only | ~20% margin | High |
| 6 | Gumroad | Gumroad, full MoR | Yes | Seller page | 90% less card fees | High |
| 7 | Skool | Skool, MoR | Yes | Community owner | `[NOT ESTABLISHED]` | High |
| 8 | Patreon | Patreon, MoR | Yes | Creator page | 88-90% | High |
| 9 | itch.io (collected mode) | itch.io, MoR | Yes | Seller page | 90-100% | High |
| 10 | Teachable (teachable:pay) | Teachable, MoR | Yes | Your school | Plan-dependent | Medium-high |
| 11 | Envato Market | Envato, VAT supplier | Yes | Author name | 50% from 1 Jul 2026 | Medium-high |
| 12 | Creative Market | `[NOT ESTABLISHED]` | Yes | Shop name | 50% of net | Medium |
| 13 | Figma Community | `[NOT ESTABLISHED]`, Stripe required | Yes, on approval | Creator profile | 85% | Medium |
| 14 | Shopify App Store | `[conflict]` | Yes | Partner name | 100% then 85%, less 2.9% | Medium |
| 15 | Apple App Store | **You**, Apple is agent | Yes | **Legal name; EU address, phone, email** | 70% or 85% | Low |
| 16 | Google Play | Split by country | Yes | **Legal name; home address if IAP** | 85% then 70% | Low |
| 17 | Podia | You | Yes | You | Plan-dependent | None |
| 18 | Substack | You | Yes | You | 90% less Stripe | None |
| 19 | Ko-fi | You | Yes | You | 100% on free plan | None |
| 20 | Buy Me a Coffee | You | Yes | You | 95% less Stripe | None |
| 21 | Printful / Printify | **You, explicitly** | Yes | You | Margin over cost | Negative |
| 22 | Chrome Web Store | Nobody, no payments | Yes | You | n/a | n/a |
| 23 | WordPress.org | Nobody, free only | Yes | You | n/a | n/a |

Insulation and income are inversely related in this table, which is the finding
that matters most. The platforms at the top pay a royalty on someone else's
pricing decision. The platforms with real pricing power are at rank 15 and 16
and both of them publish your home address in at least one major market.

---

## The ones that fail, and why

**Chrome Web Store, Firefox Add-ons, Edge Add-ons.** No payment system exists.
Google closed Chrome Web Store Payments on 1 February 2021 and the others never
had one. An extension developer who wants money must build a checkout, which
makes them the merchant. There is no version of this that satisfies the brief.

**WordPress.org plugin and theme directories.** Free products only, by policy.
Discovery channel.

**Printful and Printify.** They tell you directly. Printify's help centre
explains that you are the merchant of record and are solely responsible for
collecting, reporting and remitting all applicable taxes. Printful states it is
not a marketplace facilitator. Compared with running a plain digital business
these add a supplier relationship, a physical product, and sales tax nexus in
every state where you cross a threshold.

**Podia, Substack, Ko-fi, Buy Me a Coffee.** All four route through a Stripe or
PayPal account that belongs to the creator. That single fact settles it. The
creator is the merchant, the customer relationship is theirs, and the tax
obligation is theirs. Ko-fi's own help page says so.

**Apple and Google, on the specific test in the brief.** Both take individuals
and both handle transaction tax, so they do not fail commercially. They fail the
stated goal, which was that no customer relationship should exist. Apple's
Schedule 2 §4.3 creates one by contract. Both publish the individual's real
identity, and Google publishes a residential address where the app has in-app
purchases. Someone whose reason for avoiding a company is privacy or separation
gets neither here, and the indemnity in Programme Licence Agreement §10 reaches
the individual with no cap.

---

## The single point of failure

A business that lives entirely inside one platform's terms can be ended by that
platform, usually without a stated reason and sometimes without the money.

The category evidence is not anecdotal. Apple terminated 146,747 developer
accounts in 2024 by its own count. Its former head of App Store review says
terminations happen on suspicion of fraud with no evidence shared, no clear
appeal, and unpaid revenue retained. `[review]` Google Play terminations citing
section 8.3 with no named violation ran through early 2026, appeals close
permanently at 180 days, and enforcement now propagates by association, so a
shared IP subnet or a reused payment method can taint an unrelated account.
`[review]` Amazon KDP terminates authors, removes titles and keeps outstanding
royalties, with at least two documented 2025-2026 cases where nothing specific
was ever identified. `[review]` Gumroad suspends accounts and freezes balances,
and its Trustpilot distribution in March 2026 was 83% one star. `[review]`
Redbubble freezes any balance on a suspended account under its user agreement.
`[review]` Adobe Stock deactivations arrive without a stated reason and
permanently terminated accounts forfeit royalties. `[review]`

Three properties make this worse than ordinary commercial risk.

**The money is held by the party making the decision.** Apple Schedule 2 §7.1
lets Apple withhold all payments on termination for a period Apple determines is
reasonable, and withhold outright where it "determines or suspects" fraud.
`[verified]` That clause is not unusual. It is the norm.

**Terms change unilaterally and retroactively reprice the business.** Envato
moved every author to a 50% fee on 1 July 2026. Amazon Merch replaced flat
royalties with traffic-source tiers on 1 June 2026, roughly halving payouts for
sellers dependent on Amazon's own traffic. Udemy's subscription share went 20%,
17.5%, 15% in three consecutive Januaries. Gumroad's minimum payout went from
$10 to $100 in March 2026. None of these required the seller's agreement.

**Adjacency is contagious.** Google's association-based enforcement and Apple's
"Associated Developer Account" concept both mean a second account is not a
backup. It is a second thing to lose at the same time.

The mitigations are dull and they are the only ones that work. Sell the same
product on two unrelated platforms from the start. Keep an email list that lives
outside all of them. Withdraw the balance on every available cycle rather than
letting it accumulate, because a held balance is the platform's leverage. And
treat a platform that both sets the price and holds the money as a customer,
not as infrastructure.

---

## What I could not establish

Listed so nobody mistakes silence for absence.

1. Apple's payout minimum and schedule. Not in Schedule 2; lives in App Store
   Connect, which the proxy blocked.
2. Google Play's current merchant-of-record country list.
3. Google Play's payout threshold and schedule.
4. Google Play's indemnity wording, since the agreement itself was unreachable.
5. Whether Creative Market is seller of record.
6. Whether Figma is merchant of record, or an agent with a Stripe requirement.
7. Whether Shopify is merchant of record for app charges. Its own documentation
   points both ways.
8. Whether Paddle, FastSpring or Lemon Squeezy onboard an individual with no
   registered entity. This is the most consequential gap here.
9. KDP payment thresholds by method and currency, Skool's fee and payout terms,
   Patreon's minimum payout, and Steam's individual eligibility.

One correction against myself. I began this expecting the answer to be a short
list of platforms that make the entity question disappear. The list exists, and
it is longer than I expected. What it does not do is make the question
disappear, because the platforms with the strongest insulation are the ones that
pay a royalty on a price they set, and the two platforms where a solo developer
can actually price their own work are the two that publish their name and
address and hold an uncapped personal indemnity. That trade is the real finding,
and it is not the finding the brief was set up to produce.
