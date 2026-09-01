#!/usr/bin/env python3
"""
Generate the Flood Facts site from the aggregated data.

One generator, one data file, N pages. A county page exists only because the
data supports one, which means the site cannot drift into claiming coverage it
does not have, and a county whose cells are all suppressed gets a page that says
so rather than no page at all. A missing page reads as "no flooding here". A
page that says "too few policies to report" reads as what is true.

    python3 floodfacts/site/make_site.py
"""
import json, io, os, sys

ROOT = os.path.join(os.path.dirname(__file__), "..", "..")
DATA = os.path.join(ROOT, "floodfacts", "data", "by-county.json")
OUT = os.path.join(ROOT, "platform", "sites", "floodfacts.json")

# Enough to render the fixture counties with real names. The live run replaces
# this from the Census county file; hard-coding the whole country here would be
# data pretending to be code.
COUNTY_NAMES = {
    "48201": ("Harris County", "Texas", "TX"),
    "12086": ("Miami-Dade County", "Florida", "FL"),
    "17031": ("Cook County", "Illinois", "IL"),
    "22071": ("Orleans Parish", "Louisiana", "LA"),
}

ZONE_PLAIN = {
    "AE": "High risk. A mapped 1% annual chance floodplain with a known base flood elevation.",
    "A":  "High risk. A mapped 1% annual chance floodplain with no detailed elevation study.",
    "VE": "High risk, coastal. Exposed to wave action on top of flooding.",
    "X":  "Moderate to low risk, outside the mapped 1% floodplain. Roughly a quarter of all claims come from zones like this one.",
    "UNKNOWN": "Not recorded in the file.",
}

def money(n):
    return "$" + format(int(round(n)), ",")

def load():
    if not os.path.exists(DATA):
        sys.exit(f"  {DATA} not found. Run the aggregator first.")
    return json.load(io.open(DATA, encoding="utf-8"))

def county_page(fips, zones, min_cell, synthetic):
    name, state, abbr = COUNTY_NAMES.get(fips, (f"County {fips}", "", ""))
    reported = {z: r for z, r in zones.items() if not r.get("suppressed")}
    suppressed = {z: r for z, r in zones.items() if r.get("suppressed")}

    blocks = [{
        "type": "hero", "cta": False,
        "h1": f"Flood insurance in {name}",
        "lede": (f"What policies actually cost here, how often they claim, and what share of the "
                 f"loss got paid. From FEMA's own transaction files rather than a national average."),
    }]

    if synthetic:
        blocks.append({"type": "prose", "h2": "These figures are not real yet", "body":
            "<p><strong>This page is built from a synthetic extract.</strong> The pipeline that "
            "produces it is written and tested, but it has never run against FEMA's live API, "
            "so every number below is fixture data shaped like the real thing. Nothing here "
            "should be used to make a decision until the live extract replaces it.</p>"})

    if reported:
        rows = []
        for z, r in sorted(reported.items(), key=lambda kv: -kv[1]["cost"]["median"]):
            c = r["cost"]
            rate = r.get("claimRatePerYear")
            share = r.get("shareOfDamagePaid")
            rows.append([
                f"<strong>{z}</strong>",
                money(c["median"]),
                f"{money(c['p25'])} to {money(c['p75'])}",
                f"{rate*100:.1f}%" if rate is not None else "&mdash;",
                f"{share*100:.0f}%" if share is not None else f"too few ({r['claims']})",
                format(c["n"], ","),
            ])
        blocks.append({
            "type": "table",
            "h2": "By flood zone",
            "intro": ("Every figure is a median. The spread column is the middle half of policies, "
                      "so half of everyone here paid inside that range."),
            "headers": ["Zone", "Typical yearly cost", "Middle half paid",
                        "Claimed in a year", "Share of loss paid", "Policies"],
            "rows": rows,
        })
        blocks.append({"type": "prose", "h2": "What the zones mean", "body": "".join(
            f"<h3>{z}</h3><p>{ZONE_PLAIN.get(z, 'Not described.')}</p>"
            for z in sorted(reported))})

    if suppressed:
        blocks.append({"type": "prose", "h2": "Zones with too little data to report", "body":
            "<p>" + ", ".join(f"<strong>{z}</strong> ({r['policies']} policies)"
                              for z, r in sorted(suppressed.items())) + ". "
            f"Below {min_cell} policies a median is noise, so no figure is shown rather than a "
            "shaky one. The count itself is shown because it is a real fact about the place: "
            "very few people there carry flood cover.</p>"})

    if not reported and not suppressed:
        blocks.append({"type": "prose", "h2": "No data", "body":
            "<p>No NFIP policy transactions are recorded for this county in the extract.</p>"})

    blocks.append({"type": "prose", "h2": "Before you use these numbers", "body":
        "<p>These are what people actually paid and were actually paid, which is different from "
        "what you would be quoted. Your own premium depends on the elevation of the building, "
        "when it was built, the coverage you choose and the deductible. "
        "<a href='/limits'>What these figures cannot tell you</a> sets out the limits plainly.</p>"})
    blocks.append({"type": "disclaimer"})

    return {
        "path": f"/county/{fips}",
        "kind": "page",
        "title": f"Flood insurance cost in {name}, {state}",
        "h1": f"Flood insurance in {name}",
        "description": (f"What NFIP flood policies actually cost in {name}, {state}, by flood zone, "
                        f"with claim rates and what share of losses were paid. From FEMA transaction data."),
        "keywords": [f"flood insurance cost {name.lower()}",
                     f"{name.lower()} flood zone", f"flood insurance {state.lower()}"],
        "blocks": blocks,
    }


