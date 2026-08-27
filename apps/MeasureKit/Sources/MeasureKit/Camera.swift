import Foundation

/// Pinhole intrinsics in pixels, as ARKit reports them.
public struct Intrinsics: Sendable {
    public var fx: Double, fy: Double, cx: Double, cy: Double
    public init(fx: Double, fy: Double, cx: Double, cy: Double) {
        precondition(fx != 0 && fy != 0, "focal length cannot be zero")
        self.fx = fx; self.fy = fy; self.cx = cx; self.cy = cy
    }
}

public struct CameraFrame: Sendable {
    public var id: String
    /// Camera-to-world, ARKit convention (-Z forward, +Y up).
    public var transform: Transform
    public var intrinsics: Intrinsics
    public var imageWidth: Double
    public var imageHeight: Double

    public init(id: String, transform: Transform, intrinsics: Intrinsics,
                imageWidth: Double, imageHeight: Double) {
        self.id = id; self.transform = transform; self.intrinsics = intrinsics
        self.imageWidth = imageWidth; self.imageHeight = imageHeight
    }
}

public struct Ray: Sendable {
    public var origin: Vector3
    /// Unit length.
    public var direction: Vector3
    public init(origin: Vector3, direction: Vector3) {
        self.origin = origin; self.direction = direction
    }
}

/// A tap on a photograph, in pixels, origin top-left.
public struct Tap: Sendable {
    public var frame: CameraFrame
    public var x: Double, y: Double
    public init(frame: CameraFrame, x: Double, y: Double) {
        self.frame = frame; self.x = x; self.y = y
    }
    public var ray: Ray { frame.ray(throughX: x, y: y) }
}

public extension CameraFrame {
    /// Unproject a pixel into a world-space ray.
    ///
    /// Image y runs down and camera y runs up, so the y term is negated. Camera z
    /// is -1 because ARKit's camera looks along its own -Z.
    func ray(throughX px: Double, y py: Double) -> Ray {
        let inCamera = Vector3((px - intrinsics.cx) / intrinsics.fx,
                               -(py - intrinsics.cy) / intrinsics.fy,
                               -1)
        return Ray(origin: transform.translation,
                   direction: transform.direction(inCamera).normalised())
    }

    /// Project a world point back onto this frame - what draws a traced run over
    /// the photograph it was traced in.
    func project(_ world: Vector3) -> Projection {
        let p = transform.invertedRigid().point(world)
        let depth = -p.z
        guard depth != 0 else {
            return Projection(x: .nan, y: .nan, isInFront: false, isOnImage: false)
        }
        let x = intrinsics.fx * p.x / depth + intrinsics.cx
        let y = intrinsics.cy - intrinsics.fy * p.y / depth
        let inFront = depth > 0
        return Projection(x: x, y: y, isInFront: inFront,
                          isOnImage: inFront && x >= 0 && y >= 0
                                     && x <= imageWidth && y <= imageHeight)
    }
}

public struct Projection: Sendable {
    public var x: Double, y: Double
    /// False when the point is behind the camera, where the maths still yields numbers.
    public var isInFront: Bool
    public var isOnImage: Bool
}
