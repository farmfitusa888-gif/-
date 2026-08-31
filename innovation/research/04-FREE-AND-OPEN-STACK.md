# The free and open stack

Researched 2026-08-31, against the seven businesses in `README.md` and the
Countercite plan in `buildouts/05-countercite/PLAN.md`.

The owner's instruction was to use every free and open technology available. I
have taken that seriously and the answer is mostly yes. There is one place where
free is the wrong answer, and the whole document is organised around getting to
it honestly.

---

## How to read the labels

The egress proxy on this machine blocks most vendor domains. `ai.google.dev`,
`aws.amazon.com` and `arxiv.org` all refused. GitHub did not, so licences and
repository facts are unusually well verified here and prices are unusually
badly verified.

| Label | Means |
|---|---|
| **[verified]** | I opened the page myself on 2026-08-31 and read it |
| **[review]** | Came from a search-engine summary, not a page I read. Treat as a lead, confirm before you spend |
| **[NOT ESTABLISHED]** | I could not find it and will not guess |
| **[assumption]** | My arithmetic, from stated inputs, not anybody's published figure |

**Every price in this document is [review] unless marked otherwise.** Search
summaries get prices wrong, and vendor pricing moves. Confirm each one on the
vendor's own page before it enters a financial model.

---

## The recommended stack

At **100 Countercite customers on the Practice tier**, which is $29,900/month
of revenue and the break-even point the plan is built around.

| Layer | What to use | Licence | $/month at 100 customers |
|---|---|---|---:|
| Static hosting, 7 sites | **Cloudflare Pages** free plan | proprietary, free tier | **0** |
| Domains, 7 | any registrar, ~$12/yr | | **7** |
| App server | one VPS, 4 vCPU / 8 GB | | **15** [review] |
| Document storage | **Cloudflare R2** free tier | proprietary, free tier | **0** |
| Text extraction, digital PDFs | **pypdfium2 / OCRmyPDF** | MPL-2.0 [verified] | **0** |
| OCR, scans and faxes | **PaddleOCR** PP-OCRv5/v6 | Apache-2.0 [verified] | **0** |
| OCR, the hard 10% | **Marker** or **olmOCR** | Apache-2.0 code [verified] | **0** |
| GPU for OCR, STT, TTS, embeddings | rented by the hour, ~25 h/mo | | **10** [assumption] |
| Embeddings | **BGE-M3** | MIT [review] | **0** |
| Vector search | **sqlite-vec** | Apache-2.0 / MIT [verified] | **0** |
| **Contradiction engine** | **Claude Sonnet 5**, cached, escalating to Opus 5 | commercial | **~900** [assumption] |
| Speech to text, batch | **faster-whisper** large-v3 | MIT [verified] | **0** |
| Speech to text, live | **Deepgram Nova-3** streaming | commercial | see §4 |
| Text to speech | **Kokoro-82M**, or ElevenLabs on the phone lines | Apache-2.0 [verified] | see §5 |
| Transactional email | **Resend** free, then **AWS SES** | proprietary, free tier | **15** [review] |
| Error tracking | **Sentry** Developer free | proprietary, free tier | **0** |
| Product analytics | **PostHog** free | proprietary, free tier | **0** |
| Uptime | **Uptime Kuma**, self-hosted | MIT [verified] | **0** |
| **Payments** | **Stripe**, 2.9% + 30¢ | commercial | **~897** [assumption] |
| | | **Total** | **≈ $1,844** |

Gross margin at that line: **93.8%**. The plan assumed 80–92%, so this is
slightly better than the plan, and the plan's number is the one to keep in the
model until real usage confirms it.

Now look at what makes up the $1,844.

**$1,797 of it is two lines: Stripe and Claude. Everything else in the entire
stack, hosting seven websites, OCR on a quarter of a million pages, embeddings,
transcription, speech, monitoring and analytics, comes to about $47 a month.**

That is the finding. The free and open tooling is not a compromise at this
scale. It is genuinely free and genuinely good enough for everything except the
one thing the business actually sells.

### The line nobody budgets for

Stripe costs more than the AI. At $29,900 of monthly card volume, 2.9% + 30¢ per
charge is **$867 + $30 = $897**, versus roughly $900 for the model that reads
the documents. Every percentage point of card fee is $299/month at this scale,
which is a whole extra customer.

Two things follow. Annual billing collapses the 30¢ component from 100 charges
to 8 (the plan already offers two months free on annual, and this is a second
reason to push it). And ACH, where Stripe charges 0.8% capped at $5 [review], is
worth offering to the Firm tier: on a $599 charge that is $5 instead of $17.66.

