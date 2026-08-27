#!/usr/bin/env python3
"""Build one print-ready PDF from the eight briefs.

Reads the markdown, converts it, wraps it in print CSS, and renders with
headless Chromium. No network, no external assets.
"""
import html
import pathlib
import re
import subprocess
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT = ROOT / "build"
CHROME = "/opt/pw-browsers/chromium-1194/chrome-linux/chrome"

# Order matters: cover, method, then the eight briefs.
DOCS = [
    ("ideas/00-OVERVIEW.md", "The eight at a glance"),
    ("ideas/00-METHOD.md", "The test every idea had to pass"),
    ("ideas/01-templating.md", "1 — Templating"),
    ("ideas/02-fire-life-safety.md", "2 — Fire & life-safety inspection"),
    ("ideas/03-moving-survey.md", "3 — The binding estimate"),
    ("ideas/04-livestock.md", "4 — The honest weight"),
    ("ideas/05-range-of-motion.md", "5 — Range of motion"),
    ("ideas/06-slab-readiness.md", "6 — Floor prep"),
    ("ideas/07-ada-barrier.md", "7 — Barrier survey"),
    ("ideas/08-prewall-record.md", "8 — What's behind this wall"),
    ("SOURCES.md", "Sources"),
]

TAG_CLASS = {
    "vendor": "t-vendor",
    "review": "t-review",
    "standard": "t-standard",
    "assumption": "t-assumption",
}


def convert(md_text):
    import markdown as md
    return md.markdown(
        md_text,
        extensions=["tables", "fenced_code", "sane_lists", "attr_list"],
    )


def tag_provenance(html_text):
    """Colour-code [vendor] / [review] / [standard] / [assumption] inline."""
    def repl(m):
        word = m.group(1)
        cls = TAG_CLASS[word.lower()]
        return f'<span class="tag {cls}">{word}</span>'
    return re.sub(
        r"\[(vendor|review|standard|assumption)\]",
        repl, html_text, flags=re.IGNORECASE,
    )


def strip_md_links(html_text):
    """Internal .md links mean nothing in a PDF - keep the text, drop the href."""
    return re.sub(r'<a href="[^"]*\.md[^"]*">(.*?)</a>', r"\1", html_text,
                  flags=re.DOTALL)


CSS = """
@page { size: Letter; margin: 20mm 18mm 18mm 18mm; }

:root{
  --ink:#16191d; --muted:#5b6470; --rule:#d9dee5; --bg:#ffffff;
  --accent:#1f4e79; --accent-soft:#eef3f8;
}
*{box-sizing:border-box}
body{
  margin:0; background:var(--bg); color:var(--ink);
  font-family:"Iowan Old Style","Palatino Linotype",Palatino,Georgia,serif;
  font-size:10.4pt; line-height:1.52;
  -webkit-font-smoothing:antialiased;
}
h1,h2,h3,h4,.ui{
  font-family:"Helvetica Neue",Helvetica,Arial,sans-serif;
  font-weight:700; letter-spacing:-.012em;
}

/* ---------- cover ---------- */
.cover{page-break-after:always; border-top:6px solid var(--accent);
  padding-top:38mm;}
.cover .kicker{font-family:"Helvetica Neue",Helvetica,Arial,sans-serif;
  font-size:8.5pt; font-weight:700; letter-spacing:.16em; text-transform:uppercase;
  color:var(--accent); margin-bottom:9mm;}
.cover h1{font-size:33pt; line-height:1.06; margin:0 0 7mm; max-width:150mm;}
.cover .sub{font-size:12.5pt; color:var(--muted); max-width:132mm; line-height:1.5;}
.cover .meta{margin-top:52mm; padding-top:6mm; border-top:1px solid var(--rule);
  font-family:"Helvetica Neue",Helvetica,Arial,sans-serif; font-size:8.8pt;
  color:var(--muted); display:flex; justify-content:space-between; gap:10mm;}

/* ---------- contents ---------- */
.toc{page-break-after:always;}
.toc h2{font-size:14pt; margin:0 0 4mm; padding-bottom:2.5mm;
  border-bottom:2px solid var(--ink);}
.toc ol{list-style:none; padding:0; margin:0;}
.toc li{display:flex; align-items:baseline; gap:3mm; padding:1.7mm 0;
  border-bottom:1px solid var(--rule);
  font-family:"Helvetica Neue",Helvetica,Arial,sans-serif; font-size:9.2pt;}
.toc .n{color:var(--accent); font-weight:700; min-width:9mm;}

/* ---------- document flow ---------- */
section.doc{page-break-before:always;}
h1{font-size:19.5pt; line-height:1.16; margin:0 0 4mm;
   padding-bottom:3.5mm; border-bottom:2px solid var(--ink);}
h2{font-size:12.4pt; margin:9mm 0 3mm; color:var(--accent);
   page-break-after:avoid;}
h3{font-size:10.6pt; margin:6mm 0 2mm; page-break-after:avoid;}
p{margin:0 0 3.2mm; orphans:2; widows:2;}
strong{font-weight:700;}
hr{border:0; border-top:1px solid var(--rule); margin:7mm 0;}

ul,ol{margin:0 0 3.4mm; padding-left:6mm;}
li{margin-bottom:1.5mm;}

blockquote{margin:4mm 0; padding:3mm 5mm; background:var(--accent-soft);
  border-left:3px solid var(--accent); color:#243447; font-style:italic;}
blockquote p:last-child{margin-bottom:0;}

code{font-family:"SF Mono",Menlo,Consolas,monospace; font-size:8.6pt;
  background:#f1f3f6; padding:.4mm 1.1mm; border-radius:2px; color:#2b3a4a;}
pre{background:#f1f3f6; padding:3mm; border-radius:3px; overflow-x:auto;
  font-size:8.4pt; page-break-inside:avoid;}
pre code{background:none; padding:0;}

/* ---------- tables ---------- */
table{width:100%; border-collapse:collapse; margin:4mm 0 5mm;
  font-family:"Helvetica Neue",Helvetica,Arial,sans-serif; font-size:8.7pt;
  page-break-inside:avoid;}
th{background:var(--ink); color:#fff; text-align:left; font-weight:700;
  padding:2.2mm 2.4mm; border:1px solid var(--ink);}
td{padding:2.1mm 2.4mm; border:1px solid var(--rule); vertical-align:top;
  line-height:1.4;}
tbody tr:nth-child(even) td{background:#f7f9fb;}

/* ---------- provenance tags ---------- */
.tag{font-family:"Helvetica Neue",Helvetica,Arial,sans-serif; font-size:7.2pt;
  font-weight:700; text-transform:uppercase; letter-spacing:.05em;
  padding:.5mm 1.4mm; border-radius:2px; white-space:nowrap;
  border:1px solid currentColor;}
.t-vendor{color:#1c6b3f; background:#e8f5ee;}
.t-review{color:#8a5a00; background:#fdf3e0;}
.t-standard{color:#1f4e79; background:#e9f0f7;}
.t-assumption{color:#a32d1e; background:#fdecea;}

/* keep a heading with what follows it */
h1+p,h2+p,h3+p,h2+table,h3+table,h2+ul,h3+ul{page-break-before:avoid;}
"""

