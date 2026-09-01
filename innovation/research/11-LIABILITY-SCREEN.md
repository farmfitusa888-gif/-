# Liability screen, six ideas re-ranked

Written 2026-09-01. Re-ranks ideas 1, 2, 3, 4, 6 and 7 on a criterion the
portfolio never applied to them: **how much legal and regulatory liability the
owner personally takes on by running each one.**

The reason this document exists is a sentence the owner said late and nobody
used as a filter: *"I was just looking to fill a gap and make money without
liability."* Every idea here was selected on a thesis about arming individuals
against institutions. That thesis points at adversarial, regulated situations by
construction, which is exactly why the money is visible and exactly why the risk
is. Countercite got a full legal posture. The other six got a paragraph each.

Method copied from [`../legal/00-LEGAL-POSTURE.md`](../legal/00-LEGAL-POSTURE.md),
which found that the same software is safe sold flat-fee to a licensed
professional and not safe sold to the affected consumer. Applied to six ideas,
that lens holds up four times, fails once in an interesting way, and produces
one finding that corrects it.

---

## Read this before anything else

**I am not a lawyer.** This is research and product screening. It is not legal
advice, it creates no professional relationship, and it should not be relied on
the way advice from counsel would be. Its job is to sort six ideas by exposure
so the expensive hours get spent on the right one.

**Every citation below came through a search index, not from reading the
statute.** The proxy blocks primary legal sources; one direct fetch of Cornell's
US Code was attempted for the Anti-Kickback Statute and was refused by the egress
proxy. So there is **not one `[verified]` item in this document**, same as the
Countercite posture. Section numbers get renumbered and summaries drop the
subsection that changes the answer.

| Label | Meaning |
|---|---|
| `[verified]` | Primary source read in full. **Zero items here carry it.** |
| `[review]` | Search-index summary. Substance believed correct, page not read. |
| `[conflict]` | Sources disagree, or a section number in an existing project file looks wrong. |
| `[NOT ESTABLISHED]` | Could not determine. Stated as unknown rather than guessed. |

Nothing is invented. Where a number, agency or case could not be confirmed, it
says so instead of supplying one.

---

## The ranking

Lowest liability first.

| # | Idea | Tier | The sentence that decides it | B2B-only version? |
|---|---|---|---|---|
| **1** | **Backpay** (01) | **LOW** | No regulator licenses or supervises anyone who computes a wage number, and the plan already sells flat-fee software to the lawyer rather than a percentage to the worker. | **Yes, and it already is one.** Model 4 is the plan. |
| **2** | **Overquote** (04) | **LOW** | Nobody needs a licence to read a repair estimate, and the state regulates the shop that does the work rather than anyone who comments on its paperwork. | Yes. Credit unions and small fleets, untested, and the only route to the revenue target anyway. |
| **3** | **Claimable** (03) | **MEDIUM**, and bimodal | Payment shape decides everything: a per-enrolment fee from a hospital sits next to a felony statute, a monthly software seat sold to the same hospital does not. | **Already B2B.** The problem was mis-diagnosed as a buyer problem; it is a fee-structure problem. |
| **4** | **Overturn** (02) | **HIGH** | It is the only one of the six where the owner becomes a licensee: a bond, an approved contract form, a statutory fee cap, continuing education, and a regulator that can end the business over one upheld complaint. | The B2B version of Overturn is Countercite. Choosing it deletes Overturn. |
| **5** | **Hearth** (06) | **HIGH** | Unlicensed practice of medicine is a felony in Texas and a wobbler in California, three states passed AI-in-mental-health statutes in 2025 alone, and the worst outcome is a death from a missed delirium. | Only by ceasing to be a 2am phone line. Software for care managers is a different product. |
| **6** | **Fourth** (07) | **HIGH**, and the highest | The plan's own §4.2 concedes the liability cannot be engineered below the classifier's recall, because every call is an implicit triage decision no matter how the sentence is worded. | Yes, and it is the only version that might fit FDA's non-device carve-out. It also destroys the price. |

Countercite (05) is not screened here because it already has its own posture
document. For orientation it would sit at the top, alongside Backpay, and for
the same structural reason.

---

## Who gets hurt, ranked by worst realistic outcome

This is the question that actually drives liability and it is not the same as
the regulatory question. Overquote has no regulator and a bodily-injury tail.
Overturn has a regulator on every file and a worst case measured in dollars.

