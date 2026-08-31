# 07 — OpenContracts as Countercite's citation layer

**Question:** can `Open-Source-Legal/OpenContracts` supply the PDF → coordinates →
anchor → highlight layer that `engines/contradiction/core.mjs` is missing?

**Verdict:** partly. Take about 250 lines and one data shape. Leave the rest.

**Method.** I cloned the repo rather than reading it through a browser, at
`f2b58f9965c031026d8ce9e8eacb94677614196a` (2026-08-31, the tip of `main` on the
day I looked). I also cloned `JSv4/plasmapdf`, installed pandas, and *ran* its
translation layer against OpenContracts' own test fixture, because the interesting
questions about that library are not answerable by reading it. Everything below
that names a file and a line number, I opened. Everything I could not check is
marked `[unverified]` with the check I would run.

Sizes for calibration: 475,831 lines of Python in `opencontractserver/`, a
6,737-line GraphQL schema, 109 migrations in the annotations app alone, 89 files
and 24,396 lines in the frontend annotator directory, 14 services in `local.yml`.
1.5k stars, 185 forks, 10 open issues, 12,715 commits. Version 3.0.0 shipped
2026-08-09 and there were commits the day I cloned. Nothing here is abandoned.

---

## 1. Licence

### The licence itself

MIT. Not Apache-2.0. The root `LICENSE` is the unmodified standard text, with
one copyright line:

```
Copyright (c) 2026 John Scrudato IV
```

No additional clauses, no field-of-use restriction, no NOTICE file anywhere in
the tree (I looked). MIT has no version number.

`plasmapdf`, the extracted span-to-coordinate library that OpenContracts pins at
`0.1.3` in `requirements/base.txt`, is separately MIT: `Copyright (c)
2024-present John Scrudato IV`.

### Can I copy code into a closed-source commercial SaaS?

Yes. That is what MIT is for. There is no copyleft, no source-disclosure trigger,
no network-use clause.

### The CLA

`CLA.md` exists and is enforced in CI by `.github/workflows/cla.yml`
(`contributor-assistant/github-action`, pinned to SHA `ca4a40a7d10…`, v2.6.1,
with signatures committed to a `cla-signatures` branch). It is an adaptation of
the ASF Individual CLA v2.2 with the grantee changed from a foundation to the
individual maintainer.

It is inbound-only. It binds people who submit pull requests, not people who use
the code. If I never contribute back, it never applies to me.

One clause is worth reading anyway. Section 2 lets the maintainer relicense the
project under "any future license the Maintainer chooses … including more
permissive or more restrictive licenses". The MIT grant on the code as it exists
today is irrevocable for that code, so this can't retroactively bite me. It does
mean I should record the exact commit I copied from, so that a future relicence
can't create confusion about what terms my copy arrived under. Cheap insurance:
put the SHA in the file header.

### What attribution is required, and where

The MIT condition is that the copyright notice and permission notice appear "in
all copies or substantial portions of the Software."

For a SaaS this splits in two:

- **Backend Python I copy and run on my own servers.** Strictly, running is not
  distributing, so nothing is legally required. Put the notice in anyway, in a
  header comment on each borrowed file. It costs three lines and it is the
  difference between a clean answer and an awkward one during diligence.
- **Any borrowed JavaScript that ships to a browser.** That *is* distribution.
  The notice has to travel with it. Practically: a `THIRD-PARTY.md` in the repo
  plus a `/licenses` route or an about-page link in the built app, listing
  OpenContracts (MIT, John Scrudato IV) and anything else I vendored.

### Transitive licence risk

I read every requirements file in the repo: `base.txt`, `local.txt`,
`production.txt`, `docs.txt`, and the three optional extras
(`analyzers/claude_highlighter.txt`, `ingestors/llama_parse.txt`,
`postprocessors/redact.txt`).

There is no AGPL and no GPL in the declared Python dependency set. The usual trap
is not sprung here. The PDF-relevant packages are:

