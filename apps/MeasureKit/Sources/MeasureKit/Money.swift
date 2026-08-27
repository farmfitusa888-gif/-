import Foundation

/// Money in integer cents. No Double ever touches a price.
public struct Money: Hashable, Comparable, Sendable {
    public var cents: Int64
    public init(cents: Int64) { self.cents = cents }
    public static let zero = Money(cents: 0)

    public static func dollars(_ d: Double) -> Money {
        precondition(d.isFinite, "cannot make money from a non-finite value")
        return Money(cents: Int64((d * 100).rounded()))
    }

    public var formatted: String {
        let negative = cents < 0
        let total = abs(cents)
        var whole = String(total / 100)
        // Thousands separators, without a locale-dependent formatter.
        var grouped = ""
        while whole.count > 3 {
            grouped = "," + whole.suffix(3) + grouped
            whole = String(whole.dropLast(3))
        }
        grouped = whole + grouped
        let fraction = String(format: "%02d", total % 100)
        return (negative ? "-$" : "$") + grouped + "." + fraction
    }

    public static func < (a: Money, b: Money) -> Bool { a.cents < b.cents }
    public static func + (a: Money, b: Money) -> Money { Money(cents: a.cents + b.cents) }
    public static func - (a: Money, b: Money) -> Money { Money(cents: a.cents - b.cents) }
    public static func += (a: inout Money, b: Money) { a = a + b }
}

/// A unit a price book can be quoted in.
public enum PriceUnit: String, Sendable, Codable {
    case each, linearFoot = "lf", squareFoot = "sf", cubicYard = "cy", hour, bag

    public var label: String {
        switch self {
        case .each: return "ea"
        case .linearFoot: return "lf"
        case .squareFoot: return "sf"
        case .cubicYard: return "cy"
        case .hour: return "hr"
        case .bag: return "bag"
        }
    }
}

public struct PriceItem: Sendable, Codable {
    public var code: String
    public var description: String
    public var unit: PriceUnit
    public var unitPriceCents: Int64

    public init(code: String, description: String, unit: PriceUnit, unitPrice: Money) {
        self.code = code; self.description = description
        self.unit = unit; self.unitPriceCents = unitPrice.cents
    }

    public var unitPrice: Money { Money(cents: unitPriceCents) }
}

/// One priced line. Quantity is held in thousandths so 12.5 lf is exact.
public struct QuoteLine: Sendable {
    public var item: PriceItem
    public var quantityMilli: Int64
    public var provenance: Provenance
    public var note: String?

    public init(item: PriceItem, quantityMilli: Int64, provenance: Provenance, note: String? = nil) {
        self.item = item; self.quantityMilli = quantityMilli
        self.provenance = provenance; self.note = note
    }

    public var quantity: Double { Double(quantityMilli) / 1000 }

    /// Rounded half-up at the last cent, once, so a total never drifts from its lines.
    public var total: Money {
        Money(cents: (item.unitPriceCents * quantityMilli + 500) / 1000)
    }
}

public struct Quote: Sendable {
    public var lines: [QuoteLine]
    public init(lines: [QuoteLine]) { self.lines = lines }

    public var subtotal: Money { lines.reduce(Money.zero) { $0 + $1.total } }

    /// Lines resting on numbers nobody verified.
    ///
    /// Every product here refuses to issue a priced document while this is
    /// non-empty: a sensor's guess must never leave the building as a price.
    public var unverifiedLines: [QuoteLine] { lines.filter { !$0.provenance.isIssuable } }

    public var isIssuable: Bool { unverifiedLines.isEmpty && !lines.isEmpty }
}