| Rank | Idea | Worst realistic outcome of the software being wrong | Who absorbs it |
|---|---|---|---|
| 1, least bad | **Backpay** | An overstated figure gets a wage claim reduced or thrown out; or a worker acts on a correct figure and is fired for it | The worker, financially. In the firm version a lawyer sits between the number and any action |
| 2 | **Overturn** | A contested claim settles low, or a deadline is missed on a file the owner is contractually responsible for | The homeowner, financially. Plus the owner's licence |
| 3 | **Claimable** | A false-positive filing produces overpayment and recoupment against a low-income older adult; on a mixed-immigration-status household the consequence is not financial at all | The applicant, and the consequences are not all reversible |
| 4 | **Overquote** | A driver is told a line is padding, defers it, and the deferral was on a system that matters | A driver and whoever they hit |
| 5 | **Hearth** | Delirium is skilfully de-escalated as a behaviour problem while an untreated infection progresses; or a suicidal disclosure at 2am goes unrouted | A person with dementia, or their caregiver |
| 6, worst | **Fourth** | A missed escalation on an infant | An infant |

The gap between rank 3 and rank 4 is the one I am least sure of. An immigration
consequence and a car crash are different kinds of catastrophe and I am not
going to pretend a table settles which is worse. What is clear is that 1 and 2
are money, and 4, 5 and 6 are people.

---

## 1. Backpay

**Regulator with jurisdiction: none in particular, and that is the most valuable
finding in this document.**

The US Department of Labor's Wage and Hour Division administers the FLSA and the
California Labor Commissioner (DLSE) adjudicates state wage claims `[review]`.
Both regulate **employers**. Neither licenses, registers, supervises or has any
apparent hook into a third party who computes what an employer owes. The nearest
thing to an existing regulated analogue is the forensic-accounting and
expert-witness market that already computes wage-and-hour damages for plaintiff
and defence counsel `[review]`, and that market carries no licence at all.

Two live tripwires, both about money rather than about arithmetic.

**Cal. B&P § 6152 and § 6153, runner and capper.** Acting for consideration as
an agent for a lawyer in the solicitation or procurement of business is
unlawful; on a first conviction the penalty is reported as up to one year in
county jail, a fine not exceeding **$15,000**, or both `[review]`. Second and
subsequent convictions reach two to four years `[review]`. The plan already
refused the lead-generation model in §5 for exactly this reason. Worth noticing
what that refusal is worth: the version of Backpay that reached the revenue
target and the version that stays clear of a criminal statute are the same
version. That does not happen often in this portfolio.

**Cal. B&P § 6125 and the LDA chapter.** No advice, no representation, no
percentage. If a flat document-preparation fee is ever charged to a worker,
§§ 6400 to 6415 registration with the county clerk and a **$25,000** bond under
§ 6405 come into view `[review]`. And California is not alone: Nevada registers
document preparation services under **NRS ch. 240A**, with a bond, annual
renewal and civil or criminal penalties for unregistered activity at NRS
240A.280 and 240A.290 `[review]`. Whether a wage-claim packet is a legal
document for either chapter is `[NOT ESTABLISHED]`. All of this is avoidable by
not charging the worker, which the plan already decided on moral grounds.

**Licensing gate: no.** Nothing found in any state licenses wage-shortfall
computation for a fee. The software-vendor-to-licensed-professional posture is
not needed to escape a gate here, because there is no gate. It is worth adopting
anyway for the reason below.

**UPL: the weakest exposure of the six.** Wage arithmetic with the Labor Code
section cited next to each figure is a statement about a document and a
published rule, which is the safe side of the line drawn in
`00-LEGAL-POSTURE.md` §1.3. The engine's habit of returning `reliable: false`
rather than guessing does the same legal work that the `Locator` invariant does
for Countercite. Note also that Berman hearings before the Labor Commissioner
are informal and a worker may appear without counsel `[review]`, which is a
forum where preparing yourself is normal rather than exceptional. Whether a
non-attorney may **represent** a worker there is a different question and is
`[NOT ESTABLISHED]`.

**Consumer-money angle: none, as designed.** Free to workers, flat monthly to
firms, no percentage anywhere, no outcome claim. The DoNotPay theory was that
capability claims went unsubstantiated `[review]`, and the day 1 to 30
measurement gate in the plan is a direct answer to it. The moment a worker is
charged anything, this row changes.

