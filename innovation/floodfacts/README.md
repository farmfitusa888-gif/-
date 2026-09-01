# Flood facts

What flood insurance actually costs where you are, and what people actually got
paid when they claimed.

## Why this exists

FEMA publishes the entire National Flood Insurance Program as two redacted bulk
files: over 80 million policy transactions and over 2 million claims, updated
roughly monthly. FEMA's own data page warns the files are too large for Excel.

That warning is the opportunity. Everything a homeowner can currently find is
either a flood **risk score** (First Street's, embedded in Redfin and Realtor)
or a **national average premium** quoted in an article. Neither answers what
people are actually asking.

Three numbers this can answer and nothing else does:

1. **What policies here actually cost.** Median and spread, by county and flood
   zone, from premiums people were really charged.
2. **How often policies here claim**, expressed per policy-year so the figure
   means something.
3. **What share of the assessed loss got paid.** Nobody publishes this, and it
   is the number behind the fear.

## Why it fits the constraints

No customer. Nobody signs up, nobody pays, nobody has an account. Revenue would
be display advertising and plain affiliate links. It needs no entity, no
outreach and no contact of any kind, which is the whole of `../CONSTRAINTS.md`.

And it survives what killed the ad-supported category generally: the answer
requires the reader's own address, so an AI summary cannot pre-empt it.

## Status

The pipeline is written and tested. It has **never run against the live API**,
because this environment's proxy returns no response for fema.gov. Everything
network-facing is written from the documented OpenFEMA v2 interface and marked
as unverified in the code. Everything else is exercised against a fixture.

```
python3 floodfacts/tests/test_pipeline.py     # 13 tests, no network
python3 floodfacts/tests/make_fixture.py      # synthetic NFIP extract
python3 floodfacts/pipeline/aggregate.py      # end to end on the fixture
python3 floodfacts/pipeline/fetch.py --dry-run
```

The fixture is built with known parameters, so the pipeline can be checked
against the truth rather than against itself. Cost centres of 1150, 480, 4200,
1900 and 420 come back as medians of 1151, 481, 4112, 1888 and 415, and the
eleven-policy cell suppresses.

## The two decisions that change the answers

**Medians, never means.** Insurance costs are right-skewed and the fixture
includes the commercial policies that prove it. A mean would be technically true
and practically a lie.

**Cells below 25 policies are suppressed, not estimated.** Below that a median
is noise, and a county-and-zone cell with three policies in it edges toward
identifying them. Suppressed cells report no figure at all rather than a number
carrying an error bar the reader will never see.

## What would kill it

Insurance advertising is regulated. Running a lead form would make the operator
an insurance producer in many states, so the design is display and plain
affiliate links only, with no contact ever collected. Second risk: FEMA stopping
publication, which has no mitigation beyond keeping the extracts.
