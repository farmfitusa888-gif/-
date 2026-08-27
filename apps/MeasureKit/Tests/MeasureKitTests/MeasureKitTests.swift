import XCTest
@testable import MeasureKit

/// Every expected value in this file was computed and checked by the TypeScript
/// reference implementation in `apps/verify/`, which mirrors these algorithms
/// line for line. The numbers here are verified, not asserted from intuition.
final class LengthTests: XCTestCase {

    func testHoldsAnInchExactly() {
        XCTAssertEqual(Length.inches(1).nanometres, Length.nmPerInch)
        XCTAssertEqual(Length.inches(12).nanometres, Length.nmPerFoot)
    }

    func testRepresentsThreeEighthsExactly() {
        let threeEighths = Length.inches(0, 3, 8)
        XCTAssertEqual(threeEighths.nanometres, 9_525_000)
        XCTAssertEqual(threeEighths.formatted(), "3/8\"")
    }

    func testOneThirtySecondIsTheVerifiedConstant() {
        // Verified: frac(1,32) == 793_750 nm.
        XCTAssertEqual(Length.inches(0, 1, 32).nanometres, 793_750)
    }

    func testFormatsFeetInchesAndAReducedFraction() {
        let v = Length(nanometres: 2 * Length.nmPerFoot + 10 * Length.nmPerInch)
            + Length.inches(0, 3, 8)
        XCTAssertEqual(v.formatted(), "2' 10 3/8\"")
        XCTAssertEqual(Length(nanometres: Length.nmPerInch / 2).formatted(), "1/2\"")
        XCTAssertEqual(Length.zero.formatted(), "0\"")
        XCTAssertEqual((-Length.inches(1)).formatted(), "-1\"")
    }

    func testRoundTripsEverySixteenthOverEightFeet() {
        for sixteenths in 0...(8 * 12 * 16) {
            let nm = (Int64(sixteenths) * Length.nmPerInch) / 16
            let length = Length(nanometres: nm)
            guard let parsed = Length.parse(length.formatted()) else {
                return XCTFail("could not parse \(length.formatted())")
            }
            XCTAssertEqual(parsed.nanometres, nm, "round trip failed at \(sixteenths)/16")
        }
    }

    func testParsesTheFormsAPersonTypes() {
        XCTAssertEqual(Length.parse("2' 10 3/8\"")?.nanometres,
                       2 * Length.nmPerFoot + 10 * Length.nmPerInch + (3 * Length.nmPerInch) / 8)
        XCTAssertEqual(Length.parse("34\"")?.nanometres, 34 * Length.nmPerInch)
        XCTAssertEqual(Length.parse("3'")?.nanometres, 3 * Length.nmPerFoot)
        XCTAssertEqual(Length.parse("  6 1/2\"  ")?.nanometres,
                       6 * Length.nmPerInch + Length.nmPerInch / 2)
    }

    /// The bug this rule exists for: a lazy whole-inches group reads `11/16` as
    /// `1` and `1/16`, which is wrong by a whole inch.
    func testParsesABareFractionWithoutEatingTheDigit() {
        XCTAssertEqual(Length.parse("11/16\"")?.nanometres, (11 * Length.nmPerInch) / 16)
        XCTAssertNotEqual(Length.parse("11/16\"")?.nanometres,
                          Length.nmPerInch + Length.nmPerInch / 16)
    }

    func testRefusesNonsenseInsteadOfGuessing() {
        XCTAssertNil(Length.parse("about a yard"))
        XCTAssertNil(Length.parse(""))
        XCTAssertNil(Length.parse("1 1/0\""))
    }

    func testIntegerSquareRootFloors() {
        XCTAssertEqual(integerSquareRoot(143), 11)
        XCTAssertEqual(integerSquareRoot(144), 12)
        XCTAssertEqual(integerSquareRoot(100_000_000_000_000), 10_000_000)
    }
}

final class GeometryTests: XCTestCase {

    func testThreeFourFiveTriangleIsExact() {
        let a = Point3(x: Length.feet(3), y: Length.feet(4), z: .zero)
        XCTAssertEqual(distance(a, .origin).nanometres, 5 * Length.nmPerFoot)
    }

    /// Verified: 10 m on each axis is 17,320,508,000 nm to the micrometre.
    func testDoesNotOverflowAtRoomScale() {
        let ten = Length(nanometres: 10_000_000_000)
        let p = Point3(x: ten, y: ten, z: ten)
        XCTAssertEqual(distance(p, .origin).nanometres, 17_320_508_000)
    }

