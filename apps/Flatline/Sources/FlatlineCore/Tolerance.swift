import Foundation
import MeasureKit

/// A flooring manufacturer's flatness tolerance, in its own terms.
///
/// These are written as "1/8 inch over 6 feet", never as an F-number, so the
/// model matches the specification rather than approximating it.
public struct FlatnessTolerance: Sendable, Hashable {
    public var gap: Length
    public var span: Length
    public var source: String

    public init(gap: Length, span: Length, source: String) {
        self.gap = gap; self.span = span; self.source = source
    }

    public var summary: String { "\(gap.formatted()) over \(span.formatted())" }

    /// The common published tolerances. Each is a claim about what a MANUFACTURER
    /// requires, so each carries where it came from.
    public static let lvpSixFoot = FlatnessTolerance(
        gap: .inches(0, 1, 8), span: .feet(6),
        source: "Typical LVP manufacturer requirement, 1/8 in over 6 ft")
    public static let lvpFourFoot = FlatnessTolerance(
        gap: .inches(0, 1, 8), span: .feet(4),
        source: "Alternate published requirement, 1/8 in over 4 ft")
    public static let tenFoot = FlatnessTolerance(
        gap: .inches(0, 3, 16), span: .feet(10),
        source: "Published requirement, 3/16 in over 10 ft")

    public static let all: [FlatnessTolerance] = [lvpSixFoot, lvpFourFoot, tenFoot]
}

/// THE REFUSAL, and it is printed on every output this product makes.
///
/// ASTM E1155 needs precision on the order of ±0.5 mm over 5 m. A phone is not
/// within an order of magnitude of that. This product therefore never produces an
/// F-number, and says so in writing, because the people who know the difference
/// are the people whose trust it needs.
public enum E1155 {
    public static let refusal = """
        This is NOT an ASTM E1155 test and must not be used as one. It produces no \
        FF or FL number. It is a relative survey that ranks where to place a \
        straightedge, plus the measurements a person then took with one.
        """
}
