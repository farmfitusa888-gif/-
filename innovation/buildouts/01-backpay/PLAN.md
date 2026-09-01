# Backpay, the operating plan

Wage-shortfall detection for California hourly workers, and the damages engine
underneath it. Written 2026-08-31.

Budget assumption throughout: **under $1,000**. Every channel below is organic,
public-record or the price of a domain. Nothing here assumes ad spend, because
there is none. Solo operator.

The California wage engine already exists at `engines/ca-wage/rules.mjs`. I ran
it before writing this: **24 tests pass**, and I reproduced its worked example to
the cent. That engine is the only asset this plan starts with, and it is the only
one it needs.

---

## 1. The one-sentence version

**Nobody computes the number for the person it happened to, so compute it, give
it away free in California, and sell the same arithmetic to the plaintiff-side
employment firms who need class-wide damages calculated and who are the licensed
humans the worker has to be handed to anyway.**

Two sentences of consequence follow from that one, and both are corrections to
the brief:

- **The money in year one comes from the firms, not the workers.** The arithmetic
  in §5 forces this and I did not expect it when I started.
- **The worker product must be free at the point of detection.** Not freemium.
  Free. The beneficiary population is the least able to pay of any in this
  portfolio, and charging them to find out whether they were robbed inverts the
  entire moral and commercial logic of the thing.

---

## 2. Why this one, and what makes it different from the others

The thesis says one side of every transaction got automated and the other did
not. Wage theft is the row where that gap is widest and best measured, from two
independent directions:

| | |
|---|---|
| Taken per year, all forms | **$40–60 billion** |
| Unpaid overtime alone | **$19 billion** |
| DOL recovered, FY2013–FY2025, thirteen years | **$3,281,591,879** |
| **DOL recovery as a share of the midpoint estimate** | **0.50%** [derived: $50bn × 13 years = $650bn] |
| DOL compliance actions, 2013 → 2025 | **33,146 → 16,924 (−49%)** |
| Employees receiving back wages, 2013 → 2025 | **269,250 → 176,957 (−34%)** |
| DOL back wages recovered, 2013 → 2025 | roughly flat (**+4%**) |

Read the last three rows together, because they are the business. **Half the
enforcement actions, a third fewer workers helped, the same money recovered.**
The agency is running fewer and larger cases. The small individual claim is
exactly what has been squeezed out of federal enforcement, and the small
individual claim is the entire population Backpay serves.

And the Economic Policy Institute names the mechanism:

> **many workers don't recognise their pay is being shorted in the first place**

That sentence is the product specification. Every other product in this space
helps someone who already knows. This one tells the people who do not.

### Why California, specifically

Because the size of the claim is decided by the state, not by the worker.

| Basis | Per case | 25% fee | Cases/month for $30k |
|---|---:|---:|---:|
| DOL federal average, FY2025 | $1,465 | $366 | **82** |
| CA minimum-wage violation average | $3,300 | $825 | **37** |
| CA multi-year case with meal and rest premiums | $32,718 | $8,180 | **4** |

The spread between row one and row three is a factor of **22**, and it is
produced almost entirely by two things federal law does not have: **daily
overtime over eight hours** and **meal and rest premiums at one hour of pay per
violation per day**. California is not a preference. It is the only launch state
where the arithmetic clears.

### The worked example, re-run and confirmed

The research file cites $399 in one week and $32,718 over nineteen months. I did
not take that on trust. Running `computeWorkweek` against a warehouse pattern,
**six days, nine hours a day, $19/hour, a $108 weekly non-discretionary bonus,
no
meal or rest periods taken**, the engine returns:

| Line | Amount |
|---|---:|
| Regular rate (base $19 + $108 ÷ 54 hours) | **$21.00**, not $19.00 |
| Straight time, 40 hrs | $840.00 |
| Overtime, 14 hrs at 1.5× | $441.00 |
| Meal and rest premiums, 12 at one hour each | **$252.00** |
| **Owed** | **$1,533.00** |
| Paid (54 hrs × $19 + $108) | $1,134.00 |
| **Shortfall, one week** | **$399.00** |
| × 82 weeks (19 months) | **$32,718** |

Two things in that table matter more than the total.

**First, $252 of the $399 is meal and rest premiums, 63% of the claim.** The
overtime that everyone talks about is the minority of the money. California's
break premiums are the product.

**Second, the regular rate is $21.00 and not $19.00.** The $108 bonus raises
every premium hour. A worker checking their own stub would compare against $19
and find nothing wrong. This is the single clearest illustration of why detection
is a machine problem: the error is not in the arithmetic the worker can do, it is
in the arithmetic they do not know they are supposed to do.

**The $32,718 figure is $399 × 82 and assumes every week is identical.** Real
weeks vary. Treat it as the shape of the claim, not a forecast, and say so to
customers.

---

## 3. What the engine can actually see, and what it cannot

This section is here because it changes the product, and because the brief does
not say it.

