# 3 — Redaction

**The public records tool for the agency that Axon priced out.**

Industry: small law enforcement / municipal records · Buyer: the records office · Platform: Mac

---

## The gap

Body cameras created a records obligation that small agencies cannot afford to
meet, and the failure is documented in both directions — agencies drowning, and
agencies quitting.

**Drowning:**
- One city estimated that producing **22 videos could take over 220 days** and
  thousands of dollars, because of redaction and processing [review].
- "The lack of time and personnel to promptly redact footage has become the
  biggest bottleneck for many police departments" [review].
- Small agencies are "often left to use the software that comes with the camera
  hardware for redaction and then burn and ship DVDs to requesters" [review].

**Quitting:**
- Departments in smaller jurisdictions are **dropping or delaying bodycam
  programs** over cost. East Dundee, Illinois (pop. 3,000) faced **$20,000/year**
  [review].

## The metering, exactly

This is test B in its clearest form anywhere in this document — **the incumbent
bills by the hour of video:**

| Product | Price | Effective rate |
|---|---|---|
| Veritone Redact | from **$600/month**; ~**$9,500/yr per 100 hours** of content | **~$95/hour of video, ~$1.58/minute** [review] |
| Axon redaction add-on | **~$108/user**; ~$9,522/yr per 100 hours | per-seat + volume [review] |
| CaseGuard (desktop) | from **$99/month** | [review] |

A four-hour bodycam shift is ~$380 of Veritone at that rate. An agency with six
officers generates more video per week than its records budget can process. The
cost scales with the crime rate, the staffing, and the public's curiosity —
three things the agency does not control.

**On-device redaction has a marginal cost of zero.** The hundredth hour costs
what the first hour costs. That is not a discount; it is a different category of
product.

## Why cloud is disqualified

- **CJIS Security Policy** governs criminal justice information and constrains
  where it may be processed and by whom [standard — cited by category; the
  specific clause was not read for this brief and must be verified].
- Uploading unredacted bodycam footage means the faces of victims, minors,
  witnesses and bystanders — people with no involvement in any offence — are
  transmitted to a vendor before being blurred. The redaction exists precisely
  to stop that exposure, and the cloud workflow performs the exposure first.
- Video is enormous. Upload time is itself a bottleneck for a rural agency.

## What it is

A Mac application for a records clerk. Not a platform, not a suite.

- Drop in footage. On-device detection blurs faces, licence plates, screens and
  documents; on-device speech identifies and bleeps names, addresses, dates of
  birth, phone numbers.
- **A redaction log as a first-class output.** Every redaction: timestamp, what
  was obscured, the exemption claimed, and whether a human confirmed it. A
  public records denial or partial release is challengeable, and the log is what
  the agency files when it is challenged.
- **It refuses to export while any auto-detected face is unreviewed.** A missed
  face in a released video is a lawsuit; the product's opinion is that the
  machine may find them but may not clear them.
- Tracks the statutory response clock per request.

## The innovation

Everyone sells redaction as a video-editing problem and charges for compute.
**This sells it as an evidence problem and charges nothing for compute** — the
deliverable is not the blurred video, it is the defensible record of what was
withheld and why. That artefact is what the agency actually needs when a
requester or a newspaper pushes back, and nobody is selling it.

## Money

| Price | Against Veritone | Customers for $250k/yr |
|---|---|---|
| $199/mo ($2,388/yr) | **75% cheaper** at 100 hrs/yr | 105 |
| $299/mo ($3,588/yr) | **62% cheaper**, still unlimited | 70 |
| $399/mo ($4,788/yr) | **50% cheaper**, unlimited | 53 |

**70 small agencies at $299/mo is a $250k business.** The pitch is a single
sentence: *half the price, no hour limit, and the footage never leaves your
building.*

**The number of US law enforcement agencies is not established in this
research** and must be verified before any sizing. It is widely cited as
~18,000; that figure was not sourced here and should not be relied on.

## Risks — and this is the weakest idea on buyer, not on need

- **Test C is the problem.** A municipal purchase, even a small one, is a
  purchase order, a budget line and possibly a council vote. It is not an App
  Store subscription. This is the same failure that cut child protective
  services from this set, and it is only partly mitigated here by the fact that
  a $299/mo desktop tool can often go on a p-card.
- **Face detection failure is a liability event**, not a bug. The refusal gate is
  the mitigation and it must never be defeatable.
- **Axon owns the account.** Where Axon supplies the cameras, the redaction
  add-on is a checkbox on an existing contract. This product only lives in
  agencies that do not have Axon — which is exactly the group with no budget.
- Sales cycle is long, references matter enormously, and one bad release ends it.

## The one test that settles it

**Cost: five phone calls, one afternoon.** Call five records officers at
agencies under 25 sworn officers. Ask three things and nothing else: *how many
hours of video are you behind, what do you pay for redaction today, and who
signs off on a $3,000 software purchase.*

**Decision rule, written first:** if three of five cannot name a person who can
approve $3,000 without a council vote, test C has failed and this is an
enterprise business, not this business. Do not build it.
