# Free credits and startup programmes, for a solo founder who has not incorporated

Researched 2026-08-31 against the Countercite plan in
`../buildouts/05-countercite/PLAN.md`. Written for one person, pre-revenue,
no investor, budget under $1,000, not yet a company.

This is a companion to `04-FREE-AND-OPEN-STACK.md`, which has a short credits
table at the end. That table was a summary. This is the working version, with
the eligibility rules that actually decide whether an application is approved or
silently binned.

---

## How to read the labels

The egress proxy on this machine blocks vendor domains. `www.anthropic.com`
refused on the first attempt and I did not get a single programme page to load
directly. **So almost everything here is [review].** It came from search-engine
summaries of third-party guides, not from the vendor's own page.

| Label | Means |
|---|---|
| **[review]** | A search summary said this. Treat it as a lead. Confirm on the vendor's page before you count on it |
| **[NOT ESTABLISHED]** | I could not find it and will not guess |
| **[conflict]** | Two sources disagreed and I have left both in rather than pick |

Do not put any number in this document into the financial model. Every one of
them is a claim about somebody else's programme, made by a third party, at a
moment in time. Programme terms change quietly and often.

---

## The finding, before the list

**One action unlocks or de-risks nine of the programmes below, costs about $12,
and takes an afternoon: get an email address on your own domain, and put a real
one-page site behind that domain.**

Across AWS, Google Cloud, Cloudflare, PostHog, Supabase, Notion, Vercel, Sentry
and Twilio, the same two rejection reasons came back in every summary I read: a
personal Gmail or Outlook address instead of a company domain, and a thin or
placeholder website [review]. PostHog goes further and **rejects free-email
domains automatically at submission**, before a human sees the form [review].
AWS is reported to auto-reject `@gmail.com`, `@yahoo.com` and `@hotmail.com`
[review].

The domain is already in the Countercite plan at roughly $12. The mailbox does
not have to cost anything on top:

| Option | Cost | Catch |
|---|---|---|
| **Zoho Mail Forever Free** | $0, up to 5 users, one domain, 5 GB each [review] | Webmail only. No IMAP or POP, so Outlook and Apple Mail will not connect [review] |
| **Cloudflare Email Routing + Gmail "send mail as"** | $0 [review] | Cloudflare receives and forwards but does not send. Sending goes through Gmail SMTP [review] |
| Google Workspace | paid | Sometimes bundled free in a startup programme, see Google below |

**Incorporation is the second unlock, and it is a much smaller one than it
looks.** It is genuinely required by NVIDIA Inception, and one AWS summary lists
"an incorporated company" as a Founders-tier requirement [review, and see the
AWS entry, where sources disagree]. Mercury's perk marketplace requires a US
entity [review]. Everything else on the apply-this-week list appears reachable
without it.

So the order is: **domain and mailbox first, real site second, incorporate
third, and only when there is a reason beyond credits.** The Countercite plan
already needs a lawyer for terms and privacy before the first paying customer at
$1,500 to $3,000. Incorporation belongs in that same conversation, not in a
credits sprint.

---

## Apply this week, ranked by value over effort

For someone who is not incorporated, has no investor, and has one afternoon.

| # | Programme | Headline value | Effort | Blocked without incorporation? |
|---|---|---|---|---|
| **0** | **Domain mailbox and a real one-pager** | Prerequisite for most of the rest | 2 hours | No |
| **1** | **PostHog for Startups** | **$50,000 credits, 12 months**, plus ~$12,000 partner perks [review] | 15 min, auto-approved on submit then reviewed [review] | No |
| **2** | **Cloudflare for Startups** | **$5,000** bootstrapped tier [review] [conflict, one source says $10,000] | 20 min | No |
| **3** | **AWS Activate Founders** | **$1,000** credits (2 years) + **$350** Developer Support (1 year) [review] | 20 min | Disputed |
| **4** | **Microsoft for Startups Founders Hub** | **$1,000** on signup, up to **$5,000** after business verification [review] | 20 min | No |
| **5** | **Google for Startups Cloud, Start tier** | **$2,000** (12 months) + $200 Skills credits + Workspace Business Plus 12 months [review] | 20 min | No |
| **6** | **Supabase Startup Program** | 6 months Team plan free, ~$3,600 value [review] | 15 min | No |
| **7** | **Claude for Startups** | Join for the rate limits and community. Credits are gated, see below | 2 min, Anthropic's own estimate [review] | No |
| **8** | **YC Startup School** | Free enrolment, no equity, deals page reported at $30,000+ [review] | 30 min | No |
| **9** | **NVIDIA Inception** | Free membership, DGX Cloud credits, preferred GPU pricing | 30 min | **Yes** |
| 10 | Sentry, Twilio, DigitalOcean Hatch | Variable, see entries | 15 min each | No |