| Package | Licence | Note |
|---|---|---|
| `pdfplumber>=0.11.10` | MIT | the actual token extractor |
| `shapely>=2.1.2` | BSD-3 | STRtree spatial index |
| `numpy` (via shapely/opencv) | BSD-3 | |
| `pypdf>=6.15.0,<7` | BSD-3 | outline enricher only |
| `pdf2image>=1.17.0` | MIT | wraps the **poppler** binary, GPL-2.0 |
| `opencv-python-headless` | Apache-2.0 | image work, not needed by me |
| `plasmapdf==0.1.3` | MIT | verified directly |
| `pytesseract` (local.txt) | Apache-2.0 | wraps tesseract, Apache-2.0 |

The one to think about for five seconds is `pdf2image`. The Python wrapper is
MIT; it shells out to poppler's `pdftoppm`, which is GPL-2.0. Invoking a separate
executable is the classic system-boundary case and does not pull GPL onto the
caller. I do not need `pdf2image` at all, so the question is moot for me. Drop
it and the question never arises.

Licences in that table come from my own knowledge of those packages, not from
pulling each project's LICENSE file. `[partly unverified]` — the check is one
`pip download` plus reading each wheel's metadata, and it's worth doing once
before shipping.

### The actual trap, and it isn't AGPL

`docs/acknowledgements.md` says, in the repo's own words, that the frontend is
"built in part on top of the PAWLs project frontend" and that they are "planning
to continue using their PDF rendering code."

AI2's PAWLS is **Apache-2.0** (verified: `allenai/pawls/LICENSE`).

I checked whether that lineage is real or historical. It is real. `scaled`,
`spanningBound`, `normalizeBounds`, `doOverlap` and the class `PDFPageInfo` all
exist in `allenai/pawls` at `ui/src/context/PDFStore.ts` with matching
signatures, and all five are present in OpenContracts at
`frontend/src/utils/transform.tsx` and
`frontend/src/components/annotator/types/pdf.ts`. There is no AI2 copyright
header on OpenContracts' copies, and there is no NOTICE file.

Apache-2.0 §4 asks that copyright and attribution notices be retained in
derivative works. Relicensing an Apache-2.0 derivative as MIT is permitted, but
the attribution obligation doesn't evaporate. So: if I lift anything from
OpenContracts' frontend that traces to PAWLS, I should credit **both**. That is
one extra line in `THIRD-PARTY.md`.

Those five functions are 40 lines of trivial geometry that I'd write correctly on
the first try. The cleanest move is to write them myself and sidestep the
question entirely. The frontend function I actually want (`normalizeTokensToPdfViewport`)
does not exist in PAWLS and appears to be OpenContracts' own work.

---

## 2. Architecture

### How an annotation is stored

`opencontractserver/annotations/models.py:924`, class `Annotation`. The
positional fields are:

```python
page       = IntegerField(default=1, blank=False)     # line 932
raw_text   = TextField(null=True, blank=True)         # line 933
json       = NullableJSONField(default=…, null=False) # line 939
```

That's it. There is no bbox column, no `char_start` column, no `char_end`
column. All geometry lives inside the `json` blob. The other ~25 fields on the
model are labels, permissions, embeddings, analysis provenance and corpus
plumbing.

`json` holds one of three shapes, all declared in
`opencontractserver/types/dicts.py`:

**v1 token annotation** (`OpenContractsSinglePageAnnotationType`, line 141),
stored as a dict keyed by page index:

```json
{
  "2": {
    "bounds": { "top": 140.38, "bottom": 148.69, "left": 257.04, "right": 474.74 },
    "tokensJsons": [ { "pageIndex": 2, "tokenIndex": 341 }, … ],
    "rawText": "meaning ascribed to the term in Section 7.4 of this Agreement."
  }
}
```

**v2 compact** (`CompactAnnotationJsonType`, line 158), same information with
range-encoded token indices:

```json
{ "v": 2, "p": { "2": { "b": [140.4, 257.0, 474.7, 148.7], "t": "341-351" } } }
```

**Span** (`TextSpanData`, line 184), used for non-PDF documents:
`{"start": 0, "end": 42, "text": "…"}`.

