#if os(iOS)
import ARKit
import simd

/// Conversion between ARKit's simd types and MeasureKit's platform-neutral ones.
///
/// The guard is `os(iOS)`, NOT `canImport(ARKit)`.
///
/// `canImport(ARKit)` is TRUE on macOS - the framework ships there - but
/// `ARFrame`, `ARSession` and `ARCamera` are iOS-only, so the guard passed and
/// then every type in this file failed to resolve. That broke `swift test` on a
/// Mac with `cannot find type 'ARFrame' in scope`, which is exactly the class of
/// error a compiler catches in a second and a careful reader does not.
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