**A pay stub records hours *paid*. It does not record hours *worked*.** When the
employer's own record is the thing being falsified, the stub cannot show it.

| Violation | Detectable from the stub alone? |
|---|---|
| Overtime miscalculated on hours the stub shows | **Yes** |
| Regular-rate error — bonus not folded in before the premium | **Yes**, when the bonus appears on the stub |
| Below minimum wage | **Yes** |
| Labor Code § 226 itemisation defects | **Yes** — nine required items, present or not |
| Seventh-consecutive-day schedule | **Yes**, if dates are on the stub |
| **Missed meal periods** | **No.** Requires the worker to say so |
| **Missed rest periods** | **No.** Requires the worker to say so |
| **Off-the-clock work and time shaving** | **No.** By construction |

So the 63% of the worked example that comes from break premiums is **not
machine-detectable from a photograph**. It requires three questions the worker
answers in about twenty seconds a week:

1. Did you get an uninterrupted 30-minute unpaid break before the end of your
   fifth hour?
2. Did you get your paid 10-minute rests?
3. Did you work any time you were not clocked in?

**This corrects the brief's central design claim.** The brief says the product is
"passive and continuous. The user does nothing after setup." It cannot be. The
largest component of a California claim exists only in the worker's memory, and
memory decays. The honest product is **thirty seconds a week**, and the retention
problem is real rather than assumed away.

### Two consequences worth acting on

**The Labor Code § 226 check is the safest first product.** Nine required items
on a wage statement, detectable from a photograph alone, no worker testimony, no
recall problem, penalties of $50 for a first violation and $100 for each
subsequent one **capped at $4,000**. It is the only finding the machine can make
entirely on its own. Ship it first.

**The backward-looking audit is the acquisition hook, not the monitoring.** A
worker who uploads twelve months of past stubs gets the cumulative number on day
one. A worker who signs up for monitoring gets it in a year. California's wage
claim limitation period is **three years** [VERIFY with counsel, and check
whether an unfair-competition claim extends it to four], which means the
retrospective audit is where the money already sits. **Monitoring is retention.
Retrospective audit is the reason anyone signs up.** The brief has these the
wrong way round.

### Where the engine refuses to answer, and why that matters commercially

The engine returns `blockers` and sets `reliable: false` for alternative workweek
schedules, qualifying collective bargaining agreements, exempt classification,
and piece-rate pay. That is correct engineering and it is also a commercial
problem, because **warehouse, agricultural and manufacturing workers, the
highest-violation populations, are disproportionately on alternative workweek
schedules or under a CBA.**

**What fraction of California hourly workers fall into a blocked category is
[NOT ESTABLISHED].** What would settle it: run 200 real stubs through the engine
in days 1–30 and count how many return `reliable: false`. That number is a gate,
and it is written into §12.

---

## 4. The customer, with real numbers

There are two, and I can size neither as precisely as Countercite sized public
adjusters. Say so plainly.

### Segment A, California plaintiff-side employment firms (the paying customer)

**Population: ~400 firms. Range 350 to 600.** Resolved in
`research/12-CA-EMPLOYMENT-BAR.md`, and the answer changes the plan.

The question this section asked, whether 101 firms is 5% or 80% of the market,
was the wrong question. The answer is **25%**, and the harder problem is the
shape rather than the size.

**The best figure is a count of behaviour, not of self-description: 396 firms
filed at least one PAGA case in California in the twelve months to May 2026.**
It converges independently with CELA's stated membership of over 1,400
attorneys divided by roughly 3.5 attorneys per plaintiff-side firm.

**The market is steeply concentrated, and that is the finding that matters.**
Five firms take about 24% of all filings; twenty take half. The remaining ~376
split the rest at roughly a dozen notices each per year. Three consequences:

- **The top five are probably not customers.** At 400-plus notices a year they
  have already built this internally. Selling to them is a distraction.
- **The natural buyer is the tail and the upper middle**, call it 300 to 400
  firms, filing often enough to need this and not often enough to have solved it.
- **One price will be wrong for both ends of the market.** Which hundred firms
  you win changes revenue by an order of magnitude.

**The revised first target is 20 firms, not 100.** That is 5% of the market and
roughly 30% of the matters, and it is reachable by name. A quarter of a defined
professional market is a three-to-five-year outcome for a solo operator on a
$1,000 budget, not a year-one one.

`tools/paga_firm_census.py` turns the reported 396 into a measured number and
produces the filings-per-firm distribution the tail estimate above is currently
guessing at. It self-tests clean and has never run against the live site,
because this environment's proxy returns 403 for the LWDA host.

*(Superseded, kept for the record: the original text below.)* Sized in
`research/12-CA-EMPLOYMENT-BAR.md` from five independent angles: the California
Employment Lawyers Association's own published membership figures, including the
statement-of-interest paragraph in its amicus filings, which are public court
documents; State Bar of California section counts; practice-area directory
counts, treated as upper bounds because they include defence-side attorneys;
annual PAGA notice volume and the count of distinct filing firms, which measures
the active market rather than the nominal one; and any published study of the
plaintiff-side bar. That single number decides whether 101 firms is 5% of the market or
80% of it, and the plan cannot be trusted until it exists.

