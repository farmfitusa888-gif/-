# Countercite, the entity and tax question

Written 2026-08-31. Answers one objection: *does opening an LLC make me pay
taxes I would not otherwise pay?*

---

## The verdict, in five lines

1. **No. A single-member LLC creates no new tax.** By default the IRS ignores it
   entirely. The same profit lands on the same Schedule C, and the same
   self-employment tax is owed with or without the LLC. The bill is identical.
2. **Pre-revenue means the income tax bill is zero either way.** No profit, no
   income tax, no self-employment tax. An LLC does not change that.
3. **Forming in Texas is the wrong move for a non-Texan.** It buys a paid Texas
   registered agent, a Texas franchise-tax report due every 15 May forever, and
   then a second registration back home anyway.
4. **Form in the state you actually live in.** Realistic ongoing cost in most
   states is $0 to $300 a year. California is the outlier at roughly $800.
5. **The tax that will actually catch this business is sales tax on the
   subscription, and it has nothing to do with the entity.** Texas already taxes
   SaaS. California starts on 1 January 2027. A sole proprietor owes it too.

---

## Before anything else

**I am not a lawyer and I am not an accountant.** This is research, written to
be checked. It is not legal or tax advice and no professional relationship comes
out of reading it.

The network this was researched on blocks the IRS, the Texas Comptroller and the
California Franchise Tax Board. Every fetch of a primary source failed. So the
labels below carry real weight, and there is not one `[verified]` item in this
file. Same as `00-LEGAL-POSTURE.md`, same reason.

| Label | Meaning |
|---|---|
| `[verified]` | Primary source read. **Zero items here carry this label.** |
| `[review]` | Search-index summary only. Substance believed right, text not read. |
| `[conflict]` | Sources disagree. |
| `[NOT ESTABLISHED]` | Could not determine. Said so rather than guessed. |

Fees and thresholds are the most perishable facts in this document. Anything
below with a dollar sign should be re-checked on the day it matters.

---

## A correction to `00-LEGAL-POSTURE.md`

That file assumes the owner lives in Texas. It does not say so as an assumption;
it says it as a fact. Three places are wrong as a result, and one of them would
cost money to act on.

| Where | What it says | Why it is wrong |
|---|---|---|
| §3.3, last bullet | "**Texas is a good state to form in**, and the owner is already there." | The owner is not there. The Tex. Bus. Orgs. Code § 21.223 veil-piercing point stands on its own `[review]`, but the conclusion that follows from it does not. |
| §3.5, step 2 | "The owner may serve [as registered agent], with a Texas street address, not a PO box." | A non-resident has no Texas street address. This step costs money, not $0. See §4 below. |
| §3.5 total, and §5 order of operations | "**Total to get a shield: about $308**" and "**File Form 205.** $300. Nothing else on this list is worth doing first." | Correct instruction, wrong state and wrong number. The right first filing is in the owner's home state, and the all-in figure depends entirely on which state that is. |

Everything else in §3 of that file survives, including the part that matters
most: the honest admission in §3.3 that an LLC does not shield an owner from
their own negligent acts, which in a one-person software business is nearly
every act. That paragraph is the most useful thing in the file and none of what
follows contradicts it.

---

## 1. Does a single-member LLC create any new tax?

**No. The federal tax bill is identical to operating as a sole proprietor.**
That is the whole answer to the objection. The rest of this section is why.

### What "disregarded entity" actually means

A limited liability company with one owner that makes no election is treated by
the IRS as **disregarded as separate from its owner** for income tax purposes
`[review]`. Disregarded is not a euphemism. The IRS behaves as though the
company is not there.

Practically:

- **There is no separate business tax return.** No LLC return, no partnership
  return, no corporate return. The business's income and expenses go on
  **Schedule C** attached to the owner's ordinary Form 1040 `[review]`. That is
  exactly the same form a sole proprietor with no entity files.
- **The profit is taxed once, at the owner's personal rate**, on the owner's
  personal return. There is no second layer. The double-taxation people have
  heard about is a C corporation problem.
- **The LLC is still a separate entity for employment taxes and certain excise
  taxes** `[review]`. That only bites if there are employees. A solo founder
  with no payroll never touches it.

### Self-employment tax, which is the part people expect to change

It does not change.

