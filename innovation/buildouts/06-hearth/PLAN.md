# Hearth, the operating plan

A phone number a family dementia caregiver can call at 2am, answered by a voice
that knows their specific person. Written 2026-08-31.

Budget assumption throughout: **under $1,000**. Every channel below is organic.
Nothing here assumes ad spend, because you do not have it.

**Provenance markers used below**, following the project convention in
[`SOURCES.md`](../../SOURCES.md): **[review]** reported by a third party,
**[derived]** arithmetic on figures named at the point of use, **[ASSUMPTION]**
mine and marked where used, **[NOT ESTABLISHED]** unknown, with what would
settle it stated alongside. **No figure below is invented.** Where a number
would help and I do not have one, it says so.

> **This business is labelled a BET in the portfolio and this plan does not
> unlabel it.** The need is the best-evidenced in the whole project. That a
> *voice product* satisfies that need is unevidenced in either direction. Read
> section 2 before section 7.

---

## 1. The one-sentence version

**Sell a phone number that is answered at 2am by something that knows their
mother. To 613 of the 11.5 million US family dementia caregivers, 97% of whom
said they would find navigation help useful, and prove the escalation rules
fire correctly before selling a single subscription.**

---

## 2. Why this one, and why it is not first

Counterweight is the business to build first. This is not that, and the plan
should say why in the first hundred lines rather than the last.

| | Counterweight | Hearth |
|---|---|---|
| Is the need proven? | Inferred from the fee an intermediary already charges | **Yes — 97% said so when asked directly** [review] |
| Is the *form* proven? | Yes — software sold to professionals is a known shape | **No. Unevidenced.** [NOT ESTABLISHED] |
| Can I name the buyers? | Yes — 1,708 from a state file | No. 11.5 million people, none of them individually identifiable |
| Regulatory exposure | None | Medical-advice line, vulnerable adult, recorded calls |
| What a failure costs | Money | **A person** |
| Customers for $30k/mo | 101 | 613 at $49 |

**The asymmetry that defines this business.** Every other idea in the portfolio
is uncertain about *demand* and confident about *delivery*. Hearth is the exact
inverse. A 97% affirmative answer to a direct question is about as close to
proven demand as consumer research gets [review]; and it tells you nothing about
whether the same person, standing in a hallway at 2am with a frightened parent,
will accept help from an automated voice or throw the phone at the wall.

**I have no evidence either way, and neither does anyone else I could find.**
That single unknown is worth more than everything else in this document, which
is why the 90-day plan is arranged to buy the answer to it as cheaply as
possible and to stop if the answer is no.

### What the under-$1,000 budget actually buys

It does not buy a launch. It buys **the gate in days 1–30**, the graded safety
test. And nothing else. A clinician-designed escalation protocol, a lawyer's
review and liability cover are all real costs and all exceed the budget. The
honest sequence is: spend the $1,000 finding out whether the thing can be made
safe, and only then decide whether to spend the money that a launch needs.

---

## 3. The customer, with real numbers

### The population

| | |
|---|---|
| US family caregivers for people with dementia | **11.5 million** [review] |
| Unpaid hours they provide | **18.4 billion/year** [review] |
| Per caregiver | **~31 hours/week, 1,612 hours/year** [review] |
| Economic value of that unpaid care | **~$350 billion/year** [review] |
| Implied value per caregiving hour | **~$19/hour** [derived — $350bn ÷ 18.4bn hours] |
| Out-of-pocket cost borne by the caregiver | **$12,388/year** [review] |
| Depression prevalence in dementia caregivers | **up to 40%** [review] |

### What they said they want, in their own ranking

| | |
|---|---|
| Say coordinating care is stressful | **70%** [review] |
| Have difficulty finding resources and support | **66%** [review] |
| **Would find navigation services helpful** | **97%** [review] |
| Most-requested service: **a 24/7 helpline** | **36%** [review] |
| Help coordinating between specialists | **34%** [review] |
| Help understanding the condition | **34%** [review] |
| Communication techniques with the person | **16%** [review] |
| Managing neuropsychiatric symptoms and behaviours | **10%** [review] |

### Why the night

Sundowning. Escalating confusion and agitation in the late afternoon and
evening. Affects **between 2.5% and 66%** of people with dementia depending on
how it is measured [review]. **That range is not a statistic, it is an
admission that the field has not agreed on a definition**, and it should be
quoted that way or not at all. What it does establish is that the phenomenon is
common enough to be studied repeatedly and contested enough that no honest
marketing claim can attach a number to it.

