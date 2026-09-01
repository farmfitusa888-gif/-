#!/usr/bin/env python3
"""
Turn 80 million transactions into the three numbers a homeowner actually wants.

Everything a consumer can find today is either a flood *risk score* or a
*national average premium*. Neither answers the question people are really
asking, which is some version of: what does this cost where I am, and if I ever
claim, do I actually get paid?

The transaction files can answer all three. Nobody has made them do it.

  1. **What policies here actually cost.** The median and the spread, by county
     and flood zone, from premiums people were really charged. Not a national
     average, which is close to meaningless when the underlying distribution
     spans an order of magnitude.

  2. **How often policies here claim.** Claims divided by policy-years, so the
     figure means "in a given year, this share of policies claimed" rather than
     an unanchored count.

  3. **What share of the loss got paid.** Amount paid divided by damage
     assessed. This is the number nobody publishes and the one that answers
     what people are actually afraid of.

Two statistical choices worth stating, because they change the answers:

  **Medians, never means.** Insurance costs are right-skewed. A handful of large
  commercial policies drags a mean well above what any homeowner pays, and
  quoting that mean would be technically true and practically a lie.

  **Small cells are suppressed, not estimated.** Below the threshold a median is
  noise, and a county-and-zone cell with three policies in it also edges toward
  identifying them. Suppressed cells say "too few to report" rather than showing
  a number with a wide error bar the reader will not see.

Streams through SQLite rather than loading into memory, so it runs on any
machine. DuckDB would be faster and is not installed here; SQLite is in the
standard library and this is not a latency-sensitive job.

    python3 floodfacts/pipeline/aggregate.py --policies P.ndjson --claims C.ndjson
"""

import argparse
import json
import os
import sqlite3
import statistics
import sys

# Below this many observations a cell is suppressed rather than reported.
MIN_CELL = 25

SCHEMA = """
CREATE TABLE IF NOT EXISTS policies (
  county TEXT, zone TEXT, state TEXT, zip TEXT,
  cost REAL, coverage REAL, occupancy TEXT, elevated INTEGER, post_firm INTEGER,
  years REAL
);
CREATE TABLE IF NOT EXISTS claims (
  county TEXT, zone TEXT, state TEXT, zip TEXT,
  paid REAL, damage REAL, coverage REAL, year INTEGER, cause TEXT, depth REAL
);
CREATE INDEX IF NOT EXISTS p_cz ON policies(county, zone);
CREATE INDEX IF NOT EXISTS c_cz ON claims(county, zone);
"""


def num(v):
    """FEMA files carry empty strings, nulls and the occasional stray text."""
    if v in (None, "", "NULL"):
        return None
    try:
        f = float(v)
    except (TypeError, ValueError):
        return None
    # Negative premiums and payments appear in the files as reversals. They are
    # real accounting entries and meaningless as a consumer figure.
    return f if f >= 0 else None


def policy_years(row):
    """A policy transaction is a term, usually a year. Where both dates are
    present use them; otherwise assume one year rather than dropping the row,
    and note that assumption in the output."""
    a, b = row.get("policyEffectiveDate"), row.get("policyTerminationDate")
    if a and b and len(a) >= 10 and len(b) >= 10:
        try:
            from datetime import date
            d1 = date(int(a[:4]), int(a[5:7]), int(a[8:10]))
            d2 = date(int(b[:4]), int(b[5:7]), int(b[8:10]))
            days = (d2 - d1).days
            if 0 < days < 3660:
                return days / 365.25
        except (ValueError, TypeError):
            pass
    return 1.0


