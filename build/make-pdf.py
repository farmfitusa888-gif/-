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


CSS = (pathlib.Path(__file__).resolve().parent / "shared.css").read_text()


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
