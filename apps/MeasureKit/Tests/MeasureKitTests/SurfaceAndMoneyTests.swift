import XCTest
@testable import MeasureKit

/// Expected values verified in `apps/verify/vectors.test.ts`.
final class SlopeTests: XCTestCase {

    func testIsExactAtTheRampBoundary() {
        // Exactly 1:12 passes; one nanometre steeper fails.
        XCTAssertFalse(Slope(rise: .inches(1), run: .inches(12))
            .exceedsOneIn(SlopeLimit.ramp))
        XCTAssertTrue(Slope(rise: Length(nanometres: Length.nmPerInch + 1), run: .inches(12))
            .exceedsOneIn(SlopeLimit.ramp))
    }

    func testIsExactAtTheCrossSlopeBoundary() {
        XCTAssertFalse(Slope(rise: .inches(1), run: .inches(48))
            .exceedsOneIn(SlopeLimit.cross))
        XCTAssertTrue(Slope(rise: Length(nanometres: Length.nmPerInch + 1), run: .inches(48))
            .exceedsOneIn(SlopeLimit.cross))
    }

    func testAFallIsAsSteepAsARise() {
        XCTAssertTrue(Slope(rise: -Length.inches(2), run: .inches(12))
            .exceedsOneIn(SlopeLimit.ramp))
    }

    func testCatchesARampThatIsJustTooSteep() {
        // 30 ft of run allows 30 in of rise at 1:12.
        XCTAssertTrue(Slope(rise: .inches(31), run: .feet(30)).exceedsOneIn(SlopeLimit.ramp))
        XCTAssertFalse(Slope(rise: .inches(30), run: .feet(30)).exceedsOneIn(SlopeLimit.ramp))
    }

    func testFormatsAsOneIn() {
        XCTAssertEqual(Slope(rise: .inches(1), run: .inches(12)).formattedAsOneIn(), "1:12")
        XCTAssertEqual(Slope(rise: .zero, run: .inches(12)).formattedAsOneIn(), "level")
    }

    func testKeepsTheDisagreementBetweenTwoMethods() {
        let inertial = Slope(rise: .inches(1), run: .inches(12))
        let geometry = Slope(rise: .inches(1), run: .inches(20))
        let checked = CrossCheckedSlope(fromInertial: inertial, fromGeometry: geometry)
        // The steeper reading is reported: the conservative choice.
        XCTAssertEqual(checked.reported.run.nanometres, inertial.run.nanometres)
        XCTAssertTrue(checked.disagrees())
        XCTAssertGreaterThan(checked.disagreementDegrees, 0)
    }
}

final class MoneyTests: XCTestCase {

    func testRoundsHalfUpAtTheLastCentOnce() {
        let ten = PriceItem(code: "X", description: "x", unit: .each, unitPrice: Money(cents: 1000))
        XCTAssertEqual(QuoteLine(item: ten, quantityMilli: 1500, provenance: .measured).total.cents, 1500)

        let onePenny = PriceItem(code: "Y", description: "y", unit: .each, unitPrice: Money(cents: 1))
        XCTAssertEqual(QuoteLine(item: onePenny, quantityMilli: 500, provenance: .measured).total.cents, 1)
        XCTAssertEqual(QuoteLine(item: onePenny, quantityMilli: 499, provenance: .measured).total.cents, 0)
    }

    func testDoesNotDriftAcrossManyLines() {
        let item = PriceItem(code: "Z", description: "z", unit: .linearFoot,
                             unitPrice: Money(cents: 1999))
        let lines = (0..<100).map { _ in
            QuoteLine(item: item, quantityMilli: 1333, provenance: .measured)
        }
        XCTAssertEqual(lines[0].total.cents, 2665)
        XCTAssertEqual(Quote(lines: lines).subtotal.cents, 266_500)
    }

    func testFormatsWithThousandsSeparators() {
        XCTAssertEqual(Money(cents: 266_500).formatted, "$2,665.00")
        XCTAssertEqual(Money(cents: 5).formatted, "$0.05")
        XCTAssertEqual(Money(cents: -1234).formatted, "-$12.34")
        XCTAssertEqual(Money(cents: 123_456_789).formatted, "$1,234,567.89")
    }

    /// The refusal every product in this family shares.
    func testWillNotIssueAQuoteRestingOnUnverifiedNumbers() {
        let item = PriceItem(code: "A", description: "a", unit: .squareFoot,
                             unitPrice: Money(cents: 500))
        let scanned = Quote(lines: [QuoteLine(item: item, quantityMilli: 1000, provenance: .scanned)])
        XCTAssertFalse(scanned.isIssuable)
        XCTAssertEqual(scanned.unverifiedLines.count, 1)

        let measured = Quote(lines: [QuoteLine(item: item, quantityMilli: 1000, provenance: .measured)])
        XCTAssertTrue(measured.isIssuable)

        XCTAssertFalse(Quote(lines: []).isIssuable, "an empty quote is not issuable either")
    }
}

