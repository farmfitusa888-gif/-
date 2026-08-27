import Foundation
import MeasureKit

public struct Room: Sendable, Identifiable {
    public var id: String
    public var name: String
    public var runs: [Run]
    public var photos: [Report.Photo]

    public init(id: String, name: String, runs: [Run], photos: [Report.Photo] = []) {
        self.id = id; self.name = name; self.runs = runs; self.photos = photos
    }
}

public struct Job: Sendable {
    public var propertyAddress: String
    /// Supplied by the caller, never `Date()`, so a record is reproducible.
    public var capturedOn: String
    public var contractorName: String
    public var homeownerName: String?
    public var rooms: [Room]

    public init(propertyAddress: String, capturedOn: String, contractorName: String,
                homeownerName: String? = nil, rooms: [Room]) {
        self.propertyAddress = propertyAddress; self.capturedOn = capturedOn
        self.contractorName = contractorName; self.homeownerName = homeownerName
        self.rooms = rooms
    }
}

public enum RecordBuilder {

    /// The safety notice is not optional and not configurable.
    ///
    /// Somebody will cut into a wall holding this document. Everything else in
    /// the product is a convenience; this paragraph is the reason it is
    /// defensible to ship at all.
    public static let cuttingWarning = Report.Notice(
        kind: .warning,
        heading: "Read this before cutting into any wall.",
        body: """
        This is a record, not a locator. It describes what was visible on the date \
        above; later work may have changed it. Positions marked "inferred" were never \
        directly seen, and every position carries a margin of error. Always scan the \
        wall immediately before you cut, every time. This document does not replace that.
        """)

    public static func report(for job: Job) -> Report {
        var facts: [(String, String)] = [
            ("Property", job.propertyAddress),
            ("Recorded", job.capturedOn),
            ("Recorded by", job.contractorName),
        ]
        if let owner = job.homeownerName { facts.append(("Prepared for", owner)) }

        var notices = [cuttingWarning]
        if job.rooms.contains(where: { $0.runs.contains(where: { $0.inferredLength > .zero }) }) {
            notices.append(.init(
                kind: .refusal,
                heading: "Some of this was inferred.",
                body: """
                Parts of one or more runs were never directly seen - they were reasoned \
                between two points that were. Those spans are marked, and they are the \
                ones to be most careful of.
                """))
        }

        return Report(
            title: "What's behind these walls",
            subtitle: "A record of the services inside the walls of this property, "
                + "made while they were open.",
            facts: facts,
            notices: notices,
            sections: job.rooms.map(section) + [legend],
            footer: """
                This file is self-contained. It needs no app, no login and no internet \
                connection, and it will keep working if the company that made it does not. \
                Keep a copy with the deeds.
                """)
    }

    static func section(for room: Room) -> Report.Section {
        Report.Section(
            heading: room.name,
            tables: room.runs.map(table),
            photos: room.photos)
    }

    static func table(for run: Run) -> Report.Table {
        var caption = "\(run.label) - \(run.service.label). Total \(run.totalLength.formatted())"
        if run.inferredLength > .zero {
            caption += ", of which \(run.inferredLength.formatted()) was inferred"
        }
        if run.service.isHazardous { caption += " - HAZARDOUS SERVICE" }

        return Report.Table(
            caption: caption,
            columns: ["Point", "X", "Y", "Z (height)", "How it is known",
                      "Ray disagreement", "Note"],
            rows: run.points.map { p in
                [.text(p.id), .length(p.position.x), .length(p.position.y),
                 .length(p.position.z), .mark(p.provenance),
                 p.tolerance.map { Report.Cell.tolerance($0) } ?? .text("—"),
                 .text(p.note ?? "")]
            })
    }

    static var legend: Report.Section {
        Report.Section(
            heading: "How to read this",
            summary: "Positions are given from the room's origin corner: X along the wall, "
                + "Y into the room, Z as height above the finished floor.",
            tables: [.init(
                columns: ["Mark", "Means"],
                rows: [
                    [.mark(.triangulated),
                     .text("Seen in two or more photographs and computed from them. "
                           + "A sensor result, with its error shown.")],
                    [.mark(.measured),
                     .text("Somebody put a tape on it. The most reliable figure here.")],
                    [.mark(.derived),
                     .text("Inferred between two known points and never directly seen. "
                           + "Treat with the most caution.")],
                    [.mark(.adjusted),
                     .text("Moved when a later tape measurement corrected the geometry.")],
                ])])
    }

    public static func render(_ job: Job) throws -> String {
        try ReportRenderer.render(report(for: job))
    }
}
