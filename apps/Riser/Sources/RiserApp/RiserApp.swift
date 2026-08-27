#if canImport(SwiftUI)
import SwiftUI
import MeasureKit
import RiserCore

/// NOT COMPILED IN THIS REPOSITORY. Open in Xcode on a Mac.
///
/// Everything that decides whether a report is correct lives in `RiserCore`,
/// which is tested without a device on purpose.
@main
struct RiserApp: App {
    var body: some Scene { WindowGroup { InspectionView() } }
}

@MainActor
final class InspectionModel: ObservableObject {
    @Published var building = Building(name: "", address: "", devices: [])
    @Published var inspectorName = ""
    @Published var results: [CheckResult] = []
    @Published var checkpoints: [Checkpoint] = []
    @Published var rendered: String?
    @Published var failure: String?

    /// Every checkpoint must be answered before a report exists. "I could not
    /// check this" is an answer; silence is not.
    var expectedIDs: [String] {
        building.devices.flatMap { d in
            checkpoints.filter { $0.appliesTo == d.kind }.map { "\(d.id)/\($0.id)" }
        }
    }

    var outstanding: [String] {
        Inspection(building: building, performedOn: "", inspectorName: "", results: results)
            .unanswered(against: expectedIDs)
    }

    func answer(device: Device, checkpoint: Checkpoint, answer: Answer) {
        results.removeAll { $0.deviceID == device.id && $0.checkpoint.id == checkpoint.id }
        results.append(CheckResult(deviceID: device.id, checkpoint: checkpoint, answer: answer))
    }

    func build(performedOn: String, quote: Quote?) {
        let inspection = Inspection(building: building, performedOn: performedOn,
                                    inspectorName: inspectorName, results: results)
        do {
            rendered = try ReportBuilder.render(inspection,
                                                deficiencies: DeficiencyBuilder.from(inspection),
                                                quote: quote)
            failure = nil
        } catch {
            rendered = nil
            failure = "Could not build the report: \(error)"
        }
    }
}

struct InspectionView: View {
    @StateObject private var model = InspectionModel()
    @State private var showingNotVerified: (Device, Checkpoint)?

    var body: some View {
        NavigationStack {
            List {
                Section("Building") {
                    TextField("Name", text: $model.building.name)
                    TextField("Address", text: $model.building.address)
                    TextField("Inspector", text: $model.inspectorName)
                }

                Section {
                    ForEach(model.building.devices) { device in
                        DisclosureGroup("\(device.id) - \(device.kind.label), \(device.location)") {
                            ForEach(model.checkpoints.filter { $0.appliesTo == device.kind }) { cp in
                                CheckpointRow(device: device, checkpoint: cp, model: model,
                                              onNotVerified: { showingNotVerified = (device, cp) })
                            }
                        }
                    }
                } header: {
                    Text("Devices")
                } footer: {
                    // The completeness rule, made visible rather than enforced silently.
                    Text(model.outstanding.isEmpty
                         ? "Every checkpoint has an answer."
                         : "\(model.outstanding.count) checkpoint(s) still unanswered. "
                           + "An unanswered checkpoint is not a pass.")
                    .foregroundStyle(model.outstanding.isEmpty ? .secondary : .orange)
                }
            }
            .navigationTitle("Inspection")
            .sheet(item: Binding(
                get: { showingNotVerified.map { NotVerifiedTarget(device: $0.0, checkpoint: $0.1) } },
                set: { if $0 == nil { showingNotVerified = nil } }
            )) { target in
                NotVerifiedSheet(target: target) { reason, note in
                    model.answer(device: target.device, checkpoint: target.checkpoint,
                                 answer: .notVerified(reason: reason, note: note))
                    showingNotVerified = nil
                }
            }
        }
    }
}

struct NotVerifiedTarget: Identifiable {
    var device: Device
    var checkpoint: Checkpoint
    var id: String { "\(device.id)/\(checkpoint.id)" }
}

struct CheckpointRow: View {
    let device: Device
    let checkpoint: Checkpoint
    @ObservedObject var model: InspectionModel
    var onNotVerified: () -> Void

    var body: some View {
        VStack(alignment: .leading, spacing: 6) {
            Text(checkpoint.text).font(.callout)
            Text(checkpoint.citation).font(.caption2).foregroundStyle(.secondary)
            HStack {
                Button("Pass") { model.answer(device: device, checkpoint: checkpoint, answer: .pass) }
                    .buttonStyle(.bordered)
                Menu("Fail") {
                    ForEach(Severity.allCases, id: \.self) { s in
                        Button(s.label) {
                            model.answer(device: device, checkpoint: checkpoint,
                                         answer: .fail(severity: s, note: ""))
                        }
                    }
                }.buttonStyle(.bordered)
                // Deliberately as prominent as Pass. Making it hard to reach is
                // how every other product ends up with silent passes.
                Button("Couldn't check", action: onNotVerified).buttonStyle(.bordered)
            }
        }.padding(.vertical, 4)
    }
}

struct NotVerifiedSheet: View {
    let target: NotVerifiedTarget
    var onSave: (NotVerifiedReason, String) -> Void
    @State private var reason: NotVerifiedReason = .inaccessible
    @State private var note = ""

    var body: some View {
        NavigationStack {
            Form {
                Picker("Why not", selection: $reason) {
                    ForEach(NotVerifiedReason.allCases, id: \.self) { Text($0.label).tag($0) }
                }
                TextField("Detail (what exactly stopped you)", text: $note, axis: .vertical)
                Text("This will print on the report as NOT VERIFIED. It is not a pass.")
                    .font(.footnote).foregroundStyle(.secondary)
            }
            .navigationTitle("Could not check")
            .toolbar { ToolbarItem(placement: .confirmationAction) {
                Button("Save") { onSave(reason, note) }
            } }
        }
    }
}
#endif