What I do know:

- These firms already take wage-and-hour cases on contingency and already do the
  damages arithmetic, by hand, in spreadsheets, usually by a paralegal.
- **Class-wide wage damages are the exact computation the engine performs**,
  scaled from one worker to hundreds. Same code, different loop.
- They are the licensed human the DoNotPay order requires, and they are the
  destination the worker has to be routed to anyway. **The customer and the
  compliance mechanism are the same people.**

**Hours saved per matter: [NOT ESTABLISHED, being resolved].** The method
originally written here was wrong and is corrected: it said to ask five firms.

Do not ask anyone. **The answer is filed under oath in public court records.**
Plaintiff firms seeking fees in class settlements file declarations itemising
their lodestar, hours by timekeeper and rate by role, and courts write opinions
ruling on whether those hours were reasonable. California wage-and-hour
settlements produce these constantly. A firm asked to estimate from memory would
give a worse answer than the one they already swore to, and would have no reason
to answer an unsolicited question from a stranger with no product.

Being answered from fee motions, fee opinions and expert declarations in
`research/13-DAMAGES-MODEL-COST.md`.

### Segment B. California hourly workers (the beneficiary, not the payer)

| | |
|---|---|
| Workers with minimum-wage violations, 10 most populous states | **2.4 million** |
| Value taken from them | **$8 billion/year** |
| Average per worker | **$3,300/year** |
| California's share of that 2.4 million | **[NOT ESTABLISHED]** — the source reports the ten states in aggregate |

**This population cannot fund the business and should not be asked to.** The
arithmetic is in §5 and it is unambiguous.

### Segment C. Worker centres, legal aid and unions (distribution, not revenue)

Legal Aid at Work, Bet Tzedek, the Wage Justice Center, the UCLA Labor Center.
They already sit in front of exactly these workers and are chronically
under-resourced. Give them the tool free.

**One correction to the brief on unions.** The brief proposes "a union with
20,000 members is one sale." I think that is the weakest of its three routes,
because **union members have a grievance procedure and a steward, which is
precisely the mechanism that catches wage errors before they compound.** The
workers with the largest unremedied claims are the ones with no representation.
Unions are a credibility channel and a possible late sale. They are not the
launch customer.

---

## 5. Money, three models, weighed honestly

The brief names three. Two of them do not work at this budget and one of them may
be illegal in the launch state. Take them in order.

### Model 1, Consumer subscription at $9.99/month

**$30,000/month needs 3,004 subscribers.** That is not the objection. This is:

For a $9.99/month subscription to be a rational purchase, the worker's expected
recovery must exceed the $120 a year it costs.

| If the average claim is | P(finding) must exceed | And if only half of findings are recovered |
|---|---:|---:|
| $1,465 (DOL federal average) | **8.19%** | **16.38%** |
| $3,300 (CA minimum-wage average) | **3.64%** | **7.27%** |
| $32,718 (CA multi-year with premiums) | 0.37% | 0.73% |

Those thresholds are not impossible. **The problem is that the buyer cannot
evaluate them at the point of sale, and the buyer has no slack.** A worker on
$19/hour is being asked to pay a certain $9.99 today against an unknown
probability of an uncertain sum later, from a company they have never heard of,
in a category where the most famous player was fined $193,000 for lying about
whether its service worked.

**Verdict: no.** Detection is free. This model is dead and the plan does not
return to it.

### Model 2, Contingency, 25% of recovery

The economics look excellent and the law looks dangerous.

**The economics.** Working the funnel per 1,000 workers who upload stubs, with
every rate marked as an assumption:

| Scenario | Finding rate | Survives lawyer review | Chooses to act | Recovers | Workers/month needed for $30k at 25% of $3,300 | At 25% of $32,718 |
|---|---:|---:|---:|---:|---:|---:|
| Pessimistic [ASSUMPTION] | 10% | 50% | 10% | 40% | **18,182** | 1,834 |
| Central [ASSUMPTION] | 20% | 60% | 20% | 50% | **3,031** | 306 |
| Optimistic [ASSUMPTION] | 30% | 70% | 30% | 60% | **963** | 98 |

**Every one of those four rates is an assumption and the first two are the day
1–30 gates.** The finding rate is not knowable without running real stubs. The
"chooses to act" rate is dominated by retaliation, which is §10 and is the reason
I put 10–30% on it rather than anything higher.

Read the two right-hand columns against each other. **Sourcing 3,031 stub uploads
a month, solo, with no ad budget, is not happening in year one.** Sourcing 306
might be. But the $32,718 column assumes every acting case is a multi-year
meal-and-rest case, and that is the top of the distribution rather than the
middle. **Using it as the planning number would be exactly the kind of arithmetic
this project is supposed to refuse.**

