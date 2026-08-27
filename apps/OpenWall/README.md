# OpenWall — idea 8

**The pre-drywall record.** In one line: a homeowner keeps a positioned record of every pipe, wire and duct, and pays the contractor for it.

Business case: [`buildouts/08-*.md`](../../buildouts/).

## Layout

| Target | Runs where | Tested here |
|---|---|---|
| `Sources/OpenWallCore` | Anywhere. No UI, no sensor, no Foundation beyond basics | **Yes** — `swift test` |
| `Sources/OpenWallApp` | iOS only. SwiftUI + ARKit, guarded by `#if canImport` | No — needs Xcode and a device |

Everything that decides whether a document is correct lives in `OpenWallCore`. That
split is deliberate: it is what lets the part that matters be tested without a phone.

## Build

```bash
swift test          # the core
```

Open `Package.swift` in Xcode, set your signing team, and run the app target on a
device for the capture half.

## Not compiled here

**This Swift has never been built.** The repository is developed on Linux and the
Swift toolchain download is blocked by network policy. The numerics it relies on
were verified in [`../verify/`](../verify/) and [`../openwall/`](../openwall/),
both of which run and pass. Expect ordinary first-build errors; do not expect the
arithmetic to be wrong.

See [`../README.md`](../README.md) for what was verified, the bugs that caught,
and the measurements still outstanding.
