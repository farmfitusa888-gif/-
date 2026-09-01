// Serves dist/backpay, drives the calculator in headless Chromium, and fails
// loudly if the browser and the engine disagree about the same week of work.
import { createServer } from "node:http";
import { readFileSync, existsSync } from "node:fs";
import { join, dirname, extname } from "node:path";
import { fileURLToPath } from "node:url";
import { execFile } from "node:child_process";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "../..");
const DIST = join(ROOT, "dist/backpay");
const CHROME = "/opt/pw-browsers/chromium-1194/chrome-linux/chrome";
const TYPES = { ".js": "text/javascript", ".mjs": "text/javascript", ".html": "text/html" };
const PORT = 8917;

if (!existsSync(join(DIST, "app/rules.mjs"))) {
  console.error("\n  dist/backpay/app not built. Run: node platform/build.mjs\n");
  process.exit(1);
}

const test = readFileSync(join(ROOT, "platform/app/calc-browser-test.html"), "utf8")
  .replaceAll("8901", String(PORT));

const server = createServer((req, res) => {
  const url = req.url.split("?")[0];
  if (url === "/__test") {
    res.writeHead(200, { "content-type": "text/html" });
    return res.end(test);
  }
  const file = join(DIST, url);
  if (!file.startsWith(DIST) || !existsSync(file)) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { "content-type": TYPES[extname(file)] || "text/plain" });
  res.end(readFileSync(file));
});

server.listen(PORT, "127.0.0.1", () => {
  // execFile, not execFileSync. The server and the browser share this process's
  // single event loop, so a synchronous spawn blocks the very requests the
  // browser is waiting on and the two deadlock until something kills them.
  // Every flag after the first three exists to stop Chromium reaching for the
  // network: this environment's proxy rejects those calls and the browser then
  // waits on them instead of exiting.
  execFile(CHROME, ["--headless", "--disable-gpu", "--no-sandbox",
    "--no-first-run", "--no-default-browser-check", "--disable-extensions",
    "--disable-background-networking", "--disable-component-update",
    "--disable-sync", "--disable-default-apps", "--metrics-recording-only",
    "--virtual-time-budget=6000", "--dump-dom", `http://127.0.0.1:${PORT}/__test`],
    { encoding: "utf8", maxBuffer: 32 * 1024 * 1024, timeout: 60000 },
    (err, dom) => {
      server.close();
      console.log("\ncalculator, in a real browser\n");
      const line = (String(dom || "").match(
        /EXPECT \$[\d.,]+ \| FOUND_IN_DOM \w+ \| RATE_SHOWN \w+ \| CITES \w+/) || [])[0];
      if (!line) {
        console.log("  FAIL  no verdict on the page. The module probably threw.");
        if (err) console.log("        " + err.message.split("\n")[0]);
        console.log();
        process.exit(1);
      }
      console.log("  " + line);
      const ok = line.includes("FOUND_IN_DOM YES")
        && line.includes("RATE_SHOWN YES") && line.includes("CITES YES");
      console.log(ok
        ? "\n  PASS  the page and the engine agree, the corrected rate is shown, "
          + "and findings cite a statute.\n"
        : "\n  FAIL  the page and the engine disagree.\n");
      process.exit(ok ? 0 : 1);
    });
});
