import Foundation

/// Two taps become one point - and one honest number saying how much they disagreed.
public struct Triangulation: Sendable {
    /// Midpoint of the segment joining the two closest points on the rays.
    public var point: Vector3
    /// How far apart the rays were at closest approach, in metres. The error.
    public var missDistance: Double
    /// Distance from each camera to its closest point. Negative means behind.
    public var depths: (Double, Double)
    /// True when the rays are too near parallel for the answer to mean anything.
    public var isDegenerate: Bool

    public var missLength: Length {
        missDistance.isFinite ? .sensorMetres(missDistance) : Length(nanometres: .max)
    }
}

/// Rays nearer than half a degree to parallel carry no usable depth: a small
/// angular error moves the solution arbitrarily far along the line.
private let minSinAngle = sin(0.5 * Double.pi / 180)

public func triangulate(_ a: Ray, _ b: Ray) -> Triangulation {
    let da = a.direction, db = b.direction

    // Both directions are unit length, so |da x db| is the sine of the angle.
    guard da.cross(db).length >= minSinAngle else {
        return Triangulation(point: a.origin, missDistance: .infinity,
                             depths: (.nan, .nan), isDegenerate: true)
    }

    let w0 = a.origin - b.origin
    let bDot = da.dot(db)
    let d = da.dot(w0)
    let e = db.dot(w0)
    let denom = 1 - bDot * bDot   // da·da = db·db = 1

    let s = (bDot * e - d) / denom
    let t = (e - bDot * d) / denom

    let pa = a.origin + da * s
    let pb = b.origin + db * t

    return Triangulation(point: (pa + pb) * 0.5,
                         missDistance: (pa - pb).length,
                         depths: (s, t),
                         isDegenerate: false)
}

public func triangulate(_ a: Tap, _ b: Tap) -> Triangulation { triangulate(a.ray, b.ray) }

/// Fold in a third or fourth tap by taking the pair that agreed best.
///
/// Averaging every pair lets one bad tap quietly drag the answer; taking the best
/// pair and reporting its miss keeps the number defensible.
public func triangulateBestPair(_ taps: [Tap]) -> (result: Triangulation, pairsConsidered: Int) {
    precondition(taps.count >= 2, "need at least two taps to triangulate")
    var best: Triangulation?
    var pairs = 0
    for i in taps.indices {
        for j in taps.index(after: i)..<taps.endIndex {
            pairs += 1
            let candidate = triangulate(taps[i], taps[j])
            if candidate.isDegenerate { continue }
            if best == nil || candidate.missDistance < best!.missDistance { best = candidate }
        }
    }
    guard let best else {
        return (Triangulation(point: taps[0].ray.origin, missDistance: .infinity,
                              depths: (.nan, .nan), isDegenerate: true), pairs)
    }
    return (best, pairs)
}
