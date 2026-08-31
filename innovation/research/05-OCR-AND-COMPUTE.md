# OCR and compute: three decisions

Researched 2026-08-31. Follows `04-FREE-AND-OPEN-STACK.md` and answers the three
questions the owner sent back against it.

The short version, before the evidence:

1. **MinerU's licence is now readable and now settled.** It permits paid SaaS.
   The catch is an attribution obligation with an automatic-termination clause
   attached. Full text below, verified against the file.
2. **PaddleOCR wins the OCR ranking**, and it is not close once you treat
   text-to-coordinate mapping as the hard requirement it actually is.
3. **RunPod Serverless is the compute pick, at roughly $25/month.** And no,
   free credits do not make this $0, but the reason is more interesting than the
   answer.

---

## How to read the labels

Same scheme as document 04, with one change worth knowing about.

| Label | Means |
|---|---|
| **[verified]** | I read the file or the page myself on 2026-08-31 |
| **[review]** | Search-engine summary, not a page I opened. A lead, not a fact |
| **[NOT ESTABLISHED]** | Could not find it, will not guess |
| **[assumption]** | My arithmetic from stated inputs |

The change: `raw.githubusercontent.com` and `git clone` both work through the
proxy this session, and `WebFetch` reaches github.com HTML. So repository
facts, licence files, benchmark tables and published latency figures in this
document are unusually well verified. I cloned MinerU's full history and read
the licence diffs.

Everything to do with **vendor pricing is still [review]**. `runpod.io`,
`modal.com`, `fly.io`, `huggingface.co` and `modelscope.cn` are all blocked at
the egress proxy. Every price in section 3 came from a search summary. Confirm
each on the vendor's own page before it enters a model.

---

# 1. MinerU: the licence, in full

Document 04 marked this [NOT ESTABLISHED]. It is now established.

## What the file says

`opendatalab/MinerU`, `LICENSE.md` at `master`, fetched and byte-matched against
the cloned repository on 2026-08-31 [verified]. Apache 2.0 plus four additional
terms. Verbatim:

> **1. Commercial License and Thresholds**
>
> MinerU may be used for commercial purposes without a separate commercial
> license. However, if you and your Affiliates, on a consolidated basis, meet
> either of the following thresholds, you must obtain a separate commercial
> license from [MinerU Team] before continuing such use:
>
> a. monthly active users (MAU) exceed 100 million; or
> b. total monthly revenue exceeds USD 20 million.
>
> **2. Online Service Attribution Obligation**
>
> If you provide online services to third parties based on MinerU, you must
> clearly and prominently indicate, in the relevant product or service interface
> or in publicly available documentation, that MinerU is used.
>
> **3. Termination**
>
> Where a separate commercial license is required under Section 1 but is not
> obtained before continuing such use, or where the attribution obligation under
> Section 2 is not complied with, this License and all rights granted under this
> License will terminate automatically, and no further notice from the Licensor
> is required.

Section 4 defines Affiliates as any entity under common control, and control as
the power to direct management and operating decisions, by equity, votes or
contract. Copyright line reads `© 2026 [MinerU Team]`, square brackets included,
which suggests a template that was never fully filled in.

## The four answers the owner asked for

**Does it permit commercial use in a paid SaaS product?** Yes, explicitly and
without a separate licence, until you cross 100 million monthly active users or
$20 million of monthly revenue. Counterweight's break-even model is $29,900 of
monthly revenue. You would need to be roughly 670 times larger before the
threshold bites. Treat it as unreachable.

**Is there an attribution or disclosure requirement?** Yes, and this is the
term that actually applies to you. Providing an online service built on MinerU
obliges you to say so "clearly and prominently" in the product interface or in
public documentation. Not in a dependency manifest. Not in a licences page
nobody opens. The wording says interface or public docs.

**Is there a revenue or funding cap like Marker's $5M?** There is a revenue
threshold, but it is not comparable to Marker's. Marker gates on **$5M of
funding or revenue**, measured annually, and a funded seed round trips it.
MinerU gates on **$20M of revenue per month**, which is $240M a year, and does
not mention funding at all. Marker's tripwire is wired to your Series A.
MinerU's is wired to becoming Baidu.

**Has the licence changed over time?** Repeatedly, and recently. From
`git log --follow` on `LICENSE.md` [verified]:

