# Can a sole proprietor open a merchant-of-record account

Written 2026-09-01. Answers the open question left at the end of
`15-MERCHANT-OF-RECORD.md`: whether the checkout providers that genuinely resell
your product will take a person with no registered company.

---

## Verdict, one line

**Yes, conditionally.** Paddle states in its own help centre that business
verification is not required for individuals or sole traders, and at least six
other real merchants of record accept an individual; the condition is not an
entity but a live website, a digital product, and passing an identity check.

**Best option: Paddle.** What you actually supply is a government-issued photo
ID, a proof of address, a tax form (W-9 with your SSN for a US person), a bank
account for payout, and a live HTTPS site carrying your legal name in the terms
and conditions plus a refund policy with no exceptions in it. No registration
number. No certificate. No company.

**One thing this does not do**, and it matters more than the headline. These
providers remove the tax relationship and the payment relationship. They do not
remove the customer relationship, and Paddle says so directly: "You remain in
control of how you present your product and the ongoing relationship with the
customer." That is a live tension with constraint 1 in `CONSTRAINTS.md`, and
section 8 below sets it out rather than burying it.

---

## Read this first

**I am not a lawyer and I am not an accountant.** This is commercial research
into published terms and help-centre pages. It is not legal or tax advice.

**Every primary source was blocked.** The egress proxy answered 403 to CONNECT
on `paddle.com`, `docs.lemonsqueezy.com`, `fastspring.com`,
`developer.fastspring.com`, `polar.sh`, `docs.polar.sh`, `docs.creem.io`,
`docs.dodopayments.com`, `verifone.cloud` and `ftc.gov`. That is ten hosts, one
attempt each, all refused by policy. `developer.apple.com` was reachable for the
previous document; nothing here was. So there is not a single `[verified]` claim
in this file, and I am not going to pretend otherwise.

| Label | Meaning | Where it applies |
|---|---|---|
| `[verified]` | Primary document read in full | **Nowhere. Zero claims.** |
| `[review]` | Search-index summary of a named source page | Almost everything below |
| `[conflict]` | Sources disagree | 2 |
| `[NOT ESTABLISHED]` | Could not find it, refusing to guess | 11 |

No fee, threshold, percentage or policy clause here is invented. Where the
number is missing, the row says so.

---

## Comparison

Ranked by how confidently a sole proprietor can get an account open.

| Provider | Takes an individual? | Entity number needed | Fee | Payout minimum | Payout schedule | Genuine reseller |
|---|---|---|---|---|---|---|
| **Paddle** | Yes, stated explicitly | No | 5% + 50¢ | **$100** (raisable to $100,000) | Created 1st, paid by 15th | Yes, "seller on record" |
| **Polar** | Yes, "personal account" path | No | 5% + 50¢ new orgs; 4% + 40¢ grandfathered pre-27 May 2026 | `[NOT ESTABLISHED]` | On request over threshold | Yes |
| **Creem** | Yes, terms say "any natural person" | No | 3.9% + $0.40 | `[NOT ESTABLISHED]` | 1st and 15th | Yes |
| **Dodo Payments** | Yes, markets it as the point | No | 4% + $0.40, plus surcharges | $50 | Twice monthly | Yes, "official reseller" |
| **Lemon Squeezy** | Yes, sole prop / single-member LLC | No | 5% + $0.50 | $50 | 14th and 28th | Yes, "authorized reseller" |
| **2Checkout / Verifone** | Yes, SSN or ITIN accepted | No | `[NOT ESTABLISHED]` | `[NOT ESTABLISHED]` | `[NOT ESTABLISHED]` | Yes |
| **Freemius** | Yes, "self-employed individual" | No | `[NOT ESTABLISHED]` | `[NOT ESTABLISHED]` | `[NOT ESTABLISHED]` | Yes |
| **FastSpring** | **Conditional** `[conflict]` | Asks for a certificate | Quote only; historically 8.9% flat or 5.9% + $0.95 | `[NOT ESTABLISHED]` | 15th and month end, after a 45-day hold on new accounts | Yes, buys and resells |

FastSpring is the only one in the set that asks for a document a US sole
proprietor does not possess. Details in section 3.

