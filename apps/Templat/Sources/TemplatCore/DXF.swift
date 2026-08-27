import Foundation
import MeasureKit

/// Minimal DXF writer for a dimensioned 2D template.
///
/// `$INSUNITS` is set explicitly and deliberately. A units header that is wrong
/// or absent is the classic way a CAD export arrives at a saw off by a factor,
/// and it fails silently - the file opens, the geometry looks right, and the
/// slab is cut to the wrong size.
public enum DXFWriter {

    public enum ExportError: Error, Sendable, Equatable {
        /// The refusal, surfaced as a type rather than a comment.
        case refusedUnverifiedCutEdges([String])
    }

    /// $INSUNITS: 0 unitless, **1 inches**, 2 feet, 4 millimetres.
    ///
    /// This constant was briefly 4 during development, which is millimetres -
    /// while the coordinates below are written in inches. The file would have
    /// opened cleanly, looked correct, and cut every slab 25.4x too small. That
    /// is why `testHeaderDeclaresInchesNotMillimetres` exists.
    static let insunitsInches = 1

    public static func export(_ template: Template) throws -> String {
        guard template.canExportToCNC else {
            throw ExportError.refusedUnverifiedCutEdges(template.refusalReasons)
        }
        var out = ""

        func pair(_ code: Int, _ value: String) { out += "\(code)\n\(value)\n" }
        func inches(_ l: Length) -> String { String(format: "%.6f", l.inchesApprox) }

        // HEADER - units first, because everything downstream depends on it.
        pair(0, "SECTION"); pair(2, "HEADER")
        pair(9, "$INSUNITS"); pair(70, "\(insunitsInches)")
        pair(9, "$MEASUREMENT"); pair(70, "0")   // 0 = imperial
        pair(0, "ENDSEC")

        // TABLES - one layer per provenance, so a viewer can see what was verified.
        pair(0, "SECTION"); pair(2, "TABLES")
        pair(0, "TABLE"); pair(2, "LAYER")
        for (name, colour) in [("CUT_MEASURED", 3), ("CUT_ADJUSTED", 5),
                               ("REFERENCE", 8), ("CUTOUT", 1), ("DIMENSIONS", 2)] {
            pair(0, "LAYER"); pair(2, name); pair(70, "0"); pair(62, "\(colour)")
            pair(6, "CONTINUOUS")
        }
        pair(0, "ENDTAB"); pair(0, "ENDSEC")

        // ENTITIES
        pair(0, "SECTION"); pair(2, "ENTITIES")
        for e in template.edges {
            let layer = e.isCut
                ? (e.length.provenance == .adjusted ? "CUT_ADJUSTED" : "CUT_MEASURED")
                : "REFERENCE"
            pair(0, "LINE"); pair(8, layer)
            pair(10, inches(e.from.x)); pair(20, inches(e.from.y)); pair(30, "0.0")
            pair(11, inches(e.to.x)); pair(21, inches(e.to.y)); pair(31, "0.0")
        }
        for c in template.cutouts {
            // Cut-outs as a closed rectangle about their centre.
            let hw = Length(nanometres: c.width.value.nanometres / 2)
            let hd = Length(nanometres: c.depth.value.nanometres / 2)
            let x0 = Length(nanometres: c.centre.x.nanometres - hw.nanometres)
            let x1 = Length(nanometres: c.centre.x.nanometres + hw.nanometres)
            let y0 = Length(nanometres: c.centre.y.nanometres - hd.nanometres)
            let y1 = Length(nanometres: c.centre.y.nanometres + hd.nanometres)
            pair(0, "LWPOLYLINE"); pair(8, "CUTOUT"); pair(90, "4"); pair(70, "1")
            for (x, y) in [(x0, y0), (x1, y0), (x1, y1), (x0, y1)] {
                pair(10, inches(x)); pair(20, inches(y))
            }
        }
        // Dimension text on every cut edge, so a viewer shows the number a person
        // typed rather than making the reader measure the drawing.
        for e in template.cutEdges {
            let midX = Length(nanometres: (e.from.x.nanometres + e.to.x.nanometres) / 2)
            let midY = Length(nanometres: (e.from.y.nanometres + e.to.y.nanometres) / 2)
            pair(0, "TEXT"); pair(8, "DIMENSIONS")
            pair(10, inches(midX)); pair(20, inches(midY)); pair(30, "0.0")
            pair(40, "0.25")
            pair(1, e.length.value.formatted(denominator: 16) + " MEASURED")
        }
        pair(0, "ENDSEC")
        pair(0, "EOF")
        return out
    }
}
