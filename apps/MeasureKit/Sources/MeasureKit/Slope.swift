import Foundation

/// A slope held as an exact rise over run, never as a decimal.
///
/// Accessibility thresholds are written as ratios - 1:12, 1:48 - and a survey that
/// reports `1:12.0000001` in a deposition is a survey that gets attacked. Holding
/// the ratio exactly means the comparison against a threshold is exact too.
public struct Slope: Hashable, Sendable {
    public var rise: Length
    public var run: Length

    public init(rise: Length, run: Length) {
        precondition(run.nanometres != 0, "a slope needs a non-zero run")
        self.rise = rise
        self.run = run
    }

    /// Steepness as a Double, for display only. Never compare with this.
    public var ratio: Double { Double(rise.nanometres) / Double(run.nanometres) }
    public var percent: Double { ratio * 100 }
    public var degrees: Double { atan(ratio) * 180 / .pi }

    /// `1:12` style, rounded down so the printed figure never flatters the slope.
    public func formattedAsOneIn() -> String {
        let r = abs(rise.nanometres)
        guard r != 0 else { return "level" }
        return "1:\(abs(run.nanometres) / r)"
    }

    /// Exact comparison against a `1:n` threshold, with no division.
    ///
    /// `rise/run > 1/n` becomes `rise*n > run`, which is integer arithmetic and
    /// cannot be wrong by a rounding step at the boundary.
    public func exceedsOneIn(_ n: Int64) -> Bool {
        precondition(n > 0, "threshold must be positive")
        let rise = abs(self.rise.nanometres)
        let run = abs(self.run.nanometres)
        let (product, overflow) = rise.multipliedReportingOverflow(by: n)
        if overflow { return true }   // absurdly steep; it exceeds anything
        return product > run
    }
}

/// The two thresholds that decide almost every accessible route.
public enum SlopeLimit {
    /// Ramp running slope: 1:12.
    public static let ramp: Int64 = 12
    /// Cross slope on an accessible route: 1:48.
    public static let cross: Int64 = 48
    /// Walking surface running slope before it counts as a ramp: 1:20.
    public static let walkingSurface: Int64 = 20
}

/// A slope reading taken two ways, with the disagreement kept rather than averaged.
///
/// The device's inertial sensors and the scan geometry each give a slope.
/// Averaging them hides an error; reporting the difference is what a survey that
/// will be read by an expert witness has to do.
public struct CrossCheckedSlope: Sendable {
    public var fromInertial: Slope
    public var fromGeometry: Slope
    public var provenance: Provenance

    public init(fromInertial: Slope, fromGeometry: Slope, provenance: Provenance = .scanned) {
        self.fromInertial = fromInertial
        self.fromGeometry = fromGeometry
        self.provenance = provenance
    }

    /// The steeper of the two. Reporting the worse case is the conservative choice.
    public var reported: Slope {
        abs(fromInertial.ratio) >= abs(fromGeometry.ratio) ? fromInertial : fromGeometry
    }

    /// How far apart the two methods were, in degrees.
    public var disagreementDegrees: Double {
        abs(fromInertial.degrees - fromGeometry.degrees)
    }

    /// Beyond this the two methods are telling different stories and the reading
    /// should be taken again with a level rather than trusted.
    public func disagrees(toleranceDegrees: Double = 0.5) -> Bool {
        disagreementDegrees > toleranceDegrees
    }
}