So: page number is a column, bounding box is in JSON, token references are in
JSON, raw text is in both. **Character offsets are stored nowhere.** They exist
only in memory, rebuilt from the `.pawls` file every time by plasmapdf's
`tokens_dataframe` (columns `Page`, `Token_Id`, `Char_Start`, `Char_End`). That
is a deliberate choice: the tokens are the durable truth and offsets are derived.
It is also where their one real bug lives, which is §4.

### PDF to coordinates

**pdfplumber.** Not PyMuPDF, not PyPDF. I grepped the entire tree for `fitz`,
`pymupdf` and `PyMuPDF` and got zero hits across 475k lines. In an MIT project
that could freely have used PyMuPDF, that reads as a decision rather than an
oversight, and it's the same decision I'll reach in §6.

The function is `extract_pawls_tokens_from_pdf` at
`opencontractserver/utils/pdf_token_extraction.py:159`. The core of it:

```python
words = pdf_page.extract_words(
    x_tolerance=2, y_tolerance=2, keep_blank_chars=False, use_text_flow=True,
)
# pdfplumber gives x0, top, x1, bottom with a top-left origin
token = {"x": x0, "y": top, "width": x1 - x0, "height": bottom - top, "text": text}
```

Plus a per-page shapely `STRtree` so that "which tokens fall inside this
rectangle" is a spatial query rather than a scan. `find_tokens_in_bbox` at line
355 is the query side.

One structural fact that matters if you're thinking of adopting the pipeline: the
two parsers OpenContracts actually runs in production, `DoclingParser`
(`pipeline/parsers/docling_parser_rest.py`) and `WarpIngestParser`
(`pipeline/parsers/warp_ingest_parser.py`), are both **REST clients to separate
containers**. Their docstrings say so plainly: "the heavy parsing dependencies
live in an isolated container … so the Django image stays slim." Adopting their
pipeline means adopting two more images from two more repos. The in-repo
pdfplumber path is the one a small consumer would reuse.

### Page index base, and a wart

Canonical is **0-based**. `extract_pawls_tokens_from_pdf` writes
`"index": page_num_0based`, and the frontend computes `this.page.pageNumber - 1`
(`types/pdf.ts`).

But the backend test fixtures disagree with the code. I loaded both:

- `opencontractserver/tests/fixtures/files/doc_1_pawls_parse_file.pawls` →
  page indices `[1, 2, 3, 4, 5, 6, 7, 8, 9]`
- `frontend/test-assets/test.pawls` → page indices `[0, 1, 2, …]`

And `Annotation.page` on the model defaults to `1` while every JSON payload it
sits next to is 0-based. Two conventions inside one row. This is exactly the
class of bug that sends a reviewer to the wrong page, which is the one thing
Countercite cannot afford, so §7 puts both numbers in the Locator explicitly.

---

## 3. What I can reuse, ranked

| # | Component | Where | Size | Drags in | Django/GraphQL coupling |
|---|---|---|---|---|---|
| 1 | `extract_pawls_tokens_from_pdf` | `utils/pdf_token_extraction.py:159` | ~195 lines, ~120 after dropping images | pdfplumber, shapely, numpy | none *in the function*; module imports `django.conf.settings` |
| 2 | `pdf_token_matching.py` (whole file) | `utils/pdf_token_matching.py` | 133 lines | stdlib `difflib` | none |
| 3 | PAWLS page/token JSON shape | `types/dicts.py:71–130` | a format, not code | nothing | none |
| 4 | `normalizeTokensToPdfViewport` + `resolvePageTokens` | `frontend/src/utils/transform.tsx` (tail) | ~100 lines TS | nothing | none |
| 5 | The "dumb anchor" pattern | `utils/annotation_anchoring.py` | 14 KB to read, 0 to copy | — | imports Django models |
| 6 | plasmapdf's translation-layer *concept* | `JSv4/plasmapdf` | 1,154 lines total | pandas, numpy | none (separate pkg) |
| 7 | The export format | `types/dicts.py` V1/V2/V3 | — | — | total |

**1. The pdfplumber extractor.** The single best thing in the repo for my
purposes. It converts pdfplumber's word boxes into the token record, handles the
page-dimension rescale case, skips degenerate zero-area boxes, and builds the
spatial index. The *function* has no Django in it; the *module* does, at line 29
and inside the image helpers. Lift the function, not the module.