**B2B version: it already is the plan**, and the plan got there by arithmetic
rather than by legal caution, which is the strongest kind of agreement between
two independent constraints.

One real harm remains and it is not a legal one. Retaliation. The software
cannot cause it and cannot prevent it, and the plan's five mitigations are
honest about reducing rather than solving it. Aggregation into class-scale
matters is both the best answer to it and the higher-ARPU tier. Point the
business there.

---

## 2. Overquote

**Regulator: essentially none over this product.** California's Bureau of
Automotive Repair regulates **automotive repair dealers**, and the registration
trigger is performing repairs for compensation; failing to register is a
misdemeanour `[review]`. The written-estimate and authorisation rules at
16 CCR § 3353 bind the shop that issues the estimate `[review]`. A business that
reads a document the consumer already holds, performs no repair and authorises
none, is outside that trigger on the face of it. Whether any launch state
regulates commenting on an estimate for a fee is `[NOT ESTABLISHED]`, and the
plan already put that question to counsel.

**Licensing gate: no.** Mechanics are certified rather than licensed in most
states, and certification is voluntary.

**Unauthorized practice: not applicable.** There is no profession here with a
monopoly to protect. The plan's decision to retain an ASE-certified mechanic to
review a rolling sample is a quality control and an evidence-building measure,
not a compliance one. Keep it for the first reason.

**Consumer money: yes, and this is the exposure.** $29 charged to a driver from
a population where 82% are already deferring repairs over cost is a distressed
consumer in the FTC's sense. Any savings claim, accuracy claim or "avoid being
overcharged" promise needs the substantiation the DoNotPay order requires
`[review]`, and Operation AI Comply has continued into 2026 across a change of
administration `[review]`. Add to that a defamation and trade-libel surface if a
shop is ever named. The plan's rule of describing lines rather than businesses,
and phrasing everything as a question the customer can ask, is the right
architecture.

**The safety tail is the whole story.** Telling someone a brake, steering, tyre
or airbag line is unnecessary is a different class of error from flagging a
cabin filter. The plan already handles this architecturally by checking price
only on safety-critical categories, and that is the correct shape: a rule the
system cannot talk its way around beats an instruction it might. The residual
risk is the plaintiff's argument that a paid opinion contributed to a deferral.
It is a low-probability, high-consequence tail, and it is the reason this idea
does not rank first despite having less regulation over it than Backpay.

**B2B version: yes, and it was always the only route to the number.** Credit
unions and small fleets are reachable by one person. A fleet operator is a
business buying a cost-control tool, which is a commercial contract where a
liability cap is likely enforceable, rather than a consumer adhesion contract
where it is materially weaker (`00-LEGAL-POSTURE.md` §3.4) `[review]`. The
safety exposure follows the advice, not the payer, so B2B improves the contract
position and does not remove the tail.

**The honest note.** Overquote's liability is low partly because nobody has
found enough value here to regulate it. Low liability and no revenue is not a
business, and this idea's problem was never legal.

---

## 3. Claimable

The one that reorders the method rather than confirming it.

**Regulator: several, and which one depends entirely on the fee.**

**Federal Anti-Kickback Statute, 42 U.S.C. § 1320a-7b(b).** Knowingly and
wilfully offering, paying, soliciting or receiving remuneration to induce or
reward the referral of business reimbursable under a federal health care
programme. Reported as a **felony**, punishable by fines up to **$100,000** and
imprisonment up to **10 years**, with civil monetary penalties under SSA
§ 1128A(a)(7), programme exclusion under § 1128(b)(7), and False Claims Act
exposure alongside `[review]`. Whether a per-head enrolment fee paid by a
hospital to a vendor for signing patients into Medicaid falls inside it is
`[NOT ESTABLISHED]` and is exactly the question the plan already sends to
counsel on day 1 to 10. That sequencing is right and should not move.

**Navigator and assister rules.** 45 CFR § 155.210(d) bars a Navigator from
charging an applicant or receiving remuneration from or on behalf of an
applicant for application assistance `[review]`. Claimable is not a Navigator
and does not intend to be. The rule matters for a different reason: it shows the
federal design assumption that application assistance is not a thing a
consumer pays for. Whether a state assister or certified application counsellor
credential is required to submit an application on someone's behalf for a fee in
the launch state is `[NOT ESTABLISHED]`.

**HIPAA.** Not by direct application, but any hospital or plan buyer will
require a Business Associate Agreement, at which point the obligations arrive by
contract. The plan already says to have one drafted before the first pilot
conversation. Do that.

