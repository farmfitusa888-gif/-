# Disclaimers: the exact words, and exactly where they go

---

> **A note before you read this.**
>
> This is a starting draft, written without a lawyer. The wording below is
> deliberately borrowed rather than invented: some of it tracks the words of a
> Texas statute, some of it tracks a California statute as restated by the
> online legal forms industry, and some of it tracks conditions a state bar
> imposed on a much larger company. Borrowed language is safer than clever
> language, because somebody has already argued about it.
>
> The reasoning behind each choice is in `00-LEGAL-POSTURE.md` §1.2 and §1.5.
> Every `[[FILL: ...]]` marker is something the owner still has to complete.

---

## Why placement is half the job

In *Unauthorized Practice of Law Committee v. Parsons Technology* the software's
disclaimer appeared **only on first start-up**. It was not on the packaging and
it did not reappear on later uses. The district court enjoined the product
anyway. Texas then passed the safe harbour now at **Tex. Gov't Code § 81.101(c)**,
which protects software only where the product **"clearly and conspicuously"**
states it is not a substitute for the advice of an attorney.

So the statute's price is conspicuousness, and the case that produced the
statute is a case about a disclaimer that was easy to miss. A disclaimer sitting
in a footer link is not conspicuous. **The placements below are more aggressive
than a designer will want them to be. That is the point.**

### Formatting rules that apply to every disclaimer here

1. **Same size as surrounding body text or larger.** Never smaller. Never grey
   on grey.
2. **Never collapsed behind a link, an accordion, a tooltip, or a "learn more".**
   The words must be on the page.
3. **Never inside a scrolling box the customer can skip past.**
4. **Never removed for returning users.** D1 and D3 appear every time, not once.
5. **Present in the exported file itself**, not only on the screen that made it.
   A PDF gets forwarded; the screen does not travel with it.
6. **Identical wording everywhere.** Do not paraphrase per page. Copy these
   strings. A variant is a variant somebody has to defend.

---

## The disclaimers

### D1. The master disclaimer

**Exact text:**

> **Countercite is not a law firm and is not a licensed public insurance
> adjuster. Countercite is not a substitute for the advice of an attorney.**
> We cannot give you any kind of advice, explanation, opinion or recommendation
> about your legal rights, remedies, defences, options, choice of forms or
> strategy. Countercite reports what your own documents say and shows you the
> page. What that means for your claim is your decision, or your professional's.

**Where it must appear:**

| Location | Form |
|---|---|
| Every page of the website | Footer, full text, not a link |
| The pricing page, above the plans | Full text, in the body of the page, not the footer |
| The signup and checkout screens, above the payment button | Full text |
| Inside the application, footer of every screen | Full text |
| Every exported document, first page | Full text |

