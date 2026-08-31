# Two claims, checked

Follow-up to `06-FREE-CREDITS.md`, which closed with three things to confirm.
This resolves two of them. Researched 2026-08-31.

## A word about labels, before anything else

I read no vendor page. Every attempt returned a hard policy denial from this
machine's egress proxy: `aws.amazon.com` 403, `docs.aws.amazon.com` 403,
`repost.aws` 403, `linear.app` 403, `startupschool.org` 403, `web.archive.org`
refused, `r.jina.ai` refused. I confirmed with a direct `curl` that it is the
network policy and not a quirk of the fetch tool, and the proxy documentation
says not to route around it. So I did not.

**There is no `[verified]` label anywhere in this file, and that is deliberate.**
Search-engine summaries are all I had. Where several independent searches
returned what looks like the same contract sentence, I say so and quote it, but
a quoted sentence relayed by a search index is still `[review]`. Calling it
verified would be the kind of small lie that gets expensive later.

| Label | Means |
|---|---|
| `[review]` | Search summary only. Confirm on the page named at the bottom |
| `[review, corroborated]` | Three or more independent searches returned substantially the same wording. Still not primary |
| `[conflict]` | Sources disagree. Both are recorded |
| `[NOT ESTABLISHED]` | Could not determine |

---

## VERDICT

> **1. Yes, AWS Activate credits offset Anthropic Claude on Bedrock.** Bedrock
> third-party model spend is a named, deliberate carve-out from the AWS
> Marketplace exclusion. `[review, corroborated]` **Decision: build the proving
> phase on Bedrock, not on the first-party Anthropic API.**
>
> **2. Do not apply to AWS Activate Founders first.** Founders is $1,000 and
> "new to Activate credits" is a one-shot gate. The YC Startup School channel is
> reported at $2,500 to $5,000 of the same credit. `[conflict]` on the amount,
> agreement that it is larger. **Decision: enrol in Startup School and claim the
> AWS deal through it before touching the direct Founders form.**
>
> **3. No, Startup School enrolment is not partner affiliation.** Not at Notion,
> Linear, HubSpot or Vercel. Their gate means YC-funded, and PostHog's version of
> the same gate asks for a Bookface screenshot that Startup School accounts
> cannot produce. `[review]` **Decision: stop treating those four as reachable.
> The affiliation that does open doors is AWS Activate itself.**

---

# QUESTION 1 — AWS Activate credits and Claude on Bedrock

## (a) Do AWS promotional credits apply to Bedrock at all?

Yes. Bedrock is not on the exclusion list.

Four separate searches returned what reads as the same sentence from the AWS
Promotional Credit Terms & Conditions, last updated 16 December 2024
`[review, corroborated]`:

> Promotional Credit will not be applied to any fees or charges for Amazon
> Mechanical Turk, AWS Managed Services, Ineligible AWS Support, AWS Marketplace,
> AWS Professional Services, AWS Training, AWS Certification, Amazon Route 53
> domain name registration or transfer, any Services for mining for
> cryptocurrency, any other Services as may be designated by your AWS contracting
> entity, or any upfront fee for any Services such as Savings Plans and Reserved
> Instances (collectively, "Ineligible Services").

Bedrock does not appear. But read that list again and notice **AWS Marketplace**,
because that is where the whole question actually turns.

## (b) The crux: third-party models versus AWS-first-party models

This is the part the earlier document flagged as one source and untrusted. It
holds up, and the mechanism is more specific than "credits cover Bedrock".

Claude on Bedrock is **not billed as a plain Bedrock line item.** It is billed
through AWS Marketplace, and appears on the invoice as sold by Anthropic, PBC
`[review]`. Under the general terms quoted above, that would make it
credit-ineligible. Amazon Titan and Nova, being AWS's own models, are ordinary
Bedrock charges and were never affected.

The AWS Activate Terms add a carve-back. Searches returned this wording
`[review, corroborated]`:

