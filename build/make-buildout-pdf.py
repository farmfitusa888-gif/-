#!/usr/bin/env python3
"""Render the five buildouts as one print-ready volume."""
import html
import pathlib
import re
import subprocess
import sys

import markdown as md

ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT = ROOT / "build"
CHROME = "/opt/pw-browsers/chromium-1194/chrome-linux/chrome"

DOCS = [
    ("buildouts/00-SHARED.md",          "Shared assumptions, and the sizing that reorders the list"),
    ("buildouts/07-barrier-survey.md",  "Idea 7 - Barrier survey"),
    ("buildouts/08-behind-the-wall.md", "Idea 8 - What's behind this wall"),
    ("buildouts/01-templating.md",      "Idea 1 - Templating"),
    ("buildouts/06-floor-prep.md",      "Idea 6 - Floor prep"),
    ("buildouts/02-fire-life-safety.md","Idea 2 - Fire & life-safety inspection"),
]

TAG_CLASS = {
    "vendor": "t-vendor", "review": "t-review",
    "standard": "t-standard", "assumption": "t-assumption",
}


def tag_provenance(text):
    return re.sub(
        r"\[(vendor|review|standard|assumption)\]",
        lambda m: f'<span class="tag {TAG_CLASS[m.group(1).lower()]}">{m.group(1)}</span>',
        text, flags=re.IGNORECASE,
    )


def strip_md_links(text):
    return re.sub(r'<a href="[^"]*\.md[^"]*">(.*?)</a>', r"\1", text, flags=re.DOTALL)


LEGEND = """
  <table>
    <thead><tr><th style="width:30mm">Mark</th><th>Means</th></tr></thead>
    <tbody>
      <tr><td><span class="tag t-vendor">vendor</span></td>
          <td>Read off the company's own page.</td></tr>
      <tr><td><span class="tag t-review">review</span></td>
          <td>Reported by a third-party review or comparison site and
              <strong>not independently confirmed</strong>. Several such sites are run by a
              competitor in the category they price.</td></tr>
      <tr><td><span class="tag t-standard">standard</span></td>
          <td>A published technical or legal standard.</td></tr>
      <tr><td><span class="tag t-assumption">assumption</span></td>
          <td>Mine, marked at every point of use.</td></tr>
    </tbody>
  </table>
"""


def main():
    css = (OUT / "shared.css").read_text()
    parts = ["""
<div class="cover">
  <div class="kicker">Business buildouts &middot; 27 August 2026</div>
  <h1>Five businesses, built out</h1>
  <div class="sub">Product spec, architecture, build plan, validation protocol,
  pricing, unit economics, go-to-market, battle card, legal posture, metrics and
  kill criteria &mdash; for each of five products.</div>
  <div class="meta">
    <span>Ideas 7, 8, 1, 6 and 2 &middot; sourced market sizing &middot; a 90-day plan each</span>
    <span>5 buildouts</span>
  </div>
</div>
"""]

    items = "".join(
        f'<li><span class="n">{i:02d}</span><span>{html.escape(t)}</span></li>'
        for i, (_, t) in enumerate(DOCS, start=1)
    )
    parts.append(f"""
<div class="toc">
  <h2>Contents</h2>
  <ol>{items}</ol>
  <h2 style="margin-top:8mm">How to read the sourcing</h2>
  <p>Every figure carries where it came from. Nothing is asserted without one of
  these four marks.</p>
  {LEGEND}
  <p><strong>Nobody has paid for any of these products.</strong> Every commercial
  figure &mdash; churn, sales rate, conversion, what a customer will pay &mdash; is an
  assumption and is marked as one. The accompanying workbook,
  <code>Five-Business-Models.xlsx</code>, is where those assumptions can be
  changed.</p>
</div>
""")

    for rel, _title in DOCS:
        path = ROOT / rel
        if not path.exists():
            sys.exit(f"missing source file: {rel}")
        body = md.markdown(
            path.read_text(encoding="utf-8"),
            extensions=["tables", "fenced_code", "sane_lists", "attr_list"],
        )
        parts.append(f'<section class="doc">{strip_md_links(tag_provenance(body))}</section>')

    doc = (
        "<!doctype html><html><head><meta charset='utf-8'>"
        "<title>Five businesses, built out</title>"
        f"<style>{css}</style></head><body>{''.join(parts)}</body></html>"
    )

    html_path = OUT / "five-buildouts.html"
    pdf_path = OUT / "Five-Business-Buildouts.pdf"
    html_path.write_text(doc, encoding="utf-8")

    subprocess.run([
        CHROME, "--headless", "--disable-gpu", "--no-sandbox",
        "--no-pdf-header-footer", "--virtual-time-budget=10000",
        f"--print-to-pdf={pdf_path}", html_path.as_uri(),
    ], check=True, capture_output=True)

    print(f"PDF {pdf_path}  {pdf_path.stat().st_size:,} bytes")


if __name__ == "__main__":
    main()
