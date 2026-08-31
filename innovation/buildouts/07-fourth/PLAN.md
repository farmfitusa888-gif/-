# Fourth, the operating plan

A voice line for the fourth trimester that knows your specific baby and answers
the 3am question without turning on a screen. Written 2026-08-31.

Budget assumption throughout: **under $1,000**. Every channel below is organic.
Nothing here assumes ad spend, because you do not have it.

**Provenance markers used below**, following the project convention in
[`SOURCES.md`](../../SOURCES.md): **[review]** reported by a third party,
**[standard]** a published regulation or protocol, **[derived]** arithmetic on
figures named at the point of use, **[ASSUMPTION]** mine and marked where used,
**[NOT ESTABLISHED]** unknown, with what would settle it stated alongside. **No
figure below is invented.**

> **This business is labelled a BET in the portfolio, it is the
> highest-liability idea in it, and this plan does not soften either label.**
> Every other business here risks money. This one risks a baby. Read sections 2
> and 4 before anything else. **The decision rule is in section 4.6 and it is
> absolute: any false negative on an escalation case kills the idea.** Not
> "counts against it". Kills it.

---

## 1. The one-sentence version

**Sell the half of a night nurse that scales, the knowing, not the holding — as
a voice line that knows your specific baby, at $99/month against a $10,000–35,000
human, to 304 families; and build the escalation classifier before the product,
because if it misses once there is no business.**

---

## 2. Why this one, and why it is last

Countercite is the business to build first. **Fourth is the one I would build
last, and possibly not at all.** That belongs at the top of the plan, not
buried in the risks.

| | Countercite | Fourth |
|---|---|---|
| Is the need proven? | Inferred from an intermediary's fee | **Yes — families already spend $10,000–35,000 on it** [review] |
| Is the *form* proven? | Yes | **No.** [NOT ESTABLISHED] |
| Regulatory exposure | None | **Paediatric triage. The deep end.** |
| What a failure costs | Money | **An infant** |
| Legal work needed before an engineer | Terms and privacy | **A healthcare attorney, before a line of code** |
| Customer lifetime | Years | **8–16 weeks — structurally** [review] |
| Customers for $30k/mo | 101, held | **304, replaced 3–6 times a year** [derived — see 3.3] |

### The honest framing, which is also the product strategy

**An AI cannot hold a baby.** That is not a limitation to engineer around; for a
large part of the shift it is the entire job, and any product pretending
otherwise is the DoNotPay error repeated with an infant in the room.

The night nurse's work splits cleanly:

1. **Doing**. Feeding, changing, settling, so the parent sleeps. Requires
   hands. Does not scale. Not for sale here.
2. **Knowing**. Is this rash normal, is this breathing normal, is four hours
   between feeds too long at this age, do I wake the paediatrician.

**The second half is where the terror lives**, it is what keeps parents awake
even when the baby is asleep, and it is the only half an information product can
honestly serve. Selling only that half is the whole move. **Selling it while
implying the first half is the failure mode, and it will be commercially
tempting every single week.**

### What the under-$1,000 budget actually buys

**It cannot launch this business and it is not close.** A healthcare attorney
alone exceeds it several times over. What $1,000 buys is **the day 1–30 gate**:
the escalation classifier and its graded test. That test tells you whether it is
worth spending the money a launch would need. **Spend it in that order or not at
all.**

---

## 3. The customer, with real numbers

### 3.1 What the alternative costs

| | |
|---|---|
| Night nurse / newborn care specialist | **$35–85/hour** [review] |
| Average night nanny rate | **~$43/hour** [review] |
| Typical family total spend | **$10,000–35,000+** over **8–16 weeks** [review] |
| Three nights a week, 8 hours, at $45/hr | **$1,080/week** [review] |
| That, over 8 weeks | **$8,640** [derived] |
| That, over 16 weeks | **$17,280** [derived] |

**A caveat that must travel with every one of these numbers.** `SOURCES.md`
records that **every night nurse price in this project comes from a company that
sells night nurses.** Treat the range as indicative and the direction as
reliable. Do not put these figures on a landing page as though they were
independent.

### 3.2 What the sleep deprivation costs

The published consequence of the deprivation this addresses: **higher rates of
postpartum mood disorders, delayed physical healing, impaired cognition and
decision-making** [review].

That last item is the one with product consequences. **The customer is, by the
service's own framing, cognitively impaired at the moment of use.** A product
designed for a clear-headed reader is designed for someone who is not on the
call. Every escalation instruction has to survive being heard once, at 3am, by
someone who has slept in 90-minute fragments for six weeks.

### 3.3 The arithmetic that actually governs this business

