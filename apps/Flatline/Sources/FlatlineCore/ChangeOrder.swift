import Foundation
import MeasureKit

public enum ChangeOrderBuilder {

    public static func report(for survey: FloorSurvey, quote: Quote?,
                              installerName: String, jobAddress: String,
                              preparedOn: String) -> Report {
        var notices: [Report.Notice] = [
            .init(kind: .refusal, heading: "Not an ASTM E1155 test.", body: E1155.refusal),
        ]

        if !survey.unverified.isEmpty {
            notices.append(.init(
                kind: .warning,
                heading: "\(survey.unverified.count) suspect location(s) still need a straightedge.",
                body: """
                They are ranked below. Until a person measures them, the figures beside \
                them are the scan's guess and are marked as such.
                """))
        }
        if !survey.isIssuable {
            notices.append(.init(
                kind: .refusal,
                heading: "This change order cannot be issued yet.",
                body: """
                One or more failing locations rest on a scanned value. Put a real \
                straightedge on them, type what you read, and re-issue.
                """))
        }

        var sections: [Report.Section] = [
            .init(heading: "Where to put the straightedge",
                  summary: "Ranked by how bad the scan thinks it is. "
                      + "The scan does not decide - it just tells you where to look.",
                  tables: [.init(
                      columns: ["#", "Along the line", "Scan says", "You measured", "Basis"],
                      rows: survey.suspects.enumerated().map { i, s in
                          [.text("\(i + 1)"), .length(s.along),
                           .tolerance(s.scannedGap.value),
                           s.measuredGap.map { Report.Cell.length($0) } ?? .text("not yet"),
                           .mark(s.gap.provenance)]
                      })]),
        ]

        if !survey.failing.isEmpty {
            sections.append(.init(
                heading: "Out of tolerance",
                summary: "Against \(survey.tolerance.summary) (\(survey.tolerance.source)).",
                tables: [.init(
                    columns: ["Along the line", "Gap", "Allowed", "Basis"],
                    rows: survey.failing.map { s in
                        [.length(s.along), .length(s.gap.value),
                         .length(survey.tolerance.gap), .mark(s.gap.provenance)]
                    })]))
        }

        if let quote, !quote.lines.isEmpty {
            sections.append(.init(
                heading: "Floor preparation",
                summary: quote.isIssuable
                    ? "Total \(quote.subtotal.formatted)."
                    : "NOT ISSUABLE - some lines rest on unverified quantities.",
                tables: [.init(
                    columns: ["Work", "Qty", "Unit", "Basis", "Cost"],
                    rows: quote.lines.map { l in
                        [.text(l.item.description), .text(String(format: "%.2f", l.quantity)),
                         .text(l.item.unit.label), .mark(l.provenance), .money(l.total)]
                    })]))
        }

        return Report(
            title: "Floor preparation - change order",
            subtitle: "\(survey.roomName) - \(preparedOn)",
            facts: [("Job", jobAddress), ("Prepared by", installerName),
                    ("Date", preparedOn), ("Tolerance", survey.tolerance.summary)],
            notices: notices, sections: sections,
            footer: """
                Quantities are estimates with a stated waste factor, not exact counts. \
                This document records the condition of the subfloor on the date above. \
                It is self-contained and opens without an internet connection.
                """)
    }

    public static func render(_ survey: FloorSurvey, quote: Quote?, installerName: String,
                              jobAddress: String, preparedOn: String) throws -> String {
        try ReportRenderer.render(report(for: survey, quote: quote,
                                         installerName: installerName,
                                         jobAddress: jobAddress, preparedOn: preparedOn))
    }
}
