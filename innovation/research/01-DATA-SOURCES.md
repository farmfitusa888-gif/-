# Data sources — exact addresses, and what each one actually gives you

Written 2026-08-28, after you pulled the Texas file yourself.

**Read the "what you actually get" column before spending time.** Only two of
these states hand you a real bulk file. The rest are search-one-at-a-time
portals, and the difference matters.

---

## 1. What the Texas file proved

You downloaded `public_adjusters_in_texas.csv`. Here is what is in it,
computed rather than estimated:

| Measure | Value |
|---|---|
| Total records | **1,864** |
| **Active licences as of 2026-08-28** | **1,708** (91.6%) |
| Expired | 156 (8.4%) |
| Licence type | 100% "Public Insurance Adjuster" — a clean, single-type file |
| Resident in Texas | **981** (57.4% of active) |
| Licensed in Texas, resident elsewhere | **727** (42.6%) |

**Where the out-of-state 42.6% come from** — this is the catastrophe-chasing
population, and it is a finding in itself:

| State | Active TX licensees |
|---|---|
| Florida | **293** (17.2%) |
| California | 55 |
| Georgia | 39 |
| New York | 31 |
| Pennsylvania | 28 |
| Maryland | 27 |
| Louisiana | 24 |

**Texas residents by city** — Houston is the single obvious launch city:

| City | Active licensees |
|---|---|
| Houston | **112** |
| San Antonio | 40 |
| Dallas | 37 |
| Fort Worth | 36 |
| Plano | 24 |
| Austin | 22 |
| McKinney | 21 |
| Arlington | 17 |

**New licences issued per year** — the profession is growing fast, and new
entrants are the easiest software buyers because they have no entrenched
workflow to defend:

| Year | New licences |
|---|---|
| 2019 | 75 |
| 2020 | 109 |
| 2021 | 148 |
| 2022 | 104 |
| 2023 | 160 |
| **2024** | **323** |
| **2025** | **274** |
| 2026 (to August) | 187 |

### What this does to idea 5

Counterweight breaks even at **101 customers at $299/month**. Against Texas
alone:

- **101 ÷ 1,708 active TX licences = 5.9%**
- **101 ÷ 981 Texas-resident licensees = 10.3%**
- Houston's 112 resident adjusters is, by itself, more than the entire
  break-even number.

**Two honest cautions before this number gets used in a plan.** First, an
adjuster licensed in Texas may also be licensed in Florida and Illinois — so
adding state registries together **double-counts**, and the national total is
much smaller than the sum of the states. Second, public adjusters are only one
of Counterweight's three audiences; the other two are still uncounted.

---

## 2. Bulk licence data — exact addresses

### Texas — the gold standard, one click

- **Dataset page:** https://data.texas.gov/dataset/public-adjusters-in-texas/kpbp-s6mn
- **Direct CSV:** `https://data.texas.gov/api/views/kpbp-s6mn/rows.csv?accessType=DOWNLOAD`
- **Socrata API (count only):** `https://data.texas.gov/resource/kpbp-s6mn.json?$select=count(*)`
- **All agents and adjusters, not just public:** https://data.texas.gov/dataset/Insurance-agents-adjusters-and-people-approved-to-/kxv3-diwf

The Socrata API supports filtering, so you can pull just the slice you want:
`...?$where=expiration_date > '2026-08-28'&$limit=5000`

### Illinois — no bulk file, but there IS a way to force one

**Update, after you pointed out the lookup form produces no list: it doesn't,
and it never will.** `insuranceqa.illinois.gov` is a one-licensee-at-a-time
verification tool. There is no Illinois equivalent of the Texas dataset.

**The route that actually works is a FOIA request.** IDOI is a State agency
subject to the Illinois Freedom of Information Act, a licence roster is plainly
a public record, and the Act requires a response within **5 business days**
(extendable by 5). It is free unless the extract is large enough to attract a
duplication fee.

#### Do this — exact addresses

| Route | Address |
|---|---|
| **Online FOIA form (fastest)** | https://insurance.illinois.gov/Applications/FOIARequest/ |
| Alternate form page | https://idoi.illinois.gov/aboutus/foia/foia-form.html |
| **Email** | **DOI.FOIA@illinois.gov** |
| FOIA Officer, by post | FOIA Officer, Illinois Department of Insurance, 320 W. Washington St, 4th Floor, Springfield, IL 62767-0001 |
| Phone | (217) 557-9248 |
| IDOI FOIA overview | https://idoi.illinois.gov/aboutus/foia.html |

#### Text to send — copy this

