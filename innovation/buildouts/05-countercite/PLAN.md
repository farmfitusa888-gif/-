# Countercite, the operating plan

Case software for public adjusters, special education advocates and patient
advocates. Written 2026-08-28.

Budget assumption throughout: **under $1,000**. Every channel below is organic
or costs the price of a domain. Nothing here assumes ad spend, because you do
not have it.

---

## 1. The one-sentence version

**Sell software to the people who already charge 10–50% to fight institutions by
hand, so they can carry five times the caseload, and reach break-even at 101
customers, in a market where Houston alone has 112.**

---

## 2. Why this one first

Of the seven businesses, this is the least exciting and the most likely to work.

| | Countercite | The others |
|---|---|---|
| Buyer known by name and address | **Yes — 1,708 of them, from a state file** | Estimated |
| Regulatory exposure | **Low, and conditional.** Flat-fee software sold to licensed professionals, never contingent, never direct to the affected individual. See `../../legal/00-LEGAL-POSTURE.md` §2.3. Enforced by `platform/check-features.mjs`, not by memory. | Licensing, medical advice, FTC claim risk |
| Consumer marketing spend needed | **None** | Substantial |
| Payback argument | **1–2 billable hours** | Varies |
| Customers needed for $30k/month | **101** | 105–535 |
| Time to first revenue | **Weeks** | Months |

It is also the **compliant vehicle for idea 2 (Overturn)**. Where state law
requires a licensed public adjuster to negotiate a claim for a fee, you cannot
do that work yourself. But you can sell that adjuster the tool, learn the
domain from the inside, and build the relationships that make a contingency
business possible later. **Countercite is the front door to the portfolio, not
just a business on its own.**

---

## 3. The customer, with real numbers

### Segment A, Public adjusters (launch here)

From the Texas Department of Insurance file, as of 2026-08-28:

| | |
|---|---|
| Active Texas public adjuster licences | **1,708** |
| Resident in Texas | **981** |
| Licensed in Texas, living elsewhere | 727 (of which **293 in Florida**) |
| Houston resident licensees | **112** |
| Dallas–Fort Worth resident licensees | **73** (37 Dallas + 36 Fort Worth) |
| San Antonio | 40 |
| New licences issued 2024 | **323** — up from 160 in 2023 |

**Break-even at $299/month is 101 customers = 5.9% of active Texas licences, or
10.3% of Texas residents.**

**Why Houston is the launch city.** 112 resident licensees inside one metro, more
than the entire break-even number; the highest hail and flood claim volume in
the state; and a professional community small enough that word travels.

**Why the 2024–2025 licence surge matters more than the total.** 597 people got
licensed in the last two years. **A new adjuster has no entrenched workflow to
defend, no incumbent software contract, and an acute need to look professional
in front of their first clients.** They are the easiest sale in the file and they
are individually identifiable by issue date.

### Segment B, Special education advocates (second)

Population **not established**. No licence registry exists because the role is
not licensed. Reachable through certification bodies and directories instead.
Rates $75–300/hour, 10–15 hours per case.

### Segment A2. Florida public adjusting FIRMS (the best list in the project)

From the Florida DFS business licence file, 2026-08-28:

| | |
|---|---|
| **Valid PUBLIC ADJUSTING FIRM licences** | **1,203** |
| Florida-based | **1,091** |
| Out-of-state firms licensed in Florida | 112 (24 in Texas) |
| **Carrying an email address on the licence record** | **1,203 — 100%** |
| Miami | **174** |
| Orlando | 55 |
| Boca Raton | 36 |
| Tampa | 33 |
| **Dade + Broward + Palm Beach counties** | **612 (56% of all Florida firms)** |

Separately, the file holds **599 INDEPENDENT ADJUSTING FIRM** licences. **Those
are not customers**. Independent adjusters work *for carriers*. They are on the
other side of the table and should be excluded from every list.

**Why firms beat individuals as a target.** Texas gives you 1,708 named
individuals with no contact details. Florida gives you **1,203 businesses, every
one with an email address, concentrated so heavily that three adjacent counties
hold 56% of them.** A firm also buys the **Practice tier at $299 or the Firm tier
at $599** rather than Solo at $149, the same sale at twice the revenue.

**1,203 firms against a 101-customer break-even is 8.4%.**

Firm licence issuance: 278 in 2021, **387 in 2022**, 125 in 2023, 172 in 2024,
159 in 2025, 82 to August 2026.

