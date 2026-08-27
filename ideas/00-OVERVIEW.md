# The eight at a glance

Eight industries where a number that decides money is currently guessed.

Each one is a product that **measures** that number, **marks what it does not
know**, lets a human override the sensor and re-solves around the override, and
carries the result all the way to a priced, signed document — sold flat and
unlimited into a field that meters, with no server behind it.

---

## The eight

| # | Idea | Industry | The wedge, in one line |
|---|---|---|---|
| 1 | **Templating** | Stone / countertop fabrication | Refuses to export to CNC until a tape has touched every cut edge |
| 2 | **Fire & life-safety inspection** | Fire protection | Works in the basement; the report says what was *assumed*, not just what passed |
| 3 | **The binding estimate** | Household goods moving | The estimate prints what was measured and what was guessed |
| 4 | **The honest weight** | Cattle production | The only one that publishes its error band instead of claiming ±3% |
| 5 | **Range of motion** | Physical therapy / chiropractic | No server means patient data never reaches infrastructure you own |
| 6 | **Floor prep** | Flooring installation | Won't certify the slab — tells you where to put the straightedge, then prices the prep |
| 7 | **Barrier survey** | Accessibility compliance | A survey is evidence, and evidence has provenance or it is worthless |
| 8 | **What's behind this wall** | Construction / property | Sells the homeowner a permanent record — a new invoice line, not a cost |

## Scored on six axes

Innovation, industry need, competitive advantage, buildability, creativeness,
monetisation. **1–5 each. These scores are judgement, not measurement** — they
exist to force a ranking, and the reasoning behind every one is in the brief
that follows.

| # | Idea | Innov. | Need | Advantage | Build | Creative | Money | **Total** |
|---|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| 7 | Barrier survey | 4 | 4 | **5** | 4 | 4 | **5** | **26** |
| 8 | What's behind this wall | **5** | 3 | **5** | 4 | **5** | 4 | **26** |
| 1 | Templating | 4 | **5** | 4 | **5** | 3 | 4 | **25** |
| 6 | Floor prep | 3 | **5** | 4 | **5** | 3 | 3 | **23** |
| 2 | Fire & life-safety | 3 | **5** | 4 | 2 | 3 | **5** | **22** |
| 3 | The binding estimate | 4 | 4 | 3 | 3 | 4 | 4 | **22** |
| 5 | Range of motion | 4 | 4 | 4 | 3 | 4 | 3 | **22** |
| 4 | The honest weight | 3 | 3 | 2 | 3 | **5** | 2 | **18** |

**Buildability is scored against a hard constraint** — one person, iOS plus web,
offline-first, no server, zero marginal cost per customer. That constraint cut
more candidates than the market analysis did. It is why there is no marketplace
here, no two-sided network, and nothing that depends on a licensed third-party
database.

## Which to build

**7 — the barrier survey — is the strongest business.** The buyer already bills
**$1,700–$4,500 per survey**, so the return on a subscription is a single line of
arithmetic rather than an argument. And a barrier survey is read in litigation,
which makes "what was measured versus what was assumed" a professional necessity
rather than a nice-to-have. Its risk is distribution, not product: outside
California there is no register of accessibility consultants to sell into.

**8 — what's behind this wall — is the best idea.** It is the only one of the
eight where the contractor **makes** money instead of spending it: the record is
a $150–$400 line item on a job where the walls were already open, which is a far
shorter sale than any subscription pitch. It is also the most defensible — nobody
in the category has noticed that the person who benefits most is the homeowner,
not the contractor. Its risk is that the value arrives four years late, and
latent value has to be sold rather than bought.

**1 and 6 are the fastest to a working prototype**, and both are gated on a
single unmeasured accuracy figure that one afternoon of testing would settle.

**4 is the one not to build.** It is the most creative idea here and it is
genuinely late: four phone-based competitors already exist, one of them already
using the same sensor.

## Before writing any code

Every brief ends with **one test that settles it**, each chosen to cost a day or
less and to be runnable *before the first commit*. Idea 1's test costs one slab.
Idea 6's costs one afternoon. Idea 8's costs five phone calls.

Several of these ideas are gated on an accuracy figure that **does not exist in
public sources and was not measured here**. Those gates are named in each brief
and listed together in the closing pages. Running the test is cheap. Building
first and discovering the sensor cannot hold the tolerance is not.
