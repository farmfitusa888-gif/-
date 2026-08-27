# The five cores, in TypeScript — and they run

**One command proves all five products' logic:**

```bash
cd apps/ts && npm install && npm test     # 145 tests
npm run typecheck                          # clean
npm run demo                               # writes a real document per product
```

This is a faithful port of `MeasureKit` and all five `*Core` Swift targets. It
exists for one reason: **the Swift cannot be compiled in this repository's
development environment**, so this is where the logic is actually executed and
proven.

## What is here

| Module | Mirrors | What it proves |
|---|---|---|
| `src/measurekit/` | `MeasureKit` | Exact lengths and areas, money, provenance, rays, triangulation, plane fitting, the straightedge, exact slope ratios, the self-contained renderer |
| `src/openwall/` | `OpenWallCore` | Runs, spans, the cutting warning, the record |
| `src/riser/` | `RiserCore` | Three-state answers, deficiency ordering, the schedule |
| `src/plumb/` | `PlumbCore` | Threshold evaluation at exact boundaries, the evidence refusal |
| `src/flatline/` | `FlatlineCore` | The straightedge carry list, leveller quantities, the E1155 refusal |
| `src/templat/` | `TemplatCore` | Shoelace area, the CNC refusal, the DXF writer |

Each is line-for-line structural with its Swift counterpart. **If the two ever
disagree, one of them is wrong** — that is the entire point of keeping them
identical rather than idiomatic.

## Why a port rather than a guess

Three routes to a Swift toolchain were tried here and all are closed:
`swift.org` is blocked by network policy, apt's `swift` package is OpenStack
object storage, and the GitHub API is scoped to this session's own repositories.

So rather than ship 130 Swift tests nobody had run, every one of them was ported
to a language that does run. **Six bugs surfaced that way** — see
[`../README.md`](../README.md). Four were in the parts a careful reader skims: a
units constant, a sort predicate, a set membership, a character class.

## What this does NOT prove

Stated plainly, because the distinction matters:

- **It does not prove the Swift compiles.** Expect ordinary first-build errors —
  a missing import, a `Sendable` complaint, an access-level slip.
- **It does not prove the ARKit or SwiftUI layers work.** Those need a device.
- **It does not prove any real-world accuracy.** Every triangulation test uses
  synthetic cameras where the only error is the one deliberately injected. The
  five outstanding measurements are listed in [`../README.md`](../README.md).

What it does prove is the **arithmetic, the ordering, the boundaries and the
refusals** — which is the part that is expensive to get wrong and invisible to
review.

## One deliberate divergence

TypeScript's `bigint` is arbitrary precision; Swift's `Int64` is not. `distance`
therefore keeps the Swift's micrometre reduction *and* asserts the result fits in
Int64, so the port proves the Swift will not overflow rather than papering over
the one place the two languages genuinely differ.
