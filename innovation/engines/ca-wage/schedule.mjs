// schedule.mjs — payroll export in, cited damages schedule out.
//
// This is the firm-facing loop, and it is the same engine the free calculator
// runs. One worker or two hundred, one week or four years, the arithmetic per
// workweek is identical; what changes is the loop around it and what comes out
// the other end.
//
// The output is shaped for the thing it has to survive. A damages schedule gets
// attacked line by line, so every row carries the statute that produced it and
// every excluded week says why it was excluded rather than quietly vanishing.
// A schedule that drops the weeks it could not model is worse than one that
// shows them, because the gap is what opposing counsel finds.
//
// Deliberately not a spreadsheet writer. It emits CSV and JSON, and the CSV
// opens in Excel. Generating .xlsx would add a dependency to produce a file
// that is harder to diff and no easier to read.

import { computeWorkweek, cumulative } from "./rules.mjs";

/** Minimal CSV reader. Handles quoted fields and embedded commas, which real
 *  payroll exports contain constantly in employee-name columns. */
export function parseCsv(text) {
  const rows = [];
  let row = [], field = "", quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"' && text[i + 1] === '"') { field += '"'; i++; }
      else if (c === '"') quoted = false;
      else field += c;
    } else if (c === '"') quoted = true;
    else if (c === ",") { row.push(field); field = ""; }
    else if (c === "\n") { row.push(field); rows.push(row); row = []; field = ""; }
    else if (c !== "\r") field += c;
  }
  if (field !== "" || row.length) { row.push(field); rows.push(row); }
  if (!rows.length) return [];
  const head = rows[0].map((h) => h.trim());
  return rows.slice(1).filter((r) => r.some((c) => c.trim() !== ""))
    .map((r) => Object.fromEntries(head.map((h, i) => [h, (r[i] ?? "").trim()])));
}

/** Column names differ between payroll systems. Rather than demanding one
 *  format, accept the common spellings and report what was matched, so a
 *  mis-mapped column shows up as a named problem instead of a wrong number. */
const ALIASES = {
  employee: ["employee", "employee_id", "employee id", "worker", "name", "employee name"],
  date: ["date", "work_date", "work date", "day", "shift_date"],
  hours: ["hours", "hours_worked", "hours worked", "total_hours", "qty"],
  rate: ["rate", "hourly_rate", "hourly rate", "base_rate", "pay_rate"],
  bonus: ["bonus", "nondiscretionary", "non_discretionary", "incentive", "commission"],
  gross: ["gross", "gross_pay", "gross pay", "paid", "total_pay"],
  meal: ["meal", "meal_taken", "meal periods", "meal_periods_taken"],
  rest: ["rest", "rest_taken", "rest periods", "rest_periods_taken"],
};

export function mapColumns(headers) {
  const lower = headers.map((h) => h.toLowerCase().trim());
  const found = {};
  for (const [key, names] of Object.entries(ALIASES)) {
    const i = lower.findIndex((h) => names.includes(h));
    if (i >= 0) found[key] = headers[i];
  }
  const missing = ["employee", "date", "hours", "rate"].filter((k) => !found[k]);
  return { found, missing };
}

const isoWeek = (d) => {
  // Workweeks are employer-defined and often do not start on Monday. Until the
  // matter tells us otherwise this groups Monday to Sunday and says so, rather
  // than picking a convention silently.
  const t = new Date(d + "T00:00:00Z");
  if (Number.isNaN(+t)) return null;
  const day = (t.getUTCDay() + 6) % 7;
  t.setUTCDate(t.getUTCDate() - day);
  return t.toISOString().slice(0, 10);
};

export function buildSchedule(rows, cols) {
  const c = cols.found;
  const byEmp = new Map();
  const badDates = [];

  for (const r of rows) {
    const wk = isoWeek(r[c.date]);
    if (!wk) { badDates.push(r[c.date]); continue; }
    const emp = r[c.employee] || "(unnamed)";
    if (!byEmp.has(emp)) byEmp.set(emp, new Map());
    const weeks = byEmp.get(emp);
    if (!weeks.has(wk)) weeks.set(wk, []);
    weeks.get(wk).push(r);
  }

  const perEmployee = [];
  for (const [emp, weeks] of byEmp) {
    const computed = [];
    for (const [wk, dayRows] of [...weeks].sort((a, b) => a[0] < b[0] ? -1 : 1)) {
      const rate = Number(dayRows[0][c.rate]) || 0;
      const bonus = c.bonus ? dayRows.reduce((a, d) => a + (Number(d[c.bonus]) || 0), 0) : 0;
      const gross = c.gross ? dayRows.reduce((a, d) => a + (Number(d[c.gross]) || 0), 0) : null;
      const days = dayRows.map((d) => ({
        date: d[c.date],
        hoursWorked: Number(d[c.hours]) || 0,
        mealPeriodsTaken: c.meal ? Number(d[c.meal]) || 0 : 1,
        restPeriodsTaken: c.rest ? Number(d[c.rest]) || 0 : 2,
      })).filter((d) => d.hoursWorked > 0);
      if (!days.length) continue;
      const totalHours = days.reduce((a, d) => a + d.hoursWorked, 0);
      const res = computeWorkweek({
        baseHourlyRate: rate, nonDiscretionaryPay: bonus, days,
        paid: gross == null ? null : { grossPay: gross, totalHours },
      });
      computed.push({ week: wk, result: res });
    }
    perEmployee.push({
      employee: emp,
      weeks: computed,
      totals: cumulative(computed.map((x) => x.result)),
    });
  }

  perEmployee.sort((a, b) => (b.totals.totalShortfall || 0) - (a.totals.totalShortfall || 0));

  const classTotal = perEmployee.reduce((a, e) => a + (e.totals.totalShortfall || 0), 0);
  const excluded = perEmployee.reduce((a, e) => a + e.totals.weeksExcluded, 0);
  return {
    employees: perEmployee.length,
    weeks: perEmployee.reduce((a, e) => a + e.totals.weeksExamined, 0),
    weeksExcluded: excluded,
    classShortfall: Math.round(classTotal * 100) / 100,
    badDates: [...new Set(badDates)].slice(0, 10),
    perEmployee,
  };
}

/** One row per workweek, with the statute on every line that carries a figure. */
export function toCsv(schedule) {
  const out = [[
    "employee", "week_beginning", "hours", "regular_rate", "straight_hours",
    "ot_hours", "dt_hours", "owed", "paid", "shortfall", "authority", "excluded_because",
  ]];
  for (const e of schedule.perEmployee) {
    for (const { week, result: r } of e.weeks) {
      if (!r.reliable) {
        out.push([e.employee, week, "", "", "", "", "", "", "", "", "", r.blockers.join("; ")]);
        continue;
      }
      const cites = [...new Set((r.notes || []).map((n) => n.rule.cite))].join(" | ");
      out.push([
        e.employee, week, r.totalHours, r.regularRate,
        r.classification.straight, r.classification.timeAndHalf, r.classification.doubleTime,
        r.shortfall.owed, r.shortfall.paid ?? "", r.shortfall.difference ?? "",
        cites || "Lab. Code § 510(a)", "",
      ]);
    }
  }
  return out.map((r) => r.map((v) => {
    const s = String(v ?? "");
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  }).join(",")).join("\n") + "\n";
}