---

## 1. PDF and scan text extraction

### The free option

There is no single winner, and pretending otherwise is how you end up with a
pipeline that fails on faxes. Use a cascade.

| Stage | Tool | Licence | When it runs |
|---|---|---|---|
| 1 | **pypdfium2** / **pdfplumber** | Apache-2.0 / MIT [review] | Digital PDF with a real text layer. Free, instant, exact |
| 2 | **OCRmyPDF** (`ocrmypdf/OCRmyPDF`) | MPL-2.0 [verified] | Scanned PDF. Deskews, cleans, rotates, then runs Tesseract |
| 3 | **PaddleOCR** (`PaddlePaddle/PaddleOCR`) | Apache-2.0 [verified] | Anything Tesseract scores badly on |
| 4 | **Marker** (`datalab-to/marker`) or **olmOCR** (`allenai/olmocr`) | see licence note | Bad faxes, photographs, dense tables |

OCRmyPDF genuinely deskews and cleans before OCR [verified], which matters more
on a fax than the choice of OCR engine does.

PaddleOCR is at 3.7.0, released 2026-06-11 [verified]. It publishes tiny (1.5M),
small (7.7M) and medium (34.5M) parameter tiers and runs on CPU, GPU, XPU and
NPU [verified], so the small tier fits a cheap VPS with no GPU at all.

For the worst documents, the vision-language models are a real step up.
**olmOCR** scores 82.4 ± 1.1 on olmOCR-bench at v0.4.0 [verified] and needs a
12 GB NVIDIA card and 30 GB of disk [verified]. **Marker** publishes 76.0% on
olmOCR-bench in balanced GPU mode at 2.9 pages/sec, dropping to 43.6% in
CPU-only no-OCR mode [verified]. That CPU number is the honest one to plan
around if you refuse to rent a GPU.

### Licence traps, and they are real

**Marker and Surya are the trap.** Code is Apache-2.0, but the *weights* are
under a modified AI Pubs Open Rail-M licence: free for research, personal use
and **startups under $5M funding or revenue** [verified, on both repos]. This
project qualifies today. It is a tripwire wired to your own success, and it
belongs in a note in the code, not in someone's memory.

**MinerU** (`opendatalab/MinerU`) uses a "MinerU Open Source License", described
on the repo as a custom licence based on Apache 2.0 with additional conditions
[verified]. I could not read the licence file itself (repo access denied in this
session), so the additional conditions are **[NOT ESTABLISHED]**. Do not adopt
it until someone reads that file.

**Clean:** Tesseract, PaddleOCR, OCRmyPDF, olmOCR, Docling, Unstructured. All
permissive, all commercial-safe.

### The commercial option

AWS Textract, Google Document AI and Azure Document Intelligence all price plain
OCR at about **$1.50 per 1,000 pages** [review]. Structured extraction is where
they get expensive: Textract Forms at $50/1,000, Tables at $15/1,000, Azure
Custom Extraction and Google Form Parser at $30/1,000 [review].

At the volume assumed here (225,000 pages/month, see below), plain commercial
OCR is **$338/month**. Self-hosted on rented GPU is roughly $10. The saving is
about $325/month, or one and a bit customers.

### The honest quality gap

**Narrow on clean documents. Wide on the worst 5%, and the worst 5% is where
your customers' hardest cases live.**

A hail-damage file arrives as a phone photograph of a carrier letter taken at an
angle in a truck. A denial letter arrives as a third-generation fax. On those,
Tesseract will produce plausible-looking garbage, and plausible-looking garbage
is worse than a failure because it flows silently into a finding.

Three things close most of the gap without spending money:

1. **Run two engines and compare.** Where PaddleOCR and Tesseract disagree on a
   dollar amount or a date, that page is flagged, not accepted.
2. **Keep a per-page confidence score and surface it.** The product's entire
   promise is a citation back to the source page. A citation to a page you could
   not read is the product lying.
3. **Never let a low-confidence page produce a finding silently.** Show the user
   the image crop next to the extracted text.

That third rule is not a nicety. It is the design difference between this and
DoNotPay, and it costs nothing.

### Hardware

- CPU only: Tesseract, OCRmyPDF, PaddleOCR small tier. Fine on a $15 VPS.
- GPU: olmOCR wants 12 GB VRAM [verified]. Marker and Surya want an NVIDIA card
  with Docker and the container toolkit [verified].
- Renting beats owning here. RunPod community RTX 4090 is quoted around
  **$0.34/hr**, secure cloud around $0.69/hr [review]. **Modal** advertises $30/mo
  of free compute credit with per-second billing [review], which at this volume
  may cover the whole OCR bill.

