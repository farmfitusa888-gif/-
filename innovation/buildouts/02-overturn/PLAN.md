# Overturn, the operating plan

A contingency service that fights denied and underpaid home insurance claims for
homeowners. Written 2026-08-31.

Budget assumption throughout: **under $1,000**. That number survives contact
with this business, but only barely, and only in one of the three legal
structures below. Everything here is organic or costs a filing fee.

**Two things in this plan contradict the brief in `ideas/02-claim.md`.** Both
are corrections, both are load-bearing, and both are in section 3 and section 7.
The brief's fee assumptions are not legal in either launch state.

---

## 0. Read this before believing any legal citation

Every statute and bulletin cited below was found through a **search-engine
summary, not by reading the statute page**. This environment's egress proxy
blocks `law.justia.com`, `flsenate.gov`, `idoi.illinois.gov` and every other
primary legal source, the same block documented in
[`research/01-DATA-SOURCES.md`](../../research/01-DATA-SOURCES.md).

So: **the citations are directionally reliable and specifically unverified.**
They are good enough to plan with and not good enough to act on. Section 3 ends
with the exact list of questions to put to a lawyer, and no dollar should change
hands before that list comes back answered.

Where a number came from a file I actually computed over, it is marked
**[MEASURED]**. Where it is mine, **[ASSUMPTION]**. Where I do not know,
**[NOT ESTABLISHED]** plus what would settle it.

---

## 1. The one-sentence version

**Tell a homeowner for free whether their denial was wrong, take the ones that
were on contingency, and charge the statutory maximum of 10% of what we add.
Which means the whole business is roughly twenty to forty claims a month, and
the whole risk is that you cannot legally do any of it without a licence.**

---

## 2. Why this one is not first

The portfolio README calls Overturn the **strongest money** of the seven, and
that is right on the demand side. It is also the only one of the seven with a
licensing statute pointed straight at the wrong version of it.

| | Overturn | Counterweight |
|---|---|---|
| Buyer known by name | No — homeowners, reachable only at the moment of denial | **Yes — 1,708 Texas licensees, 1,203 Florida firms** [MEASURED] |
| Regulatory exposure | **Licensing. Acting as a public adjuster unlicensed is prohibited and enforced in both launch states; Illinois flags criminal exposure explicitly** [criminal grading in Texas NOT ESTABLISHED — check Tex. Ins. Code ch. 4102 subch. E] | None — software sold to licensed professionals |
| Cash timing | **Paid on settlement, months after the work** | Paid monthly, in advance |
| Working capital needed | **Real, and unquantified** | Effectively none |
| Founder is the constraint | **Yes — one licensed human, one set of hours** | No — software scales |
| Time to first revenue | **Four to eight months** [ASSUMPTION — see 7.4] | Weeks |

**The honest sequencing verdict: Overturn is a second business, funded by the
first one.** A contingency practice collects nothing until claims settle, the
founder has under $1,000, and the licence alone takes weeks. Starting Overturn
cold means working four to eight months unpaid. Starting it on top of
Counterweight's monthly revenue means the cash lag is an inconvenience instead
of a wall.

That is not a reason to skip it. It is a reason to run section 7's licence track
now. It is cheap and slow. And open the practice when there is money
underneath it.

---

## 3. The licensing structure, decide this before anything else

The owner is not a licensed public adjuster. In Texas and Illinois, negotiating
or settling an insurance claim on behalf of a policyholder for compensation is
licensed activity, and doing it unlicensed is enforced. This section is longer
than any other because it decides whether there is a business at all.

### 3.1 What the two launch states actually say

| | Texas | Illinois |
|---|---|---|
| Licence required to act, advertise or solicit as a public adjuster | Tex. Ins. Code ch. 4102 | 215 ILCS 5, Art. XLV |
| **Fee cap, residential** | **10% of the amount of the insurance settlement** — § 4102.104 | **10% of total payments on the claim** where the property is a personal residence |
| Contract | **Must be on a form approved by the commissioner — TDI form FIN535, unmodified.** Must carry a 72-hour rescission right and the notice **"WE REPRESENT THE INSURED ONLY"** in 12-point boldface | IDOI publishes a public adjuster contract review checklist, which implies contract-form review. **[UNVERIFIED — confirm whether IL contracts must be filed or approved]** |
| **Paying an unlicensed person for a referral** | **Prohibited.** § 4102.160 — a licence holder may not pay, directly or indirectly, a fee, commission or other valuable consideration to a non-licensee for the referral of an insured | **Prohibited.** IDOI Company Bulletin **2026-02**, issued **26 January 2026** |
| **Accepting a referral fee** | **Prohibited.** § 4102.164 — a PA may not accept consideration for referring an insured to a contractor, attorney, appraiser, umpire or salvage company | Covered by the standards-of-conduct provisions |
| Bond | **$10,000** | **$50,000** (raised from $20,000 effective 1 Jan 2024) |
| CE | Standard adjuster CE | **24 hours every two years, including 3 hours ethics** |
| Entity licence available | Yes — resident agency licence, $50, requires a designated responsible licensed producer who holds a Texas PA licence, SOS registration, bond in the agency's name, **no DBAs accepted** | Yes — business entity licence with a DRLP holding an active PA licence |