> Activate Credits are subject to the AWS Promotional Credit Terms & Conditions
> and may be applied to offset fees and charges for AWS Marketplace incurred for
> the use of third-party foundation models available on Amazon Bedrock. For
> purposes of this Section 1.2, AWS Marketplace is an Eligible Service solely
> when incurring Bedrock 3P Model Spend.

Named providers: AI21 Labs, Anthropic, Cohere, Meta, Mistral AI, Stability AI
`[review, corroborated]`. Reported live since roughly April 2024 `[review]`.

**Three consequences, and the second one is the trap.**

First, the exception is scoped to *Activate* credits by that Section 1.2. A
generic AWS promotional credit from some other source may not carry it. One
search result explicitly warned that some promotional packages exclude the
generative-AI category entirely and that you must open each credit in the
console and read its Applicable Services field `[review]`.

Second, and this is the one I would not have predicted: the carve-out has
demonstrably failed on at least one model. An AWS re:Post thread titled "Claude
Opus 4.5 is being billed under AWS Marketplace" reports credits correctly
covering Sonnet 4.5, Haiku 4.5 and Opus 4.1 in the same account while Opus 4.5
was charged in cash `[review]`. Whether that was a misconfiguration since fixed
or a standing gap for newer models is `[NOT ESTABLISHED]`. Either way, do not
assume a model released last month inherits the carve-out. Run one small call,
wait for it to land on the bill, and check.

Third, **Claude Platform on AWS is a different product and probably is not
covered.** Anthropic's own current documentation describes Claude on Bedrock and
Vertex as partner-operated, and Claude Platform on AWS as Anthropic-operated with
same-day API parity, generally available since 11 May `[review]`. It bills
through AWS Marketplace in Claude Consumption Units, and one source states
flatly that the CCU price is fixed and never discounted `[review]`. The Activate
carve-out is worded "third-party foundation models available on Amazon Bedrock."
Claude Platform on AWS is not Amazon Bedrock. **Use Bedrock. The newer, nicer,
same-price-per-token option is the one that likely burns cash instead of credit.**

## (c) What Activate Founders gives an unincorporated solo founder

| Item | Finding |
|---|---|
| Credit amount | $1,000 `[review, corroborated]`. One source describes the self-serve tier as a $1,000–$5,000 range `[review]` |
| Support credit | $350 Developer Support, 1 year `[review]`, carried over from `06` and not re-checked |
| Validity | **`[conflict]`.** `06` recorded 2 years. This round returned "Founders tier credits expire 1 year after issuance, no extensions" `[review]` and separately "1–2 years depending on package" `[review]`. Assume 1 year and be pleased if wrong |
| Age | Founded within last 10 years `[review, corroborated]` |
| Funding | Self-funded or pre-Series B; most recent round within 12 months if any. No investor or accelerator referral needed `[review, corroborated]` |
| Prior credits | Must be new to Activate credits `[review, corroborated]`. **One-shot** |
| Website | Fully functioning company website, verified `[review, corroborated]` |
| Paid AWS account | One source says a paid-tier plan with card on file `[review]`. Others silent. `06`'s conflict stands |

**On incorporation: refuted as a stated hard requirement, but not cleanly.**
Nothing in this round's results lists incorporation as a criterion. The recurring
word is "privately held," which is a statement about ownership rather than legal
form. No source addressed sole proprietorships either way. So: `[NOT
ESTABLISHED]` that it is required, `[NOT ESTABLISHED]` that it is not. The claim
in `06` that one source listed "an incorporated company" as a Founders
requirement did not reappear here.

**On `@gmail.com`: confirmed as a rejection driver, with a sharper detail.**
Multiple sources describe personal-domain addresses as automatically
deprioritised or rejected `[review, corroborated]`. The detail worth having is
the one nobody puts on the application form: **your email domain must match your
website domain.** If the site is `example.com`, the address must be
`you@example.com` `[review]`. A NVIDIA Developer Forums thread exists about
repeated false-positive "email/domain mismatch" rejections on Activate, which
suggests the check is automated and literal `[review]`.

Rejections are described as recoverable by fixing the issue and resubmitting
`[review]`, which softens `06`'s warning that a single application burns the
name. I am revising that warning down. Get it right first time anyway.