---

## 1. Paddle

All `[review]`.

**a) Takes an individual?** Yes, and the wording is unusually direct. Paddle's
Business Identification help page says business verification is not required for
individuals or sole traders. Account creation prompts you to select a business
type, and Individual is one of the choices; picking it means you provide tax
information identifying you as a person instead of company documents. The
company-side path is the one that wants a legal business name, registration
number, ownership structure and a beneficial-ownership breakdown for anyone
holding 25% or more. None of that is asked of an individual.

What an individual does have to pass:

- **Identity verification.** Paddle's partner Sumsub may ask for a
  government-issued ID and a proof of address. Often instant; manual review
  runs an estimated 2 to 4 business days.
- **Domain review.** The site must be live and secured with HTTPS, and the sole
  proprietor's brand name must appear in the terms and conditions, with the
  legal name preferred. Submit only domains related to the product you are
  selling through Paddle.

Country differences: Paddle says it works with sellers anywhere in the world
other than sanctioned countries, naming Russia, Belarus, Iran and North Korea as
excluded. Whether the Individual business type is offered in every one of those
countries: `[NOT ESTABLISHED]`. A business bank account is not stated as
required; payout methods listed are bank transfer, PayPal and Payoneer.

**b) Genuinely merchant of record?** Yes, on its own words. "Paddle acts as a
Merchant of Record (MoR), which means, from a legal point of view, that Paddle
acts as a reseller of your product, and is, therefore, the 'seller on record'."
Another page: "For businesses and developers we work with, Paddle is an
authorized reseller of their products, as opposed to a 'payment provider'."
Paddle handles order processing and payment, VAT and sales tax collection,
filing and payment, order and billing support including invoicing, receipts and
delivery issues, and fulfilment.

**c) What the seller still carries.** The Master Services Agreement puts three
indemnities on the supplier: tax liabilities arising from any inaccuracy,
misrepresentation or omission in Product Information; trademark infringement
claims arising from Paddle's licensed use of your marks; and a broad one
covering "any and all claims, liabilities, penalties, settlements, judgments,
fees (including reasonable legal fees)" arising from supplier information,
breach of any representation or warranty, or failure to comply with laws in
connection with use of the service. Whether that indemnity is capped:
`[NOT ESTABLISHED]`.

For a sole proprietor this is the same structural problem the Apple contract
had. There is no entity between the clause and the person, so a supplier
indemnity is a personal indemnity. That is a fact about sole proprietorship
rather than a claim about Paddle's drafting, and it is true of every provider in
this document.

**d) Economics.** 5% + 50¢, described as flat and all-inclusive, with custom
terms negotiated for large sellers. Payout threshold minimum $100, adjustable
upward to $100,000; the balance in GBP or EUR translates to £100 or €100.
Payouts are created on the 1st and sent by the 15th, usually landing between the
2nd and 15th. Cross-currency payouts carry a conversion margin reported at 2% to
3% above mid-market, which is the fee most comparisons miss.

**e) What would rule it out.** The Acceptable Use Policy is the real gate, and
it bites hard on the models `CONSTRAINTS.md` favours. Refused: physical products
or anything requiring physical delivery; human services not tied to a software
offering, naming consulting, advisory, legal advice, coaching, IT services and
paid access to a community of experts; **products where there is no bona fide
software or service sold, "including but not limited to donations,
crowdfunding, community access, advertising, and sponsorship"**; products
enabling non-Paddle sellers to sell, meaning digital marketplaces; MLM, referral
schemes and get-rich-quick offers; adult content. Rejection reasons reported by
sellers also include an unclear refund policy, since Paddle wants a guarantee
with no exceptions attached, and domains flagged as high risk.

**f) Track record.** Mixed and worth taking seriously. Complaints across BBB and
Trustpilot in 2026 describe accounts closed and funds held for 90 or 180 days
and then not released at the end of the hold, including a $2,000 balance closed
without explanation and $11,500 held for seven months. At least one complainant
alleges risk decisions come from an AI tool without human validation. Separately
there is an FTC document at `ftc.gov` titled "Paddle – Complaint For Permanent
Injunction, Monetary Judgment, and Other Relief"; the file exists at that URL,
I could not open it, and its allegations and outcome are `[NOT ESTABLISHED]`.
Do not repeat it as an established fact.