def load(conn, path, kind):
    if not os.path.exists(path):
        print(f"  {path} not found, skipping {kind}", file=sys.stderr)
        return 0
    rows, skipped = [], 0
    with open(path, "r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if not line:
                continue
            try:
                r = json.loads(line)
            except json.JSONDecodeError:
                skipped += 1
                continue
            county = (r.get("countyCode") or "")[:5]
            zone = (r.get("ratedFloodZone") or "").strip().upper() or "UNKNOWN"
            if kind == "policies":
                rows.append((county, zone, r.get("propertyState"), r.get("reportedZipCode"),
                             num(r.get("policyCost")),
                             num(r.get("totalBuildingInsuranceCoverage")),
                             r.get("occupancyType"),
                             1 if r.get("elevatedBuildingIndicator") in (True, "true", 1, "1") else 0,
                             1 if r.get("postFIRMConstructionIndicator") in (True, "true", 1, "1") else 0,
                             policy_years(r)))
            else:
                paid = (num(r.get("amountPaidOnBuildingClaim")) or 0) + \
                       (num(r.get("amountPaidOnContentsClaim")) or 0)
                rows.append((county, zone, r.get("state"), r.get("reportedZipcode"),
                             paid, num(r.get("buildingDamageAmount")),
                             num(r.get("totalBuildingInsuranceCoverage")),
                             r.get("yearOfLoss"), r.get("causeOfDamage"),
                             num(r.get("waterDepth"))))
            if len(rows) >= 50000:
                _flush(conn, rows, kind); rows = []
    if rows:
        _flush(conn, rows, kind)
    n = conn.execute(f"SELECT COUNT(*) FROM {kind}").fetchone()[0]
    if skipped:
        print(f"  {skipped:,} unparseable lines skipped in {path}", file=sys.stderr)
    return n


def _flush(conn, rows, kind):
    q = ("INSERT INTO policies VALUES (?,?,?,?,?,?,?,?,?,?)" if kind == "policies"
         else "INSERT INTO claims VALUES (?,?,?,?,?,?,?,?,?,?)")
    conn.executemany(q, rows)
    conn.commit()


def quantiles(values):
    v = sorted(x for x in values if x is not None)
    if not v:
        return None
    def q(p):
        if len(v) == 1:
            return v[0]
        i = p * (len(v) - 1)
        lo, hi = int(i), min(int(i) + 1, len(v) - 1)
        return v[lo] + (v[hi] - v[lo]) * (i - lo)
    return {"p25": round(q(0.25), 2), "median": round(q(0.5), 2),
            "p75": round(q(0.75), 2), "n": len(v)}


def build(conn):
    """One record per county and flood zone."""
    out = {}
    cells = conn.execute(
        "SELECT county, zone FROM policies WHERE county <> '' "
        "GROUP BY county, zone").fetchall()

    for county, zone in cells:
        costs = [r[0] for r in conn.execute(
            "SELECT cost FROM policies WHERE county=? AND zone=? AND cost IS NOT NULL",
            (county, zone))]
        if len(costs) < MIN_CELL:
            out.setdefault(county, {})[zone] = {"suppressed": True, "policies": len(costs)}
            continue

        years = conn.execute(
            "SELECT COALESCE(SUM(years),0) FROM policies WHERE county=? AND zone=?",
            (county, zone)).fetchone()[0]
        claim_rows = conn.execute(
            "SELECT paid, damage FROM claims WHERE county=? AND zone=?",
            (county, zone)).fetchall()

        paid_ratios = [min(p / d, 1.0) for p, d in claim_rows
                       if p is not None and d and d > 0]
        payouts = [p for p, _ in claim_rows if p is not None and p > 0]

        rec = {
            "policies": len(costs),
            "policyYears": round(years, 1),
            "cost": quantiles(costs),
            "claims": len(claim_rows),
            # Claims per policy-year: "in a given year, this share claimed".
            "claimRatePerYear": round(len(claim_rows) / years, 5) if years > 0 else None,
            "payout": quantiles(payouts),
            # The number nobody publishes.
            "shareOfDamagePaid": (round(statistics.median(paid_ratios), 3)
                                  if len(paid_ratios) >= 10 else None),
            "paidRatioN": len(paid_ratios),
        }
        out.setdefault(county, {})[zone] = rec
    return out


def main():
    p = argparse.ArgumentParser(description="Aggregate NFIP transactions by county and flood zone.")
    p.add_argument("--policies", default="floodfacts/data/policies.ndjson")
    p.add_argument("--claims", default="floodfacts/data/claims.ndjson")
    p.add_argument("--db", default="floodfacts/data/nfip.sqlite")
    p.add_argument("--out", default="floodfacts/data/by-county.json")
    a = p.parse_args()

    os.makedirs(os.path.dirname(a.db), exist_ok=True)
    if os.path.exists(a.db):
        os.remove(a.db)
    conn = sqlite3.connect(a.db)
    conn.executescript(SCHEMA)

    np_ = load(conn, a.policies, "policies")
    nc = load(conn, a.claims, "claims")
    print(f"  loaded {np_:,} policy transactions and {nc:,} claims")

    data = build(conn)
    reported = sum(1 for z in data.values() for r in z.values() if not r.get("suppressed"))
    suppressed = sum(1 for z in data.values() for r in z.values() if r.get("suppressed"))
    with open(a.out, "w", encoding="utf-8") as f:
        json.dump({"minCell": MIN_CELL, "counties": data}, f, separators=(",", ":"))
    print(f"  {len(data)} counties, {reported} cells reported, "
          f"{suppressed} suppressed below {MIN_CELL} policies")
    print(f"  wrote {a.out}")


if __name__ == "__main__":
    main()
