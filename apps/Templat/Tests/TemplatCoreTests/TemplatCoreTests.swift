import XCTest
import MeasureKit
@testable import TemplatCore

private func p(_ xIn: Double, _ yIn: Double) -> Point2 {
    Point2(x: .inches(xIn), y: .inches(yIn))
}

/// A 96 x 25 in run: three cut edges and one wall edge.
private func run(measured: Bool, cutoutVerified: Bool = true) -> Template {
    let m: Provenance = measured ? .measured : .scanned
    func edge(_ id: String, _ a: Point2, _ b: Point2, cut: Bool) -> Edge {
        Edge(id: id, from: a, to: b, isCut: cut,
             provenance: cut ? m : .scanned,
             measuredLength: (cut && measured) ? distance2(a, b) : nil)
    }
    return Template(
        name: "Kitchen run", material: "Quartz", thickness: .inches(1.25),
        edges: [
            edge("back", p(0, 0), p(96, 0), cut: false),      // against the wall
            edge("right", p(96, 0), p(96, 25), cut: true),
            edge("front", p(96, 25), p(0, 25), cut: true),
            edge("left", p(0, 25), p(0, 0), cut: true),
        ],
        cutouts: [
            Cutout(id: "sink", kind: .undermountSink, centre: p(40, 12),
                   width: Provenanced(.inches(30), cutoutVerified ? .measured : .scanned),
                   depth: Provenanced(.inches(18), cutoutVerified ? .measured : .scanned)),
        ])
}

final class TemplateTests: XCTestCase {

    func testComputesAreaByShoelaceExactly() {
        // 96 x 25 in = 2400 sq in = 16.666... sq ft
        XCTAssertEqual(run(measured: true).area.squareFeetValue, 2400.0 / 144.0, accuracy: 0.01)
    }

    func testAMeasuredLengthOverridesTheScan() {
        var e = Edge(id: "e", from: p(0, 0), to: p(96, 0), isCut: true, provenance: .scanned)
        XCTAssertEqual(e.length.provenance, .scanned)
        e.measuredLength = .inches(95.5)
        XCTAssertEqual(e.length.provenance, .measured)
        XCTAssertEqual(e.length.value.inchesApprox, 95.5, accuracy: 1e-6)
    }

    func testKeepsTheDisagreementBetweenTapeAndScan() {
        var e = Edge(id: "e", from: p(0, 0), to: p(96, 0), isCut: true, provenance: .scanned)
        XCTAssertNil(e.discrepancy)
        e.measuredLength = .inches(95.75)
        XCTAssertEqual(e.discrepancy?.inchesApprox ?? 0, 0.25, accuracy: 1e-6)
    }

    /// THE REFUSAL - the whole product in one assertion.
    func testWillNotExportWhileACutEdgeIsUnverified() {
        XCTAssertFalse(run(measured: false).canExportToCNC)
        XCTAssertTrue(run(measured: true).canExportToCNC)
    }

    func testAnUnverifiedCutoutAlsoBlocksExport() {
        XCTAssertFalse(run(measured: true, cutoutVerified: false).canExportToCNC)
    }

    func testAFaucetHoleDoesNotBlockExportBecauseItIsDrilledNotSawn() {
        let t = Template(name: "t", material: "m", thickness: .inches(1.25),
                         edges: run(measured: true).edges,
                         cutouts: [Cutout(id: "f", kind: .faucetHole, centre: p(20, 4),
                                          width: Provenanced(.inches(1.5), .scanned),
                                          depth: Provenanced(.inches(1.5), .scanned))])
        XCTAssertTrue(t.canExportToCNC)
    }

    func testWallEdgesDoNotNeedATapeBecauseNothingIsSawnToThem() {
        // Only the three cut edges are on the carry list; "back" never appears.
        XCTAssertFalse(run(measured: false).carryList().contains { $0.id == "back" })
    }

    func testCarryListRanksTheLongestCutEdgeFirstAndIsDeterministic() {
        // front is 96 in; left and right are both 25 in, so the id breaks the tie
        // and the order is the same on every run.
        XCTAssertEqual(run(measured: false).carryList().map(\.id), ["front", "left", "right"])
        XCTAssertEqual(run(measured: false).carryList().map(\.id),
                       run(measured: false).carryList().map(\.id))
    }

    func testRefusalReasonsNameTheOffendingEdges() {
        let reasons = run(measured: false).refusalReasons
        XCTAssertTrue(reasons.contains { $0.contains("front") })
        XCTAssertTrue(reasons.allSatisfy { !$0.isEmpty })
    }