## 2. Lemon Squeezy

All `[review]`.

**a) Takes an individual?** Yes. Tax documentation guidance addresses operating
"as an individual, Sole Proprietorship, or Single Member LLC" and says the IRS
expects the individual owner's name and SSN on the 1099 rather than a business
name and EIN. US merchants complete a W-9; the TIN can be an SSN. Each store has
one owner, who may be a corporation or other entity but **not a partnership**.
Store activation triggers KYC and KYB checks including personal information and
a photo of a government-issued ID. Payouts reach bank accounts in a supported
country list, with PayPal covering 200+ countries and regions.

**b) Merchant of record?** Yes. Lemon Squeezy describes itself as "an authorized
reseller of the product for the Supplier," responsible for collecting sales tax,
processing refunds and chargebacks, and PCI compliance, and states "if a tax
authority has any issues, we're on the hook, not you."

**c) Seller's residual liability.** The indemnity language I could reach was
from the buyer terms, not the supplier terms. The supplier-side indemnity
wording is `[NOT ESTABLISHED]`.

**d) Economics.** 5% + $0.50, no monthly fee, no tiers. Seller payout minimum
$50, automated on the 14th and 28th. Affiliate payouts run on the 1st and 15th
with a $10 minimum, which is where the widely quoted $10 figure comes from.

**e) Restrictions.** No services of any kind, naming marketing, design, web
development and consulting. No drugs or paraphernalia, alcohol, tobacco, vaping.
No NFT or crypto products. No donations or charity where no product exists or
the price exceeds the product's value. No Private Label Rights or Master Resell
Rights products.

**f) Track record.** Poor enough to matter. Sellers report stores shut down on
"undefined risk signals" with no detail given, payouts frozen including one over
$3,500, and customers refunded on delivered products with no chargebacks
recorded. One merchant's underlying Stripe account sat in Restricted status from
26 March 2026 and three payout cycles silently failed across April, May and June
before they found out in July. Another was held in an identity review for two
months. Support is described as an AI chat with human replies taking a week.

**Corporate direction.** Stripe has owned Lemon Squeezy since 2024. As of
mid-2026 there is no shutdown date and new signups are open, while the same team
builds Stripe Managed Payments and has confirmed migration paths. Committing to
it means accepting a probable migration.

## 3. FastSpring

All `[review]`. This is the one that might genuinely refuse.

**a) Takes an individual?** `[conflict]`. FastSpring's onboarding materials list
"a certificate of incorporation or certificate of sole proprietorship (if
applicable in your country)" alongside a completed W-8 or W-9 and a KYC identity
check, with a FastSpring representative walking the seller through activation.
Read one way, the "if applicable" carve-out means a US sole proprietor with no
filing simply skips it. Read the other way, a document is expected and there
isn't one. Nothing I found resolves it, and no first-hand account of a US
individual with no DBA registration being approved or refused turned up. So:
**can a US sole proprietor with no registered anything open a FastSpring
account? `[NOT ESTABLISHED]`.** It is the only provider here where I would tell
the owner to ask before investing effort.

**b) Merchant of record?** Yes, and in the strongest form in this document.
"As the Merchant of Record (MoR), FastSpring purchases products and services
from you (the publisher, creator, or provider) and resells them to the end
customer." It handles disputes, refunds and chargebacks and assumes
responsibility for fraudulent transactions. Its documentation also states that
the terms attached to a payment transaction must be FastSpring's terms rather
than yours, while recommending you keep a separate EULA for product use.

**c) Residual liability.** Indemnity wording `[NOT ESTABLISHED]`.

**d) Economics.** No published self-serve pricing as of 2026; quote-based after
a sales conversation about volume and product mix. Historically the published
options were 8.9% flat or 5.9% + $0.95. Reported benchmarks now sit in the high
5% to high 8% band plus a fixed fee, and low-volume accounts land at the top of
it. Payouts twice monthly on the 15th and month end, with a 45-day hold on a new
account's first payout. Payout minimum `[NOT ESTABLISHED]`.