**The volume arithmetic, so you can argue with it:** 100 customers × 15 active
cases/month × 150 pages/case = **225,000 pages/month** [assumption]. At Marker's
published 2.9 pages/sec on GPU that is **21.5 GPU-hours/month**, about $7.30 at
community rates. Call it $10–25 with overhead and retries. If your real cases
are 400 pages, triple it and it is still under $75.

---

## 2. Long-document understanding, and the citation

**This is the product. Everything above and below is plumbing.**

The job: hold a 60-page policy plus its endorsements plus a denial letter, find
where they contradict, and cite the page. The plan's own gate is **>85% of
findings confirmed by the professional** and **<2 false positives per case**.
That target is what decides this section, not the licence.

### The commercial option

Claude, via the Anthropic API. Pricing, from the bundled `claude-api` skill
reference (cached 2026-06-24):

| Model | Context | Input $/1M | Output $/1M |
|---|---|---|---|
| Claude Opus 5 | 1M | $5.00 | $25.00 |
| Claude Sonnet 5 | 1M | $2.00 | $10.00 |
| Claude Haiku 4.5 | 200K | $1.00 | $5.00 |

Three features matter more than the headline rate:

- **Citations.** Set `citations: {enabled: true}` on each document block and the
  response comes back with `page_location` carrying 1-indexed start and end page
  numbers. The positioning line in the plan, *"every finding links to the page
  that produced it"*, is a supported API feature, not something you have to build.
- **Prompt caching.** The policy is the same across every question asked about a
  case. Cache it once, query it many times.
- **Batch API, 50% off.** Anything that is not a user staring at a spinner
  should go through batches.

### Cost, at the plan's own volumes

A 150-page case at roughly 600 tokens/page is about 90,000 input tokens
[assumption]. Three passes with caching, plus output, lands near **$0.60 per
case** on Sonnet 5 [assumption]. At 15 cases/customer/month × 100 customers =
1,500 cases = **$900/month**, which is **$9 per customer**.

The plan budgeted $25–60/customer for inference and infrastructure. This comes
in under it, which means either the plan was conservative or my token estimate
is low. Assume the plan is right until you have thirty real cases measured.

### The free option

Open-weight models with long context exist and some are properly licensed.
Qwen3 235B-A22B is Apache-2.0 [review]; Kimi K2.6 ships under a modified MIT
with open weights [review]; several 2026 open models advertise 1M-token windows
[review]. Free API tiers exist too: Google AI Studio, Groq (roughly 30 req/min
and 1,000 req/day on Llama 3.3 70B), Cerebras (~1M tokens/day), OpenRouter
(around 14 free models, 50 requests/day) [all review]. Mistral's Experiment tier
is around 1 billion tokens/month **but requires opting into training on your
data** [review], which for policyholder documents is disqualifying on its own.

### The honest quality gap: this is the one that matters

**Do not run the contradiction engine on a free model. The gap is not small and
it fails in exactly the direction that kills this business.**

The evidence, and it is specific:

**ContractEval** (arXiv 2508.03080, also at ACL Anthology 2025.nllp-1.19)
benchmarked 4 proprietary and 15 open-source LLMs on clause-level legal risk
identification using the CUAD dataset. Its findings, from the abstract summary
[review, the PDF host is blocked here]:

- Proprietary models outperform open-source models on both correctness and
  output effectiveness; open models tend to be good at one, not both.
- Open models **"generate 'no related clause' responses more frequently even
  when relevant clauses are present"**, which the authors call laziness.
- Quantisation speeds inference at a measurable accuracy cost.
- Most models perform at roughly the level of a junior legal assistant.

Read the second bullet against the plan's metrics table. A model that says "no
related clause" when there is one produces a **false negative**. The plan tracks
false positives (<2 per case) because a tool that cries wolf gets switched off.
But the false negative is the one that ends the business: the adjuster uses the
tool, the tool misses the contradiction, the claim is underpaid, and the
adjuster's professional liability is on the line. That customer never comes back
and tells 111 other Houston licensees why.

The second piece of evidence is about the whole category. The **Stanford RegLab**
study (May 2024) found Lexis+ AI hallucinated on more than 17% of queries and
Westlaw AI-Assisted Research on more than 33%, against 43% for GPT-4 [review].
These are commercial legal tools that advertised "hallucination-free". The
lesson is not that AI cannot do this. It is that **the vendors who claimed it
worked had not measured it**, which is the same sentence the FTC wrote about
DoNotPay.