    func testAnEmptyTemplateCannotExport() {
        let empty = Template(name: "t", material: "m", thickness: .inches(1), edges: [])
        XCTAssertFalse(empty.canExportToCNC)
        XCTAssertEqual(empty.area.squareMillimetres, 0)
    }

    func testSurfacesTheWorstTapeToScanDisagreement() {
        var t = run(measured: true)
        t.edges[1].measuredLength = .inches(25.5)   // scan said 25
        XCTAssertEqual(t.worstDiscrepancy?.inchesApprox ?? 0, 0.5, accuracy: 1e-6)
    }
}

final class DXFTests: XCTestCase {

    /// The regression test for a factor-of-25.4 bug that would have cut every
    /// slab wrong while the file looked perfectly fine.
    func testHeaderDeclaresInchesNotMillimetres() throws {
        let dxf = try DXFWriter.export(run(measured: true))
        XCTAssertTrue(dxf.contains("$INSUNITS"))
        // 1 = inches. 4 = millimetres and would be catastrophic here.
        let header = dxf.components(separatedBy: "$INSUNITS")[1]
        XCTAssertTrue(header.hasPrefix("\n70\n1\n"),
                      "$INSUNITS must be 1 (inches), got: \(header.prefix(12))")
        XCTAssertTrue(dxf.contains("$MEASUREMENT"))
    }

    func testRefusesToExportUnverifiedGeometry() {
        XCTAssertThrowsError(try DXFWriter.export(run(measured: false))) { error in
            guard case DXFWriter.ExportError.refusedUnverifiedCutEdges(let reasons) = error else {
                return XCTFail("wrong error: \(error)")
            }
            XCTAssertFalse(reasons.isEmpty)
        }
    }

    func testWritesAWellFormedFile() throws {
        let dxf = try DXFWriter.export(run(measured: true))
        XCTAssertTrue(dxf.hasSuffix("0\nEOF\n"))
        XCTAssertTrue(dxf.contains("SECTION"))
        XCTAssertTrue(dxf.contains("ENTITIES"))
        // Four edges become four LINE entities.
        XCTAssertEqual(dxf.components(separatedBy: "\nLINE\n").count - 1, 4)
        // The sink becomes one closed polyline.
        XCTAssertEqual(dxf.components(separatedBy: "LWPOLYLINE").count - 1, 1)
    }

    func testPutsVerifiedCutsOnTheirOwnLayer() throws {
        let dxf = try DXFWriter.export(run(measured: true))
        XCTAssertTrue(dxf.contains("CUT_MEASURED"))
        XCTAssertTrue(dxf.contains("REFERENCE"))
    }

    func testWritesTheMeasuredNumberAsDimensionText() throws {
        let dxf = try DXFWriter.export(run(measured: true))
        XCTAssertTrue(dxf.contains("MEASURED"))
        XCTAssertTrue(dxf.contains("2' 1\"") || dxf.contains("8'"),
                      "dimension text should carry feet-and-inches")
    }

    func testCoordinatesAreWrittenInInches() throws {
        let dxf = try DXFWriter.export(run(measured: true))
        // The 96 in edge must appear as 96.000000, not 2438.4 (mm).
        XCTAssertTrue(dxf.contains("96.000000"))
        XCTAssertFalse(dxf.contains("2438.4"))
    }
}

final class TemplateQuoteTests: XCTestCase {

    func testPricesOffVerifiedGeometry() {
        let q = TemplateQuote.quote(for: run(measured: true),
                                    materialPerSquareFoot: Money(cents: 7500),
                                    profile: .bullnose,
                                    cutoutPrice: Money(cents: 15000))
        XCTAssertTrue(q.isIssuable)
        XCTAssertGreaterThan(q.subtotal.cents, 0)
    }

    /// A quote built on unverified geometry is visibly not issuable.
    func testAQuoteOnUnverifiedGeometryIsNotIssuable() {
        let q = TemplateQuote.quote(for: run(measured: false),
                                    materialPerSquareFoot: Money(cents: 7500),
                                    profile: .bullnose,
                                    cutoutPrice: Money(cents: 15000))
        XCTAssertFalse(q.isIssuable)
        XCTAssertFalse(q.unverifiedLines.isEmpty)
    }

    func testOmitsAnEdgeLineWhenTheProfileIsFree() {
        let q = TemplateQuote.quote(for: run(measured: true),
                                    materialPerSquareFoot: Money(cents: 7500),
                                    profile: .eased,
                                    cutoutPrice: Money(cents: 15000))
        XCTAssertFalse(q.lines.contains { $0.item.code == "EDG" })
    }
}
