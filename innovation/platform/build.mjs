#!/usr/bin/env node
/**
 * build.mjs — one generator, seven sites.
 *
 * Reads platform/sites/<slug>.json and writes dist/<slug>/. Hand-writing seven
 * SEO sites would mean seven chances to get the metadata wrong and seven places
 * to fix every future improvement; this way a change to the head or the schema
 * graph lands on all seven at once.
 *
 * Usage:
 *   node platform/build.mjs            # build every site
 *   node platform/build.mjs paystub    # build one
 */

import { readFileSync, writeFileSync, mkdirSync, readdirSync, rmSync, copyFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { head, sitemap, robots, webmanifest, feed, abs, esc, clamp, plain } from "./seo.mjs";

const ROOT = dirname(fileURLToPath(import.meta.url));
const SITES = join(ROOT, "sites");
const DIST = join(ROOT, "..", "dist");

/* ------------------------------------------------------------------ *
 * Design system — tokens come from the site config so each brand differs,
 * but the layout logic is shared. Light and dark are both defined at token
 * level so a page never renders one theme's text on the other's ground.
 * ------------------------------------------------------------------ */

const css = (s) => `
:root{
  --paper:${s.theme.light.paper}; --card:${s.theme.light.card}; --ink:${s.theme.light.ink};
  --muted:${s.theme.light.muted}; --accent:${s.theme.light.accent}; --accent-soft:${s.theme.light.accentSoft};
  --rule:${s.theme.light.rule}; --focus:${s.theme.light.accent};
  --display:${s.theme.displayFont}; --body:${s.theme.bodyFont}; --mono:${s.theme.monoFont};
  --measure:68ch;
}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){
  --paper:${s.theme.dark.paper}; --card:${s.theme.dark.card}; --ink:${s.theme.dark.ink};
  --muted:${s.theme.dark.muted}; --accent:${s.theme.dark.accent}; --accent-soft:${s.theme.dark.accentSoft};
  --rule:${s.theme.dark.rule}; --focus:${s.theme.dark.accent};
}}
:root[data-theme="dark"]{
  --paper:${s.theme.dark.paper}; --card:${s.theme.dark.card}; --ink:${s.theme.dark.ink};
  --muted:${s.theme.dark.muted}; --accent:${s.theme.dark.accent}; --accent-soft:${s.theme.dark.accentSoft};
  --rule:${s.theme.dark.rule}; --focus:${s.theme.dark.accent};
}
*{box-sizing:border-box}
html{scroll-behavior:smooth}
@media (prefers-reduced-motion:reduce){html{scroll-behavior:auto}*{animation:none!important;transition:none!important}}
body{margin:0;background:var(--paper);color:var(--ink);font-family:var(--body);font-size:17px;line-height:1.65;-webkit-font-smoothing:antialiased}
.wrap{max-width:1080px;margin:0 auto;padding:0 clamp(18px,5vw,40px)}
.col{max-width:var(--measure)}
a{color:var(--accent);text-underline-offset:2px}
a:focus-visible,button:focus-visible{outline:2px solid var(--focus);outline-offset:3px;border-radius:2px}
h1,h2,h3,h4{margin:0;text-wrap:balance;font-family:var(--display);font-weight:600;letter-spacing:-.015em}
h1{font-size:clamp(34px,5.6vw,58px);line-height:1.06}
h2{font-size:clamp(25px,3.6vw,36px);line-height:1.16}
h3{font-size:20px}
p{margin:0 0 1.05em}
.eyebrow{font-family:var(--mono);font-size:11px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:var(--accent);display:block;margin-bottom:12px}
.lede{font-size:20px;line-height:1.5;color:var(--muted);max-width:60ch}
.skip{position:absolute;left:-9999px}
.skip:focus{left:8px;top:8px;background:var(--card);padding:10px 14px;z-index:100;border:1px solid var(--rule);border-radius:3px}

header.nav{border-bottom:1px solid var(--rule);position:sticky;top:0;background:color-mix(in srgb,var(--paper) 92%,transparent);backdrop-filter:blur(8px);z-index:50}
header.nav .wrap{display:flex;align-items:center;gap:22px;height:62px}
.brand{font-family:var(--display);font-weight:700;font-size:19px;color:var(--ink);text-decoration:none;letter-spacing:-.02em;margin-right:auto}
header.nav a.navlink{font-size:14.5px;color:var(--muted);text-decoration:none}
header.nav a.navlink:hover{color:var(--ink)}
.btn{display:inline-block;background:var(--accent);color:var(--paper);padding:10px 18px;border-radius:3px;text-decoration:none;font-weight:600;font-size:15px;border:1px solid var(--accent)}
.btn.ghost{background:transparent;color:var(--accent)}
@media(max-width:760px){header.nav a.navlink{display:none}}

section{padding:clamp(44px,6vw,74px) 0}
section.tint{background:var(--card);border-block:1px solid var(--rule)}
.hero{padding-top:clamp(48px,7vw,90px)}
.hero .lede{margin-top:20px}
.cta-row{display:flex;flex-wrap:wrap;gap:12px;margin-top:26px}
.note{font-family:var(--mono);font-size:12px;color:var(--muted);margin-top:14px}

.grid{display:grid;gap:20px;margin-top:30px}
.g2{grid-template-columns:repeat(auto-fit,minmax(280px,1fr))}
.g3{grid-template-columns:repeat(auto-fit,minmax(240px,1fr))}
.tile{background:var(--card);border:1px solid var(--rule);border-radius:4px;padding:22px}
.tile h3{margin-bottom:8px}
.tile p{color:var(--muted);font-size:15.5px;margin:0}

.stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:1px;background:var(--rule);border:1px solid var(--rule);border-radius:4px;overflow:hidden;margin-top:28px}
.stat{background:var(--card);padding:20px}
.stat b{display:block;font-family:var(--mono);font-size:29px;font-weight:700;color:var(--accent);font-variant-numeric:tabular-nums;letter-spacing:-.02em}
.stat span{display:block;font-size:14px;color:var(--muted);margin-top:6px;line-height:1.45}
.stat cite{display:block;font-family:var(--mono);font-size:10.5px;color:var(--muted);opacity:.75;margin-top:8px;font-style:normal}

ol.steps{list-style:none;counter-reset:s;padding:0;margin:28px 0 0;display:grid;gap:1px;background:var(--rule);border:1px solid var(--rule);border-radius:4px;overflow:hidden}
ol.steps li{background:var(--card);padding:20px 22px;display:grid;grid-template-columns:auto 1fr;gap:18px;align-items:start}
ol.steps li::before{counter-increment:s;content:counter(s);font-family:var(--mono);font-weight:700;color:var(--accent);font-size:15px;line-height:1.6}
ol.steps h3{margin-bottom:5px}
ol.steps p{margin:0;color:var(--muted);font-size:15.5px}

.prices{display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:20px;margin-top:30px}
.price{background:var(--card);border:1px solid var(--rule);border-radius:4px;padding:24px;display:flex;flex-direction:column}
.price.feature{border-color:var(--accent);border-width:2px}
.price .amt{font-family:var(--mono);font-size:34px;font-weight:700;letter-spacing:-.02em;margin:10px 0 4px}
.price .per{font-size:13.5px;color:var(--muted)}
.price ul{list-style:none;padding:0;margin:16px 0 22px;display:grid;gap:8px;font-size:15px}
.price li{padding-left:20px;position:relative;color:var(--muted)}
.price li::before{content:"";position:absolute;left:0;top:.62em;width:9px;height:2px;background:var(--accent)}
/* The calculator. Deliberately plain: someone reading this has a pay stub in
   one hand and is deciding whether to trust a website with a number that
   matters to them. Ornament would be the wrong signal. */
.calc form{margin-top:26px}
table.days thead th{text-transform:none;letter-spacing:0;font-size:13.5px}
.calc fieldset{border:1px solid var(--rule);background:var(--card);padding:20px 22px 22px;margin:0 0 18px}
.calc legend{font-family:var(--display);font-size:19px;font-weight:600;padding:0 8px;color:var(--ink)}
.calc .hint{display:block;font-size:13.5px;color:var(--muted);line-height:1.5;margin:4px 0 0;font-weight:400}
.calc .fields{display:grid;grid-template-columns:repeat(auto-fit,minmax(215px,1fr));gap:18px;margin-top:6px}
.calc label{display:block;font-size:15px;font-weight:600}
.calc input[type=number],.calc select{width:100%;margin-top:7px;padding:9px 11px;font:inherit;
  font-size:16px;background:var(--paper);color:var(--ink);border:1px solid var(--rule);border-radius:2px}
.calc input:focus-visible,.calc select:focus-visible,.calc button:focus-visible{
  outline:2px solid var(--accent);outline-offset:2px}
table.days{width:100%;border-collapse:collapse;margin-top:12px}
table.days th{text-align:left;font-size:13px;font-weight:600;color:var(--muted);padding:6px 8px 6px 0}
table.days tbody th{font-weight:500;font-size:15px;color:var(--ink);white-space:nowrap;padding-right:14px}
table.days td{padding:5px 8px 5px 0}
table.days td:first-of-type{width:22%}
.calc .checks{display:grid;gap:11px;margin-top:12px}
.calc label.chk{font-weight:400;font-size:15px;display:flex;gap:10px;align-items:flex-start;line-height:1.5}
.calc label.chk input{margin-top:3px;flex:0 0 auto;width:auto}
.calc button.btn{cursor:pointer;font-size:16px;padding:12px 26px}
.calc-noscript{margin-top:16px;padding:14px 16px;border-left:3px solid var(--accent);background:var(--accentSoft);font-size:15px}
@media(max-width:620px){
  table.days,table.days tbody,table.days tr,table.days td,table.days th{display:block}
  table.days thead{display:none}
  table.days tr{border-top:1px solid var(--rule);padding:10px 0}
  table.days tbody th{padding:0 0 6px}
  table.days td{padding:0 0 8px}
  table.days td:first-of-type{width:auto}
}

.result{margin-top:30px;border-top:2px solid var(--ink);padding-top:24px}
.result h2{margin-top:0}
.result.refused{border-top-color:var(--accent)}
.result.refused ul{margin:14px 0;padding-left:20px}
.result.refused li{margin-bottom:8px;color:var(--accent);font-size:15px;line-height:1.55}
.result .v-short{font-size:20px;line-height:1.5;margin-top:20px}
.result .v-short strong{color:var(--accent)}
.result .v-ok,.result .v-none{font-size:17px;line-height:1.55;margin-top:20px;color:var(--muted)}
.result .whys{margin-top:26px;border-top:1px solid var(--rule);padding-top:18px}
.result .whys h3{font-size:16px;margin:0 0 12px}
.result p.why{font-size:14.5px;line-height:1.6;color:var(--muted);margin-bottom:10px;max-width:66ch}
.result p.why .cite{font-family:var(--mono);font-size:12.5px;color:var(--accent);display:block}
.result .after{margin-top:24px;font-size:14.5px;color:var(--muted);line-height:1.62;max-width:64ch;
  border-left:2px solid var(--rule);padding-left:14px}

/* ---------------------------------------------------------------------------
   Backpay's visual language. Grounded in the subject's own material: a pay
   stub is printed on safety paper, and a person checking one marks the error
   in red pencil. So the ground is a desaturated safety green and the accent is
   audit red, neither of which is decoration.

   Three deliberate departures from the shared template, each because the
   shared version is a generated-page tell rather than a choice:
     - no tracked-out capital eyebrow above every heading
     - monospace only on columns of money, where tabular figures are the
       functional requirement, never on labels
     - the signature element carries the boldness; everything else stays quiet
   --------------------------------------------------------------------------- */
/* Four corrections, all found by rendering the page and looking at it rather
   than by any check that exists. */

/* 1. The shared .note is monospace, which is the "mono for small labels" tell
      and reads as a system message rather than a sentence. */
body.v-ledger .note{font-family:var(--body);font-size:14.5px}

/* 2. The split heading sat directly on its own body copy with no gap. */
body.v-ledger .split .sp-a .col{margin-top:14px}
body.v-ledger .split .sp-a h2{margin-bottom:0}

/* 3. The shortfall is the payoff of the whole stub and was rendering as one
      more row. It now closes the figure the way a total closes a column. */
figure.stub tr:last-of-type th,figure.stub tr:last-of-type td.n{
  border-top:2px solid var(--ink);padding-top:13px;padding-bottom:14px;
  font-weight:600;font-size:16px}
figure.stub tr:last-of-type td.n{color:var(--accent);font-size:18px}

/* 4. Stacked sections were producing a hero's worth of empty ground between
      blocks. Consecutive full-bleed sections share one rhythm instead. */
body.v-ledger section{padding:clamp(34px,4.4vw,58px) 0}
body.v-ledger .stub-sec{padding-top:clamp(30px,4vw,54px);padding-bottom:clamp(40px,5vw,70px)}
body.v-ledger .bignum-sec{padding:clamp(44px,6vw,82px) 0}

/* A stray partial rule was showing under the last stub row: the row above it
   zeroes its own borders, so the total's border-top was drawing against a
   cell that had already collapsed. Borders are now set once, deliberately. */
figure.stub th,figure.stub td{border:0}
body.v-ledger .stub-sec + .bignum-sec{padding-top:clamp(46px,6vw,86px)}

body.v-ledger .eyebrow{display:none}
body.v-ledger h1{font-size:clamp(38px,5.4vw,66px);line-height:1.02;letter-spacing:-.025em;font-weight:500}
body.v-ledger h2{font-size:clamp(25px,2.9vw,36px);line-height:1.12;letter-spacing:-.016em;font-weight:500}
body.v-ledger .lede{font-size:19px;line-height:1.62;max-width:54ch}
body.v-ledger .btn{border-radius:2px}

.stub-sec{padding-top:clamp(34px,5vw,60px)}
.stub-grid{display:grid;grid-template-columns:1.05fr .95fr;gap:clamp(28px,5vw,64px);align-items:start}
@media(max-width:900px){.stub-grid{grid-template-columns:1fr}}
.stub-copy h1{margin:0 0 18px}
.stub-copy .note{margin-top:20px;font-size:14px;color:var(--muted);max-width:46ch;line-height:1.6}

figure.stub{margin:0;background:var(--card);border:1px solid var(--rule);
  box-shadow:0 1px 0 var(--rule),0 18px 40px -28px rgba(0,0,0,.45);padding:0}
figure.stub figcaption{font-size:12.5px;letter-spacing:.02em;color:var(--muted);
  padding:13px 20px;border-bottom:1px solid var(--rule);background:var(--accentSoft)}
figure.stub table{width:100%;border-collapse:collapse}
figure.stub th{text-align:left;font-weight:400;font-size:14.5px;color:var(--muted);
  padding:9px 20px;white-space:nowrap}
figure.stub td.n{text-align:right;font-family:var(--mono);font-size:14.5px;
  font-variant-numeric:tabular-nums;padding:9px 20px;color:var(--ink)}
figure.stub tr.flagged th,figure.stub tr.flagged td{color:var(--accent);font-weight:600}
figure.stub tr.mark td{padding:0 20px 12px;border:0}
figure.stub tr.mark span{display:inline-block;font-size:13px;line-height:1.5;color:var(--accent);
  border-left:2px solid var(--accent);padding:2px 0 2px 11px;max-width:38ch}
.stub-foot{margin:0;padding:13px 20px;border-top:1px solid var(--rule);
  font-size:12.5px;color:var(--muted);line-height:1.55}

.ledger-sec .ledger{margin-top:26px;border:1px solid var(--rule);background:var(--card)}
.lg-head{display:flex;justify-content:space-between;padding:12px 20px;
  border-bottom:1px solid var(--rule);font-size:12.5px;color:var(--muted);background:var(--accentSoft)}
.lg-row,.lg-total{display:flex;justify-content:space-between;gap:24px;padding:11px 20px;
  border-bottom:1px solid color-mix(in srgb,var(--rule) 55%,transparent)}
.lg-row.strong{font-weight:600}
.lg-label{font-size:15px;line-height:1.45}
.lg-cite{display:block;font-size:12px;color:var(--muted);margin-top:3px}
.lg-val{font-family:var(--mono);font-variant-numeric:tabular-nums;font-size:15px;white-space:nowrap}
.lg-total{border-bottom:0;border-top:2px solid var(--ink);background:var(--accentSoft);
  font-weight:600;font-size:17px}
.lg-total .lg-val{font-size:19px;color:var(--accent)}
.lg-after{margin-top:18px;font-size:14.5px;color:var(--muted);max-width:62ch;line-height:1.62}

.bignum{display:grid;grid-template-columns:auto 1fr;gap:clamp(22px,4vw,50px);align-items:baseline}
@media(max-width:760px){.bignum{grid-template-columns:1fr}}
.bn-fig{font-family:var(--display);font-size:clamp(58px,11vw,132px);line-height:.86;
  letter-spacing:-.04em;color:var(--accent);font-variant-numeric:tabular-nums}
.bn-body h2{margin:0 0 10px}
.bn-body p{max-width:56ch}
.bn-src{font-size:13px;color:var(--muted);margin-top:12px}

.split{display:grid;grid-template-columns:1fr 1.15fr;gap:clamp(26px,5vw,58px)}
@media(max-width:860px){.split{grid-template-columns:1fr}}
.sp-item{padding:18px 0;border-top:1px solid var(--rule)}
.sp-item:first-child{border-top:0;padding-top:0}
.sp-item h3{margin:0 0 6px;font-size:17px;font-weight:600}
.sp-item p{margin:0;color:var(--muted);font-size:15px;line-height:1.62;max-width:58ch}

mark.fill{background:#FFF4D6;color:#7A5A00;padding:1px 5px;border-radius:2px;font-size:.92em;
  font-family:var(--mono);font-style:normal}
:root[data-theme="dark"] mark.fill,
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]) mark.fill{background:#4A3B10;color:#F0D98A}}
.price .annual{font-size:13px;color:var(--accent);margin-top:6px;font-weight:600}
.price .btn{margin-top:auto;text-align:center}
.price .pnote{font-size:12.5px;color:var(--muted);margin:12px 0 0;line-height:1.5}

details.faq{border-bottom:1px solid var(--rule);padding:16px 0}
details.faq summary{cursor:pointer;font-weight:600;font-size:17px;list-style:none;display:flex;gap:12px;align-items:baseline}
details.faq summary::-webkit-details-marker{display:none}
details.faq summary::before{content:"+";font-family:var(--mono);color:var(--accent);font-weight:700}
details.faq[open] summary::before{content:"\\2013"}
details.faq .a{padding:10px 0 2px 24px;color:var(--muted);max-width:66ch}

article.prose{max-width:var(--measure)}
article.prose h2{margin:34px 0 14px}
article.prose h3{margin:26px 0 10px}
article.prose ul,article.prose ol{color:var(--muted);padding-left:22px}
article.prose li{margin-bottom:7px}
article.prose blockquote{margin:22px 0;padding-left:20px;border-left:3px solid var(--accent);color:var(--ink);font-family:var(--display);font-size:19px;line-height:1.5}
.toc{background:var(--card);border:1px solid var(--rule);border-radius:4px;padding:18px 22px;margin:26px 0}
.toc p{font-family:var(--mono);font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:var(--muted);margin:0 0 10px}
.toc ol{margin:0;padding-left:20px;font-size:15px}
.toc li{margin-bottom:5px}

.scroller{overflow-x:auto;border:1px solid var(--rule);border-radius:4px;background:var(--card);margin:26px 0}
table{border-collapse:collapse;width:100%;font-size:15px;min-width:520px}
th,td{padding:11px 15px;text-align:left;border-bottom:1px solid var(--rule);font-variant-numeric:tabular-nums}
thead th{font-family:var(--mono);font-size:10.5px;letter-spacing:.12em;text-transform:uppercase;color:var(--muted);font-weight:700}
tbody tr:last-child td{border-bottom:none}

.crumbs{font-size:13.5px;color:var(--muted);padding-top:22px}
.crumbs a{color:var(--muted)}
.cardlinks{display:grid;grid-template-columns:repeat(auto-fit,minmax(270px,1fr));gap:16px;margin-top:26px}
.cardlink{display:block;background:var(--card);border:1px solid var(--rule);border-radius:4px;padding:20px;text-decoration:none;color:var(--ink)}
.cardlink:hover{border-color:var(--accent)}
.cardlink b{display:block;font-family:var(--display);font-size:17px;margin-bottom:6px}
.cardlink span{font-size:14.5px;color:var(--muted)}

.disclaimer{background:var(--accent-soft);border:1px solid var(--rule);border-radius:4px;padding:18px 22px;margin-top:30px;font-size:14.5px;color:var(--ink)}
.disclaimer b{font-family:var(--mono);font-size:11px;letter-spacing:.13em;text-transform:uppercase;display:block;margin-bottom:7px;color:var(--accent)}

footer.site{border-top:1px solid var(--rule);margin-top:40px;padding:38px 0}
footer.site .cols{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:26px}
footer.site h4{font-family:var(--mono);font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:var(--muted);margin-bottom:11px;font-weight:700}
footer.site a{display:block;font-size:14.5px;color:var(--muted);text-decoration:none;margin-bottom:7px}
footer.site a:hover{color:var(--ink)}
footer.site .legal{margin-top:30px;padding-top:20px;border-top:1px solid var(--rule);font-size:13px;color:var(--muted);max-width:80ch}
`;

/* ------------------------------------------------------------------ *
 * Chrome
 * ------------------------------------------------------------------ */

const nav = (s) => `<a class="skip" href="#main">Skip to content</a>
<header class="nav"><div class="wrap">
  <a class="brand" href="/">${esc(s.brand)}</a>
  ${(s.nav || []).map((n) => `<a class="navlink" href="${n.path}">${esc(n.label)}</a>`).join("\n  ")}
  <a class="btn" href="${s.cta.path}">${esc(s.cta.label)}</a>
</div></header>`;

const footer = (s) => `<footer class="site"><div class="wrap">
  <div class="cols">
    ${(s.footer || [])
      .map(
        (g) => `<div><h4>${esc(g.title)}</h4>${g.links
          .map((l) => `<a href="${l.path}">${esc(l.label)}</a>`)
          .join("")}</div>`
      )
      .join("\n    ")}
  </div>
  <div class="legal">
    <p>© ${new Date().getUTCFullYear()} ${esc(s.brand)}. ${esc(s.footerLegal || "")}</p>
    ${s.disclaimer ? `<p>${esc(s.disclaimer)}</p>` : ""}
  </div>
</div></footer>`;

const crumbs = (s, page) => {
  if (page.path === "/") return "";
  const trail = [{ name: "Home", path: "/" }, ...(page.breadcrumb || [])];
  return `<div class="wrap"><nav class="crumbs" aria-label="Breadcrumb">${trail
    .map((t) => `<a href="${t.path}">${esc(t.name)}</a> / `)
    .join("")}<span>${esc(page.h1 || page.title)}</span></nav></div>`;
};

/* ------------------------------------------------------------------ *
 * Section renderers
 * ------------------------------------------------------------------ */

const R = {
  hero: (b, s) => `<section class="hero"><div class="wrap col">
    ${b.eyebrow ? `<span class="eyebrow">${esc(b.eyebrow)}</span>` : ""}
    <h1>${esc(b.h1)}</h1>
    <p class="lede">${b.lede}</p>
    ${b.cta === false ? "" : `<div class="cta-row"><a class="btn" href="${s.cta.path}">${esc(b.cta || s.cta.label)}</a>${
      b.cta2 ? `<a class="btn ghost" href="${b.cta2.path}">${esc(b.cta2.label)}</a>` : ""
    }</div>`}
    ${b.note ? `<p class="note">${esc(b.note)}</p>` : ""}
  </div></section>`,

  stats: (b) => `<section class="tint"><div class="wrap">
    ${b.h2 ? `<h2>${esc(b.h2)}</h2>` : ""}
    <div class="stats">${b.items
      .map(
        (i) =>
          `<div class="stat"><b>${esc(i.value)}</b><span>${i.label}</span>${
            i.cite ? `<cite>${esc(i.cite)}</cite>` : ""
          }</div>`
      )
      .join("")}</div>
  </div></section>`,

  prose: (b) => `<section><div class="wrap col">
    ${b.eyebrow ? `<span class="eyebrow">${esc(b.eyebrow)}</span>` : ""}
    ${b.h2 ? `<h2>${esc(b.h2)}</h2>` : ""}
    ${b.body}
  </div></section>`,

  tiles: (b) => `<section><div class="wrap">
    ${b.eyebrow ? `<span class="eyebrow">${esc(b.eyebrow)}</span>` : ""}
    ${b.h2 ? `<h2>${esc(b.h2)}</h2>` : ""}
    ${b.intro ? `<p class="lede">${b.intro}</p>` : ""}
    <div class="grid ${b.cols === 3 ? "g3" : "g2"}">${b.items
      .map((i) => `<div class="tile"><h3>${esc(i.title)}</h3><p>${i.body}</p></div>`)
      .join("")}</div>
  </div></section>`,

  steps: (b) => `<section class="tint"><div class="wrap col">
    ${b.eyebrow ? `<span class="eyebrow">${esc(b.eyebrow)}</span>` : ""}
    ${b.h2 ? `<h2>${esc(b.h2)}</h2>` : ""}
    <ol class="steps">${b.items
      .map((i, n) => `<li id="step-${n + 1}"><div><h3>${esc(i.name)}</h3><p>${i.text}</p></div></li>`)
      .join("")}</ol>
  </div></section>`,

  pricing: (b, s) => `<section><div class="wrap">
    ${b.eyebrow ? `<span class="eyebrow">${esc(b.eyebrow)}</span>` : ""}
    ${b.h2 ? `<h2>${esc(b.h2)}</h2>` : ""}
    ${b.intro ? `<p class="lede">${b.intro}</p>` : ""}
    <div class="prices">${s.pricing
      .map(
        (t) => `<div class="price${t.featured ? " feature" : ""}">
        <h3>${esc(t.name)}</h3>
        <div class="amt">${esc(t.price)}</div>
        <div class="per">${esc(t.per || "")}</div>
        ${t.annual ? `<div class="annual">${esc(t.annual)}</div>` : ""}
        <ul>${t.includes.map((i) => `<li>${esc(i)}</li>`).join("")}</ul>
        <a class="btn${t.featured ? "" : " ghost"}" href="${s.cta.path}">${esc(t.cta || s.cta.label)}</a>
        ${t.note ? `<p class="pnote">${esc(t.note)}</p>` : ""}
      </div>`
      )
      .join("")}</div>
    ${b.after ? `<div class="col">${b.after}</div>` : ""}
  </div></section>`,

  faq: (b) => `<section class="tint"><div class="wrap col">
    ${b.eyebrow ? `<span class="eyebrow">${esc(b.eyebrow)}</span>` : ""}
    ${b.h2 ? `<h2>${esc(b.h2)}</h2>` : ""}
    ${b.items
      .map(
        (f) =>
          `<details class="faq"><summary>${esc(f.q)}</summary><div class="a">${f.a}</div></details>`
      )
      .join("")}
  </div></section>`,

  // A week of arithmetic, shown as a ledger rather than described in prose.
  // The figures come from engines/ca-wage/demo.mjs, which recomputes on every
  // run, so this cannot drift into being a picture of something that used to
  // be true. Every row names the statute that produced it, which is the whole
  // product argument stated as a layout rather than a claim.
  calculator: (b) => `<section class="calc-sec"><div class="wrap">
    ${b.h2 ? `<h2>${esc(b.h2)}</h2>` : ""}
    ${b.intro ? `<p class="lede">${b.intro}</p>` : ""}
    <div id="calculator" class="calc"></div>
    <noscript><p class="calc-noscript">${esc(b.noscript || "This calculator runs entirely in your browser, which means it needs JavaScript switched on. Nothing is sent anywhere either way.")}</p></noscript>
    <script type="module" src="/app/check.js"></script>
  </div></section>`,

  stub: (b) => `<section class="stub-sec"><div class="wrap">
    <div class="stub-grid">
      <div class="stub-copy">
        ${b.h1 ? `<h1>${b.h1}</h1>` : ""}
        ${b.h2 ? `<h2>${esc(b.h2)}</h2>` : ""}
        <p class="lede">${b.lede}</p>
        ${b.cta !== false ? `<div class="cta-row"><a class="btn" href="${b.ctaPath || "/start"}">${esc(b.ctaLabel || "Join the early list")}</a>${
          b.cta2 ? `<a class="btn ghost" href="${b.cta2.path}">${esc(b.cta2.label)}</a>` : ""}</div>` : ""}
        ${b.note ? `<p class="note">${b.note}</p>` : ""}
      </div>
      <figure class="stub">
        <figcaption>${esc(b.stubTitle || "Earnings statement")}</figcaption>
        <table>
          <tbody>${b.lines.map((l) => `<tr class="${l.flag ? "flagged" : ""}">
            <th scope="row">${esc(l.label)}</th>
            <td class="n">${esc(l.value)}</td>
          </tr>${l.flag ? `<tr class="mark"><td colspan="2"><span>${l.flag}</span></td></tr>` : ""}`).join("")}</tbody>
        </table>
        ${b.stubFoot ? `<p class="stub-foot">${b.stubFoot}</p>` : ""}
      </figure>
    </div>
  </div></section>`,

  ledger: (b) => `<section class="ledger-sec"><div class="wrap">
    ${b.eyebrow ? `<span class="eyebrow">${esc(b.eyebrow)}</span>` : ""}
    ${b.h2 ? `<h2>${esc(b.h2)}</h2>` : ""}
    ${b.intro ? `<p class="lede">${b.intro}</p>` : ""}
    <div class="ledger">
      <div class="lg-head"><span>${esc(b.caption || "")}</span><span>${esc(b.captionRight || "")}</span></div>
      ${b.rows.map((r) => `<div class="lg-row${r.strong ? " strong" : ""}${r.rule ? " cited" : ""}">
        <div class="lg-label">${esc(r.label)}${r.rule ? `<span class="lg-cite">${esc(r.rule)}</span>` : ""}</div>
        <div class="lg-val">${esc(r.value)}</div>
      </div>`).join("")}
      ${b.total ? `<div class="lg-total">
        <div class="lg-label">${esc(b.total.label)}</div>
        <div class="lg-val">${esc(b.total.value)}</div>
      </div>` : ""}
    </div>
    ${b.after ? `<p class="lg-after">${b.after}</p>` : ""}
  </div></section>`,

  // One figure, at a size that makes the reader stop. Used sparingly: three
  // times across the whole site, each on a number that carries an argument.
  bignum: (b) => `<section class="bignum-sec"><div class="wrap">
    <div class="bignum">
      <div class="bn-fig">${esc(b.figure)}</div>
      <div class="bn-body">
        ${b.eyebrow ? `<span class="eyebrow">${esc(b.eyebrow)}</span>` : ""}
        ${b.h2 ? `<h2>${esc(b.h2)}</h2>` : ""}
        <p>${b.body}</p>
        ${b.source ? `<p class="bn-src">${esc(b.source)}</p>` : ""}
      </div>
    </div>
  </div></section>`,

  // Two columns that are deliberately unequal, for content that genuinely is.
  split: (b) => `<section class="split-sec"><div class="wrap">
    <div class="split">
      <div class="sp-a">
        ${b.eyebrow ? `<span class="eyebrow">${esc(b.eyebrow)}</span>` : ""}
        ${b.h2 ? `<h2>${esc(b.h2)}</h2>` : ""}
        ${b.body ? `<div class="col">${b.body}</div>` : ""}
      </div>
      <div class="sp-b">${(b.items || []).map((i) => `<div class="sp-item">
        <h3>${esc(i.name)}</h3><p>${i.text}</p>
      </div>`).join("")}</div>
    </div>
  </div></section>`,

  table: (b) => `<section><div class="wrap">
    ${b.h2 ? `<h2>${esc(b.h2)}</h2>` : ""}
    ${b.intro ? `<p class="lede">${b.intro}</p>` : ""}
    <div class="scroller"><table>
      <thead><tr>${b.headers.map((h) => `<th>${esc(h)}</th>`).join("")}</tr></thead>
      <tbody>${b.rows.map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join("")}</tr>`).join("")}</tbody>
    </table></div>
  </div></section>`,

  links: (b) => `<section><div class="wrap">
    ${b.eyebrow ? `<span class="eyebrow">${esc(b.eyebrow)}</span>` : ""}
    ${b.h2 ? `<h2>${esc(b.h2)}</h2>` : ""}
    <div class="cardlinks">${b.items
      .map(
        (i) =>
          `<a class="cardlink" href="${i.path}"><b>${esc(i.title)}</b><span>${esc(i.blurb)}</span></a>`
      )
      .join("")}</div>
  </div></section>`,

  disclaimer: (b) => `<section><div class="wrap col"><div class="disclaimer"><b>${esc(
    b.label || "Important"
  )}</b>${b.body}</div></div></section>`,

  cta: (b, s) => `<section class="tint"><div class="wrap col">
    <h2>${esc(b.h2)}</h2>
    ${b.body ? `<p class="lede">${b.body}</p>` : ""}
    <div class="cta-row"><a class="btn" href="${s.cta.path}">${esc(b.cta || s.cta.label)}</a></div>
  </div></section>`,
};

function renderBlocks(blocks, s) {
  return blocks
    .map((b) => {
      const fn = R[b.type];
      if (!fn) throw new Error(`Unknown block type: ${b.type}`);
      return fn(b, s);
    })
    .join("\n");
}

/** Guides are long-form prose; render from a section list with an auto TOC. */
function renderGuide(page, s) {
  const toc = page.sections
    .map((sec, i) => `<li><a href="#s${i + 1}">${esc(sec.h2)}</a></li>`)
    .join("");
  const body = page.sections
    .map((sec, i) => `<h2 id="s${i + 1}">${esc(sec.h2)}</h2>\n${sec.body}`)
    .join("\n");
  return `<section><div class="wrap"><article class="prose">
    <span class="eyebrow">${esc(page.section || "Guide")}</span>
    <h1>${esc(page.h1)}</h1>
    <p class="lede">${page.lede}</p>
    <div class="toc"><p>On this page</p><ol>${toc}</ol></div>
    ${body}
    ${page.faqs?.length ? `<h2 id="faq">Common questions</h2>${page.faqs.map((f) => `<details class="faq"><summary>${esc(f.q)}</summary><div class="a">${f.a}</div></details>`).join("")}` : ""}
    ${page.closing ? `<div class="disclaimer"><b>${esc(page.closingLabel || "Note")}</b>${page.closing}</div>` : ""}
  </article></div></section>`;
}

/* ------------------------------------------------------------------ *
 * Page assembly
 * ------------------------------------------------------------------ */

function renderPage(s, page) {
  const main =
    page.kind === "guide" ? renderGuide(page, s) : renderBlocks(page.blocks || [], s);
  return `<!doctype html>