**Illinois Bulletin 2026-02 is the single most important document in this plan
and it is seven months old.** It says a licensed public adjuster may not use a
third-party lead generator. A roofer, a contractor, or a standalone lead-gen
firm. Unless that third party is itself licensed as an Illinois public
adjuster, and that **any compensation or "thing of value" tied to those leads
triggers the licensing requirement**, expressly including indirect value such as
shared ownership, shared expenses, or the third party benefiting from a larger
claim payment. Consequences named: licence discipline, **void and unenforceable
public adjuster contracts**, and criminal exposure.

Texas gets to the same place by statute rather than bulletin: § 4102.160 makes
the payment itself unlawful from the adjuster's side.

**This kills the structure the brief assumed.**

### 3.2 The three structures, worked through

#### (a) Partner, where the licensed adjuster contracts and Overturn supplies software plus lead flow for a fee that is not a share of the claim

**Verdict: not available in either launch state in the form described. Do not
build it.**

The fee's *shape* was never the problem. Making it a flat fee rather than a
percentage does not help, because neither state's prohibition is written in
terms of percentages. Texas § 4102.160 bars "a fee, commission or other valuable
consideration" paid "directly or indirectly" to a non-licensee "for the referral
of an insured." Illinois CB 2026-02 bars "compensation or thing of value" tied
to the lead, and reaches indirect value explicitly.

A flat monthly fee paid by an adjuster who is simultaneously receiving a stream
of homeowners from that same vendor is exactly the arrangement the Illinois
bulletin describes. Calling it a software subscription is a label, and the
bulletin pre-empts the label by reaching indirect value and shared economics.

Two survivable fragments of (a) are worth naming, because they are not the same
thing:

1. **Software with no lead flow at all.** Legal, and it is Counterweight. See (c).
2. **Employment or a genuine service contract with a licensed adjuster where
   you do the non-licensed work**, document assembly, research, drafting, under
   their supervision, paid as wages or a flat service fee, with **no client
   origination and no share of the claim.** This is probably lawful and it is
   also not a business; it is a job. It is, however, an excellent way to learn
   the trade in the months while the licence is pending, and it is worth doing
   for that reason alone. **[NEEDS LAWYER, the line between permitted
   back-office support and unlicensed adjusting is exactly what the statute is
   ambiguous about.]**

**One more trap, since it is the most common one in this industry and it is the
reason both rules exist: never take a contractor or roofer lead, and never give
one.** The economics look obvious. A roofer meets the homeowner first, and it
is precisely the arrangement Illinois wrote a bulletin about in January and
Texas made a statute about years ago.

#### (b) Become licensed

**Verdict: recommended. Texas only. Illinois deferred.**

| | Texas | Illinois |
|---|---|---|
| Pre-licensing education required | **No** — a TDI-approved course is optional; the exam is the gate | **No** — no pre-education proof required to sit the exam |
| Exam | ~$39–49, 100 questions, 120 minutes | **$92** (includes a $50 state administrative fee) |
| Licence fee | ~$50 | **$250**, by EFT at application |
| Fingerprints | ~$41 (IdentoGO) | ~$60 |
| Bond | **$10,000** — premium **[NOT ESTABLISHED]**, typically a small percentage of the penal sum | **$50,000** — premium quoted at **$350–$1,500/yr** depending on credit |
| **All-in first-year cost** | **~$130–140 in fees plus bond premium — plausibly under $400** | **$900–$2,000** |

**Texas licensure costs less than the legal review of the alternative.** That
is the finding that decides this section. The structure with the least
regulatory risk is also the cheapest one on the list, and it fits inside the
under-$1,000 budget with room for the lawyer.

**Illinois does not fit the budget on its own**, $900–2,000 before a single
claim, driven almost entirely by the $50,000 bond. Illinois also looks thin on
the supply side: of 1,708 active Texas public adjuster licensees, **14 are
resident in Illinois**; of 1,203 valid Florida public adjusting firms, **2 are
Illinois-based** [both MEASURED, from the files in `research/data/`]. Those are
weak proxies rather than a count of Illinois licensees, **[NOT ESTABLISHED:
the number of active Illinois public adjuster licences. The FOIA route in
`research/01-DATA-SOURCES.md` settles it in 21 working days for free, and it
should be sent this week regardless.]**

