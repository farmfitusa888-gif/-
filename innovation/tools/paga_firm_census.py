#!/usr/bin/env python3
"""
Count the firms that actually file PAGA cases in California, by name.

WHY THIS EXISTS

research/12-CA-EMPLOYMENT-BAR.md puts the addressable market at roughly 400
firms, resting on a single reported figure: 396 firms filed at least one PAGA
case in the twelve months to May 2026. That number came to me through a
consulting firm's summary, restated by a trade publication. It is the best
figure available and it is still second-hand.

It does not have to stay second-hand. Every PAGA case begins with a notice filed
with the Labor and Workforce Development Agency, and those notices are public
and searchable, carrying the filing party and the employer. Counting distinct
filers over a twelve-month window turns a reported ~400 into a measured number,
and produces something the reported figure cannot: the distribution. How many
firms file once a year, how many file weekly, and where the tail actually sits.

That distribution is the product decision. The note found the market is steeply
concentrated, that the top five firms are probably not customers because at
400-plus notices a year they have already built this internally, and that the
real buyer is the tail. All three of those conclusions currently rest on an
estimate of the tail's shape rather than a measurement of it.

STATUS

The LWDA search host returns 403 through this environment's egress proxy, so
this has never been run against the live site. Everything below that touches the
network is therefore written against the site's documented shape and is marked
so. The parsing, aggregation and reporting are exercised by --self-test against
fixtures and do work.

Run:
    python3 tools/paga_firm_census.py --self-test     # no network
    python3 tools/paga_firm_census.py --dry-run       # show the requests
    python3 tools/paga_firm_census.py --from 2025-06-01 --to 2026-05-31
"""

import argparse
import collections
import html as html_mod
import csv
import json
import re
import sys
import urllib.error
import urllib.parse
import urllib.request

# The public PAGA notice search. Confirmed only as a URL, never fetched from
# here. If the shape has changed, --dry-run prints exactly what would be asked
# for, which is the fastest way to see the mismatch.
BASE = "https://cadir.secure.force.com/PagaSearch/"
UA = "backpay-research/0.1 (public records; contact hello@backpay.co)"

# Firm names arrive dirty. These normalisations are the difference between 396
# firms and 900, because "Smith & Jones LLP", "Smith and Jones, LLP" and
# "SMITH & JONES" are one filer.
SUFFIXES = r"(?:\s*,?\s*(?:a\s+)?(?:professional\s+)?(?:law\s+)?(?:corp(?:oration)?|corporation|p\.?c\.?|l\.?l\.?p\.?|l\.?l\.?c\.?|a\.?p\.?c\.?|a\.?p\.?l\.?c\.?|inc\.?|ltd\.?|group|firm)\b\.?)+$"


def normalize_firm(raw):
    """Collapse the spelling variants of one firm to a single key.

    Deliberately conservative. Over-merging invents concentration that is not
    there, and concentration is the finding this whole census is meant to test,
    so a false merge would corrupt the answer in the direction of the
    hypothesis. Where in doubt, leave two records separate.
    """
    if not raw:
        return ""
    s = raw.strip().lower()
    s = s.replace("&", " and ")
    s = re.sub(r"[.,;:'\"]", " ", s)
    s = re.sub(r"\s+", " ", s).strip()
    prev = None
    while prev != s:
        prev = s
        s = re.sub(SUFFIXES, "", s).strip()
    s = re.sub(r"^(law\s+offices?\s+of|the\s+law\s+offices?\s+of|law\s+office\s+of)\s+", "", s)
    return re.sub(r"\s+", " ", s).strip()


def parse_rows(html):
    """Pull notice rows out of a results page.

    [UNVERIFIED against the live site.] The selectors below assume a table whose
    cells are, in order: notice number, date filed, employer, filing party.
    """
    rows = []
    for tr in re.findall(r"<tr[^>]*>(.*?)</tr>", html, re.S | re.I):
        cells = [re.sub(r"<[^>]+>", " ", c) for c in
                 re.findall(r"<t[dh][^>]*>(.*?)</t[dh]>", tr, re.S | re.I)]
        # Unescape before normalising. Without this "Smith &amp; Jones" becomes
        # "smith amp jones" and never merges with "Smith and Jones", which
        # would inflate the firm count and flatten the concentration finding
        # this census exists to measure. The self-test catches it.
        cells = [re.sub(r"\s+", " ", html_mod.unescape(c)).strip() for c in cells]
        if len(cells) < 4:
            continue
        if not re.match(r"^(LWDA-)?[\d-]{4,}$", cells[0]):
            continue  # header or spacer
        rows.append({"notice": cells[0], "filed": cells[1],
                     "employer": cells[2], "firm": cells[3]})
    return rows


def summarise(rows):
    counts = collections.Counter(normalize_firm(r["firm"]) for r in rows if r["firm"])
    counts.pop("", None)
    total = sum(counts.values())
    ranked = counts.most_common()

    def share(n):
        return sum(c for _, c in ranked[:n]) / total if total else 0.0

    buckets = collections.Counter()
    for _, c in ranked:
        if c == 1: buckets["1 notice"] += 1
        elif c <= 5: buckets["2-5"] += 1
        elif c <= 20: buckets["6-20"] += 1
        elif c <= 100: buckets["21-100"] += 1
        else: buckets["100+"] += 1

    return {"notices": total, "firms": len(ranked), "ranked": ranked,
            "top5_share": share(5), "top20_share": share(20), "buckets": buckets}