**The law.** Two problems, and I am not qualified to resolve either:

- **Unauthorised practice of law.** California Business and Professions Code
  § 6125 prohibits practising law without a licence. Whether preparing and
  pricing a wage claim on a contingent percentage crosses that line is
  **[NOT ESTABLISHED]**. What would settle it: one hour with a California
  employment lawyer, specifically on whether a non-attorney may take a percentage
  of a Labor Commissioner recovery.
- **The Legal Document Assistant route.** California registers non-attorneys who
  prepare legal documents for self-represented people under B&P § 6400 et seq.,
  with county registration and a bond. **The current bond amount and fee are
  [NOT ESTABLISHED]**. Check the county clerk's schedule directly. If that
  scheme fits, the compliant version is a **flat document-preparation fee, not a
  percentage.** A flat $149 fee at the central scenario needs **8,390 uploads a
  month** for $30,000, which settles it: it is a service to offer, not a business
  to build on.

**Verdict: not in year one, and not until counsel signs it off.** Revisit in
month 12 with real conversion data and a written opinion.

### Model 3, Selling qualified leads to employment law firms

This is the brief's preferred route and it is the one with the sharpest legal
edge, in the launch state specifically.

**California Business and Professions Code § 6152 prohibits acting as a "runner
or capper"**. Soliciting business for an attorney for compensation. Separately,
the Rules of Professional Conduct restrict a lawyer from giving anything of value
for a recommendation, which is the constraint on the *lawyer's* side of the same
transaction. **The exact boundary between a permitted advertising arrangement and
a prohibited referral fee is [NOT ESTABLISHED] and it is the second question for
counsel.**

The general shape of the answer, which counsel should confirm rather than which I
should assert: **a flat fee for a service or for advertising is usually fine; a
payment per signed case usually is not.** That single distinction destroys the
economics the brief assumed, because the value of a wage case to a firm is in the
case, not in the intake.

**And there is no price to work with.** What a California plaintiff-side
employment firm pays for a qualified, evidenced wage intake is
**[NOT ESTABLISHED]**. What would settle it: ask ten CELA firms directly. It is a
question they will answer.

**Verdict: not as structured.** But it points at the model that works.

### Model 4. The one the arithmetic actually chose: sell the damages engine to the firms

This is not in the brief. It is where every constraint above lands.

A flat monthly software subscription to plaintiff-side employment firms, for
computing wage-and-hour damages from payroll and time records. No percentage, no
per-case fee, no referral, no capping, no UPL. **A firm paying for software is
the cleanest transaction available in this entire category**, and it is the same
transaction Countercite makes.

| Plan | Price | For | Firms needed for $30k |
|---|---|---|---:|
| **Solo** | $199/mo | One attorney | 151 |
| **Practice** | **$349/mo** | Up to five | **86** |
| **Firm** | $999/mo | Unlimited seats, class-scale batches | 31 |

**Flat and unlimited, for the same reason as Countercite.** A meter makes the
customer decide whether a matter is worth running, and a tool people ration is a
tool people cancel.

**Founding cohort: the first 15 firms get $199/month locked for life**, in
exchange for a named testimonial and the right to publish their accuracy numbers.
That price is not a discount. It is the cost of evidence, and evidence is exactly
what DoNotPay never bought.

#### Unit economics

| Line | Value |
|---|---|
| Price (Practice) | $349/mo |
| Compute and infrastructure per firm | **$15–45/mo** [ASSUMPTION — the engine is arithmetic, not inference; document parsing is the cost] |
| Gross margin | **87–96%** |
| Payment processing (~2.9% + 30¢) | ~$10/mo |
| CAC via founder outreach | **$0 cash**, ~60 minutes |
| Payback | **Immediate** |

The margin assumption is soft in one direction only: a firm running a 400-member
class through document extraction each month costs materially more than a firm
running two individual matters. Mitigation is a fair-use ceiling in the terms
from day one, not a meter.

#### And the arithmetic still disagrees with the twelve-month ambition

I built the model. It says the same thing Countercite's said, and I am not
going to argue with it twice.

Dials: adds ramping from 1 to 8 firms a month over nine months, **4% monthly
churn**, **$349 blended ARPU**.

| Milestone | Result |
|---|---|
| MRR at month 6 | $5,370 (~15 firms) |
| **MRR at month 12** | **$17,290 (~50 firms)** |
| **Month $30,000 is first reached** | **Month 19** |
| MRR at month 24 | $37,627 |
| MRR at month 36 | $50,087 |
| Cumulative cash by month 36 | $974,794 |

**So the honest twelve-month target is 50 firms and $17,300/month, with $30,000
arriving around month 19.** The brief's "6–12 months to revenue" is right about
*revenue*; it is wrong about *$30,000 of it*. First revenue lands around month 3.
The target lands in month 19.

**The cell that decides the whole business is adds ÷ churn**, exactly as it was
for Countercite:

