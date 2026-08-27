// swift-tools-version: 5.9
import PackageDescription

let package = Package(
    name: "Flatline",
    platforms: [.iOS(.v17), .macOS(.v14)],
    products: [.library(name: "FlatlineCore", targets: ["FlatlineCore"])],
    dependencies: [.package(path: "../MeasureKit")],
    targets: [
        .target(name: "FlatlineCore", dependencies: ["MeasureKit"]),
        .testTarget(name: "FlatlineCoreTests", dependencies: ["FlatlineCore"]),
    ]
)