**Rank 1 deserves a caveat.** $50,000 of PostHog credits is the largest number
on this page and it is the least useful to this particular business. Countercite's
cost problem is inference, not analytics, and `04-FREE-AND-OPEN-STACK.md` prices
the whole analytics layer at $0 on PostHog's free tier anyway. It is ranked first
because value divided by effort is what was asked for and fifteen minutes for a
credible $50,000 line wins that arithmetic. **The credit that would actually
change the P&L is AWS at rank 3, for the reason in that entry.**

---

# The programmes, one at a time

---

## 1. Anthropic, Claude for Startups

**What you get.** Membership gives a Claude Console account, priority rate
limits, founder events and community access [review]. Credits are a separate
thing from membership.

**Eligibility, and this is the important part.** Sources agree on the split and
it is easy to misread:

- **To join:** open to any early-stage founder building with Claude, with or
  without VC backing [review].
- **To qualify for credits:** the company must have **received equity funding
  from an institutional investor**, been **founded within the last four years**,
  and not previously received Anthropic startup credits [review].

Excluded categories: consulting firms, crypto, cloud providers, resellers,
public companies [review].

**[conflict].** The summary in `04-FREE-AND-OPEN-STACK.md` records that VC
funding is *not* required per the programme FAQ, and one source in this round
said bootstrapped teams "can often still access a smaller tier" [review]. Two
other sources stated the institutional-funding requirement for credits flatly.
I cannot resolve it without loading the page. **Assume you will not get credits,
apply anyway, and be pleased if wrong.**

Anthropic does not publish dollar tiers on its own programme page [review].
Third-party figures of $1K to $25K+ circulate and none of them is sourced to
Anthropic.

**How to apply.**
1. Create a Claude Console account.
2. Have ready: company email on your domain, website URL, one-paragraph
   description of what you are building, investor details if any.
3. Apply from `https://claude.com/programs/startups` [review].
4. Rolling review, reported at about two weeks [review].

**Approval time.** ~2 weeks [review].

**The catch.** Credits reported valid about 12 months [review]. The real catch
is the funding gate on the credits, which is exactly the gate a solo
unincorporated founder fails. Membership is still worth having for the rate
limits, because the plan's day 1 to 30 gate involves running 20 real policies
through the engine and rate limits are what will bite.

**Two adjacent Anthropic routes, honestly assessed:**

- **Claude for Open Source.** Six months of free Claude Max 20x for maintainers
  of a public repo with **5,000+ GitHub stars or 1M+ monthly npm downloads**,
  active in the last 3 months, capped at 10,000 recipients [review]. Countercite
  does not qualify and will not. There is an "Ecosystem Impact Track" for
  less-visible critical packages [review]. Not a path here.
- **Anthology Fund.** A $100M venture fund with Menlo Ventures, cheques from
  $100,000, pre-seed to Series A, selected companies get Claude credits [review].
  **This is venture capital, not a credits programme.** It takes equity. Out of
  scope for a founder who wants credits, in scope only if the plan changes.

---

## 2. Cloudflare for Startups

**What you get.** Four tiers reported at $5,000, $25,000, $100,000 and $250,000
of Cloudflare credits [review]. The bootstrapped entry tier is the one that
applies here.

**[conflict] on the bootstrapped number.** One source says bootstrapped founders
qualify via a **`BOOTSTRAPPED` promo code worth $5,000**, with no extra
qualifying if you have raised under $50K [review]. Another source headline says
**$10,000 for self-funded startups** [review]. Confirm before counting it.

**Eligibility.**
- Building a software or SaaS product. **Agencies and service companies are
  explicitly not eligible** [review].
- Founded within the last 5 years [review].
- Valid website and email address [review].
- Incorporation: not listed as a requirement in anything I found.

**How to apply.**
1. Get the domain mailbox and the one-pager live first. The reported top
   rejection reason is a personal email address, the second is a thin site
   [review].
2. Go to `https://www.cloudflare.com/startups/`.
3. Submit company details. Enter promo code **`BOOTSTRAPPED`** [review].
4. Describe the product as software sold to licensed professionals. Do not
   describe it as a service, because service companies are excluded.

**Approval time.** [NOT ESTABLISHED].

**The catch.** Credits are for the Developer Platform [review], which is where
this stack already lives (Pages, R2, Workers). That makes it one of the few
credits on this page that maps onto real planned spend rather than notional
spend. The stack document prices Cloudflare at $0 today on free tiers, so the
credit's real value only appears at scale.

---