| Scenario | Adds/mo | Churn | ARPU | Steady-state ceiling |
|---|---:|---:|---:|---|
| Plan | 8 | 4% | $349 | **200 firms = $69,800/mo** |
| Pessimistic | 4 | 6% | $299 | **67 firms = $19,933/mo — never reaches target** |

At four adds and 6% churn the ceiling sits **below** the $30,000 target and the
business never gets there no matter how long it runs. That is the risk, and it is
a churn risk before it is an acquisition risk.

**Reaching $30k inside twelve months needs one of three things, chosen rather
than hoped for:** ~15 adds a month instead of 8, churn under 2.5%, or a blended
ARPU nearer the $999 Firm tier because class-scale matters are where the value
actually is.

**The thing to notice about that last option:** it is also the option that most
improves the worker product, because class-scale matters are aggregated
matters, and aggregation is the answer to retaliation. The commercial incentive
and the mission point the same way here, which is rare and worth exploiting.

---

## 6. Positioning

**For workers:** *Backpay tells you if your paycheck is wrong. Free, in English
and Spanish, and we never contact your employer.*

**For firms:** *Wage-and-hour damages computed from payroll records, with every
figure citing the Labor Code section that produced it.*

Against what each buyer would otherwise do:

| Alternative | Why they leave it |
|---|---|
| **The worker checks it themselves** | They cannot. The worked example's error is in the regular rate, which is not a number on the stub. This is the real competitor and it wins by default today. |
| **The worker asks a lawyer** | A lawyer can only act on a case that walks in. EPI's finding is that the worker never knows to walk. Not a competitor — the destination. |
| **The firm's paralegal and a spreadsheet** | Free, and it is what they do now. Backpay wins on hours and on defensibility, and only on those. |
| **A generic AI chatbot** | Firms are already trying it. It pyramids daily and weekly overtime, it invents Labor Code sections, and no attorney will sign a damages model they cannot trace. Backpay wins on **citation to the statute**. |
| **DOL or the Labor Commissioner** | Compliance actions are down 49%. The small claim has been squeezed out. That is the gap, not the competition. |

**The line that does the work:** *every finding names the Labor Code section that
produced it, and the engine refuses to answer when it cannot.*

That second half is the unusual part. `reliable: false` on an alternative
workweek is a feature you can sell to a lawyer, because **a tool that
overstates a claim is worse than no tool**, an overstated claim is what gets the
whole finding thrown out.

**What Backpay never says:** that it is a lawyer, that it represents anyone, that
it guarantees a recovery, or that a worker should confront their employer. And it
never leads with "AI".

---

## 7. Go to market, $0, and named

### Channel 1. The California employer wage-violation index (the anchor asset)

Two free public bulk datasets, neither of which anyone has published in a form a
worker can use:

| Source | URL | What it gives |
|---|---|---|
| **DOL WHD enforcement database** | `enforcedata.dol.gov/views/data_summary.php` | Every investigation, employer named, back wages found, employees affected |
| **CA DLSE judgment search** | `dir.ca.gov/dlse/JudgmentSearch.htm` | Unpaid wage judgments by employer |

Join them, filter to California, publish it as one searchable page: **"Has my
employer been caught before?"**

This does four jobs at once and costs a weekend:

1. It is a genuine public good and the best SEO asset available, because every
   employer name is a long-tail query with real intent behind it.
2. It targets the worker outreach. Workers at an employer with a prior finding
   have a documented reason to check their pay.
3. **It is the aggregation map.** Multiple workers at one named employer is what
   turns individual claims into a class or PAGA matter, which is what firms
   actually want and what protects the individual worker.
4. It is the credential that gets a CELA firm to take the first call.

Note the environment constraint: `enforcedata.dol.gov` is currently blocked by
the session egress allowlist, per `research/01-DATA-SOURCES.md` §4. The operator
downloads it in one click, or the host gets allowlisted. Either way it is free.

### Channel 2, The free California wage calculator

The engine already exists. Wrap it in five inputs and no signup: *were you paid
correctly last week?* Instant answer with the Labor Code citation.

Target intents, all high-intent and commercially uncontested:
`california overtime calculator` · `am i owed overtime california` ·
`missed meal break pay california` · `california 7th day overtime` ·
`double time california` · `california pay stub requirements` ·
`what has to be on a pay stub in california`

**Search volumes for these are [NOT ESTABLISHED]**, settle it with any free
keyword tool in an afternoon before writing a single page.

**Everything ships bilingual or it does not ship.** The population with the
largest violations in California is Spanish-speaking. This is close to free to do
and it is not optional.

### Channel 3, CELA (the paying channel)

The **California Employment Lawyers Association**, `cela.org`. Member directory,
conferences, and a listserv where these lawyers talk to each other about exactly
this problem.

**The move is not to advertise.** It is to publish something the membership
actually wants. A correct, cited, public write-up of the three things wage
damage models most often get wrong (pyramiding, the seventh consecutive day, and
the regular rate) which is already documented in the engine's own header comment
— and let it circulate. **One listserv mention reaches more qualified buyers than
a hundred cold emails**, and this is a professional community that will notice
whether the arithmetic is right.

