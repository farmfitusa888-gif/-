#!/usr/bin/env python3
"""
Tests for the NFIP pipeline.

Written adversarially. The failure mode here is not a crash. It is a page that
confidently tells a homeowner that flood insurance costs $900 where they live,
computed from four policies, or a mean dragged upward by one commercial
building. Both would look completely normal on screen and both would be wrong
in a way the reader cannot detect.

    python3 floodfacts/tests/test_pipeline.py
"""

import json
import os
import sqlite3
import subprocess
import sys
import tempfile

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "pipeline"))
import aggregate as agg          # noqa: E402
import fetch                     # noqa: E402

passed = failed = 0


def t(name, fn):
    global passed, failed
    try:
        fn(); passed += 1; print(f"  PASS  {name}")
    except AssertionError as e:
        failed += 1; print(f"  FAIL  {name}\n        {e}")
    except Exception as e:                                     # noqa: BLE001
        failed += 1; print(f"  FAIL  {name}\n        {type(e).__name__}: {e}")


print("\nNFIP pipeline\n")

# --- the fetcher -----------------------------------------------------------

def _url_shape():
    u = fetch.build_url("claims", 2000, "TX")
    assert "$skip=2000" in u, u
    assert "$top=1000" in u, u
    # A stable sort is what makes skip-based paging safe at all.
    assert "$orderby=id" in u, "paging without a stable order silently loses rows"
    assert "propertyState" not in u, "claims filter must use `state`, not `propertyState`"
    assert "state%20eq%20'TX'" in u, u
t("query paginates, sorts stably and filters on the right field", _url_shape)

def _policy_filter_field():
    u = fetch.build_url("policies", 0, "FL")
    assert "propertyState%20eq%20'FL'" in u, u
t("the two datasets use their own state field names", _policy_filter_field)

def _resume():
    with tempfile.TemporaryDirectory() as d:
        p = os.path.join(d, "x.ndjson")
        assert fetch.resume_point(p) == 0, "a missing file resumes at zero"
        with open(p, "w") as f:
            f.write('{"a":1}\n{"a":2}\n{"a":3')   # last line truncated
        # The truncated final line must not count, or the next run skips a record
        # that was never written.
        assert fetch.resume_point(p) == 2, fetch.resume_point(p)
t("an interrupted write does not corrupt the resume point", _resume)

def _unwrap():
    assert len(fetch.parse_page({"FimaNfipClaims": [1, 2]}, "claims")) == 2
    assert len(fetch.parse_page([1, 2, 3], "claims")) == 3
    assert fetch.parse_page({"meta": {}}, "claims") == []
t("the response envelope is unwrapped, whatever shape it arrives in", _unwrap)

# --- the numbers -----------------------------------------------------------

def _skew():
    # Nine ordinary homes and one commercial building. The mean is a number no
    # homeowner would recognise; the median is the answer they want.
    vals = [800, 850, 900, 950, 1000, 1050, 1100, 1150, 1200, 90000]
    q = agg.quantiles(vals)
    assert q["median"] == 1025, q
    mean = sum(vals) / len(vals)
    assert mean > 9000 and q["median"] < 1100, "the median must resist the outlier"
t("one commercial policy cannot drag the headline figure", _skew)

def _quantile_edges():
    assert agg.quantiles([]) is None
    one = agg.quantiles([500])
    assert one["median"] == one["p25"] == one["p75"] == 500, one
t("quantiles survive empty and single-value inputs", _quantile_edges)

def _num():
    assert agg.num("") is None and agg.num(None) is None and agg.num("NULL") is None
    assert agg.num("abc") is None
    # Reversals appear in the files as negative entries. Real accounting, and
    # meaningless as a consumer figure.
    assert agg.num(-250) is None, "negative reversals must not enter the statistics"
    assert agg.num("1234.5") == 1234.5
t("dirty values are dropped rather than coerced to zero", _num)

def _policy_years():
    assert abs(agg.policy_years({"policyEffectiveDate": "2024-01-01T00:00:00",
                                 "policyTerminationDate": "2025-01-01T00:00:00"}) - 1.0) < 0.01
    # Missing dates assume one year rather than dropping the row entirely.
    assert agg.policy_years({}) == 1.0
    # A termination before the effective date is bad data, not a negative term.
    assert agg.policy_years({"policyEffectiveDate": "2025-01-01T00:00:00",
                             "policyTerminationDate": "2024-01-01T00:00:00"}) == 1.0