final class ProvenanceTests: XCTestCase {

    func testOnlyMeasuredAndAdjustedMayBeIssued() {
        XCTAssertTrue(Provenance.measured.isIssuable)
        XCTAssertTrue(Provenance.adjusted.isIssuable)
        XCTAssertFalse(Provenance.scanned.isIssuable)
        XCTAssertFalse(Provenance.triangulated.isIssuable)
        XCTAssertFalse(Provenance.derived.isIssuable)
    }

    func testASpanIsOnlyAsGoodAsItsWeakerEnd() {
        XCTAssertEqual(combine(.measured, .measured), .measured)
        XCTAssertEqual(combine(.measured, .triangulated), .triangulated)
        XCTAssertEqual(combine(.measured, .derived), .derived)
        XCTAssertEqual(combine(.triangulated, .derived), .derived)
        XCTAssertEqual(combine(.triangulated, .scanned), .scanned)
        XCTAssertEqual(combine(.measured, .scanned), .scanned)
        XCTAssertEqual(combine(.adjusted, .measured), .adjusted)
        XCTAssertEqual(combine(.derived, .scanned), .derived)
    }

    func testATypedMeasurementReplacesTheSensorValueRatherThanAveraging() {
        var v = Provenanced(Length.inches(36), .scanned, tolerance: .inches(0, 1, 4))
        v.override(with: .inches(35))
        XCTAssertEqual(v.value.nanometres, 35 * Length.nmPerInch)
        XCTAssertEqual(v.provenance, .measured)
        XCTAssertNil(v.tolerance, "a tape has no sensor tolerance")
    }
}

final class SurfaceTests: XCTestCase {

    private func sample(_ posInches: Int, _ heightThou: Int) -> SurfaceSample {
        SurfaceSample(position: .inches(Double(posInches)),
                      height: Length(nanometres: Int64(heightThou) * Length.nmPerInch / 1000))
    }

    func testRecoversAPlaneItWasGiven() throws {
        // z = 0.02x - 0.01y + 0.5
        let points = [
            Vector3(0, 0, 0.5), Vector3(1, 0, 0.52), Vector3(0, 1, 0.49),
            Vector3(2, 3, 0.51), Vector3(5, 1, 0.59),
        ]
        let plane = try fitPlane(points)
        XCTAssertEqual(plane.a, 0.02, accuracy: 1e-9)
        XCTAssertEqual(plane.b, -0.01, accuracy: 1e-9)
        XCTAssertEqual(plane.c, 0.5, accuracy: 1e-9)
    }

    func testRefusesADegenerateCloudRatherThanInventingAPlane() {
        XCTAssertThrowsError(try fitPlane([Vector3(0, 0, 0), Vector3(1, 1, 1)]))
        XCTAssertNil(solve3x3([[1, 2, 3], [2, 4, 6], [3, 6, 9]], [1, 2, 3]))
    }

    func testReadsZeroOnAFlatFloor() {
        let flat = [0, 12, 24, 36, 48, 60, 72].map { sample($0, 0) }
        XCTAssertEqual(worstGapUnderStraightedge(flat, span: .feet(6)).nanometres, 0)
    }

    func testMeasuresAHollowAsTheDropBelowTheStraightedge() {
        let dip = [sample(0, 0), sample(12, 0), sample(24, 0), sample(36, -125),
                   sample(48, 0), sample(60, 0), sample(72, 0)]
        // Verified: a 1/8 in dip mid-span reads as exactly 1/8 in.
        XCTAssertEqual(worstGapUnderStraightedge(dip, span: .feet(6)).nanometres,
                       Length.inches(0, 1, 8).nanometres)
    }

    /// The intuitive wrong answer this test exists to rule out.
    ///
    /// A straightedge rests ON a hump and see-saws, so the deepest gap is at the
    /// quarter points - 125 x 24/36 = 83.33 thousandths - not the hump's full
    /// height. Verified: 2,116,667 nm.
    func testPivotsOnAHumpRatherThanReadingItAsADip() {
        let hump = [sample(0, 0), sample(12, 0), sample(24, 0), sample(36, 125),
                    sample(48, 0), sample(60, 0), sample(72, 0)]
        let gap = worstGapUnderStraightedge(hump, span: .feet(6))
        XCTAssertEqual(gap.nanometres, 2_116_667)
        XCTAssertNotEqual(gap.nanometres, Length.inches(0, 1, 8).nanometres)
    }