So: quantisation costs accuracy, open models under-report findings, and even
paid legal tools overstate. The response is not to pick the free one and hope.
It is to pay for the best model on the finding step and to measure the output
against a licensed adjuster's read, which is what days 1–30 of the plan already
say.

### Where free models do belong in this pipeline

Not nowhere. Just not on the finding.

| Task | Free model? | Why |
|---|---|---|
| Classifying a document (policy / denial / estimate / correspondence) | **Yes** | Cheap, high-volume, errors are visible and recoverable |
| Splitting a 400-page production into documents | **Yes** | Structural, not interpretive |
| Drafting boilerplate around a confirmed finding | **Yes** | A human reads it before it goes out |
| **Finding the contradiction** | **No** | This is the product |
| **Deciding which page a finding cites** | **No** | A wrong citation is worse than no finding |

### Hardware, if you ignore this advice

A 235B-parameter MoE model at usable quality is **[NOT ESTABLISHED]** on modest
hardware. Realistically it means multiple 80 GB cards or a hosted endpoint, and
at that point you are paying anyway. Smaller local models that fit a 24 GB card
are exactly the ones ContractEval found to be lazy.

---

## 3. Structured extraction

Dates, provider names, dollar amounts, policy provisions, deadlines.

**Free:** the same model call that reads the document, with a JSON schema
attached. Claude supports `output_config.format` and `strict: true` on tool
definitions, which guarantees the response validates. For local models,
constrained decoding libraries do the same job. Do not write regex for money.

**Commercial specialist:** Textract Forms at $50/1,000 pages, Google Form Parser
and Azure Custom Extraction at $30/1,000 [review]. At 225,000 pages/month that
is **$6,750–11,250**. Absurd for this business, and unnecessary: the LLM already
has the page in context, so extraction is nearly free as a second field on the
same call.

**The gap:** almost none, and it favours the LLM on this document type. Those
form parsers are trained on invoices and tax forms. An insurance policy
endorsement is not a form.

**The thing that will actually bite you** is not extraction accuracy. It is
money arithmetic. Floating-point on a settlement figure produces a finding you
cannot defend. Parse to integer cents, everywhere, and put the reason in the
comment.

---

## 4. Speech to text, for the 2am line and the newborn line

Ideas 6 and 7. The constraint is different from everything above: a frightened
person is on the phone at 2am, and latency is part of the product.

### Free

| Option | Licence | Notes |
|---|---|---|
| **faster-whisper** (`SYSTRAN/faster-whisper`) | MIT [verified] | large-v3 at fp16 uses ~4.5 GB VRAM, int8 ~2.9 GB. 13 min of audio in 1m03s on an RTX 3070 Ti, about 4× the reference implementation [all verified] |
| **openai/whisper** | MIT for code *and* weights [verified] | Reference. tiny needs ~1 GB VRAM, large ~10 GB [verified] |
| **NVIDIA Parakeet TDT 0.6B v3** | CC-BY-4.0, commercial use permitted with attribution [review] | ~6.34% average WER on the HuggingFace Open ASR Leaderboard, released 2026-05-27 [review] |

Parakeet is the interesting one: 600M parameters, near the top of the open ASR
leaderboard, and a licence that explicitly allows commercial use. If that CC-BY
claim holds up on the model card, it is the best free choice here.

### Commercial

| Provider | Price | Latency |
|---|---|---|
| Deepgram Nova-3 | $0.0043/min batch, $0.0077/min streaming [review] | ~200–300ms end to end in good conditions [review] |
| AssemblyAI Universal-2 | ~$0.006/min [review] | ~300ms P50 [review] |
| OpenAI Whisper API | $0.006/min [review] | **batch only, no streaming** [review] |

### The honest quality gap

**On accuracy, near zero. On latency, decisive, and latency is the whole point.**

Whisper is architecturally a 30-second-chunk batch model. You can stream it with
a voice-activity-detection wrapper, but you are building a real-time system on
top of something that was not designed to be one, and the failure mode is a
pause where a person expects a response. At 2am, from someone whose parent with
dementia is at the front door, a two-second pause reads as nobody being there.

Run the arithmetic before you self-host anything. **100 callers × 8 minutes = 800
minutes/month. Deepgram streaming at $0.0077/min is $6.16.** Six dollars.
Self-hosting to save six dollars, on the one product where latency is a safety
property, is not thrift. It is a bad trade.

**Recommendation: Deepgram (or AssemblyAI) for the live lines. faster-whisper
for anything asynchronous**, such as transcribing recorded onboarding calls,
where it is free and equally good.

