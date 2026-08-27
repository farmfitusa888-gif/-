import Foundation
import MeasureKit

public enum SurveyReportBuilder {

    public static func report(for survey: Survey, quote: Quote? = nil) -> Report {
        var notices: [Report.Notice] = []

        if !survey.unverifiedBarriers.isEmpty {
            notices.append(.init(
                kind: .refusal,
                heading: "This survey cannot be issued as evidence.",
                body: """
                \(survey.unverifiedBarriers.count) barrier(s) rest on a scanned value that \
                no tape confirmed. Measure them and re-issue. A barrier called out on an \
                unverified number will not survive being challenged.
                """))
        }
        if !survey.notMeasured.isEmpty {
            notices.append(.init(
                kind: .warning,
                heading: "\(survey.notMeasured.count) checkpoint(s) could not be measured.",
                body: "Each is listed below with the reason. None is recorded as compliant."))
        }
        if !survey.slopeDisagreements.isEmpty {
            notices.append(.init(
                kind: .warning,
                heading: "Slope readings disagreed.",
                body: """
                On \(survey.slopeDisagreements.count) surface(s) the inertial reading and the \
                scan geometry differed by more than half a degree. Those surfaces were \
                re-checked with a level, or they are flagged here so they can be.
                """))
        }

        var facts: [(String, String)] = [
            ("Site", survey.siteName), ("Address", survey.address),
            ("Surveyed", survey.surveyedOn), ("Surveyor", survey.surveyorName),
        ]
        if let c = survey.credential { facts.append(("Credential", c)) }
        facts.append(("Against", "\(survey.standard.name) (\(survey.standard.edition))"))

        var sections: [Report.Section] = [
            .init(heading: "Barriers found",
                  summary: survey.barriers.isEmpty
                      ? "No barriers were found at the checkpoints surveyed."
                      : "\(survey.barriers.count) barrier(s). Each shows what was found, "
                        + "what is required, and how the number was obtained.",
                  tables: survey.barriers.isEmpty ? [] : [.init(
                      columns: ["Location", "Requirement", "Found", "Required", "How measured"],
                      rows: survey.barriers.map { b in
                          [.text(b.location), .text(b.checkpoint.text),
                           .text(b.found), .text(b.required), .mark(b.provenance)]
                      })]),
        ]

        if !survey.notMeasured.isEmpty {
            sections.append(.init(
                heading: "Not measured",
                summary: "Recorded rather than omitted. None of these is a pass.",
                tables: [.init(
                    columns: ["Location", "Checkpoint", "Why not"],
                    rows: survey.notMeasured.map { o in
                        guard case let .notMeasured(reason) = o.finding else { return [] }
                        return [.text(o.location), .text(o.checkpoint.clause), .text(reason)]
                    })]))
        }

        sections.append(.init(
            heading: "Everything checked",
            tables: [.init(
                columns: ["Location", "Clause", "Checkpoint", "Result", "How measured"],
                rows: survey.observations.map { o in
                    [.text(o.location), .text(o.checkpoint.clause), .text(o.checkpoint.text),
                     .text(o.finding.isBarrier ? "Barrier" : "Compliant"),
                     .mark(o.finding.provenance)]
                })]))

        if let quote, !quote.lines.isEmpty {
            sections.append(.init(
                heading: "Remediation plan",
                summary: quote.isIssuable
                    ? "Total \(quote.subtotal.formatted). Phased worst-first."
                    : "NOT ISSUABLE - some lines rest on unverified quantities.",
                tables: [.init(
                    columns: ["Work", "Qty", "Unit", "Basis", "Cost"],
                    rows: quote.lines.map { l in
                        [.text(l.item.description), .text(String(format: "%.2f", l.quantity)),
                         .text(l.item.unit.label), .mark(l.provenance), .money(l.total)]
                    })]))
        }

        return Report(
            title: "Accessibility barrier survey",
            subtitle: "\(survey.siteName) - \(survey.surveyedOn)",
            facts: facts, notices: notices, sections: sections,
            footer: """
                This survey records measurements and compares them to published thresholds. \
                It is not a legal opinion and does not certify compliance. Every figure shows \
                how it was obtained. This file is self-contained and opens without an internet \
                connection.
                """)
    }

    public static func render(_ survey: Survey, quote: Quote? = nil) throws -> String {
        try ReportRenderer.render(report(for: survey, quote: quote))
    }
}
