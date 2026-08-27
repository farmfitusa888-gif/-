import { describe, expect, it } from "vitest";
import { escapeAttr, escapeHtml, renderRecord, type RecordInput } from "../src/record.js";
import { buildRun, type TracePoint } from "../src/runs.js";
import { NM_PER_FOOT, NM_PER_INCH } from "../src/units.js";

// A 1x1 transparent PNG - a real image, small enough to inline in a test.
const PNG =
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";

const at = (id: string, x: bigint, p: TracePoint["provenance"] = "triangulated"): TracePoint => ({
  id, position: { x, y: 0n, z: 4n * NM_PER_FOOT }, provenance: p,
});

const INPUT: RecordInput = {
  propertyAddress: "14 Example Street",
  capturedOn: "2026-08-27",
  contractorName: "Example Remodeling",
  homeownerName: "A. Homeowner",
  rooms: [
    {
      name: "Kitchen",
      runs: [
        buildRun("r1", "cold-water", "Cold water to sink", [
          { ...at("p1", 0n), missDistance: NM_PER_INCH / 2n },
          at("p2", 3n * NM_PER_FOOT),
          at("p3", 6n * NM_PER_FOOT, "derived"),
        ]),
      ],
      photos: [{ id: "ph1", caption: "North wall, open", base64: PNG, mimeType: "image/png" }],
    },
  ],
};

describe("the artefact", () => {
  const html = renderRecord(INPUT);

  it("fetches nothing at view time - the ten-year promise", () => {
    // Any of these would make the file depend on a server still existing.
    expect(html).not.toMatch(/<script/i);
    expect(html).not.toMatch(/<link[^>]+href/i);
    expect(html).not.toMatch(/@import/i);
    expect(html).not.toMatch(/src\s*=\s*["']https?:/i);
    expect(html).not.toMatch(/url\(\s*["']?https?:/i);
    // The only permitted src is an inlined data URI.
    for (const m of html.matchAll(/src\s*=\s*"([^"]*)"/g)) {
      expect(m[1]!.startsWith("data:")).toBe(true);
    }
  });

  it("inlines the photograph rather than linking it", () => {
    expect(html).toContain(`src="data:image/png;base64,${PNG}"`);
  });

  it("carries the cutting warning, which is a safety requirement", () => {
    expect(html).toMatch(/Read this before cutting into any wall/i);
    expect(html).toMatch(/scan the wall immediately before you cut/i);
    expect(html).toMatch(/record<\/strong>, not a locator/i);
  });

  it("distinguishes what was seen from what was inferred", () => {
    expect(html).toContain("Seen and computed");
    expect(html).toContain("Inferred, not seen");
    expect(html).toMatch(/was inferred, not seen/);
  });

  it("prints positions in feet and inches, not metres", () => {
    expect(html).toContain(`3'`);
    expect(html).toContain(`4'`);
    expect(html).not.toMatch(/\d\s?metres/i);
  });

  it("shows the ray disagreement rather than hiding it", () => {
    expect(html).toMatch(/Ray disagreement/);
    expect(html).toContain(`1/2"`);
  });

  it("never rounds a tiny ray disagreement down to zero", () => {
    // A miss of one nanometre is not zero, and must not read as zero.
    const tiny = renderRecord({
      ...INPUT,
      rooms: [
        {
          ...INPUT.rooms[0]!,
          runs: [
            buildRun("r-tiny", "gas", "Gas", [
              { ...at("t1", 0n), missDistance: 1n },
              at("t2", NM_PER_FOOT),
            ]),
          ],
        },
      ],
    });
    // Both where it is reported: the per-point cell and the run summary.
    expect(tiny).toContain(`&lt; 1/32"`);
    expect(tiny).toMatch(/largest ray disagreement &lt; 1\/32"/);
    expect(tiny).not.toMatch(/largest ray disagreement 0"/);
  });

  it("is a pure function - same input, same bytes", () => {
    expect(renderRecord(INPUT)).toBe(html);
  });

  it("escapes job data, which reaches a browser", () => {
    const nasty = renderRecord({
      ...INPUT,
      contractorName: `<script>alert('x')</script>`,
      propertyAddress: `14 "Quoted" & Co <b>`,
    });
    expect(nasty).not.toContain("<script>alert");
    expect(nasty).toContain("&lt;script&gt;");
    expect(nasty).toContain("&amp;");
  });

  it("escapes text without mangling the quotes in a measurement", () => {
    // Text content: angle brackets and ampersands only, so 3' stays 3'.
    expect(escapeHtml(`<>&"'`)).toBe(`&lt;&gt;&amp;"'`);
  });

  it("escapes attributes so a caption cannot break out of one", () => {
    expect(escapeAttr(`<>&"'`)).toBe("&lt;&gt;&amp;&quot;&#39;");
    const html = renderRecord({
      ...INPUT,
      rooms: [
        {
          ...INPUT.rooms[0]!,
          photos: [
            {
              id: "ph1",
              caption: `" onerror="alert(1)`,
              base64: PNG,
              mimeType: "image/png",
            },
          ],
        },
      ],
    });
    // The <img> tag itself must carry no attribute the caption smuggled in.
    const img = /<img\b[^>]*>/.exec(html)?.[0] ?? "";
    // The payload survives only as escaped text inside alt="...", never as a
    // real attribute - so no raw quote may follow it.
    expect(img).not.toMatch(/onerror\s*=\s*["']/);
    expect(img).toContain("&quot; onerror=&quot;alert(1)");
    expect(img).toMatch(/^<img alt="[^"]*" src="data:image\/png;base64,[^"]*">$/);
    // In <figcaption> it is plain text, where a bare quote is inert and readable.
    expect(html).toContain("<figcaption>\" onerror=\"alert(1)</figcaption>");
  });

  it("refuses non-ASCII that merely looks alphanumeric", () => {
    // Devanagari digits are `isNumber` in most languages' character classes.
    // Base64 is ASCII by definition, so these must be rejected.
    expect(() =>
      renderRecord({
        ...INPUT,
        rooms: [{ ...INPUT.rooms[0]!, photos: [
          { id: "bad", caption: "c", base64: "\u0966\u0967\u0968", mimeType: "image/png" },
        ] }],
      }),
    ).toThrow(RangeError);
  });

  it("refuses a photo that is a URL rather than inlined bytes", () => {
    expect(() =>
      renderRecord({
        ...INPUT,
        rooms: [
          {
            ...INPUT.rooms[0]!,
            photos: [
              {
                id: "bad",
                caption: "remote",
                base64: "https://example.com/photo.jpg",
                mimeType: "image/jpeg",
              },
            ],
          },
        ],
      }),
    ).toThrow(RangeError);
  });

  it("omits the homeowner line when there is no homeowner", () => {
    const { homeownerName: _omitted, ...withoutHomeowner } = INPUT;
    expect(renderRecord(withoutHomeowner)).not.toContain("Prepared for");
  });
});
