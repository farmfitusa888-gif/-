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

    /// Only these may be presented as observed fact.
    public var isObserved: Bool {
        self == .triangulated || self == .measured || self == .adjusted
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

/// A span is only as trustworthy as its weaker end.
///
/// Deliberately pessimistic: one unobserved end makes the whole span inferred,
/// because somebody downstream acts on this.
public func combine(_ a: Provenance, _ b: Provenance) -> Provenance {
    if a == .measured && b == .measured { return .measured }
    if !a.isObserved || !b.isObserved { return .derived }
    if a == .adjusted || b == .adjusted { return .adjusted }
    if a == .scanned || b == .scanned { return .scanned }
    return .triangulated
}