---

## 5. Text to speech

The brief was exact: natural enough that a frightened person at 2am is not made
worse by it. That is a quality bar, not a feature.

### Free

| Option | Licence | Notes |
|---|---|---|
| **Kokoro-82M** (`hexgrad/kokoro`) | Apache-2.0, code and weights [verified] | 82M parameters, runs on modest hardware, multiple English and non-English voices [verified] |
| **Chatterbox** (`resemble-ai/chatterbox`) | MIT [verified] | Multilingual V3 across 23+ languages. Nano (110M) runs 3× realtime on 8 CPU cores; Turbo (350M) quotes sub-200ms via Resemble's hosted service [verified] |
| **Piper** (`OHF-Voice/piper1-gpl`) | **GPL-3.0** [verified] | The maintained line. The old `rhasspy/piper` is MIT but **archived 2025-10-06** [verified] |

Two licence notes. Piper's move from MIT to GPL-3.0 is fine for a server-side
SaaS, because you are not distributing binaries and the AGPL trigger does not
apply, but get that confirmed rather than assumed. And **Coqui XTTS-v2 is under
the Coqui Public Model License, which restricts commercial use** [review]. It
turns up constantly in "best open TTS" lists. It is disqualified here.

Chatterbox publishes Podonos listening-test comparisons against ElevenLabs Turbo
v2.5, Cartesia Sonic 3 and VibeVoice 7B, conducted under identical conditions
[verified]. I have not read the reports, so the results are **[NOT ESTABLISHED]**.
That the comparison is public and reproducible is itself worth something.

### Commercial

| Provider | Price per 1,000 characters |
|---|---|
| ElevenLabs Flash/Turbo | $0.05 [review] |
| ElevenLabs Multilingual v2/v3 | $0.10 [review] |
| OpenAI TTS | $0.015, HD $0.03 [review] |
| Cartesia Sonic | ~$0.005–$0.037 depending on plan [review] |

### The honest quality gap

**[review] on the numbers, and I will not pretend otherwise. But the direction
is clear and the cost of being wrong is asymmetric.**

Kokoro at 82M parameters is remarkable for its size and completely adequate for
reading back a summary, confirming an appointment, or narrating a checklist.
Prosody under emotional content is a different problem. The difference between a
voice that sounds calm and a voice that sounds flat is exactly the difference
that matters to someone in distress, and it is the hardest thing for a small
model to get right.

The arithmetic again: **400 minutes of generated speech ≈ 300,000 characters
[assumption]. ElevenLabs Flash at $0.05/1,000 is $15/month.** Fifteen dollars,
for 100 callers.

**Recommendation: pay for TTS on the two phone lines. Use Kokoro everywhere
else** (document read-back, in-app playback, anything where the listener is not
in crisis). Then A/B them with real callers and let the data decide, because I
am reasoning from the shape of the problem here rather than from a listening
test I ran.

---

## 6. Embeddings and local search

The easiest section in the document. Free wins outright.

**Free:**

- **BGE-M3** (`FlagOpen/FlagEmbedding`), MIT [review]. Dense, sparse and
  multi-vector retrieval in one model, 100+ languages. The workhorse.
- **Qwen3-Embedding-8B**, Apache-2.0, leads open-weight MTEB v2 at roughly 75%
  average, 32K context, Matryoshka dimensions from 32 to 7,168 [review]. The
  smaller 0.6B and 4B variants are the practical ones on modest hardware.
- **sqlite-vec** (`asg017/sqlite-vec`), dual Apache-2.0/MIT [verified]. Pure C,
  no dependencies, runs on Linux, macOS, Windows, WASM and a Raspberry Pi
  [verified]. **Pre-v1, and the README says to expect breaking changes**
  [verified]. Pin the version.
- **pgvector** if you are already running Postgres, which you will be.

**Commercial:** OpenAI `text-embedding-3-small` at $0.02/1M tokens, halved with
the Batch API; Voyage voyage-3 at $0.06/1M; Cohere embed-v4 at $0.12/1M [all
review].

**The gap: negligible for this use case, and the use case is why.** A case's
document set is tens to hundreds of documents, not millions. Retrieval only has
to be good enough to put the right pages in front of the model, and the model
then reads them properly. Precision at that scale is dominated by chunking
strategy, not by which embedding model you picked.

**Chunk on document structure, not on token count.** A policy provision split
across two chunks is a contradiction you will never find. That decision matters
ten times more than the embedding model.

**Hardware:** BGE-M3 runs on CPU. Slowly, but it runs. On any GPU it is instant
at these volumes. There is no argument for paying here.

