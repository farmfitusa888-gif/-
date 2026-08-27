import Foundation
import MeasureKit

public struct EdgeProfile: Sendable, Hashable {
    public var name: String
    public var pricePerLinearFoot: Money
    public init(name: String, pricePerLinearFoot: Money) {
        self.name = name; self.pricePerLinearFoot = pricePerLinearFoot
    }
    public static let eased = EdgeProfile(name: "Eased", pricePerLinearFoot: Money(cents: 0))
    public static let bullnose = EdgeProfile(name: "Full bullnose",
                                             pricePerLinearFoot: Money(cents: 1200))
    public static let mitred = EdgeProfile(name: "Mitred", pricePerLinearFoot: Money(cents: 4500))
}

public enum TemplateQuote {

    /// Price a template off its own verified geometry.
    ///
    /// Every line inherits the provenance of the measurement that produced it, so
    /// a quote built on unverified geometry is visibly not issuable rather than
    /// quietly wrong.
    public static func quote(for template: Template,
                             materialPerSquareFoot: Money,
                             profile: EdgeProfile,
                             cutoutPrice: Money) -> Quote {
        var lines: [QuoteLine] = []

        let areaProvenance: Provenance = template.canExportToCNC ? .measured : .scanned
        let sqft = template.area.squareFeetValue
        lines.append(QuoteLine(
            item: PriceItem(code: "MAT", description: "\(template.material), supply and fabricate",
                            unit: .squareFoot, unitPrice: materialPerSquareFoot),
            quantityMilli: Int64((sqft * 1000).rounded()),
            provenance: areaProvenance))

        if profile.pricePerLinearFoot > .zero {
            let lf = template.cutEdges.reduce(0.0) {
                $0 + Double($1.length.value.nanometres) / Double(Length.nmPerFoot)
            }
            let edgeProvenance = template.unverifiedCutEdges.isEmpty
                ? Provenance.measured : .scanned
            lines.append(QuoteLine(
                item: PriceItem(code: "EDG", description: "\(profile.name) edge",
                                unit: .linearFoot, unitPrice: profile.pricePerLinearFoot),
                quantityMilli: Int64((lf * 1000).rounded()),
                provenance: edgeProvenance))
        }

        for c in template.cutouts where c.kind.isSawn {
            lines.append(QuoteLine(
                item: PriceItem(code: "CUT", description: c.kind.label,
                                unit: .each, unitPrice: cutoutPrice),
                quantityMilli: 1000,
                provenance: c.width.provenance.isIssuable && c.depth.provenance.isIssuable
                    ? .measured : .scanned))
        }

        return Quote(lines: lines)
    }
}