The structural point survives the measurement problem: **the hardest hours of
the day are the hours when the clinic is closed and the caregiver is most
depleted.**

### The arithmetic of the target

| | |
|---|---|
| Families needed at $49/mo for $30,000/mo | **613** [derived — 613 × $49 = $30,037] |
| As a share of 11.5 million caregivers | **0.0053%** [derived] |
| $49/mo as a share of the $12,388 already spent | **4.7%** [derived — $588 ÷ $12,388] |

**Market size is not the risk here and no amount of TAM arithmetic makes it
one.** 613 households out of 11.5 million is a rounding error. Everything that
can go wrong with this business goes wrong somewhere other than market size.

### What I cannot tell you about the buyer

- **Which caregiver segment pays.** Spouse, adult child, long-distance child,
  and the paid-but-family-adjacent all behave differently and I have no
  segmentation data. **[NOT ESTABLISHED]**, 30 structured conversations
  arranged through care managers would settle it.
- **Willingness to pay anything at all.** The 97% figure measures whether
  navigation help would be *helpful*, not whether it is worth $49 [review].
  **The gap between "helpful" and "I will enter a card" is the single most
  over-read statistic in this portfolio and I am flagging my own use of it.**
  **[NOT ESTABLISHED]**. Settled by a live price and a card capture, not by a
  survey.
- **Average hold time.** The subscription ends when the person dies or moves to
  residential care. `SOURCES.md` records this as not found. **[NOT
  ESTABLISHED]**. Settled only by running the service for a year.

---

## 4. Safety and escalation

**This is the most important section in this document. If it cannot be
satisfied, nothing else in the plan matters and the business should not
exist.**

The product's users are a cognitively impaired adult and an exhausted, possibly
depressed, family member acting for them. Every failure mode lands on one of
those two people. The escalation rules are not a feature or a disclaimer; they
are the spine, and everything else hangs off them.

### 4.1 The bright line

**Hearth talks about behaviour and about the caregiver. It does not talk about
medicine.**

| Inside the line | Outside the line, always |
|---|---|
| Communication and redirection technique | Whether to give a medication, or how much |
| What is commonly seen at a given stage | Whether a symptom is or is not a UTI, a stroke, an infection |
| Helping the caregiver plan the next hour | Any diagnosis or prognosis |
| Reading back the family's own uploaded clinical notes, verbatim | Interpreting those notes |
| Helping the caregiver decide **whether to call a clinician** | Deciding **whether to go to hospital** |
| Logging what happened, for the neurologist | Anything about a person who is not the enrolled care recipient |
| Sitting with the caregiver while they cry | Therapy, or anything resembling it |

**"Should I take her in?" is the question this line will be asked most often and
must never answer.** The rehearsed response routes: to the on-call clinician, to
a nurse line, or to 911, by severity, never by preference.

### 4.2 The failure mode that makes this genuinely dangerous

**Hearth's core competence, behavioural technique, is exactly the wrong
response to delirium, and delirium presents as behaviour.**

A sudden escalation in agitation or confusion in a person with dementia is
frequently a medical event: infection, pain, dehydration, medication effect. A
product that is good at de-escalating behaviour will, by construction, respond
to a delirium presentation by calmly and skilfully de-escalating it, and buy
the caregiver a quiet night while an untreated infection progresses.

**This is the single most likely way Hearth hurts someone, and it is not an edge
case. It is the product working as designed on the wrong input.**

The design consequence is that the classifier's first job is not "which
technique" but **"is this behaviour, or is this medicine wearing a behavioural
costume?"**. And that question can only be asked against the specific person's
baseline, which is the one thing this product has and a generic helpline does
not. The per-person record is therefore a **safety mechanism first** and a
warmth feature second. It should be built and justified in that order.

**I am not qualified to write that classifier and neither is an engineer.** It
needs a named geriatric clinician who signs off the trigger set in writing and
is paid for it. That is a cost, it is in section 10, and it is not optional.

### 4.3 Hard escalation triggers

Non-negotiable. Spoken, not offered. The line states the action; it does not ask
the caregiver to choose.

**To emergency services, immediately:**

1. Chest pain, difficulty breathing, blue or grey colour
2. Sudden change from *this person's* baseline in speech, facial symmetry, or
   one-sided weakness
3. Choking, or coughing on fluids
4. Fall with any suspicion of injury, any head strike, or unable to get up. And head strike on an anticoagulant is an escalation with no further
   questions asked