But a thin adjuster population in Illinois cuts both ways: fewer competitors for
the same denied claims. The reason to defer Illinois is cost and the January
bulletin's enforcement posture, not market size.

What licensure costs beyond money: an exam that is reportedly hard, a background
check, weeks of waiting, and CE forever. What it buys: you become the contracting
party, you keep the entire capped fee instead of splitting it, and **the whole of
section 3 stops being a risk.**

It also converts the second DoNotPay rule, *a licensed human in the loop, on the
file, paid*. From an overhead line into the founder. That is the cheapest
version of that rule available anywhere in this portfolio.

#### (c) Software only, sold to adjusters

**Verdict: already built. It is Counterweight, and it is the right first
business, but it is not Overturn.**

This is the fully compliant structure and it is why the portfolio README ranks
idea 5 above idea 2. It is worth naming what is given up by choosing it: the
homeowner never becomes your customer, the 10% never accrues to you, and the
44%-closed-with-no-payment asymmetry stays somebody else's to exploit.

### 3.3 The recommendation

**Get the Texas public insurance adjuster licence. Run Overturn in Texas only.
Defer Illinois until there is revenue and a bond that does not consume the
budget.**

Reasoning, shortest version:

1. Structure (a) is prohibited in both launch states in the form the brief
   assumed. This is not a grey area; Illinois wrote it down in January.
2. Structure (b) costs **under $400 in Texas**, less than the legal opinion
   needed to make (a) survivable, and (a) would still not survive it.
3. Structure (c) is a different business that already exists.
4. Licensure is the only structure where the founder controls the client
   relationship, and a contingency business that does not control the client
   relationship is a lead-gen business, which is the thing that is illegal.

### 3.4 What goes to the lawyer, before the first dollar

Budget **$2,000–4,000** for a Texas insurance-regulatory lawyer. This is the
first real cost of the business and it is not optional. Six questions, in this
order:

1. **Is the planned structure, sole licensee, own clients, TDI form FIN535,
   10% of the increase. Clean under ch. 4102?** Confirm § 4102.104's cap
   applies to the settlement total and whether charging only on the increase is
   permitted, preferred, or irrelevant.
2. **Where is the line between permitted back-office support and unlicensed
   adjusting?** Needed for the pre-licence period and for any future contractor.
3. **Does an unpaid, unreciprocated referral from a Counterweight customer
   create exposure under § 4102.160 or § 4102.164 for either party?** Including
   whether a software discount counts as consideration. Assume it does until
   told otherwise.
4. **Advertising.** What may the site say about outcomes, and what triggers TDI's
   advertising rules for adjusters?
5. **Post-catastrophe solicitation.** **[NOT ESTABLISHED, whether Texas
   restricts the timing or manner of solicitation after a declared catastrophe.
   Subchapter D of ch. 4102 is the place to look.]**
6. **Errors and omissions cover**. Is it required, and what does it cost?
   **[NOT ESTABLISHED.]**

**Write these six down and do not start until all six come back.** The plan below
assumes the answers are favourable. If question 1 comes back badly, the business
is (c) and this document is a record of why.

---

## 4. The customer, with real numbers

Overturn has two populations to count: homeowners with contested claims, and
licensed adjusters. Only one of them is countable from here.

### The homeowner, the buyer

| | |
|---|---|
| Five largest home insurers, share of 2025 claims closed with **no payment** | **44%**, up from **36%** a decade earlier |
| Large insurers closing **≥50%** with no payout | **15** |
| Worst named carrier | **78%** |
| Average water damage claim | **$15,400** |
| Water and freezing as a share of all homeowner claims | **23%** |
| Insured homes filing a water claim annually | **~1 in 60** |

**The caveat that must travel with the 44% everywhere it is used, including in
marketing:** "closed with no payment" also counts claims that fell below the
deductible and claims the homeowner withdrew. **Not all of them are wrongful
denials, and a business that implies they are is lying.** The defensible claim is
the trend: **36% to 44% in a decade is not explained by deductibles**, and a
withdrawn claim is frequently a homeowner who gave up.

That distinction is not pedantry. It is the difference between this business and
the storm chasers, and it should appear on the website in those words.