### Segment C, Patient advocates (third)

Population **not established**. Reachable through professional associations.

**The honest read: segments A and A2 are the only ones where I can name the
customers, 1,708 Texas individuals and 1,203 Florida firms. Segments B and C are
hypotheses until proven, and the plan below does not depend on them.**

**Do not add 1,708 and 1,203 together.** They count different things, people in
one, businesses in the other, and a Florida firm employs Florida-licensed
individuals, 24 of those firms are Texas-based, and 293 of the Texas individuals
live in Florida. **The overlap is real and unquantified.** Treat them as two
separate lists to work, not as a market of 2,911.

---

## 4. Positioning

**Countercite is case software for people who fight institutions.**

Against the three things the buyer might otherwise do:

| Alternative | Why they leave it |
|---|---|
| **Highlighter, PDF reader and a Saturday** | Free, and it is what they do now. Countercite wins on hours, and only on hours. This is the real competitor. |
| **Generic AI chatbot** | They are already trying this. It hallucinates, it cannot hold a 60-page policy plus a denial letter reliably, it cites nothing, and they cannot put their name on its output. Countercite wins on **citation to source page**. |
| **Claims/practice management software** | Stores files and tracks jobs. Does not read anything. Different category — position as complementary, never as a replacement. |

**The line that does the work:** *every finding links to the page that produced
it, so you can defend any sentence you send.*

That is not a feature. In a profession where your signature carries
professional liability, it is the difference between a tool you can use and one
you cannot.

**What we never say:** that it replaces judgement, that it is a lawyer or an
adjuster, that it guarantees an outcome, or that it is "AI-powered" as the
headline. The FTC's DoNotPay order is the reason, and it is in the terms.

---

## 5. Pricing

| Plan | Price | For | Break-even count |
|---|---|---|---:|
| **Solo** | $149/mo | One advocate, unlimited cases | 202 |
| **Practice** | **$299/mo** | Up to five advocates | **101** |
| **Firm** | $599/mo | Unlimited seats | 51 |

**Flat and unlimited, deliberately.** Every adjacent tool meters, per case, per
page, per gigabyte. A meter changes behaviour: the customer starts deciding
whether a case is *worth uploading*, and a tool people ration is a tool people
cancel.

**Annual: two months free** (Solo $1,490, Practice $2,990). Cash up front matters
more than the discount when the budget is under $1,000.

**Founding cohort: first 20 customers get $199/month locked for life**, in
exchange for a testimonial after 60 days and the right to quote their numbers.
That price is not a discount, it is the cost of evidence, and evidence is the
thing DoNotPay never bought.

### Unit economics

| Line | Value |
|---|---|
| Price (Practice) | $299/mo |
| Inference and infrastructure per customer | **~$18.50/mo** [review, costed 2026-08-31] |
| Gross margin | **~94%** |
| Payment processing (~2.9% + 30¢) | ~$9/mo |
| CAC via founder outreach | **$0 cash**, ~90 minutes of time |
| Payback | **Immediate** — first month covers acquisition |

**The cost line has now been costed rather than assumed**, and it came in far
below the $45/month the financial model uses. At 100 customers the whole stack
is about $1,844/month, of which **$897 is Stripe and $900 is the model. Every
other component together is roughly $47** — seven websites, OCR on 225,000 pages
a month, embeddings, transcription, monitoring and analytics. Payment processing
costs slightly more than the intelligence, which nobody budgets for.

**The model dial stays at $45 deliberately.** It is a costing, not a bill, and a
firm running thousand-page medical productions could cost several times a light
user. Flat pricing means we absorb that, so the conservative dial stays and the
fair-use ceiling still belongs in the terms from day one. Not a meter, but a
stated point at which we talk.

**Do not run the contradiction engine on a free or local model.** That is the
one place in this business where paying is correct, and the reasoning is in
`../../research/04-FREE-AND-OPEN-STACK.md`. Open models fail on clause-level
legal work by reporting no related clause when a related clause is present
[review]. That is a false negative, which is the failure this product cannot
survive.

---

## 6. Go to market, $0, and specific

### The list already exists

You have it. 1,708 rows with name, city, licence number and issue date. **This is
not a lead list you have to build; it is a public register you already
downloaded.**

**It does not contain email addresses.** Texas publishes name, licence and
location only. So the sequence is: identify from the file, find the business
through search, approach through the business.

### Channel 1, The 2024–25 cohort (primary)