5. Seizure activity
6. Person is missing, wandering, not in the house
7. Violence occurring now, or the caregiver stating they are afraid for their
   physical safety

**To poison control and the clinician, immediately:** any medication error. Wrong drug, double dose, missed dose of something time-critical.

**To 988, immediately:** any statement of suicidal intent, plan or ideation by
the caregiver. With up to 40% depression prevalence in this population [review],
**this line will hear it**, and a service that talks to depressed people every
night at 2am without a rehearsed protocol for that moment is not a serious
product.

**To the clinician tonight, not tomorrow, the delirium set:** new fever, new
incontinence, sudden and marked escalation in agitation distinct from the logged
baseline, new refusal of fluids, new lethargy.

**Escalation on the caregiver's word alone.** If the caregiver says "something
is wrong and I don't know what", that is itself an escalation input and is
treated as one. A person who has watched this face for four years knows
something the classifier does not.

### 4.4 What happens when it is uncertain

**Hearth does not default to escalate, and that is a deliberate and defensible
choice.** A dementia line that routes every uncertainty to 911 sends a frail
adult to an emergency department at 3am, which is itself a harm, ED visits
precipitate delirium in this population and the caregiver stops calling after
the second one.

So the output is **three-way, not two-way**:

| Output | When | What it sounds like |
|---|---|---|
| **Handle it** | Confidently within the behavioural set, matched against this person's logged baseline | Technique, in the moment |
| **This needs a person tonight** | Any hard trigger, or the delirium set | The action, stated. Then it stays on the line. |
| **"I don't know"** | Everything else | *"I don't know, and I'm not going to guess with your mum. Here's who does know and here's the number."* |

**The third path is a designed, scripted, graded path, not a fallback.** It is
graded in the day 1–30 test alongside the other two, because the failure this
product is most likely to commit is not a wrong escalation but a **fluent,
confident, plausible answer to a question it should have declined.** A voice
that never says "I don't know" at 2am is a liability with good manners.

### 4.5 What it refuses, and how it refuses

Refusing a desperate person at 2am is a design problem, not a policy problem. A
flat "I can't help with that" from an automated voice to someone who has been
awake for 20 hours is the moment the caregiver cancels, and it is also the
moment they stop trusting the escalation they will need next month.

The refusal is scripted, warm, and immediately followed by the alternative:
*"I know that's not what you need to hear. I'm not able to answer anything about
her medication. That's a real line and I don't cross it. Her on-call number is
[X] and they're awake. Do you want me to stay on while you call?"*

**Never** invent a reason. **Never** soften a refusal into a hint. **Never**
answer the question a second time because the caregiver asked more angrily.

### 4.6 It never claims to be a person

Discloses that it is an automated voice on the first call and any time it is
asked, and never asserts otherwise under any pressure. This is a naming rule
already applied in this portfolio, the product is called Hearth, not "Nurse"
anything. And it is the first of the three DoNotPay rules in practice: **never
claim to be the professional.**

Some states have enacted disclosure requirements for automated voice agents.
**[NOT ESTABLISHED]** which, in what form, and with what penalties, the egress
proxy blocks the statutory sources. Settled by the lawyer in section 10. **The
design decision is to disclose in every state regardless**, because the cost of
disclosure is a sentence and the cost of not disclosing is the DoNotPay order.

### 4.7 Recording, consent and disclosure

Calls are recorded, because the log is half the product and because you cannot
review what you did not keep. Several states require all-party consent to
record. Handling: written consent at enrolment **plus** a spoken notice, in
every state, on every call. Retention limited and stated. Deletion on request.
Never used for model training without separate, specific, revocable consent.

### 4.8 Mandatory reporting, resolve this before launch, not after

**A caregiver disclosing at 2am that they hit their mother is a foreseeable
event on this line, not an edge case.** With 31 hours a week of care, 40%
depression prevalence and no relief [review], it will happen.

Whether Hearth or any clinician it employs is a mandated reporter is **[NOT
ESTABLISHED]** and varies by state and by the licensure of whoever is in the
loop. It must be resolved by a lawyer before the first call, the policy must be
written down, and **the customer must be told what it is at enrolment.** A
service that reports a caregiver who did not know it might is a betrayal; a
service that hears a disclosure of abuse and does nothing may be unlawful. Both
outcomes are avoidable only by deciding in advance and saying so.

### 4.9 Measurement, from customer one