**2. `pdf_token_matching.py`.** 133 lines, five functions: `page_text_tokens`,
`match_title_to_tokens`, `union_bounds`, `select_tokens_in_region`,
`_intersection_area`. Zero Django imports. This is the "here is a quote and a
rough rectangle, give me the exact tokens" logic, which is precisely what turns
a judge's verdict about a passage back into a highlight. Second-highest value per
byte in the repo.

**3. The PAWLS token record.** Free, and it buys interoperability with
plasmapdf, Warp-Ingest and (via converters) Docling. §5.

**4. `normalizeTokensToPdfViewport`.** This one is worth more than its size
suggests. The docstring explains the bug: your parser measures the page one way,
pdf.js computes its own dimensions from MediaBox/CropBox/rotation, and if they
differ your highlights drift progressively down the page. I would have shipped
that bug and then spent a day finding it. 100 lines of pure functions on plain
data, no Apollo, no jotai.

**5. `annotation_anchoring.py`.** Read it, don't copy it. The idea is that an
annotation is stored as `(page, bbox, rawText)` with **rawText as the source of
truth**, and re-anchoring resolves geometry first and falls back to a fuzzy text
match, dropping anything it can't place confidently. That idea, compressed into
a single hash field, is in my Locator proposal.

**6. plasmapdf.** Borrow the concept of a translation layer, not the code. See
§4 for three verified reasons.

**7. The export format.** Ranked last on purpose.
`OpenContractsExportDataJsonPythonTypeV3` has 15 top-level keys covering label
sets, relationships, corpus folders, document version trees, ingestion sources,
metadata schemas, conversations, message votes and action trails. It is a
corpus-interchange format for a document management platform. I have two
documents and a list of spans.

**Not on the list: the highlight renderer.** `SelectionBoundary.tsx` is 201
lines that render an absolutely-positioned `<span>` with a background colour. It
imports styled-components, jotai atoms, `useAnnotationRefs`, a colour-utils
module and two keyframe animations. The idea underneath is about fifteen lines
of CSS. The wider annotator directory is 89 files and 24,396 lines wired to
Apollo. Take the idea, write the span.

---

## 4. What to avoid

**The monolith.** 14 compose services (postgres, redis, django, celeryworker,
celerybeat, flower, frontend, docling-parser, docxodus-parser, warp-ingest,
gotenberg, vector-embedder, multimodal-embedder, privacy_filter). 109 migrations
in one app. A 6,737-line GraphQL schema. None of it is rotting; it is simply a
different product.

**The production parsers.** Both are HTTP clients to containers maintained
elsewhere. "Adopt the pipeline" means "run two more images."

**plasmapdf, for three reasons I verified by running it.**

*(i) It destroys line structure.* `build_translation_layer` joins every token
with a single space. `doc_text` contains no newlines at all; the version with
line breaks is a separate, unindexed string (`human_friendly_full_text`) that no
coordinate maps into. A policy heading followed by a subsection becomes one
run-on line. My citation patterns in `core.mjs` are written against text that has
structure. Regexing a space-joined bag of words is a different problem.

*(ii) A verified off-by-one on the first token of every document.* At
`PdfDataLayer.py`, tokens are recorded as
`[page_num, token_id, start_length + 1, end_length]`. The `+ 1` accounts for the
separator space, which is correct for every token except the first, where no
space was prepended. I ran it against `frontend/test-assets/test.pawls` and
checked all 10,263 tokens:

```
tokens checked: 10263   mismatched slices: 1
MISMATCH page,tok,cs,ce,expected,got = (0, 0, 1, 7, "'Exhibit'", "'xhibit'")
```

One character, on the first token of page one, which is where letterheads and
claim numbers live.

*(iii) A shipped `# TODO - this is not working`.* It sits on the line that
computes an annotation's page number in
`create_opencontract_annotation_from_span`, in the published 0.1.3. In fairness
to the author, I tested it and it behaved correctly on both a single-page span
and a span crossing a page boundary, so the comment looks stale. I still would
not build a citation product on a line its author flagged as broken without
knowing which case they meant.

