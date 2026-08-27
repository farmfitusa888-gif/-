# 8 — What is behind this wall

**The pre-drywall record: every pipe, wire, stud and duct captured with real
coordinates before the walls close — sold as a deliverable, not a subscription
feature.**

The one idea in this set that creates a **new billable line item** rather than
making an existing one cheaper.

---

## The job today

For about three days on every renovation and every new build, the walls are open
and everything is visible. Then they close, and for the next forty years
everybody who touches that building is guessing.

The electrician cutting into a wall guesses. The plumber guesses. The next
remodeler cuts an exploratory hole. The homeowner hangs a shelf and hits a PEX
line.

**Today the record of that three-day window is a handful of phone photos in
somebody's camera roll, with no scale, no position and no way to find them
again in four years.** They are effectively lost the moment the job ends.

## Where it sits

| Product | What it is | Price | Source class |
|---|---|---|---|
| ScanManifold | Photo documentation; Photo+Scan adds 3D measure | **$16/user/mo** (Photo), **$24/user/mo** (Photo+Scan), no seat minimums | [review] |
| DocuSketch | 360° capture + sketch + scope, restoration-focused; hardware included | not published | [vendor] |
| Raken, Fieldwire, Procore | General construction documentation | per-user, tiered | [vendor] |
| Camera roll | What actually happens | free | — |
| **This** | Positioned pre-drywall record → permanent, transferable building document | per-record + subscription | — |

**Everybody in this table sells the contractor a subscription to store photos.**
Nobody sells the *building* a permanent record, and nobody has noticed that the
person who benefits most is not the contractor at all.

## The wedge

**The record is anchored in measured space, and it is sold to the homeowner.**

**1. Position, not photographs.** A photo of a stud bay tells you nothing in four
years. A photo with the camera's exact pose attached, registered into a measured
room model, tells you *the cold water line runs 34 3/8" off the east wall,
between 41" and 44" up.* **Trueline already photographs the room every two
seconds with the camera's exact pose attached to each shot.** That capability
exists and is currently used only as a visual record — here it is the entire
product.

**2. What was seen and what is inferred.** A pipe visible in three frames and
triangulated is `measured`. A pipe that disappears behind a joist and was
reasoned about is `derived`, and prints that way. **Somebody is going to cut
into this wall based on your document.** The distinction between "we saw it" and
"we think it continues" is the difference between a product and a liability.

**3. The business model nobody in the table is using.** This is not sold as a
contractor's storage subscription. It is sold as **a deliverable the contractor
charges the homeowner for** — $150–$400 a job [assumption], on the same invoice
as everything else, at essentially zero cost to produce because the walls were
open anyway and the scan takes twenty minutes.

**The contractor's pitch to the homeowner writes itself:** *"When you sell this
house, or the next guy opens this wall, you will have this."* It is a
differentiator on the bid, a margin line, and a reason to be chosen over the
contractor who did not offer it.

And it produces something genuinely new: **a building record that transfers with
the property.** Self-contained, opened with no app and no login — Trueline
already ships exactly that artefact as "one self-contained file a homeowner
opens with no app and no login."

## The four-pattern check

- **A — trusted data.** Seen vs. inferred, on a document somebody will cut a wall
  open trusting.
- **B — whole job.** Photos in one place, plans in another, as-builts nowhere.
- **C — sensor → money.** LiDAR + posed photos → positioned record → a line item
  on the invoice. **The only one of the eight where the sensor output *is* the
  sellable good.**
- **D — small operator.** A per-user photo subscription is pure cost to a
  two-man shop. This is revenue.

## What gets built

The highest reuse of any idea here except templating:

| Needed | State |
|---|---|
| LiDAR room capture | **Built** |
| Photos every 2s with exact camera pose | **Built** |
| Exact integer geometry and provenance | **Built** |
| Self-contained client file, no app or login | **Built** |
| Offline-first | **Built** |
| Invoicing and the price book | **Built** |
| Register a photo's pixel to a wall coordinate | New — the core work |
| Trace a run across frames; label services | New |
| Long-term archive format and property transfer | New, and mostly a format decision |

**The archive is the one place the no-server rule strains.** A record meant to
outlive the job cannot depend on a contractor's iCloud. The honest answer is
that the deliverable is a **self-contained file the homeowner owns and stores** —
which is exactly Trueline's existing pattern, and which keeps marginal cost at
zero. A hosted vault is an obvious later tier and should be priced as its own,
exactly as `docs/v3.md` argues for the hosted client link.

## The gate and the price

- **Free forever** — capture, view, 1 record kept.
- **Paid** — issue the record as a deliverable, unlimited records, branding.

**$49/month**, plus the contractor charging $150–$400 per record [assumption].
**Lead with the second number.** This is the only idea in the set where the pitch
is "this makes you money" rather than "this saves you money," and that is a much
shorter sale.

## Where it fails, ranked by likelihood

1. **The value is real and arrives four years late.** *(Most likely, and it is
   the structural problem.)* The homeowner pays today for a benefit they may
   never consciously use. That is the economics of insurance, and insurance is
   sold, not bought. **If contractors will not pitch it, it does not sell** — and
   asking a contractor to sell something extra at closing is asking a lot.
2. **Registering a pipe in a photo to a wall coordinate is real computer
   vision.** *(Plausible.)* The pose is known, which helps enormously. Whether
   a person can tap a pipe in one frame and get a trustworthy 3D position across
   frames is **unmeasured**. The safe degradation — tap the pipe in two frames
   from different angles and triangulate manually — is slower and probably
   sufficient. Build that first.
3. **Liability, and it is worse than it looks.** Somebody will cut into a wall
   trusting this document and hit something. The `measured`/`derived` marking is
   the defence, and the record must say plainly that it is a record, not a
   locator, and never replaces scanning the wall before cutting.

## The one test that settles it

Ask five remodelers: *"if this took twenty minutes with the walls open, would
you put $250 on the invoice for it?"* **You are testing whether they will sell
it, not whether they would use it.** If four say yes, this is the best business
in the set.