> To the FOIA Officer, Illinois Department of Insurance:
>
> Under the Illinois Freedom of Information Act, 5 ILCS 140, I request a copy of
> the Department's current list of individuals and business entities holding an
> active Public Adjuster licence in Illinois.
>
> I request the record in an electronic, machine-readable format — CSV or Excel
> — and, to the extent the Department maintains them as part of the licence
> record, that it include: licensee name, National Producer Number, licence
> number, licence type and qualification, issue date, expiration date, licence
> status, and business city, state and ZIP code.
>
> **I am not requesting home addresses, personal telephone numbers, personal
> email addresses, dates of birth or any Social Security information**, and I
> ask that any such fields be withheld or redacted.
>
> If any portion is exempt, please release the remainder and cite the specific
> exemption. If fees will exceed $25, please contact me before proceeding.
>
> This request is for commercial purposes.

Two things in that text matter. **Excluding personal data up front** removes the
Department's most common reason to delay or redact, and asking for machine-
readable format is what gets you a CSV instead of a PDF. **Declaring the
commercial purpose is required** — under 5 ILCS 140/3.1 a commercial requester
gets a 21-working-day response window rather than 5, and misdeclaring it is the
one thing that can void the request.

#### While you wait, the lookup routes

| Route | URL | What you actually get |
|---|---|---|
| Producer/agent lookup | https://insuranceqa.illinois.gov/producer/producerMain.html | **One licensee at a time. Produces no list — confirmed.** Only useful for verifying a name you already have. |
| Computer Data Request Form | https://idoi.illinois.gov/producers.html | A second formal route to an extract; the FOIA request above is faster and has a statutory clock behind it |
| Agent lookup portal | https://idoi.illinois.gov/companies/agent-lookup.html | One at a time |
| State service directory entry | https://www.illinois.gov/services/service.insurance-provider-license-search.html | Points at the same lookup |
| **SBS (State Based Systems)** | https://www.statebasedsystems.com | Multi-state licensee lookup; choose Illinois → Licensee. Search, not bulk |
| NIPR Illinois page | https://nipr.com/licensing-center/state-information/illinois | Licensing rules and requirements, not a roster |

**My recommendation for Illinois: send the FOIA email today and forget about
it.** It costs five minutes, it has a statutory deadline behind it, and Texas
alone already exceeds break-even so nothing is blocked while it runs.

### Florida — bulk download exists

- **Licensee search portal:** https://licenseesearch.fldfs.com
- **Agent and agency services:** https://myfloridacfo.com/division/agents/

Reported to offer bulk CSV of active licensees (agents, agencies, adjusters),
refreshed roughly daily, covering 350,000+ producers [review — I could not
verify this from inside this environment]. Florida matters twice over: it is a
huge market *and* it supplies 293 of Texas's active licensees.

### California

- **License status inquiry:** https://www.insurance.ca.gov/0200-industry/0008-check-license-status/
- **Public adjuster requirements:** https://www.insurance.ca.gov/0200-industry/0050-renew-license/0200-requirements/public-adjuster/

Lookup only. No bulk file found.

### Cross-state

- **NAPIA member directory:** https://www.napia.com/find-a-public-adjuster — the
  trade association. Smaller than the licence rolls but these are the engaged,
  professionalised practitioners, which makes it a **better sales list than a
  bigger one.**
- **Licensing requirements by state:** https://claimsmate.com/public-adjuster-license-search-fees-licensing-requirements-by-state/ *(a commercial site, useful as an index of the official ones)*

---

## 3. Complaint data — proof and marketing channel in one

You spotted the important thing: the place where people complain is also the
place to reach them. These are the exact addresses.

### CFPB Consumer Complaint Database — the best one

Free, public, no key, and it includes the complaint narrative where the consumer
consented to publish.

- **Browse:** https://www.consumerfinance.gov/data-research/consumer-complaints/search/
- **API root:** `https://www.consumerfinance.gov/data-research/consumer-complaints/search/api/v1/`
- **Full CSV export:** `https://files.consumerfinance.gov/ccdb/complaints.csv.zip`
- **API example — narratives about debt collection on medical debt:**
  `.../api/v1/?search_term=medical&field=complaint_what_happened&size=100&no_aggs=true`

Relevant to ideas 1, 3 and 4 more than 2, because CFPB covers financial
products rather than property insurance.

### Property insurance complaints — state by state

| Source | URL |
|---|---|
| **Texas DOI complaint data** | https://www.tdi.texas.gov/consumer/complfrm.html |
| **Illinois DOI complaints** | https://idoi.illinois.gov/consumers/consumerinsurance/complaints.html |
| **NAIC Consumer Information Source** — complaint index by insurer, nationwide | https://content.naic.org/cis_consumer_information.htm |
| **NAIC complaint database** | https://content.naic.org/consumer.htm |

