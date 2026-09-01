#!/usr/bin/env python3
"""
Pull the NFIP policy and claim transaction files from OpenFEMA.

FEMA publishes the whole National Flood Insurance Program as two redacted bulk
files: north of 80 million policy transactions and over 2 million claims. FEMA's
own data page warns the files are too large for Excel. That warning is the
opportunity. The data is public and effectively unusable, so nothing
consumer-facing is built on it; every tool a homeowner can find shows either a
risk score or a national average premium.

This fetches it. Two things make that less trivial than it sounds:

  1. The API paginates at 1,000 records and 80 million records is 80,000
     requests. So it must be resumable, because it will be interrupted.
  2. Only a handful of fields matter for the product. Requesting the full record
     multiplies the transfer for nothing, so the field list is explicit.

STATUS: never run against the live API. This environment's proxy returns no
response for fema.gov. Everything network-facing is written from the documented
OpenFEMA v2 interface and marked so. Parsing, resume and aggregation are
exercised by the test suite against fixtures and do work.

    python3 floodfacts/pipeline/fetch.py --dry-run
    python3 floodfacts/pipeline/fetch.py --dataset claims --state TX
"""

import argparse
import json
import os
import sys
import time
import urllib.error
import urllib.parse
import urllib.request

BASE = "https://www.fema.gov/api/open/v2"

# Only what the product uses. The policy file has over 70 columns and the claims
# file over 70 as well; pulling all of them across 80 million rows would move
# tens of gigabytes to answer three questions.
DATASETS = {
    "policies": {
        "endpoint": "FimaNfipPolicies",
        "fields": [
            "id", "countyCode", "censusTract", "ratedFloodZone", "policyCost",
            "totalBuildingInsuranceCoverage", "totalContentsInsuranceCoverage",
            "occupancyType", "originalConstructionDate", "policyEffectiveDate",
            "policyTerminationDate", "propertyState", "reportedZipCode",
            "elevatedBuildingIndicator", "postFIRMConstructionIndicator",
        ],
    },
    "claims": {
        "endpoint": "FimaNfipClaims",
        "fields": [
            "id", "countyCode", "censusTract", "ratedFloodZone", "dateOfLoss",
            "amountPaidOnBuildingClaim", "amountPaidOnContentsClaim",
            "buildingDamageAmount", "netBuildingPaymentAmount",
            "totalBuildingInsuranceCoverage", "totalContentsInsuranceCoverage",
            "occupancyType", "state", "reportedZipcode", "yearOfLoss",
            "causeOfDamage", "waterDepth",
        ],
    },
}

PAGE = 1000  # OpenFEMA's maximum


def build_url(dataset, skip, state=None, page=PAGE):
    d = DATASETS[dataset]
    q = {
        "$top": page,
        "$skip": skip,
        "$select": ",".join(d["fields"]),
        # A stable sort is what makes skip-based paging safe. Without it the
        # server may return rows in a different order between requests and
        # paging silently drops and duplicates records.
        "$orderby": "id",
        "$format": "json",
    }
    if state:
        field = "propertyState" if dataset == "policies" else "state"
        q["$filter"] = f"{field} eq '{state}'"
    # quote_via=quote keeps spaces as %20 rather than +. Both are legal in a
    # query string, but OData filter expressions are safer with %20 and it
    # makes the emitted URL readable when debugging against the live service.
    return f"{BASE}/{d['endpoint']}?" + urllib.parse.urlencode(
        q, safe="$,'", quote_via=urllib.parse.quote)


def resume_point(path):
    """Count what is already on disk so an interrupted run continues.

    Counting lines rather than storing a cursor means the file itself is the
    state. There is nothing to get out of sync, and a partially written final
    line is discarded on the next run rather than corrupting the count.
    """
    if not os.path.exists(path):
        return 0
    n = 0
    with open(path, "r", encoding="utf-8") as f:
        for line in f:
            if line.endswith("\n"):
                n += 1
    return n


def parse_page(payload, dataset):
    """OpenFEMA wraps records under a key named for the entity."""
    if isinstance(payload, list):
        return payload
    key = DATASETS[dataset]["endpoint"]
    for k in (key, key[0].lower() + key[1:], "features", "results"):
        if k in payload:
            return payload[k]
    # Fall back to the first list-valued key rather than guessing a name.
    for v in payload.values():
        if isinstance(v, list):
            return v
    return []


def main():
    p = argparse.ArgumentParser(description="Fetch NFIP bulk data from OpenFEMA.")
    p.add_argument("--dataset", choices=sorted(DATASETS), default="claims")
    p.add_argument("--state", help="two-letter code, e.g. TX. Omit for all.")
    p.add_argument("--out", default=None)
    p.add_argument("--max-pages", type=int, default=0, help="0 means no limit")
    p.add_argument("--dry-run", action="store_true")
    p.add_argument("--sleep", type=float, default=0.2)
    a = p.parse_args()

    out = a.out or f"floodfacts/data/{a.dataset}{'-' + a.state if a.state else ''}.ndjson"

    if a.dry_run:
        print(f"\n  dataset {a.dataset}, {len(DATASETS[a.dataset]['fields'])} fields, "
              f"{PAGE} rows per request")
        print(f"  writing to {out}\n")
        for skip in (0, PAGE, PAGE * 2):
            print("  GET " + build_url(a.dataset, skip, a.state))
        print("\n  Nothing was requested. Drop --dry-run to fetch.\n")
        return

    os.makedirs(os.path.dirname(out), exist_ok=True)
    skip = resume_point(out)
    if skip:
        print(f"  resuming at {skip:,} records already on disk")

    pages = 0
    with open(out, "a", encoding="utf-8") as f:
        while True:
            url = build_url(a.dataset, skip, a.state)
            try:
                req = urllib.request.Request(url, headers={
                    "User-Agent": "floodfacts/0.1 (public data; hello@example.invalid)"})
                with urllib.request.urlopen(req, timeout=120) as r:
                    rows = parse_page(json.loads(r.read().decode("utf-8")), a.dataset)
            except urllib.error.HTTPError as e:
                print(f"  HTTP {e.code} at skip={skip}. Stopping.", file=sys.stderr)
                break
            except OSError as e:
                print(f"\n  Could not reach OpenFEMA: {e}", file=sys.stderr)
                print("  This environment's proxy blocks fema.gov. Run from an "
                      "unblocked network; the file on disk is resumable.\n", file=sys.stderr)
                sys.exit(1)

            if not rows:
                print(f"  done at {skip:,} records")
                break
            for row in rows:
                f.write(json.dumps(row, separators=(",", ":")) + "\n")
            f.flush()
            skip += len(rows)
            pages += 1
            if pages % 25 == 0:
                print(f"  {skip:,} records")
            if a.max_pages and pages >= a.max_pages:
                print(f"  stopped after {pages} pages at {skip:,} records")
                break
            time.sleep(a.sleep)


if __name__ == "__main__":
    main()
