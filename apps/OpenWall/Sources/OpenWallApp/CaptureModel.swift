#if canImport(ARKit)
import ARKit
import CoreImage
import UIKit
import Combine
import Foundation
import MeasureKit
import OpenWallCore

/// Owns the AR session and the frames a trace is built from.
///
/// NOT COMPILED IN THIS REPOSITORY - this file needs Xcode and a LiDAR device.
/// Everything it depends on for correctness lives in `OpenWallCore` and
/// `MeasureKit`, which are tested without a device on purpose.
@MainActor
public final class CaptureModel: NSObject, ObservableObject {

    /// Frames kept for tracing. A trace needs two views of the same pipe from
    /// meaningfully different positions, so frames are kept on movement rather
    /// than on a timer - a burst taken standing still is useless for triangulation.
    @Published public private(set) var keyframes: [Keyframe] = []
    @Published public private(set) var trackingIsUsable = false
    @Published public private(set) var statusMessage = "Move the phone slowly across the open wall."

    public struct Keyframe: Identifiable, Sendable {
        public let id: String
        public let frame: CameraFrame
        public let jpeg: Data
        public let position: Vector3
    }

    /// Below this baseline two frames triangulate badly, as the MeasureKit tests
    /// show: a wider baseline beats a narrow one for the same tap error.
    public static let minimumBaselineMetres = 0.25
    public static let maximumKeyframes = 40

    public let session = ARSession()
    private var lastCaptureOrigin: Vector3?
    private var counter = 0

    public override init() {
        super.init()
        session.delegate = self
    }

    public func start() {
        guard ARWorldTrackingConfiguration.isSupported else {
            statusMessage = "This device cannot run world tracking."
            return
        }
        let config = ARWorldTrackingConfiguration()
        config.worldAlignment = .gravity
        if ARWorldTrackingConfiguration.supportsSceneReconstruction(.mesh) {
            config.sceneReconstruction = .mesh
        }
        config.environmentTexturing = .none
        session.run(config, options: [.resetTracking, .removeExistingAnchors])
    }

    public func stop() { session.pause() }

    /// A tap in SwiftUI view coordinates, mapped into the captured image's frame.
    ///
    /// The view and the camera image are different sizes and often different
    /// aspect ratios. Unprojecting a raw view coordinate is the classic way to
    /// get a confidently wrong position, so the mapping is explicit.
    public func tap(atViewPoint point: CGPoint, viewSize: CGSize,
                    on keyframe: Keyframe) -> Tap {
        let imageWidth = keyframe.frame.imageWidth
        let imageHeight = keyframe.frame.imageHeight
        // Aspect-fill: the image is scaled to cover the view, then centred.
        let scale = max(viewSize.width / imageWidth, viewSize.height / imageHeight)
        let shownWidth = imageWidth * scale
        let shownHeight = imageHeight * scale
        let originX = (viewSize.width - shownWidth) / 2
        let originY = (viewSize.height - shownHeight) / 2
        return Tap(frame: keyframe.frame,
                   x: (Double(point.x) - originX) / scale,
                   y: (Double(point.y) - originY) / scale)
    }
}

extension CaptureModel: ARSessionDelegate {

    nonisolated public func session(_ session: ARSession, didUpdate frame: ARFrame) {
        let transform = Transform(frame.camera.transform)
        let origin = transform.translation
        let quality = frame.camera.trackingState

        Task { @MainActor in
            switch quality {
            case .normal:
                self.trackingIsUsable = true
            case .limited(let reason):
                self.trackingIsUsable = false
                self.statusMessage = Self.describe(reason)
            case .notAvailable:
                self.trackingIsUsable = false
                self.statusMessage = "Tracking unavailable."
            }
            guard self.trackingIsUsable else { return }
            guard self.keyframes.count < Self.maximumKeyframes else { return }
            if let last = self.lastCaptureOrigin,
               (origin - last).length < Self.minimumBaselineMetres { return }

            guard let jpeg = Self.jpeg(from: frame) else { return }
            self.counter += 1
            self.lastCaptureOrigin = origin
            self.keyframes.append(Keyframe(id: "f\(self.counter)",
                                           frame: CameraFrame(id: "f\(self.counter)", arFrame: frame),
                                           jpeg: jpeg,
                                           position: origin))
            self.statusMessage = "\(self.keyframes.count) views kept. "
                + "Keep moving sideways, not just turning."
        }
    }

    static func describe(_ reason: ARCamera.TrackingState.Reason) -> String {
        switch reason {
        case .initializing: return "Starting up - move the phone gently."
        case .excessiveMotion: return "Too fast. Slow down."
        case .insufficientFeatures: return "Not enough detail. More light, or aim at texture."
        case .relocalizing: return "Finding the room again."
        @unknown default: return "Tracking limited."
        }
    }

    static func jpeg(from frame: ARFrame) -> Data? {
        let ci = CIImage(cvPixelBuffer: frame.capturedImage)
        let context = CIContext()
        guard let cg = context.createCGImage(ci, from: ci.extent) else { return nil }
        return UIImage(cgImage: cg).jpegData(compressionQuality: 0.75)
    }
}
#endif