## 3. Microsoft for Startups Founders Hub

**What you get.** Up to **$5,000 in Azure credits**, structured as **$1,000 on
initial signup and a further $4,000 after business verification** [review]. Plus
access to Microsoft 365, GitHub and developer tooling benefits, though I could
not verify which of those apply at the entry tier.

**Eligibility.** The most open programme on this page.
- **No VC backing, accelerator affiliation or revenue required.** Explicitly
  open to bootstrapped, solo and pre-revenue founders [review].
- Direct application. **No investor or accelerator nomination** [review].
- Headquartered in a country where Azure is available [review].
- Not received more than $350,000 lifetime in free Azure credits [review].
- Not raised Series C or later [review].
- Needs "a real company and a product or roadmap that fits Azure, GitHub or
  Microsoft's AI services" [review]. That phrasing is soft, and it is the one
  place incorporation might be read in. Nothing I found stated it as a hard
  requirement.

**How to apply.**
1. Read the overview at
   `https://learn.microsoft.com/en-us/startups/microsoft-for-startups/overview`.
2. Apply through the Founders Hub portal linked from there. The direct portal
   URL is [NOT ESTABLISHED] and I will not guess it.
3. Verify your email. The first $1,000 is reported to arrive at this step.
4. Complete business verification for the remaining $4,000.

**Approval time.** "Within days" [review].

**The catch.** Azure is not in the Countercite stack. The realistic uses are
the app VPS and object storage, which `04-FREE-AND-OPEN-STACK.md` prices at
about $15 a month combined. $5,000 against $15 a month is more credit than the
business can spend inside a credit window. **Take it, but do not restructure the
stack to chase it.** Migrating to Azure to consume free credits is how a
$15/month line becomes a $200/month line the month the credits run out.

---

## 4. AWS Activate, Founders tier

**What you get.** **$1,000 in AWS Activate credits, valid two years from
approval**, plus **$350 in Developer Support credits, valid one year** [review].

**Why this one matters more than its size.** One source states that credits
offset usage across 200+ AWS services **including third-party foundation model
usage inside Amazon Bedrock** [review]. Claude models are available through
Bedrock. If that holds, $1,000 of AWS credit is $1,000 against the single
largest cost line in this business, which the plan puts at roughly $900 a month
at 100 customers and far less before that. At the plan's day 1 to 30 stage,
running 20 policies through the engine, $1,000 of Bedrock credit could cover the
entire proving phase.

**Confirm that specific point before relying on it.** It is one source, it is
[review], and vendors change which third-party model usage is credit-eligible.

**Eligibility.** Sources disagree on the strictest points.
- Pre-Series B, **no investor requirement** [review].
- Founded within the last 10 years [review].
- New to Activate credits. AWS de-duplicates repeat applications by EIN and
  company name [review].
- **[conflict] on incorporation.** One source lists "an incorporated company
  founded within the last 10 years" as a requirement [review]. Another describes
  the Founders tier as available to "any pre-Series B startup with no investor
  requirement" and notes "notably absent: any revenue or funding cap" [review],
  with no mention of incorporation.
- **[conflict] on a paid AWS account.** One source says you need "an AWS account
  on a paid-tier plan (card on file)" [review]. Others do not mention it.
- **Business-domain email required.** Auto-rejection of `@gmail.com`,
  `@yahoo.com`, `@hotmail.com` is reported [review].
- Website is verified. A landing page is acceptable but it must exist and load
  [review].

**How to apply.**
1. Domain mailbox and live site first. Non-negotiable here.
2. Create an AWS account and note the account ID.
3. Have ready: company founding date, one-line product description, website URL,
   AWS account ID.
4. Apply through AWS Activate. The requirements page I could reach is
   `https://aws.amazon.com/activate/portfolio-detail/requirements/`, which covers
   the Portfolio tier. The Founders application is linked from the Activate
   landing page [review].

**Approval time.** 2 to 7 business days [review].

**The catch.** Two years is a generous window by the standards of this page, but
the $350 support credit expires in one year and is worth nothing to a solo
founder who will never open a support ticket. Do not upgrade to a paid support
plan to "use" it. Also, applying once burns the EIN and company name, so apply
when the site and mailbox are ready, not before.

---

## 5. Google for Startups Cloud Program, Start tier

**What you get.** Up to **$2,000 in Google Cloud credits, valid 12 months**,
plus **$200 in Google Skills credits**, free-tier Google AI Studio access, and
**12 months of Google Workspace Business Plus for eligible new signups**
[review].

That Workspace line is the interesting one. It is a solution to the domain-email
problem in section 0, if the timing works out.