<html lang="${s.lang || "en-US"}">
<head>
${head(s, page)}
${s.fontsHref ? `<link rel="stylesheet" href="${esc(s.fontsHref)}">` : ""}
<style>${css(s)}</style>
</head>
<body${s.styleVariant ? ` class="v-${s.styleVariant}"` : ""}>
${nav(s)}
${crumbs(s, page)}
<main id="main">
${main}
</main>
${footer(s)}
</body>
</html>
`;
}

/** Word count for Article schema — computed, never guessed. */
function countWords(page) {
  const text =
    page.kind === "guide"
      ? [page.lede, ...page.sections.map((x) => x.body), ...(page.faqs || []).map((f) => f.a)].join(" ")
      : JSON.stringify(page.blocks || "");
  return plain(text).split(/\s+/).filter(Boolean).length;
}

function buildSite(slug) {
  const s = JSON.parse(readFileSync(join(SITES, `${slug}.json`), "utf8"));
  const out = join(DIST, slug);
  rmSync(out, { recursive: true, force: true });
  mkdirSync(out, { recursive: true });

  const pages = s.pages.map((p) => ({ ...p, wordCount: countWords(p) }));

  for (const page of pages) {
    const html = renderPage(s, page);
    const file =
      page.path === "/" ? join(out, "index.html") : join(out, page.path.replace(/^\//, ""), "index.html");
    mkdirSync(dirname(file), { recursive: true });
    writeFileSync(file, html);
  }

  // Ship the calculator, for sites that have one.
  if (s.app?.length) {
    mkdirSync(join(out, "app"), { recursive: true });
    for (const src of s.app) {
      const from = join(ROOT, "..", src);
      if (!existsSync(from)) throw new Error(`app asset missing: ${src}`);
      copyFileSync(from, join(out, "app", src.split("/").pop()));
    }
  }

  writeFileSync(join(out, "sitemap.xml"), sitemap(s, pages));
  writeFileSync(join(out, "robots.txt"), robots(s));
  writeFileSync(join(out, "site.webmanifest"), webmanifest(s));
  writeFileSync(join(out, "feed.xml"), feed(s, pages));
  writeFileSync(
    join(out, "favicon.svg"),
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="10" fill="${s.theme.light.accent}"/><text x="32" y="44" font-family="Georgia,serif" font-size="36" font-weight="700" fill="#fff" text-anchor="middle">${esc(s.mark || s.brand[0])}</text></svg>`
  );
  writeFileSync(
    join(out, "humans.txt"),
    `/* TEAM */\nSite: ${s.brand}\nURL: https://${s.domain}\n\n/* SITE */\nStandards: HTML5, CSS3\nComponents: none — hand-rolled static\n`
  );

  return { slug, brand: s.brand, domain: s.domain, pages: pages.length };
}

