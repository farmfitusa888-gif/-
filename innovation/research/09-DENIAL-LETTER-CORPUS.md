# Building the denial-letter test corpus

Written 2026-08-31. Three routes to about twenty real insurance denial letters,
worked in parallel, plus the tooling to keep finding them after the first
twenty.

This exists because of the gate in `../buildouts/05-counterweight/PLAN.md`, day
1–30: *if it does not find the contradiction a professional finds, stop.* You
cannot run that gate without documents. And the reason the gate exists at all is
the FTC's DoNotPay order (finalised February 2025, $193,000, plus a requirement
to notify past subscribers). The Commission's complaint says the company never
tested whether its output matched a lawyer's and advertised anyway. The corpus
is the evidence that we did test. It is a legal document as much as an
engineering one.

**A naming note before anything else.** The plan says Counterweight; the
shipped site directory is `dist/countercite` and `model/api_cost.py` now says
Countercite. A rename is in flight. This file uses Counterweight to match the
plan it serves. Nothing here depends on which name wins.

---

## How claims are marked

| Label | Means |
|---|---|
| **[verified]** | I read the primary source directly in this session |
| **[review]** | Came from a search summary, not a fetched primary source. Probably right. Check it before it goes in a contract or on a website. |
| **[NOT ESTABLISHED]** | I could not confirm it and am not going to pretend otherwise |

This environment blocks nearly all outbound HTTP. `courtlistener.com`,
`free.law`, `wiki.free.law`, `data.texas.gov`, `data.chhs.ca.gov`,
`uscourts.gov` and most law-firm sites all returned `EGRESS_BLOCKED` when I
tried them. Two hosts did work and did most of the real verification:
`raw.githubusercontent.com` and the GitHub code-search API. CourtListener is
open source, so its rate limits, field names and URL construction could be read
out of the code that serves them, which is a better source than the
documentation anyway.

Everything I could not fetch has an exact retrieval recipe in section 6.

---

## 1. The short version

| Route | What it yields | Cost | Time to first document | Verdict |
|---|---|---|---|---|
| **Court exhibits (RECAP)** | Real denial letters, unredacted, with the lawsuit that followed | $0 to $50/mo | Days | **The best route. Start here.** |
| **State complaint files** | Almost entirely aggregate statistics. Texas gives per-complaint structured records with no narrative and no documents. | $0 to ~$100 | Weeks | Weak for letters. Excellent for choosing which carriers to target. |
| **Free work for policyholders** | Letters *with their policies*, which is the pair the engine actually needs | Your time | Days | **The only route that produces matched pairs. Do it alongside route 1.** |

The distinction that matters most and is easy to miss: **route 1 gives letters,
route 3 gives letters plus the policy they are supposed to contradict.** The
contradiction engine reads both. A denial letter alone tests half the pipeline.
Court exhibits sometimes include the policy as a separate exhibit in the same
case, which is the jackpot and is worth filtering for specifically.

**No public corpus of insurance denial letters exists.** I searched Hugging Face
and Kaggle and found insurance chatbot training sets, claims-classification sets
and QA sets, none of them denial letters [review, searched and not found]. That
is mildly good news: if you build one, nobody else has.

---

## 2. Route 1 — court records via CourtListener and RECAP

### 2.1 Is there a free API, and can a business use it?

Yes to the API. The commercial answer changed in 2026 and the change is the
single most important fact in this section.

**Rate limits, read directly from the source that enforces them**
(`cl/settings/third_party/rest_framework.py`, `DEFAULT_THROTTLE_RATES`)
[verified]:

```python
"anon": "100/day",
"user": ["5/min", "50/hour", "125/day"],
```

So an anonymous caller gets 100 requests a day. A free registered account with
a token gets **5 per minute, 50 per hour, 125 per day**. Rolling window.

**This is not the number in most blog posts.** The widely repeated "5,000
requests per hour" figure is dead [review]. If you find a tutorial quoting it,
the tutorial is stale, and a script written against it will collect 429s.

Paid tiers, read from `cl/api/constants.py` [verified for the rates, [review]
for the prices]:

| Tier | Rate limit | Price [review] |
|---|---|---|
| Free | 5/min, 50/hr, 125/day | $0 |
| Tier 1 | 10/min, 75/hr, 300/day | $10/mo or $100/yr |
| Tier 2 | 15/min, 150/hr, 600/day | $25/mo or $250/yr |
| Tier 3 | 20/min, 250/hr, 1,000/day | $50/mo or $500/yr |
| Tier 4 | 25/min, 300/hr, 1,400/day | $100/mo or $1,000/yr |
| EDU | 20/min, 1,000/hr | $0, academic only |

**Auth is a header, not a query parameter** [verified from the codebase's own
throttle and auth classes]:

```
Authorization: Token <your-token>
```

Get the token from your CourtListener account page after signing up. Free.

**The commercial-use position** [review, from search summaries of the Free Law
Project ToS at `wiki.free.law/c/terms/courtlistener/`; I could not fetch the
page]:

- The APIs are available "as a membership benefit and through commercial
  agreements."
- Sharing, reselling, pooling or transferring account credentials and API tokens
  is prohibited.
- Using multiple accounts or credential rotation to exceed your tier's limits is
  prohibited.
- If you need access for a product or a team, FLP asks you to talk to them about
  a commercial agreement.

**My read, and it is an opinion.** Building the corpus is research: you pull a
few hundred documents once, at a low rate, from a paid tier, and you are done.
That is squarely inside what a membership is for. What you must not do is wire
the CourtListener API into the product so that every Counterweight customer's
session hits it. That is a product built on someone else's infrastructure with
one token, which is the exact thing the credential-pooling clause names.
Different activity, different answer.

**Before the first paying customer, email Free Law Project and say what you are
doing.** They are a 501(c)(3) that funds itself on these memberships and they
publish a commercial-agreement route. A five-minute email removes the only
version of this story that ends badly. Budget $50/month for Tier 3 and treat it
as a cost of the corpus, not a favour.

