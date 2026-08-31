# House style — make it look like a person made it

A standing rule for this project, added 2026-08-28 at the owner's instruction:
**everything produced here should read and look like a person made it, not like
typical AI output.** This applies to documents, websites, sales copy, code
comments and commit messages alike.

This file exists so the rule survives the session and so anyone — or any
assistant — working on this project inherits it.

---

## The writing tells, and what to do instead

### 1. Em-dash density is the loudest signal

AI prose uses the em dash constantly, because it is a safe connector that never
requires committing to a relationship between two clauses.

| | Em dashes |
|---|---|
| Typical AI draft | **one every 50–70 words** |
| Human editorial writing | **one every 300–500 words** |

**Rule: no more than one em dash per 250 words.** Count it before publishing.

Everything an em dash does, something else does better:

| Instead of | Use |
|---|---|
| `It's not the software — that's built.` | `It's not the software. That's built.` |
| `three things — speed, cost and trust` | `three things: speed, cost and trust` |
| `the number, which is 1,708 — is real` | `the number (1,708) is real` |
| `He knows her — her stage, her history` | `He knows her. Her stage. Her history.` |

### 2. Sentence rhythm

AI writes sentences of similar length, one after another, forever. People do
not. **Vary it deliberately.** A twenty-word sentence, then a five-word one.
Then a fragment. Like that.

### 3. Structures to avoid

- **"It's not X — it's Y."** Used once, sharp. Used six times in a document, a
  tic.
- **Perfectly parallel lists.** Three items of identical length and grammar.
  Real thinking is lumpier.
- **"Here's the thing:"** / **"But here's what's interesting:"** / **"The
  reality is:"** — throat-clearing before a point. Delete and make the point.
- **Rhetorical question then answer.** "So what does this mean? It means…"
- **Tricolon everywhere.** Not everything comes in threes.
- **Hedging stacks.** "It's worth noting that it may potentially be the case
  that…" Say it or don't.
- **Summary paragraphs restating what was just said.** If it needed a summary,
  it was too long.

### 4. Words that flag the source

`delve`, `leverage` (as a verb), `robust`, `seamless`, `landscape`,
`navigate the complexities`, `in today's fast-paced`, `game-changer`,
`unlock`, `empower`, `tapestry`, `testament to`, `it's important to note`,
`when it comes to`, `at the end of the day`, `dive deep`, `moreover`,
`furthermore`, `crucially` used as filler.

### 5. What actually reads as human

- **A specific number instead of a vague claim.** "1,708 active licences," not
  "a substantial market."
- **Admitting the thing you don't know**, in the same sentence as the thing you
  do.
- **A correction against yourself**, left in. The Counterweight plan says the
  model contradicted the plan and the model won. That single line does more for
  credibility than a page of polish.
- **An opinion with a reason.** "Don't start with this one, because…"
- **The occasional short paragraph that is one sentence long.**
- Contractions, used unevenly, like people use them.

---

## The design tells

Known AI-design clichés to avoid unless deliberately chosen:

- Warm cream `#F4F1EA` with a serif display and a terracotta accent
- Near-black with a single acid-green or vermilion pop
- Purple-to-blue gradient hero on white
- **Inter** or **Space Grotesk** as the default face
- Emoji as section markers
- Everything centred
- `rounded-lg` on everything; accent bar down the side of every card
- Perfectly even card grids where every card is the same height and weight

**What reads as designed by a person:** a neutral with a deliberate hue bias
rather than pure grey; a type pairing that is a choice rather than a default;
asymmetry where the content is genuinely asymmetric; and structural devices that
encode something true. If a page numbers its sections, the order should matter.
If it uses a status meter, the states should be real.

---

## The build tells

- **Comments that explain why, not what.** `// increment i` is machine writing.
  `// Cents-safe rounding. Floating point on money produces findings you cannot
  defend.` is a person who has been burned.
- **Tests written adversarially**, against the case where the code overstates
  rather than the case where it works.
- **Named constants with the reason attached.**
- Leave the honest limitation in the code, in a comment, where the next person
  will hit it.

---

## The check before anything ships

1. Count the em dashes. Over one per 250 words, edit.
2. Read the first sentence of every paragraph in a row. If they all sound the
   same length and shape, rewrite half of them.
3. Find one place to admit uncertainty or correct yourself. If there is none,
   the document is probably overclaiming.
4. Search for the flagged words above.
5. Ask: would a person who does this for a living put their name on it?