**Who:** the 597 adjusters licensed in 2024 and 2025, filtered to Texas
residents, sorted by city.

**Why them:** newest to the profession, no incumbent tooling, most acutely aware
of how long the reading takes because they have not yet built shortcuts.

**How:** each one has a business. Find it, and approach with something useful
rather than a pitch. See `ASSETS.md` for the exact message. **Twenty a day is
sustainable by hand and exhausts the cohort in a month.**

### Channel 1b. The Florida firm list (now the primary channel)

**This is the strongest channel in the project and it did not exist until the
Florida file arrived.**

1,203 firms, 100% with an email address on the public licence record, and
**612 of them inside Dade, Broward and Palm Beach.** Miami alone has 174, more
than Houston, and they are businesses rather than sole practitioners.

**Work it in this order:** Miami (174) → Dade/Broward/Palm Beach remainder (438)
→ Orlando (55) → Tampa (33). Exclude the 599 independent adjusting firms
entirely.

**On the legality of using those addresses, I was too cautious before and want
to correct it.** I previously wrote that using licence-record emails for outreach
"invites CAN-SPAM exposure." **That was overstated.** CAN-SPAM permits unsolicited
commercial email, including cold B2B, provided you comply with it: accurate
headers and "from" line, a non-deceptive subject, a clear disclosure that it is a
commercial message, a valid physical postal address, a working opt-out, and
honouring opt-outs within 10 business days. These are **published business
contact details on a public licence record.**

**The reputational caution stands and is the real constraint.** A community of
1,203 firms in three counties talks to itself. Send in small batches, personalise
genuinely, and stop after two messages. Volume is not the constraint here, welcome is.

### Channel 2, NAPIA and the state association

The **National Association of Public Insurance Adjusters** (napia.com) has a
member directory and holds conferences. **Members are the professionalised, engaged
segment. A better list than a bigger one.** The Texas Association of Public
Insurance Adjusters is the state equivalent.

**The move is not to advertise.** It is to publish something the membership
actually wants. The denial-letter guide already on the site, and let it be
shared. One association newsletter mention reaches more qualified buyers than
any amount of cold outreach.

### Channel 3, SEO, which is already built

Eighteen pages live, 293 metadata signals per page, three long-form guides and a
24-term glossary. **This is a compounding asset that costs nothing to hold.**

Target intents, all low-competition and high-purchase-intent:
- "public adjuster software" · "IEP advocate software" · "patient advocate tools"
- "how to read an insurance denial letter", genuine search volume, and it pulls
  in policyholders who then ask their adjuster about the tool
- "public adjuster license Texas" · "public adjuster license Illinois"

**The guides are the acquisition engine, not the product pages.** A working
adjuster who finds a genuinely good guide on denial letters forms an opinion
about whoever wrote it.

### Channel 4, The catastrophe cycle

**42.6% of Texas licensees live out of state, and 293 of them are in Florida.**
That is the catastrophe-response population. After a named storm, adjusters
travel, caseloads spike, and the reading burden becomes acute in exactly the week
they have no time.

**Post-event is the highest-intent moment in this entire market**, and it is
predictable in season. Have the guide, the offer and the outreach ready before
the event, not after.

### Channel 5, Referral

An adjuster who saves six hours on a claim tells other adjusters. **One month
free for both sides on a referral that converts.** This is how small professional
communities actually buy, and it costs nothing until it works.

### What we are NOT doing

- **No paid ads.** No budget, and the audience is too small for ad platforms to
  target efficiently.
- **No bulk email to the 757,686 addresses in the appointments file.** Those are
  agents, not adjusters. The wrong audience entirely, and blasting them would
  burn the sending domain that the 1,203 real prospects need. **Cold email to the
  1,203 licensed adjusting firms is legitimate and is channel 1b; cold email to
  the other 757,686 is spam.** The difference is relevance, not legality.
- **No content mill.** Three excellent guides beat thirty thin ones for a buyer
  who reads professionally for a living.

---

## 7. The 90-day plan

### Days 1–30, Prove it on real documents

| | |
|---|---|
| **Goal** | The contradiction finder works on real policies, measured |
| **Do** | Collect 20 real denial letters with their policies from public consumer-complaint threads and law firm example pages. Run the engine. Grade every finding against a licensed adjuster's read. |
| **Ship** | Accuracy numbers you can publish |
| **Spend** | Domain, ~$12 |
| **Gate** | **If it does not find the contradiction a professional finds, stop and fix. Do not sell before this.** |