**e) Restrictions and track record.** Restricted categories and documented
account-closure cases: `[NOT ESTABLISHED]`. Nothing turned up either way, which
is not the same as a clean record.

## 4. Polar

All `[review]`.

Onboarding asks whether this is a personal account or a business. Personal
accounts pick a country of residence; businesses pick a country of tax
residency. There is no registration number in the personal path. Payouts run
through Stripe Connect Express, so the seller must be resident in a
Stripe-Connect-supported country and the connected bank account must be in that
same country and currency. Account review before live payouts is reported to
take around two weeks.

"As the Merchant of Record, Polar collects the money from your customers, then
transfers your balance, minus Polar's fees, to your payout account." Pricing:
organisations created before 27 May 2026 stay on a grandfathered 4% + $0.40 with
0.5% added for subscriptions; organisations created on or after that date start
at 5% + 50¢. A minimum payout threshold exists; the amount is
`[NOT ESTABLISHED]`. Polar states it monitors chargeback rates against the card
networks' roughly 0.7% thresholds and may suspend an account that approaches
them. No pattern of closures or held funds surfaced, which for a young platform
means little either way.

## 5. Creem

All `[review]`.

The Merchant Terms of Service define "Merchant" as "any natural person or a
legal entity that offers a Product where the resale transaction for such Product
is executed by Creem as the merchant of record." That is the cleanest sentence
in this whole document on the entity question: a natural person is a merchant by
definition. Creem's team confirms it supports individuals, but not freelancing
services; selling a digital product as an individual is fine.

Account review before live payments, typically 24 to 48 hours and up to 72 at
peak. Everyone completes the same KYC steps. Approvals go fastest when the
product is already live, the legal pages are visible, and the support email
matches the one on the site. Pricing 3.9% + $0.40, the lowest headline rate
here, with no monthly or setup fee and no minimum volume. Payouts on the 1st and
15th to a bank account or crypto wallet, with a payout fee of $7 or €7 or 1%,
whichever is higher, on bank transfers outside certain regions, and an extra 2%
on split payments. Payout minimum `[NOT ESTABLISHED]`. Trustpilot around 2.7,
on a small review count.

## 6. Dodo Payments

All `[review]`.

Dodo markets the individual case as its reason to exist: because the merchant of
record is the legal seller, "you don't need any of that and can sign up as an
individual and start selling immediately." Onboarding wants a valid ID and an
address proof, with identity and business verification typically taking 24 to 72
working hours. It acts as official reseller and handles tax compliance and
chargebacks.

Pricing 4% + $0.40, then a stack of surcharges: +1.5% on international cards,
+0.5% on subscriptions, +3% on PayPal, $1 per refund, $30 per dispute, and a $5
fee on payouts under $1,000. Payouts twice monthly with a $50 minimum. Supports
SaaS, AI and digital products; service businesses such as digital marketing or
web design are not supported; IPTV and adult content are prohibited.

The track record is the problem. Trustpilot sits near 3 out of 5 across roughly
122 reviews, and the recurring negative pattern is specific: accounts approved
and trading normally, then suspended at the point of first payout once the
balance nears $1,000, with funds held 120 days and, in several accounts, not
released after the hold expired. Dodo's public response attributes the hold to
card network rules on dispute exposure. Refund functionality disabled during
suspension is also reported.

## 7. Others that qualify

**2Checkout / Verifone.** "2Checkout is the Merchant of Record for orders
performed and payments processed using its platform." Individual sellers and
sole proprietors without an EIN provide their SSN or ITIN and their own name,
and the identity verification checklist is explicitly different for individuals
and for companies, wanting a government photo ID and an address proof no older
than two months. Accounts sit in RESTRICTED mode until the W-8 or W-9 is signed
and underwriting approves. Fees, thresholds and closure record all
`[NOT ESTABLISHED]`.

**Freemius.** "In most countries, you can start selling as a self-employed
individual without forming a company first." Full merchant of record for VAT,
GST and US sales tax, aimed at SaaS, desktop apps and WordPress products. Fees
and payout terms `[NOT ESTABLISHED]`.

