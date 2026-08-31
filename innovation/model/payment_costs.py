#!/usr/bin/env python3
"""
The card is the bill. This works out how much of it can be removed.

Context for why this file exists. Model inference costs $1.20 per customer per
month (api_cost.py). Card processing on a $299 plan costs $8.97. So processing
is roughly seven times the model spend, and about 85% of the total cost to
serve. Every hour spent shaving inference cost is an hour spent on the smaller
number.

Three levers, none of which require the customer to accept anything worse:

  1. Annual billing. One transaction a year instead of twelve. Kills eleven
     fixed 30-cent fees and, more importantly, eleven chances to fail.
  2. ACH. A percentage fee with a hard cap, rather than an uncapped one.
  3. Both together.

Rates are published list prices and are marked [review]: the proxy blocks the
processor's own pricing page, so these came from search summaries and should be
confirmed before the model is used for a decision that matters.

Run:  python3 innovation/model/payment_costs.py
"""

# [review] Standard published US rates. Confirm at the processor before relying.
CARD_PCT, CARD_FIXED = 0.029, 0.30
ACH_PCT, ACH_CAP = 0.008, 5.00

# Annual plans are priced at ten months for twelve, matching the site.
TIERS = [("Solo", 149, 1490), ("Practice", 299, 2990), ("Firm", 599, 5990)]


def card(amount):
    return amount * CARD_PCT + CARD_FIXED


def ach(amount):
    return min(amount * ACH_PCT, ACH_CAP)


def year(monthly, annual, method, cadence):
    """Processing cost over one customer-year, and what the customer pays."""
    fee = card if method == "card" else ach
    if cadence == "monthly":
        return fee(monthly) * 12, monthly * 12
    return fee(annual), annual


def bar(v, top, width=34):
    return "#" * max(1, int(round(v / top * width))) if v else ""


def main():
    print("\nPROCESSING COST OVER ONE CUSTOMER-YEAR")
    print("=" * 78)
    print(f"  {'tier':<10} {'method':<18} {'customer pays':>14} {'fees':>9} {'% of revenue':>13}")
    print("-" * 78)

    for name, monthly, annual in TIERS:
        rows = []
        for method in ("card", "ach"):
            for cadence in ("monthly", "annual"):
                f, rev = year(monthly, annual, method, cadence)
                rows.append((f"{method} {cadence}", rev, f, f / rev))
        base = rows[0][2]
        for label, rev, f, pct in rows:
            saved = f"  saves ${base - f:>6.2f}" if f < base else ""
            print(f"  {name:<10} {label:<18} ${rev:>13,.0f} ${f:>8.2f} {pct*100:>12.2f}%{saved}")
        print("-" * 78)

    print("\nWHAT EACH LEVER IS WORTH, AT 100 CUSTOMERS ON PRACTICE ($299)")
    print("=" * 78)
    n = 299
    base_f, base_rev = year(*[t for t in TIERS if t[0] == "Practice"][0][1:], "card", "monthly")
    scenarios = [
        ("Card, monthly (the default)",        year(299, 2990, "card", "monthly")),
        ("Card, annual",                       year(299, 2990, "card", "annual")),
        ("ACH, monthly",                       year(299, 2990, "ach", "monthly")),
        ("ACH, annual (both levers)",          year(299, 2990, "ach", "annual")),
    ]
    top = max(f for _, (f, _) in scenarios) * 100
    for label, (f, rev) in scenarios:
        total = f * 100
        print(f"  {label:<30} ${total:>8,.0f}/yr  {bar(total, top)}")
    print()
    b = scenarios[0][1][0] * 100
    for label, (f, _) in scenarios[1:]:
        print(f"    {label:<28} saves ${b - f*100:>8,.0f} a year")

    print("\n  Note what annual billing costs the customer: nothing. They pay ten")
    print("  months for twelve. The discount is larger than the fee saving, so this")
    print("  is not a margin trick. It is bought with cash-flow timing and with a")
    print("  churn rate that falls when there are eleven fewer chances to leave.")

    print("\nTHE REALISTIC MIX")
    print("=" * 78)
    # Firms take invoices; individuals do not. Assume ACH is only reachable on
    # the tier that offers it, and that a minority of customers prepay a year.
    mix = [
        ("Solo",     40, 149, 1490, "card", 0.15),
        ("Practice", 50, 299, 2990, "card", 0.25),
        ("Firm",     10, 599, 5990, "ach",  0.60),
    ]
    tot_rev = tot_fee = tot_base = 0.0
    print(f"  {'tier':<10} {'n':>4} {'annual share':>13} {'revenue':>12} {'fees':>10}")
    for name, n_cust, monthly, annual, method, annual_share in mix:
        for share, cadence, meth in ((annual_share, "annual", method), (1 - annual_share, "monthly", "card")):
            cnt = n_cust * share
            f, rev = year(monthly, annual, meth, cadence)
            tot_fee += f * cnt
            tot_rev += rev * cnt
            tot_base += year(monthly, annual, "card", "monthly")[0] * cnt
        f_all = sum(year(monthly, annual, m, c)[0] * n_cust * s
                    for s, c, m in ((annual_share, "annual", method), (1 - annual_share, "monthly", "card")))
        r_all = sum(year(monthly, annual, m, c)[1] * n_cust * s
                    for s, c, m in ((annual_share, "annual", method), (1 - annual_share, "monthly", "card")))
        print(f"  {name:<10} {n_cust:>4} {annual_share*100:>12.0f}% ${r_all:>11,.0f} ${f_all:>9,.0f}")
    print("-" * 78)
    print(f"  {'TOTAL':<10} {'100':>4} {'':>13} ${tot_rev:>11,.0f} ${tot_fee:>9,.0f}"
          f"   ({tot_fee/tot_rev*100:.2f}% of revenue)")
    print(f"\n  All-card, all-monthly would cost ${tot_base:,.0f}.")
    print(f"  This mix saves ${tot_base - tot_fee:,.0f} a year, which is "
          f"{(tot_base - tot_fee)/tot_base*100:.0f}% of the processing bill.")
    print(f"  For comparison, the entire annual model-inference bill at this volume")
    print(f"  is about $1,440, and the GPU tier is about $300.\n")


if __name__ == "__main__":
    main()
