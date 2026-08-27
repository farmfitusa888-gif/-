#if os(iOS)
import SwiftUI
import MeasureKit
import FlatlineCore

/// NOT COMPILED IN THIS REPOSITORY. Open in Xcode on a Mac with a LiDAR device.
@main
struct FlatlineApp: App {
    var body: some Scene { WindowGroup { FloorView() } }
}

@MainActor
final class FloorModel: ObservableObject {
    @Published var roomName = ""
    @Published var jobAddress = ""
    @Published var installerName = ""
    @Published var tolerance: FlatnessTolerance = .lvpSixFoot
    @Published var samples: [SurfaceSample] = []
    @Published var suspects: [Suspect] = []
    @Published var areaSquareFeet: Double = 0
    @Published var rendered: String?

    var survey: FloorSurvey {
        FloorSurvey(roomName: roomName, tolerance: tolerance, samples: samples,
                    suspects: suspects, area: .squareFeet(areaSquareFeet))
    }

    /// Turn a scan into a ranked list of places to put a straightedge.
    ///
    /// The phone never decides whether the floor passes. It decides where to
    /// look, which is a much weaker claim and one it can actually support.
    func deriveSuspects(from scan: [ScanPoint], along line: [SurfaceSample]) {
        samples = line.sorted { $0.position < $1.position }
        var found: [Suspect] = []
        for (i, s) in samples.enumerated() {
            let window = samples.filter {
                $0.position.nanometres >= s.position.nanometres
                    && $0.position.nanometres <= s.position.nanometres + tolerance.span.nanometres
            }
            guard window.count >= 2 else { continue }
            let gap = deepestDropBelowHull(window)
            if gap.nanometres > 0 {
                found.append(Suspect(id: "s\(i)", along: s.position, scannedGap: gap))
            }
        }
        suspects = found
    }

    func record(_ id: String, measured: Length) {
        guard let i = suspects.firstIndex(where: { $0.id == id }) else { return }
        suspects[i].measuredGap = measured
    }

    func build(quote: Quote?) {
        rendered = try? ChangeOrderBuilder.render(
            survey, quote: quote, installerName: installerName,
            jobAddress: jobAddress, preparedOn: Self.today())
    }

    static func today() -> String {
        let f = DateFormatter(); f.dateFormat = "yyyy-MM-dd"
        return f.string(from: Date())
    }
}

struct FloorView: View {
    @StateObject private var model = FloorModel()
    @State private var measuring: Suspect?

    var body: some View {
        NavigationStack {
            List {
                Section("Job") {
                    TextField("Room", text: $model.roomName)
                    TextField("Address", text: $model.jobAddress)
                    TextField("Your company", text: $model.installerName)
                    Picker("Tolerance", selection: $model.tolerance) {
                        ForEach(FlatnessTolerance.all, id: \.self) { Text($0.summary).tag($0) }
                    }
                    Text(model.tolerance.source).font(.caption2).foregroundStyle(.secondary)
                }

                Section {
                    Text(E1155.refusal)
                        .font(.footnote)
                        .foregroundStyle(.orange)
                } header: {
                    Text("What this is not")
                }

                Section("Put a straightedge here") {
                    if model.survey.carryList().isEmpty {
                        Text("Scan the floor to get a list.").foregroundStyle(.secondary)
                    }
                    ForEach(model.survey.carryList()) { s in
                        Button { measuring = s } label: {
                            HStack {
                                VStack(alignment: .leading) {
                                    Text("At \(s.along.formatted())").font(.headline)
                                    Text("Scan says about "
                                         + s.scannedGap.value.formatted(denominator: 32))
                                        .font(.caption).foregroundStyle(.secondary)
                                }
                                Spacer()
                                Image(systemName: "ruler")
                            }
                        }
                    }
                }

                Section("Measured") {
                    ForEach(model.suspects.filter { $0.measuredGap != nil }) { s in
                        HStack {
                            Text(s.along.formatted())
                            Spacer()
                            Text(s.gap.value.formatted(denominator: 32))
                                .foregroundStyle(s.exceeds(model.tolerance) ? .red : .primary)
                        }
                    }
                }

                Section {
                    if !model.survey.isIssuable && !model.suspects.isEmpty {
                        Label("Not issuable yet - a failing spot still needs a straightedge.",
                              systemImage: "exclamationmark.triangle")
                            .foregroundStyle(.orange)
                    }
                    Button("Build the change order") { model.build(quote: nil) }
                        .disabled(model.suspects.isEmpty)
                    if let html = model.rendered {
                        ShareLink(item: html, preview: SharePreview("Floor prep change order")) {
                            Label("Send it", systemImage: "square.and.arrow.up")
                        }
                    }
                }
            }
            .navigationTitle("Floor prep")
            .sheet(item: $measuring) { s in
                GapSheet(suspect: s, tolerance: model.tolerance) { measured in
                    model.record(s.id, measured: measured)
                    measuring = nil
                }
            }
        }
    }
}

struct GapSheet: View {
    let suspect: Suspect
    let tolerance: FlatnessTolerance
    var onSave: (Length) -> Void
    @State private var typed = ""

    private var parsed: Length? { Length.parse(typed) }

    var body: some View {
        NavigationStack {
            Form {
                Section {
                    Text("Lay a \(tolerance.span.formatted()) straightedge at "
                         + suspect.along.formatted())
                    Text("Measure the largest gap underneath it.")
                        .font(.caption).foregroundStyle(.secondary)
                }
                Section("What you read") {
                    TextField("e.g. 3/16\"", text: $typed).autocorrectionDisabled()
                    if !typed.isEmpty && parsed == nil {
                        Text("Try 1/8\", 3/16\", or 1/4\".")
                            .font(.caption).foregroundStyle(.red)
                    }
                    if let v = parsed {
                        Text(v > tolerance.gap
                             ? "Over tolerance - this becomes prep."
                             : "Within tolerance.")
                            .font(.caption)
                            .foregroundStyle(v > tolerance.gap ? .red : .green)
                    }
                }
                Button("Save") { if let v = parsed { onSave(v) } }
                    .disabled(parsed == nil)
            }
            .navigationTitle("Straightedge reading")
        }
    }
}
#endif