| Price | Families for $30k/mo | Annual cost | vs. cheapest human |
|---|---:|---:|---:|
| $79/mo | 380 | $948 | 9.5% [derived] |
| **$99/mo** | **304** | **$1,188** | **11.9%** [derived] |
| $149/mo | 202 | $1,788 | 17.9% [derived] |

$1,188 a year buys **about 27.6 hours** of an average night nanny [derived,
$1,188 ÷ $43]. Roughly three and a half nights, once, versus twelve months of
answers. **That comparison is genuinely strong and it is the only marketing
argument this business needs.**

**Now the number the brief did not compute, which changes everything.**

The acute need lasts **8–16 weeks** [review], two to four months. At $99:

| | |
|---|---|
| Gross revenue per family, whole lifetime | **$198–396** [derived] |
| Implied monthly churn at a 3-month life | **~33%** [derived] |
| Steady-state subscribers = adds × average life | — |
| New families needed **every month** to hold 304, at a 2-month life | **152** [derived] |
| …at a 3-month life | **101** [derived] |
| …at a 4-month life | **76** [derived] |

**Countercite needs 101 customers once. Fourth needs roughly 101 customers
every month, forever, with no advertising budget.**

That is not a churn risk to be listed in section 11. **It is the structure of
the business**, and it has one strategic consequence that governs the whole
go-to-market: **Fourth cannot be sold by
acquisition campaigns; it can only be sold through people who meet new parents
every month as a matter of course.** Doulas, lactation consultants, birth
educators, paediatric practices. Section 7 is built entirely around that
constraint rather than around channels that sound good.

The obvious answer. Extend into the first year — fixes the arithmetic and
**dilutes the wedge**, because "the 3am newborn question" is a sharp promise and
"parenting support" is not. That trade should be made deliberately in month 6
with data, not accidentally in month 2 out of panic.

### 3.4 What I cannot tell you

- **Whether parents will ask a machine about their baby's breathing at 3am.**
  **[NOT ESTABLISHED]**. The day 31–60 pilot is designed to answer exactly
  this and nothing else.
- **Escalation calls per family per night.** Unknown, and it decides whether a
licensed human in the loop is affordable (4.7). **[NOT ESTABLISHED]**,
measured in the pilot.
- **Churn and hold time for infancy-adjacent subscriptions.** `SOURCES.md`
  records this as not found. **[NOT ESTABLISHED]**
- **Whether an insurer will underwrite this at all.** **[NOT ESTABLISHED]**. And see 10, because getting the quotes is free and the answer is informative
  either way.

---

## 4. Safety and escalation

**This section is the business. The go-to-market is downstream of it and worth
less than it. If this section cannot be satisfied, there is no product, and the
correct response is to stop rather than to weaken the section.**

### 4.1 The bright line

**Fourth answers "what is usually true for a baby like yours" and "does this
need a person now". It never answers "is your baby okay".**

| Inside the line | Outside the line, always |
|---|---|
| Population-level information about newborns, conditioned on this baby's gestational age, birth weight, day of life and feeding method | Any diagnosis |
| Whether a described situation warrants a call, now or in the morning | Any dosing of any medication, including paracetamol/acetaminophen |
| Reading back the baby's own logged history | Whether to give any medicine at all |
| Restating standard safe-sleep guidance verbatim | Interpreting a photograph of a rash as benign |
| Explaining what the paediatrician's instruction meant, from the family's own notes | Telling a parent **not** to worry |
| Noticing and naming a pattern across 72 hours | Telling a parent **not** to call |
| Handing the parent the right phone number | Formula preparation ratios beyond "follow the tin exactly" |
| Noticing the parent is not okay, and routing (4.5) | Any advice about a baby with a diagnosed condition |
| | Anything about a baby who is not the enrolled infant |

**On formula dilution specifically:** incorrect preparation ratios harm infants,
and this is a question a tired parent will ask at 3am. The answer is the tin and
the paediatrician's number, every time, with no exception and no cleverness.

### 4.2 The structural problem that argues against this business

Read this before the trigger list, because the trigger list is easy and this is
not.

**You cannot design away reassurance.** The plan's instinct is to say: Fourth
never says "it's fine", it only says "call now" or "here's what's usually
true". So the false-negative surface shrinks. **That is not true.** A parent who
calls at 3am and is not told to call 911 has been reassured, whatever words were
used. Reassurance is the effect, not the sentence.

Which means **the product's liability cannot be engineered below the
classifier's recall, no matter how the output is worded.** Every call is an
implicit triage decision. There is no safe phrasing that makes the classifier's
misses not matter.

