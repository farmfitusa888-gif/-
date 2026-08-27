import Foundation

/// What is due, and when.
///
/// This is the retention mechanism of the whole product: a contractor whose next
/// twelve months of obligations live here does not cancel in month four. It is
/// also the reason the business model assumes lower churn than its siblings.
public struct DueItem: Sendable, Identifiable, Equatable {
    public var id: String
    public var buildingName: String
    public var deviceID: String
    public var frequency: Frequency
    /// Months since the last inspection, supplied rather than computed from a
    /// clock, so the schedule is testable and reproducible.
    public var monthsSinceLast: Int

    public init(id: String, buildingName: String, deviceID: String,
                frequency: Frequency, monthsSinceLast: Int) {
        self.id = id; self.buildingName = buildingName; self.deviceID = deviceID
        self.frequency = frequency; self.monthsSinceLast = monthsSinceLast
    }

    public var monthsUntilDue: Int { frequency.months - monthsSinceLast }
    public var isOverdue: Bool { monthsUntilDue < 0 }
    public var isDueNow: Bool { monthsUntilDue <= 0 }
}

public enum Schedule {
    /// Overdue first, then soonest. Ties broken by device so the order is stable.
    public static func upcoming(_ items: [DueItem], withinMonths: Int) -> [DueItem] {
        items
            .filter { $0.monthsUntilDue <= withinMonths }
            .sorted {
                if $0.monthsUntilDue != $1.monthsUntilDue {
                    return $0.monthsUntilDue < $1.monthsUntilDue
                }
                return $0.deviceID < $1.deviceID
            }
    }

    public static func overdue(_ items: [DueItem]) -> [DueItem] {
        items.filter(\.isOverdue).sorted { $0.monthsUntilDue < $1.monthsUntilDue }
    }
}