## (d) The practical catches

**Regions and the 10% surcharge.** Claude models sit behind inference profiles
on Bedrock: a global endpoint plus geographic profiles (`us.`, `eu.`, `jp.`,
`au.`). Coverage varies by model, and the current generation does not all ship
the same profiles `[review]`. The cost consequence is documented by Anthropic:
from Sonnet 4.5, Haiku 4.5 and Opus 4.5 onward, **regional and multi-region
endpoints carry a 10% premium over the global endpoint** `[review, corroborated]`.
For an insurance-document tool with no data-residency commitment yet, use the
global endpoint and keep the 10%.

**Credit ordering.** Credits are applied *after* Reserved Instance and Savings
Plan discounts and after volume or contractual discounts `[review, corroborated]`.
The order is: compute usage, apply commitment discounts, apply other discounts,
then burn credit against the remainder. With multiple credits, AWS spends
soonest-to-expire first, then the credit with the fewest eligible services, then
the oldest `[review]`. That last rule matters for stacking: a narrow
Bedrock-eligible credit will be consumed before a broad one, which is the
behaviour you want anyway.

Whether Bedrock Provisioned Throughput is credit-eligible is `[NOT ESTABLISHED]`.
Irrelevant at this scale. Provisioned Throughput is a monthly commitment in the
thousands and has no business being anywhere near a sub-$1,000 budget.

**Expiry against actual burn.** The plan puts inference at roughly $900/month at
100 customers and far less during the day 1–30 accuracy gate. If Founders credit
really is one year rather than two, $1,000 is comfortably spendable. If the
Startup School route lands $2,500–$5,000 on a two-year clock, that covers the
proving phase and then some.

## (e) Is Claude on Bedrock the same price as first-party?

Base per-token rates: yes, at parity `[review, corroborated]`. Several sources
state it flatly, and one gives worked numbers matching Anthropic's published
first-party rates.

**But I want to flag a disagreement with my own best source.** Anthropic's own
current API reference material describes Bedrock and Vertex as partner-operated
with *separate pricing*, and directs you to the Bedrock pricing page rather than
quoting a number. `[conflict]`, and it is a conflict between third-party
summaries claiming parity and the vendor's own hedge. The reconciliation I find
most plausible: base rates match, the pricing is nonetheless administered
separately and can diverge without notice. Do not model Bedrock spend off
Anthropic's list price for longer than a month at a time.

Two live pricing notes, both worth acting on this week:

- One source claims Claude Sonnet 5 is listed at $2/$10 per million tokens
  **through 31 August 2026**, reverting to $3/$15 after `[review]`. Today is
  31 August 2026. That is a 50% input-cost increase landing tomorrow if true, and
  I could not confirm it. Treat as a reason to re-run the cost model, not as fact.
- Reports that Bedrock costs "20–35% more" than the direct API `[review]` are
  about total enterprise bills, not token rates. They decompose into the 10%
  regional-endpoint premium plus cross-region routing. Avoidable.

## One thing worth $0 and no application

New AWS accounts get $100 in credits at signup and a further $100 across five
onboarding tasks at $20 each, one of which is literally "test a prompt in Amazon
Bedrock" `[review, corroborated]`. No application, no company, no domain email.
A payment method is required for identity verification. The free account plan
ends at six months or when the credits run out.

$200 is not much. It is also available before the domain, the website, the
mailbox and the two-week approval wait that everything else on this page needs.

---

# QUESTION 2 — Does Startup School count as partner affiliation?

**No.** Clearly, at all four companies.

## What each one actually gates on

**Notion.** Fewer than 50 employees, under $10M raised, work email, new or
non-paying customer `[review]`. Partner-affiliated gets 6 months free on Business
including AI; unaffiliated gets 3 months after a roughly two-day review
`[review]`. YC-funded companies have their own page at `notion.com/startups/yc`
offering 12 months plus consultant access `[review]`. A dedicated URL for
YC-funded companies is itself evidence that YC affiliation means the batch.

