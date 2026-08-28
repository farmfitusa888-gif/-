# 5 — The evaluation

**The psychoeducational report, drafted where the student data already lives.**

Industry: school psychology · Buyer: the psychologist, then the district · Platform: Mac + iPad

---

## The gap

School psychology is in a documented staffing crisis, and the binding constraint
on the people still in the job is report writing.

| Figure | Source class |
|---|---|
| **~43%** of school psychology positions unfilled or filled by uncredentialed staff | [review] |
| National ratio **1,071 students : 1 psychologist** (2024–25) | [review] |
| NASP recommended ratio | **500 : 1** [standard] |
| Consequences reported: **delayed evaluations**, reduced prevention services, limited crisis response | [review] |
| A veteran psychologist using an AI tool drafts an evaluation in **under two hours, versus a full day** | [review — vendor-adjacent claim, unverified] |

The ratio is **more than double** the professional standard, and the work that
gets protected is the legally mandated special education evaluation — meaning
prevention and counselling are what get dropped. Evaluations are 20–40 pages,
integrate several standardised instruments, and are legally consequential: an
IEP eligibility decision rests on them and parents can and do challenge them.

## The competitive picture — this one is contested, and recently

**SageReport launched in March 2026**, built by practising school psychologists,
"available nationwide for individual school psychologists and organizations,"
promising "psychoeducational reports in minutes, not hours" [review]. PAR — the
publisher of many of the instruments themselves — ships an **AI Report Writer**
[review].

**This is not an empty category.** It became contested five months ago. The
honest position is that this idea competes on the two things a cloud product
cannot match, or it does not compete at all.

SageReport's trial is described as "2 free evaluations" [review], which
suggests **metering by evaluation**. Their actual pricing could not be
retrieved — the egress proxy blocked the page — so **this is a lead, not a
fact, and it is the single most important thing to verify before pursuing this
idea.**

## Why cloud is disqualified

- **FERPA** governs student education records [standard]. Districts have
  approval processes for any vendor touching student data, and a great many
  refuse cloud AI vendors outright or take a year to approve one.
- The raw material is a child's cognitive scores, behavioural observations,
  disability status and family history. There is no more sensitive data in a
  school building.
- **The procurement argument is the sales argument.** A tool that processes
  nothing off-device may not need a district data-privacy agreement at all —
  and a psychologist who can install a tool without a nine-month vendor review
  is a psychologist who becomes a customer this week. That is a real and
  underrated wedge: it changes the *sales cycle*, not just the privacy posture.

## What it is

A desktop application that assembles a draft evaluation report from the
psychologist's own materials — protocol scores entered by hand or photographed,
observation notes, interview recordings transcribed on device, prior records.

- **Every assertion is tagged with where it came from**: this instrument, this
  subtest, this observation, this parent interview, this teacher report. On
  screen and in the export. The provenance discipline, applied to a claim about
  a child.
- **It refuses to export a report containing a score the psychologist has not
  confirmed.** Transposed subtest scores are a real and serious error mode with
  legal consequences, and a model that reads a number off a photographed
  protocol is exactly where that error would enter.
- Writes the same finding at two registers — the technical section and the
  parent-facing summary — from one structured source, so they cannot contradict
  each other. Reports where the summary and the body disagree are a known
  problem and a due-process risk.
- Never proposes an eligibility determination. It is a drafting tool, and the
  refusal is a feature: eligibility is a team decision under IDEA, and a product
  that suggests one is a product that will eventually be quoted in a hearing.

## The innovation

The category is racing to write the report faster. **This one competes on
whether the report can be defended** — a due-process hearing asks where a
statement came from, and this is the only version that can answer per sentence.
Secondarily, and commercially more important: it is the only version that a
psychologist can install without asking the district's data-privacy officer.

## Money

| Price | Customers for $250k/yr |
|---|---|
| $39/mo | 535 |
| $59/mo | 354 |
| $99/mo (district seat) | 211 |

**The buyer count is not established.** A ratio of 1,071:1 implies a headcount
derivable from national K-12 enrollment, but **no enrollment figure was sourced
in this research and I will not manufacture one.** Verify before sizing.

The stronger commercial route is almost certainly **district site licences**
rather than individuals — a district with eight psychologists is one sale, not
eight — but that reintroduces exactly the procurement problem the on-device
story was supposed to solve. That tension is unresolved and should be resolved
before building.

## Risks

- **SageReport and PAR are ahead**, and PAR owns the instruments.
- **Test C is ambiguous.** Some psychologists buy their own tools; most expect
  the district to. This is the least certain buyer in the set after idea 3.
- Score extraction from photographed protocols may be unreliable, and
  publishers may object to it on copyright grounds.
- Seasonal: evaluation load is wildly concentrated in the school year.

## The one test that settles it

**Cost: one phone call plus one afternoon.** First, phone SageReport as a
prospective customer and get the actual price and whether it meters. If it is
flat and cheap, this idea is substantially weaker and you should know that
before anything else.

Then: photograph ten completed practice protocols and measure **score
transcription accuracy**. Decision rule, written first: **anything below 99%
means the psychologist must check every score by hand**, the time saving
evaporates, and the product must be repositioned around narrative drafting only
— which is precisely where the incumbents already are.