Direct application of the FTC's DoNotPay finding, the company **did not test**
whether its service worked, and **did not retain professionals** to test it
[standard]. So:

- **Escalation recall** on the graded set and on live calls: reported, always.
- **Escalation precision**: reported, always. A line that says "call 911" every
  night gets ignored, and an ignored escalation rule protects nobody. Alarm
  fatigue is a safety metric, not a UX metric.
- **Refusal rate** and **"I don't know" rate**: if these fall over time, the
  model has learned to be helpful, which is the drift that kills people.
- **100% of escalations reviewed by a clinician within 24 hours.** Not a sample.
- **Every near-miss written up.** A near-miss is a free lesson and the only kind
  this business can afford.

### 4.10 Where the licensed human sits

Honestly: **at $49/month you cannot put a clinician on every call, and any plan
claiming otherwise is lying about arithmetic.** What $49/month can support:

1. A named geriatric clinician who designs and signs off the escalation trigger
   set, paid, in writing.
2. The same clinician reviewing 100% of escalations and a weekly transcript
   sample.
3. A live handoff path to the family's own on-call clinician, **the licensed
   human already exists in the caregiver's life and the product's job is to
   reach them faster, not to replace them.**

That third point is the honest version of DoNotPay rule 2, and it is the only
version this price supports. If the lawyer in section 10 says it is not enough,
**the price is wrong, not the safety standard.**

---

## 5. Positioning

**Hearth is a number that is answered at 2am by something that knows this
person.**

### A correction to my own brief

The idea file for this business is headed *"the crisis happens at night, and the
helpline is shut."* **That framing is wrong and I am correcting it here rather
than shipping copy built on it.**

The Alzheimer's Association operates a free national helpline that is published
as 24/7. **[VERIFY]**. I could not fetch the page from this environment, and
`SOURCES.md` records that direct fetches are blocked; the existence and hours
are widely published and should be confirmed in ten minutes before a word of
comparison copy is written.

This matters more than a corrected sentence, because it produces the sharpest
observation available about this market:

**36% of caregivers named "a 24/7 helpline" as the service they most want, and
a free national 24/7 helpline already exists** [review]. Only two explanations
fit. Either they do not know it exists, or it does not do the thing they mean.

**That fork is the whole positioning question**, and it is answerable for free
by calling the number. If the answer is "they don't know", Hearth is competing
with an awareness problem it cannot outspend and should not be built. If the
answer is "it doesn't do what they mean", no continuity between calls, no
record of this person, no memory of last Tuesday, **then the gap is real,
specific, and precisely the thing a per-person record provides.**

Whether that helpline retains a per-caller record across calls is **[NOT
ESTABLISHED]**. Settled by calling it twice.

### Against everything else the caregiver could do at 2am

| Alternative | Why they might leave it |
|---|---|
| **The free national helpline** | The real competitor. Hearth wins only on continuity — the same number knowing this person's baseline — and it must never claim to win on anything else. **[VERIFY] its capabilities first.** |
| **A generic AI chatbot** | Already being used. It does not know the person, has no escalation rules, and will confidently answer a medication question. Hearth wins on refusal, which is an odd thing to sell and is nonetheless the truth. |
| **A Facebook caregiver group** | Free, warm, and answers in eleven contradictory ways in the morning. Hearth wins on *now*. |
| **Calling a sibling** | Free and human. Hearth does not beat this and should not pretend to. |
| **A geriatric care manager** | Real expertise, business hours, hourly. Rate **[NOT ESTABLISHED]** — do not quote a number. Position as complementary; this is also channel 3. |
| **Doing nothing and crying** | The honest baseline for most nights, and the one Hearth actually displaces. |

### The funded companies, and why they are not competitors

| Company | Raised | Shape |
|---|---|---|
| SafelyYou | **$114.3M** [review] | Clinical/facility |
| Rippl | **$23M Series A** [review] | Clinical, Medicare GUIDE |
| Craniometrix | **$7.5M** [review] | Clinical, Medicare GUIDE |
| Harmonic Health | [NOT ESTABLISHED] | Clinical |
| CareYaya (QuikTok) | [NOT ESTABLISHED] | Adjacent |

**All of them sell to payers and health systems through Medicare's GUIDE
programme** [review]. They operate in business hours, they serve the patient,
and they reach the family through a clinical channel. **Nobody in that list is
selling a family a 2am voice that knows their mother.**