**Linear.** Fewer than 50 employees, new non-paying customer, applicant must be
a workspace admin. **Only companies affiliated with an official Linear partner
can participate** `[review, corroborated]`. 900+ partner organisations as of
mid-2026, described as accelerators, incubators and venture firms, with a16z,
Sequoia, Y Combinator, Techstars, Antler, Seedcamp and Entrepreneur First named
as examples `[review]`. Every one of those is an investor or a cohort you get
selected into.

**HubSpot.** Three tiers. 30% direct-apply for anyone on the Startup Stack; 50%
to 90% requires membership of an approved VC, accelerator or incubator, or
venture funding verifiable through Crunchbase or PitchBook `[review, corroborated]`.
Eligible funding stages are pre-seed through Series A, so Series B and later are
out. One genuinely new route: **a HubSpot Solutions Partner at Gold tier or above
can sponsor a bootstrapped company into the 90% tier** `[review]`. That is a
relationship with an agency, not an investor. It does not require equity. Whether
a solo pre-revenue founder can get one to sponsor them is `[NOT ESTABLISHED]`,
and `06`'s judgement stands regardless: 90% off a HubSpot Professional seat is a
discount on a product this business should not be buying.

**Vercel.** Affiliated with an approved Startups Partner, Series A or earlier,
applying within 12 months of the most recent funding round, company website with
matching email `[review, corroborated]`. The funding-round clause alone is fatal.
One source puts the standard award at up to $2,400 of Pro credits over a year
rather than the $30,000 figure in `06`, which appears to be a Flex Commitment
ceiling rather than a grant `[conflict]`.

## Does Startup School appear on any of those partner lists?

Not in anything I could reach. Y Combinator appears. Startup School does not.
`[review]`

The strongest evidence is not from those four companies at all. It is from
PostHog, which runs the same kind of gate and publishes its mechanism: YC teams
qualify from any batch at any funding level, but **must apply through a private
YC page and provide a screenshot from Bookface** to prove it `[review]`. Startup
School participants get limited read-only access to a subset of alumni
discussions, not a Bookface account `[review]`. They cannot produce the artefact
the check asks for.

`06` guessed this would be the answer and said so. That guess was right.

## The Startup School deals page, which is the actual prize

Enrolment: free, no application, no equity, sign up at `startupschool.org` and
create a profile. Open to anyone already building something, no formed idea
required. Runs continuously with scheduled 6–8 week cohorts kicking off in
January, April, July and October 2026 `[review, corroborated]`. Some deals are
reported to require completing one course before credits auto-issue `[review]`.

What is on the page, per third-party reporting `[review]`:

| Deal | Reported terms |
|---|---|
| **AWS** | **`[conflict]`. $5,000, expiring 2 years from application, per one source citing YC's own registration-and-deals blog post. $2,500 on completing one course, auto-issued, per two others.** Non-China participants. Apply with the email registered to Startup School; AWS verifies against Startup School. Once per founder, including repeat participants |
| Google Cloud | $2,000 GCP and Firebase, 12 months, via the Start Package `[review]` |
| Hiring | 20% off contractor hires, employee hires and Global Payroll, first year `[review]` |
| Headline | "$1M+ in startup deals" `[review]`. Marketing addition across every partner. Ignore it |

The "$30,000+" figure carried in `06` did not reappear in this round and I would
now treat it as unsourced.

**The AWS entry changes the running order in `06`.** Startup School is
functioning here as an AWS Activate channel, which is a form of partner
affiliation that costs nothing and takes no equity. Both routes gate on being new
to Activate credits, so **going in through the Founders form first plausibly
forfeits the larger number.** Sources say the two stack in principle because they
come through separate partner channels `[review]`, and I do not believe that
sits comfortably with "new to Activate credits" on both. Assume you get one.
Take the bigger one.

I want to name the correction properly. `06` ranked AWS Activate Founders third
and framed Startup School as an hour spent closing a question. Both were the
wrong way round. The hour on Startup School comes first, and Founders is the
fallback if the Startup School AWS deal turns out to be dead or region-blocked.