**Eligibility.**
- **Founded within the last 24 months** [review]. This is the tightest age
  window on the page.
- **Not previously received Google Cloud credits beyond the standard free
  trial** [review].
- Aimed at startups that have **not yet taken institutional venture funding**
  [review].
- Described as for "digital-native technology startups with a working MVP, a
  clear business model and plans to seek venture funding" [review]. Countercite
  has the MVP and the business model. It does not plan to seek venture funding.
  Whether that is enforced is [NOT ESTABLISHED].
- Company-domain email. Personal Gmail is the reported top rejection reason
  [review], which is a slightly comic requirement from Google.

**How to apply.**
1. Domain mailbox and site live.
2. Read the eligibility page at `https://cloud.google.com/startup/benefits` and
   the pre-funded page at `https://cloud.google.com/startup/pre-funded`.
3. Apply through the Google for Startups portal. Reported at under 15 minutes
   [review].

**Approval time.** 1 to 2 weeks [review].

**The catch.** The "founded within 24 months" clock is a real problem if you
incorporate later and Google dates the company from incorporation. If you intend
to apply here, apply before you have been trading unincorporated for two years,
or expect to argue about the founding date. The 12-month credit expiry is also
short against a stack that costs single-digit dollars a month.

---

## 6. Stripe Atlas

**Not a credits programme.** It is a paid incorporation service that comes with
credits attached. Included here because it is the cheapest
route to incorporation and because the perks are real.

**What you get for $500 flat** [review]:
- Delaware C-corp or LLC filing, with the state filing fee included, which is
  unusual.
- EIN application via SS-4.
- Legal templates: bylaws, founder stock agreements, IP assignment,
  indemnification, organisational consents, prefilled for e-signature.
- A US bank account at Mercury or a partner bank, opened remotely.
- One year of Delaware registered agent service.
- **$2,500 in Stripe product credits for the first year after incorporation**,
  plus a perks marketplace reported at $50,000+ in partner discounts [review].

**Eligibility.** [NOT ESTABLISHED] beyond being able to pay. It is a purchase,
not an application.

**How to apply.**
1. `https://stripe.com/atlas`.
2. Choose C-corp or LLC. This is a decision with tax consequences and it is a
   question for the same lawyer the plan already budgets $1,500 to $3,000 for.
3. Sign the document set.
4. Reported: incorporated and ready to bank within two business days [review].

**The catch, and it is the one that matters at this budget.**

| Line | Cost |
|---|---|
| Atlas, one-off | $500 [review] |
| Delaware franchise tax, every March | ~$300/year [review] |
| Registered agent after year one | $100/year [review] |

**That is $500 now and roughly $400 a year forever, against a total budget under
$1,000.** Against that, the $2,500 Stripe credit is only worth anything once
there is card volume to process, and the plan has no customers yet. The credit
expires in the first year after incorporation [review].

**My read: do not incorporate this month.** It consumes half the budget, starts
an annual tax clock, and opens exactly one programme on this page (NVIDIA
Inception) plus a disputed AWS requirement. Incorporate when the day 1 to 30
accuracy gate has passed and you are about to take money, which is when the
lawyer is needed anyway. Cheaper alternatives exist if the decision goes the
other way: Firstbase at $399 plus $299/year agent, Clerky from $427 [review].

**Separately, Stripe processing-fee credits.** Waived fees on the next $20,000
of processing, worth up to about $500, appear in one promotion [review]. Larger
waivers ($50,000 of fees, or $150,000 of volume) are attached to venture
partners such as FirstMark [review] and are not reachable here. Worth chasing
later, because `04-FREE-AND-OPEN-STACK.md` found Stripe costs more than the AI
at 100 customers.

---

## 7. GitHub

**Two offers, and a solo unincorporated founder qualifies for neither.**

**GitHub for Startups.** 20 seats of GitHub Enterprise free for 12 months plus
$10,000 in credits covering Copilot and Advanced Security, 50% off year two
[review].

Eligibility [review]:
- **Must be affiliated with a GitHub for Startups partner.** The Enterprise
  offer is available only to startups backed by a qualifying VC firm that is an
  official partner. Any investor, incubator or accelerator can *become* a
  partner, which is not the same as you having one.
- Must have received outside funding, Series B or earlier.
- New to GitHub Enterprise, not on an Enterprise plan in the past six months.
- No previous GitHub credits or Enterprise licences.

Review takes 1 to 3 business days [review].

**Verdict: out of reach.** No investor, no partner, no outside funding. Three
independent fails. Do not spend the afternoon.