t("policy terms handle missing and reversed dates", _policy_years)

# --- suppression, which is the one that protects the reader ----------------

def _build(policies, claims):
    conn = sqlite3.connect(":memory:")
    conn.executescript(agg.SCHEMA)
    conn.executemany("INSERT INTO policies VALUES (?,?,?,?,?,?,?,?,?,?)", policies)
    conn.executemany("INSERT INTO claims VALUES (?,?,?,?,?,?,?,?,?,?)", claims)
    conn.commit()
    return agg.build(conn)

def _suppression():
    thin = [("48201", "AE", "TX", "77001", 900.0, 250000.0, "1", 0, 0, 1.0)] * 5
    out = _build(thin, [])
    assert out["48201"]["AE"]["suppressed"] is True, out
    assert "cost" not in out["48201"]["AE"], "a suppressed cell must carry no figure at all"

    thick = [("48201", "AE", "TX", "77001", 900.0 + i, 250000.0, "1", 0, 0, 1.0)
             for i in range(agg.MIN_CELL)]
    out2 = _build(thick, [])
    assert not out2["48201"]["AE"].get("suppressed"), out2
    assert out2["48201"]["AE"]["cost"]["n"] == agg.MIN_CELL
t("a thin cell is suppressed and reports no number, not a shaky one", _suppression)

def _paid_share():
    pols = [("22071", "AE", "LA", "70112", 1200.0, 250000.0, "1", 0, 0, 1.0)
            for _ in range(agg.MIN_CELL)]
    # Twelve claims, each paid half the assessed damage.
    clms = [("22071", "AE", "LA", "70112", 50000.0, 100000.0, 250000.0, 2021, "0", 3.0)
            for _ in range(12)]
    out = _build(pols, clms)["22071"]["AE"]
    assert out["shareOfDamagePaid"] == 0.5, out
    assert out["claims"] == 12
    assert out["claimRatePerYear"] == round(12 / agg.MIN_CELL, 5), out
t("the share-of-damage-paid figure is computed and anchored per policy-year", _paid_share)

def _paid_share_needs_evidence():
    pols = [("22071", "AE", "LA", "70112", 1200.0, 250000.0, "1", 0, 0, 1.0)
            for _ in range(agg.MIN_CELL)]
    clms = [("22071", "AE", "LA", "70112", 50000.0, 100000.0, 250000.0, 2021, "0", 3.0)
            for _ in range(3)]
    out = _build(pols, clms)["22071"]["AE"]
    assert out["shareOfDamagePaid"] is None, "three claims cannot support a payout ratio"
    assert out["claims"] == 3, "but the claim count is still reported"
t("too few claims yields no ratio, while still reporting the count", _paid_share_needs_evidence)

def _overpayment_capped():
    pols = [("12086", "VE", "FL", "33101", 3000.0, 250000.0, "1", 0, 0, 1.0)
            for _ in range(agg.MIN_CELL)]
    # Contents payments can exceed assessed building damage, which would produce
    # a nonsensical "paid 240% of the loss" headline.
    clms = [("12086", "VE", "FL", "33101", 120000.0, 50000.0, 250000.0, 2022, "0", 5.0)
            for _ in range(10)]
    out = _build(pols, clms)["12086"]["VE"]
    assert out["shareOfDamagePaid"] == 1.0, out
t("payouts exceeding assessed damage cap at 100%, not 240%", _overpayment_capped)

def _zero_damage_excluded():
    pols = [("12086", "AE", "FL", "33101", 1000.0, 250000.0, "1", 0, 0, 1.0)
            for _ in range(agg.MIN_CELL)]
    clms = [("12086", "AE", "FL", "33101", 0.0, 0.0, 250000.0, 2022, "0", 0.0)
            for _ in range(20)]
    out = _build(pols, clms)["12086"]["AE"]
    assert out["shareOfDamagePaid"] is None, "a zero-damage claim cannot form a ratio"
t("closed-without-payment claims do not divide by zero", _zero_damage_excluded)

print(f"\n{passed} passed, {failed} failed\n")
sys.exit(1 if failed else 0)