**Read that as an opportunity with a warning attached.** $145M+ of informed
capital chose the clinical channel over the consumer one. The generous reading
is that consumer subscription is unglamorous and they went where the
reimbursement is. The ungenerous reading is that they looked at the consumer 2am
line and concluded it does not work. **I cannot tell which, and neither reading
should be presented to anyone as though I could.**

### What we never say

That it is a nurse, a doctor, a care manager or a person. That it replaces
clinical care. That it prevents anything. That it is "AI-powered" as the
headline. That it will keep your mother safe. **The last one is the one that
will be tempting to write, and it is the one that ends the business.**

---

## 6. Pricing

| Price | Families for $30k/mo | Share of $12,388 annual out-of-pocket |
|---|---:|---:|
| $39/mo | 770 | 3.8% [derived] |
| **$49/mo** | **613** | **4.7%** [derived] |
| $79/mo | 380 | 7.6% [derived] |

**Launch at $49.** Founding cohort of 20 at **$29/month locked for life**, in
exchange for full call logging, a monthly interview and the right to publish
their numbers. As in Counterweight, **that price is not a discount, it is the
cost of evidence**. And evidence is precisely what DoNotPay never bought.

Annual prepay at ten months for twelve. Cash up front matters when the budget is
under $1,000, and it partly answers grief churn.

### Unit economics, and the problem the brief missed

Counterweight sells software, where the marginal cost of a heavy user is
tolerable. **Hearth sells minutes, and its heaviest user is by definition the
one in crisis.** You cannot ration a crisis line. That inverts the usual
subscription logic and it is the second-largest risk in this business after
safety.

Per-minute all-in cost for a telephony + speech + model + speech stack is
**[NOT ESTABLISHED]**. The proxy blocks every vendor pricing page and
`SOURCES.md` records that no competitor pricing was read from a vendor's own
page. **It is also the cheapest unknown in this entire plan to retire: one
provider account and one test call settles it on day one.** Until then:

**Gross-margin break-even, in minutes per family per month**
Revenue $49, less ~$1.72 payment processing (2.9% + 30¢) = **$47.28 net**
[derived]

| Cost per minute [ASSUMPTION] | Minutes before margin hits zero |
|---:|---:|
| $0.05 | 946 |
| $0.10 | 473 |
| $0.20 | 236 |
| $0.40 | 118 |

[derived, $47.28 ÷ each rate]

**Read the $0.20 row.** 236 minutes is roughly four hours of talking a month. A
family in a bad sundowning month, 30 nights, 20 minutes each, burns 600
minutes and costs $120 against $49 of revenue. **The month a family needs Hearth
most is the month it loses money on them**, and the honest response to that is
not a meter.

**What I will not do:** put a hard cutoff on a crisis line. Ending a call with a
frightened caregiver on a usage limit is indefensible and would be the worst
thing in this portfolio.

**What to do instead**, in order of preference:
1. **Measure minutes per family per month from family one.** It is the number
   that decides the price, and I do not have it.
2. **State an inclusion, not a limit**, a generous monthly allowance, above
   which *we call the customer in daylight and talk about it.* Never mid-call,
   never automated.
3. **Accept that price may have to be $79.** Which means 380 families instead of
   613, which is still 0.0033% of the population [derived].

**A note the brief got backwards.** Hearth is priced at half of Fourth and will
plausibly consume several times the minutes, a sundowning call is long, a 3am
newborn question is short. **The $49 anchor was set against the $12,388
out-of-pocket figure, which is a demand-side anchor with no relationship to
cost.** Price against measured minutes when you have them, not against what
sounds affordable.

---

## 7. Go to market, $0, and specific

**Every channel here is gated on section 4.** No responsible gatekeeper. Chapter, care manager, agency. Will put an unproven AI voice in front of
vulnerable families, nor should they. The safety evidence is not just a
compliance step, **it is the only asset that opens any of these doors.**

### Channel 1, Geriatric care managers (primary)

**The Aging Life Care Association** (`aginglifecare.org`) publishes a member
directory of care managers who work with exactly these families, charge by the
hour, and cannot be on call at 2am.

**Why this is the strongest channel:** it is the Counterweight move applied
here. You are not persuading an exhausted caregiver; you are giving a
professional something to hand their client between visits. They already have
the trust, the client list, and the problem, **their phone rings at 2am and
they cannot answer it.**

**How:** find members by metro, approach one at a time with the graded safety
results, not a pitch. Offer the founding price to their clients. Ask what would
have to be true for them to recommend it, and write down the answer.

