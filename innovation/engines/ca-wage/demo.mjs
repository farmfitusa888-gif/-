// demo.mjs
//
// One week of a real-shaped schedule, run through the engine, printed the way a
// person would want to read it. This is the shortest honest answer to "what
// does this product actually do", and unlike a slide it recomputes every time.
//
// The week below is not a worst case. It is a warehouse schedule that looks
// completely ordinary on a pay stub: five normal days, one long one, one short
// Sunday, and a production bonus. Nothing about it looks like theft.
//
// Run: node engines/ca-wage/demo.mjs

import { computeWorkweek, cumulative } from "./rules.mjs";

const money = (n) => `$${n.toFixed(2)}`;
const line = (c = "-") => console.log(c.repeat(74));

const week = {
  baseHourlyRate: 19.0,
  // A production bonus. This is the number that breaks the whole calculation,
  // and it is the reason a worker cannot check this themselves.
  nonDiscretionaryPay: 75.0,
  days: [
    { date: "2026-03-02", hoursWorked: 8.0,  mealPeriodsTaken: 1, restPeriodsTaken: 2 },
    { date: "2026-03-03", hoursWorked: 8.5,  mealPeriodsTaken: 1, restPeriodsTaken: 2 },
    { date: "2026-03-04", hoursWorked: 8.0,  mealPeriodsTaken: 1, restPeriodsTaken: 2 },
    // A thirteen-hour day. Everything past twelve is double time, and payroll
    // systems configured for federal rules do not know that.
    { date: "2026-03-05", hoursWorked: 13.0, mealPeriodsTaken: 1, restPeriodsTaken: 2 },
    { date: "2026-03-06", hoursWorked: 8.0,  mealPeriodsTaken: 0, restPeriodsTaken: 2 },
    { date: "2026-03-07", hoursWorked: 9.0,  mealPeriodsTaken: 1, restPeriodsTaken: 2 },
    // Seventh consecutive day. The first eight hours are time and a half
    // regardless of how few hours the week held.
    { date: "2026-03-08", hoursWorked: 5.0,  mealPeriodsTaken: 1, restPeriodsTaken: 1 },
  ],
  // What the employer actually paid: every hour at the base rate, plus the
  // bonus. No overtime premium at all, which is the common shape of the error.
  paid: { grossPay: 59.5 * 19.0 + 75.0, totalHours: 59.5 },
};

const r = computeWorkweek(week);

console.log("\nBACKPAY — one week, one warehouse worker in California");
line("=");
console.log(`  Base rate on the stub        ${money(week.baseHourlyRate)}/hour`);
console.log(`  Production bonus             ${money(week.nonDiscretionaryPay)}`);
console.log(`  Hours worked                 ${r.totalHours}`);
console.log(`  Employer paid                ${money(week.paid.grossPay)}`);
line();

console.log("\n  THE FIRST ERROR, AND IT IS INVISIBLE ON THE STUB\n");
console.log(`  Regular rate is ${money(r.regularRate)}, not ${money(week.baseHourlyRate)}.`);
console.log(`  A non-discretionary bonus has to be spread across the hours it was`);
console.log(`  earned in, which raises the rate every overtime hour is paid at.`);
console.log(`  That number appears on no document the worker receives.\n`);

line();
console.log("\n  HOW THE HOURS CLASSIFY\n");
console.log(`  Straight time        ${String(r.classification.straight).padStart(6)} h`);
console.log(`  Time and a half      ${String(r.classification.timeAndHalf).padStart(6)} h`);
console.log(`  Double time          ${String(r.classification.doubleTime).padStart(6)} h`);

line();
console.log("\n  WHAT THE LAW REQUIRED\n");
for (const [label, value] of [
  ["Straight-time pay", r.pay.straightPay],
  ["Overtime at 1.5x", r.pay.otPay],
  ["Double time at 2x", r.pay.dtPay],
  ["Meal and rest premiums", r.pay.premiumPay],
]) {
  if (value) console.log(`  ${label.padEnd(34)} ${money(value).padStart(10)}`);
}
console.log(`  ${"TOTAL OWED".padEnd(34)} ${money(r.shortfall.owed).padStart(10)}`);
console.log(`  ${"PAID".padEnd(34)} ${money(r.shortfall.paid).padStart(10)}`);
line();
console.log(`  ${"SHORTFALL, ONE WEEK".padEnd(34)} ${money(r.shortfall.difference).padStart(10)}`);
line();

if (r.notes?.length) {
  console.log("\n  EVERY FINDING NAMES THE RULE THAT PRODUCED IT\n");
  for (const n of r.notes) {
    console.log(`  [${n.rule.cite || n.rule.id || "rule"}] ${n.detail}`);
  }
}

// One week is a number. Two years is a case.
const weeks = Array.from({ length: 96 }, () => computeWorkweek(week));
const total = cumulative(weeks);
console.log("\n  WHY A LAW FIRM CARES\n");
console.log(`  The same schedule, repeated across a 96-week class period:`);
console.log(`     one worker            ${money(total.totalShortfall).padStart(12)}`);
console.log(`     a class of 40         ${money(total.totalShortfall * 40).padStart(12)}`);
console.log(`     a class of 200        ${money(total.totalShortfall * 200).padStart(12)}`);
console.log(`\n  That is the arithmetic a paralegal currently does in a spreadsheet,`);
console.log(`  by hand, for every named plaintiff, and it is what gets checked line`);
console.log(`  by line in a motion for class certification.\n`);

if (r.blockers?.length) {
  console.log("  REFUSED TO ANSWER:");
  for (const b of r.blockers) console.log(`    ${b}`);
  console.log();
}