Two smaller things: there is a bare `print()` in library code, and
`build_translation_layer` mutates the caller's token dicts in place
(`token["text"] = token_text`).

**Token-boundary widening.** Not a bug, but a behaviour to decide about. I asked
for characters 6000–6059 and got back:

```
rawText: 'meaning ascribed to the term in Section 7.4 of this Agreement.'
```

62 characters for a 59-character request. Any partial-token span is widened
outward to whole tokens. For a highlight rectangle that's correct and arguably
better. For a Finding that asserts "the letter quotes the policy as saying X",
the quote shown to the user is now not the quote that was matched. Pick one and
write it down. My preference: store the matched span in `charStart`/`charEnd`
and the widened token text in a separate field, and show the user the widened
one while the engine reasons over the matched one.

**Compact PAWLS v2.** Range-encoded token indices as strings (`"35-37,40"`),
coordinates rounded to one decimal, page index implied by array position. It
saves real money across a corpus of 100,000 documents. I have two documents per
case. Skip it; keep v1's readable shape, which stays diffable and greppable.

---

## 5. PAWLS, concretely

### What one token record looks like

Straight out of `frontend/test-assets/test.pawls`:

```json
{"x": 504.2921960072595, "y": 52.19752030782386,
 "width": 24.836660617059888, "height": 5.399743480119709,
 "text": "Exhibit"}
```

A page:

```json
{ "page": { "width": 595, "height": 842, "index": 0 },
  "tokens": [ …one record per word… ] }
```

A `.pawls` file is a JSON array of those, one entry per page. That's the whole
format.

Facts worth pinning down, because each is guessable wrong:

- **Units are PDF points** (1/72 inch), matching pdfplumber's native output.
- **Origin is top-left, y increases downward.** I confirmed this from a bound
  returned by the library: `top: 140.38, bottom: 148.69`. Top is the smaller
  number. This is the opposite of raw PDF user space, which is bottom-left.
- **A token is a word**, as defined by pdfplumber's `extract_words` with
  `x_tolerance=2`. Not a character, not a line, not a styled span.
- **Reading order is array order**, which is whatever `use_text_flow=True`
  produced. Two-column layouts are the failure case.
- OpenContracts extends the record with optional image-token fields
  (`is_image`, `image_path`, `content_hash`, `format`, `original_width`…),
  declared at `types/dicts.py:71`. Strict PAWLS has five keys.

Size: `doc_1_pawls_parse_file.pawls` is 9 pages, 4,859 tokens, 549 KB. About
113 bytes per token, roughly 60 KB per page of dense text. A 60-page policy
lands around 3–4 MB of sidecar JSON. Fine on disk. Not something to ship
uncompressed to a browser on every page load.

### Should I adopt PAWLS as my on-disk format?

**Adopt the token record. Don't adopt the file.**

For the record: it is the right primitive, and it is already the common currency
between OpenContracts, plasmapdf, Warp-Ingest and Docling converters. Matching
it costs nothing and keeps the option of pointing another tool at my output.

Against the file, for a single-purpose tool: PAWLS has no place for the two
things Countercite needs most. There is no character offset per token, and no
page-level text string. Both have to be reconstructed in memory on every load.
That reconstruction is exactly what `build_translation_layer` is for, and it is
exactly where the off-by-one lives. Storing a derived value that is cheap to
compute is usually right; storing it *nowhere* when a wrong recomputation
silently misplaces a citation is not.

So: superset it. Keep `{x, y, width, height, text}` byte-identical, add `start`
and `end` computed once at parse time and written to disk. Any PAWLS reader
ignores unknown keys, and my file round-trips to strict PAWLS by deleting two of
them. Also store the page index 0-based to match the code rather than
OpenContracts' backend fixtures, and carry an explicit 1-based `page_number`
alongside it for display.

---

## 6. Alternatives

### PyMuPDF (`fitz`)