---

## 7. Static site hosting, 7 marketing sites

**Cloudflare Pages, free tier. Unlimited bandwidth at every tier** [review],
500 build minutes/month, 1 concurrent build, 20,000 files per site, 25 MB per
file [review].

Seven static marketing sites will not come close to any of those ceilings.

**Why not the alternatives:** Netlify's free tier is 100 GB bandwidth and 300
build minutes, and since September 2025 new accounts are on a **shared
300-credit pool where deploys, bandwidth and function compute all compete**
[review]. That is a free tier engineered to be outgrown. GitHub Pages has a soft
100 GB/month limit and roughly 10 builds/hour [review], which is fine and worth
keeping as the fallback if Cloudflare's terms change.

**Gap: none.** This is a solved problem and paying for it at this scale would be
strange.

---

## 8. Transactional email

Two jobs that should not share infrastructure.

**Onboarding and product email:** Resend free tier, 3,000 emails/month [review].
100 customers will not exceed it. When it does, AWS SES at $0.10 per 1,000
outbound emails [review] costs about $1/month at any volume this business will
reach. Note the catch: **accounts created on or after 2025-07-15 get no
per-service SES free tier** [review], so the old 62,000-email figure you will
find in blog posts is dead.

**Cold outreach to the 1,203 Florida firms:** this is not a transactional email
problem and the tool choice barely matters. What matters is the sending domain,
and the plan already gets this right: small batches, real personalisation, stop
after two messages. Postmark at $15/month for 10,000 [review] is the
deliverability-first choice if you want one.

**Use a separate subdomain for outreach.** If cold email damages a reputation,
it must not be the reputation that delivers password resets to paying customers.

**Gap: none that matters.** Deliverability is a function of your sending
behaviour and your domain history, not of which API you POST to.

---

## 9. Payments

Already covered above, repeated here because it is the largest line in the stack.

| Option | Rate | On $29,900/month, 100 charges |
|---|---|---|
| **Stripe** | 2.9% + 30¢ [review] | **$897** |
| Stripe + Stripe Tax | +0.5% [review] | $1,046 |
| Paddle | 5% + 50¢ [review] | $1,545 |
| Lemon Squeezy | 5% + 50¢ [review] | $1,545 |

Lemon Squeezy was acquired by Stripe in 2024 [review].

**Take Stripe.** Merchant of record is worth 2.1 percentage points when you sell
across many tax jurisdictions. You are selling to licensed adjusters in Texas
and Florida. That is two states and one country, and Stripe Tax at 0.5% handles
it for a quarter of the cost.

**There is no free option.** There is a cheaper one: annual billing kills 92 of
the 100 fixed 30¢ fees, and ACH at 0.8% capped at $5 [review] cuts the Firm tier
from $17.66 to $5. Both are worth building.

---

## 10. Error tracking, analytics, uptime

| Need | Use | Free tier | Verdict |
|---|---|---|---|
| Errors | **Sentry** Developer | 5,000 errors + 10,000 performance units/month, 1 user, 30-day retention [review] | Enough. Tight |
| Analytics | **PostHog** free | 1M events, 5,000 session recordings, 1M feature-flag requests, 100,000 exceptions/month [review] | Generous. Take it |
| Uptime | **Uptime Kuma**, MIT [verified] | self-hosted, Docker one-liner, port 3001 [verified] | Free forever, runs on the VPS you already have |
| Uptime, hosted | **Better Stack** free | 10 monitors, 3-minute checks, 1 status page [review] | Fine alternative if you want alerting you did not build |

**Sentry's 5,000/month is the one to watch.** One noisy loop in an OCR worker
burns it in an afternoon and then you are blind. Set a rate limit on the client
before you need it, not after.

**Do not self-host Sentry.** The open-source project exists, it is real, and it
wants a machine considerably larger than your app. A solo founder's time is the
scarcest thing in this project.

Umami (MIT [verified], needs Node 18.18+ and PostgreSQL 12.14+ [verified]) is
the self-hosted analytics answer if PostHog's terms change. It is not needed
today.

---

## What NOT to use free, and why

Six things. The first one is the whole document.

### 1. The contradiction engine

Covered at length in §2. The short version: ContractEval found open models
answer "no related clause" when a relevant clause is present [review], and that
is a false negative on the one task the customer is paying for. A missed
contradiction is invisible until the adjuster's claim is underpaid and their
name is on the file. **You cannot buy that customer back, and in a professional
community of 1,203 firms across three counties you cannot buy back the ones they
tell.**