    func testFindsADipOnlyWhenTheSpanBridgesIt() {
        let dip = [sample(0, 0), sample(24, -125), sample(48, 0)]
        XCTAssertEqual(worstGapUnderStraightedge(dip, span: .feet(6)).nanometres,
                       Length.inches(0, 1, 8).nanometres)
        // A 1 ft edge never bridges samples 24 in apart, so it reads nothing.
        XCTAssertEqual(worstGapUnderStraightedge(dip, span: .feet(1)).nanometres, 0)
    }

    func testReportsTheDeepestWindowNotTheFirst() {
        let two = [sample(0, 0), sample(12, -63), sample(24, 0),
                   sample(36, 0), sample(48, -250), sample(60, 0)]
        XCTAssertEqual(worstGapUnderStraightedge(two, span: .feet(6)).nanometres,
                       250 * Length.nmPerInch / 1000)
    }

    func testATiltedButPlanarFloorHasNoGap() {
        let tilted = [0, 12, 24, 36, 48, 60, 72].map { sample($0, $0 * 10) }
        XCTAssertEqual(worstGapUnderStraightedge(tilted, span: .feet(6)).nanometres, 0)
    }
}

final class ReportTests: XCTestCase {

    private func minimalReport(photos: [Report.Photo] = []) -> Report {
        Report(title: "T", subtitle: "S", facts: [("A", "B")],
               notices: [.init(kind: .warning, heading: "Careful.", body: "Read this.")],
               sections: [.init(heading: "Sec",
                                tables: [.init(columns: ["C"], rows: [[.mark(.measured)]])],
                                photos: photos)],
               footer: "F")
    }

    /// The ten-year promise, tested rather than asserted.
    func testFetchesNothingAtViewTime() throws {
        let html = try ReportRenderer.render(minimalReport())
        XCTAssertFalse(html.contains("<script"))
        XCTAssertFalse(html.contains("@import"))
        XCTAssertFalse(html.contains("http://"))
        XCTAssertFalse(html.contains("https://"))
    }

    func testRefusesAPhotoThatIsAURL() {
        let bad = Report.Photo(caption: "remote", base64: "https://example.com/p.jpg")
        XCTAssertThrowsError(try ReportRenderer.render(minimalReport(photos: [bad])))
    }

    func testEscapesTextWithoutManglingTheQuotesInAMeasurement() {
        XCTAssertEqual(ReportRenderer.escapeText("<>&\"'"), "&lt;&gt;&amp;\"'")
        XCTAssertEqual(ReportRenderer.escapeAttribute("<>&\"'"), "&lt;&gt;&amp;&quot;&#39;")
    }

    func testNeverRoundsATinyToleranceDownToZero() {
        XCTAssertEqual(ReportRenderer.formatTolerance(Length(nanometres: 1)), "&lt; 1/32\"")
        XCTAssertEqual(ReportRenderer.formatTolerance(.zero), "0\"")
        XCTAssertEqual(ReportRenderer.formatTolerance(Length.inches(0, 1, 2)), "1/2\"")
    }
}

final class AreaTests: XCTestCase {

    func testSquareFeetRoundTripExactlyForWholeNumbers() {
        XCTAssertEqual(Area.squareFeet(200).squareMillimetres, 18_580_600)
        XCTAssertEqual(Area.squareFeet(200).squareFeetValue, 200, accuracy: 1e-9)
        XCTAssertEqual(Area.squareFeet(1000).squareFeetValue, 1000, accuracy: 1e-9)
    }

    /// A length times a length is an area - and the type system now says so,
    /// which is why `FloorSurvey.area` can no longer be given a `Length`.
    func testAProductOfTwoLengthsAgreesWithTheDirectConstruction() {
        let fromLengths = Area.of(.feet(10), by: .feet(20))   // 200 sq ft
        let direct = Area.squareFeet(200)
        // Millimetre truncation on each side makes these differ by a few mm2.
        XCTAssertEqual(fromLengths.squareFeetValue, direct.squareFeetValue, accuracy: 0.001)
    }

    func testFormatsForATakeoff() {
        XCTAssertEqual(Area.squareFeet(16.6639).formattedSquareFeet, "16.7 sq ft")
    }

    func testAddsAndSubtracts() {
        XCTAssertEqual((Area.squareFeet(10) + Area.squareFeet(5)).squareFeetValue,
                       15, accuracy: 1e-9)
        XCTAssertEqual((Area.squareFeet(10) - Area.squareFeet(4)).squareFeetValue,
                       6, accuracy: 1e-9)
        XCTAssertLessThan(Area.squareFeet(1), Area.squareFeet(2))
    }
}