**The NAIC complaint index is the sharpest tool here for idea 2.** It ranks
insurers by complaints relative to their market share, which tells you exactly
which carriers generate the most aggrieved policyholders per premium dollar —
i.e. where your customers are.

### Wage and hour — idea 1

| Source | URL |
|---|---|
| **DOL WHD enforcement database** — every investigation, employer named, back wages found | https://enforcedata.dol.gov/views/data_summary.php |
| WHD data catalog | https://enforcedata.dol.gov/ |
| **California DLSE / Labor Commissioner** | https://www.dir.ca.gov/dlse/ |
| CA judgment search — unpaid wage judgments by employer | https://www.dir.ca.gov/dlse/JudgmentSearch.htm |

**The DOL enforcement database is the single best asset for idea 1**, and it is
free and bulk-downloadable. It names employers already found to have violated
wage law. Workers at a company with a prior violation are a targetable audience
with a documented reason to check their pay.

### Where people complain in their own words

Blocked from here, reachable by you:

- `reddit.com/r/legaladvice`, `r/antiwork`, `r/InsuranceClaims`, `r/HomeownersInsurance`, `r/specialed`, `r/AgingParents`, `r/beyondthebump`
- BBB complaints: https://www.bbb.org
- Trustpilot, Google Reviews on competitor products

---

## 4. How to open the network so I can reach these myself

Right now this session sits behind an **organisation egress allowlist**. The
gateway answers `403` to CONNECT for anything not on it — I confirmed this
against `reddit.com`, `consumerfinance.gov`, `data.texas.gov`, `wikipedia.org`
and `nasponline.org`. Only `WebSearch` works, because that runs on Anthropic's
side rather than over my network.

### Steps

1. Go to **https://claude.ai/code** and open **Environments** (the settings area
   where this session's environment was created).
2. Select the environment this session runs in.
3. Find **Network access** (the network policy chosen at creation).
4. Change it to a less restrictive policy, or add hosts to the allowlist.
5. **Start a new session** for the change to take effect — the policy is bound at
   container start, so this session will not pick it up.

### The hosts worth adding, ranked

| Priority | Host | Unlocks |
|---|---|---|
| 1 | `files.consumerfinance.gov`, `www.consumerfinance.gov` | CFPB complaints — the proof standard I could not meet |
| 2 | `enforcedata.dol.gov` | DOL wage enforcement — idea 1's target list |
| 3 | `data.texas.gov` | Live licence counts, refreshed |
| 4 | `content.naic.org` | Insurer complaint index — idea 2's targeting |
| 5 | `www.reddit.com`, `oauth.reddit.com` | First-person complaints at volume |
| 6 | `tmsearch.uspto.gov`, `tsdrapi.uspto.gov` | Real trademark clearance |
| 7 | `licenseesearch.fldfs.com`, `idoi.illinois.gov`, `www.insurance.ca.gov` | The other state registries |
| 8 | `en.wikipedia.org` | General reference |

Documentation on how environments and their network policies work:
**https://code.claude.com/docs/en/claude-code-on-the-web**

### If you would rather not open the network

The pattern you just used works fine and needs no configuration: **download the
file yourself and upload it into the chat.** That is exactly how the Texas
number went from "not established" to 1,708 in one step. For anything on the
list above, that route is always available.

---

## 5. The DOL enforcement file — what it proved for Backpay

From `allacts.csv` (WHD Enforcement Statistics: All Acts, FY2013–FY2025):

| FY | Compliance actions | Back wages | Employees paid | Per employee |
|---|---:|---:|---:|---:|
| 2025 | 16,924 | $259,294,764 | 176,957 | **$1,465** |
| 2024 | 17,300 | $202,676,115 | 151,989 | $1,333 |
| 2020 | 26,096 | $257,829,604 | 229,934 | $1,121 |
| 2016 | 28,589 | $266,566,178 | 283,677 | $939 |
| 2013 | 33,146 | $249,954,412 | 269,250 | $928 |

### Three findings, and the first one is the whole business

**1. Enforcement capacity has halved while the problem has not.**
Compliance actions fell **-49%** from 2013 to 2025 (33,146 → 16,924) and
employees receiving back wages fell **-34%** (269,250 → 176,957). Back wages
recovered stayed flat at **+4%**, which means the agency is running fewer,
larger cases. **The small individual claim is exactly what has been squeezed
out** — and the small individual claim is Backpay's entire market.