### Days 31–60, Ten founding customers

| | |
|---|---|
| **Goal** | 10 paying at $199/mo locked |
| **Do** | Work the 2024–25 cohort, Houston first, 20 approaches a day. Onboard by hand, one at a time. Sit with each on their first real case. |
| **Ship** | 10 customers, 10 recorded onboarding calls, the objection list |
| **Gate** | **If 100 approaches produce fewer than 3 customers, the problem is positioning, not volume. Rewrite before continuing.** |

### Days 61–90, Evidence, then scale the channel

| | |
|---|---|
| **Goal** | 25 paying, first published outcome numbers |
| **Do** | Collect hours-saved and win-rate data from the founding cohort. Publish it. Approach NAPIA and the Texas association with the results, not with a pitch. Open segment B (special education) with one guide and ten approaches. |
| **Ship** | 25 customers ≈ $5,000 MRR, one case study with real numbers |

### Month 12, and a correction against my own plan

I originally wrote month 12 as the target. **Then I built the financial model and
it disagreed with me, so the model wins.**

At the plan's own dials, 3 adds in month 1 ramping to 9/month over 9 months,
4.5% monthly churn, $299 ARPU, the model produces:

| Milestone | Result |
|---|---|
| MRR at month 12 | **$19,231** (~64 customers) |
| **Month the $30,000 target is reached** | **Month 19** |
| MRR at month 24 | $36,453 |
| MRR at month 36 | $46,364 |
| Cumulative cash by month 36 | $809,207 |

**So the honest target is 64 customers and $19k/month at twelve months, with
$30k arriving around month 19.** Anyone promising $30k in year one at these
acquisition rates is promising a number the arithmetic does not produce.

**The cell that actually decides it** is the steady-state ceiling: adds ÷ churn.
At 9 adds and 4.5% churn that is **200 customers, 198% of break-even**, so the
target is reachable and the only question is when. But at 5 adds and 6% churn
the ceiling is **83**, which is *below* the 101 break-even, and the business then
**never reaches its target no matter how long it runs**. Churn eats it first.

That single comparison is the whole risk of this business, which is why the
model has a sensitivity grid for exactly those two dials and nothing else.

**Reaching $30k inside twelve months requires one of three things**, and they
should be chosen deliberately rather than hoped for: adds of ~15/month instead of
9, churn under 3%, or a higher blended price via the Firm tier.

---

## 8. Metrics

| Metric | Target | Why it is the one that matters |
|---|---|---|
| **Findings confirmed by the professional** | **>85%** | The product's whole claim. Below this it creates work instead of removing it. |
| **False positives per case** | **<2** | A tool that cries wolf gets switched off. |
| **False negatives per case** | **<0.5** | Added after the open-model research. I originally wrote that a false positive is "worse than a miss", and that is wrong. A false positive is visible and annoying. **A missed contradiction is invisible until the adjuster's claim settles low with their name on it**, and in a community of 1,203 firms across three counties you cannot buy that back. Measured by re-running closed cases where the answer is known. |
| Hours saved per case, self-reported | >4 | The payback argument, in the customer's own words |
| Activation: first real case in 7 days | >70% | The single best predictor of retention in tooling |
| Monthly churn | <4% | Solo professional software churns hard; above 6% growth stalls |
| Approach → trial | >10% | Below this, the message is wrong |
| Trial → paid | >30% | Below this, the product is wrong |

**The first two are tracked from customer one and published.** That is the direct
lesson of the FTC order against DoNotPay: it was not punished for having a bad
product, it was punished for never measuring and then advertising anyway.

---

## 9. Legal posture

**What Countercite is:** software licensed to professionals for use in their
own practice.

**What it is not, in the terms and on the site:** a law firm, a licensed public
adjuster, an advocate, or a provider of legal, insurance or medical advice. It
does not represent anyone, does not communicate with carriers or districts, and
does not send anything.

| Exposure | Handling |
|---|---|
| **Unlicensed public adjusting** | Countercite never negotiates, never contacts a carrier, never contracts with a policyholder. Every state's licensing statute is aimed at acting *for* a policyholder for a fee, which we do not do. **The licensed professional remains the actor.** |
| **Unauthorised practice of law** | No legal advice, no representation. Output is a draft for a professional to review, edit and adopt as their own. |
| **FTC deceptive claims** | No outcome guarantees. No claim to match a professional. Accuracy claims backed by published measurement or not made. |
| **Client confidentiality** | Encrypted, never used for training, deletable per case, exportable. A business associate agreement available where a customer needs one. |
| **Professional liability** | Terms place responsibility for the work product on the professional, where it legally sits anyway. |

