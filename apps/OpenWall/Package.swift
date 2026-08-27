// swift-tools-version: 5.9
import PackageDescription

let package = Package(
    name: "OpenWall",
    platforms: [.iOS(.v17), .macOS(.v14)],
    products: [.library(name: "OpenWallCore", targets: ["OpenWallCore"])],
    dependencies: [.package(path: "../MeasureKit")],
    targets: [
        .target(name: "OpenWallCore", dependencies: ["MeasureKit"]),
        .testTarget(name: "OpenWallCoreTests", dependencies: ["OpenWallCore"]),
    ]
)