**Why this wording.** The middle sentence tracks **Tex. Gov't Code § 81.101(c)**
almost verbatim, which is what the safe harbour asks for. The list that follows
("advice, explanation, opinion or recommendation about legal rights, remedies,
defences, options, choice of forms or strategy") tracks the prohibited-acts list
at **Cal. Bus. & Prof. Code § 6411**, which is the language the online legal
forms industry adopted for exactly this reason. Both citations are `[review]`
and neither statute was read in the original.

**The checkout placement is not optional.** Parsons' disclaimer failed partly
because it was not on the packaging. Checkout is this product's packaging.

---

### D2. First-run acknowledgement

**Exact text:**

> **Before you start, three things.**
>
> **1. Countercite is not a lawyer and not an adjuster.** It cannot tell you
> whether your claim is valid, whether your denial was correct, or whether an
> appeal will succeed. It is not a substitute for the advice of an attorney.
>
> **2. Every finding points at a page in your own documents. Open the page.**
> Countercite will sometimes miss something a person would catch, and will
> sometimes raise something that turns out not to matter. Check the work before
> you rely on it.
>
> **3. You send it, not us.** Countercite never contacts your insurance
> company. It produces a draft. You edit it, you approve it, and it goes out
> under your name.
>
> **What you upload here is not protected by attorney-client privilege**,
> because we are not attorneys. How we handle your documents is in the privacy
> policy.
>
> `[ ] I have read this`  `[ Continue ]`

**Where it must appear:** a modal on first login, before the first upload. The
checkbox must be unticked by default and the Continue button disabled until it
is ticked. Record the timestamp and the account against the acknowledgement, and
keep that record. **Show it again after any material change to this wording.**

**Why.** This is the point where the customer forms their expectation of what
they bought. It is also the record that proves what they were told, which is
worth more than the modal itself.

---

### D3. On the findings screen

**Exact text, immediately above the list of findings:**

> **These are observations about your documents, not conclusions about your
> claim.** Each one shows you a page and a passage so you can check it. None of
> them means your denial was wrong, or that you are owed anything. Countercite
> cannot tell you that.

**Where:** above the findings list, every time, on every case. Not dismissible.

**Why.** This is the screen where a customer is most likely to read a finding as
a verdict, because it looks like one. `00-LEGAL-POSTURE.md` §1.3 walks through
the six-sentence ladder from safe description to prohibited advice. This banner
sits on top of the ladder.

---

### D4. On the appeal letter builder

**Exact text, above the draft:**

> **This is a draft for you to edit, not a finished letter.** It quotes your
> denial letter and your policy and asks your insurer to explain or reconsider.
> It does not argue that your denial was wrong, because Countercite is not in
> a position to say that. Read every paragraph. Change anything you want.
> **Delete anything you are not comfortable putting your name to.**
>
> Countercite does not send this. When you are finished, download it and send
> it yourself.

**Where:** at the top of the letter builder, and above the export button.

**Additional interface requirements, which matter more than the words:**

- **Every paragraph is individually editable in a real text field.**
- **Every paragraph must be individually approved** before export, in the same
  way `canExport()` in the engine already requires every finding to be reviewed.
- **There is no send button, no email integration, no fax integration, and no
  "we'll mail it for you" option.** Not now, not later. Adding one changes what
  this product legally is. See `00-LEGAL-POSTURE.md` §1.2 on *TIKD*.

---

### D5. On every exported document

**Exact text, in a bordered box at the top of page one, and repeated as a footer
on every page:**

Top of page one:

> **Prepared using Countercite, [[FILL: legal entity name]],
> [[FILL: city, state]], [[FILL: website]].**
>
> Countercite is not a law firm, is not a licensed public insurance adjuster,
> and is not a substitute for the advice of an attorney. This document was
> generated from documents supplied by the sender and was reviewed and approved
> by the sender before it was sent. Countercite did not send it, did not
> contact any insurer, and offers no opinion on whether any claim is payable.

Footer on every page:

> Prepared using Countercite. Not legal advice. Not a substitute for the
> advice of an attorney. [[FILL: website]]

**Why.** The exported file is the only part of this product that reaches a third
party, which means it is the only part a regulator or an insurer's counsel is
likely to see first. It has to identify itself, name the company and the
address, and say what it is not, without the surrounding website. The
name-and-address requirement mirrors condition 4 of the North Carolina consent
judgment `[review]`.

---

### D6. Wherever an accuracy figure appears

**Exact text, immediately adjacent to the number, not in a footnote:**

> This figure comes from [[FILL: describe the dataset in one line, e.g. "138
> findings across 20 real denial letters, graded by a licensed Texas public
> adjuster in [[FILL: month, year]]"]]. It describes how Countercite performed
> on those documents. It does not predict how it will perform on yours, and it
> says nothing about whether any appeal succeeded.

**Where:** next to every accuracy, hours-saved or confirmation-rate number, on
the site, in a deck, in an email, in a social post, anywhere.

**The rule behind the rule:** if the dataset sentence cannot be written, the
number cannot be published. See `NO-GUARANTEE-AND-TESTING-POLICY.md`.

---

### D7. On the public adjuster pages

**Exact text:**

> Countercite is software licensed to you for use in your own practice. It is
> not a licensed public insurance adjuster, does not adjust claims, does not
> negotiate with carriers, and never contacts an insurer. It does not act on
> behalf of any insured. Your work product, and your professional
> responsibility for it, remain yours.

**Where:** on `/for/public-adjusters`, and on any page, email or deck aimed at
licensed professionals.

**Why.** Every state's public adjuster statute catches a person who *holds
themselves out* as an adjuster, not only one who acts as one. Texas
§ 4102.001, Florida § 626.854, California art. 3 and 215 ILCS 5/1515 all include
a holding-out prong `[review]`. Marketing copy is where a holding-out problem
would be created, not code.

---

### D8. Wherever a customer's testimonial or story appears

**Exact text, adjacent to the quote:**

> One customer's experience. Results depend on the documents, the policy and the
> insurer, and are not typical of anything. Countercite does not promise an
> outcome.

**Where:** next to every testimonial, case study, screenshot of a result, and
before-and-after.

---

## The placement map

One row per surface. Use this as the QA checklist before launch and before any
redesign.

| Surface | D1 | D2 | D3 | D4 | D5 | D6 | D7 | D8 |
|---|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|
| Home page | Footer | | | | | If a number appears | | If a quote appears |
| Pricing page | **In body, above plans** | | | | | If a number appears | | |
| `/for/public-adjusters` | Footer | | | | | | **Yes** | If a quote appears |
| Guides and glossary | Footer | | | | | | | |
| Signup / checkout | **Above the pay button** | | | | | | | |
| First login | | **Modal, must acknowledge** | | | | | | |
| Upload screen | Footer | | | | | | | |
| Findings screen | Footer | | **Above the list** | | | | | |
| Letter builder | Footer | | | **Above the draft** | | | | |
| Exported PDF or DOCX | | | | | **Page 1 box + every page footer** | | | |
| Marketing email | Signature block | | | | | If a number appears | If sent to adjusters | If a quote appears |
| Deck or PDF sent to a prospect | Slide 1 or page 1 | | | | | If a number appears | | If a quote appears |

---

## What marketing may never say

These are not style preferences. Each maps to a rule in `00-LEGAL-POSTURE.md`
§1.4.2 and to a pattern in the blocked-phrase fixture.

**Never, in any copy, anywhere:**

- "AI lawyer", "robot lawyer", "your AI attorney", "AI adjuster", "virtual
  adjuster", "digital advocate"
- "as good as a lawyer", "as good as an adjuster", "replaces your attorney",
  "instead of hiring a public adjuster", "you don't need a lawyer"
- "we'll fight your insurer", "we negotiate for you", "we handle your claim",
  "we deal with the carrier"
- "guaranteed", "we guarantee", "get what you're owed", "recover up to $X",
  "win your appeal", any win rate, any success percentage
- "no win, no fee", any percentage of a settlement, any contingent pricing
- "legal advice", except inside the fixed sentence "this is not legal advice"

**A note on "AI-powered".** `PLAN.md` §4 already says AI is never the headline
claim, and the reason is the DoNotPay order. Keep it that way. The headline is
the citation to the page, which is a claim about a mechanism and is verifiable.
Any capability claim about a model is a claim the FTC expects substantiated by
competent and reliable evidence `[review]`.

---

## Pre-launch check

Someone should be able to run this in an hour.

1. Load every page in `dist/countercite/`. Confirm the D1 footer text is
   present and identical on each one.
2. Confirm D1 appears **in the body** of the pricing page and above the payment
   button at checkout, not only in the footer.
3. Confirm the D2 modal blocks the first upload and records the acknowledgement.
4. Confirm D3 and D4 are not dismissible and reappear on every case.
5. Export a document. Confirm D5 is on page one and in the footer of every page.
6. Search the whole site and every email template for every phrase in the "never
   say" list above. Zero hits.
7. Find every number on the site. Confirm each has its D6 dataset sentence, or
   delete the number.
8. Run the blocked-phrase fixture from `00-LEGAL-POSTURE.md` §1.4.3 over every
   string in the engine and every page of the site. Zero hits outside the fixed
   disclaimer strings.
