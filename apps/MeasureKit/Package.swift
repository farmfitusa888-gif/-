// swift-tools-version: 5.9
import PackageDescription

let package = Package(
    name: "MeasureKit",
    platforms: [.iOS(.v17), .macOS(.v14)],
    products: [
        .library(name: "MeasureKit", targets: ["MeasureKit"])
    ],
    targets: [
        .target(name: "MeasureKit"),
        .testTarget(name: "MeasureKitTests", dependencies: ["MeasureKit"]),
    ]
)
