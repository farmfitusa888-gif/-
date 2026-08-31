#!/usr/bin/env python3
"""
What the contradiction engine actually costs to run, per case and per month.

I had a $900/month figure floating around from an early estimate. That number
was a ceiling I guessed at before the engine existed. The engine exists now, so
this file computes the cost from the pipeline it actually runs instead.

The important structural fact: Countercite never sends a whole policy to a
model. Retrieval is deterministic (see engines/contradiction/core.mjs). A model
is asked exactly one narrow question, many times: "do these two passages agree?"
That keeps token spend proportional to the number of candidate pairs, not to the
page count of the policy. An 80-page policy and a 200-page policy cost roughly
the same, which is the whole reason the unit economics work.

Run:  python3 innovation/model/api_cost.py
"""

# Anthropic list prices, dollars per million tokens, as published 2026.
# Batch API is 50% off both directions. Cache reads are 10% of the input rate
# but only apply to a prefix that repeats byte-for-byte across calls.
PRICES = {
    "claude-opus-5":   {"in": 5.00, "out": 25.00},
    "claude-sonnet-5": {"in": 2.00, "out": 10.00},
    "claude-haiku-4-5": {"in": 1.00, "out": 5.00},
}

# One case = one denial letter plus one policy. These are the token counts the
# pipeline generates. Each is (calls, input tokens per call, output per call).
#
# Anything not listed here runs locally and costs nothing per call: OCR and
# layout extraction, chunking, embeddings, candidate retrieval, deduplication,
# and the whole deterministic half of the engine.
STAGES = {
    # The judge. Fifteen assertions pulled out of the denial letter, three
    # candidate policy passages retrieved for each. System prompt and rubric
    # ride along on every call.
    "judge":     {"calls": 45, "in": 1150, "out": 350},

    # Every finding gets re-checked against the full surrounding policy section
    # before it is allowed to exist. This is the false-negative guard.
    "recheck":   {"calls": 6,  "in": 1400, "out": 300},

    # One drafting call that turns confirmed findings into the appeal letter.
    "draft":     {"calls": 1,  "in": 4000, "out": 1500},
}


def cost_per_case(model, batch=False):
    p = PRICES[model]
    mult = 0.5 if batch else 1.0
    total = 0.0
    breakdown = {}
    for name, s in STAGES.items():
        tin = s["calls"] * s["in"]
        tout = s["calls"] * s["out"]
        c = (tin / 1e6 * p["in"] + tout / 1e6 * p["out"]) * mult
        breakdown[name] = c
        total += c
    return total, breakdown


def split_cost(judge_model, cheap_model, batch=False):
    """Judge on the good model, everything else on a cheap one.

    This is the 'use free/cheap models where they belong' question, priced.
    The judge stays on Opus because a missed contradiction is invisible until
    the customer's claim settles low with our name on it.
    """
    pj = PRICES[judge_model]
    pc = PRICES[cheap_model]
    mult = 0.5 if batch else 1.0
    total = 0.0
    for name, s in STAGES.items():
        p = pj if name == "judge" else pc
        tin = s["calls"] * s["in"]
        tout = s["calls"] * s["out"]
        total += (tin / 1e6 * p["in"] + tout / 1e6 * p["out"]) * mult
    return total


def bar(label, value, width=44, scale=1.0):
    n = int(round(value / scale * width))
    return f"  {label:<34} ${value:>7.3f}  {'#' * n}"


def main():
    print()
    print("COST OF ONE CASE (one denial letter + one policy)")
    print("=" * 72)
    tokens_in = sum(s["calls"] * s["in"] for s in STAGES.values())
    tokens_out = sum(s["calls"] * s["out"] for s in STAGES.values())
    calls = sum(s["calls"] for s in STAGES.values())
    print(f"  {calls} model calls, {tokens_in:,} input tokens, {tokens_out:,} output tokens")
    print()

    rows = []
    for m in PRICES:
        for b in (False, True):
            c, _ = cost_per_case(m, b)
            rows.append((f"{m}{' (batch)' if b else ''}", c))
    rows.append(("opus judge + haiku rest", split_cost("claude-opus-5", "claude-haiku-4-5")))
    rows.append(("opus judge + haiku rest (batch)", split_cost("claude-opus-5", "claude-haiku-4-5", True)))

    top = max(v for _, v in rows)
    for label, v in rows:
        print(bar(label, v, scale=top))
    print()

    print("WHERE THE MONEY GOES (Claude Opus 5, no batch)")
    print("=" * 72)
    total, bd = cost_per_case("claude-opus-5")
    for name, c in sorted(bd.items(), key=lambda kv: -kv[1]):
        print(f"  {name:<12} ${c:>6.3f}   {c / total * 100:>5.1f}% of the case")
    print()
    print("  The judge is the bill. Moving the other two stages to a cheap model")
    print(f"  saves ${total - split_cost('claude-opus-5', 'claude-haiku-4-5'):.3f} a case, which is real but small.")
    print("  Batch processing saves half of everything and is the bigger lever.")
    print()

    print("MONTHLY BILL BY VOLUME (Claude Opus 5)")
    print("=" * 72)
    print(f"  {'cases/mo':>9}  {'live':>10}  {'batch':>10}  {'split+batch':>12}")
    live, _ = cost_per_case("claude-opus-5")
    bat, _ = cost_per_case("claude-opus-5", True)
    spl = split_cost("claude-opus-5", "claude-haiku-4-5", True)
    for n in (50, 100, 300, 500, 1000, 2500):
        print(f"  {n:>9}  ${live*n:>9.0f}  ${bat*n:>9.0f}  ${spl*n:>11.0f}")
    print()

    print("THE NUMBER THAT MATTERS")
    print("=" * 72)
    print("  Model cost as a share of revenue, at three cases per customer")
    print("  per month on a $299 plan:")
    print()
    for label, per in (("live Opus", live), ("batched Opus", bat), ("split + batch", spl)):
        monthly = per * 3
        print(f"    {label:<16} ${monthly:>6.2f} per customer per month"
              f"   =  {monthly / 299 * 100:>4.1f}% of revenue")
    print()
    print("  Gross margin on model spend alone stays above 98% in every case.")
    print("  Compute for OCR, storage, and payment processing are separate and")
    print("  are modelled in make_model.py.")
    print()


if __name__ == "__main__":
    main()
