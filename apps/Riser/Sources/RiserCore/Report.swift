import Foundation
import MeasureKit

public struct Building: Sendable {
    public var name: String
    public var address: String
    public var devices: [Device]
    public init(name: String, address: String, devices: [Device]) {
        self.name = name; self.address = address; self.devices = devices
    }
}

public struct Inspection: Sendable {
    public var building: Building
    /// Supplied, never `Date()`, so a report is reproducible and testable.
    public var performedOn: String
    public var inspectorName: String
    public var licenceNumber: String?
    public var results: [CheckResult]

    public init(building: Building, performedOn: String, inspectorName: String,
                licenceNumber: String? = nil, results: [CheckResult]) {
        self.building = building; self.performedOn = performedOn
        self.inspectorName = inspectorName; self.licenceNumber = licenceNumber
        self.results = results
    }

    public var failures: [CheckResult] { results.filter { $0.answer.isFailure } }

    public var unverified: [CheckResult] {
        results.filter { if case .notVerified = $0.answer { return true }; return false }
    }

    /// Every checkpoint has an answer, and none is blank.
    ///
    /// A report is not complete because the inspector stopped typing; it is
    /// complete because every question was answered, including with "I could not
    /// check this".
    public func unanswered(against expected: [String]) -> [String] {
        let answered = Set(results.map(\.id))
        return expected.filter { !answered.contains($0) }
    }

    public var isComplete: Bool { !results.isEmpty }

    /// Editions actually cited, so the report can print what governed it.
    public var editionsCited: [String] {
        Array(Set(results.map { "\($0.checkpoint.standard) \($0.checkpoint.edition)" })).sorted()
    }
}

/// A deficiency, priced.
public struct Deficiency: Sendable, Identifiable {
    public var id: String
    public var deviceID: String
    public var severity: Severity
    public var description: String
    public var citation: String
    public var repair: QuoteLine?

    public init(id: String, deviceID: String, severity: Severity,
                description: String, citation: String, repair: QuoteLine? = nil) {
        self.id = id; self.deviceID = deviceID; self.severity = severity
        self.description = description; self.citation = citation; self.repair = repair
    }
}

public enum DeficiencyBuilder {
    /// Turn failures into deficiencies, worst first.
    public static func from(_ inspection: Inspection) -> [Deficiency] {
        inspection.failures.compactMap { r in
            guard case let .fail(severity, note) = r.answer else { return nil }
            return Deficiency(id: r.id, deviceID: r.deviceID, severity: severity,
                              description: note.isEmpty ? r.checkpoint.text : note,
                              citation: r.checkpoint.citation)
        }.sorted { $0.severity < $1.severity }
    }
}

public enum ReportBuilder {

    public static func report(for inspection: Inspection,
                              deficiencies: [Deficiency],
                              quote: Quote?) -> Report {
        var notices: [Report.Notice] = []

        if !inspection.unverified.isEmpty {
            notices.append(.init(
                kind: .refusal,
                heading: "\(inspection.unverified.count) item(s) could not be verified.",
                body: """
                They are listed in full below with the reason each one could not be \
                checked. They are NOT passes, and this report does not claim they are.
                """))
        }
        if deficiencies.contains(where: { $0.severity == .critical }) {
            notices.append(.init(
                kind: .warning,
                heading: "Critical deficiencies found.",
                body: "This system has critical deficiencies. They are listed first below.")
            )
        }

        var facts: [(String, String)] = [
            ("Building", inspection.building.name),
            ("Address", inspection.building.address),
            ("Inspected", inspection.performedOn),
            ("Inspector", inspection.inspectorName),
        ]
        if let l = inspection.licenceNumber { facts.append(("Licence", l)) }
        facts.append(("Against", inspection.editionsCited.joined(separator: ", ")))

        var sections: [Report.Section] = []

        if !deficiencies.isEmpty {
            sections.append(.init(
                heading: "Deficiencies",
                summary: "Worst first.",
                tables: [.init(
                    columns: ["Device", "Severity", "What is wrong", "Reference"],
                    rows: deficiencies.map { d in
                        [.text(d.deviceID), .text(d.severity.label),
                         .text(d.description), .text(d.citation)]
                    })]))
        }

        if !inspection.unverified.isEmpty {
            sections.append(.init(
                heading: "Not verified",
                summary: "These were not checked, and the reason is recorded for each. "
                    + "Treat none of them as a pass.",
                tables: [.init(
                    columns: ["Device", "Checkpoint", "Why not", "Note", "Status"],
                    rows: inspection.unverified.map { r in
                        guard case let .notVerified(reason, note) = r.answer else { return [] }
                        return [.text(r.deviceID), .text(r.checkpoint.clause),
                                .text(reason.label), .text(note), .mark(.scanned)]
                    })]))
        }

        sections.append(.init(
            heading: "Full results",
            tables: [.init(
                columns: ["Device", "Clause", "Requirement", "Result"],
                rows: inspection.results.map { r in
                    [.text(r.deviceID), .text(r.checkpoint.clause),
                     .text(r.checkpoint.text), .mark(r.answer.provenance)]
                })]))

        if let quote, !quote.lines.isEmpty {
            sections.append(.init(
                heading: "Proposed repairs",
                summary: quote.isIssuable
                    ? "Total \(quote.subtotal.formatted)."
                    : "NOT ISSUABLE - some lines rest on unverified quantities.",
                tables: [.init(
                    columns: ["Item", "Qty", "Unit", "Basis", "Total"],
                    rows: quote.lines.map { l in
                        [.text(l.item.description), .text(String(format: "%.2f", l.quantity)),
                         .text(l.item.unit.label), .mark(l.provenance), .money(l.total)]
                    })]))
        }

        return Report(
            title: "Fire and life-safety inspection",
            subtitle: "\(inspection.building.name) - \(inspection.performedOn)",
            facts: facts,
            notices: notices,
            sections: sections,
            footer: """
                This report states what was tested and what was not. Items marked "not \
                verified" were not inspected and carry the reason why. This file is \
                self-contained and needs no internet connection to open.
                """)
    }

    public static func render(_ inspection: Inspection,
                              deficiencies: [Deficiency],
                              quote: Quote? = nil) throws -> String {
        try ReportRenderer.render(report(for: inspection, deficiencies: deficiencies, quote: quote))
    }
}
