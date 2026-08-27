#if os(iOS)
import ARKit
import SwiftUI
import MeasureKit
import OpenWallCore

/// NOT COMPILED IN THIS REPOSITORY. Open in Xcode on a Mac with a LiDAR device.
@main
struct OpenWallApp: App {
    var body: some Scene {
        WindowGroup { RootView() }
    }
}

struct RootView: View {
    @StateObject private var capture = CaptureModel()
    @StateObject private var trace = TraceModel()
    @State private var stage: Stage = .capture

    enum Stage { case capture, trace, review }

    var body: some View {
        NavigationStack {
            Group {
                switch stage {
                case .capture: CaptureView(capture: capture, onDone: { stage = .trace })
                case .trace: TraceView(capture: capture, trace: trace,
                                       onDone: { stage = .review })
                case .review: ReviewView(trace: trace, onBack: { stage = .trace })
                }
            }
            .navigationTitle(title)
            .navigationBarTitleDisplayMode(.inline)
        }
        .onAppear { capture.start() }
        .onDisappear { capture.stop() }
    }

    private var title: String {
        switch stage {
        case .capture: return "Walk the open wall"
        case .trace: return "Tap each run twice"
        case .review: return "The record"
        }
    }
}

struct CaptureView: View {
    @ObservedObject var capture: CaptureModel
    var onDone: () -> Void

    var body: some View {
        ZStack(alignment: .bottom) {
            ARViewContainer(session: capture.session).ignoresSafeArea()
            VStack(spacing: 12) {
                Text(capture.statusMessage)
                    .font(.callout).multilineTextAlignment(.center)
                    .padding(10)
                    .background(.ultraThinMaterial, in: RoundedRectangle(cornerRadius: 8))
                Button("Done - \(capture.keyframes.count) views", action: onDone)
                    .buttonStyle(.borderedProminent)
                    // Two views is the arithmetic minimum; four is the practical one.
                    .disabled(capture.keyframes.count < 4)
            }
            .padding()
        }
    }
}

struct ARViewContainer: UIViewRepresentable {
    let session: ARSession

    func makeUIView(context: Context) -> ARSCNView {
        let view = ARSCNView()
        view.session = session
        view.automaticallyUpdatesLighting = true
        return view
    }

    func updateUIView(_ view: ARSCNView, context: Context) {}
}
#endif