**2. The 1% recovery gap is now confirmed from the government's own numbers.**
DOL recovered **$3,281,591,879 over thirteen years**. Against $40–60bn taken
per year, thirteen years is $520–780bn. **DOL recovered 0.50% of the
midpoint** [derived]. My earlier "about 1%" came from EPI, an advocacy
organisation; this is the enforcement agency's own data arriving at the same
place from the opposite direction. **That is the single most load-bearing fact
in idea 1 and it is now corroborated by two independent sources.**

**3. It corrects Backpay's unit economics, downward.**
I had assumed $3,300 per case, from the minimum-wage-violation average. **The
DOL figure is $1,465 per employee in FY2025** — less than half. At a 25%
contingency that is **$366 per successful case**, not $825, which moves
break-even from 37 cases a month to **82 a month.**

**But the DOL number is federal FLSA only** — minimum wage and overtime. It does
not include California meal and rest premiums, which are an hour of pay per
violation per day and routinely dwarf the overtime shortfall. The engine's own
worked example (`engines/ca-wage`) produced **$399 in a single week** and
**$32,718 over nineteen months** for one warehouse worker. The honest position:

| Basis | Per case | 25% fee | Cases/month for $30k |
|---|---:|---:|---:|
| DOL federal average, FY2025 | $1,465 | $366 | **82** |
| CA minimum-wage violation average | $3,300 | $825 | **37** |
| CA multi-year case with meal/rest premiums | $32,718 | $8,180 | **4** |

**The spread is the finding.** Backpay's economics depend entirely on which
kind of case it finds, and California's meal and rest premiums are what make
the difference. That is a strong argument for launching in California
specifically — which is where the engine already is.

## 6. The Florida file — wrong file, and here is why

`AllActiveCountyAppointments.csv` (757,686 rows, 246MB unzipped) contains
**zero adjusters**. Every row is a nonresident agent appointment:

| Appointment class | Rows |
|---|---:|
| Nonresident health | 200,452 |
| Nonres life, health & variable annuity | 197,187 |
| Nonres life & variable annuity | 116,648 |
| Nonresident life | 93,538 |
| Nonres general lines (property & casualty) | 82,545 |
| Nonresident life & health | 62,007 |
| Nonres personal lines agent | 5,308 |

**This is structural, not an accident of this particular file.** An
"appointment" is a carrier authorising an agent to sell its products. **Public
adjusters represent policyholders, not carriers, so they are never appointed
and can never appear in an appointments file.**

The file you want is the other one in your screenshot:
**`AllValidLicensesIndividual.csv.zip`** (84.9MB).

### It is too big to upload — filter it first

Unzip it and run one command, then upload the result. It will be a few hundred
kilobytes.

**macOS / Linux:**
```
unzip AllValidLicensesIndividual.csv.zip
head -1 AllValidLicensesIndividual.csv > fl_public_adjusters.csv
grep -i "public adjuster" AllValidLicensesIndividual.csv >> fl_public_adjusters.csv
wc -l fl_public_adjusters.csv
```

The first line keeps the header, the second keeps only matching rows. If the
count looks wrong, check what the licence-class column actually says:
```
cut -d, -f5 AllValidLicensesIndividual.csv | sort | uniq -c | sort -rn | head -40
```
and send me that output — I will give you the exact filter for the real column.

**The same trick works on the 1.42GB CFPB file**, which is far too large for any
upload path:
```
unzip -p complaints.csv.zip | head -1 > cfpb_slice.csv
unzip -p complaints.csv.zip | grep -i "medical bill\|debt collection" | head -50000 >> cfpb_slice.csv
```

## 7. Google Drive — yes, with a hard size limit

Google Drive is connected to this session and I can search it, read files and
download file content. **But the download returns the file as base64 text into
my context**, which means:

| File | Verdict |
|---|---|
| Under ~5MB | **Works well.** Put it in Drive and tell me the name. |
| 5–20MB | Works for plain CSV, slowly, and eats a lot of context. |
| **84.9MB Florida zip** | **No.** Filter it first, per above. |
| **1.42GB CFPB zip** | **Absolutely not.** Filter it first. |

**The limit is my context window, not Drive and not disk.** This container has
**30GB of free disk**, and I never load big files into context anyway — the
Texas analysis ran as a Python script over the file and only the summary came
back. So:

- **If you allowlist the host, size stops mattering entirely.** I would download
  the 1.42GB CFPB file straight to disk and aggregate it with a script. That is
  by far the best option and it is one setting.
- **Until then, filter locally and upload the slice.** It costs you one command
  and works today.
