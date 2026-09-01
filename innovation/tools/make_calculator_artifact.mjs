// Package the calculator as one self-contained page.
//
// The design, the copy and the engine already exist. This does not redesign
// anything; it takes the built page and inlines the two ES modules so the file
// stands alone, then strips the chrome whose links would go nowhere outside the
// site. The engine is inlined verbatim, which keeps the one-source-of-truth
// property: the file the 24 tests run against is the file this page executes.

import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const R = (p) => join(ROOT, p);

let html = readFileSync(R("dist/backpay/check/index.html"), "utf8");
const rules = readFileSync(R("engines/ca-wage/rules.mjs"), "utf8");
const check = readFileSync(R("platform/app/check.js"), "utf8");

// Both files declare a top-level `money`, so plain concatenation is a
// duplicate declaration and the whole module refuses to load. rules.mjs goes
// in its own scope and hands out only what the page imports, which is also
// what the real module boundary does.
const engine = rules.replace(/^export /gm, "");
const client = check.replace(/^import .*?;\s*$/m, "").replace(/^export /gm, "");
const inlined = `const __engine = (() => {
${engine}
  return { computeWorkweek, cumulative };
})();
const { computeWorkweek, cumulative } = __engine;

${client}`;

html = html.replace(/<script type="module" src="\/app\/check\.js"><\/script>/,
  `<script type="module">\n${inlined}\n</script>`);

// Chrome that points at pages this file does not contain.
html = html.replace(/<header class="nav">[\s\S]*?<\/header>/, "");
html = html.replace(/<div class="wrap"><nav class="crumbs"[\s\S]*?<\/nav><\/div>/, "");
html = html.replace(/<footer class="site">[\s\S]*?<\/footer>/, "");
html = html.replace(/<a class="skip"[^>]*>.*?<\/a>/, "");
// The waitlist link has nowhere to go here.
html = html.replace(/<div class="cta-row"><a class="btn" href="\/start">.*?<\/div>/g, "");

// The artifact host supplies its own doctype, head and body wrapper.
const title = "Backpay Wage Check";
const style = (html.match(/<style>([\s\S]*?)<\/style>/) || [])[1] || "";
const fonts = (html.match(/<link rel="stylesheet" href="https:\/\/fonts\.googleapis[^"]*">/) || [])[0] || "";
const body = (html.match(/<body[^>]*>([\s\S]*?)<\/body>/) || [])[1] || "";

// body.v-ledger carries the whole visual language. Adding the class by script
// would leave the page unstyled for a beat, so the selector is rewritten to
// apply unconditionally instead.
const scoped = style.replace(/body\.v-ledger\b/g, "body");

const out = `<title>${title}</title>
${fonts}
<style>
${scoped}
/* Standalone: no site chrome, so the page carries its own top margin and a
   footer note that would otherwise live in the site footer. */
body{background:var(--paper);color:var(--ink)}
main{padding-top:8px}
.standalone-note{max-width:760px;margin:0 auto;padding:26px 20px 48px;font-size:13.5px;
  line-height:1.6;color:var(--muted);border-top:1px solid var(--rule)}
</style>
${body}
`;

writeFileSync(R("dist/backpay-calculator.html"), out);
console.log(`  wrote dist/backpay-calculator.html  (${Math.round(out.length / 1024)} KB)`);
