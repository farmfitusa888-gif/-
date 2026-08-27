#if os(iOS)
import SwiftUI
import UIKit
import MeasureKit
import OpenWallCore

/// Holds the taps a person makes and turns them into runs.
///
/// The rule this screen enforces: a point needs taps from two DIFFERENT frames.
/// Two taps on the same photograph triangulate to nothing, and letting a person
/// do it would produce a confident, meaningless number.
@MainActor
public final class TraceModel: ObservableObject {
    @Published public var service: Service = .coldWater
    @Published public var pendingTaps: [Tap] = []
    @Published public var points: [TracePoint] = []
    @Published public var runs: [Run] = []
    @Published public var lastError: String?

    private var counter = 0

    public var canCommitPoint: Bool {
        Set(pendingTaps.map(\.frame.id)).count >= 2
    }

    public func add(_ tap: Tap) { pendingTaps.append(tap) }

    public func commitPoint(note: String?) {
        guard canCommitPoint else {
            lastError = "Tap the same spot on a second photo taken from somewhere else."
            return
        }
        counter += 1
        guard let point = TracePoint.triangulated(id: "p\(counter)",
                                                  taps: pendingTaps, note: note) else {
            lastError = "Those views are too close together to place the point. "
                + "Use two photos taken further apart."
            counter -= 1
            return
        }
        points.append(point)
        pendingTaps = []
        lastError = nil
    }

    /// Record a span the person could not see, between two points they could.
    public func addInferredPoint(at position: Point3, note: String) {
        counter += 1
        points.append(TracePoint(id: "p\(counter)", position: position,
                                 provenance: .derived, note: note))
    }

    public func commitRun(label: String) {
        do {
            runs.append(try Run(id: "r\(runs.count + 1)", service: service,
                                label: label, points: points))
            points = []
            lastError = nil
        } catch {
            lastError = "A run needs at least two points."
        }
    }
}

struct TraceView: View {
    @ObservedObject var capture: CaptureModel
    @ObservedObject var trace: TraceModel
    @State private var selected: CaptureModel.Keyframe?
    @State private var label = ""
    var onDone: () -> Void

    var body: some View {
        VStack(spacing: 0) {
            Picker("Service", selection: $trace.service) {
                ForEach(Service.allCases, id: \.self) { Text($0.label).tag($0) }
            }
            .pickerStyle(.menu).padding(.horizontal)

            frameStrip

            if let selected {
                GeometryReader { geo in
                    Image(uiImage: UIImage(data: selected.jpeg) ?? UIImage())
                        .resizable().scaledToFill()
                        .clipped()
                        .onTapGesture { location in
                            trace.add(capture.tap(atViewPoint: location,
                                                  viewSize: geo.size, on: selected))
                        }
                }
            } else {
                ContentUnavailableView("Pick a photo", systemImage: "photo",
                                       description: Text("Then tap the pipe or cable in it."))
            }

            controls
        }
    }

    private var frameStrip: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack {
                ForEach(capture.keyframes) { kf in
                    Button { selected = kf } label: {
                        Image(uiImage: UIImage(data: kf.jpeg) ?? UIImage())
                            .resizable().scaledToFill()
                            .frame(width: 68, height: 68).clipped()
                            .overlay(RoundedRectangle(cornerRadius: 4)
                                .stroke(selected?.id == kf.id ? Color.accentColor : .clear,
                                        lineWidth: 3))
                    }
                }
            }.padding(.horizontal)
        }.frame(height: 84)
    }

    private var controls: some View {
        VStack(spacing: 8) {
            if let e = trace.lastError {
                Text(e).font(.footnote).foregroundStyle(.red)
                    .multilineTextAlignment(.center)
            }
            Text("\(trace.pendingTaps.count) taps on "
                 + "\(Set(trace.pendingTaps.map(\.frame.id)).count) different photos")
                .font(.footnote).foregroundStyle(.secondary)

            HStack {
                Button("Place point") { trace.commitPoint(note: nil) }
                    .buttonStyle(.borderedProminent)
                    .disabled(!trace.canCommitPoint)
                Button("Clear taps") { trace.pendingTaps = [] }
            }

            HStack {
                TextField("Run name, e.g. Cold water to sink", text: $label)
                    .textFieldStyle(.roundedBorder)
                Button("Finish run") {
                    trace.commitRun(label: label.isEmpty ? trace.service.label : label)
                    label = ""
                }.disabled(trace.points.count < 2)
            }

            Button("Done - \(trace.runs.count) runs", action: onDone)
                .disabled(trace.runs.isEmpty)
        }
        .padding()
    }
}
#endif
