import Foundation

/// An exact length in integer nanometres.
///
/// Binary floating point cannot represent 3/8 of an inch, and every trade this
/// package serves works in sixteenths. Storing lengths as integers means a
/// measurement typed by a person survives every round trip unchanged.
///
/// `Int64` nanometres spans roughly ±9.2×10⁹ metres, which is not a constraint
/// for anything inside a building.
public struct Length: Hashable, Comparable, Sendable {
    public var nanometres: Int64

    public init(nanometres: Int64) { self.nanometres = nanometres }

    public static let zero = Length(nanometres: 0)

    public static let nmPerMicrometre: Int64 = 1_000
    public static let nmPerMillimetre: Int64 = 1_000_000
    public static let nmPerInch: Int64 = 25_400_000
    public static let nmPerFoot: Int64 = 304_800_000

    public static func millimetres(_ mm: Double) -> Length { quantise(mm, unit: nmPerMillimetre) }
    public static func inches(_ inches: Double) -> Length { quantise(inches, unit: nmPerInch) }
    public static func feet(_ feet: Double) -> Length { quantise(feet, unit: nmPerFoot) }

    /// Whole inches plus a fraction, the way a tape is actually read.
    public static func inches(_ whole: Int, _ numerator: Int, _ denominator: Int) -> Length {
        precondition(denominator > 0, "denominator must be positive")
        return Length(
            nanometres: Int64(whole) * nmPerInch
                + (Int64(numerator) * nmPerInch) / Int64(denominator)
        )
    }

    /// The sensor boundary.
    ///
    /// ARKit reports float metres; everything downstream is exact. Rounding
    /// happens here, once, and is never repeated - which is what stops sensor
    /// noise compounding through a chain of derived values.
    public static func sensorMetres(_ metres: Double) -> Length {
        precondition(metres.isFinite, "cannot quantise a non-finite length")
        return quantise(metres * 1_000, unit: nmPerMillimetre)
    }

    private static func quantise(_ value: Double, unit: Int64) -> Length {
        precondition(value.isFinite, "cannot quantise a non-finite length")
        return Length(nanometres: Int64((value * Double(unit)).rounded()))
    }

    public var metres: Double { Double(nanometres) / 1e9 }
    public var inchesApprox: Double { Double(nanometres) / Double(Length.nmPerInch) }
    public var magnitude: Length { Length(nanometres: Swift.abs(nanometres)) }

    public static func < (a: Length, b: Length) -> Bool { a.nanometres < b.nanometres }
    public static func + (a: Length, b: Length) -> Length { Length(nanometres: a.nanometres + b.nanometres) }
    public static func - (a: Length, b: Length) -> Length { Length(nanometres: a.nanometres - b.nanometres) }
    public static prefix func - (a: Length) -> Length { Length(nanometres: -a.nanometres) }
    public static func * (a: Length, k: Int64) -> Length { Length(nanometres: a.nanometres * k) }
    public static func += (a: inout Length, b: Length) { a = a + b }
}

public extension Length {
    /// Format as feet, inches and a reduced fraction: `2' 10 3/8"`.
    ///
    /// `denominator` is the finest fraction shown and must be a power of two,
    /// because a tape is not marked in thirds.
    func formatted(denominator: Int = 16) -> String {
        precondition(denominator >= 1 && denominator & (denominator - 1) == 0,
                     "denominator must be a power of two")
        let negative = nanometres < 0
        let total = Swift.abs(nanometres)
        let denom = Int64(denominator)

        // Round to the nearest 1/denominator inch, half away from zero.
        let ticks = (total * denom * 2 + Length.nmPerInch) / (Length.nmPerInch * 2)

        let ticksPerFoot = denom * 12
        let feet = ticks / ticksPerFoot
        let rest = ticks % ticksPerFoot
        let inches = rest / denom
        var num = rest % denom
        var den = denom
        while num != 0 && num % 2 == 0 && den % 2 == 0 { num /= 2; den /= 2 }

        var parts: [String] = []
        if feet != 0 { parts.append("\(feet)'") }
        if num == 0 {
            if inches != 0 || feet == 0 { parts.append("\(inches)\"") }
        } else if inches == 0 {
            parts.append("\(num)/\(den)\"")
        } else {
            parts.append("\(inches) \(num)/\(den)\"")
        }
        return (negative ? "-" : "") + parts.joined(separator: " ")
    }

    /// Parse `2' 10 3/8"`, `10 3/8"`, `11/16"`, `34"`, `3'`.
    ///
    /// Whole inches and a fraction must be space-separated. Without that rule
    /// `11/16` reads as `1` and `1/16`, which is wrong by a whole inch - a bug
    /// found by testing the reference implementation of this parser.
    static func parse(_ text: String) -> Length? {
        let pattern = #"^\s*(-)?\s*(?:(\d+)\s*')?\s*(?:(\d+)\s+(\d+)/(\d+)|(\d+)/(\d+)|(\d+))?\s*"?\s*$"#
        guard let re = try? NSRegularExpression(pattern: pattern),
              let m = re.firstMatch(in: text, range: NSRange(text.startIndex..., in: text))
        else { return nil }

        func group(_ i: Int) -> String? {
            guard let r = Range(m.range(at: i), in: text) else { return nil }
            return String(text[r])
        }

        let sign = group(1)
        let feet = group(2)
        let inches = group(3) ?? group(8)
        let num = group(4) ?? group(6)
        let den = group(5) ?? group(7)

        if feet == nil && inches == nil && num == nil { return nil }
        if let den, Int64(den) == 0 { return nil }

        var nm: Int64 = 0
        if let feet, let v = Int64(feet) { nm += v * nmPerFoot }
        if let inches, let v = Int64(inches) { nm += v * nmPerInch }
        if let num, let den, let n = Int64(num), let d = Int64(den), d != 0 {
            nm += (n * nmPerInch) / d
        }
        return Length(nanometres: sign == "-" ? -nm : nm)
    }
}

/// Integer square root by Newton's method. Exact: floors, never rounds up.
public func integerSquareRoot(_ value: Int64) -> Int64 {
    precondition(value >= 0, "square root of a negative value")
    if value < 2 { return value }
    var x = value
    var y = (x + 1) / 2
    while y < x { x = y; y = (x + value / x) / 2 }
    return x
}
