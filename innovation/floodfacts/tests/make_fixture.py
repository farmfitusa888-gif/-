#!/usr/bin/env python3
"""
A synthetic NFIP extract shaped like the real one, so the pipeline can be run
end to end without network access.

Shaped deliberately, not randomly. Three counties that behave differently,
because a fixture where every cell looks the same proves nothing:

  Harris County, Texas   high volume, high claim rate, partial payouts
  Miami-Dade, Florida    expensive coastal zone, fewer claims
  Cook County, Illinois  inland, cheap, almost no claims
  Plus one thin cell that must come out suppressed.

    python3 floodfacts/tests/make_fixture.py
"""
import json, os, random

random.seed(20260901)   # deterministic, so a failure is reproducible
OUT = "floodfacts/data"
os.makedirs(OUT, exist_ok=True)

SPEC = [
    # county, state, zip, zone, n_policies, cost_centre, claim_rate, paid_share
    ("48201", "TX", "77001", "AE", 4000, 1150, 0.09, 0.55),
    ("48201", "TX", "77002", "X",  6000,  480, 0.012, 0.70),
    ("12086", "FL", "33101", "VE",  900, 4200, 0.03, 0.62),
    ("12086", "FL", "33139", "AE", 2500, 1900, 0.04, 0.58),
    ("17031", "IL", "60601", "X",  3000,  420, 0.004, 0.80),
    ("22071", "LA", "70112", "AE",   11, 1400, 0.10, 0.50),   # must suppress
]

pol, clm, cid = [], [], 0
for county, st, zp, zone, n, centre, rate, share in SPEC:
    for i in range(n):
        # Lognormal-ish: most policies near the centre, a long right tail, and
        # the occasional commercial policy an order of magnitude above. That
        # tail is precisely what makes a mean useless here.
        cost = centre * random.lognormvariate(0, 0.35)
        if random.random() < 0.004:
            cost *= random.uniform(8, 30)
        pol.append({
            "id": f"P{cid}", "countyCode": county, "ratedFloodZone": zone,
            "propertyState": st, "reportedZipCode": zp,
            "policyCost": round(cost, 2),
            "totalBuildingInsuranceCoverage": 250000,
            "occupancyType": "1",
            "policyEffectiveDate": "2023-06-01T00:00:00.000Z",
            "policyTerminationDate": "2024-06-01T00:00:00.000Z",
            "elevatedBuildingIndicator": False,
            "postFIRMConstructionIndicator": zone != "X",
        })
        cid += 1
    for _ in range(int(n * rate)):
        damage = max(1000, random.lognormvariate(10.6, 0.8))
        paid = damage * min(1.0, max(0.0, random.gauss(share, 0.18)))
        clm.append({
            "id": f"C{cid}", "countyCode": county, "ratedFloodZone": zone,
            "state": st, "reportedZipcode": zp,
            "buildingDamageAmount": round(damage, 2),
            "amountPaidOnBuildingClaim": round(paid * 0.8, 2),
            "amountPaidOnContentsClaim": round(paid * 0.2, 2),
            "totalBuildingInsuranceCoverage": 250000,
            "occupancyType": "1", "yearOfLoss": random.choice([2019, 2021, 2023]),
            "causeOfDamage": "0", "waterDepth": round(random.uniform(0, 8), 1),
        })
        cid += 1

# One deliberately corrupt line: real bulk files contain them and the loader
# must skip rather than die.
with open(f"{OUT}/policies.ndjson", "w") as f:
    for r in pol:
        f.write(json.dumps(r) + "\n")
    f.write('{"id":"BROKEN","countyCode":\n')

with open(f"{OUT}/claims.ndjson", "w") as f:
    for r in clm:
        f.write(json.dumps(r) + "\n")

print(f"  {len(pol):,} policy transactions, {len(clm):,} claims, plus one corrupt line")