**Three things need a lawyer before the first paying customer**, and none is
optional: the **terms of service**, the **privacy policy**, and a **one-hour
review of the unlicensed-adjusting question in Texas and Illinois specifically**.
The site currently carries plain-language placeholders that say in terms that
they are not the final documents. **Budget $1,500–3,000 and treat it as the first
real cost of the business.**

---

## 10. Risks, ranked by what actually kills it

**1. The contradiction finder is not good enough.** Everything rests on it. A 60-page
policy plus endorsements is a genuinely hard document-understanding problem, and
if the finding rate is mediocre the product creates work. *Mitigation: the day
1–30 gate exists precisely for this and it comes before any selling.*

**2. Two of three segments are unmeasured.** I can name 1,708 public adjusters. I
cannot size special education or patient advocates at all. If public adjusting
alone is too small after de-duplicating multi-state licences, the plan needs
segment B to work and segment B is a hypothesis. *Mitigation: the 90-day plan
does not depend on B; it opens it as a test in month 3.*

**3. Solo professionals churn.** Low budgets, seasonal work, practices that close.
A public adjuster with no storm has no cases and no reason to pay in March.
*Mitigation: annual plans, and pricing the Practice tier so one saved case
covers a year.*

**4. Flat pricing meets a heavy user.** One firm running huge productions could
cost more than it pays. *Mitigation: fair-use ceiling in the terms from day one,
and watch cost-per-customer weekly.*

**5. A funded competitor arrives.** Nothing here is technically unreachable. *The
defence is not technology. It is being the tool the profession's associations
already recommend, which is why channel 2 matters more than it looks.*

---

## 11. Kill criteria

Written now, while it is cheap to be honest.

| By | If | Then |
|---|---|---|
| Day 30 | Findings confirmed by a professional are **below 70%** | **Stop.** Do not sell it. Fix the engine or kill the business. |
| Day 60 | **Fewer than 3 paying** from 100 real approaches | Positioning is wrong. Rewrite once. If a second 100 fails, kill it. |
| Day 90 | **Under 15 customers** | The channel does not work. Switch to segment B or stop. |
| Month 6 | **Monthly churn above 8%** | The product is not sticky. Fix retention before spending another hour on acquisition. |
| Month 12 | **Under 50 customers** | Revisit. Half of break-even after a year says the market is smaller than the register suggests. |

**The rule that makes these real: write the number down before the test, and do
not renegotiate it afterwards.**


---

## Decision, 2026-08-31: professional-only, and the consumer line is closed

Two pieces of research reached the same conclusion from opposite directions,
neither having seen the other.

The legal work found that selling flat-fee software to a licensed public
adjuster is the safest posture available, with a near-express exemption in
Illinois for furnishing technical assistance to a licensed adjuster and a
narrower version of the same idea in Texas. It also found that every
unauthorized-practice and licensing question in this project attaches to the
policyholder-direct line and to nothing else.

The go-to-market work, applying this plan's own adds-divided-by-churn formula,
found that a policyholder base churns at something near 50% a month because a
denied claim is an event rather than a condition. Holding 100 paying
policyholders would need 50 new ones every month, forever. The professional
base churns near 3.5% and needs four.

So the consumer line was simultaneously the source of all the legal risk, the
smaller share of revenue, and an arithmetic impossibility. It is closed.

**What this changes in practice: very little, because the product was built
this way.** The site has always addressed public adjusters, special education
advocates and patient advocates. Policyholders appear in the copy only as the
customer's client, which is correct and stays. The consumer product was
introduced during the legal discussion and never built.

**What it changes on paper:** the regulatory exposure row above, which was
written when professionals were the only buyer and had quietly become wrong.
And the plan now carries an enforced rule rather than an intention. The site
config declares `audience: "licensed-professionals-only"`, and the build fails
if that field changes or if copy appears that addresses the affected individual
directly. Tested by injecting consumer copy and confirming the build refused it.

**The rule that must never be broken, in any state, with anyone: never take a
contingent fee.** A percentage of the settlement is the defining commercial
feature of public adjusting. It is what all four states cap, and taking one
would convert a software business into an unlicensed adjusting business
everywhere at once. Flat pricing was chosen for product reasons. It is also the
licensing defence.