An individual owner of a single-member LLC that runs a trade or business is
subject to self-employment tax on net earnings **in the same manner as a sole
proprietorship** `[review]`. The rate is 15.3% on net earnings, made up of the
Social Security and Medicare halves that an employer would otherwise split with
an employee `[review]`.

`[conflict]` on the 2026 Social Security wage base. One source rendered it as
**$184,500**, another as **$176,100**. The second figure looks like the 2025
number. Do not rely on either. It is irrelevant at pre-revenue and it is
published on the Social Security Administration's site, so look it up the year
it starts mattering.

The number that matters for the objection is 15.3%, and **it applies whether or
not an LLC exists.** Self-employment tax attaches to self-employment, not to
entities. Someone freelancing with no company at all owes it the moment net
earnings pass the filing floor.

### The one thing that would change the tax bill

An LLC can **elect** to be taxed as an S corporation. That election changes the
tax. Nothing else here does.

The trade: the owner pays themselves a reasonable salary through payroll,
which carries the 15.3% employment taxes, and takes the rest as a distribution
that does not `[review]`. Savings can be real. They cost real money to get:
payroll processing plus preparation of Form 1120-S runs roughly **$2,000 to
$3,500 a year** `[review]`.

`[conflict]` on the break-even point. Sources put it at roughly **$60,000 to
$80,000** of consistent net profit in one place and **$40,000 to $50,000** in
another `[review]`. That spread is wide enough that it is not a decision to make
off a search result.

Two things follow. **At pre-revenue, this is not a live question.** And at
$30,000 a month it very much is, which is the one place in this document where
an hour of an actual accountant is worth buying.

**The election is optional and it is not the default.** Nobody accidentally
falls into it. Filing an LLC does not put the founder anywhere near it.

### So what does the pre-revenue tax situation look like?

Zero income tax, because there is no income. Zero self-employment tax, for the
same reason. Business losses may be deductible against other income on Schedule
C, subject to rules I am not going to summarise from a search result. The LLC
changes none of this.

---

## 2. Does forming in a state you do not live in create a tax obligation there?

**Sometimes yes, and Texas is one of the yeses.** Not an income tax. A filing
obligation, permanently, plus a paid registered agent.

### Texas specifically

Texas has no personal income tax. It has a **franchise tax**, which is a
privilege tax imposed on each taxable entity **formed or organized in Texas, or
doing business in Texas** `[review]`. Read the first half of that. Forming a
Texas LLC makes it a taxable entity for franchise tax purposes on day one,
regardless of where the owner lives and regardless of whether the business ever
touches Texas.

| Item | Detail |
|---|---|
| **No-tax-due threshold** | **$2,650,000** in annualized total revenue for 2026 reports, up from $2.47M for 2024 and 2025 reports `[review]` |
| **Tax owed below it** | **$0** `[review]` |
| **Is a filing still required?** | **Yes.** This is the trap. |
| **Which form** | **Public Information Report, Form 05-102**, for LLCs, corporations and professional associations `[review]` |
| **Deadline** | **15 May**, every year `[review]` |
| **What happened to the old No Tax Due Report** | Form 05-163 was eliminated for reports due on or after 1 January 2024. Entities at or below the threshold no longer file it, but the PIR still stands `[review]` |
| **Penalty for missing it** | Forfeiture of the entity's right to do business in Texas, and personal liability for officers `[review]` |

Sit with that last row. **The penalty for forgetting a $0 filing is losing the
liability shield you formed the company to get.** A Texas LLC owned by someone
in another state, who has no reason to think about Texas in May, is a shield
with an annual expiry date on it.

An entity registered in Texas keeps filing until it formally terminates with the
Secretary of State `[review]`. Walking away does not end it.

### The general rule: nexus

A state gets to tax a business when the business has a sufficient connection to
it. The shorthand is **nexus**, and it comes in two flavours that behave
differently.

**Physical or entity presence.** Being formed there. Having an office, employees,
inventory or property there. This is the old rule and it is still the strongest.

**Economic nexus.** Passing a revenue threshold on sales into the state, with no
physical presence at all. This is the newer rule and it is where the thresholds
live.

### Does merely having customers in a state do it, for a software subscription?

For **income and franchise tax**, generally not until a threshold is crossed,
and the thresholds are high.

