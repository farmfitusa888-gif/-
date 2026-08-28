# How to run the trademark search yourself — step by step

You asked what I meant by "run TESS on Counterweight (class 42)". Here is the
whole thing, start to finish. It is free, it takes about ten minutes per name,
and it is the cheapest risk in this entire project to retire.

---

## What I could and could not do

**What I did:** a conflict *screen* — searched for each name as an operating
business in or near its category. That catches loud collisions. It found three
(Steady, Nightlight, Threshold) and they are already renamed.

**What I could not do:** query the federal trademark register, because
`uspto.gov` is blocked by this environment's network policy. **A registered mark
with no web presence will not show up in my screen at all.** That is the gap you
are closing.

---

## Step by step

### 1. Open the search

Go to **https://tmsearch.uspto.gov**

This is the USPTO's trademark search. The old system was called **TESS** and
everyone still says "TESS", which is why I used the word — the current tool is
just called Trademark Search. Same database.

### 2. Search the name

Type the word on its own — `Counterweight` — and search.

Do this **three** ways for each name, because trademark conflict is about
confusion, not identical spelling:

| Search | Why |
|---|---|
| `Counterweight` | The exact word |
| `Counter*` | Wildcard. Catches Counterforce, Counterpoint, Counterpart — anything a lawyer would call confusingly similar |
| `Counterweight` in **goods and services text** | Catches marks that describe your service even under a different name |

### 3. Filter to LIVE marks only

**This is the step people skip and it is the most important one.**

There is a **Live/Dead** filter. A DEAD mark — abandoned, cancelled, expired —
is generally not a barrier. A LIVE mark is. If you do not filter, you will
panic at results that do not matter.

### 4. Check the class

Every result shows an **International Class**. These are the four that matter
for this project:

| Class | Covers | Which ideas |
|---|---|---|
| **042** | Software as a service, software design, technology services | Counterweight, Backpay, Overquote |
| **036** | Insurance, financial affairs, claims administration | Overturn, Counterweight |
| **044** | Medical and health services | Hearth, Fourth |
| **045** | Legal services, personal and social services | Counterweight, Claimable |

**The rule:** a live mark in a **different** class is usually survivable —
Delta the airline and Delta the tap manufacturer coexist. A live mark in **your**
class, for **related** services, is a stop.

### 5. Read the goods and services description

Click into any live mark in a relevant class and read what it actually covers.
"Computer software" is broad and dangerous. "Computer software for veterinary
practice management" is narrow and probably irrelevant to you.

### 6. Then check the rest

- The **.com** and your intended domain, at any registrar
- **Apple App Store** and **Google Play**, searching the bare name
- A plain web search for `"<name>" <your category>`
- **Illinois and Texas Secretary of State** business name databases, since that
  is where you would incorporate

---

## What to do with what you find

| What you find | What it means |
|---|---|
| No live marks in your classes | **Green.** Proceed. |
| Live mark, unrelated class | **Amber.** Usually fine. Note it and move on. |
| Live mark, your class, different services | **Amber.** Worth twenty minutes of a trademark attorney's time before spending on brand. |
| Live mark, your class, similar services | **Red.** Take an alternate from `buildouts/00-NAMES.md`. It is one config field. |
| Only a pending application | **Amber.** Applications fail often, but you would be building on someone else's timeline. |

---

## The seven, and what to search for each

| Name | Primary class | Also check | Specifically look for |
|---|---|---|---|
| **Counterweight** | 042 | 036, 045 | `Counter*` — **Counterforce Health** does claim appeals and is the known adjacent player. This is the one with a live flag and the one already built. |
| **Backpay** | 042 | 045, 036 | `Backpay`, `Back Pay`, `BackPay*`. Expect payroll-industry hits. |
| **Overturn** | 036 | 042, 045 | `Overturn*`. Watch for legal-services marks. |
| **Claimable** | 036 | 042, 044 | `Claim*` in 036 is a crowded field — read carefully. |
| **Overquote** | 042 | 036 | `Overquote`, `Over Quote`. Also check automotive services classes. |
| **Hearth** | 044 | 042 | `Hearth*` — a common word, expect many hits across home goods and hospitality. Only 044 and 042 matter. |
| **Fourth** | 044 | 042 | `Fourth*` is very common. Search `Fourth Trimester` too — it may be treated as descriptive in this category, which cuts both ways. |

---

## Two things worth knowing before you start

**Descriptive names are weak.** `Backpay` for a back-pay service and `Overquote`
for an over-quoting service describe what they do. That makes them easy to
understand and **hard to protect** — you may not be able to stop a competitor
using something similar. That is a reasonable trade for a first product; just
know you are making it.

**A screen is not clearance.** Everything above tells you whether there is an
obvious problem. It does not tell you that you are safe. If any of these
businesses starts making real money, **a trademark attorney's clearance opinion
is a few hundred dollars and is the point at which it becomes worth buying.**
Not before.

---

## The fastest version, if you only do one thing

**Search `Counter*` at https://tmsearch.uspto.gov, filter to LIVE, look at
classes 042 and 036.** That is the only name with a live flag from my screen and
the only one with a site already built. Ten minutes.
