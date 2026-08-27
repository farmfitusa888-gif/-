# The test every idea had to pass

Eight ideas. Each one is the answer to a single question: *what else looks like
Trueline?*

Not "what else is a good app." Trueline is a specific shape, and the shape is
what was copied.

---

## 1. What Trueline actually is, read out of its own repository

Five properties, all of them read out of `README.md`, `DECISIONS.md`,
`docs/BUSINESS.md` and `docs/money.md` rather than from the name:

1. **A sensor measures, a human overrides, and the model re-solves around the
   override.** Type one wall's real width and every connected room, corner and
   quantity moves with it. Competitors let you edit a number without re-solving.
2. **Every figure carries its provenance** — `scanned`, `measured`, `derived`,
   `adjusted` — on screen and on every export. The app refuses to issue a
   drawing from numbers a tape has never touched.
3. **The whole job, not a slice.** The takeoff, the proposal, the change order
   and the invoice all come off the same measured walls. Two products next to
   each other cannot do that at any price.
4. **Flat and unlimited, against a field that meters.** Per scan, per project,
   per space — metering punishes the low-volume operator, and almost every
   remodeler is a low-volume operator.
5. **No server.** Storage is the customer's own iCloud, marginal cost per
   customer is zero, and the thing works in a basement with no signal.

## 2. The four patterns, as a gate

Every idea below had to clear **all four**, not three:

| | Pattern | The question asked of each idea |
|---|---|---|
| **A** | Trusted-data engine | Does this industry quietly guess, and does everyone hide it? |
| **B** | Whole job vs. pieces | Do 4–6 incumbents each own a slice, with the buyer retyping between them? |
| **C** | Sensor → money | Does phone hardware capture the real world and carry it to a priced, signed document? |
| **D** | Underserved small operator | Does everyone meter, and does that punish the one-truck shop? |

And then the build constraint, which killed more candidates than the patterns
did:

> **Solo-buildable. iOS + web. Offline-first. No server. Zero marginal cost.
> App Store subscription.**

That constraint is why there is no marketplace here, no two-sided network, no
"AI copilot for X" that dies the moment an API key expires, and nothing that
needs a licensed parts database. Auto-body collision estimating was cut for
exactly that reason: CCC, Mitchell and Audatex license the parts and labour
data, and a licensed database is a per-customer cost, which breaks the model.

## 3. What is sourced and what is not

The same discipline `MARKET-RESEARCH.md` uses, because a brief without it is a
pitch.

- **[vendor]** — read off the company's own page.
- **[review]** — reported by a third-party review, comparison or industry site
  and **not independently confirmed**. Comparison sites are often run by a
  competitor or an affiliate; treat every one of these as a lead to verify, not
  a fact.
- **[standard]** — a published technical or legal standard.
- **[assumption]** — mine. Marked every time.

Researched 2026-08-27. **No figure below was produced on a device I own, and no
accuracy claim in this document was measured.** Where a number would decide
whether an idea works, it says so and says it is unmeasured.

Every URL is in [`../SOURCES.md`](../SOURCES.md).

## 4. The honesty that costs something

Two of the eight are weaker than they first looked, and both say so in their own
brief rather than in a footnote:

- **Idea 4 (livestock) is contested.** At least four phone-based cattle weight
  products already exist. It stays in the set because of *how* they compete, not
  because the space is empty — but it is the riskiest of the eight.
- **Idea 6 was wrong as first conceived.** The plan was a phone that produces an
  ASTM E1155 floor-flatness F-number. It cannot: the standard needs precision a
  phone does not have. The idea survives only in a reduced, honest form, and the
  reduction is written up rather than quietly dropped.

That is the same move `DECISIONS.md` makes when it records that the DXF
recommendation was wrong and corrects it in place. A research file that never
says "this was wrong" is not being used.