### 2.2 The query shape that actually surfaces denial letters

Federal civil cases carry a **nature-of-suit code** from the JS-44 civil cover
sheet. **110 is "Insurance": actions alleging breach of an insurance contract,
tort claim, or other cause related to an insurance contract, except maritime**
[review, from official court NOS descriptions]. **190 is "Other Contract"** and
catches the cases where the filer did not tick 110, which happens often enough
to be worth widening into on a second pass.

CourtListener's RECAP search accepts these sidebar filter parameters, read from
`cl/search/forms.py` [verified]:

```
q  type  order_by  court  case_name  docket_number  available_only
description  nature_of_suit  cause  assigned_to  referred_to
document_number  attachment_number  party_name  atty_name
filed_after  filed_before  entry_date_filed_after  entry_date_filed_before
```

And these queryable field names inside `q=`, from `cl/search/constants.py`
[verified]:

```
caseName  case_name_full  docketNumber  suitNature  cause  juryDemand
assignedTo  referredTo  court  court_id  court_citation_string
short_description  description  plain_text  document_type
```

`type=rd` returns a flat list of documents. `type=r` returns dockets with up to
three matching documents nested inside each [review]. For finding exhibits you
want `rd`.

**Two search strategies, and you need both.**

**Strategy A, full text.** Search the OCR'd body of the PDF for phrases that
appear in denial letters:

```
"we have completed our review of your claim"
"we have completed our investigation of your claim"
"your claim is denied"
"your claim has been denied"
"we must respectfully deny"
"we are denying your claim"
"we are unable to make payment on your claim"
"no coverage is available under the policy"
"coverage is not afforded"
"there is no coverage for this loss"
"this letter is to inform you that coverage"
"this letter is to advise you that coverage"
"the policy specifically excludes"
"the following exclusion applies"
"is excluded under the policy"
"based upon our investigation"
"reservation of rights"
```

**That list is a hypothesis, not a finding.** It comes from correspondence
conventions and from the language state unfair-claims-practices rules push
carriers toward. Nobody has measured which phrases actually pull documents. The
script writes a per-phrase hit count to stderr on every run precisely so the
dead ones can be cut after the first real pass. Expect to throw half of them
away.

Strategy A has a hard structural limit: **it only finds documents that were
OCR'd.** A great many RECAP exhibits are scanned images whose text was never
extracted. Those are invisible to a full-text query no matter how good the
phrase list is.

**Strategy B, the description.** Docket-entry and attachment descriptions are
typed by the filer and are always present, OCR or no OCR. Filers label things
honestly more often than you would expect:

```
"denial letter"  "letter of denial"  "denial of claim"  "claim denial"
"coverage denial"  "denial correspondence"  "reservation of rights letter"
```

Combined with `description=` as a sidebar filter rather than free text in `q=`,
which the CourtListener maintainers say is both more accurate and faster
[review].

A worked example URL, generated by the script:

```
https://www.courtlistener.com/api/rest/v4/search/
  ?type=rd
  &order_by=dateFiled desc
  &available_only=on
  &court=txsd txnd txwd txed flsd flmd flnd laed lamd cod
  &filed_after=01/01/2015
  &nature_of_suit=110
  &description="denial letter" OR "letter of denial" OR "claim denial"
```

**Why those districts.** Southern and Northern Texas, Southern and Middle
Florida, Eastern Louisiana, Colorado. Hail, wind, hurricane. First-party
property claims removed to federal court on diversity. On a 125-call daily
budget, hit rate per call is the scarce resource, so start where the cases are
rather than searching all ninety-four districts.

**Party-name search is the other door.** `party_name=` against the big personal-
lines carriers pulls bad-faith suits directly. State Farm, Allstate, USAA,
Farmers, Travelers, Liberty Mutual, Nationwide, Citizens Property Insurance
Corporation, Universal Property & Casualty, Heritage. Citizens and Universal are
Florida-specific and worth a pass of their own given where the Florida firm list
already points the business.

### 2.3 Docket entry to exhibit PDF, and which side of the paywall it is on

This is the part that decides whether the corpus costs $0 or costs real money,
so here it is precisely.

**PACER** is the government system. It charges **$0.10 per page, capped at
$3.00 per document, with fees waived entirely if you accrue $30 or less in a
quarter** [review, from pacer.uscourts.gov]. A temporary increase to $0.12 per
page with the waiver threshold rising to $40 per quarter takes effect
**1 January 2027** [review].

**RECAP** is the archive of PACER documents that people have already bought and
donated through the browser extension. **Anything in RECAP is free forever.**

The API tells you which side a document is on before you download it, through
one boolean. From `cl/search/models.py` [verified]:

```python
is_available = models.BooleanField(
    help_text="True if the item is available in RECAP", ...)
```

So:

| `is_available` | What it means | Cost |
|---|---|---|
| `true` | The PDF is sitting in the archive | **$0** |
| `false` / null | Only the docket metadata exists | A PACER purchase |

And when it is true, the URL is constructed, not returned. From
`cl/lib/models.py`, which spells it out in the API's own help text [verified]:

> "To find the location in S3, concatenate `https://storage.courtlistener.com/`
> and the value of this field."

```
document_url = "https://storage.courtlistener.com/" + record["filepath_local"]
```

`filepath_local` looks like
`recap/gov.uscourts.dcd.178502/gov.uscourts.dcd.178502.1.0_48.pdf` [review].

**The setting that keeps you honest:** pass `available_only=on`. It is the
sidebar checkbox "Only show results with PDFs" [verified from `forms.py`]. With
it on, every row the search returns is free.

