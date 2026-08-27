# OPENWALL — core

The measurement layer and the artefact generator for the pre-drywall record.

**This is working code, not a skeleton.** 43 tests, clean typecheck, and a demo
that drives the whole pipeline and writes a real record you can open.

```bash
npm install
npm test          # 43 passing
npm run typecheck # clean
npm run demo      # writes build/demo-record.html
```

Then open `build/demo-record.html` **with your wifi off.** That is the product.

---

## What is here

| Module | What it does |
|---|---|
| `units.ts` | Exact lengths in integer nanometres. Feet-inches-fractions in and out |
| `vec.ts` | Float vector and rigid-transform maths, for ray geometry only |
| `camera.ts` | A tap on a photograph → a world-space ray, and the projection back |
| `triangulate.ts` | Two rays → one point, **and the distance by which they missed** |
| `provenance.ts` | How each position came to be known |
| `runs.ts` | Points → labelled runs with exact spans |
| `record.ts` | Pure function → the self-contained HTML artefact |

## The five decisions worth knowing

**1. Exact integers, and one door for floats.**
Lengths are `bigint` nanometres. Binary floating point cannot represent 3/8 of an
inch, and this trade works in sixteenths. ARKit speaks float metres, so there is
exactly one crossing point — `quantiseMetres` — and everything past it is integer
arithmetic. Distances use an integer square root, so a 3-4-5 triangle in feet
comes back as exactly 5 feet.

**2. A triangulated point is not a measurement.**
`provenance.ts` distinguishes `triangulated` (computed from two posed
observations) from `measured` (a human put a tape on it). *The business brief
called a triangulated point "measured" — that wording was loose and the code
corrects it.* A sensor result and a tape are not the same claim, and the whole
product rests on never letting them look alike.

**3. The miss distance is reported, never hidden.**
Two rays through the same pipe should intersect. Real ones never quite do.
`triangulate.ts` returns how far apart they were, and the artefact prints it.
Rays within half a degree of parallel return `degenerate: true` rather than a
confident number, because there the answer is noise.

Sub-1/32" misses print as `< 1/32"`, never `0"` — zero would claim a precision
the sensor does not have.

**4. A span is only as good as its weaker end.**
Span provenance is derived from its two points and cannot be asserted
independently. One unobserved end makes the whole span `derived`. The rule is
deliberately pessimistic: somebody is going to cut into a wall using this.

**5. The artefact fetches nothing, ever.**
No script, no stylesheet link, no font host, no image URL, no analytics. Images
are inlined as data URIs and a photo supplied as a URL is **rejected at render
time**. A test asserts the absence of every external-reference form, because the
promise is that the file opens in 2036 — and it must keep working if the company
that made it does not.

`renderRecord` is pure, so the same job renders the same bytes and can be tested
without a phone.

## What is deliberately NOT here

- **Automatic pipe recognition.** v1 is tap-to-triangulate. A human is standing
  in the room, and a confident wrong answer is worse than no answer.
- **The iOS app.** `core/` is platform-neutral on purpose — no Node imports in
  `src/`, so it compiles into a web view unchanged.
- **Any server.** There is nothing to host and nothing to breach.
- **`Date.now()`.** `capturedOn` is supplied by the caller, so a record is
  reproducible and a test is deterministic.

## Verified, not assumed

- **43 tests pass; `tsc --noEmit` is clean.**
- **Triangulation is checked by round trip**: a known point is projected into two
  synthetic camera views, tapped, and triangulated back to within 1e-9 m. A
  five-pixel tap error produces a real, finite, reported miss. A wider baseline
  is shown to beat a narrow one for the same tap error.
- **Feet-and-inches round-trips every sixteenth over eight feet** — 1,537 values,
  format then parse, exact.
- **The artefact was rendered in Chromium with all DNS mapped to 0.0.0.0** and
  displays correctly. That is the ten-year promise tested rather than asserted.

## What is still unmeasured

**No real-world accuracy figure exists for any of this.** Every triangulation
test uses synthetic cameras, where the only error is the one deliberately
injected. Whether a person tapping a pipe on a real phone in a real stud bay can
hit one inch is **unknown and untested**, and it is the gate on the whole
product — see `buildouts/08-behind-the-wall.md` §6, Test 2.

Do that test before building the app.