Start with the licence, because it settles it. **PyMuPDF is AGPL-3.0**, with a
commercial licence sold separately by Artifex. AGPL §13 is the network clause: it
is written for precisely the case of a hosted service whose users never receive a
binary. A closed-source commercial SaaS built on PyMuPDF either pays Artifex or
opens its source. Pricing is not public and I did not request a quote
`[unverified]`.

Corroborating signal: OpenContracts is MIT, could have used PyMuPDF freely, and
has zero references to it in 475,831 lines.

One cross-reference, because `04-FREE-AND-OPEN-STACK.md` touches this and I do
not want the two documents read as disagreeing. That doc argues at line 387 that
a server-side SaaS is safe under Piper's **GPL-3.0**, which is right: plain GPL
has no network clause, and not distributing a binary means not triggering it.
AGPL is the version that added §13 specifically to close that gap. PyMuPDF is the
AGPL case, Piper is the GPL case, and the reasoning that saves one does not save
the other.

On the technical claim in the brief. `get_text("dict")` returns
blocks → lines → spans, where a span is a run of same-styled text with a bbox.
Spans are not words. A whole clause set in one font is one span with one
rectangle, so "per-span bboxes for free" is true and doesn't get you to
phrase-level highlighting. For that you need `get_text("words")` (per-word
boxes, still no character offsets) or a RAWDICT extraction for per-character
boxes. Either way you still write the span-to-character-offset bookkeeping
yourself. That bookkeeping *is* the 300 lines, and it is the same 300 lines
under pdfplumber.

What OpenContracts gives that the 300 lines wouldn't: the STRtree bbox→token
index, the geometry-then-fuzzy re-anchoring pattern, the pdf.js viewport
normalisation fix, and a format other tools already read. Honestly counted:
maybe 400 lines of code and two bugs I would otherwise ship.

**Use pdfplumber instead.** MIT, pure Python on top of pdfminer.six (MIT),
`extract_words` produces the token record directly, and it is what OpenContracts
actually runs. It is meaningfully slower than PyMuPDF. A denial letter is three
pages and a policy is sixty; throughput is not the constraint on this product.

### Frontend options

**pdf.js text layer** (Apache-2.0, Mozilla). What OpenContracts uses
(`pdfjs-dist ^4.7.0`) and what react-pdf-highlighter is built on. Two ways to
draw a highlight: absolutely-positioned divs over the rendered canvas, computed
from my own PDF-point boxes scaled by the viewport; or wrapping ranges inside
pdf.js's own text layer. OpenContracts does the former and so should I. It keeps
the highlight geometry derived from *my* token boxes, which are the same boxes
the Finding cites. Going through pdf.js's text layer means reconciling two
different tokenisations, and any mismatch becomes a highlight that doesn't cover
what the engine matched.

**pdf-lib.** Wrong tool for this job. It creates and edits PDF files; it does
not render, and it does not extract text with coordinates. It becomes relevant
later, if you want to burn highlights into a downloadable annotated PDF for a
regulator or an attorney. Worth remembering for that, not for the viewer.

