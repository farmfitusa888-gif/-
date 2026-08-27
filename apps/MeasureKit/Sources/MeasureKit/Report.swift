import Foundation

/// A document model the apps fill in, and one renderer that turns it into a
/// self-contained HTML file.
///
/// One absolute rule: the rendered file fetches NOTHING at view time. No script,
/// no stylesheet link, no font host, no image URL, no analytics. Images are
/// inlined as data URIs. A document that needs a server in ten years is not a
/// document, and every one of these products promises otherwise.
public struct Report: Sendable {
    public var title: String
    public var subtitle: String
    public var facts: [(String, String)]
    /// Printed prominently, before anything else. Used for refusals and safety notices.
    public var notices: [Notice]
    public var sections: [Section]
    public var footer: String

    public init(title: String, subtitle: String, facts: [(String, String)],
                notices: [Notice] = [], sections: [Section], footer: String) {
        self.title = title; self.subtitle = subtitle; self.facts = facts
        self.notices = notices; self.sections = sections; self.footer = footer
    }

    public struct Notice: Sendable {
        public enum Kind: String, Sendable { case warning, refusal, info }
        public var kind: Kind
        public var heading: String
        public var body: String
        public init(kind: Kind, heading: String, body: String) {
            self.kind = kind; self.heading = heading; self.body = body
        }
    }

    public struct Section: Sendable {
        public var heading: String
        public var summary: String?
        public var tables: [Table]
        public var photos: [Photo]
        public init(heading: String, summary: String? = nil,
                    tables: [Table] = [], photos: [Photo] = []) {
            self.heading = heading; self.summary = summary
            self.tables = tables; self.photos = photos
        }
    }

    public struct Table: Sendable {
        public var caption: String?
        public var columns: [String]
        public var rows: [[Cell]]
        public init(caption: String? = nil, columns: [String], rows: [[Cell]]) {
            self.caption = caption; self.columns = columns; self.rows = rows
        }
    }

    /// A cell is either plain text or a provenance mark, so the renderer can
    /// style provenance consistently across every product.
    public enum Cell: Sendable {
        case text(String)
        case mark(Provenance)
        case money(Money)
        case length(Length)
        /// A tolerance never rounds down to a comforting zero.
        case tolerance(Length)
    }

    public struct Photo: Sendable {
        public var caption: String
        /// Base64 payload only - no `data:` prefix, no URL.
        public var base64: String
        public var mimeType: String
        public init(caption: String, base64: String, mimeType: String = "image/jpeg") {
            self.caption = caption; self.base64 = base64; self.mimeType = mimeType
        }
    }
}

public enum ReportError: Error, Sendable {
    /// A photo supplied as a URL. Accepting it would break the offline promise.
    case photoIsNotInlined(caption: String)
}

public enum ReportRenderer {
    /// Escape for TEXT content.
    ///
    /// Quotes are deliberately left alone: they mean nothing outside an attribute,
    /// and escaping them would render every measurement as `3&#39;` instead of `3'`.
    public static func escapeText(_ s: String) -> String {
        s.replacingOccurrences(of: "&", with: "&amp;")
            .replacingOccurrences(of: "<", with: "&lt;")
            .replacingOccurrences(of: ">", with: "&gt;")
    }

    /// Escape for an ATTRIBUTE, where a quote would break out of it.
    public static func escapeAttribute(_ s: String) -> String {
        escapeText(s)
            .replacingOccurrences(of: "\"", with: "&quot;")
            .replacingOccurrences(of: "'", with: "&#39;")
    }

    /// Sub-1/32" tolerances print as a bound, never as `0"`, because zero would
    /// claim a precision the sensor does not have.
    public static func formatTolerance(_ length: Length) -> String {
        let thirtySecond = Length.nmPerInch / 32
        let magnitude = abs(length.nanometres)
        if magnitude == 0 { return "0\"" }
        if magnitude < thirtySecond { return "&lt; 1/32\"" }
        return escapeText(length.formatted(denominator: 32))
    }

    static func render(_ cell: Report.Cell) -> String {
        switch cell {
        case .text(let s): return escapeText(s)
        case .money(let m): return escapeText(m.formatted)
        case .length(let l): return escapeText(l.formatted())
        case .tolerance(let l): return formatTolerance(l)
        case .mark(let p):
            return "<span class=\"tag p-\(p.rawValue)\">\(escapeText(p.label))</span>"
        }
    }

