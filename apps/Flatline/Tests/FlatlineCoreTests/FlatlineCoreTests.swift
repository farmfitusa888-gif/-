import XCTest
import MeasureKit
@testable import FlatlineCore

private func sample(_ posInches: Int, _ thou: Int) -> SurfaceSample {
    SurfaceSample(position: .inches(Double(posInches)),
                  height: Length(nanometres: Int64(thou) * Length.nmPerInch / 1000))
}

final class ToleranceTests: XCTestCase {

    func testTolerancesAreHeldInTheirOwnTerms() {
        XCTAssertEqual(FlatnessTolerance.lvpSixFoot.summary, "1/8\" over 6'")
        XCTAssertEqual(FlatnessTolerance.tenFoot.summary, "3/16\" over 10'")
    }

    func testEveryToleranceSaysWhereItCameFrom() {
        for t in FlatnessTolerance.all { XCTAssertFalse(t.source.isEmpty) }
    }

    /// The refusal must be present and must say the words.
    func testTheE1155RefusalIsExplicit() {
        XCTAssertTrue(E1155.refusal.contains("NOT an ASTM E1155 test"))
        XCTAssertTrue(E1155.refusal.contains("no FF or FL number"))
    }
}

final class FloorSurveyTests: XCTestCase {

    private func survey(_ suspects: [Suspect],
                        samples: [SurfaceSample] = []) -> FloorSurvey {
        FloorSurvey(roomName: "Kitchen", tolerance: .lvpSixFoot,
                    samples: samples, suspects: suspects, area: .squareFeet(200))
    }

    /// Verified against the reference implementation: a 1/8 in dip mid-span
    /// reads as exactly 1/8 in under a 6 ft straightedge.
    func testWorstScannedGapUsesTheStraightedgeModel() {
        let dip = [sample(0, 0), sample(12, 0), sample(24, 0), sample(36, -125),
                   sample(48, 0), sample(60, 0), sample(72, 0)]
        let s = survey([], samples: dip)
        XCTAssertEqual(s.worstScannedGap.nanometres, Length.inches(0, 1, 8).nanometres)
    }

    func testACarryListRanksTheWorstFirstAndDropsMeasuredOnes() {
        let s = survey([
            Suspect(id: "a", along: .feet(2), scannedGap: .inches(0, 1, 16)),
            Suspect(id: "b", along: .feet(8), scannedGap: .inches(0, 1, 4)),
            Suspect(id: "c", along: .feet(14), scannedGap: .inches(0, 1, 8)),
            Suspect(id: "d", along: .feet(20), scannedGap: .inches(0, 1, 2),
                    measuredGap: .inches(0, 1, 2)),   // already done
        ])
        XCTAssertEqual(s.carryList().map(\.id), ["b", "c", "a"])
    }

    func testAMeasuredGapOverridesTheScan() {
        var s = Suspect(id: "a", along: .feet(2), scannedGap: .inches(0, 1, 4))
        XCTAssertEqual(s.gap.provenance, .scanned)
        s.measuredGap = .inches(0, 1, 16)
        XCTAssertEqual(s.gap.provenance, .measured)
        XCTAssertEqual(s.gap.value.nanometres, Length.inches(0, 1, 16).nanometres)
        XCTAssertFalse(s.exceeds(.lvpSixFoot), "the person's number decides, not the scan")
    }

    /// The central refusal.
    func testWillNotIssueWhileAFailingLocationRestsOnAScan() {
        let scanned = survey([Suspect(id: "a", along: .feet(2), scannedGap: .inches(0, 1, 4))])
        XCTAssertFalse(scanned.isIssuable)

        let measured = survey([Suspect(id: "a", along: .feet(2),
                                       scannedGap: .inches(0, 1, 4),
                                       measuredGap: .inches(0, 1, 4))])
        XCTAssertTrue(measured.isIssuable)
    }

    func testAPassingScanDoesNotBlockIssue() {
        // Only FAILING locations need a straightedge; a compliant scan bills nobody.
        let s = survey([Suspect(id: "a", along: .feet(2), scannedGap: .inches(0, 1, 32))])
        XCTAssertTrue(s.failing.isEmpty)
        XCTAssertTrue(s.isIssuable)
    }

