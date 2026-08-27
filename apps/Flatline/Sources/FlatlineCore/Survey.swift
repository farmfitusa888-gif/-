import Foundation
import MeasureKit

/// One scanned height reading on the floor, in metres, before the plane fit.
public struct ScanPoint: Sendable {
    public var position: Vector3
    public init(_ position: Vector3) { self.position = position }
}

/// A place the app wants a straightedge put, and what a person found there.
public struct Suspect: Sendable, Identifiable {
    public var id: String
    /// Where along the survey line, from its start.
    public var along: Length
    /// What the scan thinks the gap is. Always `scanned` - never issued as fact.
    public var scannedGap: Provenanced<Length>
    /// What a person read with a real straightedge, once they did.
    public var measuredGap: Length?

    public init(id: String, along: Length, scannedGap: Length, measuredGap: Length? = nil) {
        self.id = id; self.along = along
        self.scannedGap = Provenanced(scannedGap, .scanned)
        self.measuredGap = measuredGap
    }

    /// The number that counts: the person's, if they took one.
    public var gap: Provenanced<Length> {
        if let m = measuredGap { return Provenanced(m, .measured) }
        return scannedGap
    }

    public func exceeds(_ tolerance: FlatnessTolerance) -> Bool { gap.value > tolerance.gap }
}

public struct FloorSurvey: Sendable {
    public var roomName: String
    public var tolerance: FlatnessTolerance
    public var samples: [SurfaceSample]
    public var suspects: [Suspect]
    /// Plan area, needed to quantify leveller.
    public var area: Area

    public init(roomName: String, tolerance: FlatnessTolerance,
                samples: [SurfaceSample], suspects: [Suspect], area: Area) {
        self.roomName = roomName; self.tolerance = tolerance
        self.samples = samples; self.suspects = suspects; self.area = area
    }

    public var worstScannedGap: Length {
        worstGapUnderStraightedge(samples, span: tolerance.span)
    }

    public var failing: [Suspect] { suspects.filter { $0.exceeds(tolerance) } }

    /// Suspects nobody has put a straightedge on yet.
    public var unverified: [Suspect] { suspects.filter { $0.measuredGap == nil } }

    /// The refusal: a floor is not called out as failing on a scan alone.
    public var isIssuable: Bool {
        !suspects.isEmpty && failing.allSatisfy { $0.gap.provenance.isIssuable }
    }

    /// The carry list: where to put the straightedge, worst first.
    ///
    /// This is the product. The phone does not certify the slab; it tells a
    /// person where the six feet that matter are.
    public func carryList(limit: Int = 6) -> [Suspect] {
        suspects
            .filter { $0.measuredGap == nil }
            .sorted {
                // Gap decides; id breaks ties. Swift's sort is not stable, and a
                // list that reorders between runs cannot be worked down.
                if $0.scannedGap.value != $1.scannedGap.value {
                    return $0.scannedGap.value > $1.scannedGap.value
                }
                return $0.id < $1.id
            }
            .prefix(limit)
            .map { $0 }
    }
}

public enum Leveller {
    /// Bags of self-levelling underlayment for a mean fill depth over an area.
    ///
    /// Coverage is per bag at one inch of depth; the arithmetic scales linearly
    /// and then rounds UP, because arriving a bag short stops the job.
    public static func bags(area: Area, meanDepth: Length,
                            coverageSqFtPerBagAtOneInch: Double,
                            wasteFactor: Double = 0.10) -> Int {
        guard area.squareMillimetres > 0, meanDepth.nanometres > 0,
              coverageSqFtPerBagAtOneInch > 0 else { return 0 }
        let areaSqFt = area.squareFeetValue
        let depthInches = meanDepth.inchesApprox
        let coverage = coverageSqFtPerBagAtOneInch / depthInches
        let raw = areaSqFt / coverage
        return Int((raw * (1 + wasteFactor)).rounded(.up))
    }

    /// Mean fill depth over the failing suspects. Half the gap, because a hollow
    /// is a wedge rather than a trench: filling to the straightedge averages out
    /// at half its depth.
    public static func meanDepth(of failing: [Suspect]) -> Length {
        guard !failing.isEmpty else { return .zero }
        let total = failing.reduce(Int64(0)) { $0 + $1.gap.value.nanometres }
        return Length(nanometres: total / Int64(failing.count) / 2)
    }
}