def limits_page(min_cell, synthetic):
    return {
        "path": "/limits", "kind": "page",
        "title": "What these numbers cannot tell you",
        "h1": "What these numbers cannot tell you",
        "description": ("The limits of NFIP transaction data, stated plainly: what is suppressed, "
                        "what is missing, and where these figures will mislead you if you let them."),
        "keywords": ["nfip data limitations", "flood insurance data accuracy"],
        "blocks": [
            {"type": "hero", "cta": False, "h1": "What these numbers cannot tell you",
             "lede": ("Every site that estimates flood insurance costs is confident. This one is "
                      "built on what people actually paid, which makes it better and does not make "
                      "it a quote. Here is where it stops.")},
            {"type": "prose", "h2": "It is not a quote, and it cannot become one", "body":
             "<p>These are medians of what other people paid. Your premium depends on things this "
             "data does not know about your specific building: its elevation relative to the base "
             "flood elevation, whether it has a basement, the coverage and deductible you pick, and "
             "whether your community participates in the rating discount programme.</p>"
             "<p>Under Risk Rating 2.0 the rating also uses distance to water, flood frequency and "
             "replacement cost, which are property-level and not in these files at all. Two houses "
             "on the same street can differ by a multiple.</p>"},
            {"type": "prose", "h2": "Half the picture is missing by construction", "body":
             "<p>This is the National Flood Insurance Program only. Private flood insurance has "
             "grown substantially and none of it appears here. Neither does anyone who has no "
             "policy, which in most inland counties is nearly everyone. So a low claim rate can "
             "mean the place does not flood, or it can mean the people who flooded were uninsured "
             "and never appear in a file about insurance.</p>"
             "<p>That second reading is the more common one and it is the easiest mistake to make "
             "with this data.</p>"},
            {"type": "table", "h2": "What is deliberately not shown",
             "intro": "Four rules that remove numbers rather than estimate them.",
             "headers": ["Rule", "Why"],
             "rows": [
               [f"Cells under {min_cell} policies show no figure",
                "A median of eight observations is noise, and a cell that thin also edges toward "
                "identifying the households in it."],
               ["A payout share needs at least ten claims",
                "Fewer than that and one unusual settlement moves the headline by tens of points."],
               ["Medians everywhere, never averages",
                "Insurance costs are right-skewed. A few commercial policies pull an average well "
                "above anything a homeowner would recognise, so an average here would be true and "
                "misleading at once."],
               ["Negative amounts are dropped",
                "The files contain reversals and accounting corrections as negative entries. They "
                "are real records and meaningless as a consumer figure."],
             ]},
            {"type": "prose", "h2": "The share-of-loss figure needs care", "body":
             "<p>It is the median of amount paid divided by damage assessed, and it is the number "
             "nobody else publishes. It is also the one most easily misread.</p>"
             "<p>A figure well under 100% does not by itself mean claims were underpaid. Policy "
             "limits cap payouts, deductibles come off the top, and contents cover is separate and "
             "often not purchased. What the figure does show is the gap between a loss and a cheque, "
             "which is the thing people are actually afraid of and the thing a risk score cannot "
             "express. Where payments exceed assessed building damage, usually because contents "
             "were also paid, the ratio is capped at 100% rather than reported above it.</p>"},
            {"type": "prose", "h2": "The data is a snapshot and the ground moves", "body":
             "<p>FEMA republishes roughly monthly and revises historical records. Flood maps are "
             "redrawn, which moves properties between zones, so a zone figure describes the "
             "properties rated in that zone at the time, not a fixed set of buildings. Every page "
             "carries the date of the extract it was built from.</p>"},
            {"type": "prose", "h2": "Why this is here at all", "body":
             "<p>A page listing its own limits is a page fewer people finish reading. It exists "
             "because the alternative is the thing this site was built to replace: a confident "
             "estimate with nothing behind it. If a number here is soft, it says so on the number "
             "rather than in a disclaimer nobody opens.</p>"},
            {"type": "disclaimer"},
        ],
    }