    func testAnEmptySurveyIsNotIssuable() {
        XCTAssertFalse(survey([]).isIssuable)
    }
}

final class LevellerTests: XCTestCase {

    func testMeanDepthIsHalfTheGapBecauseAHollowIsAWedge() {
        let failing = [
            Suspect(id: "a", along: .zero, scannedGap: .inches(0, 1, 4),
                    measuredGap: .inches(0, 1, 4)),
            Suspect(id: "b", along: .zero, scannedGap: .inches(0, 1, 4),
                    measuredGap: .inches(0, 1, 2)),
        ]
        // mean gap = 3/8", half of that = 3/16"
        XCTAssertEqual(Leveller.meanDepth(of: failing).nanometres,
                       Length.inches(0, 3, 16).nanometres)
    }

    func testBagsRoundUpBecauseArrivingShortStopsTheJob() {
        // 200 sq ft at 1/4 in deep, 40 sq ft per bag at 1 in => 160 sq-ft-inches
        // needed / 40 = 1.25 bags, +10% waste = 1.375 => 2 bags.
        let bags = Leveller.bags(area: .squareFeet(200), meanDepth: .inches(0, 1, 4),
                                 coverageSqFtPerBagAtOneInch: 40)
        XCTAssertEqual(bags, 2)
    }

    func testScalesWithDepth() {
        let shallow = Leveller.bags(area: .squareFeet(1000), meanDepth: .inches(0, 1, 8),
                                    coverageSqFtPerBagAtOneInch: 40, wasteFactor: 0)
        let deep = Leveller.bags(area: .squareFeet(1000), meanDepth: .inches(0, 1, 4),
                                 coverageSqFtPerBagAtOneInch: 40, wasteFactor: 0)
        XCTAssertEqual(shallow, 4)   // 1000 * 0.125 / 40 = 3.125 -> 4
        XCTAssertEqual(deep, 7)      // 1000 * 0.25  / 40 = 6.25  -> 7
    }

    func testReturnsZeroRatherThanDividingByZero() {
        XCTAssertEqual(Leveller.bags(area: Area.zero, meanDepth: .inches(1),
                                     coverageSqFtPerBagAtOneInch: 40), 0)
        XCTAssertEqual(Leveller.bags(area: .squareFeet(100), meanDepth: .zero,
                                     coverageSqFtPerBagAtOneInch: 40), 0)
        XCTAssertEqual(Leveller.bags(area: .squareFeet(100), meanDepth: .inches(1),
                                     coverageSqFtPerBagAtOneInch: 0), 0)
        XCTAssertEqual(Leveller.meanDepth(of: []).nanometres, 0)
    }
}

final class ChangeOrderTests: XCTestCase {

    private func render(_ suspects: [Suspect], quote: Quote? = nil) throws -> String {
        let s = FloorSurvey(roomName: "Kitchen", tolerance: .lvpSixFoot,
                            samples: [], suspects: suspects, area: .squareFeet(200))
        return try ChangeOrderBuilder.render(s, quote: quote, installerName: "I",
                                             jobAddress: "A", preparedOn: "2026-08-27")
    }

    func testAlwaysPrintsTheE1155Refusal() throws {
        let html = try render([Suspect(id: "a", along: .zero, scannedGap: .inches(0, 1, 32))])
        XCTAssertTrue(html.contains("Not an ASTM E1155 test."))
        XCTAssertTrue(html.contains("no FF or FL number"))
    }

    func testRefusesToIssueWhileAFailingLocationIsUnmeasured() throws {
        let html = try render([Suspect(id: "a", along: .zero, scannedGap: .inches(0, 1, 4))])
        XCTAssertTrue(html.contains("cannot be issued yet"))
        XCTAssertTrue(html.contains("still need a straightedge"))
    }

    func testSaysQuantitiesAreEstimates() throws {
        let html = try render([Suspect(id: "a", along: .zero, scannedGap: .inches(0, 1, 32))])
        XCTAssertTrue(html.contains("estimates with a stated waste factor, not exact counts"))
    }

    func testFetchesNothingAtViewTime() throws {
        let html = try render([Suspect(id: "a", along: .zero, scannedGap: .inches(0, 1, 32))])
        XCTAssertFalse(html.contains("<script"))
        XCTAssertFalse(html.contains("https://"))
    }
}