**GitHub Student Developer Pack.** Requires current enrolment in a
degree- or diploma-granting programme, provable with a school email or a dated
student ID [review]. Teachers, researchers and staff are explicitly not eligible
[review]. Unless the owner is enrolled somewhere, this is not applicable, and
claiming otherwise would be fraud against GitHub.

Worth knowing anyway: GitHub paused new signups for the free Copilot Student
plan in April 2026 [review].

**What to do instead.** 20 Enterprise seats is worthless to one person. The free
GitHub plan gives private repositories and Actions minutes and is genuinely
sufficient. This is a programme to ignore without regret.

---

## 8. Notion for Startups

**What you get.** Three tiers [review]:

| Route | Offer |
|---|---|
| **Partner-affiliated** | 6 months free on Business plan, including Notion AI. Value quoted up to $6,000, and one source computes $12,000 at 100 users |
| **No partner** | **3 months free on a new Business plan, including Notion AI** |
| Teams under 10 | 1 month free |

**Eligibility** [review]: a public company website, a company email address,
fewer than 100 employees, and you must be a **new, non-paying Notion customer**.

**How to apply.**
1. Company-domain email and public site first.
2. If you have a partner code, request it from the partner and include it.
   Otherwise apply for the 3-month tier.
3. Apply at `https://www.notion.com/startups`. One summary gives the application
   path as `notion.so/startups-apply` [review].

**Approval time.** 3 to 5 business days [review].

**The catch.** This is a discount on a subscription, not a credit. Three months
free on Business is worth real money only if you were going to pay for Business
in month four. A solo founder does not need Notion Business. **The honest answer
is that Notion's free personal plan covers one person, and taking a 3-month
Business trial mostly teaches you to depend on features you will then have to
pay for.** Take it only if you already wanted the AI features.

---

## 9. Linear for Startups

**What you get.** Up to 6 months free on Basic or Business plans [review].

**Eligibility** [review]:
- New, non-paying Linear customer.
- Fewer than 50 employees.
- **Must be affiliated with an official Linear partner**, a participating VC,
  accelerator or startup platform.
- Applicant must be logged in and be an admin of the company's Linear workspace.

**Verdict: gated, and there is no direct route.** One source is explicit that
startups cannot apply without a participating partner, and that access is behind
a partner code from one of Linear's 900+ partner accelerators, VCs and
incubators [review].

**The one thing worth checking.** Linear publishes its partner list at
`https://linear.app/startups/partners`. If YC Startup School, or any free
community you can join in an afternoon, appears on that list, this becomes a
15-minute application. See section 13.

**Also worth saying plainly:** Linear is issue tracking for teams. One person
does not need it. Free tier or a text file.

---

## 10. Vercel for Startups

**What you get.** Up to $30,000 in credits toward the Vercel platform on the
standard programme [review]. The separate Vercel AI Accelerator is a different
animal, reported at $216K of Vercel and v0 credits plus access to $8M+ in
partner credits from AWS, Anthropic, Cursor, ElevenLabs, Groq, Hugging Face,
Modal, OpenAI and others [review].

**Eligibility, standard programme** [review]:
- **Affiliated with an approved Startups Partner**, typically an accelerator or
  a VC firm.
- Not previously received Vercel for Startups credits.
- **Raised a Series A or less, and applying within 12 months of the most recent
  funding round.** That phrasing requires a funding round to exist.
- Company website, and **an email address that matches the company website**.

**Verdict: the standard programme is gated twice.** Partner affiliation and a
funding round. Both fail here.

**The AI Accelerator is a different question and is not obviously gated on
funding.** It is a cohort programme with an application and a selection process,
and its partner-credit bundle includes Anthropic, which is the cost line that
matters. I could not establish its eligibility rules, deadlines or whether it
takes equity. **[NOT ESTABLISHED].** Start at
`https://vercel.com/blog/the-vercel-ai-accelerator-is-back-with-6-million-in-credits`
and read the terms yourself. If it is genuinely non-dilutive and open to
unfunded solo founders, it is the highest-value item on this entire page and
everything else is rounding error.

Note also: Flex Commit credit terms apply to startups accepted on or after
6 August 2026 [review], so older write-ups of the programme are already stale.

**The catch, generally.** Countercite's marketing sites are seven static sites
on Cloudflare Pages at $0. Vercel credits solve a problem this project does not
have.

---

## 11. Netlify

**[NOT ESTABLISHED].** I could not find a Netlify startup credits programme with
published eligibility criteria. What exists [review]:

- Free plan with 300 credits per month, Personal at $9 with 1,000, Pro from $20
  with 3,000, under a credit-based pricing model introduced in 2026.
- Free Pro upgrades for students with a valid `.edu` address via the GitHub
  Student Developer Pack.
- Discounted or donated Enterprise for verified non-profits, via the open source
  programme.