**The one endpoint that can charge you is `/api/rest/v4/recap-fetch/`.** It
takes your PACER credentials, buys the document and adds it to the archive. The
API itself is free; the PACER bill is not [review]. The script in
`../tools/find_denial_letters.py` never calls it, and says so in its own
dry-run output. If you later decide to buy documents deliberately, the $30
quarterly waiver means roughly 300 pages a quarter cost nothing, which is about
75 four-page denial letters. That is not a bad backstop.

**Attachments are where exhibits live.** From `cl/search/models.py`, verbatim
[verified]:

```python
PACER_DOCUMENT = 1
ATTACHMENT = 2
```

A denial letter attached to a complaint is almost always `document_type=2` with
an `attachment_number`. The scorer weights that.

### 2.4 The script

`../tools/find_denial_letters.py`. Standard library only, no install step.

```
python3 innovation/tools/find_denial_letters.py --dry-run     # prints every request
python3 innovation/tools/find_denial_letters.py --self-test   # 9 assertions, no network
COURTLISTENER_TOKEN=... python3 innovation/tools/find_denial_letters.py \
    --strategy both --nos 110 190 --out candidates.csv
```

It writes a CSV with score, case name, court, date filed, docket number, nature
of suit, entry and attachment numbers, page count, whether the PDF is free,
docket URL, document URL, description, guessed denial reason, and **why it
matched** in plain words.

Three things about it that are deliberate.

**The "why" column is the point.** Every row has to be checkable by opening the
PDF and looking. A corpus assembled by a filter nobody can explain cannot settle
an accuracy argument, which is the only reason the corpus exists.

**It refuses to spend money.** Rows where `is_available` is false lose eight
points and get flagged in the why column. The self-test asserts that
specifically, because it is the one failure that costs cash.

**It fails clearly rather than mysteriously.** Run from inside this sandbox it
prints:

```
Could not reach https://www.courtlistener.com/api/rest/v4/search/
  underlying error: Tunnel connection failed: 403 Forbidden

If this is the sandbox, that is expected: courtlistener.com is
not on the egress allowlist. Run with --dry-run to print the
exact requests and run them from an unblocked machine.
```

Tested. All nine self-test assertions pass, `--dry-run` prints four fully-formed
URLs at default settings, the missing-token path exits 2 with instructions, and
the network path exits 1 with the message above.

**One honest limitation left in the code, in a comment where the next person
will hit it.** I verified the field *names* against the Elasticsearch document
definitions in the repo, but I could not verify the exact JSON envelope the
search endpoint returns for `type=rd`, because this machine cannot reach the
API. Every field read goes through a `pick()` helper that tries several
plausible key names. Run once with `--raw-dump first.json` and fix the mapping
in one place if it has drifted.

### 2.5 What route 1 will not give you

**Bulk data does not include RECAP document text.** CourtListener publishes free
bulk CSVs of courts, dockets, opinions, oral arguments, people and financial
disclosures [review]. Docket *metadata*, not document bodies. There is no way to
bypass the rate limit by downloading a dump. Plan around 125 calls a day free or
1,000 a day at $50/month.

**Federal is the small pool.** First-party property insurance litigation is
overwhelmingly a *state* court story. Florida circuit courts alone carry far
more of it than the whole federal system. Miami-Dade and Broward clerks publish
civil dockets online, free, with document images subject to Florida's access
rules [review]. There is no API and no bulk file, so it is a manual route, but
if route 1 stalls at eight letters instead of twenty, this is where the next
twelve are.

**Nature of suit is filed by hand and is often wrong.** Do not treat `110` as
authoritative. It is a cheap first filter, and `190` is the second one.

---

## 3. Route 2 — state insurance department complaint files

Set expectations first, because this route is mostly a disappointment for
letters and mostly useful for something else.

There are three tiers of state complaint data, and the gap between them is
enormous:

1. **Aggregate statistics.** Complaints per carrier, complaint ratios, rankings.
   Every state publishes something like this. **Near-zero value for a test
   corpus.**
2. **Individual complaint records, structured.** One row per complaint with
   coded fields: coverage type, reason, disposition. Rare. Texas does it.
   **Useful for targeting, not for the corpus.**
3. **Individual complaint files with documents**, including the carrier's
   written response and any attached denial letter. **This is what we want, and
   no state publishes it.** It is only reachable, if at all, through a
   public-records request against closed files.

### 3.1 The four states, side by side

| | Texas | Florida | California | Illinois |
|---|---|---|---|---|
| Aggregate stats published | Yes | Yes | Yes | Yes |
| **Per-complaint records published** | **Yes, bulk CSV** | No | No | No |
| Narrative published | No | No | No | No |
| **Documents published** | **No** | **No** | **No** | **No** |
| Records request viable | Yes, with limits | **Best of the four, after closure** | Poor | **Effectively no** |
| Statutory clock | 10 business days (PIA) | "reasonable time," no fixed clock | 10 days to respond | 5 business days, 21 for commercial |

### 3.2 Texas — the best structured data, no documents

TDI publishes complaint records on the Texas open-data portal, the same Socrata
platform the 1,708-row public adjuster file came from.

| | |
|---|---|
| **Dataset** | Insurance complaints: All data |
| **URL** | https://data.texas.gov/dataset/Insurance-complaints-All-data/ubdr-4uff |
| **Direct CSV** | `https://data.texas.gov/api/views/ubdr-4uff/rows.csv?accessType=DOWNLOAD` |
| **Socrata API** | `https://data.texas.gov/resource/ubdr-4uff.json` |
| **Companion dataset** | Insurance complaints: One record / complaint — https://data.texas.gov/dataset/Insurance-complaints-One-record-complaint/jjc8-mxkg |
| **Format** | CSV / JSON / OData |
| **Records request needed** | No |
| **Cost** | $0 |

Columns [review]: Complaint number, Complaint filed against, Complaint filed by,
Reason complaint filed, Confirmed complaint, How resolved, Received date, Closed
date, Complaint type, Coverage type, Coverage level, Others involved, Respondent
ID, Respondent Role, Respondent type, Complainant type, Keywords.