**Licensing gate: unresolved, and state-specific.** Nothing found that licenses
benefits application preparation generally. Veterans' benefits are the clear
counter-example, where charging for assistance in applying is restricted
`[review]`, and that is a useful warning that programme-specific fee bans exist
and have to be checked programme by programme. `[NOT ESTABLISHED]` for SNAP and
Medicaid in the launch state.

**Unauthorized practice: low.** Eligibility determination against published
rules and completion of a government form is closer to data lookup than to
advice about rights. Careful about the sentence that says "you qualify" rather
than "these rules are satisfied on these inputs"; the plan's three-verdict
architecture already draws that line and calls the middle verdict LIKELY,
PENDING VERIFICATION rather than a qualification.

**Consumer money: not as designed**, because the buyer is an institution. If
that ever inverts and a low-income older adult is charged for help obtaining a
free benefit, it lands in the FTC's oldest fact pattern, the one about paid
access to free government programmes `[review]`.

**B2B version: it already is one, and that is the finding.** Claimable was never
a consumer product. It sells to hospitals, plans and operators. And it still
carries the largest criminal statute of the six. The Countercite lesson is
usually stated as *sell to the licensed professional*. Claimable shows that the
load-bearing variable was never who signs the cheque. It is **how the fee is
computed**. A percentage of a recovery converts a software business into
unlicensed adjusting; a per-head payment for an enrolment converts a software
business into something an anti-kickback statute was written about. Flat and
periodic, unrelated to the outcome, is the actual rule. Who pays is downstream
of it.

Which means the §2 fallback in the plan, the eligibility engine sold to hospital
financial counsellors as a monthly seat, is not a consolation prize. It is the
same engine at **LOW** instead of **HIGH**, with the same buyer, and it drops
the adjudication lag that the plan already identified as a cash-flow problem for
someone with under $1,000. Two independent reasons pointing the same way.

---

## 4. Overturn

**Regulator: the Texas Department of Insurance, directly and continuously,
under Tex. Ins. Code ch. 4102.**

The plan is correct that structure (b), becoming licensed, is the only compliant
version, and correct that Texas licensure is cheap. Both of those are answers to
the wrong question if the owner's criterion is liability rather than legality.

**One open item in the existing plans can now be closed, with a caveat.**
`buildouts/02-overturn/PLAN.md` and `legal/00-LEGAL-POSTURE.md` both record the
Texas criminal grading as `[NOT ESTABLISHED]` and point at § 4102.207. The
search index puts the criminal penalty at **§ 4102.206**, graded a **Class B
misdemeanour**, and describes **§ 4102.207** as the insured's option to void a
contract entered into with a person who violated the licensing requirement, in
which case the insured owes nothing for services rendered `[review]`. Both of
those matter and the second is arguably worse commercially than the first: a
contract that a client can void is a file worked for free. Marked `[conflict]`
against the section number in the existing plans, and it is a five-minute fix
for anyone with an unblocked browser.

**Licensing gate: yes, the clearest of the six**, and it is the reason this idea
sits where it does. The software-vendor posture does **not** rescue it, and the
plan says so itself in §3.2: the version of Overturn that is software sold to
licensed adjusters is Countercite, which is a different company that already
exists. There is no arrangement in between. Texas § 4102.160 bars an adjuster
paying a non-licensee for the referral of an insured, and Illinois Company
Bulletin 2026-02 of 26 January 2026 reaches indirect value including shared
economics `[review]`. The two states between them close the partner structure.

**UPL: a live boundary rather than a wall.** A licensed public adjuster may
negotiate a claim. Advising on legal rights and handling litigation is a
lawyer's work. The plan's instruction to know where appraisal ends and bad-faith
litigation begins, and to refer out at that line, is the right handling, and it
is a judgement the owner would have to make correctly on every file forever.

**Consumer money: structurally, yes.** A contingency fee, taken from a
distressed homeowner shortly after a property loss, with marketing that must
imply an outcome to work at all. This is the DoNotPay fact pattern with a
licence attached, and the licence does not answer to the FTC. The plan's
mitigations are unusually good, notably charging only on the increase and
publishing a decline rate. They cost margin, which the plan admits.

