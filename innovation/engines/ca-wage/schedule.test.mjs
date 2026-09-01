// Tests for the bulk schedule builder.
//
// Written adversarially, because the failure mode here is not a crash. It is a
// schedule that looks complete and quietly omits the weeks it could not model,
// or that mis-maps a column and produces confident wrong numbers across two
// hundred people at once. Both would survive a smoke test.

import { parseCsv, mapColumns, buildSchedule, toCsv } from "./schedule.mjs";
import { computeWorkweek } from "./rules.mjs";
import { strict as assert } from "node:assert";

let pass = 0, fail = 0;
const t = (name, fn) => {
  try { fn(); pass++; console.log(`  PASS  ${name}`); }
  catch (e) { fail++; console.log(`  FAIL  ${name}\n        ${e.message}`); }
};

console.log("\nbulk schedule\n");

// --- CSV, as payroll systems actually emit it -----------------------------

t("quoted fields with embedded commas survive", () => {
  const rows = parseCsv('name,hours\n"Doe, Jane",8\n');
  assert.equal(rows[0].name, "Doe, Jane");
  assert.equal(rows[0].hours, "8");
});

t("escaped quotes survive", () => {
  const rows = parseCsv('name,x\n"She said ""no""",1\n');
  assert.equal(rows[0].name, 'She said "no"');
});

t("blank lines are dropped, not turned into empty employees", () => {
  assert.equal(parseCsv("a,b\n1,2\n\n3,4\n").length, 2);
});

t("a file with only headers yields no rows rather than throwing", () => {
  assert.deepEqual(parseCsv("a,b\n"), []);
});

// --- column mapping --------------------------------------------------------

t("common spellings map", () => {
  const m = mapColumns(["Employee ID", "Work Date", "Hours Worked", "Hourly Rate"]);
  assert.deepEqual(m.missing, []);
  assert.equal(m.found.hours, "Hours Worked");
});

t("a missing required column is named, not guessed at", () => {
  const m = mapColumns(["Employee", "Date", "Hours"]);
  assert.deepEqual(m.missing, ["rate"]);
});

// --- the arithmetic must match the single-week engine exactly --------------

const WEEK = [
  ["A", "2026-03-02", 8, 19, 75], ["A", "2026-03-03", 8.5, 19, 0],
  ["A", "2026-03-04", 8, 19, 0], ["A", "2026-03-05", 13, 19, 0],
  ["A", "2026-03-06", 8, 19, 0], ["A", "2026-03-07", 9, 19, 0],
  ["A", "2026-03-08", 5, 19, 0],
];
const csv = "employee,date,hours,rate,bonus,gross\n" +
  WEEK.map((r) => r.join(",") + ",0").join("\n") + "\n";

t("bulk path reproduces the single-week engine to the cent", () => {
  const rows = parseCsv(csv);
  const s = buildSchedule(rows, mapColumns(Object.keys(rows[0])));
  const bulk = s.perEmployee[0].weeks[0].result;
  const direct = computeWorkweek({
    baseHourlyRate: 19, nonDiscretionaryPay: 75,
    days: WEEK.map((r) => ({ date: r[1], hoursWorked: r[2], mealPeriodsTaken: 1, restPeriodsTaken: 2 })),
  });
  // Compare pay.owed, not shortfall.owed. The engine only populates shortfall
  // when gross pay is supplied, and the direct call above deliberately omits
  // it. This assertion was written against the wrong field first and the test
  // caught it, which is the argument for writing them this way.
  assert.equal(bulk.pay.owed, direct.pay.owed);
  assert.equal(bulk.regularRate, direct.regularRate);
  assert.ok(direct.shortfall === null, "no gross pay means nothing to compare against");
});

t("the seventh consecutive day is caught across the grouped week", () => {
  const rows = parseCsv(csv);
  const s = buildSchedule(rows, mapColumns(Object.keys(rows[0])));
  const r = s.perEmployee[0].weeks[0].result;
  assert.ok(r.classification.timeAndHalf > 0, "seven days should produce premium hours");
});

// --- the failure that matters: silently dropping what it cannot model ------

t("an unmodellable week appears in the CSV with its reason, never omitted", () => {
  const rows = parseCsv(csv);
  const s = buildSchedule(rows, mapColumns(Object.keys(rows[0])));
  // Force a refusal the way a real matter would.
  s.perEmployee[0].weeks[0].result = computeWorkweek({
    baseHourlyRate: 19, days: [{ date: "2026-03-02", hoursWorked: 8 }],
    applicability: { alternativeWorkweek: true },
  });
  const out = toCsv(s);
  assert.ok(out.includes("Alternative workweek"), "the reason must be in the file");
  assert.equal(out.trim().split("\n").length, 2, "the row must still exist");
});

t("every priced row carries an authority", () => {
  const rows = parseCsv(csv);
  const out = toCsv(buildSchedule(rows, mapColumns(Object.keys(rows[0]))));
  const body = out.trim().split("\n").slice(1);
  for (const line of body) assert.ok(/Lab\. Code/.test(line), `no authority on: ${line}`);
});

// --- grouping and scale ----------------------------------------------------

t("days are grouped into the right workweek, not the right month", () => {
  const rows = parseCsv("employee,date,hours,rate\nA,2026-03-08,5,19\nA,2026-03-09,5,19\n");
  const s = buildSchedule(rows, mapColumns(Object.keys(rows[0])));
  assert.equal(s.perEmployee[0].weeks.length, 2, "Sunday and Monday are different workweeks");
});

t("two employees stay two employees", () => {
  const rows = parseCsv("employee,date,hours,rate\nA,2026-03-02,8,19\nB,2026-03-02,8,19\n");
  const s = buildSchedule(rows, mapColumns(Object.keys(rows[0])));
  assert.equal(s.employees, 2);
});

t("unparseable dates are reported rather than dropped in silence", () => {
  const rows = parseCsv("employee,date,hours,rate\nA,not-a-date,8,19\n");
  const s = buildSchedule(rows, mapColumns(Object.keys(rows[0])));
  assert.ok(s.badDates.length > 0, "bad dates must surface");
});

t("employees are ranked by exposure, largest first", () => {
  const rows = parseCsv(
    "employee,date,hours,rate,gross\nA,2026-03-02,8,19,152\nB,2026-03-02,13,19,247\n");
  const s = buildSchedule(rows, mapColumns(Object.keys(rows[0])));
  const [first, second] = s.perEmployee.map((e) => e.totals.totalShortfall || 0);
  assert.ok(first >= second, "the largest claim should sort first");
});

console.log(`\n${pass} passed, ${fail} failed\n`);
process.exit(fail ? 1 : 0);