**Verdict: nothing to apply to.** Do not spend time here. The plan hosts on
Cloudflare Pages anyway.

---

## 12. Supabase, MongoDB, DigitalOcean

### Supabase Startup Program

**What you get.** Up to 6 months of the Team plan free, quoted at about $3,600
of value [review]. One source describes it as up to $3,000 in platform credits
over 12 months [review]. **[conflict]** on the shape, not on the rough size.

**Eligibility.** **[conflict], and it is a sharp one.** One source lists
"verified affiliation with an approved venture capital firm or startup
accelerator" as a requirement [review]. Two others state plainly that **no VC
referral is required** and describe the programme as open to bootstrapped,
pre-seed and seed startups [review]. Other criteria reported: under 5 years old,
under $5M total funding, pre-seed through Series A.

Company-domain email and a real website are again the top rejection reasons
[review].

**How to apply.** Via the startup programme form on `supabase.com/partners`
[review]. Review 3 to 14 business days [review]. No cost, no equity [review].

**The catch.** Free Team plan, not credits, so it lapses to a paid plan or a
downgrade after six months. Team is roughly $600/month at list, and a solo
founder on the free tier does not need point-in-time recovery. Apply if you are
using Supabase. Do not adopt Supabase because of it.

### MongoDB for Startups

**What you get.** Unclear on purpose. After a restructure announced October 2025
and expanded January 2026, the programme moved to four tiers (Inspire, Grow,
Innovate, Scale) and **MongoDB stopped publishing a dollar figure for any of
them** [review]. The only quantified claim is that founders get 50% more Atlas
credits than under the previous programme [review]. A separate promotion of
"$500 free cloud credits" also circulates [review].

**Eligibility** [review]: under 7 years old, Series A or earlier, building a
single scalable software product rather than operating as an agency.

**The catch.** A programme that will not publish its own numbers is a programme
you cannot plan around. More to the point, Countercite's data layer in
`04-FREE-AND-OPEN-STACK.md` is SQLite with `sqlite-vec`, at $0. **Adopting
MongoDB to collect MongoDB credits would be the tail wagging the dog.** Skip.

### DigitalOcean Hatch

**What you get.** A 12-month programme. For AI and ML startups: up to $100,000
in compute credits over 12 months, plus up to 3 months of free GPU Droplet
access, 15 months of free Standard support, and partner discounts including
Stripe and Notion [review].

**Eligibility.** [NOT ESTABLISHED]. Every source described the benefits and none
gave the criteria. The $100,000 tier is almost certainly not the entry tier, and
programmes of this shape usually gate the top tier on funding.

**Why it is still worth 15 minutes.** The plan rents a GPU by the hour for OCR,
speech and embeddings, about 25 hours a month, costed at roughly $10. Free GPU
Droplet access for 3 months would cover that outright, and DigitalOcean is a
plausible home for the app VPS at $15. **This is one of the few programmes whose
credits land on spend the plan already intends.** Start at
`https://www.digitalocean.com/startups` and read the actual criteria.

---

## 13. NVIDIA Inception

**What you get.** Free membership. Cloud credits, Deep Learning Institute
training, preferred GPU pricing, and access to NVIDIA's VC network [review].
DGX Cloud credits are mentioned but no dollar figure is published that I could
verify. **[NOT ESTABLISHED]** on the credit amount.

**Eligibility** [review]:
- **Officially incorporated.** This is a hard requirement and it is the only
  hard incorporation gate on this page.
- Employ **at least one developer**. A solo technical founder satisfies this.
- Maintain a **working website**.
- **Less than 10 years old.**
- **No revenue requirement. Any funding stage, including bootstrapped.**

Not eligible: consulting firms, crypto, cloud providers, resellers and
distributors, public companies [review].

**How to apply.**
1. Incorporate first. There is no way around it.
2. Have the website live.
3. Apply at `https://www.nvidia.com/en-us/startups/`. Rolling, no deadline
   [review].

**Approval time.** Initial response in 2 to 4 weeks, typically from a partner
manager who then discusses the roadmap and activates benefits [review].

**The catch.** Free to join, no fee, no equity [review], which is genuinely
unusual and makes it worth doing eventually. But it is gated on the one thing
that costs $500 and starts a $400/year clock, and its main benefit is discounted
GPU access against a $10/month GPU line. **Do it after incorporating for other
reasons, not as a reason to incorporate.**

---

## 14. Accelerators and grants that take no equity

Asked for explicitly, so here is the honest sweep.

### YC Startup School