**react-pdf-highlighter.** MIT (`agentcooper/react-pdf-highlighter`). Latest
published version is `8.0.0-rc.0`, and an `-rc.0` that has stayed the newest
publish for roughly two years is a signal. Dependencies: `pdfjs-dist` pinned
exactly at `4.4.168`, `react-rnd`, `ts-debounce`; peer React >=18. Its model is
built around a user drawing highlights with a mouse, then persisting scaled
rects with a text-content fallback. My highlights arrive from a server with
exact coordinates already. I would be fighting its selection layer to use a fifth
of it. Read its `Highlight` and `AreaHighlight` components for ideas; don't take
the dependency. (Version and dependency list are from the published
`package.json`; I did not check the repo's last commit date `[unverified]`.)

**Adobe PDF Embed.** Free, commercial use is permitted, requires a Client ID
from Adobe's developer console tied to your domain. Two problems. It is
proprietary, so I cannot fix a rendering bug on a Tuesday. And the viewer script
loads from Adobe's infrastructure, which means a stranger's insurance policy is
being rendered by a third party's code in my user's browser. Whether document
bytes reach Adobe's servers I could not confirm `[unverified]`; the check is
reading the current Document Cloud terms and watching the network tab on a real
load. For a product whose entire pitch is "give us your denial letter," that is a
trust conversation I don't need to have. Skip it.

**Docling.** MIT (verified: "Copyright … The Docling Contributors"). Its
`ProvenanceItem` carries `{page_no, bbox, charspan}`, and `charspan` is the field
PAWLS is missing, so on paper it looks like a better fit than PAWLS. The catch is
granularity: provenance attaches to structural items (a heading, a paragraph, a
table), not to words. That is right for "which clause does this belong to" and
too coarse for "highlight these nine words." It also brings a layout model and a
table model, which is why OpenContracts runs it as its own container rather than
importing it. Revisit it when you want section structure in policies, which is a
genuinely useful later feature for resolving "Section I(A)(2)" to a region. Not
for v1 highlighting.

---

## 7. Recommendation

**(b), amended.** Borrow the PAWLS token record and roughly 250 lines of Python
from OpenContracts. Build the pipeline myself. Render with pdf.js and my own
positioned boxes.

The amendment matters, so I'll state it against the brief rather than quietly.
Option (c) was framed as "ignore it and build on PyMuPDF." I went in expecting to
pick that. The AGPL kills it for a closed-source commercial SaaS, and the giveaway
is that OpenContracts, which is MIT and had every reason to use PyMuPDF, doesn't
have a single reference to it. So the right answer is option (c)'s *shape* with
pdfplumber in place of PyMuPDF, plus a small, specific borrow from option (b).

Reasoning:

1. **Adopting wholesale is out on scale alone.** 475k lines of Python, 14
   services, a 6,737-line GraphQL schema, and two parser containers in other
   repos, to get a citation layer for two documents at a time.
2. **The pieces I want are small, isolated, and MIT.** One function, one
   133-line module, one format, one TypeScript helper. All four are pure
   functions over plain data.
3. **The format is worth matching even though the file isn't worth copying.**
   Free interoperability, and the missing field (character offsets) is a
   two-key superset away.
4. **The library that would have saved me the most work is the one I trust
   least.** plasmapdf does exactly the span-to-coordinate job I need, and it has
   a verified off-by-one on the first token of every document, no line structure
   in the text it indexes, and a "this is not working" TODO on the page-number
   line. I'd rather write 150 lines I can test than import 400 I can't.

### First implementation step

One file: `innovation/services/pdftokens/extract.py`. A CLI that takes a PDF path
on stdin or argv and writes the sidecar JSON to stdout, so Node can shell out to
it and I don't run a web server for a batch job. Promote it to an HTTP endpoint
only when something needs concurrency.

Its body is `extract_pawls_tokens_from_pdf`
(`opencontractserver/utils/pdf_token_extraction.py:159–340`) with the image
branch and the STRtree removed, plus the one thing OpenContracts doesn't do:
accumulate `start` and `end` character offsets as tokens are appended, and write
them to disk. Header comment carries the MIT notice and the source SHA.

Then write the acceptance test before anything else, and write it adversarially
in the house style, against the case where the code overstates:

```python
# The one assertion plasmapdf fails. If a token's recorded offsets don't slice
# its own text back out of the page string, every Locator built on them points
# somewhere slightly wrong, and "slightly wrong" is indistinguishable from
# "fabricated" to a reviewer checking our work.
for page in pages:
    for tok in page.tokens:
        assert page.text[tok.start:tok.end] == tok.text
```

Run it against one real denial letter and one real policy. Only then widen
`Locator`.

### Proposed Locator record

```json
{
  "docId": "policy-2024-HO3",
  "docHash": "sha256:1a7b9c…",

  "page": 12,
  "pageIndex": 11,
  "pageSize": { "width": 612.0, "height": 792.0 },

  "charStart": 48211,
  "charEnd": 48294,
  "quote": "We will not pay for loss caused by water damage unless the loss results from a covered peril.",
  "anchorHash": "sha256:9f2c4e…",

  "bbox": { "left": 72.0, "top": 418.6, "right": 523.5, "bottom": 442.9 },
  "units": "pdf-points-topleft",
  "tokens": [[11, 340], [11, 341], [11, 342]],

  "extractor": "pdfplumber-0.11.10/countercite-1"
}
```

Field notes, each with a reason:

- **`page` stays 1-based and required; `pageIndex` is the 0-based mirror.** Both,
  explicitly, because I found the two conventions colliding inside OpenContracts
  (`Annotation.page` defaults to 1, every JSON payload beside it is 0-based) and
  their test fixtures disagree with their own extractor. A wrong page number is
  the failure this product cannot survive, so it gets belt and braces.
- **`bbox` is left/top/right/bottom**, matching `BoundingBoxPythonType`, not
  PAWLS' x/y/width/height. Rendering wants edges; extraction produces corners
  and sizes. Convert once, at the boundary. The bbox is the union of the token
  boxes on that page.
- **One Locator per page.** A finding that spans a page break gets two Locators,
  not one Locator with a dict keyed by page. OpenContracts does the latter and it
  is why their `annotation_json` needs three shapes and a compact encoder.
  `Finding.policyLocators` is already an array; use it.
- **`units` is written down** because it will otherwise be guessed wrong exactly
  once, by me, at 2am. PDF points, origin top-left, y increasing downward.
- **`tokens` are `[pageIndex, tokenIndex]` pairs**, the same referent as PAWLS'
  `{pageIndex, tokenIndex}`, in array form because a long quote has a lot of
  them.
- **`anchorHash` is `sha256(casefold(collapse_whitespace(quote)))`.** Not a hash
  of the coordinates. When the PDF is re-parsed under a newer pdfplumber and a
  box shifts by two points, the quote hash still matches and the Locator
  re-resolves against the new token layer. This is `annotation_anchoring.py`'s
  "dumb anchor" idea reduced to one field: coordinates are a cache, the quote is
  the truth.
- **`docHash` is sha256 of the source PDF bytes.** If it changes, every Locator
  against that document is stale. No partial recovery, no cleverness.
- **`extractor` records the parser and version**, because the day an upgrade
  shifts a bbox you want to know which Locators came from which run without
  re-deriving it from timestamps.

### Widening `Locator` in core.mjs

Keep the three existing invariants exactly as they are: `docId` required,
`page` a 1-based integer, `quote` non-empty after trim. Every new field is
optional. That way the 31 existing tests keep passing untouched and a Locator
built from plain text with no PDF behind it still constructs, which the engine
relies on.

Add exactly one new invariant:

```js
// A bbox without the page dimensions it was measured against cannot be
// rendered. Storing one implies the other; refuse the half-record here rather
// than discovering it in the viewer.
if (bbox && !pageSize) throw new Error("Locator with a bbox requires pageSize");
```

Resist adding a second. The temptation will be to validate that `charEnd >
charStart` and that the quote length roughly matches, but token-boundary
widening (§4) makes the second one false in normal operation, and a constructor
that rejects valid data is worse than one that accepts a slightly odd record.

---

## What I could not verify

- **Dependency licences beyond `plasmapdf`, PAWLS and Docling.** I read the
  package names and versions out of the repo's requirements files, and the
  licences in the §1 table are from my own knowledge of those packages. Check:
  `pip download` the base set and read each wheel's metadata, or run
  `pip-licenses` in a throwaway venv.
- **Artifex's commercial price for PyMuPDF.** Not published. Check: request a
  quote, only if someone insists on PyMuPDF.
- **Adobe PDF Embed's data handling.** Whether document bytes leave the browser.
  Check: read the current Document Cloud additional terms, then load a PDF with
  the network tab open.
- **react-pdf-highlighter's true maintenance status.** I have the published
  version and dependency list; I inferred staleness from an `-rc.0` sitting as
  latest. Check: the repo's commit graph and open-issue response times.
- **Whether OpenContracts' PAWLS-derived frontend files have diverged enough to
  no longer be derivative works.** I matched five function names and signatures,
  not bodies line by line. Check: diff `allenai/pawls/ui/src/context/PDFStore.ts`
  against OpenContracts' `frontend/src/utils/transform.tsx`. Only matters if I
  decide to copy those functions instead of writing them, and §1 recommends
  writing them.
