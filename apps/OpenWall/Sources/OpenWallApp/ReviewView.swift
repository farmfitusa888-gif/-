#if os(iOS)
import SwiftUI
import UniformTypeIdentifiers
import MeasureKit
import OpenWallCore

struct ReviewView: View {
    @ObservedObject var trace: TraceModel
    @State private var address = ""
    @State private var contractor = ""
    @State private var homeowner = ""
    @State private var capturedOn = Self.today()
    @State private var rendered: String?
    @State private var failure: String?
    var onBack: () -> Void

    var body: some View {
        Form {
            Section("The job") {
                TextField("Property address", text: $address)
                TextField("Your company", text: $contractor)
                TextField("Homeowner (optional)", text: $homeowner)
                TextField("Date recorded", text: $capturedOn)
            }

            Section("Runs") {
                ForEach(trace.runs) { run in
                    VStack(alignment: .leading, spacing: 2) {
                        Text(run.label).font(.headline)
                        Text("\(run.service.label) · \(run.totalLength.formatted())")
                            .font(.caption).foregroundStyle(.secondary)
                        if run.inferredLength > .zero {
                            Text("\(run.inferredLength.formatted()) inferred, not seen")
                                .font(.caption).foregroundStyle(.orange)
                        }
                        if let worst = run.worstTolerance {
                            Text("Largest ray disagreement "
                                 + worst.formatted(denominator: 32))
                                .font(.caption).foregroundStyle(.secondary)
                        }
                    }
                }
            }

            Section {
                Button("Build the record") { build() }
                    .disabled(address.isEmpty || contractor.isEmpty || trace.runs.isEmpty)
                if let rendered {
                    ShareLink(item: RecordFile(html: rendered),
                              preview: SharePreview("Behind the walls - \(address)")) {
                        Label("Send to the homeowner", systemImage: "square.and.arrow.up")
                    }
                }
                if let failure {
                    Text(failure).font(.footnote).foregroundStyle(.red)
                }
                Button("Back to tracing", action: onBack)
            }
        }
    }

    private func build() {
        let job = Job(propertyAddress: address,
                      capturedOn: capturedOn,
                      contractorName: contractor,
                      homeownerName: homeowner.isEmpty ? nil : homeowner,
                      rooms: [Room(id: "r1", name: "Recorded area", runs: trace.runs)])
        do {
            rendered = try RecordBuilder.render(job)
            failure = nil
        } catch {
            rendered = nil
            failure = "Could not build the record: \(error)"
        }
    }

    /// ISO date, taken once at screen entry rather than inside the renderer, so
    /// the document stays a pure function of its input.
    private static func today() -> String {
        let f = DateFormatter()
        f.dateFormat = "yyyy-MM-dd"
        f.timeZone = .current
        return f.string(from: Date())
    }
}

/// The artefact as a transferable file: one self-contained .html the homeowner keeps.
struct RecordFile: Transferable {
    let html: String

    static var transferRepresentation: some TransferRepresentation {
        DataRepresentation(exportedContentType: .html) { file in
            Data(file.html.utf8)
        }
    }
}
#endif