California's is the one that matters here, because California is a target
market. Under Cal. Rev. & Tax. Code § 23101(b), a taxpayer is doing business in
California if California sales exceed the lesser of $500,000 or 25% of total
sales, and the $500,000 figure is indexed annually `[review]`. The 2025 figure
was reported as **$757,070** `[review]`. The 2026 figure is
`[NOT ESTABLISHED]`; it had not been published when these sources were written.

**Two warnings on that, and they cut against comfort.** California's Office of
Tax Appeals has ruled that the § 23101(b) thresholds are **not a safe harbour**,
and an entity can still be doing business under the broader § 23101(a)
definition below them `[review]`. And at least one source states that an entity
receiving even $1 of California revenue may be doing business and liable for the
$800 minimum tax `[review]`. That reading is aggressive and I cannot confirm it.
Treat California as a state to watch once it becomes a meaningful revenue
source, not a state to assume is safe because revenue is small.

For **sales tax**, the answer is different, and this is the genuinely important
finding in the section.

| | Texas | California |
|---|---|---|
| **Is SaaS taxable?** | **Yes.** Treated as a taxable data processing service, with a 20% exemption, so 80% of the charge is taxed `[review]` | **Not today. Yes from 1 January 2027** `[review]` |
| **Rate** | 6.25% state plus up to 2% local, applied to the 80% base `[review]` | 7.25% state plus district taxes, over 10% combined in some places `[review]` |
| **Authority** | Comptroller Rule 3.330 `[review]` | **SB 122**, signed 29 June 2026 `[review]` |
| **Economic nexus threshold** | **$500,000** total Texas revenue in the preceding twelve months `[review]` | **$500,000** in sales into California `[review]`, figure not confirmed against the CDTFA |

Texas collection begins on the first day of the second month after the month the
threshold is met `[review]`. The threshold counts gross revenue including
non-taxable and exempt sales `[review]`.

**Sales tax has nothing to do with whether an LLC exists.** A sole proprietor
selling the same subscription into Texas past $500,000 owes exactly the same
collection duty. So this cannot be an argument against forming. It is an
argument for putting a reminder in the calendar for late 2026, because
California's SaaS rule starts four months after this document was written and
California is a named launch market.

---

## 3. The trap: foreign qualification

This is the part that turns a clever formation into an expensive one, and it is
the reason most "form in Delaware" advice fails for a solo founder.

### The mechanism

Live in state A. Form the LLC in state B. Run the business from the desk in
state A. State A now sees a company organised elsewhere that is transacting
business inside its borders, and it requires that company to register.

The registration is called **foreign qualification**, and "foreign" here means
out-of-state, not out-of-country. Depending on the state, the filing is called
an Application for Certificate of Authority, a Foreign Registration Statement,
or a Statement of Foreign Qualification `[review]`. The requirement is the same
in each: register the out-of-state entity, appoint a registered agent inside the
state, and in most states attach a recent certificate of good standing from the
formation state `[review]`.

Which means the founder now maintains **two** registrations, **two** registered
agents, and **two** sets of annual filings, for one desk.

### What it costs

Filing fees run from **$50** in Hawaii, Michigan and Missouri to **$500** in
Massachusetts and **$750** in Texas and South Dakota, with most states between
$100 and $300 `[review]`. The average is around **$190** `[review]`, and median
first-year cost including the first periodic report is about **$207.50**, before
the registered agent and the good-standing certificate `[review]`.

That Texas figure is worth reading twice. **Forming in Texas costs $300.
Registering a foreign LLC into Texas costs $750** `[review]`. Texas charges more
to let an outside company in than to create one.

### What happens if you skip it

Four consequences, and the second is the one that actually hurts `[review]`:

1. **Fines.** California charges $20 for each day an out-of-state LLC transacts
   intrastate business unregistered, capped at $10,000 `[review]`.
2. **Loss of access to the state's courts.** An unregistered foreign company
   generally cannot bring or maintain a lawsuit in that state. It cannot sue to
   enforce its own contracts or collect what it is owed `[review]`.
3. **Back taxes, fees and interest**, assessed for the whole unregistered period
   `[review]`.
4. **Possible personal liability** for members or managers for the company's
   obligations while it operated unregistered `[review]`.

Number two deserves a moment. The founder forms an LLC to be protected. The
unregistered version of that LLC is a company that can be sued but cannot sue.
It is the shield turned around.

