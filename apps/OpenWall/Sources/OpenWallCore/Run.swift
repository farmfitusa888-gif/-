import Foundation
import MeasureKit

/// What a run carries.
public enum Service: String, CaseIterable, Sendable, Codable {
    case coldWater, hotWater, waste, vent, gas
    case electrical, lowVoltage, hvacSupply, hvacReturn, structural, other

    public var label: String {
        switch self {
        case .coldWater: return "Cold water"
        case .hotWater: return "Hot water"
        case .waste: return "Waste"
        case .vent: return "Vent"
        case .gas: return "Gas"
        case .electrical: return "Electrical"
        case .lowVoltage: return "Low voltage"
        case .hvacSupply: return "HVAC supply"
        case .hvacReturn: return "HVAC return"
        case .structural: return "Structural"
        case .other: return "Other"
        }
    }

    /// Cutting into these is the one that hurts. Drives the emphasis on the record.
    public var isHazardous: Bool {
        self == .electrical || self == .gas
    }
}

public struct TracePoint: Sendable, Identifiable {
    public var id: String
    public var position: Point3
    public var provenance: Provenance
    /// Ray disagreement at this point. Absent for a tape measurement.
    public var tolerance: Length?
    public var note: String?

    public init(id: String, position: Point3, provenance: Provenance,
                tolerance: Length? = nil, note: String? = nil) {
        self.id = id; self.position = position; self.provenance = provenance
        self.tolerance = tolerance; self.note = note
    }

    /// Build a point from two or more taps on photographs.
    public static func triangulated(id: String, taps: [Tap], note: String? = nil) -> TracePoint? {
        guard taps.count >= 2 else { return nil }
        let (result, _) = triangulateBestPair(taps)
        guard !result.isDegenerate else { return nil }
        return TracePoint(id: id,
                          position: .sensorMetres(result.point),
                          provenance: .triangulated,
                          tolerance: result.missLength,
                          note: note)
    }
}

public struct Span: Sendable {
    public var fromID: String
    public var toID: String
    public var provenance: Provenance
    public var length: Length
}

public struct Run: Sendable, Identifiable {
    public var id: String
    public var service: Service
    public var label: String
    public var points: [TracePoint]
    public private(set) var spans: [Span]

    public enum BuildError: Error, Sendable {
        case tooFewPoints
        case duplicatePointID(String)
    }

    /// Spans are derived, never supplied: how trustworthy a span is follows from
    /// its two ends and cannot be asserted independently of them.
    public init(id: String, service: Service, label: String, points: [TracePoint]) throws {
        guard points.count >= 2 else { throw BuildError.tooFewPoints }
        var seen = Set<String>()
        for p in points {
            guard seen.insert(p.id).inserted else { throw BuildError.duplicatePointID(p.id) }
        }
        self.id = id; self.service = service; self.label = label; self.points = points
        self.spans = zip(points, points.dropFirst()).map { a, b in
            Span(fromID: a.id, toID: b.id,
                 provenance: combine(a.provenance, b.provenance),
                 length: distance(a.position, b.position))
        }
    }

    public var totalLength: Length { spans.reduce(.zero) { $0 + $1.length } }

    public var observedLength: Length {
        spans.filter { $0.provenance != .derived }.reduce(.zero) { $0 + $1.length }
    }

    public var inferredLength: Length {
        spans.filter { $0.provenance == .derived }.reduce(.zero) { $0 + $1.length }
    }

    public var worstTolerance: Length? {
        points.compactMap(\.tolerance).max()
    }
}