**What the tier actually reflects.** Not a catastrophe tail. Overturn's worst
realistic outcome is money and a licence. The tier is HIGH because the liability
is **continuous and personal**: a bond, a commissioner-approved contract form
used unmodified, a statutory fee cap audited monthly, CE forever, a solicitation
regime after declared catastrophes that is still `[NOT ESTABLISHED]`, E&O whose
availability is `[NOT ESTABLISHED]`, and the plan's own kill criterion that one
upheld TDI complaint stops the business. Add the four-to-eight month cash lag
against a budget under $1,000. For an owner whose stated priority is making
money without liability, becoming a licensed fiduciary for other people's
insurance claims is the precise opposite of the brief, and it is worth saying
that plainly rather than admiring how cheap the licence is.

---

## 5. Hearth

**Regulator: state medical and nursing boards, plus a statutory regime that did
not exist when this portfolio was written.**

**Unlicensed practice.** Cal. B&P § 2052 is a wobbler: as a misdemeanour up to
one year and a $1,000 fine, as a felony 16 months, two or three years and up to
$10,000, and it reaches aiding and abetting `[review]`. Texas Occ. Code
§ 165.152 makes practising medicine in violation of the subtitle a **third-degree
felony**, with each day a separate offence `[review]`. The bright line in the
plan's §4.1 is drawn in the right place. The problem named in §4.2 is that the
product's core competence, behavioural de-escalation, is the wrong response to
delirium, and delirium presents as behaviour. That is not a compliance failure.
It is the product working correctly on the wrong input, and no disclaimer
touches it.

**The new statutes, and they matter more than the old ones.** Three states
legislated on AI in mental health during 2025:

| State | Instrument | Substance | Penalty |
|---|---|---|---|
| Illinois | Wellness and Oversight for Psychological Resources Act, PA 104-0054, effective 1 Aug 2025 | No person may provide, advertise or offer therapy or psychotherapy unless delivered by a licensed professional; AI confined to administrative and supplementary support | Up to **$10,000 per violation**, IDFPR `[review]` |
| Nevada | AB 406, signed 5 Jun 2025, effective 1 Jul 2025 | Prohibits AI systems providing professional mental or behavioural health care, and from claiming they can | Civil penalties up to **$15,000 per violation** `[review]` |
| California | AB 489, approved 11 Oct 2025, effective 1 Jan 2026 | Makes the existing bans on terms, letters and phrases implying health-care licensure enforceable against developers and deployers of AI, including design cues; each use a separate violation, enforced by the relevant licensing board | Per-violation, board-enforced `[review]` |

Hearth's own §4.1 lists "sitting with the caregiver while they cry" as inside
the line and therapy as outside it. That distinction is defensible in ordinary
language and it is one sentence wide in Illinois. A 2am line that talks a
depressed caregiver down is doing something a statute now describes.

**Two more regimes worth naming.** California's Telephone Medical Advice
Services chapter, Cal. B&P § 4999, requires registration with the Telephone
Medical Advice Services Bureau by a business employing or contracting the
full-time equivalent of **five or more** health care professionals whose primary
function is telephone medical advice, serving a patient at a California address
`[review]`. A solo operator with zero clinicians on the phone does not hit that
threshold, which is a genuine piece of good news. The chapter's regulations also
forbid staff using a title that would lead a reasonable person to think they are
licensed `[review]`, which is the same rule as AB 489 arriving from a second
direction. And Cal. B&P § 17941 requires bot disclosure, with the defence that a
clear and conspicuous disclosure removes liability `[review]`. It is written for
bots communicating "online" and whether a telephone voice agent is inside that
word is `[NOT ESTABLISHED]`. The plan's decision to disclose everywhere
regardless is correct and costs a sentence.

**FDA.** A consumer-facing escalation classifier does not obviously fit the
non-device clinical decision support carve-out at FDCA § 520(o)(1)(E), because
one of the four criteria is that the software is intended to support or provide
recommendations **to a health care professional** who can independently review
the basis `[review]`. Hearth's recommendation goes to a family member. FDA
exercises enforcement discretion over low-risk software functions such as
coaching and health-information organisation `[review]`, which may or may not
cover a product whose stated job includes deciding whether tonight needs a
clinician. `[NOT ESTABLISHED]`, and it is a real question rather than a
formality.