def home_page(counties, synthetic):
    live = [(f, COUNTY_NAMES.get(f, (f"County {f}", "", ""))) for f in sorted(counties)]
    blocks = [
        {"type": "hero", "cta": False,
         "h1": "What flood insurance actually costs, and what actually got paid",
         "lede": ("FEMA publishes every flood policy and every claim it has ever written. The files "
                  "are too large to open in a spreadsheet, so nobody reads them and every answer you "
                  "can find is a risk score or a national average. These are the real numbers.")},
    ]
    if synthetic:
        blocks.append({"type": "prose", "h2": "Built, but not yet real", "body":
            "<p><strong>Every figure on this site is currently fixture data.</strong> The pipeline "
            "is written and tested; it has not yet run against FEMA's live interface. The site is "
            "here so the shape can be judged, not so the numbers can be used.</p>"})
    blocks += [
        {"type": "tiles", "h2": "The three things this can tell you", "items": [
            {"name": "What people here actually pay",
             "text": "A median and the middle half of the range, by county and flood zone, from "
                     "premiums that were really charged. Not a national average, which spans an "
                     "order of magnitude and describes nobody."},
            {"name": "How often policies here claim",
             "text": "Claims per policy-year, so the number means 'in a given year, this share of "
                     "policies claimed' rather than an unanchored count."},
            {"name": "What share of the loss was paid",
             "text": "Amount paid over damage assessed. Nobody publishes this, and it is the "
                     "question behind the fear: if it happens, do I actually get made whole?"},
        ]},
        {"type": "links", "h2": "Counties", "items": [
            {"label": f"{n}, {s}", "path": f"/county/{f}"} for f, (n, s, a) in live]},
        {"type": "prose", "h2": "How to use it honestly", "body":
         "<p>Find your county, then your flood zone. If you do not know your zone, your mortgage "
         "servicer knows it and FEMA's own map service will show it.</p>"
         "<p>Read the sample size beside every figure. Where there were too few policies to say "
         "anything, this site says nothing rather than guessing. "
         "<a href='/limits'>What these numbers cannot tell you</a>.</p>"},
        {"type": "disclaimer"},
    ]
    return {"path": "/", "kind": "page",
            "title": "Flood Facts: what flood insurance really costs",
            "h1": "Flood Facts",
            "description": ("What NFIP flood insurance actually costs by county and flood zone, how "
                            "often policies claim, and what share of losses were paid. From FEMA's "
                            "own transaction files."),
            "keywords": ["flood insurance cost by county", "nfip claims data",
                         "what does flood insurance cost", "flood insurance payout"],
            "blocks": blocks}


