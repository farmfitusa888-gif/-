// swift-tools-version: 5.9
import PackageDescription

let package = Package(
    name: "Riser",
    platforms: [.iOS(.v17), .macOS(.v14)],
    products: [.library(name: "RiserCore", targets: ["RiserCore"])],
    dependencies: [.package(path: "../MeasureKit")],
    targets: [
        .target(name: "RiserCore", dependencies: ["MeasureKit"]),
        .testTarget(name: "RiserCoreTests", dependencies: ["RiserCore"]),
    ]
)
