import XCTest
import MeasureKit
@testable import PlumbCore

private let doorway = CheckpointLibrary.ada2010.first { $0.id == "404.2.3" }!
private let ramp = CheckpointLibrary.ada2010.first { $0.id == "405.2" }!
private let grabBar = CheckpointLibrary.ada2010.first { $0.id == "604.5" }!

final class EvaluatorTests: XCTestCase {

    func testAMinimumIsExactAtItsBoundary() {
        // 32" doorway: exactly 32 passes, one nanometre under fails.
        XCTAssertFalse(Evaluator.evaluate(doorway,
            measured: Provenanced(.inches(32), .measured)).isBarrier)
        XCTAssertTrue(Evaluator.evaluate(doorway,
            measured: Provenanced(Length(nanometres: 32 * Length.nmPerInch - 1), .measured))
            .isBarrier)
    }

    func testARangeIsExactAtBothEnds() {
        // Grab bar: 33"-36" inclusive.
        for v in [Length.inches(33), .inches(34), .inches(36)] {
            XCTAssertFalse(Evaluator.evaluate(grabBar, measured: Provenanced(v, .measured))
                .isBarrier, "\(v.formatted()) should be compliant")
        }
        XCTAssertTrue(Evaluator.evaluate(grabBar,
            measured: Provenanced(Length(nanometres: 33 * Length.nmPerInch - 1), .measured))
            .isBarrier)
        XCTAssertTrue(Evaluator.evaluate(grabBar,
            measured: Provenanced(Length(nanometres: 36 * Length.nmPerInch + 1), .measured))
            .isBarrier)
    }

    func testASlopeCheckpointRefusesALengthAndViceVersa() {
        if case .notMeasured = Evaluator.evaluate(ramp,
            measured: Provenanced(.inches(10), .measured)) {} else {
            XCTFail("a slope checkpoint must not accept a length")
        }
        let slope = CrossCheckedSlope(fromInertial: Slope(rise: .inches(1), run: .inches(12)),
                                      fromGeometry: Slope(rise: .inches(1), run: .inches(12)))
        if case .notMeasured = Evaluator.evaluate(doorway, slope: slope) {} else {
            XCTFail("a length checkpoint must not accept a slope")
        }
    }

    func testRampSlopeIsExactAtOneInTwelve() {
        func check(rise: Length, run: Length) -> Bool {
            let s = Slope(rise: rise, run: run)
            return Evaluator.evaluate(ramp,
                slope: CrossCheckedSlope(fromInertial: s, fromGeometry: s)).isBarrier
        }
        XCTAssertFalse(check(rise: .inches(1), run: .inches(12)))
        XCTAssertTrue(check(rise: Length(nanometres: Length.nmPerInch + 1), run: .inches(12)))
        // 30 ft of run allows 30 in of rise.
        XCTAssertFalse(check(rise: .inches(30), run: .feet(30)))
        XCTAssertTrue(check(rise: .inches(31), run: .feet(30)))
    }

    /// The conservative rule: report the steeper of two disagreeing readings.
    func testReportsTheSteeperOfTwoDisagreeingSlopeReadings() {
        let steep = Slope(rise: .inches(2), run: .inches(12))   // 1:6, a barrier
        let gentle = Slope(rise: .inches(1), run: .inches(20))  // 1:20, compliant
        let checked = CrossCheckedSlope(fromInertial: gentle, fromGeometry: steep)
        XCTAssertTrue(Evaluator.evaluate(ramp, slope: checked).isBarrier,
                      "the steeper reading must win")
        XCTAssertTrue(checked.disagrees())
    }
}

final class SurveyTests: XCTestCase {

    private func survey(_ observations: [Observation]) -> Survey {
        Survey(siteName: "Corner Store", address: "2 Main St", surveyedOn: "2026-08-27",
               surveyorName: "S. Surveyor", credential: "CASp-000",
               standard: .ada2010, observations: observations)
    }

    private func observation(_ id: String, _ value: Length, _ p: Provenance) -> Observation {
        Observation(id: id, checkpoint: doorway, location: "Front door",
                    finding: Evaluator.evaluate(doorway, measured: Provenanced(value, p)))
    }

    func testCollectsBarriersWithWhatWasFoundAndWhatIsRequired() {
        let s = survey([observation("o1", .inches(30), .measured)])
        XCTAssertEqual(s.barriers.count, 1)
        XCTAssertEqual(s.barriers[0].found, "2' 6\"")
        XCTAssertTrue(s.barriers[0].required.contains("at least"))
    }