**Gumroad**, already covered in document 15, remains the low-friction fallback:
full merchant of record since January 2025, individuals accepted, and identity
verification affects the payout threshold rather than eligibility. Its 10% rate
and its 2026 complaint record are the reasons it is not the recommendation.

**Stripe Managed Payments** is Stripe's own merchant-of-record product for
digital goods, covering tax in 80+ countries. Whether it admits individuals and
what it charges: `[NOT ESTABLISHED]`. It is where Lemon Squeezy is heading, so
it is worth watching, not choosing.

**Payhip** is described as a partial merchant of record for EU VAT in some
cases, which is not the same thing and does not qualify.

---

## 8. The finding that cuts against the plan

The entity question is answered. A different one opens in its place.

`CONSTRAINTS.md` constraint 1 is "no direct customer relationship. Nobody pays
the owner for a product or a service." Its own carve-out permits "a platform
that is the merchant of record and sells to the end user in its own name," so on
a literal reading Paddle satisfies it. In practice these providers are not
marketplaces and they say so. Paddle's help centre: "You remain in control of
how you present your product and the ongoing relationship with the customer. You
interact with them as normal in terms of product support and marketing,
including executing separate terms and conditions that relate to the product
use." FastSpring recommends keeping your own EULA on top of its transaction
terms. The tax obligation moves. The support inbox does not, and neither does
the marketing that has to bring buyers in the first place, which runs into
constraint 3.

Then the second edge. Paddle's Acceptable Use Policy refuses products where no
bona fide software or service is sold, listing donations, crowdfunding,
community access, **advertising and sponsorship** by name. Advertising and
affiliate revenue are exactly the models `CONSTRAINTS.md` lists as permitted.
So the merchant-of-record route and the ad-supported route do not overlap. A
merchant of record is for selling a digital product to people who pay for it.
If the plan stays ad-supported, none of this matters; if the plan is a paid
digital product, the entity objection is gone.

Worth saying plainly, since the brief asked for a definite answer either way:
I expected to be writing that all of them require a registered business. They
do not. The constraint that actually binds is the product type, not the legal
form of the seller.

---

## What the owner supplies to open a Paddle account

1. Choice of Individual as the business type at signup.
2. Tax information as a person. For a US sole proprietor that is a W-9 with an
   SSN; an EIN is not required.
3. A government-issued photo ID and a proof of address, if Sumsub asks.
4. A bank account for payout, or PayPal or Payoneer. Not stated to require a
   business account.
5. A live site on HTTPS, on a domain related to the product, with the legal name
   in the terms and conditions, a privacy policy, and a refund policy that
   states the process with no exceptions written into the guarantee.
6. A digital software or SaaS product that is not on the prohibited list.

Nothing on that list is a company registration number, a certificate, or a
filing fee. Expect 2 to 4 business days for manual review, and expect the first
payout to require a $100 balance and to arrive by the 15th of the month after it
clears.

If a lower payout minimum matters more than platform size, Creem at 3.9% + $0.40
with a natural-person definition in its terms is the alternative, and Polar's
personal-account path is the alternative to that. Both are young. Dodo is the
cheapest headline rate after Creem and has the worst documented payout behaviour
of the three, so it is not the one to start with.

---

## What I could not establish

1. Whether FastSpring will onboard a US sole proprietor who holds no
   certificate of sole proprietorship. The single most important gap left.
2. Whether Paddle's supplier indemnity is capped.
3. Paddle's Individual business type availability country by country.
4. Lemon Squeezy's supplier-side indemnity wording.
5. Polar's payout threshold amount and its prohibited-product list.
6. Creem's payout threshold.
7. FastSpring's payout minimum, restricted categories and closure record.
8. 2Checkout's fees, thresholds, schedule and closure record.
9. Freemius's fees and payout terms.
10. Stripe Managed Payments eligibility for individuals, and its pricing.
11. The allegations and outcome of the FTC complaint document naming Paddle.

Every one of these is answerable by opening a page the proxy refused. On a
network that permits `paddle.com`, `fastspring.com`, `docs.lemonsqueezy.com`,
`polar.sh`, `docs.creem.io` and `verifone.cloud`, this document could be
upgraded from search-grade to source-grade in an hour.
