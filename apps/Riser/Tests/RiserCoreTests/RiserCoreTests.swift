import XCTest
import MeasureKit
@testable import RiserCore

private func checkpoint(_ id: String, clause: String = "5.2.1.1",
                        freq: Frequency = .annual) -> Checkpoint {
    Checkpoint(id: id, standard: "NFPA 25", edition: "2023", clause: clause,
               text: "Sprinklers shall be free of corrosion, foreign materials and paint.",
               appliesTo: .sprinklerHead, frequency: freq)
}

final class AnswerTests: XCTestCase {

    /// The differentiator, enforced in the type system rather than the UI.
    func testNotVerifiedIsNeverAPass() {
        let a = Answer.notVerified(reason: .aboveHardCeiling, note: "hard lid, no access panel")
        XCTAssertFalse(a.isVerified)
        XCTAssertFalse(a.isFailure)
        XCTAssertEqual(a.provenance, .scanned)
        XCTAssertFalse(a.provenance.isIssuable,
                       "an unverified item must never support an issued claim")
    }

    func testAPassIsMeasuredAndIssuable() {
        XCTAssertTrue(Answer.pass.isVerified)
        XCTAssertTrue(Answer.pass.provenance.isIssuable)
    }

    func testSeverityOrdersCriticalFirst() {
        XCTAssertTrue(Severity.critical < Severity.impairment)
        XCTAssertTrue(Severity.impairment < Severity.nonCritical)
        XCTAssertTrue(Severity.nonCritical < Severity.advisory)
    }

    func testEveryNotVerifiedReasonHasALabel() {
        for r in NotVerifiedReason.allCases {
            XCTAssertFalse(r.label.isEmpty, "\(r) needs a label an adjuster can read")
        }
    }
}

final class InspectionTests: XCTestCase {

    private func inspection(results: [CheckResult]) -> Inspection {
        Inspection(building: Building(name: "Mill Building", address: "1 Mill St",
                                      devices: [Device(id: "SP-1", kind: .sprinklerHead,
                                                       location: "Riser room")]),
                   performedOn: "2026-08-27", inspectorName: "S. Inspector",
                   licenceNumber: "NICET-II-12345", results: results)
    }

    func testSeparatesFailuresFromUnverified() {
        let i = inspection(results: [
            CheckResult(deviceID: "SP-1", checkpoint: checkpoint("c1"),
                   answer: .fail(severity: .critical, note: "painted head")),
            CheckResult(deviceID: "SP-2", checkpoint: checkpoint("c2"),
                   answer: .notVerified(reason: .aboveHardCeiling, note: "")),
            CheckResult(deviceID: "SP-3", checkpoint: checkpoint("c3"), answer: .pass),
        ])
        XCTAssertEqual(i.failures.count, 1)
        XCTAssertEqual(i.unverified.count, 1)
    }

    func testReportsWhichCheckpointsWereNeverAnswered() {
        let i = inspection(results: [
            CheckResult(deviceID: "SP-1", checkpoint: checkpoint("c1"), answer: .pass),
        ])
        let missing = i.unanswered(against: ["SP-1/c1", "SP-1/c2", "SP-2/c1"])
        XCTAssertEqual(missing, ["SP-1/c2", "SP-2/c1"])
    }

    /// A report printed in 2032 must say which edition governed it in 2027.
    func testCitesTheEditionItWasRunAgainst() {
        let i = inspection(results: [
            CheckResult(deviceID: "SP-1", checkpoint: checkpoint("c1"), answer: .pass),
        ])
        XCTAssertEqual(i.editionsCited, ["NFPA 25 2023"])
    }

    func testOrdersDeficienciesWorstFirst() {
        let i = inspection(results: [
            CheckResult(deviceID: "A", checkpoint: checkpoint("c1"),
                   answer: .fail(severity: .advisory, note: "minor")),
            CheckResult(deviceID: "B", checkpoint: checkpoint("c2"),
                   answer: .fail(severity: .critical, note: "major")),
            CheckResult(deviceID: "C", checkpoint: checkpoint("c3"),
                   answer: .fail(severity: .nonCritical, note: "middling")),
        ])
        XCTAssertEqual(DeficiencyBuilder.from(i).map(\.deviceID), ["B", "C", "A"])
    }

