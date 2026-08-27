# The five apps

Five products, one shared measurement engine, built to the same rule: **say what
was measured and what was assumed, and refuse to issue a document that cannot
tell the difference.**

| Directory | Idea | What it is |
|---|---|---|
| [`MeasureKit/`](MeasureKit/) | — | The shared engine. Exact lengths, areas, money, provenance, rays, triangulation, plane fitting, slope, and the self-contained report renderer |
| [`OpenWall/`](OpenWall/) | 8 | The pre-drywall record, sold to the homeowner |
| [`Riser/`](Riser/) | 2 | Fire and life-safety inspection, offline, with "not verified" as a first-class answer |
| [`Plumb/`](Plumb/) | 7 | Accessibility barrier survey, built to be read in litigation |
| [`Flatline/`](Flatline/) | 6 | Floor-prep screening that refuses to call itself an F-number |
| [`Templat/`](Templat/) | 1 | Countertop templating that will not export to CNC on a guess |
| [`openwall/`](openwall/) | 8 | The TypeScript reference core, **which runs and is tested here** |
| [`verify/`](verify/) | — | The reference implementation of MeasureKit's numerics, **which runs and is tested here** |

---

## Read this before trusting anything below

**The Swift was not compiled.** This repository is developed on Linux;
`download.swift.org` is blocked by the environment's network policy, so no Swift
toolchain could be installed. Nothing in the five Swift packages has been built,
run, or type-checked by the author of this commit.

**What was done instead**, because "I wrote it carefully" is not verification:

| | |
|---|---|
| **The numerics are verified** | Every expected value in the Swift tests was computed and checked by [`verify/`](verify/), a line-for-line TypeScript port of the same algorithms - geometry, money, areas, the shoelace, the DXF structure, the schedule, the evaluator boundaries, leveller quantities and the provenance lattice. **57 tests pass.** |
| **The TypeScript core runs** | [`openwall/`](openwall/) is the same product's engine in TS: **46 tests pass, typecheck clean**, and it renders a real artefact that was opened in a browser with all DNS mapped to `0.0.0.0`. |
| **Structural checks** | Brace and `#if`/`#endif` balance verified across every Swift file. |
| **Spec facts checked, not recalled** | The DXF `$INSUNITS` value was looked up rather than remembered — see below. |

**Expect compile errors on first build.** They will be ordinary ones — a missing
import, a `Sendable` complaint, an access-level slip. What should *not* be wrong
is the arithmetic, because that is the part that was actually tested.

## Six bugs the verification caught

Recorded because they are the whole argument for doing it this way. Two of them
were live in code that **runs**, and are now fixed and proven fixed.

1. ** was 4, which is millimetres**, while the DXF coordinates are
   written in inches. The file would have opened cleanly, looked correct, and cut
   every slab 25.4x too small. Caught by reading the specification instead of
   trusting memory.
2. **The straightedge hump case was wrong by 50%.** A straightedge rests *on* a
   hump and see-saws, so the deepest gap is at the quarter points - 83.33
   thousandths - not the hump's full 125. The intuitive answer was the wrong one.
3. ** was non-deterministic.** It sorted by size alone, and Swift's
   sort is not stable, so two equal entries could swap between runs. A list
   somebody works down with a tape cannot reorder itself.
4. ** returned  for a scanned end** - claiming nothing had
   *seen* a point a sensor had, and leaving one branch of the function
   unreachable. The harness caught this as a **failing Swift test before that
   test had ever been run.** Replaced with an explicit weakness ordering: a span
   is exactly as strong as its weaker end.
5. **The same bug shape, live, in the running TypeScript core.**  was
   missing from its observed set, so a span an actual tape measurement had moved
   came back as "inferred, not seen". Found by porting the Swift and comparing.
   Fixed, with a test that walks the whole lattice in both orders.
6. ** accepted non-ASCII.**  and 
   pass Devanagari digits and Cyrillic letters, and that check is the only thing
   between a bad string and a broken  URI. Now an explicit ASCII test.

Also fixed by reading rather than running: a type named  in 
that shadowed Swift's own, and a  passed where an **area** belonged - now
a real  type, so the compiler catches it rather than a reviewer.

**Four of these six were in the parts a careful reader would skim** - a units
constant, a sort predicate, a set membership, a character class. That is the
category of bug that verification finds and review does not.

## Running it

```bash
cd apps/MeasureKit && swift test     # 47 tests
cd apps/OpenWall   && swift test     # 12 tests
cd apps/Riser      && swift test     # 16 tests
cd apps/Plumb      && swift test     # 18 tests
cd apps/Flatline   && swift test     # 17 tests
cd apps/Templat    && swift test     # 20 tests
#                                    # 130 total
```

The `*App` targets need Xcode and a device: they are SwiftUI plus ARKit and are
guarded with `#if canImport(...)` so `swift test` still runs everywhere else.

**That guard is the architecture, not a convenience.** Everything that decides
whether a document is correct lives in a package with no UI and no sensor, which
is why it can be tested without either.

## What is still unmeasured

Named here so no gap is mistaken for an oversight. Each of these gates its
product, and each is a day's work to settle:

| Unknown | Gates |
|---|---|
| Can a person tapping a pipe on a real phone hit one inch? | OpenWall |
| Can phone LiDAR hold ±1.5 mm on a countertop cut edge? | Templat |
| Can a relative scan resolve a 3 mm deviation well enough to *rank* suspects? | Flatline |
| Can the device's inertial sensors resolve a 1:48 cross slope (about 1.19°)? | Plumb |
| Can one NFPA 25 report type be encoded in a week rather than a month? | Riser |

**No accuracy claim appears anywhere in this code**, in a comment or a string,
because none was measured. Every triangulation test uses synthetic cameras where
the only error is the one deliberately injected.