### Channel 4, Worker centres and legal aid

Legal Aid at Work, Bet Tzedek, the Wage Justice Center, the UCLA Labor Center,
county-level worker centres in the Inland Empire and the Central Valley.

Give it to them free, permanently. They supply the two things this business
cannot buy: **volume of real stubs** and **a licensed human already sitting with
the worker.** They also supply the answer to the hardest ethical question in the
plan, which is who catches the worker after the finding.

### Channel 5. Where workers already describe the problem in their own words

`r/antiwork`, `r/legaladvice`, `r/AskHR`, `r/WorkersRights`, and California
employer-specific subreddits. **Answer wage questions properly with the statute
cited, and never pitch.** The calculator link belongs in a profile, not in a
comment. This is slow, it is free, and it is the only channel that reaches the
worker before they have already given up.

### Channel 6. The stub-collection ask, which is the real day-1 job

Days 1–30 need real California pay stubs, and the plan does not work without
them. Named routes, in order of cost:

1. Worker centres and legal aid, under a data-sharing agreement (channel 4).
2. Public court exhibits in filed California wage cases, stubs are routinely
   attached to complaints and are on the public docket.
3. A standing "send us your stub, get a free audit, we redact everything" offer
   on the calculator page.
4. The operator's own network. Twenty stubs from people you know is a legitimate
   day-one sample and beats zero.

### What we are NOT doing

- **No paid ads.** No budget, and the audience cannot be targeted efficiently.
- **No "sue your boss" social content.** It attracts the wrong cases, it
  encourages confrontation, and it is the fastest route to an FTC problem.
- **No contingency and no lead fees** until counsel has answered §5 in writing.
- **No contact with any employer, ever.** Not once, not for verification, not on
  the worker's behalf. This is absolute and it is in §9 and §10.

---

## 8. The 90-day plan

### Days 1–30. Measure the finding rate, or have no business

| | |
|---|---|
| **Goal** | Know what fraction of real California stubs produce a finding, and what fraction of findings a lawyer confirms |
| **Do** | Collect **50 real California pay stubs** with hours, via channel 6. Run every one through the engine. Count `reliable: false` blockers separately. Have a California employment lawyer grade a sample of 20 findings. |
| **Also** | Pull the CELA member count. Pull the DOL and DLSE files. Ask five firms what a damages model costs them in paralegal hours. |
| **Ship** | Three numbers you can publish: finding rate, lawyer-confirmed rate, blocked rate |
| **Spend** | Domain ~$12. The lawyer review is the one real cost — offer the tool in exchange first. |
| **Gate** | **If fewer than 70% of findings are confirmed by the lawyer, stop and fix the engine. Do not build anything else first.** |

### Days 31–60. Ship the two free assets, open the firm conversation

| | |
|---|---|
| **Goal** | The calculator and the employer index live and bilingual; 20 CELA firms approached |
| **Do** | Ship the § 226 wage-statement check first (the only finding that needs no worker testimony). Ship the calculator. Publish the employer index. Write the three-mistakes piece and put it in front of CELA. Approach 20 firms with the tool, not a pitch. |
| **Ship** | Two public assets, 20 firm conversations, the objection list |
| **Gate** | **If 20 firms produce zero willing to run one real matter through it, the firm route is wrong. Find out why before approaching another twenty.** |

### Days 61–90. First revenue, and one worker case end to end

| | |
|---|---|
| **Goal** | 5 paying firms at $199 founding rate ≈ $995 MRR. One worker case documented from stub to filed claim, with a licensed lawyer on the file. |
| **Do** | Onboard every firm by hand and sit with each on their first real matter. Take one worker from finding to the Labor Commissioner or to counsel, and record every step and every drop-off. |
| **Ship** | 5 customers, one end-to-end case study with real numbers, and the first honest measurement of how many workers with a finding actually act |
| **Gate** | **Under 3 paying firms at day 90 means the channel is wrong. Rewrite the approach once.** |

### Month 12, the honest number

**50 firms and $17,290/month**, per the model in §5. Not $30,000. Anyone
promising $30,000 in year one at these acquisition rates is promising a number
the arithmetic does not produce.

---

## 9. Metrics