**Free, open to anyone, no application, no equity** [review]. Not an accelerator
in the funding sense. What it gives: 30+ video lectures, co-founder matching,
and weekly group office hours in cohorts of 6 to 8 founders facilitated by YC
alumni [review].

**The reason it is on this page is the deals.** Reported at **over $30,000 in
deals and credits for Startup School companies, including AWS, Google Cloud,
DigitalOcean, Clerky, Stripe Atlas and Brex** [review]. A separate figure of
"over $1M in startup deals" also circulates [review] and looks like marketing
addition across every partner.

**The question worth an hour of your time.** Several programmes above (Notion,
Linear, HubSpot, Vercel) gate their best tier on "partner affiliation", and one
search summary asserted that startups affiliated with YC, *including Startup
School participants*, can typically qualify [review]. **I do not believe that
without seeing it.** The far more likely reading is that "YC affiliation" means
YC-funded, and Startup School participation is not the same thing.

**So: enrol at `https://www.startupschool.org/`, open the deals page inside your
account, and read what is actually offered to Startup School companies as
opposed to YC-funded companies.** That single check either opens four gated
programmes or closes the question. It is the highest-information hour on this
page. **[NOT ESTABLISHED] until you look.**

### SBIR and non-dilutive federal grants

**Non-dilutive, keeps 100% of equity and IP** [review]. Eleven federal agencies
set aside R&D budget for small companies. Phase I awards reported at roughly
$200K to $300K, Phase II up to $2M, and new Strategic Breakthrough Awards up to
$30M introduced in 2026 [review].

**Eligibility for incorporation specifically: [NOT ESTABLISHED].** I could not
confirm whether a sole proprietor can apply. SBIR requires a registered small
business concern in the general case, which in practice means an entity, a
UEI/SAM.gov registration and an agency-specific solicitation.

**The honest verdict for this business.** SBIR funds research with a technical
risk and a public-interest angle. Countercite is B2B SaaS built on commercial
models, aimed at licensed professionals, with a 90-day plan to revenue. That is
close to the opposite of an SBIR profile, and the application effort is weeks,
not hours. **Do not chase this.** It is on the list because it was asked for, and
because if the contradiction engine turns into genuine document-understanding
research later, it changes.

### Equity-taking accelerators

YC, Techstars and 500 Global all take equity. Out of scope by the terms of the
question. Noted so the list is complete rather than padded.

### Bank and card perk marketplaces

**Mercury** perks are reported to include up to $5,000 AWS credits, $5,000 Azure
credits, $200,000 off Google Cloud, plus discounts on QuickBooks, Segment,
GitHub and 1Password [review]. **Requires a US-incorporated entity with an EIN**
[review], and comes free with Stripe Atlas, which opens a Mercury account as part
of the $500. **Brex** has a broader perk marketplace with limits that favour
funded startups [review].

**Verdict:** a reason to note that incorporation clusters several benefits
together (NVIDIA Inception, Mercury perks, the disputed AWS requirement, Stripe
Atlas credits), not a reason on its own.

---

## 15. The rest, briefly

| Programme | What | Eligibility | Verdict |
|---|---|---|---|
| **PostHog for Startups** | **$50,000 credits, 12 months, + ~$12,000 partner perks** [review] | **Under 2 years old, raised under $5M**, PostHog account on a **company email domain**, signed up on or after 1 Jan 2023. Free-email domains rejected automatically at submission. **No VC referral** [review] | **Apply. Rank 1 on effort. Auto-approved on submit, then manually reviewed** [review] |
| **Sentry for Startups** | Discounted plans, amount variable [review] | Bootstrapped, pre-seed, seed. **No VC referral** [review] | Apply. Review 3 to 10 business days [review]. Sentry's Developer free tier already covers this project |
| **Twilio for Startups** | API credits, amount variable [review]. `04-FREE-AND-OPEN-STACK.md` records ~$5,000, founded within 5 years, raised under $5M | Bootstrapped, pre-seed, seed. **No VC referral** [review] | Not relevant to Countercite. Relevant to the phone-line ideas elsewhere in the portfolio |
| **Modal** | **$30/month of compute credit on the Starter plan, no application, no card** [review]. A startup programme up to $50,000 also exists [review] | Sign up [review] | **Just sign up.** May cover the whole OCR and embeddings GPU line, costed at ~$10/month |
| **Groq / Deepgram / AssemblyAI** | Free tiers or signup credits, **no credit card** [review] | Sign up | Free tier, not a programme. Take it |
| **Together AI** | $5 minimum purchase [review] | Paid | Not a credit |
| **HubSpot for Startups** | **Bootstrapped with no partner: 30% off year one** [review]. 90% requires partner affiliation or verified venture funding | Professional or Enterprise tier only, **Starter excluded** [review]. Not a current paying customer | **Skip.** 30% off a Professional tier the business does not need is a discount on a cost you should not incur. The plan's outreach is 20 emails a day by hand |
| **Segment for Startups** | Up to $50,000 over 2 years [review] | [NOT ESTABLISHED] | Not needed. PostHog covers it |
| **OpenAI Startup Program** | Routed through partner VCs (Thrive, Sequoia, a16z, Kleiner Perkins, Conviction) per `04-FREE-AND-OPEN-STACK.md` | Requires VC affiliation | **Not accessible. Skip** |

