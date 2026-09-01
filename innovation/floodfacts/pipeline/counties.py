#!/usr/bin/env python3
"""
Build the FIPS-to-county-name map.

The site generator needs a name for every county code in the extract. Hardcoding
them would be data pretending to be code, and there are over three thousand, so
this fetches the Census Bureau's own reference file and writes a JSON map.

That map is the difference between six pages and a few thousand. Every county
page is a page that can rank for "flood insurance cost in <county>", which is a
query someone types with intent, and none of them exist without this.

STATUS: never run live. This environment's proxy returns no response for
www2.census.gov. The parser is exercised against a fixture in the test suite and
does work; the fetch is written from the documented file format and marked.

    python3 floodfacts/pipeline/counties.py --dry-run
    python3 floodfacts/pipeline/counties.py
"""
import argparse, io, json, os, sys, urllib.error, urllib.request

# The Census national county file. Pipe-delimited, one row per county, with a
# header. Mirrors exist; this is the canonical location.
SOURCES = [
    "https://www2.census.gov/geo/docs/reference/codes2020/national_county2020.txt",
    "https://www2.census.gov/geo/docs/reference/codes/files/national_county.txt",
]

# Louisiana has parishes, Alaska has boroughs and census areas. Stripping the
# generic suffix and reattaching "County" everywhere would rename half of two
# states, so the file's own name is kept verbatim.
STATE_NAMES = {
 "AL":"Alabama","AK":"Alaska","AZ":"Arizona","AR":"Arkansas","CA":"California","CO":"Colorado",
 "CT":"Connecticut","DE":"Delaware","DC":"District of Columbia","FL":"Florida","GA":"Georgia",
 "HI":"Hawaii","ID":"Idaho","IL":"Illinois","IN":"Indiana","IA":"Iowa","KS":"Kansas","KY":"Kentucky",
 "LA":"Louisiana","ME":"Maine","MD":"Maryland","MA":"Massachusetts","MI":"Michigan","MN":"Minnesota",
 "MS":"Mississippi","MO":"Missouri","MT":"Montana","NE":"Nebraska","NV":"Nevada","NH":"New Hampshire",
 "NJ":"New Jersey","NM":"New Mexico","NY":"New York","NC":"North Carolina","ND":"North Dakota",
 "OH":"Ohio","OK":"Oklahoma","OR":"Oregon","PA":"Pennsylvania","RI":"Rhode Island",
 "SC":"South Carolina","SD":"South Dakota","TN":"Tennessee","TX":"Texas","UT":"Utah","VT":"Vermont",
 "VA":"Virginia","WA":"Washington","WV":"West Virginia","WI":"Wisconsin","WY":"Wyoming",
 "PR":"Puerto Rico","VI":"U.S. Virgin Islands","GU":"Guam","AS":"American Samoa","MP":"Northern Mariana Islands",
}


def parse(text):
    """Parse the pipe-delimited county file into {fips: [name, state, abbr]}.

    The file has appeared with and without a header row, and the 2020 edition
    uses different column names from the older one. Both put the state
    abbreviation first, the state FIPS second, the county FIPS third and the
    name fourth, so positions are used rather than header names.
    """
    out = {}
    for line in text.splitlines():
        line = line.strip()
        if not line or line.startswith("#"):
            continue
        parts = [p.strip() for p in line.split("|")]
        if len(parts) < 4:
            continue
        abbr, statefp, countyfp, name = parts[0], parts[1], parts[2], parts[3]
        # Skip the header, whatever it is called this edition.
        if not (statefp.isdigit() and countyfp.isdigit()):
            continue
        fips = statefp.zfill(2) + countyfp.zfill(3)
        out[fips] = [name, STATE_NAMES.get(abbr, abbr), abbr]
    return out


def main():
    p = argparse.ArgumentParser(description="Build the FIPS to county name map.")
    p.add_argument("--out", default="floodfacts/data/counties.json")
    p.add_argument("--dry-run", action="store_true")
    a = p.parse_args()

    if a.dry_run:
        print("\n  would try, in order:")
        for u in SOURCES:
            print("    GET " + u)
        print(f"\n  writing {a.out}\n")
        return

    text = None
    for url in SOURCES:
        try:
            req = urllib.request.Request(url, headers={"User-Agent": "floodfacts/0.1"})
            with urllib.request.urlopen(req, timeout=60) as r:
                text = r.read().decode("latin-1")
            print(f"  fetched {url}")
            break
        except (urllib.error.HTTPError, OSError) as e:
            print(f"  {url} failed: {e}", file=sys.stderr)

    if text is None:
        print("\n  Could not reach the Census Bureau. This environment's proxy blocks it.",
              file=sys.stderr)
        print("  Run from an unblocked network; nothing else in the pipeline needs it.\n",
              file=sys.stderr)
        sys.exit(1)

    counties = parse(text)
    if len(counties) < 3000:
        print(f"  Only parsed {len(counties)} counties, expected over 3,000. "
              f"The file format has probably changed; check parse().", file=sys.stderr)
        sys.exit(2)

    os.makedirs(os.path.dirname(a.out), exist_ok=True)
    io.open(a.out, "w", encoding="utf-8").write(json.dumps(counties, ensure_ascii=False))
    print(f"  {len(counties):,} counties -> {a.out}")


if __name__ == "__main__":
    main()