**No narrative field. No attachments. No carrier response text.**

**What it is genuinely worth.** "Reason complaint filed" crossed with "Coverage
type" and "Confirmed complaint", filtered to homeowners and to carriers writing
in Texas, tells you *which denial reasons are common enough that the corpus must
cover them*, from the regulator's own coding rather than from guessing. That is
a real input to section 5 and it costs one download. Do it.

**The records-request route for actual files.** TDI is subject to the Texas
Public Information Act (Gov't Code ch. 552), response due within 10 business
days. But the Insurance Code makes investigative files confidential and not
subject to disclosure, and TDI will refer a request touching an open file to the
Attorney General [review]. Complainants sign a consent form when they file, and
medical records, financial information and email addresses are treated as
confidential under state and federal law [review]. So a request has to be
narrowly aimed at **closed, non-investigative** complaint correspondence, and
even then expect a fight. Open records contact: `OpenRecords@tdi.texas.gov`, or
Public Information Coordinator, Texas Department of Insurance, P.O. Box 12030,
mail code GC-ORO, Austin, TX 78711-2030 [review].

### 3.3 Florida — the only state where the statute points your way

Florida's Division of Consumer Services takes insurance complaints through the
Consumer Assistance Portal at `https://assistcon.myfloridacfo.gov/`. Public
records requests go through `https://myfloridacfo.com/publicrecords`.

**The statute is the interesting part.** Fla. Stat. § 624.319(3) makes
investigation reports confidential and exempt from § 119.07(1) **until the
investigation is completed or ceases to be active** [review]. After completion,
portions stay exempt only where disclosure would jeopardise another active
investigation or impair the licensee's safety or financial soundness.

Read plainly, that means a **closed, concluded** consumer complaint file is
presumptively a public record in Florida, subject to redaction of identifying
information. That is a better statutory starting position than any of the other
three. Florida also has no fixed statutory response clock, so it can be slow,
and it charges for staff time beyond a threshold.

**Florida is where I would spend the one records request.** It has the strongest
statute, it is a huge first-party property market, and it is where 1,203 of the
target customers already are.

### 3.4 California — aggregate only, and contested even at that

CDI publishes the **Consumer Complaint Study** under Insurance Code § 12921.1: a
Justified Complaint Study ranking companies by justified complaints per 100,000
policies, plus a Company Performance and Comparison Data Study [review].

- Study landing page: https://www.insurance.ca.gov/01-consumers/120-company/03-concmplt
- Definitions: https://www.insurance.ca.gov/01-consumers/120-company/03-concmplt/concmpltdefin.cfm

Company-level ratios and counts. No individual records, no narratives, no
documents. Cost $0, no request needed.

**A caution worth writing down.** The Life Insurance Consumer Advocacy Center has
sued CDI under the California Public Records Act, alleging the department first
said requested complaint data did not exist, then cited an exemption without
justifying it, for data that appeared in the Commissioner's own 2023 report
[review]. Whatever the merits, a department currently in PRA litigation over
aggregate complaint counts is not a department that will hand over complaint
files. **Deprioritise California for this purpose.**

### 3.5 Illinois — a closed door, stated plainly

IDOI publishes Consumer Complaint Reports (summaries and complaint ratios, PDF)
at https://idoi.illinois.gov/reports/consumer-complaint.html.

Individual complaint records are another matter. IDOI's own consumer materials
say complaints filed with the department **are confidential records and will not
be released to any third party**, except the policy owner, an authorised
representative, or the party complained against [review].

FOIA routes exist and are already documented in `01-DATA-SOURCES.md` (online
form, `DOI.FOIA@illinois.gov`, 5 business days, 21 working days for a declared
commercial requester). Use them for the public adjuster licence roster, which is
what that section is about. **Do not spend a request on complaint files.** The
department has told you the answer in advance.

### 3.6 The draft records request

For Florida. Adapt the statute citation for Texas (Gov't Code ch. 552) and drop
the § 624.319 reference.

> To the Public Records Custodian, Florida Department of Financial Services:
>
> Under Chapter 119, Florida Statutes, I request copies of consumer complaint
> files concerning **residential property insurance claim denials** closed
> between [DATE] and [DATE], limited to files in which the Department's
> investigation has been completed or has ceased to be active for purposes of
> section 624.319(3), Florida Statutes.
>
> For each responsive file I request only: (a) the licensee's written response
> to the Department, and (b) any denial or coverage-position letter issued to
> the consumer that is contained in the file.
>
> **I am not requesting, and ask the Department to redact before release, the
> following: the name of any consumer or family member; any street address,
> city, or ZIP code; any telephone number or email address; any policy number,
> claim number, or account number; any date of birth; any Social Security or
> other government identification number; any medical, health, or disability
> information; and any other information the Department considers exempt or
> confidential.** I am content to receive documents with the carrier's name
> retained and every consumer identifier removed. I have no interest in
> identifying any individual and the records will be used only to study the
> drafting of coverage-denial correspondence.
>
> I request the records in electronic form (PDF) delivered by email or download
> link, and I ask that they be limited to twenty files so that redaction cost
> stays low. If more than twenty are responsive, please provide the twenty
> earliest closed.
>
> If any portion is exempt, please release the remainder and cite the specific
> statutory exemption for each withholding. **Please provide a written cost
> estimate before performing any work if the total will exceed $50**, and treat
> this request as withdrawn rather than incur charges above that without my
> written agreement.
>
> This request is made for a commercial purpose.

Four things in that text do work and should survive editing. Asking for
redaction up front removes the department's commonest reason to refuse.
Capping the file count keeps the redaction bill inside a number you would
actually pay. Naming the § 624.319(3) closure condition shows you already know
the exemption, which changes the tone of the reply. And declaring commercial
purpose is required in several states and is the one misstatement that can void
a request outright.

### 3.7 Three adjacent sources that are better than the complaint files

These are not property-insurance denial letters. They are real, published,
free denial *rationales* at volume, and they are directly relevant to the
patient-advocate segment in the plan.

**California DMHC Independent Medical Review determinations.** Every IMR
decision since 1 January 2001, as a bulk CSV, on the state open-data portal.
Includes the plan's stated reason for denial and the reviewer's findings.

- Dataset: https://data.chhs.ca.gov/dataset/independent-medical-review-imr-determinations-trend
- Contact: `OpenData@dmhc.ca.gov`
- Format: CSV, ZIP. Free. No request needed. [review]

**New York DFS external appeals database.** Closed external appeals with case
summaries and outcomes, searchable, exportable to Excel by year.

- https://www.dfs.ny.gov/public-appeal/search [review]

**Market conduct examination reports and consent orders.** Every state publishes
them. They frequently quote denial-letter language verbatim as the evidence of
the violation, which makes them a source of *real carrier wording* attached to a
regulator's finding that the wording was wrong. That is unusually close to a
labelled training example. Nobody indexes them centrally, so this is a manual
hunt, but a handful of good examples is worth more than a hundred aggregate
rows.

**ProPublica's Claim File Helper** (`https://projects.propublica.org/claimfile/`)
generates a letter a patient can send to demand their claim file [review]. It
does not publish the files. It is a *template for route 3*, and a good one: it
is the same move, aimed at the same document, by an organisation whose lawyers
have already thought about it.

---

## 4. Route 3 — free work in exchange for a test case

The only route that produces the pair the engine needs: **the denial letter and
the policy it is supposed to contradict.** Court exhibits give you the letter
and sometimes the policy. A policyholder gives you both, plus the ground truth
of what actually happened next.

### 4.1 The offer

Free, real, bounded, and honest about what it is:

> **We will read your denial letter against your policy and send you a written
> analysis of every place the two do not line up. Free. No account, no card, no
> upsell. In return, we ask permission to keep a redacted copy as a test case.**

Four rules that keep this from being predatory:

1. **Deliver the work whether or not they consent to the corpus.** The moment
   the analysis is contingent on the permission, it stops being free work and
   starts being a purchase with a hidden price.
2. **Never say or imply we can overturn the denial.** We read documents. That is
   the whole claim. This is the DoNotPay line and it is not negotiable.
3. **Never say we are lawyers, adjusters or advocates**, and say plainly that we
   are not.
4. **Cap it.** Twenty analyses. Say the number in the offer. An open-ended free
   offer from an unknown party reads as a hook.

### 4.2 The outreach message

Short, no hook, no urgency, and it names what we get out of it in the second
paragraph rather than the last.

> **Subject: free read of your denial letter, in exchange for a test case**
>
> Hi — I build software that reads an insurance denial letter alongside the
> policy it is supposed to be based on, and flags the places the letter
> contradicts, misquotes or ignores the policy.
>
> I need to know how accurate it really is before I sell it to anyone, and the
> only way to know that is to run it on real documents. So: send me your denial
> letter and your policy, and I will send you back a written analysis of
> everything I find, free. No account, no payment, nothing to cancel.
>
> What I get is the test case. With your permission I would keep a redacted copy
> — your name, address, policy and claim numbers, dates of birth and any medical
> information stripped out before it is stored — to measure the software
> against. If you would rather I did not keep it, say so and I will still send
> you the analysis and delete both files.
>
> Two things I want to be straight about. I am not a lawyer, a public adjuster
> or an advocate, and this is not legal advice. And I cannot make your insurer
> pay. What I can do is show you, line by line, where their letter and your
> policy disagree, with a page reference for every point, which is a useful
> thing to hand to a lawyer or a public adjuster if you decide to hire one.
>
> Twenty of these, then I stop. If you want one, reply and I will tell you where
> to send the files.
>
> — [name], [site]

Under 250 words. No em dashes doing structural work. Nothing in it promises an
outcome.

### 4.3 The consent language

Sent as a separate message after they say yes, and their reply back is the
record. Do not bury it in a footer.

> **Permission to use a redacted copy**
>
> By replying "I agree" to this message you give [entity] permission to keep a
> **redacted** copy of the documents you sent (your denial letter and your
> insurance policy) and to use them internally to test and improve document-
> analysis software, and to quote short excerpts from the redacted versions in
> published accuracy measurements, documentation and marketing.
>
> **What "redacted" means here.** Before anything is stored, we remove: your
> name and the name of anyone else mentioned; your address and any address in
> the documents; ZIP codes; telephone numbers and email addresses; your policy
> number, claim number, and any account or file numbers; dates of birth; Social
> Security and driver's licence numbers; bank and payment details; and any
> medical, health, or disability information. Dates are shifted or reduced to
> the year. The **insurer's name may be kept**, because the point of the test
> is how a real carrier writes.
>
> **What we will never do.** We will not publish an unredacted copy of anything
> you send. We will not sell your documents. We will not share them with your
> insurer, or with anyone outside [entity], and we will not identify you as the
> source of a test case without asking you again first.
>
> **You can change your mind.** Email [address] at any time and we will delete
> the redacted copy from the test set within 30 days. Measurements already
> published that were computed using it cannot be un-computed, but the document
> itself comes out.
>
> **Two disclaimers.** [entity] is not a law firm, not a licensed public
> adjuster and not an advocate, and nothing we send you is legal advice or a
> claim-handling service. Nothing here creates any obligation on you, and the
> free analysis is yours whether or not you agree to this.
>
> Reply "I agree" to consent. Reply "no thanks" and you still get the analysis.

**Have a lawyer look at this before the first one goes out.** The plan already
budgets $1,500–3,000 for terms, privacy policy and the unlicensed-adjusting
question. Add this to that hour. It is three paragraphs and it is cheap to
review alongside work you are paying for anyway.

### 4.4 The redaction checklist

Run before a document enters the corpus. Not after. The unredacted originals
should never be in the same directory as the corpus, and should be deleted once
the redacted copy is verified.

The list below is the HIPAA Safe Harbor list from 45 C.F.R. § 164.514(b)(2)
[review], extended with insurance-specific identifiers. You are almost certainly
not a covered entity and have no HIPAA obligation. **Use the standard anyway.**
It is the recognised bar, it is easy to explain, and adopting a stricter
standard than you owe is the cheapest credibility available.

| # | Remove | Notes |
|---|---|---|
| 1 | Names | Policyholder, family, neighbours, the adjuster, the claims rep, witnesses. Replace with `[POLICYHOLDER]`, `[ADJUSTER]`. |
| 2 | Geography below state level | Street, city, county, precinct. Loss address and mailing address both. |
| 3 | ZIP codes | Safe Harbor allows the first three digits only where that area holds over 20,000 people. Simpler to strip all five. |
| 4 | **All dates except the year** | Loss date, notice date, inspection date, denial date, policy period, date of birth. **Keep relative intervals** ("denied 41 days after notice"), because late-notice and prompt-notice arguments turn on the interval, not the calendar date. |
| 5 | Ages over 89 | Aggregate to "90+". |
| 6 | Telephone and fax numbers | Including the carrier's if it is a direct line to a named person. |
| 7 | Email addresses | |
| 8 | Social Security numbers | |
| 9 | Medical record numbers | |
| 10 | Health plan beneficiary numbers | |
| 11 | Account numbers | Bank, mortgage, escrow. |
| 12 | Certificate and licence numbers | Including the adjuster's licence number. |
| 13 | Vehicle identifiers, VIN, plates | |
| 14 | Device identifiers and serial numbers | Appliance serials show up in contents claims. |
| 15 | URLs | Claim-portal links often embed the claim number. |
| 16 | IP addresses | In email headers, if any. |
| 17 | Biometric identifiers | |
| 18 | Full-face photographs | Property photos are fine once house numbers and plates are blurred. |
| 19 | **Policy number** | Insurance-specific. Replace with `[POLICY-NO]`. |
| 20 | **Claim / file / reference number** | Insurance-specific. Every carrier prints it in the header and again in the footer. Check both. |
| 21 | **Mortgagee and loss-payee names** | Insurance-specific. Identifies the property through public mortgage records. |
| 22 | **Signature images** | Insurance-specific. |
| 23 | **Any health or injury description** | Insurance-specific. Common in liability and loss-of-use sections. |

**Keep, deliberately:** the insurer's corporate name, the state, the year, the
line of business, the policy form number and edition date (e.g. HO-3 with an
edition date), the cited exclusions and their clause numbers, and the letter's
argument. All of that is the substance under test.

**Three failure modes, from experience with documents that look redacted and are
not.**

Redacting a PDF by drawing black boxes does not remove the text underneath.
Rasterise the page or use a tool that actually deletes the text layer, then
extract the text back out and read it to confirm.

Metadata survives redaction. `pdfinfo` and the XMP block routinely carry the
author's name, the original filename (often `SMITH_J_CLAIM_4471822.pdf`) and the
source system.

The header repeats. Carriers print the claim number in a running header on every
page. Redacting page one and skimming the rest is the most common way this goes
wrong. **A three-page letter should be checked three times.**

Verify with a grep, not with a glance:

```
pdftotext redacted.pdf - | grep -nEi \
  '[0-9]{3}-[0-9]{2}-[0-9]{4}|\b[0-9]{7,}\b|@|[0-9]{5}(-[0-9]{4})?\b'
pdfinfo redacted.pdf
```

### 4.5 Where the policyholders are

Ranked by how likely you are to be welcome. **I could not verify any of these
communities' current rules from this environment** — Reddit and Facebook are
both blocked here — so the rules column is [NOT ESTABLISHED] and the recipe for
checking it is in section 6. **Check before you post. A community that bans you
in week one is gone for good.**

| Where | Why it fits | Rules status |
|---|---|---|
| **`r/Insurance`** | Largest general insurance community. Denials posted daily. Heavily moderated and, by reputation, hostile to anything that reads as promotion. | [NOT ESTABLISHED] — assume solicitation is banned until you read the rules |
| **`r/HomeownersInsurance`** | Directly on target: first-party property. Named in `01-DATA-SOURCES.md`. | [NOT ESTABLISHED] |
| **`r/InsuranceClaims`** | Claim-process focused. Named in `01-DATA-SOURCES.md`. | [NOT ESTABLISHED] |
| **`r/HealthInsurance`** | Very active on denials and appeals. Relevant to the patient-advocate segment, not to public adjusting. | [NOT ESTABLISHED] |
| **`r/legaladvice`** | High volume, and **almost certainly forbids offering services**. Read only. | [NOT ESTABLISHED], assume no |
| **United Policyholders, `uphelp.org`** | 501(c)(3) founded 1991, Roadmap to Recovery programme, "Ask an Expert" forum staffed by consumer-side professionals and disaster survivors. **The single most credible policyholder organisation in the country.** | Do not post an offer. **Approach the organisation itself** and ask whether a free tool is useful to their volunteers. |
| **Facebook: post-disaster county and storm groups** | These form after every named storm and are where claim denials get discussed in the open. | [NOT ESTABLISHED]. I will not name specific groups I could not open. Section 6 has the search recipe. |
| **Facebook: public adjuster professional groups** | Adjusters have client denial letters and are already the target customer. **Ask an adjuster for one redacted letter and you get a letter and a sales conversation in one move.** | [NOT ESTABLISHED] |

**The move I would actually make first, and it is not any of the above.** You
already have 1,203 Florida public adjusting firms with email addresses on their
public licence records, and 1,708 named Texas licensees. Every one of them has a
drawer full of denial letters with clients who already consented to
representation. **Ask ten of them for one redacted letter each.** That is ten
letters from ten people who understand exactly what you are asking and why, it
is a warm opening to the sales conversation that channel 1b exists for, and it
does not involve approaching a distressed homeowner at all.

This is the least predatory version of route 3 and it is also the fastest. Do it
first and only go to the consumer communities if it stalls.

**What not to do, ever:** DM someone who has just posted about a denial. Reply to
a distressed post with a pitch. Post the same message in six subreddits.
Approach anyone in the immediate aftermath of a disaster. Those all work in the
narrow sense and they are how this business gets a reputation it cannot fix in a
community of 1,203 firms across three counties.

---

## 5. What a good test corpus looks like

Twenty is the number in the plan. Twenty is the right order of magnitude and the
wrong shape if all twenty are hail denials from one Texas carrier.

### 5.1 Size

| Set | Count | Purpose |
|---|---|---|
| **Development set** | 12 | You look at these. You tune against these. |
| **Blind set** | 8 | You do not look at these until the engine is frozen. |
| **Total at the day-30 gate** | **20** | The plan's number |
| Target by day 90 | 50 | Enough that a 5-point accuracy move is not noise |

**Twenty documents cannot support a percentage with a decimal point.** At n=20,
one letter is five points. If the engine confirms 17 of 20 findings, the honest
statement is "17 of 20," not "85%," and the confidence interval on that is
roughly 62% to 97% [derived, Wilson interval at 95%]. **Publish the fraction,
not the percentage, until n is at least 50.** A competitor or a regulator who
checks the arithmetic should find you were conservative.

The metric in the plan is >85% of findings confirmed. Note that the unit there
is a *finding*, not a *letter*: twenty letters producing six findings each is
120 gradeable items, which is a much better statistical footing than twenty. Say
which unit you are quoting, every time.

### 5.2 Spread of denial reasons

Minimum two letters per reason, from different carriers. Six of the seven
categories below are named in the brief; anti-concurrent causation is added
because it is the clause that generates the most defensible contradictions and
it appears in every modern HO-3 form.

| Denial reason | Target | Why it must be in |
|---|---|---|
| Late notice / failure to give prompt notice | 3 | Most common procedural denial. Turns on intervals, which survive date redaction. |
| Wear, tear, deterioration, faulty workmanship | 3 | The commonest substantive property denial, and the one carriers most often overstate |
| Flood / surface water exclusion | 2 | Where the contradiction is usually a definitional one |
| Material misrepresentation / rescission | 2 | Highest stakes, hardest to argue, most valuable to get right |
| Failure to mitigate / protect the property | 2 | Frequently asserted without the policy language that supports it |
| Pre-existing damage / damage predates policy | 3 | The denial that most often ignores a policy provision outright |
| **Anti-concurrent causation** | 2 | The clause most often *misquoted*, which is exactly what the engine claims to catch |
| Anything else that turns up | 3 | Do not force real documents into categories. Leave room. |

### 5.3 Spread of carriers and states

**No more than 3 letters from any one carrier.** A corpus that is 40% State Farm
measures State Farm's letter template, not the engine.

Aim for at least 8 distinct carriers across 20 letters, and include at least one
each of: a national personal-lines carrier, a Florida-domestic carrier (Citizens
Property Insurance Corporation or a Florida specialist), and a surplus-lines or
regional carrier. Their letters read very differently, and the small carriers
are where the sloppiest drafting is.

**At least four states**, weighted to where the business is going: Texas,
Florida, plus two others. Louisiana and Colorado are the natural additions on
storm volume.

Also spread across:

- **Line of business**: at least 15 property, and up to 5 health or disability
  for the patient-advocate segment. Do not let health dominate; the launch
  customer is a public adjuster.
- **Length**: some one-page letters, some six-page ones with an exclusion
  schedule. The engine's behaviour differs.
- **Quality**: include at least three letters that are *correct*. A denial that
  properly applies the policy is the single most valuable document in the
  corpus, because it is the only thing that measures false positives. Without
  them the corpus can only reward the engine for finding things.

That last point is the one most likely to be skipped and it is the one the
DoNotPay order is actually about.

### 5.4 The blind set, and how not to cheat

**The rule: eight letters go into a directory you do not open, graded by
somebody who is not you, once, after the engine is frozen.**

Mechanically:

1. When a letter enters the corpus, assign it dev or blind by coin flip before
   reading it. Not after. Assigning after you have read it is how a blind set
   becomes a set of easy cases.
2. Blind letters live in a separate directory with their ground-truth grading
   sheets. Do not read the letters, do not run the engine on them, do not look
   at intermediate output from them.
3. Grading is done by **a licensed public adjuster who has not seen the
   engine's output**, marking each finding confirmed, wrong, or trivial, and
   separately listing every contradiction *they* found that the engine missed.
   That second list is the false-negative measure, which the plan correctly
   identifies as the number that matters more.
4. **Pay them.** Two hours at their hourly rate. An unpaid favour produces
   polite grading, and polite grading is worthless.
5. Write the pass threshold down before the grading, in the repo, with a commit
   date. The plan's kill criterion already does this: below 70% confirmed, stop.
6. **The blind set is spent after one use.** Once you have seen the results you
   have learned from them, and it is a dev set now. Budget for replacing it: two
   fresh blind letters for every ten new dev letters.

Record for every graded item: the letter id, the finding, the policy page cited,
the grader's verdict, and a free-text note. Version it. When someone asks in
month nine how you got your number, the answer should be a file, not a memory.

### 5.5 What gets published

- The fraction, not the percentage, until n≥50.
- The unit (findings, not letters), stated every time.
- The blind-set number separately from the dev-set number, and if they diverge,
  the blind number is the one you quote.
- The false-negative count, which almost nobody publishes and which is the
  number a professional will actually ask about.
- The corpus composition: how many letters, how many carriers, how many states,
  what spread of reasons.
- The date the engine was frozen and the date it was graded.

Anything you would not want read aloud back to you by an FTC investigator does
not go on the site.

---

## 6. Retrieval recipes for everything blocked here

Run these from an unblocked machine. Each one replaces a claim in this document
marked [review] or [NOT ESTABLISHED].

**CourtListener terms of service, in full.**
```
curl -sL https://www.courtlistener.com/terms/ -o cl-terms.html
curl -sL https://wiki.free.law/c/terms/courtlistener/courtlistenercom-terms-of-service-and-policies -o cl-terms-wiki.html
```
Read the sections on API tokens, credential sharing, rate-limit circumvention
and commercial agreements. That settles section 2.1.

**CourtListener membership prices.**
```
curl -sL https://free.law/membership/
curl -sL https://free.law/2026/05/07/api-included-in-memberships/
```

**Live API smoke test** (needs a token, uses 1 of your 125 daily calls):
```
curl -s -H "Authorization: Token $COURTLISTENER_TOKEN" \
  'https://www.courtlistener.com/api/rest/v4/search/?type=rd&nature_of_suit=110&description=%22denial+letter%22&available_only=on' \
  | python3 -m json.tool | head -60
```
Then run the real script with `--raw-dump first.json` and check the field
mapping against section 2.3.

**Nature-of-suit code list, official.**
```
curl -sL 'https://www.uscourts.gov/sites/default/files/js_044_-_civil_cover_sheet_1.pdf' -o js44.pdf
```

**PACER fee schedule, current and the 2027 change.**
```
curl -sL https://pacer.uscourts.gov/pacer-pricing-how-fees-work
curl -sL https://pacer.uscourts.gov/announcements/2026/06/26/temporary-fee-increase-effective-jan-1-2027
```

**Texas complaint data, columns and row count.**
```
curl -s 'https://data.texas.gov/api/views/ubdr-4uff.json' | python3 -m json.tool | head -80
curl -s 'https://data.texas.gov/resource/ubdr-4uff.json?$select=count(*)'
curl -sL 'https://data.texas.gov/api/views/ubdr-4uff/rows.csv?accessType=DOWNLOAD' -o tx_complaints.csv
```
Then, to size the denial-reason spread for section 5.2:
```
python3 -c "
import csv,collections
rows=list(csv.DictReader(open('tx_complaints.csv')))
c=collections.Counter((r.get('Coverage type',''), r.get('Reason complaint filed','')) for r in rows)
for k,v in c.most_common(40): print(v,k)
"
```

**California DMHC IMR determinations.**
```
curl -sL 'https://data.chhs.ca.gov/dataset/independent-medical-review-imr-determinations-trend' -o dmhc.html
```
Take the CSV link from the resource list on that page.

**Subreddit rules, machine-readable and reliable.** Reddit publishes rules as
JSON. No scraping, no login:
```
for s in Insurance HomeownersInsurance InsuranceClaims HealthInsurance legaladvice; do
  echo "=== r/$s ==="
  curl -s -A "corpus-research" "https://www.reddit.com/r/$s/about/rules.json" \
    | python3 -c "import sys,json;[print('-',r['short_name'],'::',r['description'][:200]) for r in json.load(sys.stdin)['rules']]"
done
```
That output replaces every [NOT ESTABLISHED] in section 4.5 in about ten
seconds. Run it before posting anything.

**Facebook groups.** No API worth using and no honest scraping route. Search
Facebook directly for `"insurance claim denied" [county name]`, `"Hurricane
[name]" claims`, `Florida public adjusters`, and read each group's pinned rules
post. Assume solicitation is banned unless a rule says otherwise.

---

## 7. What is not established

Kept separate so it does not get quietly absorbed into the parts that are.

- **No specific case, docket number or exhibit is named anywhere in this
  document.** I could not reach CourtListener to find one, and a fabricated
  citation in a file whose whole purpose is evidentiary would be worse than an
  empty section. The script is the substitute: run it and it produces real ones.
- **Whether `nature_of_suit=` filters correctly on a `type=rd` search** is
  untested. The RECAP document is a child of the docket in the search index, so
  it should work, but should is not tested. Check it on the first live run.
- **Whether `court=` takes space-separated ids** in the API the way it does in
  the web UI. The script builds it that way. Verify on the first run.
- **Hit rate.** I have no idea whether the phrase list returns 5 candidates or
  5,000. Neither does anyone else, because nobody has published this search.
  Run it before planning around it.
- **CourtListener membership prices** ($10/$25/$50/$100 per month). The rate
  limits behind them are verified from source; the dollar figures are not.
- **Every state statute cited in section 3** came from a search summary rather
  than a fetched statute. Fla. Stat. § 624.319(3), Tex. Gov't Code ch. 552,
  Cal. Ins. Code § 12921.1, 5 ILCS 140. Read them before relying on them in a
  records request.
- **Every subreddit and Facebook rule in section 4.5.**
- **Whether Texas or Florida will actually release a redacted complaint file.**
  The statutes suggest Florida might. Neither has been asked.

---

## 8. What to do this week

1. **Register for CourtListener, take the free tier, run
   `find_denial_letters.py --strategy description`.** Description search is the
   cheaper strategy and it works on non-OCR'd documents, so it is the better
   first probe. 125 calls a day is enough to know within a day whether the
   route works.
2. **Download the Texas complaint CSV** and count denial reasons by coverage
   type. One command, and it turns section 5.2's target spread from a guess into
   a distribution.
3. **Email ten Florida public adjusting firms from the list you already have**
   and ask each for one redacted denial letter. Warmest, fastest, least
   predatory source of matched letter-and-policy pairs, and it doubles as the
   opening of channel 1b.
4. **Run the subreddit rules command** before posting anywhere.
5. **Send the Florida records request.** It costs an email and it runs in the
   background for weeks while everything else proceeds.
6. **Email Free Law Project**, say what you are building and ask whether a
   membership covers it. Do this before there is a paying customer, not after.

Do not send the Illinois complaint-file request. They have already answered it.
