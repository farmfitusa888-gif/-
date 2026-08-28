# The gate every idea had to pass

Researched 2026-08-28. Eight ideas survived. Several strong-looking candidates
did not, and they are listed at the bottom with the reason.

---

## 1. What was actually asked for

Four constraints, taken from your answers, not inferred:

1. **Innovation quality only.** Trueline's *level* of innovation carries over.
   Nothing else does — not the industry, not the sensor, not the product shape.
   No measurement app, no scanning app, no field-service contractor tool appears
   in this set. None of the eight industries in the previous project appears
   either.
2. **AI is the product.** Not "AI-assisted." The thing is impossible without a
   model doing the central work.
3. **Solo-buildable, and Trueline's hard constraints hold:** offline-first, no
   server, zero marginal cost per customer, App Store subscription.
4. **Real demand, and it has to pay.**

## 2. The collision, and why it is the whole idea

Constraints 2 and 3 fight. Every cloud LLM call costs money per customer, so a
flat unlimited price dies the moment a heavy user arrives. That is not a detail;
it is the reason almost every AI product on the market meters.

There is exactly one resolution: **the model runs on the device.**

And that resolution is not a compromise — it is the search itself. If your
inference is free and local, the only places worth competing are the places
where cloud AI is **not merely unpleasant but disqualifying**. So the gate:

> **Is there a law, a duty, a signal problem, or a price floor that makes
> sending this data to a server unacceptable — not inconvenient, unacceptable?**

That single question does more filtering than any market-size screen. It
disqualifies most consumer AI, most productivity software, and every idea whose
honest answer is "cloud would be fine, we just prefer local."

## 3. The four tests, all of which had to pass

| | Test | The question |
|---|---|---|
| **A** | **Cloud is disqualified** | Is there a statute, an ethics rule, a confidentiality duty, or an absence of signal that makes a server the wrong answer? |
| **B** | **The field meters** | Do incumbents charge per seat, per note, per page, per gigabyte, per minute of video — so that the low-volume operator subsidises the high-volume one? |
| **C** | **The buyer holds the credit card** | Is the person in pain the person who buys? An idea whose buyer is a government procurement office is a different business, and not this one. |
| **D** | **The work is real and constant** | Is this a documented, recurring, hours-per-week burden with evidence behind it — not a hypothesis about what someone might want? |

Test **C** killed more good ideas than the other three combined.

## 4. Sourcing discipline

Same classes as the previous project, because a brief without them is a pitch:

- **[vendor]** — read off the company's own page.
- **[review]** — reported by a third-party review, comparison, trade or news
  site and **not independently confirmed**.
- **[standard]** — a published technical standard or regulation.
- **[derived]** — arithmetic on other figures here; the inputs are named.
- **[assumption]** — mine, marked at the point of use.

### Two warnings that materially affect how much you should trust this document

**First: no vendor page in this research was read directly.** The network egress
proxy in this environment blocked every direct fetch attempted
(`sagereport.com`, `mentalyc.com`). **Every price in this document therefore
arrives via a search-result summary of a third-party page — none of it is
[vendor] class, all of it is [review].**

**Second: comparison sites are usually run by a competitor or an affiliate.**
Visible in this research: the Upheal-vs-Mentalyc comparison is published by
Mentalyc; several "best software 2026" pages are affiliate-monetised.

> **Treat every price in this document as a lead to verify by phoning the
> vendor, not as a fact.** No pricing decision should be made on these numbers.

**Nothing here was measured.** No accuracy claim was tested on a device. Where a
number would decide whether an idea works, the brief says so and says it is
unmeasured.

## 5. The honest weakness of this set

**Five of the eight are "confidential speech becomes a document."** That is a
cluster, and you should know it is one before you read eight briefs and mistake
repetition for consensus.

It is partly a real finding — free on-device transcription (see
[`research/00-PLATFORM-GATE.md`](research/00-PLATFORM-GATE.md)) is the single
biggest cost line that just went to zero, and it went to zero precisely in the
markets where cloud was already forbidden. Three of the eight (1, 3, 4) are
document- and vision-shaped instead, and they are deliberately there so the set
is not a monoculture.

But if the transcription quality gate fails on real field audio — a barn, a
courtroom, a crying child, a moving vehicle — it fails for five ideas at once.
**That is a correlated risk across most of this portfolio and it is testable in
an afternoon.** It is the first thing to test, before anything else in here.

## 6. Considered and cut

Recorded so a gap is not mistaken for an oversight.

| Candidate | Why it was cut |
|---|---|
| **Mobile / large-animal veterinary notes** | Test D passes and offline is genuinely needed — but the category is already served. DaySmart Vet ships voice-to-SOAP with offline operation today [review], and StableTrack, Digitail and SimpleDVM all target mobile practice. Late, not empty. |
| **General private-practice therapy notes** | The metering is textbook (Mentalyc tiers cap notes; Upheal charges per session) but cloud is *uncomfortable*, not *disqualified*, under HIPAA-with-a-BAA. Test A fails. It survives only in the narrowed form of idea 7, where a stricter rule applies. |
| **General ambient medical scribing** | Abridge, Nuance DAX, Freed, Heidi. Well-funded, entrenched, and cloud is permitted. Fails A and D-as-a-gap. |
| **Child protective services, sold to the agency** | The demand evidence is the strongest in this entire document — 15% of the week in front of families, ~400 forms and ~2,500 pages per case, 30–40% turnover [review]. It fails **test C** brutally: the buyer is a state procurement office, the cycle is 12–24 months, and it is not an App Store subscription. It survives only reshaped into idea 8, sold to the worker or the small private agency. |
| **Bodycam redaction sold to large agencies** | Axon owns the account and bundles it. Survives only as idea 3, aimed at the small agency Axon's pricing has priced out. |
| **Consumer insurance-denial appeals** | Real pain, but cloud is fine, willingness to pay is low, and it is a one-time purchase, not a subscription. Fails B, C and D. |