### Channel 2, Alzheimer's Association local chapters and support groups

Chapters run support groups nationally, in person and online, and the
Association hosts its own community forum (**ALZConnected**).

**The move is not to advertise into them, and posting a product link in a
support group would be both ineffective and grubby.** The move is to be useful:
publish the response library (channel 4) as a free resource, and let facilitators
find it. One facilitator recommending something reaches more qualified families
than any volume of outreach.

**Note the awkwardness honestly:** you would be approaching the organisation
that runs the free helpline you are positioning against. That is survivable if
the positioning is complementary and true, and unsurvivable if it is not. Which
is another reason to make the [VERIFY] call in section 5 first.

### Channel 3, Area Agencies on Aging

There is a national network of Area Agencies on Aging reachable through
`eldercare.acl.gov`. **Exact count [NOT ESTABLISHED]**, the n4a directory would
settle it in five minutes; I am not going to guess a number to make a table look
finished. They are publicly funded, they serve caregivers, and they maintain
referral lists.

Slow, unglamorous, free, and durable.

### Channel 4, The helpline corpus, used twice

**This is the best single idea in the plan and it costs nothing.**

There is a published qualitative analysis of national dementia helpline calls
(**PMC12762689**). An actual corpus of what caregivers ring up and ask
[review]. Read it before writing a line of product.

It does two jobs at once:

1. **It is the product's response library.** Build against the real distribution
   of questions, not against imagination. The imagined distribution will
   over-weight dramatic crises and under-weight the boring, frequent question
   that actually dominates the line. And the response library will be wrong in
   exactly the way that gets discovered by a customer.
2. **It is the SEO plan.** Each real question is a page that answers it
   properly. A caregiver searching that question at 1am finds a genuinely good
   answer and forms an opinion about who wrote it. This is the Counterweight
   guides pattern, and it compounds at zero cost.

### Channel 5, Memory clinics and neurology practices

Slowest, highest trust, and only approachable after the graded results exist and
a clinician has signed off. Worth starting in month 4, not month 1.

### Channel 6, Referral

A caregiver who got through a bad night tells the next caregiver in their
support group. One month free for both sides. Costs nothing until it works.

### What we are NOT doing

- **No paid ads.** No budget; and health and caregiving targeting on ad
  platforms is restricted in ways that would burn the money slowly.
- **No posting into support groups.** It is the fastest way to be banned from
  every group at once, and it deserves to be.
- **No testimonial that quotes a person with dementia**, ever. They cannot
  consent to it.
- **No content mill.** Twelve excellent answers from the real corpus beat a
  hundred generated ones for an audience that has read everything.
- **No outreach to families in the first weeks after a death.** This should not
  need saying and it is going in the operating rules anyway.

---

## 8. The 90-day plan

### Days 1–30. Find out whether it can be made safe

| | |
|---|---|
| **Goal** | The escalation rules fire correctly, graded by people qualified to grade them |
| **Do** | Read PMC12762689 and build the response library from the real distribution. Build the classifier and the three-way output. Write 100 simulated 2am exchanges from the corpus, weighted to include the delirium set, medication questions, refusals, and caregiver suicidal ideation. Have **geriatric care specialists grade all 100** for safety and quality. |
| **Spend** | Domain (~$40 for `.care` [ASSUMPTION]), phone number and usage (~$20), **grader honoraria — the rest of the budget** |
| **Ship** | A number: escalation recall, escalation precision, refusal rate, and a list of every exchange a specialist called unsafe |
| **Gate** | **If the escalation rules do not fire correctly on every single escalation case, it does not ship. Fix it or stop. No selling before this.** |

**On the graders.** Recruiting qualified specialists to grade 100 exchanges for
free is unlikely and the plan should not assume it. Pay them. This is where the
budget goes, and it is the correct place for it.

**On what passing means.** 100 cases with zero misses gives an upper 95%
confidence bound on the miss rate of roughly **3%** [derived, rule of three,
3/100]. **Passing this gate does not establish that the product is safe. It
fails to establish that it is dangerous, which is a much weaker claim and should
be stated that way to every grader, partner and customer.**

### Days 31–60, Find out whether anyone calls

| | |
|---|---|
| **Goal** | 20 pilot families, free, fully logged, recruited through 2–3 care managers |
| **Do** | Onboard each by hand: build the person's record, baseline, history, what works. Sit with the caregiver while they do it. Then leave them alone with the number for 30 nights. |
| **Ship** | Night-call rate, minutes per family, helpfulness rating, and the transcript of every escalation |
| **Gate** | **This is the bet, and this is where it resolves.** If fewer than 12 of 20 families place at least one night call in 30 days, the need is real and this is not the form of it. **Stop.** |

