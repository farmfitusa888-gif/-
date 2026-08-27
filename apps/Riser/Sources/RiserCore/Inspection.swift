import Foundation
import MeasureKit

/// The answer to one inspection question.
///
/// `notVerified` is the whole point of this product. Today an inspector who
/// cannot reach a device writes nothing, and the report reads as a clean pass.
/// Here it is a first-class answer that CANNOT be left blank, and it prints.
public enum Answer: Sendable, Equatable {
    case pass
    case fail(severity: Severity, note: String)
    case notVerified(reason: NotVerifiedReason, note: String)
    case notApplicable(note: String)

    public var isFailure: Bool { if case .fail = self { return true }; return false }
    public var isVerified: Bool {
        switch self {
        case .pass, .fail: return true
        case .notVerified, .notApplicable: return false
        }
    }

    public var provenance: Provenance {
        switch self {
        case .pass, .fail: return .measured
        case .notVerified: return .scanned
        case .notApplicable: return .derived
        }
    }
}

public enum Severity: String, Sendable, Codable, CaseIterable, Comparable {
    case critical, nonCritical, impairment, advisory

    public var label: String {
        switch self {
        case .critical: return "Critical"
        case .nonCritical: return "Non-critical"
        case .impairment: return "Impairment"
        case .advisory: return "Advisory"
        }
    }
    private var order: Int {
        switch self {
        case .critical: return 0
        case .impairment: return 1
        case .nonCritical: return 2
        case .advisory: return 3
        }
    }
    public static func < (a: Severity, b: Severity) -> Bool { a.order < b.order }
}

/// Why something could not be checked. A free-text excuse is not enough - an
/// adjuster reading this later needs a category they can act on.
public enum NotVerifiedReason: String, Sendable, Codable, CaseIterable {
    case inaccessible, aboveHardCeiling, valveSeized, tenantRefusedEntry
    case obstructed, noWaterAvailable, deviceMissing, unsafeToAccess

    public var label: String {
        switch self {
        case .inaccessible: return "Could not reach it"
        case .aboveHardCeiling: return "Above a hard ceiling"
        case .valveSeized: return "Valve would not operate"
        case .tenantRefusedEntry: return "Tenant refused entry"
        case .obstructed: return "Obstructed by stored goods"
        case .noWaterAvailable: return "No water available on site"
        case .deviceMissing: return "Device not found where recorded"
        case .unsafeToAccess: return "Unsafe to access"
        }
    }
}

/// One question from a standard, held as data.
///
/// The edition is stored WITH the checkpoint, not compiled in. An inspection
/// done in 2027 has to be re-printable in 2032 against the edition that governed
/// it, and hard-coding a checklist makes that impossible.
public struct Checkpoint: Sendable, Identifiable, Codable {
    public var id: String
    public var standard: String        // e.g. "NFPA 25"
    public var edition: String         // e.g. "2023"
    public var clause: String          // e.g. "5.2.1.1"
    public var text: String
    public var appliesTo: DeviceKind
    public var frequency: Frequency

    public init(id: String, standard: String, edition: String, clause: String,
                text: String, appliesTo: DeviceKind, frequency: Frequency) {
        self.id = id; self.standard = standard; self.edition = edition
        self.clause = clause; self.text = text
        self.appliesTo = appliesTo; self.frequency = frequency
    }

    public var citation: String { "\(standard) \(edition) §\(clause)" }
}

public enum DeviceKind: String, Sendable, Codable, CaseIterable {
    case sprinklerHead, controlValve, gauge, fireDepartmentConnection
    case alarmDevice, backflowPreventer, extinguisher, standpipe, pump

    public var label: String {
        switch self {
        case .sprinklerHead: return "Sprinkler head"
        case .controlValve: return "Control valve"
        case .gauge: return "Gauge"
        case .fireDepartmentConnection: return "Fire department connection"
        case .alarmDevice: return "Alarm device"
        case .backflowPreventer: return "Backflow preventer"
        case .extinguisher: return "Extinguisher"
        case .standpipe: return "Standpipe"
        case .pump: return "Fire pump"
        }
    }
}

public enum Frequency: String, Sendable, Codable, CaseIterable {
    case weekly, monthly, quarterly, semiannual, annual, threeYear, fiveYear

    public var months: Int {
        switch self {
        case .weekly: return 0
        case .monthly: return 1
        case .quarterly: return 3
        case .semiannual: return 6
        case .annual: return 12
        case .threeYear: return 36
        case .fiveYear: return 60
        }
    }
    public var label: String { rawValue.capitalized }
}

public struct Device: Sendable, Identifiable, Codable {
    public var id: String
    public var kind: DeviceKind
    /// Barcode or QR already on the device, when there is one.
    public var tag: String?
    public var location: String
    public init(id: String, kind: DeviceKind, tag: String? = nil, location: String) {
        self.id = id; self.kind = kind; self.tag = tag; self.location = location
    }
}

public struct CheckResult: Sendable, Identifiable {
    public var id: String { "\(deviceID)/\(checkpoint.id)" }
    public var deviceID: String
    public var checkpoint: Checkpoint
    public var answer: Answer
    public var photoCaptions: [String]

    public init(deviceID: String, checkpoint: Checkpoint, answer: Answer,
                photoCaptions: [String] = []) {
        self.deviceID = deviceID; self.checkpoint = checkpoint
        self.answer = answer; self.photoCaptions = photoCaptions
    }
}
