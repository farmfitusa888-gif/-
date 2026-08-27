import Foundation

/// An exact area in integer square millimetres.
///
/// Square nanometres would overflow Int64 at any real room size (a 4 m² floor is
/// 4×10¹⁸ nm²), so area is stored a thousand times coarser than length. One
/// square millimetre is far below any quantity a takeoff prints, and keeping it
/// integer means a priced quantity never drifts.
///
/// This exists because passing a `Length` where an area belongs type-checks and
/// is wrong - the compiler should catch that, not a reviewer.
public struct Area: Hashable, Comparable, Sendable {
    public var squareMillimetres: Int64
    public init(squareMillimetres: Int64) { self.squareMillimetres = squareMillimetres }

    public static let zero = Area(squareMillimetres: 0)

    public static let mm2PerSquareMetre: Int64 = 1_000_000
    /// 1 ft² = 92,903.04 mm², rounded to the square millimetre.
    public static let mm2PerSquareFoot: Int64 = 92_903

    public static func squareFeet(_ v: Double) -> Area {
        precondition(v.isFinite, "cannot make an area from a non-finite value")
        return Area(squareMillimetres: Int64((v * Double(mm2PerSquareFoot)).rounded()))
    }

    public static func squareMetres(_ v: Double) -> Area {
        precondition(v.isFinite, "cannot make an area from a non-finite value")
        return Area(squareMillimetres: Int64((v * Double(mm2PerSquareMetre)).rounded()))
    }

    /// The product of two lengths, computed in millimetres to stay inside Int64.
    public static func of(_ a: Length, by b: Length) -> Area {
        let am = a.nanometres / Length.nmPerMillimetre
        let bm = b.nanometres / Length.nmPerMillimetre
        return Area(squareMillimetres: am * bm)
    }

    public var squareFeetValue: Double {
        Double(squareMillimetres) / Double(Area.mm2PerSquareFoot)
    }
    public var squareMetresValue: Double {
        Double(squareMillimetres) / Double(Area.mm2PerSquareMetre)
    }

    public var formattedSquareFeet: String {
        String(format: "%.1f sq ft", squareFeetValue)
    }

    public static func < (a: Area, b: Area) -> Bool { a.squareMillimetres < b.squareMillimetres }
    public static func + (a: Area, b: Area) -> Area {
        Area(squareMillimetres: a.squareMillimetres + b.squareMillimetres)
    }
    public static func - (a: Area, b: Area) -> Area {
        Area(squareMillimetres: a.squareMillimetres - b.squareMillimetres)
    }
}