const only = process.argv[2];
const slugs = only
  ? [only]
  : readdirSync(SITES).filter((f) => f.endsWith(".json")).map((f) => f.replace(/\.json$/, ""));

if (!slugs.length) {
  console.log("No site configs in platform/sites/. Nothing to build.");
  process.exit(0);
}

const results = slugs.map(buildSite);
for (const r of results) console.log(`built ${r.slug.padEnd(14)} ${String(r.pages).padStart(3)} pages  ${r.domain}`);
console.log(`\n${results.length} site(s), ${results.reduce((a, r) => a + r.pages, 0)} pages total -> innovation/dist/`);

/* ------------------------------------------------------------------ *
 * Raster icon. Referenced in the head, so it must exist — the validator
 * treats a dead asset link as a build error rather than a warning.
 * Rendered from the same SVG so the two never drift apart.
 * ------------------------------------------------------------------ */
import { execFileSync } from "node:child_process";
const CHROME = "/opt/pw-browsers/chromium-1194/chrome-linux/chrome";
for (const r of results) {
  const out = join(DIST, r.slug);
  try {
    execFileSync(
      CHROME,
      ["--headless", "--disable-gpu", "--no-sandbox", "--hide-scrollbars",
       "--window-size=180,180", "--default-background-color=00000000",
       `--screenshot=${join(out, "apple-touch-icon.png")}`,
       "file://" + join(out, "favicon.svg")],
      { stdio: "ignore" }
    );
  } catch {
    console.warn(`  ! could not rasterise icon for ${r.slug}`);
  }
}