### The decision rule

**Form in your home state when:** you are the only person in the business, you
work from home, you have no outside investors, and you are not raising venture
capital in the next year. That is this profile exactly.

The reasoning is arithmetic. Forming at home is one filing, one agent, one
annual obligation. Forming elsewhere is two of each plus a good-standing
certificate, and it saves nothing, because your home state taxes your income
based on where you live and where the work happens, not on where the paperwork
was filed `[review]`. There is no state you can register in that stops your
resident state from taxing your profit.

**Forming elsewhere genuinely makes sense when:** you are raising priced venture
rounds and the investors' documents assume Delaware; you have co-founders and
want Delaware's case law for the internal governance fights; or you are doing a
real estate or holding structure where the assets sit in the other state anyway.
None of these describe a pre-revenue solo software subscription.

**So: "form in Delaware" and "form in Texas" are both wrong here.** Delaware
costs a mandatory $300 franchise tax every 1 June, which every Delaware LLC owes
whether or not it earned a cent, plus a $200 late fee and 1.5% monthly interest
if missed, plus a required registered agent at roughly $50 to $150 a year
`[review]`, plus foreign qualification at home. Texas costs $300 to form, a paid
agent because the founder has no Texas address, an annual PIR whose penalty for
being late is forfeiture, and foreign qualification at home. Both are the
home-state cost plus a second state's cost, in exchange for nothing a solo
founder can use.

The Delaware story is genuinely valuable for companies that need it. This is not
one of them, at least not yet, and converting later is a solvable problem.

---

## 4. The real recurring cost

### The line items

| Item | One-off | Every year | Can it be avoided? |
|---|---|---|---|
| **Formation filing fee** | **$35 to $500** depending on state `[review]` | n/a | No |
| **Annual report or franchise fee** | n/a | **$0 to $800** depending on state `[review]` | No, where the state charges it |
| **Registered agent** | n/a | **$0 if you serve yourself, or roughly $50 to $150** commercially `[review]` | **Yes, in your home state.** Every state requires a physical street address in the state, no PO box, staffed in business hours `[review]`. You qualify at your own home address `[review]`. That address becomes public record, which is the reason to pay the $50 to $150 anyway. In a state you do not live in, this is not avoidable |
| **Business bank account** | $0 to low | $0 at most online business banks, or a monthly fee at some traditional ones | No, and do not try. This is what makes the shield real, per `00-LEGAL-POSTURE.md` §3.5 |
| **Bookkeeping** | $0 | **$0** if you do it yourself, and at pre-revenue a spreadsheet genuinely suffices | Yes, until volume makes it silly |
| **Additional tax filing** | n/a | **$0 federal.** Schedule C is already part of the personal return `[review]` | Not applicable, there is nothing extra |
| **Beneficial ownership report** | **$0 and no longer required** | n/a | FinCEN's final rule effective **14 August 2026** permanently exempts domestic reporting companies from BOI reporting under the Corporate Transparency Act `[review]`. This was a real trap in 2024 and 2025 and it is gone. Any guide still describing it is out of date |

### The expensive states

**California is the one that catches people, and it catches them hard.**

Every LLC organised in California **or doing business in California** owes an
**$800 annual tax**, every year, until it formally dissolves, even with zero
income and zero activity `[review]`. It is due on the 15th day of the 4th month
of the tax year, paid with voucher **FTB 3522**, though the voucher is
unnecessary if you pay online `[review]`.

And it does not stop there. A California single-member LLC that is disregarded
federally **still files its own Form 568** `[review]`. On top of the $800, a
graduated gross receipts fee starts at **$250,000** of California gross receipts
and tops out at **$11,790** `[review]`.

So a California founder's honest floor is **$800 a year to exist**, plus a
separate state return the federal disregarded treatment does not spare them
from. Nothing in this document changes that, and no amount of forming in
Wyoming avoids it.

**Delaware** is $300 a year flat plus a mandatory paid agent `[review]`.
**Massachusetts** is $500 to form `[review]`, and one source put first-year
foreign-qualification cost there at $1,020 `[review]`. **New York** has a
publication requirement that pushes first-year cost well past $2,000 in some
counties `[review]`; I did not verify the mechanics and it is
`[NOT ESTABLISHED]` here beyond the fact that it exists and is expensive.