**This is the strongest argument against building Fourth and it is not
resolvable by better prompt engineering.** It is only resolvable by a classifier
that genuinely does not miss, or by a licensed human, or by not building it.
Section 12 is written on that basis.

### 4.3 Hard escalation triggers, emergency services or the paediatric line, immediately

These are drawn from the categories that paediatric telephone triage protocols
already cover. **They are a starting list to be replaced, not a finished one.**
See 4.6.

**Breathing and colour**
- Grunting, nasal flaring, chest retractions, head bobbing
- Sustained rapid breathing at rest, or pauses in breathing, or gasping
- Blue or dusky lips, tongue or face; grey; mottled and unwell

**Temperature**
- **Rectal temperature at or above 100.4°F / 38.0°C in an infant under 3
  months**. The standard threshold in paediatric triage [standard — **[VERIFY]**
  against the adopted protocol; the proxy blocks the source]
- Low temperature / a newborn who will not stay warm

**Level of consciousness and tone**
- Hard to wake, will not wake to feed, floppy, unusually still
- Seizure activity or unusual repetitive movements

**Feeding, output and hydration**
- Fewer wet nappies than expected for the day of life
- Sunken fontanelle, dry mouth, no tears
- Refusing consecutive feeds
- Vomiting that is green/bilious, bloody, or forceful and repeated
- Blood in stool; no stool with a distended, firm abdomen

**Skin, cord and jaundice**
- Any jaundice in the first 24 hours of life [**[VERIFY]**, believed always
  pathological]
- Jaundice that is spreading down the body or deepening
- Spreading redness, discharge or odour at the umbilical stump
- A rash with fever, or petechiae that do not blanch

**Trauma**
- Any fall, drop or head strike, no threshold, no discussion

**Cry**
- Inconsolable beyond a defined duration, or a high-pitched or unusual cry

**Two triggers that are not about the baby, and that a product like this will
otherwise miss:**

- **The parent's own emergency.** Heavy bleeding, severe headache or vision
  change, chest pain, shortness of breath, calf pain and swelling, fever.
  **A service that speaks to a postpartum mother every night at 3am and triages
  only the infant is negligent by design.** She is inside the window for
  postpartum haemorrhage, preeclampsia and sepsis, and she is on the phone.
- **Parental concern itself.** "Something is wrong and I don't know what" is a
  triage input in its own right and is treated as one. A parent who has watched
  this baby for 200 hours knows something the classifier does not.

### 4.4 The modifier that makes a generic classifier unsafe

**Gestational age, birth weight and day of life change nearly every threshold
above.** A 36-week baby on day 9 and a term baby at week 6 are different
patients with the same symptom.

This is the product's actual justification for existing, it knows the specific
baby. And it is also the reason a generic model answering the same question is
dangerous rather than merely unhelpful. **The baby's record is a safety
mechanism first and a convenience second, and must be built and defended in that
order.** No record, no answer: an incomplete profile downgrades the line to
routing only.

### 4.5 Postpartum mental health, the hardest classification in the product

A service that talks to a new mother every night at 3am will hear things. It
must therefore have a protocol, and the protocol has to be right in both
directions.

- **Suicidal or infanticidal intent** → 988, immediately, with a rehearsed
  script and a warm stay-on-the-line.
- **Intrusive thoughts without intent** are common in the postpartum period and
  are **not** the same thing. Getting this wrong in either direction causes real
  harm: over-escalating a mother's intrusive thought triggers a custody fear that
  can stop her ever telling anyone anything again; under-escalating can kill her
  or the baby.

**This is the single hardest judgement in the product and it must be defined by
a perinatal mental health clinician, in writing, and graded by one.** Not by an
engineer, not by me, and not by a general-purpose model's instincts. If nobody
qualified will write that protocol, **the line does not ask about the parent's
mood at all**. Because eliciting a disclosure you are not equipped to handle is
worse than not asking.

Fourth **screens, routes and hands off warmly. It never diagnoses and never
counsels.**

### 4.6 Grading against protocols that already exist, and the decision rule

**Paediatric telephone triage protocols exist because nurse phone lines already
use them.** The widely-used commercial standard in this space is the
Schmitt-Thompson protocol set [**[VERIFY]**, named from general knowledge; the
proxy blocks the vendor page]. Licensing cost **[NOT ESTABLISHED]** and it is a
real budget line to price in week one.

**Do not write a trigger list from imagination when a graded, litigated,
decades-old one can be licensed.** Writing your own is both more expensive and
less defensible, and "we used the protocol the nurse lines use" is the single
best sentence available to a lawyer, an insurer and a paediatrician.

**The test:** 200 real newborn questions with paediatrician-graded correct
answers, drawn from published parenting-question corpora and the triage
protocols, weighted to over-represent escalation cases rather than to reflect
their natural frequency.