    func testHoldsPrecisionToAMicrometre() {
        let oneMicrometre = Length(nanometres: 1_000)
        let p = Point3(x: oneMicrometre, y: .zero, z: .zero)
        XCTAssertEqual(distance(p, .origin).nanometres, 1_000)
    }
}

final class TriangulationTests: XCTestCase {

    private let intrinsics = Intrinsics(fx: 1450, fy: 1450, cx: 960, cy: 720)
    private let pipe = Vector3(0.30, 0.20, -2.00)

    private func frame(_ id: String, at eye: Vector3, looking target: Vector3) -> CameraFrame {
        CameraFrame(id: id, transform: .lookAt(eye: eye, target: target),
                    intrinsics: intrinsics, imageWidth: 1920, imageHeight: 1440)
    }

    /// The whole product in one test: project a known point into two synthetic
    /// views, tap it, and triangulate back.
    func testRecoversAKnownPointFromTwoViews() {
        let a = frame("a", at: Vector3(0, 0, 0), looking: pipe)
        let b = frame("b", at: Vector3(1.2, 0.1, 0), looking: pipe)
        let pa = a.project(pipe), pb = b.project(pipe)
        XCTAssertTrue(pa.isOnImage)
        XCTAssertTrue(pb.isOnImage)

        let t = triangulate(Tap(frame: a, x: pa.x, y: pa.y), Tap(frame: b, x: pb.x, y: pb.y))
        XCTAssertFalse(t.isDegenerate)
        XCTAssertLessThan((t.point - pipe).length, 1e-9)
        XCTAssertLessThan(t.missDistance, 1e-9)
        XCTAssertGreaterThan(t.depths.0, 0)
    }

    func testProjectionAndUnprojectionAreInverses() {
        let f = frame("f", at: Vector3(0.5, 1.2, 0.4), looking: pipe)
        let p = f.project(pipe)
        let ray = f.ray(throughX: p.x, y: p.y)
        let reconstructed = ray.origin + ray.direction * (pipe - ray.origin).length
        XCTAssertLessThan((reconstructed - pipe).length, 1e-9)
    }

    func testReportsARealMissWhenTapsDisagree() {
        let a = frame("a", at: Vector3(0, 0, 0), looking: pipe)
        let b = frame("b", at: Vector3(1.2, 0.1, 0), looking: pipe)
        let pa = a.project(pipe), pb = b.project(pipe)
        let sloppy = triangulate(Tap(frame: a, x: pa.x, y: pa.y + 5),
                                 Tap(frame: b, x: pb.x, y: pb.y))
        XCTAssertFalse(sloppy.isDegenerate)
        XCTAssertGreaterThan(sloppy.missDistance, 0)
        XCTAssertTrue(sloppy.missDistance.isFinite)
    }

    func testAWiderBaselineBeatsANarrowOne() {
        let a = frame("a", at: Vector3(0, 0, 0), looking: pipe)
        func error(baseline x: Double) -> Double {
            let b = frame("b", at: Vector3(x, 0, 0), looking: pipe)
            let pa = a.project(pipe), pb = b.project(pipe)
            let t = triangulate(Tap(frame: a, x: pa.x + 3, y: pa.y),
                                Tap(frame: b, x: pb.x, y: pb.y))
            return (t.point - pipe).length
        }
        XCTAssertLessThan(error(baseline: 1.5), error(baseline: 0.08))
    }

    func testRefusesToAnswerWhenRaysAreParallel() {
        let ray = Ray(origin: .zero, direction: Vector3(0, 0, -1))
        XCTAssertTrue(triangulate(ray, ray).isDegenerate)
        XCTAssertEqual(triangulate(ray, ray).missDistance, .infinity)
    }

    func testPicksTheBestAgreeingPairOfThree() {
        let a = frame("a", at: Vector3(0, 0, 0), looking: pipe)
        let b = frame("b", at: Vector3(1.2, 0.1, 0), looking: pipe)
        let c = frame("c", at: Vector3(-1.1, 0.3, 0.2), looking: pipe)
        let pa = a.project(pipe), pb = b.project(pipe), pc = c.project(pipe)
        let (best, pairs) = triangulateBestPair([
            Tap(frame: a, x: pa.x, y: pa.y),
            Tap(frame: b, x: pb.x, y: pb.y + 12),   // one sloppy tap
            Tap(frame: c, x: pc.x, y: pc.y),
        ])
        XCTAssertEqual(pairs, 3)
        XCTAssertLessThan((best.point - pipe).length, 1e-6)
    }
}