At the cheap end: **New Mexico**, $50 to form with no annual report at all
`[review]`. **Wyoming**, $100 to form and $60 a year `[review]`. Both are
irrelevant unless you live there, for the reasons in §3.

### The honest all-in figure

**Earning nothing:**

| Scenario | Year one | Every year after |
|---|---|---|
| Typical home state, self as agent | **$50 to $300** | **$0 to $200** |
| Typical home state, commercial agent | **$100 to $450** | **$50 to $350** |
| California resident | **$800 plus formation fee** | **$800 plus any report fee** |

Call it **under $300 a year in most of the country, and about $900 in
California.** Those are the real numbers, and the reason the objection deserves
a straight answer: this is a small, fixed, predictable cost, and none of it is
a tax on the business.

**At $30,000 a month, $360,000 a year:**

The state fees above do not move, except California's gross receipts fee, which
at $360,000 of California receipts would sit in the lower tiers of a schedule
topping out at $11,790 `[review]`. The exact tier is `[NOT ESTABLISHED]`.

What does move is everything that has nothing to do with the LLC. Income tax and
self-employment tax on real profit, owed by a sole proprietor identically.
Bookkeeping, realistically a few hundred a year in software or a few thousand
for a person. Sales tax registration and filing in Texas and, from 2027,
California. And the S corporation question from §1, which at this income is
worth an accountant's hour.

**The LLC's own marginal cost at $360,000 is the same $50 to $800 it was at
zero.** That is the point. It does not scale with revenue, because it is a
registration fee, not a tax.

---

## 5. What actually happens if they never form one

`00-LEGAL-POSTURE.md` §3.2 lists the general sole-proprietor exposure and §3.4
covers whether the terms of service help. I am not repeating either. What
follows is the specific version for this business, plus the honest probability.

### What a plaintiff is actually suing over

Three shapes, in rough order of likelihood:

**The missed contradiction.** The engine returns a false negative. The customer
settles low, or misses an appeal window they would have caught, and their name
was on the letter. This is already named as the failure the product cannot
survive in `PLAN.md` §8. As a claim it is professional negligence, and it is the
one a technology E&O policy is written for.

**The document breach.** Uploaded policies and denial letters carry names,
addresses, loss details, sometimes health and financial information. A
misconfigured bucket is the whole claim. This one is not really about the
software at all.

**The regulator, which is not a lawsuit.** A UPL complaint or a public adjuster
licensing action produces an order, not a judgment. Orders name the person.

### What they can reach

Without an entity: everything the founder owns, subject only to their state's
homestead and exemption rules. With an entity, and taking §3.3 of the other file
seriously: the company's assets for sure, and the founder personally for their
own hands-on negligent acts, which in a one-person business is most of the
surface area.

**So the shield is thinner here than the internet says.** It is still worth
having, because the parts it does cover are the parts that arrive first: vendor
contracts, hosting bills, subscription commitments, a customer refund fight, and
anything an eventual employee or contractor does.

### Does the limitation-of-liability clause help a sole proprietor?

It helps somewhat less, and for a reason that is easy to miss. The clause lives
in a contract. Without an entity, the contract is between an individual and a
customer, and a limitation of liability signed by a person on their own behalf
looks more like a personal release than a commercial allocation of risk.
Against a consumer it is already weak, per §3.4 of the other file. Against a
consumer, from a person rather than a company, it is weaker still.

The entity is what makes the clause read like a commercial term. That is a real
benefit and it is rarely stated.

### Does insurance change the picture

Yes, and it does the job the entity does not: it pays defence costs, which
arrive long before any judgment.

`00-LEGAL-POSTURE.md` §3.3 puts bundled tech E&O with cyber at roughly
**$126 a month, $1,516 a year** `[review]`. Fresh searches this session return
a wider spread, and I am flagging it rather than quietly averaging.

`[conflict]` on the number. Sources this session `[review]`:

| Cover | Reported |
|---|---|
| Tech E&O alone, software developer | $74 to $91 a month |
| Cyber alone | $153 to $168 a month, though 41% of one insurer's tech customers reportedly pay under $100 |
| Solo developer, core coverage bundled, no employees, no office | $100 to $200 a month |
| Small SaaS, cyber plus tech E&O, under $1M revenue | **$2,500 to $6,000 a year** |

