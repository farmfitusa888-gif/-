#if os(iOS)
import SwiftUI
import UniformTypeIdentifiers
import MeasureKit
import TemplatCore

/// NOT COMPILED IN THIS REPOSITORY. Open in Xcode on a Mac with a LiDAR device.
@main
struct TemplatApp: App {
    var body: some Scene { WindowGroup { TemplateView() } }
}

@MainActor
final class TemplateModel: ObservableObject {
    @Published var template = Template(name: "", material: "Quartz",
                                       thickness: .inches(1.25), edges: [])
    @Published var exportError: String?
    @Published var dxf: String?

    func record(edgeID: String, measured: Length) {
        guard let i = template.edges.firstIndex(where: { $0.id == edgeID }) else { return }
        template.edges[i].measuredLength = measured
    }

    /// The refusal, surfaced to the person rather than buried.
    func export() {
        do {
            dxf = try DXFWriter.export(template)
            exportError = nil
        } catch DXFWriter.ExportError.refusedUnverifiedCutEdges(let reasons) {
            dxf = nil
            exportError = reasons.joined(separator: "\n")
        } catch {
            dxf = nil
            exportError = "\(error)"
        }
    }
}

struct TemplateView: View {
    @StateObject private var model = TemplateModel()
    @State private var measuring: Edge?

    var body: some View {
        NavigationStack {
            List {
                Section("Job") {
                    TextField("Name", text: $model.template.name)
                    TextField("Material", text: $model.template.material)
                    LabeledContent("Area", value: model.template.area.formattedSquareFeet)
                }

                Section {
                    if model.template.carryList().isEmpty {
                        Label("Every cut edge has a tape on it.", systemImage: "checkmark.seal")
                            .foregroundStyle(.green)
                    }
                    ForEach(model.template.carryList()) { e in
                        Button { measuring = e } label: {
                            VStack(alignment: .leading, spacing: 2) {
                                Text("Edge \(e.id)").font(.headline)
                                Text("Scan says \(e.scannedLength.formatted())")
                                    .font(.caption).foregroundStyle(.secondary)
                            }
                        }
                    }
                } header: {
                    Text("Put a tape on these")
                } footer: {
                    Text("Ranked longest first - an error on a long run costs more. "
                         + "Wall edges are not listed: nothing is sawn to them.")
                }

                if let worst = model.template.worstDiscrepancy {
                    Section("Tape vs scan") {
                        LabeledContent("Largest disagreement",
                                       value: worst.formatted(denominator: 32))
                        Text("This is the only accuracy figure this product has, and it "
                             + "comes from your jobs rather than a marketing claim.")
                            .font(.caption2).foregroundStyle(.secondary)
                    }
                }

                Section {
                    if let e = model.exportError {
                        Label("Will not export", systemImage: "xmark.octagon")
                            .foregroundStyle(.red)
                        Text(e).font(.caption).foregroundStyle(.secondary)
                    }
                    Button("Export to CNC") { model.export() }
                        .disabled(!model.template.canExportToCNC)
                    if let dxf = model.dxf {
                        ShareLink(item: DXFFile(text: dxf),
                                  preview: SharePreview("\(model.template.name).dxf")) {
                            Label("Send the DXF", systemImage: "square.and.arrow.up")
                        }
                    }
                }
            }
            .navigationTitle("Template")
            .sheet(item: $measuring) { e in
                EdgeSheet(edge: e) { measured in
                    model.record(edgeID: e.id, measured: measured)
                    measuring = nil
                }
            }
        }
    }
}

struct EdgeSheet: View {
    let edge: Edge
    var onSave: (Length) -> Void
    @State private var typed = ""

    private var parsed: Length? { Length.parse(typed) }

    private var disagreement: Length? {
        guard let v = parsed else { return nil }
        return Length(nanometres: abs(v.nanometres - edge.scannedLength.nanometres))
    }

    var body: some View {
        NavigationStack {
            Form {
                Section("Edge \(edge.id)") {
                    LabeledContent("Scan says", value: edge.scannedLength.formatted())
                }
                Section("What the tape says") {
                    TextField("e.g. 8' 0 1/8\"", text: $typed).autocorrectionDisabled()
                    if !typed.isEmpty && parsed == nil {
                        Text("Try 96\", 8', or 8' 0 1/8\".")
                            .font(.caption).foregroundStyle(.red)
                    }
                    if let d = disagreement {
                        Text("Differs from the scan by \(d.formatted(denominator: 32))")
                            .font(.caption).foregroundStyle(.secondary)
                    }
                }
                Button("Save") { if let v = parsed { onSave(v) } }
                    .disabled(parsed == nil)
            }
            .navigationTitle("Measure the edge")
        }
    }
}

struct DXFFile: Transferable {
    let text: String
    static var transferRepresentation: some TransferRepresentation {
        DataRepresentation(exportedContentType: .data) { Data($0.text.utf8) }
    }
}
#endif
