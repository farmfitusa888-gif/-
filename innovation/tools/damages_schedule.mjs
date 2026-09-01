#!/usr/bin/env node
// The firm-facing command. Payroll export in, cited damages schedule out.
//
// Usage:
//   node tools/damages_schedule.mjs payroll.csv
//   node tools/damages_schedule.mjs payroll.csv --out schedule.csv --json summary.json
//   node tools/damages_schedule.mjs --demo        # 40 workers, 96 weeks, no file needed
//
// This is the thing that costs a firm roughly $2,300 of paralegal time per
// matter (research/13-DAMAGES-MODEL-COST.md). It does not replace the judgement
// in that time. It replaces the arithmetic, and it shows its authority on every
// row so the judgement has something to check.

import { readFileSync, writeFileSync } from "node:fs";
import { parseCsv, mapColumns, buildSchedule, toCsv } from "../engines/ca-wage/schedule.mjs";

const money = (n) => "$" + Number(n || 0).toLocaleString("en-US",
  { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const args = process.argv.slice(2);
const flag = (name) => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : null; };

function demoCsv() {
  // A shape that occurs constantly in warehouse and retail matters: a bonus in
  // the period, one long shift, and a seventh consecutive day.
  const rows = ["employee,date,hours,rate,bonus,gross"];
  const pattern = [8, 8.5, 8, 13, 8, 9, 5];
  for (let w = 0; w < 96; w++) {
    for (let e = 1; e <= 40; e++) {
      const rate = 18 + (e % 5);
      pattern.forEach((h, d) => {
        const day = new Date(Date.UTC(2024, 0, 1 + w * 7 + d)).toISOString().slice(0, 10);
        rows.push([`Employee ${String(e).padStart(2, "0")}`, day, h, rate,
          d === 0 ? 75 : 0, (h * rate).toFixed(2)].join(","));
      });
    }
  }
  return rows.join("\n") + "\n";
}

const src = args.find((a) => !a.startsWith("--") && args[args.indexOf(a) - 1] !== "--out"
  && args[args.indexOf(a) - 1] !== "--json");

let text;
if (args.includes("--demo")) {
  text = demoCsv();
  console.log("\n  Running the built-in demo: 40 employees, 96 weeks.");
} else if (!src) {
  console.error("\n  usage: node tools/damages_schedule.mjs <payroll.csv> [--out f.csv] [--json f.json]");
  console.error("         node tools/damages_schedule.mjs --demo\n");
  process.exit(2);
} else {
  text = readFileSync(src, "utf8");
}

const rows = parseCsv(text);
if (!rows.length) { console.error("\n  No data rows found.\n"); process.exit(2); }

const cols = mapColumns(Object.keys(rows[0]));
if (cols.missing.length) {
  console.error(`\n  Cannot proceed. Missing required column(s): ${cols.missing.join(", ")}`);
  console.error(`  Columns seen: ${Object.keys(rows[0]).join(", ")}`);
  console.error("  Rename the column or add an alias in engines/ca-wage/schedule.mjs.\n");
  process.exit(3);
}

const s = buildSchedule(rows, cols);

console.log("\n  DAMAGES SCHEDULE");
console.log("  " + "=".repeat(66));
console.log(`  ${s.employees} employees, ${s.weeks} workweeks examined`);
if (s.weeksExcluded) console.log(`  ${s.weeksExcluded} weeks excluded and listed with their reason`);
if (s.badDates.length) console.log(`  Unreadable dates, ignored and reported: ${s.badDates.join(", ")}`);
console.log(`\n  Class exposure${" ".repeat(20)}${money(s.classShortfall).padStart(16)}`);
console.log("  " + "-".repeat(66));
console.log("  Largest ten claims\n");
for (const e of s.perEmployee.slice(0, 10)) {
  const wk = e.totals.weeksWithShortfall;
  console.log(`    ${e.employee.padEnd(22)} ${money(e.totals.totalShortfall).padStart(14)}` +
              `   ${String(wk).padStart(3)} of ${e.totals.weeksUsable} weeks short`);
}
console.log("\n  Mapped columns: " + Object.entries(cols.found).map(([k, v]) => `${k}=${v}`).join(", "));
console.log("  Workweeks grouped Monday to Sunday. If the employer defines its");
console.log("  workweek differently, that grouping is wrong and must be set.\n");

const outCsv = flag("--out") || "damages-schedule.csv";
writeFileSync(outCsv, toCsv(s));
console.log(`  Per-week schedule written to ${outCsv}`);
if (flag("--json")) {
  writeFileSync(flag("--json"), JSON.stringify(s, null, 2));
  console.log(`  Full detail written to ${flag("--json")}`);
}
console.log();