**THE DECISION RULE: any false negative on an escalation case kills the idea.**
Not a retrain, not a threshold tweak, not "we fixed that one". **Kill.** The
reason is in 4.2. A product whose miss rate is non-zero on a graded set is a
product whose miss rate is non-zero in a bedroom.

### 4.7 What passing means, stated honestly, because it is less than it sounds

**Zero false negatives on 200 cases does not establish a zero miss rate.** By
the rule of three, 0/200 gives an upper 95% confidence bound of roughly **1.5%**
[derived, 3 ÷ 200]. That is **as many as 1 in 67 escalation cases**.

At any real volume, a 1.5% upper bound on missed infant emergencies is not an
acceptable safety claim, and **nobody involved in this business should be
allowed to describe passing the gate as "it's safe".** Passing means: *we failed
to demonstrate that it is dangerous, on a small sample.*

Two consequences follow, and they are the most important operational decisions
in this plan:

1. **The gate is necessary and not sufficient.** Passing 200 buys you the right
   to run a supervised pilot, not the right to launch.
2. **The volume of graded cases must keep growing after launch.** Every live
   call is a new case. 100% of escalations and a stratified sample of
   non-escalations get clinician-reviewed weekly, forever, and the miss-rate
   bound tightens with the corpus. **That review is a permanent operating cost,
   not a launch task**, and any plan that treats it as a launch task is
   describing a different and more dangerous business.

### 4.8 When it is uncertain

**Unlike Hearth, Fourth defaults to escalate.** The asymmetry of harm is total
and the design target is explicit: **be annoying.**

*"I don't know. With a baby that young, not knowing means call. Here's the
number."*

**The honest counter-cost, which must be measured rather than waved away:** an
over-escalating line sends exhausted parents to an emergency department at 3am
repeatedly, costs them money they do not have, and, the real failure — **trains
them to ignore it.** An ignored escalation rule protects nobody, which means a
recall guarantee sitting behind terrible precision is worth exactly nothing.

So precision is a **safety** metric here, not a satisfaction metric, and it has a
kill criterion in section 12 alongside recall. That tension, recall can only be
bought with precision, and precision below a floor destroys recall's value in
practice. Is the real engineering problem in Fourth, and it may not have a
solution at this price.

### 4.9 It never claims to be a nurse

Not in the name (the naming rules in `00-NAMES.md` explicitly barred "Nurse" and
"Doctor" for this reason), not in the copy, not in the voice, not when a
frightened parent asks directly. It discloses that it is automated on the first
call and whenever asked.

**The three DoNotPay rules, applied here** [standard, FTC, $193,000, February
2025, for never testing whether its service worked]:

1. **Measure from customer one.** Recall, precision, escalation rate, and the
   outcome of every escalation. Published.
2. **A licensed human where the law requires one.** See 4.7 and 10, and the
   arithmetic in 6, which is where this gets uncomfortable.
3. **Never claim to be the professional.** Fourth is not a night nurse, does not
   replace one, and says so on the pricing page rather than in the footer.

### 4.10 The refusal script

Refusing an exhausted parent at 3am is a design problem. The refusal is warm,
immediate, and always followed by the alternative:

*"I'm not going to answer that one, anything about medicine for a baby that
small goes to a person, always. Your paediatrician's after-hours line is [X].
Do you want me to stay with you while it rings?"*

**Never** invent a reason. **Never** hint. **Never** answer on the second ask.

---

## 5. Positioning

**Fourth is the knowing half of a night nurse, for families who cannot spend
$10,000.**

| Alternative | Why they might leave it |
|---|---|
| **A night nurse, $10,000–35,000** [review] | The stated comparison. Fourth does not compete on the doing and must say so out loud. It competes on **$1,188 vs $10,000 for the answers** [derived]. |
| **A free forum full of strangers guessing** | Fast, free, warm, and confidently wrong. Fourth wins on **grounded in this baby's own record** — and on refusing. |
| **A generic AI chatbot** | Already in use. It does not know gestational age or day of life, has no escalation rules, and will answer a dosing question. |
| **Calling the paediatrician's after-hours line** | **This is the good option and Fourth's job is to get them to it faster, not to keep them from it.** Any positioning that discourages that call is the thing that kills a baby. |
| **A sleep-training app (Huckleberry and similar)** [review] | Different job — schedules and patterns, not 3am questions. Adjacent, not competing. Note they are one product decision away. |
| **Their own mother** | Free, human, and sometimes 40 years out of date on safe sleep. Fourth does not beat this and should not try. |