| Metric | Target | Why it is the one that matters |
|---|---|---|
| **Findings confirmed by a licensed lawyer** | **>85%** | The whole claim. Below this the product manufactures false hope for people who cannot afford it. |
| **False positives per 100 stubs** | **<3** | A worker who confronts an employer over a finding that is wrong has been actively harmed. Worse than a miss, by a wide margin. |
| **Overstatement rate** (claim computed higher than a lawyer's figure) | **0 tolerated above 5%** | An overstated claim is what gets a real violation thrown out. Tracked separately from false positives because it is a different failure. |
| Finding rate on real stubs | Measure, do not target | The single number that decides whether the consumer product has a funnel |
| `reliable: false` blocked rate | Measure, do not target | Decides how much of the highest-violation population the engine can serve at all |
| **Workers with a finding who choose to act** | Measure, do not target | This is the retaliation metric, and it is the true ceiling on every consumer model |
| Firm activation: first real matter in 14 days | >70% | Best predictor of retention in professional tooling |
| Firm monthly churn | <4% | Above 6% the ceiling drops below the target and the business never arrives |
| Approach → trial (firms) | >15% | Below this the message is wrong |

**The first three are tracked from customer one and published, including when
they are bad.** That is the direct lesson of the FTC's order against DoNotPay:
the $193,000 was not for having a poor product, it was for **never testing**
whether the product worked and advertising anyway.

**The sixth metric is the one to be most honest about**, because it is the one
most likely to be embarrassing and it is the one nobody else in this category
publishes.

---

## 10. Legal posture

**What Backpay is:** software that computes wage entitlements from records the
user supplies, and a free calculator for workers.

**What it is not, in the terms and on every page:** a law firm, a lawyer, a
representative, or a provider of legal advice. It does not represent anyone, does
not negotiate, does not contact employers, does not file anything, and does not
take a share of any recovery.

| Exposure | Handling |
|---|---|
| **Unauthorised practice of law** (B&P § 6125) | No advice, no representation, no percentage. Output is a computation with the statute cited, for the worker or their lawyer to use. **A written opinion from California counsel is required before any paid consumer product.** |
| **Runner and capper** (B&P § 6152) and lawyer referral rules | **No payment per case, per client or per signed matter, from anyone.** Firms buy a flat software subscription. This is the reason model 3 was rejected in §5 and it is a hard rule, not a preference. |
| **FTC deceptive claims** | No outcome guarantee. No claim to match a lawyer. Every accuracy claim backed by published measurement or not made at all. |
| **Worker safety and retaliation** | The product never contacts an employer and never advises confrontation. Default routing is to the Labor Commissioner or to counsel. See §11. |
| **Data** | Pay stubs are among the most sensitive documents a person owns. Encrypted, never used for training, deletable, exportable. **A worker must be able to delete everything in one action, because a worker who fears the file exists will not upload the stub.** |
| **Legal Document Assistant registration** (B&P § 6400 et seq.) | Required if a flat document-preparation fee is ever charged to a worker. County registration and a bond; amounts **[NOT ESTABLISHED]**. |

**Three things need a California lawyer before any money changes hands**, and
none is optional:

1. **Terms of service and privacy policy.**
2. **A written opinion on the contingency question**, may a non-attorney take a
   percentage of a Labor Commissioner recovery, and if not, does the LDA route
   fit.
3. **A written opinion on § 6152**, where the line sits between a permitted
   flat-fee arrangement with a firm and a prohibited referral fee.

**Budget $2,000–4,000 and treat it as the first real cost of the business.**
Slightly more than Countercite's, because two of the three questions are
genuinely unsettled rather than merely undrafted.

---

## 11. Risks, ranked by what actually kills it

### 1. Retaliation, and it is not a software problem

**A worker shown proof they are owed $4,500 may rationally stay silent, and
frequently will.** This sits above every other risk in this plan because it
attacks the conversion step that every consumer model depends on, and because
better detection makes it worse rather than better: the more accurately the
product tells someone what they are owed, the more clearly it presents them with
a choice they did not ask for.

Take the worst version seriously. **For an undocumented worker the downside is
not losing a job, it is deportation**, and that population overlaps almost
exactly with the population holding the largest claims. Retaliation is illegal
under California Labor Code § 98.6 and FLSA § 215(a)(3). **Illegality has not
made it rare, and the rate at which it occurs among workers who file wage claims
is [NOT ESTABLISHED]**. What would settle it is the NELP and EPI survey
literature on retaliation among low-wage workers who assert claims, which is
reachable outside this environment.

**Five mitigations, in order of how much they actually help:**

1. **Aggregation.** A group claim is far harder to retaliate against than one
   worker's, and concerted activity is protected under NLRA § 7 whether or not a
   union is involved. This is why the employer index in channel 1 is the most
   important asset in the plan and why the class-scale Firm tier is the right
   commercial bet. **The best answer to the dominant risk is also the best
   business model.**
2. **Hold the file.** California's limitation period is measured in years. The
   product's honest offer to a frightened worker is *we will keep computing it,
   we will keep it safe, and you decide when, including after you leave.*
   Nobody offers this and it costs nothing to build.
3. **Never route to the employer.** Default destination is the Labor Commissioner
   or counsel. The product will not draft a letter to HR. This removes the most
   dangerous action from the interface entirely.
4. **Never contact the employer ourselves.** Absolute.
5. **Say the risk out loud, in the product, in both languages, before the
   finding is shown.** Not in the terms. On the screen. A worker who was not
   warned and then lost their job is a person this business harmed.

**The honest admission:** all five together do not solve it. They reduce it. A
plan that claims to have solved retaliation with a feature is lying, and the
conversion rate in §5's funnel is where that lie would show up.

### 2. The finding rate might be low

Everything downstream is multiplied by it and nobody knows it. If real California
stubs produce findings at 3% rather than 20%, the consumer funnel collapses and
only the firm-side tool survives. *Mitigation: it is the day 1–30 gate and it
comes before anything is built or sold.*

### 3. Churn below the ceiling

At four adds a month and 6% churn the steady state is **67 firms and $19,933**,
which is below the target permanently. *Mitigation: annual plans, and pricing
the Practice tier so one saved matter covers a year. Watch churn from firm one.*

### 4. The stub does not contain the claim

63% of the worked example is break premiums, which the stub cannot show (§3). The
product depends on a weekly worker input, and weekly worker inputs decay.
*Mitigation: ship the § 226 check first because it needs no input at all, and
design for a thirty-second interaction rather than pretending there is none.*

### 5. Two of the three legal questions are open

The contingency question and the § 6152 question are both unresolved and both
sit in the launch state. *Mitigation: model 4 needs neither of them answered,
which is a large part of why it is the plan. Get the opinions anyway.*

### 6. The market might be smaller than it looks

I cannot size the California plaintiff-side employment bar. If CELA has 400
members rather than 1,500, then 86 firms is a fifth of the entire market and the
ceiling is real rather than theoretical. *Mitigation: it is a week-one lookup and
the plan should be re-read once the number exists.*

### 7. The absence of a competitor may mean I missed one

The brief searched and found nothing. That is either the opportunity or the
warning, and a negative cannot be proved. *Mitigation: the day 1–30 work
includes thirty minutes searching for wage-and-hour damages software sold to
plaintiff firms, which is a much more searchable category than the consumer one.*

### 8. Rules change constantly

California minimum wages vary by city, wage orders differ by industry, and the
case law on meal premiums moves. This is a maintenance burden forever. *It is
also the moat, and it is the reason the engine cites its sections.*

---

## 12. Kill criteria

Written now, while it is cheap to be honest, and not renegotiable afterwards.

| By | If | Then |
|---|---|---|
| Day 30 | Lawyer-confirmed findings are **below 70%** | **Stop.** Fix the engine or kill the business. Do not ship a calculator that tells people the wrong number. |
| Day 30 | The overstatement rate is **above 10%** | **Stop.** An overstated claim harms the worker more than no claim. This is a separate kill from the one above. |
| Day 30 | **More than 60%** of real stubs return `reliable: false` | The engine serves a minority of the target population. Widen its scope or drop the consumer product and keep only the firm tool. |
| Day 60 | **Zero** of 20 CELA firms will run one real matter through it | The firm route is wrong. Diagnose before approaching another twenty. |
| Day 90 | **Under 3 paying firms** | The channel is wrong. Rewrite the approach once. If a second 20 approaches fails, kill the firm route. |
| Day 90 | The end-to-end worker case did not complete | Find out at which step it stopped. **If it stopped at "worker decided not to act", that is the retaliation risk arriving on schedule and the consumer model needs rethinking, not retrying.** |
| Month 6 | Firm churn **above 8%** | Fix retention before spending another hour on acquisition. Above 6% the ceiling drops below target. |
| Month 6 | Fewer than **10%** of workers with a confirmed finding have taken any action | The consumer product does not convert and no amount of better detection will change it. Keep it free as a public good, and run the business on the firm tool alone. |
| Month 12 | **Under 30 paying firms** | Under 60% of the model's own projection after a year. Revisit whether the bar is large enough. |

**The rule that makes these real: the number goes on paper before the test, and
it does not move afterwards.**

---

## 13. What I got wrong on the way to this, stated plainly

Three corrections, because a plan that agrees with its own brief on every point
has not been thought about.

**One. I assumed the worker was the customer. The arithmetic says otherwise.**
Every consumer model needs thousands of stub uploads a month to reach $30,000,
and a solo operator with under $1,000 and no ads cannot source them in year one.
The firm-side damages tool reaches the same target with 86 customers. I did not
expect to end up selling to lawyers in a plan whose whole premise is that lawyers
cannot help because nobody walks through their door. **Both things are true at
once: the worker product is the reason the business exists, and the firm product
is what pays for it.**

**Two. I assumed the pay stub contained the violation. Mostly it does not.**
63% of the engine's own worked example is meal and rest premiums, which live in
the worker's memory rather than in the employer's document. The "passive
monitoring" framing in the brief is not achievable, and pretending otherwise
would have produced a product that finds a third of what it promises.

**Three. I initially wrote the lead-generation model as the primary route,
because the brief called it "a mature referral market."** It may well be mature.
It is also the model that runs directly into California's runner-and-capper
statute in the launch state, and I had to reverse it. The version that survives
is a flat software fee with no per-case component anywhere in it.

The engine is real, it is tested, and it reproduces its worked example to the
cent. **Everything else in this document is a hypothesis with a date attached to
when it gets tested.**