That last row is roughly double the figure in the other file. The gap is
probably underwriting: a product that reads insurance policies for consumers is
not a generic dev shop, and the application will say so. **Plan against $1,500
as the optimistic case and $3,000 as the realistic one**, and treat any quote
under $1,500 as a signal that the application undersold what the product does.

### The honest probability, at 100 customers in two years

The scary statistic available is that business litigation reportedly affects
36% to 53% of small businesses annually `[review]`. **I do not believe that
number applies here** and I am not going to use it to sell anything. It counts
every collections dispute, every landlord fight, every employment claim, across
every industry including construction and food service. A solo pre-revenue
software subscription with no employees, no premises, no inventory and no
payment terms has almost none of those surfaces.

The realistic read at 100 customers over two years: **being sued is unlikely.**
Most claims of this shape end in a refund and an angry email. What is
meaningfully more likely, and still not likely, is a regulatory complaint,
because filing one is free and any competitor or annoyed customer can do it.
That risk is a function of what the product says, which is what the whole of
`00-LEGAL-POSTURE.md` §1.4 exists to control, and it is not reduced by an LLC at
all.

The cost side, though, is asymmetric in a way that decides it. Defending a claim
that is eventually dismissed reportedly averages well into five figures; one
source puts the average liability suit at $54,000 and the average contract
dispute at $91,000 `[review]`. Those averages are inflated by large cases and
should not be read as a forecast. But the shape is right: **the downside is
five figures and the premium is three.**

**The risk justifies the cost**, though not for the reason people give. Under
$300 a year is not really a cost. It is less than the domain,
hosting and one month of a model provider's API. If a business cannot carry
$300 a year, the entity is not what is wrong with it. Form it, and stop
thinking about it.

---

## 6. Steps, if the answer is yes

Written for someone who has never done this. Nothing here needs a lawyer or a
formation service. Budget an afternoon.

Every step says whether it costs money. Every step that depends on the founder's
own state says exactly what to search.

### Step 0. Establish which state, before anything else

**Your home state.** The one where you live and where you sit when you work.
Per §3, this is correct for this profile and the alternatives cost more for
nothing.

If your home state is California, read §4 first. $800 a year is a real number
and you should decide with your eyes open rather than discover it in April.

### Step 1. Name check. Free.

Search: **`[your state] secretary of state business entity search`**

Two things to confirm:

- **Nobody in your state already has the name.** State databases only check
  within the state.
- **The name is available as a trademark and a domain.** The state search does
  not check either. `countercite.app` is already held, which is most of the
  work, but a federal trademark search at the USPTO is free and worth ten
  minutes before committing the name to a state filing.

Most states require the name to end in "LLC", "L.L.C." or "Limited Liability
Company". The exact permitted endings are a state-specific detail; the entity
search page usually links to them.

### Step 2. Appoint a registered agent. $0 to $150 a year.

You can be your own, if you have a physical street address in your formation
state and are there in normal business hours `[review]`. No PO boxes, anywhere
in the country `[review]`.

**The catch nobody mentions.** The registered agent address becomes public
record and is searchable by anyone. If that is your home address, it stays
online. A commercial agent at $50 to $150 a year `[review]` is the cheapest
privacy this business will ever buy, and it also means service of process does
not turn up at your door on a Tuesday.

This decision goes on the formation document, so make it before Step 3.

### Step 3. File the formation document. $35 to $500. Not free.

Search: **`[your state] secretary of state file LLC online`** and, separately,
**`[your state] LLC filing fee`**

The document has a different name in nearly every state: Certificate of
Formation, Articles of Organization, Certificate of Organization. It asks for
the name, the registered agent and address, the organiser, and sometimes a
purpose and a management structure. Single-member and member-managed are the
answers for a solo founder.

Two state-specific things to look up while you are there:

- **The fee**, because the ranges in this document are ranges.
- **Whether your state has a publication requirement.** Most do not. New York
  does and it is expensive `[review]`. Search
  **`[your state] LLC publication requirement`** and be pleased when the answer
  is no.

File online where the state offers it. Turnaround is usually days.

### Step 4. Get an EIN. Free, and this is where people get fleeced.

Apply directly at the IRS. The underlying form is **Form SS-4** and the online
application takes minutes `[review]`.

**Do not use a search engine to find it.** Type `irs.gov` into the address bar
yourself and navigate from there. Search results for "get an EIN" are full of
paid lookalikes.