**The line that does the work:** *it knows your baby's gestational age, birth
weight and last 72 hours, so "is this too long between feeds" gets an answer
that is actually about your baby.*

**The pattern report is the sleeper feature.** Parents cannot see their own
week. A calm weekly summary. What changed, what is normal drift, what to raise
at the two-week visit. Is worth more than any single 3am answer, is entirely
safe to produce, and is the only part of the product that keeps working after
the acute window closes. **If the escalation classifier fails its gate, the
pattern report is the salvageable business** and it should be built in a way
that survives that outcome.

### What we never say

That it is a nurse, a night nurse, a doctor, or medical advice. That it replaces
your paediatrician. That it keeps your baby safe. That it lets you sleep.
**That last one is the one the marketing will want most and it is a claim about
an outcome we do not control.**

---

## 6. Pricing

**Launch at $99/month.** Founding cohort of 20 at **$49 locked for the
lifetime of their subscription**, in exchange for full logging, a weekly call and
the right to publish their numbers. As in Countercite: that price is not a
discount, it is the cost of evidence.

**Prepay the whole fourth trimester, 4 months for $299 [ASSUMPTION on the
number].** This is not a discount tactic, it is the answer to 3.3: an 8–16 week
product with monthly billing has an awful cash profile and a churn number that
looks like failure even when it is completion. **Prepay also opens the gift
angle**. A grandparent will plausibly buy $299 of "someone answers at 3am" where
they would never buy a $10,000 nurse. **[ASSUMPTION]**, and cheap to test.

### 6.1 Voice unit economics

Per-minute all-in cost for a telephony + speech + model + speech stack is
**[NOT ESTABLISHED]**, `SOURCES.md` records that no vendor pricing page could
be read from this environment. **It is the cheapest unknown here to retire: one
provider account and one test call.**

Revenue $99, less ~$3.17 payment processing (2.9% + 30¢) = **$95.83 net**
[derived].

| Cost per minute [ASSUMPTION] | Minutes/month before margin hits zero |
|---:|---:|
| $0.05 | 1,917 |
| $0.10 | 958 |
| $0.20 | 479 |
| $0.40 | 240 |

**Fourth's call profile is favourable here**, a 3am question is short, where a
sundowning call is long. Even at $0.40/minute, 240 minutes is around 8 minutes a
night, every night. **Voice cost is not what kills Fourth.**

### 6.2 The unit economics that might

**If the law or an insurer requires a licensed clinician in the loop, the price
does not survive it.**

An RN at **[ASSUMPTION] $40–60/hour**, covering one 8-hour overnight shift:

| | |
|---|---|
| Per night | **$320–480** [derived] |
| Per month, one shift covered | **$9,600–14,400** [derived] |
| Subscribers at $99 needed to pay for that one nurse | **97–146** [derived] |
| As a share of the 304-subscriber target | **32–48%** [derived] |

**One nurse, on one shift, consumes a third to a half of the entire target
revenue.** And one nurse does not scale with the base.

**The saving grace, if it exists:** a nurse line works because escalations are
rare, so one nurse covers many families. At 304 families, if 1% need a human on
a given night that is 3 calls. Comfortable. At 5% it is 15 calls a night —
impossible for one person.

**So the number that decides whether Fourth can exist at this price is
"escalation calls per family per night", and it is [NOT ESTABLISHED].** It is
the top metric in section 9 for that reason. Everything else about the business
model is downstream of a number nobody has measured.

**And note the trap.** The $99 price is only achievable by *not* having a nurse
on shift. Which is precisely the arrangement that creates the liability in 4.2.
**Cheap and exposed, or safe and not cheap.** That squeeze is real, it is
structural, and no amount of engineering removes it. Only measurement can tell
you whether the escalation rate is low enough for both to be true at once.

---

## 7. Go to market, $0, and specific

**Built around one constraint from 3.3: roughly 101 new families every month,
forever, with no ad budget.** That rules out anything that acquires families one
at a time. Every channel below is a *source*, someone who meets new parents
every month as a matter of routine.

**And every channel is gated on section 4.** No doula, lactation consultant or
paediatric practice will refer families to an unproven AI infant line, nor
should they. **The graded safety results are the only key that opens any of these
doors.**

### Channel 1, Night nurse and postpartum doula agencies (primary)

**The best channel in the plan, and it exists because of a specific fact in the
research.** `SOURCES.md` names real operating agencies in this category, Let
Mommy Sleep, Night Owl Nanny Care, Harmony Baby Concierge, Motherhood Center,
Born Bir, Well Supported Family, Partum Health, Peacock Parent.

**Every one of them turns families away every month on price.** A family that
enquired about a $10,000 night nurse and could not afford it is the most
pre-qualified lead this business could have: they have named the problem, priced
it, and been told no.

