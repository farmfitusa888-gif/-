import Foundation
import MeasureKit

/// What was found at one checkpoint.
public enum Finding: Sendable {
    case compliant(Provenanced<Length>)
    case barrier(Provenanced<Length>)
    case slopeCompliant(CrossCheckedSlope)
    case slopeBarrier(CrossCheckedSlope)
    /// Could not be measured, with the reason. Never silently omitted.
    case notMeasured(reason: String)
    case notApplicable(reason: String)

    public var isBarrier: Bool {
        switch self {
        case .barrier, .slopeBarrier: return true
        default: return false
        }
    }

    public var provenance: Provenance {
        switch self {
        case .compliant(let v), .barrier(let v): return v.provenance
        case .slopeCompliant(let s), .slopeBarrier(let s): return s.provenance
        case .notMeasured: return .scanned
        case .notApplicable: return .derived
        }
    }

    /// Whether this finding may appear in an issued report as a fact.
    ///
    /// The refusal at the heart of the product: a barrier called out on a number
    /// no tape ever confirmed is an expert witness's afternoon.
    public var isIssuable: Bool { provenance.isIssuable }
}

public struct Observation: Sendable, Identifiable {
    public var id: String
    public var checkpoint: SurveyCheckpoint
    public var location: String
    public var finding: Finding
    public var photoCaptions: [String]

    public init(id: String, checkpoint: SurveyCheckpoint, location: String,
                finding: Finding, photoCaptions: [String] = []) {
        self.id = id; self.checkpoint = checkpoint; self.location = location
        self.finding = finding; self.photoCaptions = photoCaptions
    }
}

public enum Evaluator {
    /// Compare a measured length against a checkpoint. Exact integer comparison.
    public static func evaluate(_ checkpoint: SurveyCheckpoint,
                                measured: Provenanced<Length>) -> Finding {
        let v = measured.value
        switch checkpoint.requirement {
        case .minimum(let m): return v < m ? .barrier(measured) : .compliant(measured)
        case .maximum(let m): return v > m ? .barrier(measured) : .compliant(measured)
        case .range(let lo, let hi):
            return (v < lo || v > hi) ? .barrier(measured) : .compliant(measured)
        case .maxSlopeOneIn:
            return .notMeasured(reason: "this checkpoint needs a slope, not a length")
        }
    }

    public static func evaluate(_ checkpoint: SurveyCheckpoint,
                                slope: CrossCheckedSlope) -> Finding {
        guard case let .maxSlopeOneIn(n) = checkpoint.requirement else {
            return .notMeasured(reason: "this checkpoint needs a length, not a slope")
        }
        // The steeper of the two readings is the one reported: conservative by design.
        return slope.reported.exceedsOneIn(n) ? .slopeBarrier(slope) : .slopeCompliant(slope)
    }
}

public struct Barrier: Sendable, Identifiable {
    public var id: String
    public var checkpoint: SurveyCheckpoint
    public var location: String
    public var found: String
    public var required: String
    public var provenance: Provenance
    public var remediation: QuoteLine?

    public init(id: String, checkpoint: SurveyCheckpoint, location: String,
                found: String, required: String, provenance: Provenance,
                remediation: QuoteLine? = nil) {
        self.id = id; self.checkpoint = checkpoint; self.location = location
        self.found = found; self.required = required
        self.provenance = provenance; self.remediation = remediation
    }
}

public struct Survey: Sendable {
    public var siteName: String
    public var address: String
    /// Supplied, never `Date()`.
    public var surveyedOn: String
    public var surveyorName: String
    public var credential: String?
    public var standard: Standard
    public var observations: [Observation]

    public init(siteName: String, address: String, surveyedOn: String,
                surveyorName: String, credential: String? = nil,
                standard: Standard, observations: [Observation]) {
        self.siteName = siteName; self.address = address; self.surveyedOn = surveyedOn
        self.surveyorName = surveyorName; self.credential = credential
        self.standard = standard; self.observations = observations
    }

    public var barriers: [Barrier] {
        observations.compactMap { o in
            guard o.finding.isBarrier else { return nil }
            let found: String
            switch o.finding {
            case .barrier(let v): found = v.value.formatted()
            case .slopeBarrier(let s): found = s.reported.formattedAsOneIn()
            default: return nil
            }
            return Barrier(id: o.id, checkpoint: o.checkpoint, location: o.location,
                           found: found, required: o.checkpoint.requirement.summary,
                           provenance: o.finding.provenance)
        }
    }

    /// Barriers resting on a sensor value nobody confirmed with a tape.
    public var unverifiedBarriers: [Barrier] { barriers.filter { !$0.provenance.isIssuable } }

    public var notMeasured: [Observation] {
        observations.filter { if case .notMeasured = $0.finding { return true }; return false }
    }

    /// The refusal. A survey with any barrier resting on an unverified number
    /// cannot be issued as evidence.
    public var isIssuable: Bool { unverifiedBarriers.isEmpty && !observations.isEmpty }

    /// Slope readings where the two methods disagreed enough to warrant a level.
    public var slopeDisagreements: [Observation] {
        observations.filter { o in
            switch o.finding {
            case .slopeCompliant(let s), .slopeBarrier(let s): return s.disagrees()
            default: return false
            }
        }
    }
}