**[NOT ESTABLISHED: the number of homeowner property claims filed in Texas
annually, and the number denied.** What would settle it: the NAIC Consumer
Information Source complaint index by carrier
(`content.naic.org/cis_consumer_information.htm`) and TDI's complaint data
(`tdi.texas.gov/consumer/complfrm.html`), both named in
`research/01-DATA-SOURCES.md` and both currently blocked from this environment.
**This is the single biggest unmeasured number in the plan**, every volume
figure in section 7 is a capacity calculation, not a demand estimate.**

### The licensed adjuster, the competitor and possibly the referrer

From the Texas Department of Insurance file, recomputed 2026-08-31 [MEASURED]:

| | |
|---|---|
| Active Texas public adjuster licences | **1,708** |
| Texas-resident | **981** |
| Houston / San Antonio / Dallas / Fort Worth (resident) | **112 / 40 / 37 / 36** |
| Resident in Florida, licensed in Texas | **293** |
| Resident in Illinois, licensed in Texas | **14** |
| New licences issued 2024 / 2025 | **323 / 274** |
| Entity-style names in the active file | **0** — this file is individuals only |

**Read that as competitive supply, not partner supply.** Under structure (b),
these 1,708 people are the incumbents Overturn takes claims away from. The
597 who licensed in 2024–25 are the ones building a book right now.

**The gap they leave is the whole opportunity.** A public adjuster earning 10% of
a settlement has an economic floor below which a claim is not worth their time,
and that floor is set by how many hours the file takes. **[NOT ESTABLISHED:
where that floor sits. The number most often quoted informally is around
$10,000 of claim value, and I have no source for it, so it is not stated as a
figure here. What would settle it: ask ten of the 112 Houston licensees what
their minimum claim size is. That is a ten-conversation research task, not a
survey.]**

If the reading is free, the floor moves down. That is the innovation and it is
the only durable reason a homeowner picks Overturn over the adjuster down the
road.

---

## 5. The relationship to Counterweight: advantage or conflict

The brief calls Counterweight and Overturn "natural siblings." Having worked
through the licensing, that is only half true, and the untrue half matters more.

**The overlap is exact.** Counterweight's two best lists are 1,708 Texas public
adjusters and 1,203 Florida public adjusting firms. Under structure (b), those
same people are Overturn's direct competitors for the same homeowners.

### Where it is a genuine advantage

- **Domain knowledge with a feedback loop.** Counterweight's users are working
  real files. The failure modes they report are the same failure modes Overturn's
  own practice will hit, six months earlier and at no cost.
- **The engine is one engine.** The policy-versus-denial-letter comparison is the
  same build. Overturn is Counterweight's engine with a different customer at the
  front. **That halves the build and it is the strongest argument for the pair
  existing at all.**
- **Counterweight's cash funds Overturn's lag.** Section 2's sequencing verdict.
- **Counterweight's SEO already ranks a denial-letter guide** for exactly the
  query a denied homeowner types. That page currently sends adjusters to
  Counterweight; it can send homeowners to Overturn.

### Where it is a real conflict

- **You would be competing with your own paying customers, for revenue, in their
  own state.** No framing survives that being discovered.
- **The community is small and it talks.** Counterweight's own plan says so
  about the 1,203 Florida firms in three counties: *"a community of 1,203 firms
  in three counties talks to itself."* The same is true of 112 adjusters in
  Houston.
- **A referral loop between them is legally loaded.** The obvious move. Counterweight customers send Overturn the small claims they decline, runs
  straight into Texas § 4102.164 on the referring adjuster's side and § 4102.160
  on Overturn's, if anything of value flows in either direction. **A software
  discount is a thing of value.** Question 3 to the lawyer exists for this.

### The verdict

**It is a conflict, and Counterweight is the more valuable business, so Overturn
must be built so that it does not take a claim a Counterweight customer would
have taken.**

That is not a compromise; it is the same sentence as the brief's own innovation.
**Overturn's mandate is the claims public adjusters decline**, the ones under
their economic floor. Stated as a rule and published on both sites:

> Overturn takes claims that public adjusters turn down. If a licensed adjuster
> in your area will take your claim, hire them. They will do a better job on a
> large loss than we will, and we will tell you so.

**Three operating consequences, all of which cost money:**

1. A stated claim-size ceiling above which Overturn declines and refers out. For free, with no payment or benefit in either direction.
2. **Disclose the common ownership on both sites, in plain words, before anyone
   asks.** In a community this small, being discovered is worse than being known.
3. Section 7.3 shows the arithmetic problem this creates: **the claims adjusters
   decline are the claims where 10% does not pay.** That tension is not resolved
   in this plan. It is the thing the first six months has to answer.

---

## 6. Positioning

**Overturn is the second opinion on your denial, and it is free.**

Against the four things a denied homeowner actually does:

| Alternative | Why they leave it |
|---|---|
| **Accept the denial** | This is what most of them do and it is the real competitor. There is no fee to beat and no salesperson to out-argue — only the belief that nothing can be done. Overturn wins by making the answer free and specific. |
| **Hire a public adjuster** | They will not take a $9,000 claim, and the homeowner often does not know they exist. Overturn wins only on the claims below the adjuster's floor — and says so out loud. |
| **Hire a lawyer** | 33–40% contingency, and worth it on a large or bad-faith loss. Overturn is not a substitute and must refer out rather than compete. |
| **Appeal it themselves** | Free, and occasionally works. Loses on knowing which clause to cite and which deadline is running. |

**The line that does the work:** *we will tell you free whether your denial was
wrong. Including when it was right, in which case you owe nothing and we are
finished.*

**Being willing to say the denial was correct is the entire brand.** It is the
one thing no storm chaser will ever say, it is checkable, and it is the reason
the decline rate is a published metric in section 9 rather than an internal one.

**What we never say:** that we are lawyers; that we guarantee anything; that
insurers are denying claims with AI to cheat people (the 44% figure does not
support it and the caveat in section 4 is why); that we work for anyone but the
insured. The TDI contract form already carries **"WE REPRESENT THE INSURED
ONLY"** in boldface. That is the state's own sentence and it should be the
site's too.

---

## 7. Pricing, and the correction to the brief

### 7.1 The correction

`ideas/02-claim.md` models 15% and 20% contingency fees. **Both are unlawful in
both launch states for a personal residence.** Texas caps a public insurance
adjuster's total commission at **10% of the insurance settlement** (§ 4102.104).
Illinois caps compensation at **10% of total payments** where the damaged
property is a personal residence.

The 10–20% range in the thesis is a national range. It is real, Florida allows
20% outside a declared emergency. But **it is not available in Texas or
Illinois at all**, and the entire money section of the brief is built on rates
that cannot be charged here.

**Every figure below is recomputed at 10%.**

### 7.2 What Overturn charges

| | |
|---|---|
| Denial review | **Free. Always. Including the answer "the denial was correct."** |
| Contingency | **10% of the increase we recover.** Statutory maximum, and the only fee. |
| If we recover nothing | **Nothing.** |
| Upfront, admin, file or "processing" fees | **None, ever.** These are the predator's markers and the absence of them is a positioning asset. |
| Money the insurer had already offered before we arrived | **Never charged on.** |

**That last line is a deliberate margin sacrifice and it should be understood as
one.** The statutes appear to permit charging on the settlement total. Charging
only on the increase costs real money on every partially-paid file. It buys a
sentence that cannot be attacked, *you pay a tenth of what we add, and nothing
on what you already had*. And in a category with predators in it, an
unattackable fee structure is worth more than the margin.

**On post-catastrophe fee compression. The brief flags this and it turns out to
be a Florida problem, not a Texas or Illinois one.** Florida drops 20% to 10% for
claims arising from a declared emergency. **Texas and Illinois are already at 10%
in all conditions for a residence**, so a declared catastrophe changes the fee by
nothing. The post-catastrophe risk in the launch states is real but it is a
different risk: solicitation rules, competition, carrier delay, and the
reputational hazard of being one more van in a flooded neighbourhood. See risk 3.

### 7.3 Unit economics, and the volume this implies

| Basis | Fee | Files for $30,000/month | Per year |
|---|---:|---:|---:|
| 10% of a **$15,400** average water claim, denied outright (recovery = settlement) | **$1,540** | **20** | 234 |
| 10% of an **$8,000** uplift **[ASSUMPTION]** | **$800** | **38** | 450 |
| 50/50 blend of the two | $1,170 | **26** | 308 |
| 10% of a **$6,000** small claim — the ones adjusters decline | **$600** | **50** | 600 |
| 10% of a **$4,000** uplift — if the assumption is half wrong | **$400** | **75** | 900 |
| Under a 50/50 split with a partner adjuster (structure (a), if it were legal) | $585 blended | **51** | 616 |

**The brief said 13–25 claims a month. At the lawful fee it is 20–38, and on the
small claims that are supposed to be the entire opening it is 50.**

**The $8,000 uplift is mine and it is unsourced.** It is the number this model is
most sensitive to. The table above moves from 20 files a month to 75 on that one
figure. And establishing it from real settled files is the first job of the
practice, not a later refinement.

**The constraint that is not in the table: hours.**

| | |
|---|---|
| Files needed at the blend | **26/month** |
| Licensed-human hours available, solo, realistically | **~120–140/month** [ASSUMPTION] |
| Therefore maximum hours per file | **~4.6** |
| Actual hours per file | **[NOT ESTABLISHED — measure from file one. It is the second most important number in this business after the uplift.]** |

**If a contested claim takes a licensed person more than about four and a half
hours end to end, a solo Overturn cannot reach $30,000 a month at a 10% cap.**
That is arithmetic, not pessimism, and it has three exits: the AI genuinely takes
the file under four hours; the average claim is much larger than $8,000; or a
second licensed person joins. Which is a hiring plan, not a solo business.

**Fixed costs are near zero and are not the problem.** Bond premium, domain,
inference **[NOT ESTABLISHED, plausibly $3–15 per file, but no measurement
exists]**, and E&O if required. The business breaks even on its second settled
file. **Cash timing is the problem, and it is section 7.4.**

### 7.4 The cash lag, which Counterweight does not have

A contingency practice is paid **when the claim settles**, not when it is signed.

**[NOT ESTABLISHED: how long a contested Texas residential property claim takes
from engagement to payment.** What would settle it: ask the ten Houston adjusters
from section 4 the same time they are asked about their floor. **Until it is
known, assume months rather than weeks.]**

The consequence, stated plainly: **files signed in month 1 pay in month 5 or
later, so the first four to eight months produce work and no money.** With under
$1,000 and no capital, that period has to be funded by something else, which is
the sequencing verdict in section 2, arriving from a second direction.

---

## 8. Go to market, $0 and legal

### Channel 1. The free denial review (primary, and the product is the funnel)

Upload the denial letter and the policy, get back a specific answer: **which
provision the carrier cited, what that provision actually says, and whether the
two agree.** Free, no account, no call.

**This is simultaneously the acquisition channel, the qualification filter and
the measurement instrument for section 9.** Every review produces a graded
prediction; a subset become files; the files produce outcomes; the outcomes
produce the accuracy number. That loop is exactly what the FTC found DoNotPay
never built.

**Do not run it before the licence is in hand.** In Texas, advertising or
soliciting as a public adjuster without a licence is itself the violation, and a
free service offered as the front door to a contingency practice is soliciting.
**[NEEDS LAWYER. Question 4.]** Until then it can run as pure information with
no offer to take the case, and that distinction is precisely the one to have
written down by someone qualified.

### Channel 2. Search, on the exact denial query

Counterweight's site already publishes a guide on reading an insurance denial
letter, built on the same platform in `platform/`. **A homeowner-facing sibling
costs one build and reuses the whole toolchain.**

Intents worth owning, all high-purchase-intent and low-competition:

- "insurance denied my water damage claim"
- "what does [exclusion name] mean in my policy"
- "insurance company underpaid my roof claim"
- "how long does my insurer have to pay my claim in Texas"
- "do I need a public adjuster for a small claim", this one is the position

**The guide is the acquisition engine, not the pricing page.** A homeowner who
finds a genuinely useful explanation forms an opinion about who wrote it, and
that is the whole mechanism.

### Channel 3. Attorneys who decline small property cases

A property-damage lawyer on a 33–40% contingency turns down claims below their
own floor constantly. Those are Overturn's files exactly.

**Unpaid and unreciprocated only.** Texas § 4102.164 prohibits a public adjuster
from *accepting* consideration for referring an insured to an attorney, and
§ 4102.160 prohibits *paying* an unlicensed person for a referral in. **Nothing
of value moves in either direction, ever, including reciprocal referral
promises.** [NEEDS LAWYER, question 3.]

### Channel 4. Counterweight customers who decline files

Same rule, same statutes, same lawyer question. Read section 5 before using this
channel at all; it is the one with the conflict in it.

### Channel 5. Being present where people are already asking

`r/InsuranceClaims`, `r/HomeownersInsurance`, BBB complaint threads, state
consumer forums. **Answer questions properly and do not pitch.** One correct,
detailed answer to a stranger's denial question is worth more than a hundred
impressions, and it is the only free channel that scales with effort rather than
money.

### Channel 6. After a catastrophe

**The highest-volume moment and the highest-risk moment in this business, and the
rules come before the plan.**

- **Nothing goes out until section 3.4 question 5 is answered.**
- **No door-knocking. No storm lists. No vans. No signage in affected
  neighbourhoods.** Not because they are all unlawful, some may not be, but
  because they are indistinguishable from the behaviour of the people this
  business exists to be the opposite of.
- What is legitimate: having the guide, the free review and the honest position
  already published *before* the event, so that a homeowner searching at 11pm
  three days later finds something useful.

### What we are NOT doing

- **No paid leads from contractors or roofers, ever.** Texas § 4102.160,
  Illinois CB 2026-02. This is the single most common structure in the industry
  and it is prohibited on both ends.
- **No paid lead-gen firms.** Same rules, same reason.
- **No paid advertising.** No budget, and paid acquisition on grief keywords is
  the exact behaviour that makes this category disreputable.
- **No outcome guarantees, no "we beat insurers", no percentage-won claims
  without published measurement behind them.**
- **No taking a file we do not think we can improve**, however much the homeowner
  wants us to.

---

## 9. The 90-day plan

### Days 1–30. Two tracks, neither of which earns anything

| | |
|---|---|
| **Goal** | Licence application filed; engine measured |
| **Track A — licence** | Book the Texas PA exam. Get the $10,000 bond quote. IdentoGO fingerprints. Register the entity with the Texas SOS if using an agency licence — **no DBA, TDI does not accept them.** |
| **Track B — measurement** | 20 real denial letters with their policies, from public consumer-complaint threads and law-firm example pages. Run the engine. **Grade every finding against a licensed adjuster's read.** This is the same gate as Counterweight day 1–30 and it can be the same 20 documents. |
| **Track C — lawyer** | Send the six questions in 3.4. |
| **Ship** | An accuracy number; an exam date; six answers |
| **Spend** | Exam ~$49, prints ~$41, licence ~$50, bond premium [NOT ESTABLISHED], lawyer $2,000–4,000, domain ~$12 |
| **Gate** | **No client contact of any kind. Not one free review offered to a real person.** |

### Days 31–60. Licence, then five files for free

| | |
|---|---|
| **Goal** | Licensed; five real files taken at no fee |
| **Do** | Pass the exam, post the bond, receive the licence. Then take **five files at zero fee**, on the TDI FIN535 form, with written consent to publish anonymised outcomes. Track hours per file to the quarter-hour. |
| **Why free** | Five outcomes are worth more than five fees. **They are the evidence DoNotPay never bought**, and until they exist there is no honest sentence to put on the website. |
| **Ship** | Five files open, hours-per-file data, the first real uplift figures |
| **Gate** | **If the licence does not issue, stop. There is no fallback structure — see section 3.** |

### Days 61–90. First paid files, first published numbers

| | |
|---|---|
| **Goal** | 10 paid files signed; the free review live |
| **Do** | Publish the free denial review with the lawyer's sign-off on its wording. Publish the guide. Open channels 3 and 5. Publish whatever the first five files actually produced, including the ones that recovered nothing. |
| **Ship** | 10 signed files, one published outcomes page with real numbers, decline rate stated |
| **Note** | **Signed is not paid.** Expect little or no cash inside 90 days. |

### Month 12, what the arithmetic actually says

Take the blend of $1,170 per settled file from 7.3, files ramping from 5/month at
month 4 by roughly +2/month, and a settlement lag of six months [ASSUMPTION
throughout]: **signed volume reaches roughly 21 files a month around month 12,
which is about $24,500 a month of eventual fee value, but the cash arriving in
month 12 is what was signed in month 6, which is closer to $10,000.**

**So the honest twelve-month target is about $10,000 a month collected against
$25,000 a month signed, and $30,000 collected lands somewhere past month 18**.
And that is on the favourable side of every assumption in this document.

**The cell that decides it is hours per file**, exactly as churn was the deciding
cell for Counterweight. At 4 hours a file the solo ceiling is roughly 30–35
files a month and the target is reachable. At 8 hours it is 15–17, the ceiling is
about $18,000 a month, and **the business never reaches $30,000 no matter how
long it runs.** That single comparison is the whole risk.

---

## 10. Metrics

| Metric | Target | Why it is the one that matters |
|---|---|---|
| **Findings confirmed by a licensed read** | **>85%** | The product's whole claim. Same gate as Counterweight, same reason. |
| **Decline rate — reviews where we say the denial was correct** | **>25%** | **The integrity metric.** A service that never says no is not a second opinion, it is a sales funnel. Published. |
| False positives per review | **<1** | We are advising a homeowner directly. A wrong "you were cheated" is worse than a miss. |
| **Recovery rate on accepted files** | **>60%** [target, not evidence] | Whether the selection is any good |
| **Average recovery per settled file** | Establishes the $8,000 assumption | The number the entire model rests on |
| **Hours of licensed time per file** | **<4.5** | The solo ceiling. Section 7.3. |
| Median days, signed → paid | Establishes the cash lag | Determines whether this is fundable at all |
| **Complaints to TDI** | **0**, tracked and stated | In this category the first upheld complaint is terminal |
| Fee charged as % of recovery | **≤10%, always** | Statutory. Audited monthly against every file. |

**The first two are tracked from file one and published**, including the files
that recovered nothing. That is the direct lesson of the FTC order: DoNotPay was
not punished for a bad product, it was punished for **never testing whether its
service worked** and advertising anyway. Paying **$193,000** in February 2025 for
that omission is cheap information and this business should take it for free.

---

## 11. Legal posture

**What Overturn is:** a licensed Texas public insurance adjuster, representing
insureds only, on the commissioner-approved contract, for a fee capped by
statute.

**What it is not, in the terms and on the site:** a law firm, a lawyer, a
provider of legal advice, an insurance company, or anyone's guarantee.

| Exposure | Handling |
|---|---|
| **Unlicensed public adjusting** | Hold the Texas licence before any client contact. This is the whole of section 3 and it is non-negotiable. **[NOT ESTABLISHED: the penalty grading in Texas. It does not change the decision, only how bad the downside is.]** |
| **Contract form** | TDI **FIN535**, unmodified. 72-hour rescission. **"WE REPRESENT THE INSURED ONLY"** in 12-point boldface, as the statute requires. |
| **Fee cap** | 10%, charged on the increase only. Audited monthly. |
| **Referral payments** | None paid (§ 4102.160), none accepted (§ 4102.164). No contractor leads, no lead-gen firms, no reciprocal arrangements, no discounts as consideration. |
| **Illinois lead generation** | CB 2026-02, 26 Jan 2026. Illinois is deferred; if it opens, this bulletin governs and it reaches indirect value. |
| **Unauthorised practice of law** | A public adjuster may negotiate a claim; only a lawyer may advise on legal rights or handle litigation. **Know where appraisal ends and bad-faith litigation begins, and refer out at that line.** |
| **FTC deceptive claims** | No guarantees. No unbacked accuracy claims. Every published number reproducible from the file log. The 44% figure always carries its caveat. |
| **Client confidentiality** | Policies and claim files are sensitive. Encrypted, never used for training, deleted on request. |
| **Bond and E&O** | $10,000 bond required. E&O **[NOT ESTABLISHED]** — question 6. |
| **The Counterweight disclosure** | Common ownership stated plainly on both sites. Section 5. |

---

## 12. Risks, ranked by what actually kills it

**1. The cash lag against no capital.** Files signed today pay in months. The
budget is under $1,000. **This is the most likely cause of death and it has
nothing to do with whether the product works.** *Mitigation: build Counterweight
first and run Overturn on top of it. There is no other mitigation available at
this budget.*

**2. The $8,000 uplift is wrong.** At $4,000 the model needs 75 files a month,
which one licensed person cannot carry. **The number is unsourced and everything
depends on it.** *Mitigation: the five free files in days 31–60 exist to measure
exactly this, before any pricing is published.*

**3. Reputation.** Post-disaster claim assistance contains genuine predators, and
being mistaken for one is fatal, not gradually, but immediately, because the
first thing a homeowner does is search the name. *Mitigation: the free honest
answer including "the denial was correct"; a published decline rate; no
door-knocking; no upfront fees; the fee charged on the increase only. **Every one
of these costs money and every one of them is the product.***

**4. The conflict with Counterweight.** Competing with your own customers, in a
professional community that talks. *Mitigation: the declined-claims mandate and
proactive disclosure in section 5, which also caps Overturn's claim size and
therefore its revenue per file. The mitigation and risk 2 pull against each
other, and that is unresolved.*

**5. Hours per file.** The founder is the licensed human and there is one of him.
Above ~4.5 hours a file the target is unreachable solo. *Mitigation: measure from
file one; if it is over, the answer is a second licensed adjuster, which changes
the business.*

**6. Regulatory change.** Illinois issued a bulletin in January 2026 that
eliminated the industry's most common structure overnight. Texas can do the same.
*Mitigation: none available. Watch TDI bulletins; keep the structure simple
enough that a rule change does not invalidate the contracts already signed.*

**7. Carriers deploy counter-AI.** 65% of insurers plan scaled AI claims agents in
2026, resolving 75% faster at 30–40% lower cost. This becomes an arms race
against better-funded opponents. *Mitigation: the asymmetry works both ways, a
faster, cheaper carrier process is also a more consistent one, and consistency is
easier to argue against than a human's discretion. This is a hope, not a plan.*

**8. Illinois is effectively closed at this budget.** $900–2,000 to enter, plus a
January bulletin signalling active enforcement, plus **[NOT ESTABLISHED]** supply.
*Mitigation: defer, and send the FOIA request now so the decision is informed
when the money exists.*

---

## 13. Kill criteria

Written now, while it is cheap to be honest.

| By | If | Then |
|---|---|---|
| Day 30 | The lawyer says structure (b) as described is not clean | **Stop.** The business is Counterweight. This document is the record of why. |
| Day 30 | Findings confirmed by a licensed read are **below 70%** | **Stop.** Do not offer a review to a real homeowner. |
| Day 60 | The licence does not issue | **Stop.** Section 3 is exhaustive: there is no compliant fallback for Overturn as a contingency service. The fallback is Counterweight. |
| Day 90 | **Fewer than 5 signed files** from the channels in section 8 | The channel does not work. Homeowner acquisition is the untested half of this business and this is the test. Rewrite once. |
| Month 6 | **Average recovery per settled file below $4,000** | The uplift assumption is half wrong. At a 10% cap the model does not close. Move upmarket — which puts you against Counterweight's customers — or stop. |
| Month 6 | **Hours per file above 8** | The solo ceiling is ~$18,000/month. Hire a licensed adjuster or stop. |
| Any time | **One upheld TDI complaint** | **Stop and fix before taking another file.** In this category reputation is the asset. |
| Month 12 | **Under $10,000/month collected** | The lag plus the cap means $30,000 is not reachable on this path. Fold the engine back into Counterweight. |

**The rule that makes these real: write the number down before the test, and do
not renegotiate it afterwards.**