    func testFallsBackToTheCheckpointTextWhenNoNoteWasWritten() {
        let i = inspection(results: [
            CheckResult(deviceID: "A", checkpoint: checkpoint("c1"),
                   answer: .fail(severity: .critical, note: "")),
        ])
        XCTAssertTrue(DeficiencyBuilder.from(i)[0].description.contains("corrosion"))
    }
}

final class RiserReportTests: XCTestCase {

    private func render(_ results: [CheckResult], quote: Quote? = nil) throws -> String {
        let i = Inspection(building: Building(name: "B", address: "A", devices: []),
                           performedOn: "2026-08-27", inspectorName: "I", results: results)
        return try ReportBuilder.render(i, deficiencies: DeficiencyBuilder.from(i), quote: quote)
    }

    func testPrintsUnverifiedItemsProminentlyRatherThanAbsorbingThem() throws {
        let html = try render([
            CheckResult(deviceID: "SP-9", checkpoint: checkpoint("c1"),
                   answer: .notVerified(reason: .tenantRefusedEntry, note: "unit 4B")),
        ])
        XCTAssertTrue(html.contains("could not be verified"))
        XCTAssertTrue(html.contains("Tenant refused entry"))
        XCTAssertTrue(html.contains("unit 4B"))
        XCTAssertTrue(html.contains("Treat none of them as a pass."))
    }

    func testWarnsWhenACriticalDeficiencyExists() throws {
        let html = try render([
            CheckResult(deviceID: "SP-1", checkpoint: checkpoint("c1"),
                   answer: .fail(severity: .critical, note: "painted head")),
        ])
        XCTAssertTrue(html.contains("Critical deficiencies found."))
    }

    func testMarksAQuoteThatRestsOnUnverifiedQuantities() throws {
        let item = PriceItem(code: "R1", description: "Replace head", unit: .each,
                             unitPrice: Money(cents: 8500))
        let bad = Quote(lines: [QuoteLine(item: item, quantityMilli: 1000, provenance: .scanned)])
        let html = try render([
            CheckResult(deviceID: "SP-1", checkpoint: checkpoint("c1"), answer: .pass),
        ], quote: bad)
        XCTAssertTrue(html.contains("NOT ISSUABLE"))

        let good = Quote(lines: [QuoteLine(item: item, quantityMilli: 1000, provenance: .measured)])
        let ok = try render([
            CheckResult(deviceID: "SP-1", checkpoint: checkpoint("c1"), answer: .pass),
        ], quote: good)
        XCTAssertFalse(ok.contains("NOT ISSUABLE"))
        XCTAssertTrue(ok.contains("$85.00"))
    }

    func testFetchesNothingAtViewTime() throws {
        let html = try render([CheckResult(deviceID: "A", checkpoint: checkpoint("c1"), answer: .pass)])
        XCTAssertFalse(html.contains("<script"))
        XCTAssertFalse(html.contains("https://"))
    }
}

final class ScheduleTests: XCTestCase {

    private func item(_ id: String, _ freq: Frequency, since: Int) -> DueItem {
        DueItem(id: id, buildingName: "B", deviceID: id, frequency: freq, monthsSinceLast: since)
    }

    func testComputesWhatIsDue() {
        XCTAssertEqual(item("a", .annual, since: 11).monthsUntilDue, 1)
        XCTAssertFalse(item("a", .annual, since: 11).isDueNow)
        XCTAssertTrue(item("a", .annual, since: 12).isDueNow)
        XCTAssertTrue(item("a", .annual, since: 13).isOverdue)
        XCTAssertFalse(item("a", .annual, since: 12).isOverdue, "due today is not yet overdue")
    }

    func testOrdersOverdueFirstThenSoonest() {
        let items = [
            item("c", .quarterly, since: 1),   // 2 months out
            item("a", .annual, since: 18),     // 6 months overdue
            item("b", .annual, since: 12),     // due now
        ]
        XCTAssertEqual(Schedule.upcoming(items, withinMonths: 6).map(\.deviceID),
                       ["a", "b", "c"])
        XCTAssertEqual(Schedule.overdue(items).map(\.deviceID), ["a"])
    }

    func testExcludesWhatIsBeyondTheWindow() {
        let items = [item("a", .fiveYear, since: 1), item("b", .quarterly, since: 1)]
        XCTAssertEqual(Schedule.upcoming(items, withinMonths: 6).map(\.deviceID), ["b"])
    }
}