**Privacy and reporting.** Outside HIPAA as direct-to-consumer, which is not the
same as unregulated. The FTC Health Breach Notification Rule, 16 CFR pt. 318,
covers health apps not covered by HIPAA, with civil penalties reported at up to
**$43,792 per violation per day** `[review]`. Washington's My Health My Data Act
carries a private right of action with actual damages, fees and treble damages
capped at $25,000, and as of May 2026 the enforcement to date has been private
litigation rather than AG action `[review]`. Cal. Welf. & Inst. Code § 15630
defines mandated reporters to include care custodians, health practitioners, and
a person who has assumed full or intermittent responsibility for the care of an
elder `[review]`. Whether a subscription phone service is inside that last
phrase is `[NOT ESTABLISHED]` and the plan is right that it must be answered
before the first call, not after.

**Consumer money: yes.** A $49 subscription sold to an exhausted family member,
where any implied safety claim needs substantiation.

**B2B version: only by ceasing to be Hearth.** Selling to geriatric care manager
practices or home care agencies puts a licensed professional in the chain and
improves the contract position. It does not help if the product still answers
the caregiver's phone at 2am, because the licensing exposure and the harm follow
the call rather than the invoice. The version that genuinely moves the tier is
software the care manager operates: per-person baseline tracking, overnight
event logging, pattern summaries for the neurologist. That is a real product and
it is not a 2am line, which is the entire idea.

---

## 6. Fourth

Everything in the Hearth section applies, with an infant in the room and one
additional argument that the plan makes against itself better than I can.

**The structural point, from the plan's own §4.2.** A parent who calls at 3am
and is not told to call 911 has been reassured, whatever words were used. So the
liability cannot be engineered below the classifier's recall, and no phrasing
rule changes that. That is the single most important sentence in any of the six
plans, and it means the disclaimer strategy that works for a document product
does not work here at all.

**Regulator: the same medical and nursing boards, and telephone triage is a
nursing function.** Boards of nursing take the position that telephone triage
and telephone advice fall within RN scope, with standardised protocols required
in many states, and California's board requires a California RN licence to
perform telephone medical advice services to a California address `[review]`.
Fourth's product **is** telephone triage in everything except the name.
Tex. Occ. Code § 165.152's third-degree felony grading is the tail here
`[review]`.

**FDA is more likely to bite here than for Hearth**, for a specific reason: the
non-device CDS criteria require the recommendation to go to a health care
professional who can independently review the basis `[review]`. An infant
symptom classifier speaking to a parent is on the wrong side of that clause. The
plan already flags device regulation as a real question and it is right to.

**Consumer money: the strongest of the six.** $99 a month to a new parent, on a
customer lifetime of 8 to 16 weeks, in a category where the marketing has to
gesture at safety to be worth buying.

**B2B version: yes, and it is the interesting one.** Selling the classifier to
paediatric practices, night-nurse agencies or postpartum doula agencies puts a
licensed clinician between the output and the parent. That is the only
configuration that plausibly walks into the non-device CDS carve-out, because
the carve-out is written for exactly that shape. It also destroys the economics
that made the idea attractive: the plan's §6.2 already says the price only works
without the clinician that safety may require, and the B2B version puts the
clinician back. So the rescue works legally and fails commercially, which is a
cleaner answer than most.

The plan's own kill criteria are the strictest in the portfolio and they should
be believed. One false negative on the 200-case graded set kills it. The founder
wrote that before running the test, which is the correct order.

---

## What I would actually recommend

**Backpay, in its Model 4 form: flat monthly software sold to California
plaintiff-side employment firms, with the worker calculator free and never
monetised.** It is the only one of the six that is top of both lists.

The reasoning, shortest version:

1. **No regulator has jurisdiction over the thing being sold.** Not a licence to
   buy, not an exemption to fit inside, not a bond. The exposures that exist are
   § 6152 and the LDA chapter, and both are switched off by a pricing decision
   the plan already made for other reasons.
2. **The buyer is a lawyer**, which is the DoNotPay compliance requirement and
   the customer at the same time, and which makes the liability cap a commercial
   term between businesses rather than a consumer adhesion clause.
3. **Worst realistic outcome is a number that is wrong**, caught by a
   professional whose job is to check it before filing.
4. **It is the same structure as Countercite**, so the entity, the terms, the
   disclaimer discipline, the blocked-phrase fixture and the measurement policy
   in `legal/` all transfer with minor edits. That is a real saving, not a
   rhetorical one.

**Three of the six should be dropped by someone with this stated priority, and I
do not think that is a close call.** Overturn makes the owner a regulated
fiduciary. Hearth and Fourth put a person's health on the other side of a
classifier, in a field where three states legislated on AI in one year and a
fourth made licence-implying design cues actionable. Fourth's own plan says the
right thing: build it last, and possibly not at all.