The plan's day-30 kill criterion is findings below 70%. Do not walk into that
gate having handicapped yourself to save $900.

### 2. The citation, specifically

Even on a paid model, never let the *page number* be inferred. Use the API's
citation feature so the page reference comes from the document parser rather
than from the model's memory of what it read. The positioning line is "every
finding links to the page that produced it". A finding linked to page 34 when it
came from page 43 destroys that claim faster than a missed finding does.

### 3. TTS on the two phone lines

$15/month. See §5. This is not a place to be clever.

### 4. Streaming speech recognition on the live lines

$6/month. See §4. Whisper is a batch model wearing a streaming costume.

### 5. Any tool whose licence restricts commercial use

Coqui XTTS-v2's Coqui Public Model License restricts commercial use [review].
Marker and Surya weights are free only under $5M funding or revenue [verified].
MinerU's additional conditions are unread [NOT ESTABLISHED]. LexNLP defaults to
**AGPLv3** [verified], which for a network service is a genuine problem, and its
last release was 2.3.0 on 2022-11-30 [verified] so it is arguably abandoned
anyway.

The failure mode is not a lawsuit on day one. It is discovering at 400 customers
that a load-bearing component has to be ripped out.

### 6. Free LLM tiers that train on your data

Mistral's Experiment tier requires opting into training [review]. These are
policyholder documents, medical bills and IEP records. The plan's legal posture
says "encrypted, never used for training". That sentence and a free tier that
trains on your inputs cannot both be true.

### And one thing that is fine to leave paid-adjacent

The **$1,500–3,000 for a lawyer** in §9 of the Countercite plan is not a
technology cost and no open-source project replaces it. It is the cheapest line
item in this entire document relative to what it prevents.

---

## Free credits worth applying for

Ranked by what a solo founder with no institutional backing can actually get.
All amounts [review]; confirm on the programme page before counting on them.

| Programme | What a bootstrapped solo founder gets | Worth it? |
|---|---|---|
| **Anthropic Startup Program** | Public applications, VC funding **not** required per the FAQ. Standard tier reportedly $1K–$5K; $5K–$25K+ tiers need a partner-network referral | **Apply first.** It subsidises the single biggest cost line in the stack |
| **Cloudflare for Startups** | $5,000 (bootstrapped tier). Founded within 5 years, valid website, building software | **Apply.** You are on Cloudflare anyway |
| **Microsoft for Startups Founders Hub** | $1,000 on email verification, up to $5,000 on business verification. Explicitly open to bootstrapped, solo, pre-revenue founders. Also GitHub Enterprise and M365 Business Premium | **Apply.** Lowest friction on this list |
| **NVIDIA Inception** | Free to join, no equity or fee. Needs incorporation, a working website, at least one developer, under 10 years old. Revenue not required. DGX Cloud credits and preferred GPU pricing | **Apply.** Directly relevant to §1 and §4 |
| **AWS Activate Founders** | $1,000 for self-funded/bootstrapped, pre-Series B, under 10 years old | Apply. SES and S3 fallback |
| **Google for Startups Cloud** | Up to $2,000 for early-stage without VC backing | Marginal, but free to ask |
| **Twilio for Startups** | ~$5,000 in credits. Founded within 5 years, raised under $5M | **Apply if the phone lines go ahead.** Directly relevant to ideas 6 and 7 |
| **Modal** | ~$30/month of compute credit, no application | Just sign up. May cover the whole OCR bill |
| **OpenAI Startup Program** | Routed through partner VCs (Thrive, Sequoia, a16z, Kleiner Perkins, Conviction). **Not accessible bootstrapped** | Skip |

**The tiers to be sceptical about.** Every one of these programmes advertises a
headline number ($150,000 Azure, $250,000 Cloudflare, $100,000 AWS) that
requires investor affiliation. The bootstrapped tier is typically $1,000–$5,000.
That is still real money against a $1,844/month stack, and it is roughly two to
four months of runway on the infrastructure. Do not build a plan on the headline.

**Order of application:** Microsoft (fastest), Anthropic (highest value),
Cloudflare, NVIDIA Inception, AWS, Twilio. An afternoon's work, and the expected
value is a few thousand dollars against a budget under $1,000.

---

## Appendix: open-source repositories worth reading

Named, verified to exist, with what they actually give you.

### Document parsing and OCR pipelines