The FTC sent warning letters in April 2025 to operators of websites that charge
for EINs while implying an IRS affiliation `[review]`. Those sites charge up to
**$300** for a free filing `[review]`, and typical third-party charges run **$50
to $300** for submitting the same SS-4 you can submit yourself `[review]`.
Violations of the FTC's Impersonation Rule carry civil penalties reported at up
to **$53,088 per violation** `[review]`.

The tell is always the same: a government-looking page that wants a card number
for something the government does for nothing.

A single-member LLC with no employees can technically use the owner's Social
Security number for some purposes, but get the EIN anyway. Banks ask for it, and
it keeps the SSN off vendor forms.

### Step 5. Open a business bank account. Usually free.

Take the stamped formation document, the EIN letter, and photo ID.

This step is not administrative. It is the step that makes the shield real. From
the day it opens: business income goes in, business expenses go out, personal
spending never touches it. `00-LEGAL-POSTURE.md` §3.5 puts it well and it is
worth repeating just this once, because an LLC treated as a nickname is an LLC a
claimant will argue about.

### Step 6. Write a one-page operating agreement. Free.

Single-member, so it is short and slightly absurd, since you are agreeing with
yourself. It is not filed with anyone. Keep it in the same folder as the
formation certificate. Some banks ask for it. It is also evidence the company
was treated as a company.

### Step 7. Build the calendar. This is the step that gets skipped.

Put these in a calendar with reminders, not in your head.

| When | What | Look up |
|---|---|---|
| Annually, date varies | **Your state's annual or biennial report**, if it has one | Search **`[your state] LLC annual report due date`**. Some states have none. Some charge $0 and still require the filing |
| Annually, date varies | **Your state's franchise or minimum tax**, if it has one | Search **`[your state] LLC annual tax`**. California is 15th day of the 4th month, $800, FTB 3522 `[review]` |
| Every 15 April | **Schedule C** with your personal return. Nothing new, no separate filing `[review]` | |
| Quarterly, once profitable | **Estimated tax payments**, Form 1040-ES. Same obligation a sole proprietor has | |
| Late 2026, one-off | **Decide on sales tax registration.** California SaaS becomes taxable 1 January 2027 under SB 122 `[review]`. Texas SaaS is taxable now, with collection required past $500,000 in Texas revenue `[review]` | Search **`California SB 122 SaaS sales tax`** and **`Texas remote seller sales tax threshold`** |
| Once, when revenue is real | **Buy tech E&O with cyber**, per §5 | |
| Once, past roughly $60,000 net profit | **Ask an accountant about the S corporation election.** Do not do this from a search result | |

**What is not on this list, and used to be:** the FinCEN beneficial ownership
report. Domestic companies are permanently exempt as of 14 August 2026
`[review]`. If a guide tells you to file one, the guide is out of date.

### What this actually costs, end to end

| | Most states | California |
|---|---|---|
| Steps 1, 4, 5, 6 | **$0** | **$0** |
| Step 3, formation | $35 to $500 | formation fee plus the $800 |
| Step 2, agent, if commercial | $50 to $150 a year | $50 to $150 a year |
| **Year one, realistic** | **$50 to $450** | **$850 to $1,300** |

No new tax. No business tax return. One or two filings a year that take about
twenty minutes each.

---

## What is still unverified, and what to do about it

Every fee, threshold and deadline in this document came from a search summary.
None of it was read at the source, because the network blocked all of them. The
three that would actually cost money if wrong:

1. **Your home state's formation fee and annual report obligation.** Look it up
   on the Secretary of State's own site before filing, not on a formation
   service's blog. The blogs are selling something.
2. **California's $800, if that is your home state.** Confirm it at
   `ftb.ca.gov`. It is the largest single number in this document.
3. **The California SaaS change effective 1 January 2027.** SB 122 was signed
   two months before this was written, which means the guidance is new and the
   details will move. Re-check it in November.

And one thing I could not resolve at all: whether a limitation-of-liability
clause signed by a natural person, rather than an entity, is treated differently
by courts in the four launch states. I reasoned about it in §5 from general
principles. `[NOT ESTABLISHED]`. It is a good addition to Question 3 in
`00-LEGAL-POSTURE.md` §5 if that hour ever gets bought.
