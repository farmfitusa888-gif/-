import Foundation
import MeasureKit

/// Which rule book governs. Stored WITH the survey, never compiled in: a survey
/// run in 2027 must be re-printable in 2031 against the standard that governed it.
public struct Standard: Sendable, Hashable, Codable {
    public var name: String      // "2010 ADA Standards"
    public var edition: String   // "2010"
    public init(name: String, edition: String) { self.name = name; self.edition = edition }

    public static let ada2010 = Standard(name: "2010 ADA Standards for Accessible Design",
                                         edition: "2010")
    public static let cbc11B = Standard(name: "California Building Code Chapter 11B",
                                        edition: "2022")
}

/// What kind of number a checkpoint wants.
public enum Requirement: Sendable {
    /// The measured value must be at least this.
    case minimum(Length)
    /// The measured value must be no more than this.
    case maximum(Length)
    /// Inclusive band.
    case range(min: Length, max: Length)
    /// Slope must not exceed 1:n.
    case maxSlopeOneIn(Int64)

    public var summary: String {
        switch self {
        case .minimum(let l): return "at least \(l.formatted())"
        case .maximum(let l): return "no more than \(l.formatted())"
        case .range(let lo, let hi): return "\(lo.formatted()) to \(hi.formatted())"
        case .maxSlopeOneIn(let n): return "no steeper than 1:\(n)"
        }
    }
}

public enum SurveyArea: String, Sendable, Codable, CaseIterable {
    case parking, exteriorRoute, entrance, interiorRoute, restroom, counters, signage

    public var label: String {
        switch self {
        case .parking: return "Parking"
        case .exteriorRoute: return "Exterior route"
        case .entrance: return "Entrance"
        case .interiorRoute: return "Interior route"
        case .restroom: return "Restroom"
        case .counters: return "Counters and service"
        case .signage: return "Signage"
        }
    }
}

public struct SurveyCheckpoint: Sendable, Identifiable {
    public var id: String
    public var standard: Standard
    public var clause: String
    public var area: SurveyArea
    public var text: String
    public var requirement: Requirement

    public init(id: String, standard: Standard, clause: String, area: SurveyArea,
                text: String, requirement: Requirement) {
        self.id = id; self.standard = standard; self.clause = clause
        self.area = area; self.text = text; self.requirement = requirement
    }

    public var citation: String { "\(standard.name) §\(clause)" }
}

/// A starting library. Deliberately small and explicit rather than exhaustive:
/// each entry is a threshold somebody can check against the published standard,
/// and adding one is a data change, not a code change.
public enum CheckpointLibrary {
    public static let ada2010: [SurveyCheckpoint] = [
        .init(id: "404.2.3", standard: .ada2010, clause: "404.2.3", area: .entrance,
              text: "Clear width of a doorway, measured with the door open 90 degrees.",
              requirement: .minimum(.inches(32))),
        .init(id: "403.5.1", standard: .ada2010, clause: "403.5.1", area: .interiorRoute,
              text: "Clear width of an accessible route.",
              requirement: .minimum(.inches(36))),
        .init(id: "405.2", standard: .ada2010, clause: "405.2", area: .exteriorRoute,
              text: "Ramp running slope.",
              requirement: .maxSlopeOneIn(SlopeLimit.ramp)),
        .init(id: "403.3", standard: .ada2010, clause: "403.3", area: .exteriorRoute,
              text: "Cross slope of an accessible route.",
              requirement: .maxSlopeOneIn(SlopeLimit.cross)),
        .init(id: "308.2.1", standard: .ada2010, clause: "308.2.1", area: .counters,
              text: "Unobstructed forward reach, high.",
              requirement: .maximum(.inches(48))),
        .init(id: "308.2.1lo", standard: .ada2010, clause: "308.2.1", area: .counters,
              text: "Unobstructed forward reach, low.",
              requirement: .minimum(.inches(15))),
        .init(id: "904.4.1", standard: .ada2010, clause: "904.4.1", area: .counters,
              text: "Height of a sales or service counter above the finished floor.",
              requirement: .maximum(.inches(36))),
        .init(id: "604.5", standard: .ada2010, clause: "604.5", area: .restroom,
              text: "Height of a water closet grab bar above the finished floor.",
              requirement: .range(min: .inches(33), max: .inches(36))),
        .init(id: "304.3.1", standard: .ada2010, clause: "304.3.1", area: .restroom,
              text: "Diameter of a circular turning space.",
              requirement: .minimum(.inches(60))),
        .init(id: "502.2", standard: .ada2010, clause: "502.2", area: .parking,
              text: "Width of a car accessible parking space.",
              requirement: .minimum(.inches(96))),
        .init(id: "502.3", standard: .ada2010, clause: "502.3", area: .parking,
              text: "Width of an access aisle serving a car space.",
              requirement: .minimum(.inches(60))),
        .init(id: "502.4", standard: .ada2010, clause: "502.4", area: .parking,
              text: "Slope of a parking space or access aisle, any direction.",
              requirement: .maxSlopeOneIn(SlopeLimit.cross)),
    ]

    public static func checkpoints(for area: SurveyArea) -> [SurveyCheckpoint] {
        ada2010.filter { $0.area == area }
    }
}