    public static func render(_ report: Report) throws -> String {
        var body = ""

        for n in report.notices {
            body += "<div class=\"notice n-\(n.kind.rawValue)\"><strong>"
                + escapeText(n.heading) + "</strong> " + escapeText(n.body) + "</div>"
        }

        for section in report.sections {
            body += "<h2>" + escapeText(section.heading) + "</h2>"
            if let s = section.summary {
                body += "<p class=\"sub\">" + escapeText(s) + "</p>"
            }
            for table in section.tables {
                if let c = table.caption { body += "<h3>" + escapeText(c) + "</h3>" }
                body += "<table><thead><tr>"
                    + table.columns.map { "<th>" + escapeText($0) + "</th>" }.joined()
                    + "</tr></thead><tbody>"
                for row in table.rows {
                    body += "<tr>" + row.map { "<td>" + render($0) + "</td>" }.joined() + "</tr>"
                }
                body += "</tbody></table>"
            }
            if !section.photos.isEmpty {
                body += "<div class=\"photos\">"
                for p in section.photos {
                    guard isPlainBase64(p.base64) else {
                        throw ReportError.photoIsNotInlined(caption: p.caption)
                    }
                    body += "<figure><img alt=\"" + escapeAttribute(p.caption)
                        + "\" src=\"data:" + p.mimeType + ";base64," + p.base64 + "\">"
                        + "<figcaption>" + escapeText(p.caption) + "</figcaption></figure>"
                }
                body += "</div>"
            }
        }

        let facts = report.facts.map {
            "<div><b>" + escapeText($0.0) + "</b>" + escapeText($0.1) + "</div>"
        }.joined()

        return """
        <!doctype html>
        <html lang="en"><head><meta charset="utf-8">
        <meta name="viewport" content="width=device-width,initial-scale=1">
        <title>\(escapeText(report.title))</title>
        <style>\(css)</style></head>
        <body><div class="wrap">
        <h1>\(escapeText(report.title))</h1>
        <p class="sub">\(escapeText(report.subtitle))</p>
        <div class="meta">\(facts)</div>
        \(body)
        <footer>\(escapeText(report.footer))</footer>
        </div></body></html>
        """
    }

    static func isPlainBase64(_ s: String) -> Bool {
        !s.isEmpty && s.allSatisfy {
            $0.isLetter || $0.isNumber || $0 == "+" || $0 == "/" || $0 == "="
        }
    }

    static let css = """
    :root{--ink:#16191d;--muted:#5b6470;--rule:#d9dee5;--accent:#1f4e79;--warn:#a32d1e}
    *{box-sizing:border-box}
    body{margin:0;background:#fff;color:var(--ink);
     font:15px/1.55 "Iowan Old Style",Palatino,Georgia,serif;padding:24px}
    .wrap{max-width:960px;margin:0 auto}
    h1,h2,h3,th{font-family:"Helvetica Neue",Helvetica,Arial,sans-serif}
    h1{font-size:26px;margin:0 0 4px}
    h2{font-size:16px;margin:28px 0 8px;color:var(--accent)}
    h3{font-size:13px;margin:16px 0 6px}
    .sub{color:var(--muted);margin:0 0 16px}
    .meta{display:flex;flex-wrap:wrap;gap:10px 26px;padding:12px 0;
     border-top:1px solid var(--rule);border-bottom:1px solid var(--rule);
     font-family:"Helvetica Neue",Helvetica,Arial,sans-serif;font-size:13px}
    .meta b{display:block;color:var(--muted);font-weight:600;font-size:11px;
     text-transform:uppercase;letter-spacing:.06em}
    .notice{margin:18px 0;padding:12px 14px;border-radius:4px;border:2px solid var(--warn);
     background:#fdecea;color:#7d2116}
    .notice strong{color:var(--warn)}
    .n-refusal{border-color:#8a5a00;background:#fdf3e0;color:#6b4600}
    .n-refusal strong{color:#8a5a00}
    .n-info{border-color:var(--accent);background:#eef3f8;color:#1b3a57}
    table{width:100%;border-collapse:collapse;margin:8px 0 18px;
     font-family:"Helvetica Neue",Helvetica,Arial,sans-serif;font-size:13px}
    th{background:var(--ink);color:#fff;text-align:left;padding:7px 8px}
    td{padding:6px 8px;border:1px solid var(--rule);vertical-align:top}
    tbody tr:nth-child(even) td{background:#f7f9fb}
    .tag{display:inline-block;font-family:"Helvetica Neue",Helvetica,Arial,sans-serif;
     font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;
     padding:2px 5px;border-radius:3px;border:1px solid currentColor;white-space:nowrap}
    .p-triangulated{color:#1c6b3f;background:#e8f5ee}
    .p-measured{color:#1f4e79;background:#e9f0f7}
    .p-derived{color:#8a5a00;background:#fdf3e0}
    .p-scanned{color:#a32d1e;background:#fdecea}
    .p-adjusted{color:#5b3a86;background:#f1ebfa}
    figure{margin:0 0 14px}
    img{max-width:100%;height:auto;border:1px solid var(--rule);border-radius:3px;display:block}
    figcaption{color:var(--muted);font-size:12px;margin-top:5px}
    .photos{display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:14px}
    footer{margin-top:32px;padding-top:12px;border-top:1px solid var(--rule);
     color:var(--muted);font-size:12px}
    @media print{body{padding:0}.notice{border-color:#000}}
    """
}