---

## Realistically out of reach, and why

Said plainly so no afternoon is wasted.

| Programme | The blocker |
|---|---|
| **GitHub for Startups** | Requires a partner VC/accelerator **and** outside funding. Two hard fails |
| **Linear for Startups** | Partner code only. No direct route exists [review] |
| **Vercel standard programme** | Partner affiliation **and** a funding round within 12 months |
| **HubSpot 90% tier** | Partner affiliation or verified venture funding |
| **OpenAI Startup Program** | Partner VC routing |
| **Anthropic startup *credits*** | Institutional equity funding, per two sources [review] [conflict] |
| **Claude for Open Source** | 5,000 GitHub stars or 1M npm downloads |
| **GitHub Student Pack** | Current student enrolment |
| **Anthology Fund** | It is a VC fund. Takes equity |
| **SBIR** | Wrong shape of business, weeks of effort, entity almost certainly required |
| **Mercury / Brex perks** | US entity with EIN |
| **NVIDIA Inception** | Incorporation. Reachable, but only after that decision |

**The pattern.** Every headline number on this page ($250,000 Cloudflare,
$150,000 Azure, $100,000 AWS, $216,000 Vercel) sits behind investor affiliation.
The bootstrapped tiers are $1,000 to $5,000, with PostHog's $50,000 the single
outlier. That is still real against a budget under $1,000. It is not runway.

---

## Do this first, in order

1. **Point the domain at a live one-page site.** Product name, one paragraph on
   what it does, who it is for, a contact address. It must load. Half the
   rejections on this page are thin websites [review].
2. **Set up an email address on that domain.** Zoho Mail Forever Free or
   Cloudflare Email Routing plus Gmail send-as. Cost $0 [review]. This one step
   is a prerequisite or a stated rejection reason at AWS, Google, Cloudflare,
   PostHog, Supabase, Notion, Vercel, Sentry and Twilio.
3. **Apply, in this order, all from the same email:** PostHog, Cloudflare
   (`BOOTSTRAPPED`), AWS Activate Founders, Microsoft Founders Hub, Google for
   Startups Start tier, Supabase.
4. **Join Claude for Startups.** Two minutes. Expect membership, not credits.
5. **Sign up for Modal.** No application, $30/month standing [review].
6. **Enrol in YC Startup School and read the deals page from inside the
   account.** Then answer the partner-affiliation question in section 13, and
   write the answer into this file.
7. **Leave incorporation until the day 1 to 30 accuracy gate has passed.** Then
   do it once, with the lawyer the plan already budgets for, and pick up NVIDIA
   Inception, Mercury perks and the Stripe Atlas credits in the same week.

---

## What I could not verify, and what I got wrong

**Nothing here was read from a vendor page.** The proxy blocked every attempt.
Where two third-party summaries disagreed I have marked **[conflict]** and kept
both, because picking one and presenting it cleanly would be the wrong kind of
tidy.

**The Anthropic conflict is the one that matters most** and it is unresolved.
`04-FREE-AND-OPEN-STACK.md` recorded that VC funding is not required per the
programme FAQ and put Anthropic first on its list. This round found two sources
saying credits require institutional equity funding. **I am revising my earlier
confidence downward.** The earlier document's "Apply first, it subsidises the
single biggest cost line" was too optimistic. Apply, but the AWS Bedrock route
in section 4 is now the more likely way to get free Claude inference into this
business, and it also needs confirming.

**Three specific things to check before acting:**

1. Whether AWS Activate credits genuinely cover third-party foundation models in
   Bedrock. One source, [review]. This is the highest-value unverified claim on
   the page.
2. Whether Cloudflare's bootstrapped tier is $5,000 or $10,000 [conflict].
3. Whether YC Startup School enrolment counts as partner affiliation anywhere
   [NOT ESTABLISHED]. It probably does not.

**Amounts I refused to guess:** NVIDIA Inception credit value, DigitalOcean Hatch
entry-tier criteria, MongoDB's tier values, Sentry and Twilio credit amounts,
Vercel AI Accelerator eligibility, and Microsoft's direct application URL.