def report(s, out_csv=None):
    print(f"\n  {s['notices']:,} notices filed by {s['firms']:,} distinct firms\n")
    print(f"  Top 5 firms   {s['top5_share']*100:5.1f}% of all notices")
    print(f"  Top 20 firms  {s['top20_share']*100:5.1f}%")
    print("\n  How often a firm files:")
    for label in ("1 notice", "2-5", "6-20", "21-100", "100+"):
        n = s["buckets"].get(label, 0)
        if n:
            bar = "#" * min(46, max(1, round(n / max(s["firms"], 1) * 90)))
            print(f"    {label:>9}  {n:>4} firms  {bar}")
    print("\n  The addressable tail is every firm below the top twenty. Those are")
    print("  the ones filing often enough to need this and not often enough to")
    print("  have already built it.\n")
    if out_csv:
        with open(out_csv, "w", newline="", encoding="utf-8") as f:
            w = csv.writer(f)
            w.writerow(["firm", "notices"])
            w.writerows(s["ranked"])
        print(f"  Firm list written to {out_csv}\n")


def self_test():
    checks, failed = 0, 0

    def ok(name, cond):
        nonlocal checks, failed
        checks += 1
        if cond:
            print(f"  PASS  {name}")
        else:
            failed += 1
            print(f"  FAIL  {name}")

    print("\nself-test\n")
    ok("suffix stripping", normalize_firm("Smith & Jones, LLP") == "smith and jones")
    ok("ampersand and case", normalize_firm("SMITH AND JONES llp") == "smith and jones")
    ok("stacked suffixes", normalize_firm("Doe Law Group, A Professional Corporation") == "doe")
    ok("law offices prefix", normalize_firm("Law Offices of Jane Roe") == "jane roe")
    ok("empty is empty", normalize_firm("") == "" and normalize_firm(None) == "")
    # Conservative on purpose: two genuinely different firms must not merge.
    ok("distinct firms stay distinct",
       normalize_firm("Smith & Jones LLP") != normalize_firm("Smith & Jonas LLP"))

    html = """<table><tr><th>No</th><th>Date</th><th>Employer</th><th>Filer</th></tr>
    <tr><td>LWDA-1001</td><td>2026-01-04</td><td>Acme Co</td><td>Smith &amp; Jones, LLP</td></tr>
    <tr><td>LWDA-1002</td><td>2026-01-05</td><td>Beta Inc</td><td>SMITH AND JONES llp</td></tr>
    <tr><td>LWDA-1003</td><td>2026-01-06</td><td>Gamma</td><td>Law Offices of Jane Roe</td></tr>
    <tr><td>junk</td><td>x</td></tr></table>"""
    rows = parse_rows(html)
    ok("parses three rows, skips the malformed one", len(rows) == 3)
    s = summarise(rows)
    ok("two spelling variants counted as one firm", s["firms"] == 2)
    ok("notice total preserved", s["notices"] == 3)
    ok("concentration computed", 0 < s["top5_share"] <= 1)

    print(f"\n  {checks - failed}/{checks} passed\n")
    return 1 if failed else 0


def fetch(page, args):
    params = {"page": page, "startDate": args.date_from, "endDate": args.date_to}
    url = f"{BASE}?{urllib.parse.urlencode(params)}"
    if args.dry_run:
        print(f"  GET {url}")
        return None
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=45) as r:
        return r.read().decode("utf-8", "replace")


def main():
    p = argparse.ArgumentParser(description="Census of PAGA notice filers in California.")
    p.add_argument("--self-test", action="store_true")
    p.add_argument("--dry-run", action="store_true", help="print the requests and stop")
    p.add_argument("--from", dest="date_from", default="2025-06-01")
    p.add_argument("--to", dest="date_to", default="2026-05-31")
    p.add_argument("--pages", type=int, default=400)
    p.add_argument("--out", default="research/data/paga-firms.csv")
    args = p.parse_args()

    if args.self_test:
        sys.exit(self_test())

    if args.dry_run:
        print(f"\n  window {args.date_from} to {args.date_to}, up to {args.pages} pages\n")
        for pg in (1, 2, args.pages):
            fetch(pg, args)
        print("\n  Nothing was requested. Drop --dry-run to run it for real.\n")
        return

    rows = []
    for pg in range(1, args.pages + 1):
        try:
            html = fetch(pg, args)
        except urllib.error.HTTPError as e:
            print(f"  HTTP {e.code} on page {pg}. Stopping.", file=sys.stderr)
            break
        except OSError as e:
            print(f"\n  Could not reach the LWDA search: {e}", file=sys.stderr)
            print("  This environment's proxy returns 403 for that host. Run this "
                  "from an unblocked network.\n", file=sys.stderr)
            sys.exit(1)
        got = parse_rows(html)
        if not got:
            break
        rows.extend(got)

    if not rows:
        print("\n  No rows parsed. The page shape has probably changed; the parser "
              "in parse_rows() is unverified against the live site.\n", file=sys.stderr)
        sys.exit(2)

    report(summarise(rows), args.out)


if __name__ == "__main__":
    main()
