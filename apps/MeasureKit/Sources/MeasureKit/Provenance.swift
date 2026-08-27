import Foundation

/// How a number came to be known.
///
/// Every product built on this package sells the same promise: it says what it
/// measured and what it assumed. A sensor result and a tape measurement are
/// different claims, and this type exists so they can never look alike.
public enum Provenance: String, CaseIterable, Sendable, Codable {
    /// Straight off a sensor. Never presented as fact on its own.
    case scanned
    /// Computed from two or more posed observations. Still a sensor result.
    case triangulated
    /// A human put a tape or an instrument on it. Overrides any sensor value.
    case measured
    /// Reasoned between known values, never directly observed.
    case derived
    /// Moved by a re-solve after a measurement elsewhere changed.
    case adjusted

    public var label: String {
        switch self {
        case .scanned: return "Scanned, not verified"
        case .triangulated: return "Seen and computed"
        case .measured: return "Measured"
        case .derived: return "Inferred, not seen"
        case .adjusted: return "Adjusted by a later measurement"
        }
    }

    /// Whether anything actually saw this, by any means.
    ///
    /// `scanned` counts: a sensor did observe it. What `scanned` lacks is
    /// VERIFICATION, which is `isIssuable` - and conflating the two is what made
    /// the first version of `combine` below return `derived` for a scanned end,
    /// claiming nothing had seen a point a sensor had.
    public var isObserved: Bool { self != .derived }

    /// How much weight this carries, weakest first. Used to combine two ends.
    var strength: Int {
        switch self {
        case .derived: return 0        // never seen at all
        case .scanned: return 1        // a sensor saw it; nobody checked
        case .triangulated: return 2   // several sensor views agreed
        case .adjusted: return 3       // follows from a measurement elsewhere
        case .measured: return 4       // a tape was on it
        }
    }

    /// Whether a document may be issued on this value alone.
    ///
    /// The refusal all five products share: a sensor's guess never leaves the
    /// building as a fact.
    public var isIssuable: Bool { self == .measured || self == .adjusted }
}

/// A value that knows how it came to be known.
public struct Provenanced<Value>: Sendable where Value: Sendable {
    public var value: Value
    public var provenance: Provenance
    /// The sensor's own estimate of its error, where one exists.
    public var tolerance: Length?

    public init(_ value: Value, _ provenance: Provenance, tolerance: Length? = nil) {
        self.value = value
        self.provenance = provenance
        self.tolerance = tolerance
    }

    /// A human types the real number. The sensor's value is replaced, not averaged.
    public mutating func override(with measured: Value) {
        value = measured
        provenance = .measured
        tolerance = nil
    }
}

/// A span is only as trustworthy as its weaker end - literally.
///
/// The first version of this was a ladder of special cases, and it had a dead
/// branch and one wrong answer: it called a triangulated-to-scanned span
/// `derived`, which claims nothing saw a point a sensor had seen. Taking the
/// weaker of the two ends is both correct and impossible to get subtly wrong.
public func combine(_ a: Provenance, _ b: Provenance) -> Provenance {
    a.strength <= b.strength ? a : b
}
