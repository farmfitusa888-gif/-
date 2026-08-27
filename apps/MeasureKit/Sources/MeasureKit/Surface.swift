import Foundation

/// A reference plane `z = ax + by + c`, fitted in metres.
public struct Plane: Sendable {
    public var a: Double, b: Double, c: Double
    public init(a: Double, b: Double, c: Double) { self.a = a; self.b = b; self.c = c }

    public func height(atX x: Double, y: Double) -> Double { a * x + b * y + c }
    /// Positive means the point sits above the plane.
    public func deviation(_ p: Vector3) -> Double { p.z - height(atX: p.x, y: p.y) }
}

public enum PlaneFitError: Error, Sendable {
    /// Fewer than three points, or points that are collinear in plan - either way
    /// there is no unique plane and guessing one would be worse than refusing.
    case degenerate
}

/// Least-squares plane through a cloud, minimising vertical distance.
///
/// Vertical rather than perpendicular distance is the right model here: a floor
/// is a height field, and the question asked of it is always "how far above or
/// below", never "how far away".
public func fitPlane(_ points: [Vector3]) throws -> Plane {
    guard points.count >= 3 else { throw PlaneFitError.degenerate }

    var sx = 0.0, sy = 0.0, sz = 0.0
    var sxx = 0.0, sxy = 0.0, syy = 0.0, sxz = 0.0, syz = 0.0
    for p in points {
        sx += p.x; sy += p.y; sz += p.z
        sxx += p.x * p.x; sxy += p.x * p.y; syy += p.y * p.y
        sxz += p.x * p.z; syz += p.y * p.z
    }
    let n = Double(points.count)

    // Normal equations for [a b c].
    let m = [[sxx, sxy, sx], [sxy, syy, sy], [sx, sy, n]]
    let rhs = [sxz, syz, sz]
    guard let s = solve3x3(m, rhs) else { throw PlaneFitError.degenerate }
    return Plane(a: s[0], b: s[1], c: s[2])
}

/// Gaussian elimination with partial pivoting. Returns nil when singular.
func solve3x3(_ matrix: [[Double]], _ rhs: [Double]) -> [Double]? {
    var m = matrix
    var v = rhs
    for col in 0..<3 {
        var pivot = col
        for row in (col + 1)..<3 where abs(m[row][col]) > abs(m[pivot][col]) { pivot = row }
        if abs(m[pivot][col]) < 1e-12 { return nil }
        if pivot != col { m.swapAt(pivot, col); v.swapAt(pivot, col) }
        for row in (col + 1)..<3 {
            let f = m[row][col] / m[col][col]
            if f == 0 { continue }
            for k in col..<3 { m[row][k] -= f * m[col][k] }
            v[row] -= f * v[col]
        }
    }
    var out = [Double](repeating: 0, count: 3)
    for row in stride(from: 2, through: 0, by: -1) {
        var acc = v[row]
        for k in (row + 1)..<3 { acc -= m[row][k] * out[k] }
        out[row] = acc / m[row][row]
    }
    return out
}

// MARK: - Straightedge

/// One height reading along a line across the floor.
public struct SurfaceSample: Sendable {
    /// Distance along the line.
    public var position: Length
    /// Height, signed, relative to the reference plane.
    public var height: Length
    public init(position: Length, height: Length) {
        self.position = position; self.height = height
    }
}

/// The largest gap under a straightedge of `span`, anywhere along the line.
///
/// This is the primitive the flooring tolerance is actually written in - "1/8 inch
/// over 6 feet" - so the code matches the specification's own language rather
/// than approximating it with a plane deviation.
///
/// A straightedge rests on the high points and bridges the hollows, so within any
/// window the reference is the upper convex hull of the samples, and the gap is
/// the deepest drop below it.
public func worstGapUnderStraightedge(_ samples: [SurfaceSample], span: Length) -> Length {
    let sorted = samples.sorted { $0.position < $1.position }
    guard sorted.count >= 2, span.nanometres > 0 else { return .zero }

    var worst = Length.zero
    for start in sorted.indices {
        let from = sorted[start].position
        let to = Length(nanometres: from.nanometres + span.nanometres)
        let window = sorted[start...].prefix { $0.position <= to }
        if window.count < 2 { continue }
        let gap = deepestDropBelowHull(Array(window))
        if gap > worst { worst = gap }
    }
    return worst
}

/// Deepest drop below the upper convex hull of a window of samples.
func deepestDropBelowHull(_ window: [SurfaceSample]) -> Length {
    // Upper hull by monotone chain: keep only points that a straightedge touches.
    var hull: [SurfaceSample] = []
    for p in window {
        while hull.count >= 2 {
            let a = hull[hull.count - 2], b = hull[hull.count - 1]
            // Drop b when it lies on or below the line a->p.
            let lhs = (b.position.nanometres - a.position.nanometres)
                * (p.height.nanometres - a.height.nanometres)
            let rhs = (p.position.nanometres - a.position.nanometres)
                * (b.height.nanometres - a.height.nanometres)
            if lhs >= rhs { hull.removeLast() } else { break }
        }
        hull.append(p)
    }

    var deepest = Length.zero
    var segment = 0
    for p in window {
        while segment + 1 < hull.count - 1 && hull[segment + 1].position < p.position { segment += 1 }
        guard hull.count >= 2 else { break }
        let a = hull[segment], b = hull[min(segment + 1, hull.count - 1)]
        let run = b.position.nanometres - a.position.nanometres
        let hullHeight: Int64
        if run == 0 {
            hullHeight = max(a.height.nanometres, b.height.nanometres)
        } else {
            let t = p.position.nanometres - a.position.nanometres
            hullHeight = a.height.nanometres
                + (b.height.nanometres - a.height.nanometres) * t / run
        }
        let drop = hullHeight - p.height.nanometres
        if drop > deepest.nanometres { deepest = Length(nanometres: drop) }
    }
    return deepest
}
