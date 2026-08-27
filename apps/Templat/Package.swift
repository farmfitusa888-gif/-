// swift-tools-version: 5.9
import PackageDescription

let package = Package(
    name: "Templat",
    platforms: [.iOS(.v17), .macOS(.v14)],
    products: [.library(name: "TemplatCore", targets: ["TemplatCore"])],
    dependencies: [.package(path: "../MeasureKit")],
    targets: [
        .target(name: "TemplatCore", dependencies: ["MeasureKit"]),
        .testTarget(name: "TemplatCoreTests", dependencies: ["TemplatCore"]),
    ]
)