**The offer to the agency costs them nothing and earns them something:** a
referral link for the enquiries they currently lose, revenue share, and a
service that is obviously not competing with them because **it explicitly cannot
hold a baby**. That last point is what makes this channel work at all, and it is
why the honest framing in section 2 is a commercial asset rather than a
concession.

**How:** one agency at a time, by hand, leading with the graded results. Ask
what fraction of enquiries they lose on price, and write the answer down, it is
also the best market-sizing data available to this business.

### Channel 2, IBCLC lactation consultants

Independent practitioners who see nearly every struggling new parent in their
area, usually in the first two weeks. **Feeding is the highest-volume 3am
question**, which makes the fit obvious to them without explanation.

Reachable through professional directories. Same approach: one at a time, safety
results first.

### Channel 3, Childbirth educators and birth classes

Lamaze- and Bradley-style classes, plus hospital-run classes. They meet cohorts
of parents **before** the baby arrives, which solves the timing problem in
section 11, **trust at 3am has to be earned before 3am**, and the 8–16 week
window barely allows time to earn it after birth.

Being mentioned in a birth class is the earliest possible touch and the cheapest.

### Channel 4, Postpartum therapists and pelvic floor PTs

Smaller volume, very high trust, and they are already alert to the mood-disorder
risk that section 4.5 addresses.

### Channel 5, SEO on the real questions

Same double-use pattern as Hearth's helpline corpus. The triage protocols' topic
list **is** the list of what parents search at 3am. Each becomes a page that
answers it properly. Including where it says "call now", which is both correct
and, for this audience, more trust-building than a hedge.

Compounding, free to hold, and it is the only channel here that does not depend
on a gatekeeper's goodwill.

### Channel 6, Paediatric practices

Highest trust, slowest, and **not approachable before the legal work in section
10 is done.** A practice that refers to you has attached its name to your
classifier. Month 6 at the earliest.

### Channel 7, The gift angle

Grandparents, baby showers, registries. Untested **[ASSUMPTION]**, and it pairs
with the prepay in section 6 to fix both the cash and the churn optics. Cheap to
test with one line on the pricing page.

### What we are NOT doing

- **No paid ads.** No budget; and new-parent targeting is both expensive and
  restricted.
- **No posting in Facebook mum groups.** It is spam, it will get you banned, and
  in this category it deserves to.
- **No influencer seeding.** An influencer cannot assess an escalation
  classifier and will describe the product in words you did not approve.
- **No "as recommended by"** any clinician or agency without written permission.
- **No hospital discharge-bag placement** until section 10 is finished. It is the
  obvious idea and it is the one with the most institutional exposure.

---

## 8. The 90-day plan

### Days 1–30. The gate. Nothing else happens in this window.

| | |
|---|---|
| **Goal** | Find out whether the escalation classifier can be built at all |
| **Do** | **Talk to the healthcare attorney first — before an engineer, as the brief requires.** Price the triage protocol licence. Build the classifier against the licensed protocol, not against imagination. Assemble 200 newborn questions with paediatrician-graded answers, over-weighted to escalation cases. Run it. |
| **Ship** | Recall, precision, and the full list of every case it got wrong |
| **Spend** | The entire budget, and it will not be enough for the attorney |
| **Gate** | **Any false negative on an escalation case → kill the idea. Not iterate. Kill.** |

**Second gate, same window:** if no healthcare attorney will give a written view
that the section 4 design is lawful **without** a licensed clinician on every
call, and the arithmetic in 6.2 says that clinician costs more than the price
supports, **stop.** That is not a setback to work around; it is the answer.

**Third gate, and it is free:** get errors-and-omissions quotes. **If no
underwriter will write the policy, you have received a professional risk
assessment for the price of some emails, and it says do not do this.**

### Days 31–60. Supervised pilot, only if all three gates passed

| | |
|---|---|
| **Goal** | 20 families, free, recruited through two agencies from channel 1 |
| **Do** | Onboard each by hand: gestational age, birth weight, feeding method, the running log. **A licensed clinician reviews 100% of escalations and a sample of everything else, within 24 hours, for the whole pilot.** |
| **Ship** | Night-call rate, minutes, **escalation calls per family per night**, precision in the wild, and the counterfactual question |
| **Gate** | **Fewer than 12 of 20 place a night call in 30 days → the bet has failed.** Stop. |

**The counterfactual question, asked after every escalation:** *"If we hadn't
been here, what would you have done?"* If the answer is consistently "called the
paediatrician anyway", **Fourth is adding a step rather than removing one**, and
that finding matters more than any satisfaction score.

