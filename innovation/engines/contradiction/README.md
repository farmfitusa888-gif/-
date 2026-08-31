# The contradiction engine

The thing Countercite sells. A denial letter says a claim is not covered and
cites a policy provision. This reads both documents and reports whether the
provision actually says what the letter claims.

## Status

**31 tests, all passing.** Mutation-tested: four deliberate bugs were introduced
and all four were caught. That check exists because a suite that passes on the
first run has usually not been pointed at anything.

**Not yet run on real documents.** The day 1 to 30 gate in the plan requires 20
real denial letters graded by a licensed adjuster before anything is sold. Until
that happens this is working code with no accuracy claim attached, and no
accuracy claim may be made.

## The design decision that matters

A language model is used for exactly one narrow job: judging whether two
passages of text agree. Everything else is deterministic.

Finding a citation, resolving it to a provision, detecting a carve-back and
assembling the output are ordinary programming problems. Solving ordinary
problems with a model is how you get a product that cannot explain itself, and
explaining itself is the entire value here.

The judge is an injected function, so a hosted API, a local open-weight model or
a human in a test harness all satisfy the interface. The engine imports no
vendor SDK and is not tied to any provider.

## What it refuses to do

| Refusal | Why |
|---|---|
| A `Finding` cannot be constructed without a `Locator` | "Every finding cites its page" is a property of the type, not a promise in the marketing |
| `resolveCitation` returns null below a 0.6 overlap floor | A wrong provision is worse than an admitted miss. It sends the reviewer to a page that does not support the finding and destroys the trust the product runs on |
| A low-confidence verdict is withheld and reported as a warning | Silence about a check that did not run is the DoNotPay failure |
| `canExport` blocks while any finding is unreviewed | The machine may find. Only a person may clear |
| It will say a denial was correct | A tool that only ever finds problems is a tool nobody believes |

## The four failure modes the tests are built around

In order of how much damage each would do:

1. **A finding that points at the wrong page.** The product is "check my work in
   seconds", and a wrong page makes that a lie.
2. **A confident finding on a denial that was actually correct.** Sending an
   adjuster to fight a fair denial costs them a client.
3. **Silently reporting something the model invented.**
4. **Exporting a document with unreviewed findings in it.**

## Running it

```
node --test innovation/engines/contradiction/core.test.mjs
```

## Wiring a judge

```js
import { analyse, AGREEMENT_PROMPT } from "./core.mjs";

const judge = async ({ claimed, actual }) => {
  // Any model. Must return { agrees, confidence, rationale }.
  const reply = await yourModel(`${AGREEMENT_PROMPT}\n\nCLAIMED:\n${claimed}\n\nACTUAL:\n${actual}`);
  return JSON.parse(reply);
};

const result = await analyse(letterDoc, policyDoc, { judge });
```

With no judge configured the engine still runs and still finds carve-backs,
missing citations and unresolvable references, because those are deterministic.
It reports the absent comparison as a warning rather than staying quiet about it.

## What is missing before this is a product

- PDF and OCR ingestion. `Doc` currently takes an array of page strings.
- A judge wired to a real model, and a decision about which.
- The accuracy harness run against 20 real denial letters.
- Deadline extraction. `FINDING_KINDS.DEADLINE` exists and nothing emits it yet.
