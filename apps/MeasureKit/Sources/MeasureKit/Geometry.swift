import Foundation

/// A point in exact nanometres, in whatever frame the caller has established.
public struct Point3: Hashable, Sendable {
    public var x: Length, y: Length, z: Length
    public init(x: Length, y: Length, z: Length) { self.x = x; self.y = y; self.z = z }

    public static let origin = Point3(x: .zero, y: .zero, z: .zero)

    public static func sensorMetres(_ v: Vector3) -> Point3 {
        Point3(x: .sensorMetres(v.x), y: .sensorMetres(v.y), z: .sensorMetres(v.z))
    }
}

/// Exact straight-line distance.
///
/// Deltas are reduced to micrometres before squaring: a room-scale delta in
/// nanometres squared overflows Int64, and micrometres leave headroom to about
/// 3,000 km. The cost is a resolution of one micrometre - roughly 1/800th of the
/// finest fraction any of these products prints - and that trade is deliberate,
/// so the result stays integer rather than drifting through a Double.
public func distance(_ a: Point3, _ b: Point3) -> Length {
    func micro(_ p: Length, _ q: Length) -> Int64 {
        (p.nanometres - q.nanometres) / Length.nmPerMicrometre
    }
    let dx = micro(a.x, b.x), dy = micro(a.y, b.y), dz = micro(a.z, b.z)
    let squared = dx * dx + dy * dy + dz * dz
    return Length(nanometres: integerSquareRoot(squared) * Length.nmPerMicrometre)
}

// MARK: - Float geometry, used only for rays and fits

/// Nothing here is ever stored. Results cross into exact `Length` through
/// `Length.sensorMetres` and are marked as sensor-derived when they do.
public struct Vector3: Hashable, Sendable {
    public var x: Double, y: Double, z: Double
    public init(_ x: Double, _ y: Double, _ z: Double) { self.x = x; self.y = y; self.z = z }

    public static let zero = Vector3(0, 0, 0)

    public static func + (a: Vector3, b: Vector3) -> Vector3 { Vector3(a.x + b.x, a.y + b.y, a.z + b.z) }
    public static func - (a: Vector3, b: Vector3) -> Vector3 { Vector3(a.x - b.x, a.y - b.y, a.z - b.z) }
    public static func * (a: Vector3, k: Double) -> Vector3 { Vector3(a.x * k, a.y * k, a.z * k) }

    public func dot(_ o: Vector3) -> Double { x * o.x + y * o.y + z * o.z }
    public func cross(_ o: Vector3) -> Vector3 {
        Vector3(y * o.z - z * o.y, z * o.x - x * o.z, x * o.y - y * o.x)
    }
    public var length: Double { dot(self).squareRoot() }

    public func normalised() -> Vector3 {
        let l = length
        precondition(l > 0, "cannot normalise a zero-length vector")
        return self * (1 / l)
    }
}

/// A 4x4 rigid transform in column-major order, matching ARKit's `simd_float4x4`.
public struct Transform: Sendable {
    public var m: [Double]
    public init(_ m: [Double]) {
        precondition(m.count == 16, "a transform has 16 elements")
        self.m = m
    }

    public static let identity = Transform([1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1])

    public func column(_ i: Int) -> Vector3 { Vector3(m[i * 4], m[i * 4 + 1], m[i * 4 + 2]) }
    public var translation: Vector3 { column(3) }

    /// Rotate a direction into world space. Translation is deliberately ignored.
    public func direction(_ v: Vector3) -> Vector3 {
        column(0) * v.x + column(1) * v.y + column(2) * v.z
    }

    public func point(_ v: Vector3) -> Vector3 { direction(v) + translation }

    /// Inverse of a rigid transform: the rotation inverts by transpose. A general
    /// 4x4 inverse would be slower and less accurate, and a camera pose is always rigid.
    public func invertedRigid() -> Transform {
        let c0 = column(0), c1 = column(1), c2 = column(2), t = translation
        return Transform([
            c0.x, c1.x, c2.x, 0,
            c0.y, c1.y, c2.y, 0,
            c0.z, c1.z, c2.z, 0,
            -c0.dot(t), -c1.dot(t), -c2.dot(t), 1,
        ])
    }

    /// Camera at `eye` looking at `target`, ARKit convention: -Z forward, +Y up.
    public static func lookAt(eye: Vector3, target: Vector3, up: Vector3 = Vector3(0, 1, 0)) -> Transform {
        let zAxis = (eye - target).normalised()
        let xAxis = up.cross(zAxis).normalised()
        let yAxis = zAxis.cross(xAxis)
        return Transform([
            xAxis.x, xAxis.y, xAxis.z, 0,
            yAxis.x, yAxis.y, yAxis.z, 0,
            zAxis.x, zAxis.y, zAxis.z, 0,
            eye.x, eye.y, eye.z, 1,
        ])
    }
}
