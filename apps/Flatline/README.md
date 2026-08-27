# Flatline — idea 6

**Floor-prep screening.** In one line: where to put the straightedge, what the prep costs, and a printed refusal to call itself an F-number.

Business case: [`buildouts/06-*.md`](../../buildouts/).

## Layout

| Target | Runs where | Tested here |
|---|---|---|
| `Sources/FlatlineCore` | Anywhere. No UI, no sensor, no Foundation beyond basics | **Yes** — `swift test` |
| `Sources/FlatlineApp` | iOS only. SwiftUI + ARKit, guarded by `#if canImport` | No — needs Xcode and a device |

Everything that decides whether a document is correct lives in `FlatlineCore`. That
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

Its logic is proven anyway: [`../ts/src/flatline/`](../ts/src/flatline/) is a
line-for-line TypeScript port of this core, and
[`../ts/test/flatline.test.ts`](../ts/test/flatline.test.ts) runs the same assertions
as `Tests/FlatlineCoreTests`. `cd ../ts && npm test` executes them.

Expect ordinary first-build errors here; do not expect the arithmetic to be wrong.

See [`../README.md`](../README.md) for what was verified, the bugs that caught,
and the measurements still outstanding.