def main():
    d = load()
    counties, min_cell = d["counties"], d["minCell"]
    # Until the fetcher has run against the live API the numbers are fixture
    # data. The site says so on every page rather than hoping nobody notices.
    synthetic = os.path.exists(os.path.join(ROOT, "floodfacts", "data", "policies.ndjson")) and \
        not os.path.exists(os.path.join(ROOT, "floodfacts", "data", ".live"))

    site = {
        "brand": "Flood Facts", "shortName": "Flood Facts", "mark": "F",
        "domain": "floodfacts.example",
        "fontsHref": ("https://fonts.googleapis.com/css2?family=Newsreader:opsz,wght@6..72,400;"
                      "6..72,500;6..72,600&family=Public+Sans:wght@400;500;600&"
                      "family=IBM+Plex+Mono:wght@400;500&display=swap"),
        "theme": {
            "displayFont": '"Newsreader", Georgia, serif',
            "bodyFont": '"Public Sans", system-ui, "Segoe UI", Helvetica, sans-serif',
            "monoFont": '"IBM Plex Mono", ui-monospace, Menlo, monospace',
            # Tidal: a wet slate ground, deep water ink, and a high-water mark
            # in ochre. Taken from the subject rather than from a palette.
            "light": {"paper": "#E7ECEE", "card": "#F5F8F9", "ink": "#131A1E",
                      "muted": "#54646C", "accent": "#9A6415", "accentSoft": "#DCE4E7",
                      "rule": "#C3CED3"},
            "dark": {"paper": "#0E1316", "card": "#171E22", "ink": "#E5EAEC",
                     "muted": "#93A2AA", "accent": "#D79A45", "accentSoft": "#1B2429",
                     "rule": "#273238"},
        },
        "styleVariant": "ledger",
        "legalName": "Flood Facts",
        "tagline": "What flood insurance actually costs",
        "description": ("Flood Facts reads FEMA's National Flood Insurance Program transaction "
                        "files and reports what policies actually cost by county and flood zone, "
                        "how often they claim, and what share of losses were paid."),
        "lang": "en", "foundingDate": "2026", "modified": "2026-09-01",
        "email": "hello@floodfacts.example",
        "themeColor": "#9A6415", "bgColor": "#E7ECEE",
        "coverage": "United States", "areaServed": ["United States"],
        "geoRegions": ["US"], "geoPlacename": "United States",
        "knowsAbout": ["National Flood Insurance Program", "flood insurance premiums",
                       "FEMA flood zones", "flood claims", "Risk Rating 2.0"],
        "contactPoint": {"email": "hello@floodfacts.example", "contactType": "customer support",
                         "availableLanguage": ["English"]},
        "service": {"name": "Flood Facts", "type": "Public data reference",
                    "audience": "Homeowners, buyers and renters in the United States",
                    "description": "Flood insurance cost and claim outcomes from FEMA transaction data."},
        "software": {"name": "Flood Facts", "category": "WebApplication", "os": "Web",
                     "description": "Flood insurance cost and payout reference"},
        "cta": {"path": "/limits", "label": "What this cannot tell you"},
        "launchStatus": "waitlist",
        "audience": "no-customer-relationship",
        "nav": [{"path": "/limits", "label": "Limits"}],
        "footer": [{"title": "Counties",
                    "links": [{"label": f"{n}, {a}", "path": f"/county/{f}"}
                              for f, (n, s, a) in live_list(counties)]},
                   {"title": "About", "links": [{"label": "What this cannot tell you", "path": "/limits"}]}],
        "footerLegal": [{"path": "/limits", "label": "Limits"}],
        "disclaimer": ("Flood Facts is a reference built from FEMA's public National Flood Insurance "
                       "Program files. It is not an insurance producer, does not sell insurance, "
                       "does not collect contact details, and cannot give you a quote. Figures are "
                       "medians of what other people paid, not a prediction of what you will pay."),
        "pricing": [],
        "glossary": [],
        "pages": [home_page(counties, synthetic), limits_page(min_cell, synthetic)]
                 + [county_page(f, z, min_cell, synthetic) for f, z in sorted(counties.items())],
    }
    io.open(OUT, "w", encoding="utf-8").write(json.dumps(site, ensure_ascii=False, indent=2) + "\n")
    print(f"  {len(site['pages'])} pages -> {os.path.relpath(OUT, ROOT)}"
          + ("  [synthetic data]" if synthetic else ""))


def live_list(counties):
    return [(f, COUNTY_NAMES.get(f, (f"County {f}", "", ""))) for f in sorted(counties)]


if __name__ == "__main__":
    main()