| Repo | Licence | Why it matters here |
|---|---|---|
| `docling-project/docling` | **MIT** [verified] | Handles PDF, DOCX, PPTX, XLSX, HTML, EPUB, email (EML/MSG), images and audio, with OCR for scanned PDFs. Runs on macOS, Linux and Windows, x86_64 and arm64. Python 3.10+ [verified]. **The most permissively licensed complete pipeline on this list** |
| `Unstructured-IO/unstructured` | **Apache-2.0** [verified] | 60+ formats, partition/chunk/embed. Ships telemetry, disabled with `DO_NOT_TRACK` [verified] |
| `ocrmypdf/OCRmyPDF` | MPL-2.0 [verified] | Deskew, clean, rotate, OCR, PDF/A out. The pre-processing layer everyone forgets |
| `PaddlePaddle/PaddleOCR` | Apache-2.0 [verified] | The OCR engine itself |
| `allenai/olmocr` | Apache-2.0 [verified] | VLM OCR for hard pages. 12 GB VRAM |
| `datalab-to/marker`, `datalab-to/surya` | Apache-2.0 code, **restricted weights** [verified] | Best-in-class, watch the $5M threshold |
| `opendatalab/MinerU` | custom, **unread** [verified that it is custom] | Do not adopt until the licence file is read |

### Legal and contract document intelligence

| Repo | Licence | Why it matters here |
|---|---|---|
| `Open-Source-Legal/OpenContracts` | **MIT** [verified] | The closest thing to prior art for Countercite. 1.5k stars, 185 forks. Does document annotation, **clause comparison across many contracts**, and **text-to-coordinate mapping that preserves PDF layout fidelity** [verified]. That last capability is precisely the citation-to-source-page mechanism the plan's positioning rests on. **Read this repo before building the citation layer** |
| `olivialiu121/ContractEval` | [NOT ESTABLISHED] | The benchmark from §2. If you want to test your own engine the way the paper tested nineteen models, start here |
| `LexPredict/lexpredict-lexnlp` | **AGPLv3** by default [verified] | Legal-aware sentence parsing, extraction of money, dates, courts, citations. **Last release 2.3.0 on 2022-11-30** [verified]. Read it for the extraction patterns, do not depend on it |
| `evolsb/legal-redline-tools` | [NOT ESTABLISHED] | Tracked-changes DOCX and redline PDFs from a review [review]. Relevant to output formatting, not to finding |

**The most important negative result in this document:** I searched GitHub for
open-source insurance denial and claim-appeal projects. Twenty-three
repositories matched. **The most-starred has five stars, and it is a 2020
hackathon project.** Every other result has zero or one star and dates from 2026.

There is no open-source project doing what Countercite does. That is not a
gap in this research. It is a finding about the market, and it is consistent
with the thesis: the institution's side got the software, and nobody built the
other side.

### Infrastructure

| Repo | Licence | Use |
|---|---|---|
| `SYSTRAN/faster-whisper` | MIT [verified] | Batch transcription |
| `openai/whisper` | MIT, code and weights [verified] | Reference implementation |
| `hexgrad/kokoro` | Apache-2.0, code and weights [verified] | Non-crisis TTS |
| `resemble-ai/chatterbox` | MIT [verified] | TTS with published listening tests |
| `OHF-Voice/piper1-gpl` | GPL-3.0 [verified] | Fast local TTS. `rhasspy/piper` is MIT but archived 2025-10-06 |
| `asg017/sqlite-vec` | Apache-2.0 / MIT [verified] | Vector search. Pre-v1, pin it |
| `louislam/uptime-kuma` | MIT [verified] | Uptime monitoring |
| `umami-software/umami` | MIT [verified] | Self-hosted analytics, if PostHog changes |

---

## What I got wrong on the way here, and what I still do not know

I started this expecting to recommend a fully open stack, because that is what
was asked for and because the open tooling in 2026 is genuinely excellent. The
OCR section held up. The embeddings section held up completely. Voice held up on
accuracy and lost on latency, which I did not expect.

Then I looked for evidence on the contradiction task and found ContractEval's
laziness result, and it changed the recommendation. An open model that
under-reports findings is not a cheaper version of the product. It is a
different and worse product, and it fails silently.

**What is still unverified and matters most:**

- Every price here is [review]. The proxy blocked the vendor pages.
- ContractEval's actual numbers are [NOT ESTABLISHED]. I read a summary of the
  abstract, not the paper. **Read the paper before the day-30 gate.**
- Chatterbox's listening-test results against ElevenLabs are published and I did
  not read them. If Chatterbox wins those, §5 changes and you save $15/month.
- The token-per-case estimate driving the $900 figure is my arithmetic. Thirty
  real cases will replace it with a real number, and that measurement is the
  cheapest thing on this list.