    /// The central refusal of the product.
    func testWillNotIssueASurveyWhoseBarrierRestsOnAScannedNumber() {
        let scanned = survey([observation("o1", .inches(30), .scanned)])
        XCTAssertFalse(scanned.isIssuable)
        XCTAssertEqual(scanned.unverifiedBarriers.count, 1)

        let measured = survey([observation("o1", .inches(30), .measured)])
        XCTAssertTrue(measured.isIssuable)
    }

    func testACompliantScannedValueDoesNotBlockIssue() {
        // Only BARRIERS need a tape - a compliant scan calls out nobody.
        let s = survey([observation("o1", .inches(36), .scanned)])
        XCTAssertTrue(s.barriers.isEmpty)
        XCTAssertTrue(s.isIssuable)
    }

    func testAnEmptySurveyIsNotIssuable() {
        XCTAssertFalse(survey([]).isIssuable)
    }

    func testRecordsWhatCouldNotBeMeasuredRatherThanOmittingIt() {
        let s = survey([Observation(id: "o1", checkpoint: doorway, location: "Rear door",
                                    finding: .notMeasured(reason: "blocked by stock"))])
        XCTAssertEqual(s.notMeasured.count, 1)
        XCTAssertTrue(s.barriers.isEmpty, "not measured is not a barrier")
    }
}

final class PlumbReportTests: XCTestCase {

    private func render(_ observations: [Observation], quote: Quote? = nil) throws -> String {
        try SurveyReportBuilder.render(
            Survey(siteName: "S", address: "A", surveyedOn: "2026-08-27",
                   surveyorName: "N", standard: .ada2010, observations: observations),
            quote: quote)
    }

    func testRefusesLoudlyWhenABarrierIsUnverified() throws {
        let o = Observation(id: "o1", checkpoint: doorway, location: "Door",
                            finding: Evaluator.evaluate(doorway,
                                measured: Provenanced(.inches(30), .scanned)))
        let html = try render([o])
        XCTAssertTrue(html.contains("cannot be issued as evidence"))
        XCTAssertTrue(html.contains("no tape confirmed"))
    }

    func testStatesItIsNotALegalOpinion() throws {
        let o = Observation(id: "o1", checkpoint: doorway, location: "Door",
                            finding: Evaluator.evaluate(doorway,
                                measured: Provenanced(.inches(36), .measured)))
        let html = try render([o])
        XCTAssertTrue(html.contains("not a legal opinion"))
        XCTAssertTrue(html.contains("does not certify compliance"))
    }

    func testPrintsTheStandardEditionThatGovernedIt() throws {
        let o = Observation(id: "o1", checkpoint: doorway, location: "Door",
                            finding: Evaluator.evaluate(doorway,
                                measured: Provenanced(.inches(36), .measured)))
        XCTAssertTrue(try render([o]).contains("2010"))
    }

    func testFlagsSlopeDisagreement() throws {
        let steep = Slope(rise: .inches(2), run: .inches(12))
        let gentle = Slope(rise: .inches(1), run: .inches(40))
        let checked = CrossCheckedSlope(fromInertial: gentle, fromGeometry: steep,
                                        provenance: .measured)
        let o = Observation(id: "o1", checkpoint: ramp, location: "Ramp",
                            finding: Evaluator.evaluate(ramp, slope: checked))
        XCTAssertTrue(try render([o]).contains("Slope readings disagreed."))
    }

    func testFetchesNothingAtViewTime() throws {
        let o = Observation(id: "o1", checkpoint: doorway, location: "D",
                            finding: Evaluator.evaluate(doorway,
                                measured: Provenanced(.inches(36), .measured)))
        let html = try render([o])
        XCTAssertFalse(html.contains("<script"))
        XCTAssertFalse(html.contains("https://"))
    }
}

final class CheckpointLibraryTests: XCTestCase {

    func testEveryCheckpointHasACitationAndASummary() {
        for c in CheckpointLibrary.ada2010 {
            XCTAssertFalse(c.citation.isEmpty)
            XCTAssertFalse(c.requirement.summary.isEmpty)
            XCTAssertFalse(c.text.isEmpty)
        }
    }

    func testFiltersByArea() {
        let parking = CheckpointLibrary.checkpoints(for: .parking)
        XCTAssertFalse(parking.isEmpty)
        XCTAssertTrue(parking.allSatisfy { $0.area == .parking })
    }

    func testCheckpointIDsAreUnique() {
        let ids = CheckpointLibrary.ada2010.map(\.id)
        XCTAssertEqual(Set(ids).count, ids.count, "duplicate checkpoint id")
    }
}
