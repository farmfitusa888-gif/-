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

### Illinois — **no bulk file. This is the honest answer.**

I searched for an Illinois equivalent of the Texas dataset and there is not one.
Illinois offers lookup portals, not downloads. The routes, in order of how
useful they actually are:

| Route | URL | What you actually get |
|---|---|---|
| **Computer Data Request Form** | https://idoi.illinois.gov/producers.html | **The real answer for bulk data.** IDOI's formal mechanism for requesting a compiled data extract. Expect a form, possibly a fee, and a wait. |
| Producer/agent lookup | https://insuranceqa.illinois.gov/producer/producerMain.html | One licensee at a time |
| Agent lookup portal | https://idoi.illinois.gov/companies/agent-lookup.html | One at a time |
| State service directory entry | https://www.illinois.gov/services/service.insurance-provider-license-search.html | Points at the same lookup |
| **SBS (State Based Systems)** | https://www.statebasedsystems.com | Multi-state licensee lookup; choose Illinois → Licensee. Search, not bulk |
| NIPR Illinois page | https://nipr.com/licensing-center/state-information/illinois | Licensing rules and requirements, not a roster |

**My recommendation for Illinois:** submit the Computer Data Request while you
work on Texas. Do not wait on it — Texas alone already exceeds break-even.

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