**Claimable survives only in its fallback form**, the eligibility engine sold as
a monthly seat to hospital financial counsellors. In that form it is a good
second business and it shares Countercite's segment C. In its per-head form it
is the only idea in the portfolio with a felony statute pointed at the pricing
model rather than at the product.

**Overquote is safe and probably not a business.** Its own plan says so and the
liability screen does not change it. If anything is spent on it, spend the
sub-$600 disproof and believe the answer.

### Is the portfolio thesis wrong for this person?

Partly, and it is worth being precise about which part.

The thesis is not wrong about where the money is. It is that arming individuals
against institutions is, by construction, a search for adversarial regulated
situations, and adversarial regulated situations are where liability lives. The
two things the owner wants are in tension in six cases out of seven. The
overlap, the place where both conditions hold, is narrow and specific: **the
product is arithmetic or text comparison rather than judgement, the fee is flat
and unrelated to any outcome, and the buyer is a professional who is already
accountable for the result.** Backpay in its firm form and Countercite are the
two ideas that satisfy all three. Claimable satisfies them in its fallback. The
other four do not, and no amount of drafting makes them.

So the honest answer is not "none of these six". It is that **one of the six
belongs in this business and it is not the one the portfolio led with**, and the
filter that produces that answer would have produced it before any of these
plans were written.

### Does ranking on liability reorder them?

Yes, and one idea makes the full journey.

| Old rank (score) | Idea | New rank (liability) | Move |
|---:|---|---:|---|
| 1 | Backpay | **1** | Unchanged |
| 2 | Overturn | **4** | Down 2 |
| 3 | Hearth | **5** | Down 2 |
| 4 | Claimable | **3** | Up 1 |
| 5 | Fourth | **6** | Down 1 |
| **6, last** | **Overquote** | **2** | **Up 4** |

**Overquote goes from last on the old list to second on the new one.** It was
the idea the README told the owner not to start with, scoring 17 of 30, needing
1,035 paid checks a month. On liability it is beaten only by Backpay, because
there is no licensing regime, no professional monopoly to infringe, no regulator
whose jurisdiction reaches a business that comments on somebody else's paperwork.

That reordering is real and it is also a trap. Overquote's liability is low in
large part **because** nobody has found enough value in it to regulate it, which
is the same fact the revenue ranking was measuring from the other end. The two
rankings are not independent. Low regulation and low willingness to pay are
frequently the same observation about a market, and treating the liability score
as new information about Overquote's prospects would be reading the same number
twice.

The genuinely useful movement is smaller and less dramatic: **Overturn falls
from strongest-money to fourth**, and it falls for a reason the revenue ranking
could not see. The thing that makes it lucrative, controlling the client
relationship and taking a share of the recovery, is the same thing that requires
the licence, the bond, the approved contract and the regulator. And **Backpay
holds first place on both criteria**, which is the only result in this exercise
where the two rankings agree rather than trade off.

---

## Open questions worth an hour of counsel, in order

Each is written to be answerable inside one paid hour and each names the statute
so the hour goes on the answer.

1. **Backpay, California.** Does selling a flat monthly wage-and-hour damages
   subscription to plaintiff-side employment firms, while operating a free
   worker-facing calculator that routes to the Labor Commissioner or to counsel
   with no per-case payment from anyone, implicate B&P § 6152 or § 6125? And
   does a free calculator that cites Labor Code sections require LDA
   registration under §§ 6400 to 6415?
2. **Claimable.** Does a per-enrolment fee paid by a hospital or health plan for
   Medicaid or SNAP enrolments fall within 42 U.S.C. § 1320a-7b(b), and if so
   does a flat monthly seat licence to the same buyer remove it?
3. **Overturn, Texas.** Confirm the criminal grading and the correct section:
   § 4102.206 as a Class B misdemeanour, and § 4102.207 as the insured's option
   to void. Confirm the post-catastrophe solicitation rules in subchapter D.
4. **Hearth and Fourth, if either survives its own gate.** Does the § 4.1 design
   constitute unlicensed practice of medicine or nursing in the launch state,
   does the Illinois WOPR Act reach caregiver emotional support, and is the
   escalation classifier a device under FDCA § 520(o)?

If the budget stretches to one hour only, question 1, because it is the only one
whose answer changes what gets built next week.