### Days 61–90, Whether anyone pays

| | |
|---|---|
| **Goal** | Convert the pilot at $49 founding; two agency partnerships signed |
| **Do** | Ask for cards. Publish the graded numbers. Ship the first ten SEO answers and the pattern report. |
| **Gate** | **Fewer than 8 of 20 convert → willingness to pay is not there.** |

### Beyond 90 days

**No month-12 projection is offered, and one should not be invented.** The
Countercite plan earned its month-19 figure by building a model and then
losing an argument to it. Fourth has two unknowns that make any such model
fiction. Average hold time and escalation rate — and both are measured in the
pilot. **Build the model in month 4, with real numbers, and let it disagree with
you.**

The one thing the arithmetic already says: **at 3.3's replacement rate, growth
is entirely a function of how many families each agency partner sends per
month.** That is the number to forecast, and it comes from channel 1, not from a
funnel.

---

## 9. Metrics

| Metric | Target | Why it is the one that matters |
|---|---|---|
| **Escalation recall, graded set** | **100%** | The only acceptable value. Anything else kills it. |
| **Escalation recall, live** | **100%** | One live miss shuts the line off that night |
| **Escalation precision** | Measured and published; floor set with the paediatrician **[NOT ESTABLISHED — do not invent a threshold]** | Alarm fatigue destroys recall's value in practice (4.8) |
| **Escalation calls per family per night** | Measured from family one | **Decides whether a licensed human is affordable, which decides whether the business exists** (6.2) |
| **Refusal rate on out-of-scope questions** | **100%** | Drift toward helpfulness is the failure that hurts a baby |
| **Night calls per family per week** | **>1** | The bet |
| **Minutes per family per month** | Measured | Unit economics |
| **Counterfactual: "what would you have done?"** | Tracked verbatim | Reveals whether the product removes a step or adds one |
| **Clinician review of escalations** | **100% within 24h, permanently** | 4.7 — an operating cost, not a launch task |
| **Conversion, pilot → paid** | >40% | Willingness to pay |
| **Average subscription length** | Measured, not assumed | The whole of 3.3 rests on it |

**All escalation metrics are published.** DoNotPay was not punished for having a
bad product; it was punished for never measuring and advertising anyway
[standard].

---

## 10. Legal posture

**The brief's instruction stands and this plan is built on it: this business
needs a healthcare attorney before it needs an engineer, and possibly a
paediatrician on staff rather than on a landing page.**

**What Fourth is:** a consumer subscription information service for new parents.

**What it is not, in the terms and on the site:** a healthcare provider, a nurse
triage line, a telehealth service, a night nurse, or a source of medical advice.
It does not diagnose, does not treat, does not dose, and does not decide whether
a baby goes to hospital.