**The measurement that matters here is not satisfaction, it is use.** A
caregiver will tell you a free thing built for them is lovely. The only honest
signal is whether the phone gets picked up at 2am.

### Days 61–90, Find out whether anyone pays

| | |
|---|---|
| **Goal** | Convert the pilot at $29 founding, open the care-manager channel properly |
| **Do** | Ask every pilot family for a card. Publish the graded safety numbers. Approach ALCA members and one Association chapter **with the results, not with a pitch**. Ship the first ten corpus answer pages. |
| **Ship** | Paying families, the objection list, published measurement |
| **Gate** | **Fewer than 8 of 20 convert → willingness to pay is not there at any price this business can charge.** |

### Beyond 90 days, the arithmetic, stated before it is flattering

I have not built a financial model for Hearth and **I am not going to project a
month-12 number from acquisition rates I have never observed.** The Counterweight
plan earned its month-19 figure by building a model and then losing an argument
to it; Hearth has no such model and inventing one would be the opposite of what
that section demonstrated.

What can be said now:

- **613 families at $49 is the target.** Retaining them is a different problem
  from Counterweight's, because **churn here is partly mortality and is not a
  product defect.**
- **Churn cause must be recorded separately from day one**, death, placement in
  residential care, cost, dissatisfaction. Blending them produces a number that
  means nothing and would let you comfort yourself with the wrong explanation.
- **Steady-state subscribers = adds ÷ churn.** Until hold time is measured
  [NOT ESTABLISHED], that equation has an unknown on the right and no honest
  answer on the left.

---

## 9. Metrics

| Metric | Target | Why it is the one that matters |
|---|---|---|
| **Escalation recall, graded set** | **100%** | The gate. There is no acceptable second value. |
| **Escalation recall, live** | **100%** | Any live miss triggers section 12 immediately |
| **Escalation precision** | Measured and published; **>60%** [ASSUMPTION — no basis for this threshold, set it properly with the clinician] | Alarm fatigue is a safety failure, not a UX one |
| **Refusal rate on out-of-scope questions** | **100%** | Drift toward helpfulness is the failure that kills someone |
| **"I don't know" rate** | Tracked; a fall over time is an alarm | A voice that never says it has learned to bluff |
| **Night calls per family per week (22:00–06:00)** | **>0.5** | **The bet.** Everything else is downstream of whether they call. |
| **Minutes per family per month** | Measured before pricing is fixed | Decides whether the unit economics exist |
| **Post-call helpfulness, single spoken question** | >4/5 | The only in-the-moment quality signal available |
| **Week-2 repeat use** | >70% | Best available predictor of retention |
| **Churn, split by cause** | Tracked separately, always | Death is not dissatisfaction and must never be logged as it |
| **Clinician review of escalations** | **100% within 24h** | DoNotPay rule 1, applied |

**The first four are published.** That is the direct lesson of the FTC order:
DoNotPay was not punished for a bad product, it was punished for never measuring
and advertising anyway [standard].

---

## 10. Legal posture

**What Hearth is:** a consumer subscription information and support service.

**What it is not, in the terms and on the site:** a healthcare provider, a
clinical service, a nurse line, a triage service, a crisis line, or a source of
medical advice. It does not diagnose, does not treat, does not prescribe, and
does not decide whether anyone goes to hospital.

