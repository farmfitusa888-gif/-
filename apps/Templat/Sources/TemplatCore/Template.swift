import Foundation
import MeasureKit

/// A 2D point on the template, in exact nanometres.
public struct Point2: Hashable, Sendable {
    public var x: Length
    public var y: Length
    public init(x: Length, y: Length) { self.x = x; self.y = y }
    public static let origin = Point2(x: .zero, y: .zero)
}

public func distance2(_ a: Point2, _ b: Point2) -> Length {
    let dx = (a.x.nanometres - b.x.nanometres) / Length.nmPerMicrometre
    let dy = (a.y.nanometres - b.y.nanometres) / Length.nmPerMicrometre
    return Length(nanometres: integerSquareRoot(dx * dx + dy * dy) * Length.nmPerMicrometre)
}

/// One edge of the outline.
///
/// Whether an edge will be CUT is the single most important flag in this product:
/// a cut edge is what a slab is sawn to, and it is what the export refuses to
/// release on a scanned number.
public struct Edge: Sendable, Identifiable {
    public var id: String
    public var from: Point2
    public var to: Point2
    public var isCut: Bool
    public var provenance: Provenance
    /// What the person typed, once they put a tape on it.
    public var measuredLength: Length?

    public init(id: String, from: Point2, to: Point2, isCut: Bool,
                provenance: Provenance, measuredLength: Length? = nil) {
        self.id = id; self.from = from; self.to = to; self.isCut = isCut
        self.provenance = provenance; self.measuredLength = measuredLength
    }

    public var scannedLength: Length { distance2(from, to) }

    /// The number that counts.
    public var length: Provenanced<Length> {
        if let m = measuredLength { return Provenanced(m, .measured) }
        return Provenanced(scannedLength, provenance)
    }

    /// How far the tape disagreed with the scan. The honest error, kept.
    public var discrepancy: Length? {
        guard let m = measuredLength else { return nil }
        return Length(nanometres: abs(m.nanometres - scannedLength.nanometres))
    }
}

public enum CutoutKind: String, Sendable, Codable, CaseIterable {
    case undermountSink, dropInSink, cooktop, faucetHole, soapDispenser, outlet

    public var label: String {
        switch self {
        case .undermountSink: return "Undermount sink"
        case .dropInSink: return "Drop-in sink"
        case .cooktop: return "Cooktop"
        case .faucetHole: return "Faucet hole"
        case .soapDispenser: return "Soap dispenser"
        case .outlet: return "Outlet"
        }
    }

    /// A cut-out that a slab is sawn around needs the same verification as an edge.
    public var isSawn: Bool { self != .faucetHole && self != .soapDispenser && self != .outlet }
}

public struct Cutout: Sendable, Identifiable {
    public var id: String
    public var kind: CutoutKind
    public var centre: Point2
    public var width: Provenanced<Length>
    public var depth: Provenanced<Length>

    public init(id: String, kind: CutoutKind, centre: Point2,
                width: Provenanced<Length>, depth: Provenanced<Length>) {
        self.id = id; self.kind = kind; self.centre = centre
        self.width = width; self.depth = depth
    }
}

public struct Template: Sendable {
    public var name: String
    public var material: String
    public var thickness: Length
    public var edges: [Edge]
    public var cutouts: [Cutout]

    public init(name: String, material: String, thickness: Length,
                edges: [Edge], cutouts: [Cutout] = []) {
        self.name = name; self.material = material; self.thickness = thickness
        self.edges = edges; self.cutouts = cutouts
    }

    /// Shoelace area over the closed outline, in exact square millimetres.
    public var area: Area {
        guard edges.count >= 3 else { return .zero }
        var twiceArea: Int64 = 0
        for e in edges {
            let x1 = e.from.x.nanometres / Length.nmPerMillimetre
            let y1 = e.from.y.nanometres / Length.nmPerMillimetre
            let x2 = e.to.x.nanometres / Length.nmPerMillimetre
            let y2 = e.to.y.nanometres / Length.nmPerMillimetre
            twiceArea += x1 * y2 - x2 * y1
        }
        return Area(squareMillimetres: abs(twiceArea) / 2)
    }

    public var cutEdges: [Edge] { edges.filter(\.isCut) }

    /// Cut edges still resting on a sensor's guess.
    public var unverifiedCutEdges: [Edge] {
        cutEdges.filter { !$0.length.provenance.isIssuable }
    }

    public var unverifiedCutouts: [Cutout] {
        cutouts.filter { $0.kind.isSawn
            && (!$0.width.provenance.isIssuable || !$0.depth.provenance.isIssuable) }
    }

    /// THE REFUSAL.
    ///
    /// Nobody scraps a slab because a tape was wrong. They scrap it because a
    /// number nobody checked looked exactly like a number somebody had.
    public var canExportToCNC: Bool {
        !edges.isEmpty && unverifiedCutEdges.isEmpty && unverifiedCutouts.isEmpty
    }

    public var refusalReasons: [String] {
        var reasons: [String] = []
        if edges.isEmpty { reasons.append("The template has no edges.") }
        for e in unverifiedCutEdges {
            reasons.append("Cut edge \(e.id) has never had a tape on it "
                + "(\(e.length.provenance.label)).")
        }
        for c in unverifiedCutouts {
            reasons.append("Cut-out \(c.id) (\(c.kind.label)) is not verified.")
        }
        return reasons
    }

    /// The carry list: the edges worth a tape, longest cut edges first.
    ///
    /// Ranked by length because an error on a long run costs more than the same
    /// error on a short one, and a fabricator has time for four, not forty.
    public func carryList(limit: Int = 4) -> [Edge] {
        unverifiedCutEdges
            .sorted {
                // Length decides; id breaks ties, because Swift's sort is not
                // stable and a carry list that reorders between runs is useless
                // to somebody working down it with a tape.
                if $0.scannedLength != $1.scannedLength {
                    return $0.scannedLength > $1.scannedLength
                }
                return $0.id < $1.id
            }
            .prefix(limit)
            .map { $0 }
    }

    /// Largest disagreement between a tape and the scan across the template.
    ///
    /// This is the honest accuracy figure - the only one this product has - and
    /// it accumulates from real jobs rather than from a marketing claim.
    public var worstDiscrepancy: Length? { edges.compactMap(\.discrepancy).max() }
}