LEGEND = """
<div class="toc">
  <h2>Contents</h2>
  <ol>{items}</ol>
  <h2 style="margin-top:8mm">How to read the sourcing</h2>
  <p>Every figure in this document carries where it came from. Nothing is
  asserted without one of these four marks.</p>
  <table>
    <thead><tr><th style="width:30mm">Mark</th><th>Means</th></tr></thead>
    <tbody>
      <tr><td><span class="tag t-vendor">vendor</span></td>
          <td>Read off the company's own page.</td></tr>
      <tr><td><span class="tag t-review">review</span></td>
          <td>Reported by a third-party review or comparison site and
              <strong>not independently confirmed</strong>. Several such sites
              are run by a competitor in the category they price. Verify before
              acting.</td></tr>
      <tr><td><span class="tag t-standard">standard</span></td>
          <td>A published technical or legal standard.</td></tr>
      <tr><td><span class="tag t-assumption">assumption</span></td>
          <td>Mine, marked at every point of use.</td></tr>
    </tbody>
  </table>
  <p><strong>No figure in this document was produced on a device I own, and no
  accuracy claim in it was measured.</strong> Where an unmeasured number decides
  whether an idea works, the brief says so and says it is unmeasured. The
  closing pages list every figure deliberately not claimed.</p>
</div>
"""


def main():
    parts = []

    parts.append("""
<div class="cover">
  <div class="kicker">Product research &middot; 27 August 2026</div>
  <h1>Eight businesses built on measured truth</h1>
  <div class="sub">Eight industries where the numbers that decide money are
  quietly guessed &mdash; and a product shape that measures them, marks what it
  does not know, and carries the result all the way to a priced, signed
  document.</div>
  <div class="meta">
    <span>Sourced competitor pricing &middot; ranked failure modes &middot;
    one settling test per idea</span>
    <span>8 briefs</span>
  </div>
</div>
""")

    items = "".join(
        f'<li><span class="n">{i:02d}</span><span>{html.escape(t)}</span></li>'
        for i, (_, t) in enumerate(DOCS, start=1)
    )
    parts.append(LEGEND.format(items=items))

    for rel, _title in DOCS:
        path = ROOT / rel
        if not path.exists():
            sys.exit(f"missing source file: {rel}")
        body = convert(path.read_text(encoding="utf-8"))
        body = strip_md_links(tag_provenance(body))
        parts.append(f'<section class="doc">{body}</section>')

    doc = (
        "<!doctype html><html><head><meta charset='utf-8'>"
        "<title>Eight businesses built on measured truth</title>"
        f"<style>{CSS}</style></head><body>{''.join(parts)}</body></html>"
    )

    OUT.mkdir(exist_ok=True)
    html_path = OUT / "eight-ideas.html"
    pdf_path = OUT / "Eight-Business-Ideas.pdf"
    html_path.write_text(doc, encoding="utf-8")

    subprocess.run([
        CHROME, "--headless", "--disable-gpu", "--no-sandbox",
        "--no-pdf-header-footer",
        "--virtual-time-budget=10000",
        f"--print-to-pdf={pdf_path}",
        html_path.as_uri(),
    ], check=True, capture_output=True)

    print(f"HTML {html_path}  {html_path.stat().st_size:,} bytes")
    print(f"PDF  {pdf_path}  {pdf_path.stat().st_size:,} bytes")


if __name__ == "__main__":
    main()