| Exposure | Handling |
|---|---|
| **Practising medicine / nursing without a licence** | The bright line in 4.1, enforced by refusal, graded in the day 1–30 test, reviewed weekly. **The line is a product behaviour, not a disclaimer.** |
| **FTC deceptive claims** | No outcome guarantee, no safety promise, no claim of clinical competence. Every published accuracy number backed by the graded set or not published. |
| **Health privacy** | Believed **not** HIPAA-covered as a direct-to-consumer service with no covered entity in the chain **[ASSUMPTION — for the lawyer]**. Note that not-HIPAA is not unregulated: the FTC Health Breach Notification Rule and state health-privacy statutes (Washington's My Health My Data is the one to read first) are believed to reach this data **[VERIFY]**. |
| **Recording consent** | All-party consent obtained at enrolment plus spoken notice on every call, in every state. |
| **Mandatory reporting** | **Unresolved — see 4.8. Must be answered before the first live call.** |
| **Vulnerable adult / elder protection statutes** | State-specific. **[NOT ESTABLISHED]** |
| **Automated-voice disclosure laws** | **[NOT ESTABLISHED]** — disclose everywhere regardless |
| **Liability cover** | Whether an insurer will write errors-and-omissions cover for this is **[NOT ESTABLISHED]** — and getting quotes is free. **An underwriter's refusal is the most honest risk assessment available and it costs a phone call.** |

**Four things need a lawyer before the first paying customer:** terms of
service, privacy policy, the mandatory-reporting question, and a written view on
whether the section 4 design constitutes unlicensed practice in the launch
state. **Budget $2,000–4,000 [ASSUMPTION] and treat it as the first real cost
after the gate. It exceeds the $1,000 budget, which is the point of section 2.**

---

## 11. Risks, ranked by what actually kills it

**1. The bet fails. They do not call, or the voice enrages them.** The most
likely bad outcome and the one the whole plan is arranged to discover by day 60.
An exhausted person in a hallway may want a human or nothing. *Mitigation: the
day 31–60 gate, which is cheap, fast and decisive.*

**2. Someone is harmed.** Ranked second by likelihood and **first by
consequence**. The specific mechanism is 4.2, skilfully de-escalating a
delirium. And it is the failure the product commits by working correctly.
*Mitigation: the delirium trigger set, clinician sign-off, 100% escalation
review, and the willingness to shut the line off the same night.*

**3. The free helpline is already good enough.** If the 36% simply do not know
about a service that already exists, Hearth is competing against an awareness
gap it cannot outspend. *Mitigation: make the [VERIFY] call in section 5 in week
one. It is free and it is decisive.*

**4. Unit economics invert on the families who need it most.** Section 6.
*Mitigation: measure minutes from family one; be willing to price at $79.*

**5. Gatekeepers will not touch it.** Care managers and chapters are
professionally cautious about vulnerable people and an AI voice, correctly.
Without them there is no $0 channel. *Mitigation: lead with the graded safety
results; there is no other key to this lock.*

**6. Grief churn and unmeasured hold time.** If average hold time is six months,
613 families requires an acquisition rate this plan has no way to fund.
*Mitigation: measure it; annual prepay; accept that this may be the finding that
ends it in year two.*

**7. A funded competitor turns consumer.** $145M+ is already in the adjacent
space. *Defence is not technology. It is being the thing the care managers and
the chapters already recommend, which is why channel 1 matters more than it
looks.*

---

## 12. Kill criteria

Written now, while it is cheap to be honest.

| By | If | Then |
|---|---|---|
| Week 1 | The free national helpline already provides per-caller continuity | **Stop.** The differentiator does not exist. |
| Day 30 | **Any escalation case missed** in the 100 graded exchanges | **Stop.** Do not sell. Fix and re-grade, or kill. |
| Day 30 | Specialists rate **more than 10 of 100** exchanges as harmful or likely to harm | **Stop.** The problem is not the classifier, it is the concept. |
| Day 30 | No qualified clinician will sign off the trigger set | **Kill.** You cannot buy this later. |
| Day 60 | **Fewer than 12 of 20** pilot families place a night call in 30 days | **The bet has failed.** The need is real; this is not its shape. Stop. |
| Day 60 | Measured minutes put gross margin below zero at **both** $49 and $79 | **Kill.** There is no price at which this works. |
| Day 90 | **Fewer than 8 of 20** convert to paid | Willingness to pay is not there. Stop. |
| Month 6 | **Under 60 paying families** | The channel does not work. Stop or change channel once, not twice. |
| Month 6 | Monthly churn above **12%** from causes other than death or placement | The product is not good enough. Fix retention before another hour of acquisition. |
| **Any time** | **One missed escalation on a live call** | **Suspend the service that night.** Full clinical review. Do not restart without written sign-off. |
| **Any time** | **A second missed escalation** | **Kill it.** No review, no iteration, no exception. |

**The rule that makes these real: write the number down before the test, and do
not renegotiate it afterwards.**

---

## 13. The honest summary

The need is the best-evidenced in this portfolio. The delivery is unevidenced.
The safety problem is real, specific and named in 4.2. The unit economics have a
hole in them that nobody has measured. The strongest competitor may be free.

**None of that makes it a bad idea. It makes it a bet with a cheap, fast,
decisive test. And the only defensible way to hold it is to run that test and
believe the result.**