| Date | Change |
|---|---|
| 2024-03-04 | LICENSE.md created |
| 2026-03-21 | AGPL-3.0 to Apache 2.0 |
| 2026-03-28 | Apache 2.0 back to AGPLv3 |
| 2026-04-14 | AGPL-3.0 to Apache-2.0 again, in LICENSE.md and pyproject.toml |
| 2026-04-17 | Apache 2.0 plus additional conditions, first draft |
| 2026-04-18 | Current text: rewritten into numbered sections, Affiliates defined, termination clause made explicit |

Three flips in four weeks. The 04-17 and 04-18 versions carry the same 100M MAU
and $20M/month thresholds, so the substance did not move between them, only the
drafting. The README dates the change to the 3.1.0 release on 2026-04-18 and
explains the AGPL problem it solved: MinerU had been pinned to AGPL by two
AGPLv3 YOLO models and one CC-BY-NC-SA model it depended on, and a maintainer
said so plainly in July 2025 when someone asked whether a customer buying their
own Ultralytics licence would help ("Since we have not purchased a commercial
license for YOLO, all code in the entire MinerU repository remains under the
AGPL 3.0 license", discussion #2863, 2025-07-03) [verified via WebFetch].

That history is itself a finding. A project that changed its licence three times
in a month can change it again, and Section 3 terminates your rights
automatically with no notice required. Pin a version, vendor the licence file
next to it, and re-read it before every upgrade.

## What is still open

**The model weights are a separate licence and I could not read them.**
`huggingface.co` and `modelscope.cn` are both blocked here. Search summaries say
`MinerU2.5-Pro` weights are Apache 2.0 [review], and the repo's own `pyproject.toml`
declares `LicenseRef-MinerU-Open-Source-License` for the code only. A GitHub
discussion from 2025-10-20 asking exactly this question has zero replies
[verified]. So: **weights licence [NOT ESTABLISHED]**.

**What would settle it:** open `https://huggingface.co/opendatalab/MinerU2.5-Pro-2605-1.2B`
from an unblocked network, read the `license:` field in the model card front
matter and any `LICENSE` file in the repo, and save a dated copy. Five minutes
on a normal laptop.

## The verdict

**Legally clear for this business, and you still should not use it.**

The licence is not the reason to skip MinerU. The reason is section 2 below:
MinerU 2.5.4 scores **75.2 ± 1.1** on olmOCR-bench, and PaddleOCR-VL scores
**80.0 ± 1.0** under plain unmodified Apache 2.0 with no attribution clause and
no termination trigger [verified from the olmOCR benchmark table]. You would be
accepting a bespoke licence, a volatile licence history and a prominent-credit
obligation in exchange for a lower score.

If MinerU ever pulls clearly ahead on the documents that matter, adopt it,
attribute it visibly in the product, and set a reminder to re-read
`LICENSE.md` on every version bump. Until then there is nothing to decide.

---

# 2. Ranking the clean-licence OCR options

The job: insurance policies and denial letters. Mostly clean digital PDFs.
Sometimes a third-generation fax, a phone photograph taken at an angle, or a
skew-scanned production. The product cites a source page, so text-to-coordinate
mapping is a pass/fail requirement.

That last constraint does most of the ranking work, and it disqualifies the
option most people would pick first.

## The evidence table

Maintenance figures are from the GitHub repository pages and from shallow clones
I made on 2026-08-31, so the last-commit dates are exact [verified].

| | Licence | Last commit | Latest release | Stars | Open issues | Coordinates |
|---|---|---|---|---|---|---|
| **PaddleOCR** | Apache-2.0 | 2026-07-22 | 3.7.0, 2026-06-11 | 88.5k | 159 | **Per line: polygon, box, confidence** |
| **Docling** | MIT | **2026-08-31** | 2.70.x | 65.8k | 904 | **Per element: bbox + page_no** |
| **OCRmyPDF** | MPL-2.0 | 2026-08-30 | v17.11.0, 2026-08-28 | 34.6k | 93 | Via invisible text layer |
| **Tesseract** | Apache-2.0 | 2026-08-21 | 5.5.3, 2026-07-24 | 76.3k | 437 | **hOCR, ALTO, TSV, box** |
| **Unstructured** | Apache-2.0 | 2026-08-28 | rolling | 15.4k | 186 | Per element: points + system |
| **olmOCR** | Apache-2.0 | **2026-03-25** | v0.4.27, 2026-03-12 | 19.4k | 59 | **None. Page numbers only** |

Sources for the coordinate column, all read in source rather than in docs:

- PaddleOCR returns `dt_polys` (4×2 int16 per detected box), `rec_polys`,
  `rec_boxes` (x_min, y_min, x_max, y_max) and `rec_scores` per line
  [verified in `docs/version3.x/pipeline_usage/OCR.md`]. The README states that
  PP-StructureV3 goes further and gives "table cell coordinates, text
  coordinates", and that the PaddleOCR-VL series does **not** [verified].
- Docling's document model clamps and validates a `BoundingBox` against
  `page_no` for every provenance item [verified in `docling-core`].
- Tesseract's public API exposes `GetHOCRText`, `GetAltoText`, `GetPAGEText`,
  `GetTSVText` and `GetBoxText` [verified in `include/tesseract/baseapi.h`].
- Unstructured carries a `CoordinatesMetadata` class holding `points` plus a
  `CoordinateSystem` with layout width and height on every element
  [verified in `unstructured/documents/elements.py`].
- olmOCR's Dolma output record contains `text`, `metadata`, and an `attributes`
  block whose spatial content is `pdf_page_numbers` and nothing else
  [verified in `olmocr/pipeline.py`]. No boxes. Not anywhere.

## Accuracy

Two sources, and they measure different things.

**On clean digital PDFs, accuracy is the wrong question.** A born-digital
insurance policy has a real text layer. `pypdfium2` or `pdfplumber` reads it
exactly, character by character, with per-character bounding boxes, at zero cost
and no error rate at all. Running OCR over a page that already has its text is a
way to introduce mistakes you did not have. The only judgement call is detecting
which pages genuinely have a usable text layer.

**On hard pages, here is the published benchmark.** From the olmOCR-bench table
in `allenai/olmocr` README, 7,000+ test cases over 1,400 documents [verified]:

| System | Old scans | Tables | Multi-column | Overall |
|---|---:|---:|---:|---:|
| Chandra OCR 0.1.0 | 50.4 | 88.0 | 81.2 | **83.1 ± 0.9** |
| Infinity-Parser 7B | 47.9 | 85.0 | 84.2 | 82.5 |
| **olmOCR v0.4.0** | 47.7 | 84.9 | 83.7 | **82.4 ± 1.1** |
| **PaddleOCR-VL** | 37.8 | 84.1 | 79.9 | **80.0 ± 1.0** |
| Marker 1.10.1 | 33.5 | 72.9 | 80.0 | 76.1 |
| DeepSeek-OCR | 33.3 | 80.2 | 66.4 | 75.7 |
| MinerU 2.5.4 | 33.7 | 84.9 | 78.2 | 75.2 |
| Mistral OCR API | 29.3 | 60.6 | 71.3 | 72.0 |

Two honest caveats. The benchmark is published by the olmOCR team and olmOCR
places third on it, which is a conflict worth naming even though the numbers
look fairly presented. And several rows carry an asterisk that the README never
explains, so cross-system comparison should be treated as indicative.

Now read the **Old scans** column, because that column is your faxes. The best
system on earth scores 50.4. Nothing clears 51. Whatever you pick, roughly half
the content on a genuinely bad scan comes back wrong, and the difference between
first place and seventh on that column is 17 points, not 50. That reframes the
whole problem: the win is not in engine selection, it is in **preprocessing
before OCR and confidence handling after it**.

## Speed and hardware, with real numbers

PaddleOCR publishes per-model latencies measured on an Intel Xeon Gold 6271C at
2.60GHz and an NVIDIA Tesla T4 [verified, including the hardware note]:

| Model | GPU ms | CPU ms | Size |
|---|---:|---:|---:|
| PP-OCRv5_mobile_det | 10.67 / 6.36 | 57.77 / 28.15 | 4.7 MB |
| PP-OCRv5_mobile_rec | 5.43 / 1.46 | 21.20 / 5.32 | 16 MB |
| PP-OCRv5_server_det | 89.55 / 70.19 | 383.15 | 84.3 MB |
| PP-LCNet doc orientation | 2.62 / 0.59 | 3.24 / 1.19 | 7 MB |
| UVDoc image rectification | 19.05 | 869.82 | 30.3 MB |

Second figure is high-performance mode. Detection runs once per page,
recognition once per text line.

**Take a dense insurance page at 70 text lines** [assumption]. Normal CPU mode:
0.058 + 70 × 0.0212 = **1.54 seconds per page**. High-performance mode:
**0.40 seconds per page**. At 225,000 pages a month that is **96 core-hours** in
normal mode, or 25 in high-performance mode [assumption]. A 4-vCPU VPS offers
2,920 core-hours a month. You are using 3% of a box you have already budgeted
$15 for. Even if a cheap VPS vCPU is three times slower than that Xeon core,
which is a reasonable worst case, you are at 10%.

That is the most important number in this document and it is not about GPUs at
all.

PP-OCRv6, shipped in PaddleOCR 3.7.0 on 2026-06-11, publishes a 5.2× CPU speedup
via OpenVINO and three tiers at 1.5M, 7.7M and 34.5M parameters [verified].
olmOCR needs a 12 GB NVIDIA card and 30 GB of disk, and quotes "less than $200
USD per million pages converted" on a 7B VLM [verified].

## The ranking

**1. PaddleOCR.** Per-line polygons and per-line confidence scores, which is
exactly the shape your citation feature needs. Apache-2.0, no additional terms,
no weight-licence surprise. Runs usefully on the CPU you already own, scales up
to a GPU VLM in the same toolkit if you need it. 88.5k stars and only 159 open
issues, which is a healthy ratio. Exports to ONNX and runs under ONNX Runtime,
OpenVINO or TensorRT [verified], so you are not welded to the Paddle framework.

**2. Docling.** MIT, IBM-backed, and the last commit was today. Bounding-box
provenance is native to its document model rather than bolted on. Best structure
representation of anything here: reading order, table structure, page layout.
The honest limitation is that Docling is a converter, not an OCR engine, and it
delegates OCR to Tesseract or RapidOCR underneath. Also note its README line:
"For individual model usage, please refer to the model licenses found in the
original packages." The MIT badge covers the code, not the layout models it
downloads. That is worth ten minutes before you ship.

**3. OCRmyPDF.** Ranked here for what it is, which is not an OCR engine. It
deskews, cleans, rotates and then writes an invisible text layer positioned over
the original image. On a fax, that preprocessing step is worth more than the
choice of engine. Released v17.11.0 three days ago and 93 open issues on 34.6k
stars, which is the best-maintained project in the table. **One licence
wrinkle:** OCRmyPDF is MPL-2.0, but it requires an external Ghostscript
installation [verified in its README], and Ghostscript's own LICENSE file puts
it under the AGPL [verified]. Invoking an unmodified binary as a separate
process is generally treated as separate work, and you are not distributing it,
so the exposure is probably nil. Probably is not a word I want in a compliance
answer. Get a lawyer to look at it, or swap the Ghostscript steps for
`pikepdf`/`qpdf` equivalents.

**4. Tesseract.** Apache-2.0, version 5.5.3 released 2026-07-24, still actively
committed. Word-level boxes and per-word confidence through hOCR, ALTO and TSV.
It is not the best engine on this list and it will not be. Its value here is as
a **second opinion**: when Tesseract and PaddleOCR disagree on a dollar amount,
that page gets flagged rather than accepted. Two mediocre engines that disagree
loudly are worth more to this product than one good engine that is confidently
wrong.

**5. Unstructured.** Apache-2.0 confirmed by reading LICENSE.md [verified].
Coordinates on every element. Its real value is breadth: 60+ file types, so it
handles the .msg email, the .docx demand letter and the .xlsx estimate that
arrive alongside the PDFs. Its OCR is Tesseract underneath and its layout model
defaults to YOLOX [verified in `unstructured-inference`], so it adds nothing to
accuracy. Use it at the ingest edge, not in the OCR path.

**6. olmOCR.** Third on the accuracy benchmark and last on this list, for two
reasons that have nothing to do with quality. First, **it does not emit
coordinates**. Its output is a Dolma record with markdown text and a
`pdf_page_numbers` character-span map. You can cite a page. You cannot highlight
a line, and you cannot show the user the image crop beside the extracted text,
which document 04 correctly identified as the design difference between this
product and DoNotPay. Second, **main has had no commit since 2026-03-25** and the
last tag is v0.4.27 from 2026-03-12. Five months quiet is not abandonment, and
AI2 is a serious institution, but it is not the profile you want for the
component that reads your customers' hardest documents.

## The cascade, in order

```
0.  pypdfium2 / pdfplumber      Real text layer? Take it. Char-level bboxes,
                                zero cost, zero error. ~70-85% of the corpus.
1.  Docling                     Digital PDFs where structure matters:
                                declarations pages, endorsement schedules,
                                anything with a table. MIT, bbox provenance.
2.  OCRmyPDF                    No text layer. Deskew, clean, rotate, correct
                                orientation. Emit a cleaned raster.
3.  PaddleOCR PP-OCRv6          OCR the cleaned raster on CPU. Keep rec_polys
    (small or medium tier)      and rec_scores per line. This is your workhorse.
4.  Tesseract, as adjudicator   Re-run any page whose mean line confidence is
                                below threshold, or any page containing a money
                                or date token. Disagreement = flag, not accept.
5.  GPU VLM tier                PaddleOCR-VL or olmOCR, on the residue only.
                                Budget ~10% of pages. Show the user the crop.
```

Stages 0 to 4 run on the $15 VPS. Only stage 5 needs a GPU, and that is what
section 3 is about.

Three rules that matter more than the ranking, carried forward from document 04
because they are still right: run two engines and compare on money and dates,
keep a per-page confidence score and surface it, and never let a low-confidence
page produce a finding silently.

---

# 3. Compute for the GPU tier

## What we are actually buying

225,000 pages a month total. Stages 0 to 4 handle roughly 90% on CPU. That
leaves about **22,500 pages a month** needing a GPU [assumption]. Bursty, not
continuous, and entirely batchable, because nobody is staring at a spinner while
a fax is rescued.

Two anchors for how long that takes. Marker publishes 2.9 pages/sec on GPU
[verified in document 04]. olmOCR publishes under $200 per million pages on a 7B
VLM [verified]. At 2.9 pages/sec, 22,500 pages is **2.2 GPU-hours**. A 7B VLM is
slower than Marker; assume five to ten times slower and you land at **11 to 22
GPU-hours a month** [assumption].

Everything below is priced against that.

## The field

All prices [review]. All from search summaries. All blocked at the proxy.

| Provider | Rate | Billing | Cold start | Free tier | Solo-founder effort |
|---|---|---|---|---|---|
| **RunPod Serverless** | 4090 ~$1.10/hr active; L4 from ~$0.58/hr | Per second of active compute, scales to zero | FlashBoot sub-200ms for warm endpoints; 60–120s for a heavy vLLM container | none meaningful | Low. Docker image, handler function |
| **RunPod Pods** | 4090 $0.34/hr community, $0.69/hr secure | Per second, pod start to termination | n/a, always on | none | Medium. You manage the queue |
| **Modal** | L4 $0.000222/s ($0.80/hr); A10 $0.000306/s; L40S $0.000542/s ($1.95/hr) | Per second | 2–4s typical | **$30/month, resets, no rollover** | Lowest. Python decorators, no Docker |
| **Vast.ai** | 4090 from $0.13/hr, typical $0.29–0.59; spot from $0.09 | Per second | Varies by host | none | High. Peer marketplace, no uptime guarantee |
| **Replicate** | L40S $0.000975/s ($3.51/hr); A100 80GB $0.0014/s ($5.04/hr) | Per second, **including cold-start boot on private models** | ~2 min boot billed on private deployments | none | Low |
| **HF Inference Endpoints** | AWS L4 $0.80/hr, A10G $1.00/hr; GCP L4 $0.70/hr | Per minute; billed while "initializing" too | 15-min idle then scale to zero; returns 502 during warm-up | none | Low |
| **Together** | Dedicated H100 $6.49/hr; clusters $5.49/hr on demand | Per hour | n/a | none | Low, but wrong shape |
| **Fly.io GPUs** | L40S $1.25/hr, A100 80G $3.50/hr | Per second | n/a | none | **Deprecated. Unavailable after 1 August** |

Fly.io is out on availability, and I could not confirm the year on that
deprecation date because `fly.io` is blocked [review]. Together and Replicate are
out on price: at $3.51 to $6.49 an hour they cost four to eight times RunPod for
the same work, and Replicate bills you for a two-minute cold start on every
private-model invocation, which is precisely the pattern a bursty batch job hits
hardest. Hugging Face Endpoints bills the initializing state as well as the
running state, so its scale-to-zero saves less than it appears to. Vast.ai is
genuinely the cheapest number on the page and genuinely the worst fit: it is a
peer-to-peer marketplace with no uptime guarantee, and a solo founder should not
spend evenings discovering which anonymous host reclaimed the box mid-batch.

That leaves RunPod and Modal, which is where the owner's instinct already was.

## The pick: RunPod Serverless

**Recommendation: RunPod Serverless for the GPU tier. Roughly $25/month at
225,000 pages.**

The arithmetic: 11 to 22 GPU-hours a month at about $1.10/hr for an active
serverless 4090 is **$12 to $24** [assumption on hours, [review] on rate]. Add
retries, image pulls and the pages you route to the VLM out of caution, and
**$25/month** is the number to plan on. Sensitivity: if your real cases run 400
pages instead of 150, it is about $65. If you gave up entirely on the CPU
cascade and pushed all 225,000 pages through the VLM, it is roughly $120 to $240.
Even the worst of those beats the $338/month that commercial per-page OCR costs
at this volume [review, from document 04].

Four reasons it beats Modal for this specific job, in order of weight:

**Compliance, and this is the deciding one.** Denial letters from health plans
contain protected health information. RunPod states HIPAA compliance achieved
2026-02-06 with BAAs available, alongside SOC 2 Type II [review]. Modal has SOC 2
Type II and supports HIPAA workloads, but the BAA sits on the **Enterprise plan**
[review]. So Modal's free tier and its BAA are mutually exclusive, which quietly
kills the "$30 of free credit covers it" plan the moment a health-plan denial
enters the pipeline. One caveat that cuts the other way: one source says RunPod
reserves custom legal agreements for customers committing $3,000/month or more
[review]. **Verify both before you sign anything.** If Counterweight's document
set is purely property and casualty, hail claims and carrier correspondence with
no PHI, this whole paragraph relaxes and Modal becomes competitive again.

**Price.** RunPod's serverless 4090 at ~$1.10/hr against Modal's L40S at
$1.95/hr, for work that is throughput-bound and does not need 48 GB of VRAM.

**Cold start.** FlashBoot claims sub-200ms for warm endpoints against Modal's
2–4 seconds [review]. Be sceptical: one report notes that a heavy vLLM container
still takes 60–120 seconds regardless of FlashBoot [review]. For a batch job
neither number matters much, which is why this reason ranks third.

**Escape hatch.** A RunPod serverless worker is a Docker image plus a handler
function. That runs unmodified on Modal, on Cerebrium, on a bare pod, or on your
own machine. Modal's Python-decorator model is genuinely nicer to write and
genuinely stickier: porting off it means rewriting the orchestration layer, not
just changing a base URL.

**What Modal is still for.** Open a Modal account anyway and use the $30 for
experiments, benchmark runs and the evaluation harness you need to build in days
1–30 of the plan. The developer experience is the best on the list. It is a
better laboratory than RunPod. It is a worse place to put PHI on a free plan.

## Could per-second billing plus free credits make this $0?

**On the tail workload, yes on paper. In practice, no. And chasing it is the
wrong optimisation.**

The paper case is real. Modal gives every account $30/month of compute that
resets monthly, requires no credit card, and bills per second [review]. At L4
rates of $0.000222/s that is 37.5 GPU-hours, comfortably more than the 11 to 22
hours the tail needs. So the bill genuinely could read zero.

Three things break it:

1. **The credit does not roll over and it resets monthly** [review]. A heavy
   month, a re-processing run, or a bad batch that needs rerunning puts you over,
   and there is no accumulated buffer.
2. **The BAA is on Enterprise** [review]. If any document in the pipeline carries
   PHI, the free plan is not an option regardless of the arithmetic.
3. **Per-second billing does not mean you only pay for work.** You pay for
   container boot, model load into VRAM, and image pull. A 7B VLM loading into a
   cold container is tens of seconds of billed time before it reads a single
   page. Batch aggressively or that overhead dominates a small job like this one.

The bigger point is the one the arithmetic in section 2 already made. **The GPU
line is not where your money is.** At 225,000 pages a month the OCR bill is
about $15 of VPS you are already paying for plus about $25 of GPU. Driving that
$25 to $0 saves $300 a year. The Stripe line in document 04 is $897 a month and
the Claude line is about $120 batched. One percentage point of card fee is
$299 a month, twelve times the entire GPU bill.

*(Corrected after this document was drafted. The $900 Claude figure it inherited
from document 04 was a ceiling guessed at before the contradiction engine
existed. `../model/api_cost.py` computes the real number from the pipeline the
engine actually runs: $0.398 a case batched on Opus 5, so $120 at 300 cases a
month. The correction strengthens the argument rather than weakening it. Card
fees now dwarf every compute line on the page.)*

Spend the effort on annual billing and ACH. Not on free GPU credits.

---

# The vetting gate

Applied to the two things this document recommends adopting.

## PaddleOCR (primary OCR engine)

| Gate | Result |
|---|---|
| **Licence** | **Pass.** Apache-2.0 on the code, no additional conditions [verified in repo README]. The PP-OCRv5/v6 and PaddleOCR-VL weights are reported Apache-2.0 [review]; the Hugging Face model cards are blocked here, so confirm them the same way as MinerU's |
| **Maintenance** | **Pass.** Last commit 2026-07-22, release 3.7.0 on 2026-06-11, 88.5k stars, 159 open issues [verified] |
| **Actual fit** | **Pass, and it is the reason for the ranking.** Per-line polygons plus per-line confidence is exactly the citation primitive the product needs. CPU tiers fit the existing VPS with 90% headroom |
| **Security** | **Pass with a condition.** Runs entirely in-process on your own infrastructure, so no document leaves your network. Condition: model weights download from Baidu-hosted BOS URLs on first run. Mirror them into your own R2 bucket and pin the hashes rather than pulling from a third party at deploy time |
| **Replaceability** | **Pass.** Exports to ONNX and runs under ONNX Runtime, OpenVINO or TensorRT [verified], so the PaddlePaddle framework is not a lock-in. The output shape (polygon, text, score) is generic enough that swapping to Tesseract or a VLM means changing an adapter, not the pipeline |

**Adopt.** Behind an interface that returns `(text, polygon, confidence,
page_no)` and nothing Paddle-specific.

## RunPod Serverless (GPU tier)

| Gate | Result |
|---|---|
| **Licence** | n/a, commercial service |
| **Maintenance** | **Pass** on the evidence available. Established provider, SOC 2 Type II [review] |
| **Actual fit** | **Pass.** Scale-to-zero, per-second billing on active compute, bursty batch workload is the pattern it was built for |
| **Security** | **Conditional pass, and this is the open item.** HIPAA compliance and BAA availability are [review] and one source suggests a $3,000/month commitment gate on custom agreements [review]. Community Cloud runs on third-party hosts and should not touch customer documents at all. Use Secure Cloud endpoints only |
| **Replaceability** | **Pass, and deliberately so.** Docker image plus handler function ports to Modal, Cerebrium or a bare pod in an afternoon |

**Adopt, conditionally.** The condition is confirming the BAA terms in writing
before a single real customer document reaches a GPU. Until that is confirmed,
run the GPU tier on synthetic and public documents only, and let the CPU cascade
carry production.

## MinerU

**Do not adopt.** Not on licence grounds, which are now clear, but because
PaddleOCR-VL scores five points higher on the same benchmark under an
unmodified Apache 2.0 with no attribution clause. Revisit if that changes.

---

# What would settle the open items

Five things, none of them hard, all blocked by this machine's proxy rather than
by difficulty.

1. **Model weights licences, MinerU's and PaddleOCR's both.** Open the Hugging
   Face model cards for `opendatalab/MinerU2.5-Pro-2605-1.2B` and
   `PaddlePaddle/PaddleOCR-VL`, read the `license:` field and any LICENSE file,
   save dated copies. MinerU's is [NOT ESTABLISHED]; PaddleOCR's is [review].
2. **Every price in section 3.** Open runpod.io/pricing and modal.com/pricing
   and read them. Everything in that table is a search summary.
3. **The RunPod BAA terms**, specifically whether the $3,000/month commitment
   applies to a standard BAA or only to bespoke agreements. This decides whether
   the compute recommendation survives contact with PHI.
4. **Ghostscript's AGPL exposure** through OCRmyPDF, from a lawyer, not from a
   forum. Or remove the dependency.
5. **The only number that matters: run 500 real pages.** Take a genuine mix from
   the actual corpus, faxes and photographs included, through stages 0 to 4 on
   the real VPS. Measure seconds per page, the fraction that reaches stage 5, and
   the character error rate on the pages you care about. Every figure in section
   2's arithmetic is built on a 70-lines-per-page assumption and a 10% GPU
   fallout rate. Both could be wrong by a factor of two, and both are cheap to
   measure.

Do number 5 first. It replaces four assumptions with facts and it costs an
afternoon.