## No-equity, no-cost affiliations that do qualify somewhere

This is the useful half of a negative answer.

**AWS Activate is itself a Notion partner.** Notion's partner network is
described as "more than a thousand VCs/accelerators, communities, and tech
platforms" naming AWS Activate, Stripe Atlas, HubSpot, Slack, Shopify and JP
Morgan `[review]`. Notion's startup programme launched in 2021 with AWS and
Stripe as its first two partners, distributed through **AWS Activate Console
Exclusive Offers** and Stripe Atlas `[review]`.

So the chain is real and every link is free: enrol in Startup School, claim AWS
Activate credits through it, then open the Exclusive Offers section of the AWS
Activate console and take the Notion offer from there. The $1,000 Notion credit
figure attached to that partnership dates from 2021 press coverage and is very
likely stale `[review]`. The route is what matters, not the number.

**Stripe Atlas** is on the same list and is reported to carry $5,000 of automatic
AWS credits `[review]`. It costs $500 and starts a roughly $400/year clock, so
`06`'s recommendation to defer incorporation is unchanged.

Nothing free was found on Linear's or Vercel's lists. Linear's examples are all
investors and cohorts. Vercel needs a funding round regardless of who the partner
is. Those two are closed.

---

# What would settle the remaining unknowns

Each line names the page and the exact field to read. All of these were blocked
from this machine and will open from a normal browser.

**1. The Bedrock carve-out, in the contract.**
`https://aws.amazon.com/activate/terms/`. Find **Section 1.2** and read it for
the phrase `Bedrock 3P Model Spend`. Confirm the sentence making AWS Marketplace
an Eligible Service is present and unqualified. Then open
`https://aws.amazon.com/awscredits/` and confirm the Ineligible Services
paragraph still reads as quoted above.

**2. Whether your specific credit covers it, which is the only test that counts.**
AWS Billing and Cost Management console, **Credits** page. Open the credit and
read the **Applicable Services** field. If Bedrock or AWS Marketplace is absent,
the carve-out does not apply to that grant no matter what the terms say.

**3. Founders credit validity, 1 year or 2.**
Same Credits page, **Expiration date** column on the issued credit. Do not trust
the application page copy. `[conflict]` resolves only against the issued grant.

**4. Whether Opus-class models are still landing outside the carve-out.**
Make one small Bedrock call to the newest Claude model you intend to use. Wait
for it to appear in **Bill > Charges by service**, then check whether it sits
under Bedrock or under AWS Marketplace and whether credit was applied. One call
costs cents and answers the question the re:Post thread raises.

**5. The Startup School AWS amount.**
`https://www.startupschool.org/`, sign in, **Deals**. Read the AWS card for the
dollar figure, the expiry, and whether a completed course is a precondition.
Resolve $5,000 against $2,500 before filling in any AWS form.

**6. Whether Founders and Startup School genuinely stack.**
Same Deals page, AWS card, read the eligibility line for wording about prior
Activate credits. If it says new to Activate credits, they do not stack, and the
order of operations in Verdict line 2 is load-bearing.

**7. Sonnet 5 pricing after 31 August 2026.**
`https://aws.amazon.com/bedrock/pricing/`, Anthropic section, and
`https://platform.claude.com/docs/en/about-claude/pricing` for comparison. Read
the input and output per-million figures for Sonnet 5. If they have moved to
$3/$15, the cost model in the plan needs re-running today.

**8. Linear's partner list, to close the question rather than assume it.**
`https://linear.app/startups/partners`. Search the page for `Startup School`.
Expect nothing. Takes ten seconds and ends the debate.

---

## What I did not resolve

- The `06` item on Cloudflare's bootstrapped tier being $5,000 or $10,000. Out of
  scope for this pass and still open.
- Whether AWS accepts a sole proprietorship. Genuinely unaddressed by every
  source I saw, in either direction.
- Whether the Opus 4.5 Marketplace billing gap was a bug or a policy.
- Vercel's AI Accelerator eligibility, which `06` flagged as potentially the
  highest-value item anywhere and which remains `[NOT ESTABLISHED]`.