| Exposure | Handling |
|---|---|
| **Unlicensed practice of medicine or nursing** | **The central question, and the one the attorney is hired to answer.** Nurse triage lines are staffed by licensed nurses for a reason. Whether the 4.1 line keeps Fourth outside that is **[NOT ESTABLISHED]** and is the day 1–30 second gate. |
| **Clinical decision support / FDA** | Whether a symptom-based escalation classifier for infants falls inside device regulation is **[NOT ESTABLISHED]** and is a real question, not a formality. For the attorney. |
| **FTC deceptive claims** | No safety promise, no outcome claim, no "sleep through the night", no comparison to a nurse. Published accuracy backed by the graded set or not published. [standard — DoNotPay] |
| **Health privacy** | Probably outside HIPAA as direct-to-consumer with no covered entity **[ASSUMPTION]** — and that changes the moment a paediatric practice partners (channel 6). FTC Health Breach Notification Rule and state health-privacy law (Washington's My Health My Data first) believed to reach it **[VERIFY]**. |
| **Data about an infant** | COPPA is believed not to apply, because the data is provided by the parent about the child rather than collected from a child online **[ASSUMPTION — for the attorney]**. Do not rely on this sentence. |
| **Recording consent** | All-party consent at enrolment plus spoken notice, every call, every state. |
| **Mandatory reporting** | Same unresolved question as Hearth, and it arrives here too. Decide, write it down, tell the customer at enrolment. |
| **Professional liability / E&O** | **[NOT ESTABLISHED] whether any carrier will write it.** Free to find out and highly informative (see 8, third gate). |
| **Protocol licensing** | Cost **[NOT ESTABLISHED]**. Budget for it in week one. |

**Honest cost estimate: $5,000–15,000 [ASSUMPTION] for the legal work alone,
before protocol licensing, clinician time or insurance.** That is more than ten
times the stated budget. **This is not a plan that can be executed for under
$1,000 and saying otherwise would be the first dishonest sentence in it.** The
$1,000 buys the day 1–30 classifier test, which is the cheapest possible way to
find out whether the rest is worth funding.

---

## 11. Risks, ranked by what actually kills it

**1. The classifier misses.** Ranked first because 4.2 says the liability cannot
be engineered below the classifier's recall, and 4.7 says a passed gate does not
prove recall. **An infant is harmed and the business, and quite possibly the
founder, is finished.** *Mitigation: licensed protocols, the 200-case gate, the
absolute kill rule, permanent clinician review, and a genuine willingness to
stop.*

**2. The gate is simply not passable.** The most likely outcome of the first 30
days. *Mitigation: it costs under $1,000 to find out, which is the entire reason
the plan is sequenced this way.*

**3. The law requires a licensed human, and the price cannot carry one.** 6.2.
*Mitigation: measure escalation rate in the pilot; be willing to conclude the
answer is no.*

**4. The replacement treadmill.** ~101 new families every month, forever, with
no ad budget (3.3). *Mitigation: the entire go-to-market is agency partnerships
for this reason; and if agencies do not refer, there is no second plan.*

**5. Trust cannot be earned inside the window.** A parent will not ask an
unfamiliar service whether their baby is breathing correctly, and the acute need
lasts 8–16 weeks. *Mitigation: channel 3, reach them in the birth class, before
the baby.*

**6. No insurer will write the policy.** *Mitigation: find out in week one. It is
free.*

**7. Precision so poor the line gets ignored.** 4.8. A safe classifier nobody
listens to is an unsafe product. *Mitigation: measure precision as a safety
metric with its own kill criterion.*

**8. Paediatric telehealth is one product decision from this.** A funded
telehealth company with clinicians already on staff can add this and be more
defensible than you on day one. *There is no technical defence. The only defence
is being the thing the doulas and lactation consultants already recommend.*

---

## 12. Kill criteria

Written now, while it is cheap to be honest.

| By | If | Then |
|---|---|---|
| Day 30 | **Any false negative on an escalation case** in the 200-case graded set | **Kill.** Not iterate, not retrain, not "we fixed that one." Kill. |
| Day 30 | No healthcare attorney will give a written view that the design is lawful without a clinician on every call, and 6.2 says that clinician is unaffordable | **Kill.** |
| Day 30 | **No insurer will quote** errors-and-omissions cover | **Kill**, or restructure to routing-only and re-test. |
| Day 30 | The triage protocol licence costs more than the business can carry, and the alternative is writing your own trigger list | **Stop.** A self-authored infant triage list is not defensible. |
| Day 30 | No paediatrician will grade the set or sign off the triggers | **Kill.** You cannot buy this later, and a product nobody qualified will endorse is telling you something. |
| Day 60 | **Fewer than 12 of 20** pilot families place a night call in 30 days | **The bet has failed.** Stop. |
| Day 60 | More than **30% of pilot nights** produce an escalation the clinician judges unnecessary | The line will be ignored, so recall is worthless. **Stop and redesign, once.** |
| Day 60 | Escalation calls per family per night imply a clinician cost above **$99/family/month** | **Kill.** There is no price at which this works. |
| Day 90 | **Fewer than 8 of 20** convert to paid | Willingness to pay is not there. Stop. |
| Month 6 | New families per month below **40** | The arithmetic in 3.3 never reaches 304. Change the channel once, then stop. |
| **Any time** | **One missed escalation on a live call** | **Shut the line off that night.** Full review. Notify every customer. Do not restart without written clinical sign-off. |
| **Any time** | A parent reports harm they attribute to the service | **Shut it off, disclose, and take advice before saying anything else.** |

**The rule that makes these real: write the number down before the test, and do
not renegotiate it afterwards.** On this business more than any other in the
portfolio, the temptation to renegotiate will be enormous, because the first
gate is likely to fail and the idea is genuinely attractive. **That temptation is
exactly what the rule exists for.**

---

## 13. The honest summary

The pain is proven by $10,000–35,000 of actual spend [review]. The split between
holding and knowing is real, and selling only the half that scales is a good
idea. The channel. Agencies that turn families away on price every month — is
the best $0 channel in the portfolio.

**And the product may not be buildable at an acceptable standard.** 4.2 says the
liability cannot be engineered below the classifier's recall. 4.7 says 200 clean
cases still leaves an upper bound of 1 in 67. 6.2 says the price only works
without the human that safety may require. Those three findings are not risks to
manage; they are structural, and any two of them together are enough to stop.

**Run the 30-day gate. It costs under $1,000 and it is the cheapest way to find
out that the answer is probably no.**
