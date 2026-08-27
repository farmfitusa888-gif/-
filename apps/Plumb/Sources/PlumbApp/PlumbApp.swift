#if canImport(SwiftUI)
import SwiftUI
import MeasureKit
import PlumbCore

/// NOT COMPILED IN THIS REPOSITORY. Open in Xcode on a Mac with a LiDAR device.
@main
struct PlumbApp: App {
    var body: some Scene { WindowGroup { SurveyView() } }
}

@MainActor
final class SurveyModel: ObservableObject {
    @Published var siteName = ""
    @Published var address = ""
    @Published var surveyorName = ""
    @Published var credential = ""
    @Published var area: SurveyArea = .entrance
    @Published var observations: [Observation] = []
    @Published var rendered: String?

    var survey: Survey {
        Survey(siteName: siteName, address: address, surveyedOn: Self.today(),
               surveyorName: surveyorName,
               credential: credential.isEmpty ? nil : credential,
               standard: .ada2010, observations: observations)
    }

    /// Record a length, marking how it was obtained.
    ///
    /// The scan gives a value; a tape overrides it. Only a barrier resting on a
    /// tape may be issued, which is why `Survey.isIssuable` gates the export.
    func record(_ checkpoint: SurveyCheckpoint, location: String,
                value: Length, provenance: Provenance) {
        let finding = Evaluator.evaluate(checkpoint,
                                         measured: Provenanced(value, provenance))
        observations.append(Observation(id: "\(checkpoint.id)-\(observations.count)",
                                        checkpoint: checkpoint, location: location,
                                        finding: finding))
    }

    func recordSlope(_ checkpoint: SurveyCheckpoint, location: String,
                     inertial: Slope, geometry: Slope, provenance: Provenance) {
        let checked = CrossCheckedSlope(fromInertial: inertial, fromGeometry: geometry,
                                        provenance: provenance)
        observations.append(Observation(id: "\(checkpoint.id)-\(observations.count)",
                                        checkpoint: checkpoint, location: location,
                                        finding: Evaluator.evaluate(checkpoint, slope: checked)))
    }

    func recordNotMeasured(_ checkpoint: SurveyCheckpoint, location: String, reason: String) {
        observations.append(Observation(id: "\(checkpoint.id)-\(observations.count)",
                                        checkpoint: checkpoint, location: location,
                                        finding: .notMeasured(reason: reason)))
    }

    func build() { rendered = try? SurveyReportBuilder.render(survey) }

    static func today() -> String {
        let f = DateFormatter(); f.dateFormat = "yyyy-MM-dd"
        return f.string(from: Date())
    }
}

struct SurveyView: View {
    @StateObject private var model = SurveyModel()
    @State private var entry: SurveyCheckpoint?

    var body: some View {
        NavigationStack {
            List {
                Section("Site") {
                    TextField("Site name", text: $model.siteName)
                    TextField("Address", text: $model.address)
                    TextField("Surveyor", text: $model.surveyorName)
                    TextField("Credential (e.g. CASp number)", text: $model.credential)
                }

                Section("Area") {
                    Picker("Area", selection: $model.area) {
                        ForEach(SurveyArea.allCases, id: \.self) { Text($0.label).tag($0) }
                    }.pickerStyle(.menu)

                    ForEach(CheckpointLibrary.checkpoints(for: model.area)) { cp in
                        Button {
                            entry = cp
                        } label: {
                            VStack(alignment: .leading, spacing: 2) {
                                Text(cp.text).font(.callout)
                                Text("\(cp.clause) - \(cp.requirement.summary)")
                                    .font(.caption).foregroundStyle(.secondary)
                            }
                        }
                    }
                }

                Section("Findings") {
                    ForEach(model.survey.barriers) { b in
                        VStack(alignment: .leading, spacing: 2) {
                            Text(b.location).font(.headline)
                            Text("Found \(b.found), needs \(b.required)")
                                .font(.caption).foregroundStyle(.red)
                            Text(b.provenance.label)
                                .font(.caption2)
                                .foregroundStyle(b.provenance.isIssuable ? .secondary : .orange)
                        }
                    }
                }

                Section {
                    if !model.survey.isIssuable && !model.observations.isEmpty {
                        Label("Not issuable: \(model.survey.unverifiedBarriers.count) "
                              + "barrier(s) need a tape.", systemImage: "exclamationmark.triangle")
                            .foregroundStyle(.orange)
                    }
                    Button("Build the survey report") { model.build() }
                        .disabled(model.observations.isEmpty)
                    if let html = model.rendered {
                        ShareLink(item: html, preview: SharePreview("Barrier survey")) {
                            Label("Export", systemImage: "square.and.arrow.up")
                        }
                    }
                }
            }
            .navigationTitle("Barrier survey")
            .sheet(item: $entry) { cp in
                MeasurementSheet(checkpoint: cp) { location, value, provenance in
                    model.record(cp, location: location, value: value, provenance: provenance)
                    entry = nil
                } onNotMeasured: { location, reason in
                    model.recordNotMeasured(cp, location: location, reason: reason)
                    entry = nil
                }
            }
        }
    }
}

struct MeasurementSheet: View {
    let checkpoint: SurveyCheckpoint
    var onSave: (String, Length, Provenance) -> Void
    var onNotMeasured: (String, String) -> Void

    @State private var location = ""
    @State private var typed = ""
    @State private var reason = ""

    /// What the person typed, parsed exactly. Nil until it is a real measurement.
    private var parsed: Length? { Length.parse(typed) }

    var body: some View {
        NavigationStack {
            Form {
                Section(checkpoint.clause) {
                    Text(checkpoint.text)
                    Text("Requirement: \(checkpoint.requirement.summary)")
                        .font(.caption).foregroundStyle(.secondary)
                }
                Section("Where") { TextField("e.g. Front entrance door", text: $location) }
                Section("Measured") {
                    TextField("e.g. 2' 10 3/8\"", text: $typed)
                        .autocorrectionDisabled()
                    if !typed.isEmpty && parsed == nil {
                        Text("Not a measurement. Try 32\", 2' 8\", or 2' 8 1/2\".")
                            .font(.caption).foregroundStyle(.red)
                    }
                    Button("Save as measured") {
                        if let v = parsed { onSave(location, v, .measured) }
                    }.disabled(parsed == nil || location.isEmpty)
                }
                Section("Could not measure") {
                    TextField("Why not", text: $reason)
                    Button("Record as not measured") {
                        onNotMeasured(location, reason)
                    }.disabled(reason.isEmpty || location.isEmpty)
                }
            }
            .navigationTitle("Checkpoint")
        }
    }
}
#endif
