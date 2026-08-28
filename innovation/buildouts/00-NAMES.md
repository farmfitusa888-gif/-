# Names and domains

> **Superseded in three places.** The trademark screen in
> [`00-TRADEMARK-SCREEN.md`](00-TRADEMARK-SCREEN.md) found real conflicts and
> renamed idea 3 to **Claimable**, idea 6 to **Hearth** and idea 7 to
> **Fourth**. The table below reflects those renames; the reasoning for the
> original picks is kept because it still explains the naming rules.

You asked me to name them all. Here they are, with the reasoning, plus what to
do if a domain is gone.

**A hard caveat first: I could not check a single domain's availability.** This
environment's egress proxy blocks every registrar, WHOIS service and DNS API —
the same block that stopped me reaching Reddit and the Texas licence dataset. So
**every domain below is a suggestion, not a confirmed available name.** Check
them before you fall in love with one. Renaming later is a find-and-replace
across the site config and the buildout doc, not a rebuild — the generator
takes the brand name from one field.

---

| # | Idea | Name | Suggested domain | Why this name |
|---|---|---|---|---|
| 1 | Paycheck auditor | **Backpay** | `backpay.co` | Says the outcome, not the mechanism. The word already means "money you were owed and didn't get" — no explaining required. |
| 2 | Claim advocate | **Overturn** | `overturn.co` | What the customer actually wants: the denial reversed. A verb, which makes for good ad copy and good CTAs. |
| 3 | Benefits finder | **Claimable** | `claimable.org` | The whole thesis in one word: this money *is* claimable and nobody claimed it. The `.org` is deliberate — the buyer is hospitals and health plans, where a mission signal helps the sale. |
| 4 | Second opinion | **Overquote** | `overquote.com` | Names the villain. Searchable intent: people literally type "was I overcharged for car repair". |
| 5 | Arm the advocates | **Counterweight** | `counterweight.app` | The whole thesis in one word — the institution has weight on its side of the scale, this puts weight on the other. Sold to the people already doing that job. |
| 6 | The 2am line | **Hearth** | `hearth.care` | The fire kept going through the night, and the centre of a home. Warm rather than clinical, and it promises *presence* rather than treatment — which is exactly what the product can honestly deliver at 2am. |
| 7 | The night shift | **Fourth** | `fourth.care` | From "fourth trimester", the term new parents already use for exactly this period. Meaningful to the buyer, meaningless to a competitor, and — crucially — not descriptive of the goods, which is what makes a mark protectable. |

## Naming rules I applied

1. **Name the outcome, not the technology.** Not one of these has "AI" in it.
   Every competitor in these categories is racing to put AI in the name; in a
   trust-dependent business that is a liability, not a feature. The customer
   wants their claim overturned and their back pay recovered — say that.
2. **Verbs and nouns people already use.** `Backpay` and `Overturn` are terms
   the buyer already says out loud, which is free search intent.
3. **Nothing that claims a credential.** No "Legal", "Counsel", "Advisor",
   "Doctor" or "Nurse" in any name. That is not squeamishness — it is the direct
   lesson of the FTC's DoNotPay order, and a name is the first claim you make.
4. **Short enough to say on a phone call**, because several of these sell by
   referral and word of mouth.

## Fallbacks, if the first choice is taken

| Name | Alternates |
|---|---|
| Backpay | `getbackpay.com`, `backpay.app`, **Shortfall** (`shortfall.app`), **Owed** (`owed.co`) |
| Overturn | `overturn.app`, `getoverturn.com`, **Rebuttal** (`rebuttal.co`), **Reopen** (`reopen.claims`) |
| Claimable | `claimable.care`, `getclaimable.com`, **Unclaimed** (`unclaimed.org`), **Owed** (`owed.care`) |
| Overquote | `overquote.co`, **Fairshop** (`fairshop.app`), **Secondop** (`secondop.com`) |
| Counterweight | `counterweight.co`, `getcounterweight.com`, **Fulcrum** (`fulcrum.casework`), **Sidebar** (`sidebar.app`) |
| Hearth | `hearth.support`, `gethearth.care`, **Nocturne** (`nocturne.care`), **Vigil** (`vigil.care`) |
| Fourth | `fourth.app`, `getfourth.care`, **Wick** (`wick.care`) |

## One trademark warning worth taking seriously

**A conflict screen has now been run** — see
[`00-TRADEMARK-SCREEN.md`](00-TRADEMARK-SCREEN.md) — and it killed three of the
original names. **It was not a clearance search**, because `uspto.gov` is
blocked from this environment. Before spending anything on a brand:

1. Search the **USPTO TESS** database free at `uspto.gov` for the exact name in
   the relevant class (usually 42 for software, 36 for insurance services, 44
   for health services).
2. Check the app stores and a plain web search for the name plus your category.
3. A name collision in a different industry is usually survivable; one in the
   same class is not.

**This is the single cheapest risk to retire on the whole project and it costs
nothing but an hour.** Do it before printing anything.
