# Riser — idea 2

**Fire and life-safety inspection.** In one line: an inspection that works in the basement and says what it could not check.

Business case: [`buildouts/02-*.md`](../../buildouts/).

## Layout

| Target | Runs where | Tested here |
|---|---|---|
| `Sources/RiserCore` | Anywhere. No UI, no sensor, no Foundation beyond basics | **Yes** — `swift test` |
| `Sources/RiserApp` | iOS only. SwiftUI + ARKit, guarded by `#if canImport` | No — needs Xcode and a device |

Everything that decides whether a document is correct lives in `RiserCore`. That
split is deliberate: it is what lets the part that matters be tested without a phone.

## Build

```bash
swift test          # the core
```

Open `Package.swift` in Xcode, set your signing team, and run the app target on a
device for the capture half.

## Not compiled here

**This Swift has never been built.** The repository is developed on Linux and the
Swift toolchain download is blocked by network policy.

Its logic is proven anyway: [`../ts/src/riser/`](../ts/src/riser/) is a
line-for-line TypeScript port of this core, and
[`../ts/test/riser.test.ts`](../ts/test/riser.test.ts) runs the same assertions
as `Tests/RiserCoreTests`. `cd ../ts && npm test` executes them.

Expect ordinary first-build errors here; do not expect the arithmetic to be wrong.

See [`../README.md`](../README.md) for what was verified, the bugs that caught,
and the measurements still outstanding.
