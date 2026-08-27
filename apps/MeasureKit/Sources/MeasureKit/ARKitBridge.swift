#if canImport(ARKit)
import ARKit
import simd

/// Conversion between ARKit's simd types and MeasureKit's platform-neutral ones.
///
/// Guarded so the package still builds and tests where ARKit does not exist -
/// which is how the measurement engine stays testable without a device.
public extension Transform {
    /// ARKit's `simd_float4x4` is already column-major, so the columns map directly.
    init(_ m: simd_float4x4) {
        self.init([
            Double(m.columns.0.x), Double(m.columns.0.y), Double(m.columns.0.z), 0,
            Double(m.columns.1.x), Double(m.columns.1.y), Double(m.columns.1.z), 0,
            Double(m.columns.2.x), Double(m.columns.2.y), Double(m.columns.2.z), 0,
            Double(m.columns.3.x), Double(m.columns.3.y), Double(m.columns.3.z), 1,
        ])
    }
}

public extension Vector3 {
    init(_ v: simd_float3) { self.init(Double(v.x), Double(v.y), Double(v.z)) }
}

public extension Intrinsics {
    /// ARKit reports intrinsics for the CAPTURED image, so a frame's intrinsics
    /// must be paired with that frame's own image size - not the view's.
    init(_ m: simd_float3x3) {
        self.init(fx: Double(m.columns.0.x), fy: Double(m.columns.1.y),
                  cx: Double(m.columns.2.x), cy: Double(m.columns.2.y))
    }
}

public extension CameraFrame {
    /// Build a frame from a live ARFrame.
    ///
    /// `imageResolution` is taken from the camera rather than the screen, because
    /// a tap in view coordinates must be mapped into image coordinates before it
    /// can be unprojected - see `Tap(viewPoint:in:)`.
    init(id: String, arFrame: ARFrame) {
        let camera = arFrame.camera
        self.init(id: id,
                  transform: Transform(camera.transform),
                  intrinsics: Intrinsics(camera.intrinsics),
                  imageWidth: Double(camera.imageResolution.width),
                  imageHeight: Double(camera.imageResolution.height))
    }
}
#endif
