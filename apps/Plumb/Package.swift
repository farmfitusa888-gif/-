// swift-tools-version: 5.9
import PackageDescription

let package = Package(
    name: "Plumb",
    platforms: [.iOS(.v17), .macOS(.v14)],
    products: [.library(name: "PlumbCore", targets: ["PlumbCore"])],
    dependencies: [.package(path: "../MeasureKit")],
    targets: [
        .target(name: "PlumbCore", dependencies: ["MeasureKit"]),
        .testTarget(name: "PlumbCoreTests", dependencies: ["PlumbCore"]),
    ]
)
