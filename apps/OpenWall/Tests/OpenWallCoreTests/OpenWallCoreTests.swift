import XCTest
import MeasureKit
@testable import OpenWallCore

final class RunTests: XCTestCase {

    private func point(_ id: String, _ xFeet: Int64,
                       _ p: Provenance = .triangulated) -> TracePoint {
        TracePoint(id: id,
                   position: Point3(x: Length(nanometres: xFeet * Length.nmPerFoot),
                                    y: .zero, z: .zero),
                   provenance: p)
    }

    func testSumsSpanLengthsExactly() throws {
        let run = try Run(id: "r1", service: .coldWater, label: "Cold water", points: [
            TracePoint(id: "p1", position: .origin, provenance: .triangulated),
            TracePoint(id: "p2", position: Point3(x: .feet(3), y: .zero, z: .zero),
                       provenance: .triangulated),
            TracePoint(id: "p3", position: Point3(x: .feet(3), y: .feet(4), z: .zero),
                       provenance: .triangulated),
        ])
        XCTAssertEqual(run.totalLength.nanometres, 7 * Length.nmPerFoot)
        XCTAssertEqual(run.totalLength.formatted(), "7'")
    }

    func testDerivesSpansFromTheirEndsRatherThanAcceptingAClaim() throws {
        let run = try Run(id: "r2", service: .electrical, label: "Circuit", points: [
            point("p1", 0, .triangulated), point("p2", 1, .derived), point("p3", 2, .triangulated),
        ])
        // Either end unobserved makes the whole span inferred.
        XCTAssertEqual(run.spans[0].provenance, .derived)
        XCTAssertEqual(run.spans[1].provenance, .derived)
        XCTAssertEqual(run.inferredLength.nanometres, 2 * Length.nmPerFoot)
        XCTAssertEqual(run.observedLength.nanometres, 0)
    }

    func testRefusesARunThatIsNotARun() {
        XCTAssertThrowsError(try Run(id: "x", service: .vent, label: "x",
                                     points: [point("p1", 0)]))
    }

    func testRefusesDuplicatePointIDsWhichWouldCorruptTheSpans() {
        XCTAssertThrowsError(try Run(id: "x", service: .vent, label: "x",
                                     points: [point("p1", 0), point("p1", 1)]))
    }

    func testTriangulatesAPointFromTwoTapsAndKeepsItsError() {
        let intr = Intrinsics(fx: 1450, fy: 1450, cx: 960, cy: 720)
        let pipe = Vector3(0.3, 0.2, -2.0)
        func frame(_ id: String, _ eye: Vector3) -> CameraFrame {
            CameraFrame(id: id, transform: .lookAt(eye: eye, target: pipe),
                        intrinsics: intr, imageWidth: 1920, imageHeight: 1440)
        }
        let a = frame("a", Vector3(0, 0, 0)), b = frame("b", Vector3(1.2, 0.1, 0))
        let pa = a.project(pipe), pb = b.project(pipe)

        let tp = TracePoint.triangulated(id: "t1", taps: [
            Tap(frame: a, x: pa.x, y: pa.y), Tap(frame: b, x: pb.x, y: pb.y),
        ])
        XCTAssertNotNil(tp)
        XCTAssertEqual(tp?.provenance, .triangulated)
        XCTAssertNotNil(tp?.tolerance, "a triangulated point must carry its error")
    }

    func testRefusesToTriangulateFromOneTap() {
        let intr = Intrinsics(fx: 1450, fy: 1450, cx: 960, cy: 720)
        let f = CameraFrame(id: "a", transform: .identity, intrinsics: intr,
                            imageWidth: 1920, imageHeight: 1440)
        XCTAssertNil(TracePoint.triangulated(id: "t", taps: [Tap(frame: f, x: 10, y: 10)]))
    }
}

final class RecordTests: XCTestCase {

    private func job(inferred: Bool = false) throws -> Job {
        let run = try Run(id: "r", service: .coldWater, label: "Cold water", points: [
            TracePoint(id: "p1", position: .origin, provenance: .triangulated,
                       tolerance: Length(nanometres: 1)),
            TracePoint(id: "p2", position: Point3(x: .feet(3), y: .zero, z: .zero),
                       provenance: inferred ? .derived : .triangulated),
        ])
        return Job(propertyAddress: "14 Example Street", capturedOn: "2026-08-27",
                   contractorName: "Example Remodeling", homeownerName: "A. Homeowner",
                   rooms: [Room(id: "k", name: "Kitchen", runs: [run])])
    }

    func testAlwaysCarriesTheCuttingWarning() throws {
        let html = try RecordBuilder.render(job())
        XCTAssertTrue(html.contains("Read this before cutting into any wall."))
        XCTAssertTrue(html.contains("scan the wall immediately before you cut"))
    }

    func testAddsARefusalNoticeWhenAnythingWasInferred() throws {
        XCTAssertTrue(try RecordBuilder.render(job(inferred: true))
            .contains("Some of this was inferred."))
        XCTAssertFalse(try RecordBuilder.render(job(inferred: false))
            .contains("Some of this was inferred."))
    }

    func testFetchesNothingAtViewTime() throws {
        let html = try RecordBuilder.render(job())
        XCTAssertFalse(html.contains("<script"))
        XCTAssertFalse(html.contains("http://"))
        XCTAssertFalse(html.contains("https://"))
    }

    func testNeverPrintsATinyToleranceAsZero() throws {
        XCTAssertTrue(try RecordBuilder.render(job()).contains("&lt; 1/32\""))
    }

    func testIsAPureFunctionOfItsInput() throws {
        let j = try job()
        XCTAssertEqual(try RecordBuilder.render(j), try RecordBuilder.render(j))
    }

    func testFlagsAHazardousService() throws {
        let run = try Run(id: "r", service: .gas, label: "Gas line", points: [
            TracePoint(id: "p1", position: .origin, provenance: .measured),
            TracePoint(id: "p2", position: Point3(x: .feet(2), y: .zero, z: .zero),
                       provenance: .measured),
        ])
        let j = Job(propertyAddress: "x", capturedOn: "2026-08-27", contractorName: "y",
                    rooms: [Room(id: "r", name: "R", runs: [run])])
        XCTAssertTrue(try RecordBuilder.render(j).contains("HAZARDOUS SERVICE"))
    }
}
