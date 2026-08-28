/**
 * Tests for the California wage engine.
 *
 * These are written as an adversary, not as a demonstration. The engine's whole
 * value is that a finding survives review by an employment lawyer, so the cases
 * that matter most are the ones where a naive implementation OVERSTATES the
 * claim — pyramiding, the seventh-day rule, premium caps. An overstated finding
 * is worse than no finding.
 *
 * Run: node --test innovation/engines/ca-wage/
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import {
  classifyDay, restPeriodsOwed, mealPeriodsOwed, regularRate,
  markSeventhDays, computeWorkweek, cumulative,
} from "./rules.mjs";

const day = (date, hoursWorked, extra = {}) => ({ date, hoursWorked, ...extra });
/** A compliant day: breaks provided as owed. */
const ok = (date, h) => day(date, h, {
  mealPeriodsProvided: h > 10 ? 2 : h > 5 ? 1 : 0,
  restPeriodsProvided: restPeriodsOwed(h),
  firstMealBeganAfterHours: h > 5 ? 4.5 : null,
});

/* ---------------- daily classification ---------------- */

test("8 hours is all straight time", () => {
  assert.deepEqual(classifyDay(8), { straight: 8, timeAndHalf: 0, doubleTime: 0 });
});

test("10 hours is 8 straight plus 2 at time-and-a-half", () => {
  assert.deepEqual(classifyDay(10), { straight: 8, timeAndHalf: 2, doubleTime: 0 });
});

test("14 hours splits 8 straight, 4 at 1.5x, 2 at 2x", () => {
  assert.deepEqual(classifyDay(14), { straight: 8, timeAndHalf: 4, doubleTime: 2 });
});

test("exactly 12 hours produces no double time", () => {
  assert.deepEqual(classifyDay(12), { straight: 8, timeAndHalf: 4, doubleTime: 0 });
});

test("seventh consecutive day is 1.5x for 8 then 2x — NOT double time all day", () => {
  assert.deepEqual(classifyDay(10, true), { straight: 0, timeAndHalf: 8, doubleTime: 2 });
  assert.deepEqual(classifyDay(6, true), { straight: 0, timeAndHalf: 6, doubleTime: 0 });
});

/* ---------------- break entitlement ---------------- */

test("rest periods follow the major-fraction thresholds", () => {
  assert.equal(restPeriodsOwed(3.4), 0);
  assert.equal(restPeriodsOwed(3.5), 1);
  assert.equal(restPeriodsOwed(6), 1);
  assert.equal(restPeriodsOwed(6.1), 2);
  assert.equal(restPeriodsOwed(10), 2);
  assert.equal(restPeriodsOwed(10.1), 3);
  assert.equal(restPeriodsOwed(14.1), 4);
});

test("meal periods: one over five hours, two over ten", () => {
  assert.equal(mealPeriodsOwed(5), 0);
  assert.equal(mealPeriodsOwed(5.1), 1);
  assert.equal(mealPeriodsOwed(10), 1);
  assert.equal(mealPeriodsOwed(10.1), 2);
});

/* ---------------- regular rate ---------------- */

test("a non-discretionary bonus raises the regular rate", () => {
  assert.equal(regularRate({ baseHourlyRate: 20, hoursWorked: 40, nonDiscretionaryPay: 200 }), 25);
});

test("no bonus leaves the base rate unchanged", () => {
  assert.equal(regularRate({ baseHourlyRate: 18.5, hoursWorked: 40 }), 18.5);
});

/* ---------------- seventh-day detection ---------------- */

test("a zero-hour day breaks the consecutive run", () => {
  const d = markSeventhDays([
    day("1", 8), day("2", 8), day("3", 0), day("4", 8), day("5", 8),
    day("6", 8), day("7", 8),
  ]);
  assert.equal(d.filter((x) => x.isSeventhConsecutive).length, 0);
});

test("seven straight worked days marks only the seventh", () => {
  const d = markSeventhDays(Array.from({ length: 7 }, (_, i) => day(String(i + 1), 8)));
  assert.deepEqual(d.map((x) => x.isSeventhConsecutive), [false, false, false, false, false, false, true]);
});

/* ---------------- no pyramiding: the case that matters most ---------------- */

test("hours already at daily overtime do not earn weekly overtime again", () => {
  // Five 10-hour days = 50 hours. Daily: 40 straight + 10 at 1.5x.
  // Straight is exactly 40, so NO weekly overtime may be added.
  const r = computeWorkweek({
    days: [ok("mon", 10), ok("tue", 10), ok("wed", 10), ok("thu", 10), ok("fri", 10)],
    baseHourlyRate: 20,
  });
  assert.equal(r.totalHours, 50);
  assert.equal(r.classification.straight, 40);
  assert.equal(r.classification.timeAndHalf, 10, "must not double-count the daily OT hours");
  assert.equal(r.classification.doubleTime, 0);
  assert.equal(r.pay.owed, 20 * 40 + 20 * 1.5 * 10); // 800 + 300 = 1100
});

test("weekly overtime applies when straight-time hours exceed 40", () => {
  // Six 7-hour days = 42 hours, none over 8, so no daily OT.
  // 2 straight-time hours over 40 convert to 1.5x.
  const r = computeWorkweek({
    days: ["mon", "tue", "wed", "thu", "fri", "sat"].map((d) => ok(d, 7)),
    baseHourlyRate: 20,
  });
  assert.equal(r.totalHours, 42);
  assert.equal(r.classification.straight, 40);
  assert.equal(r.classification.timeAndHalf, 2);
  assert.equal(r.pay.owed, 20 * 40 + 20 * 1.5 * 2); // 800 + 60 = 860
});

/* ---------------- premiums ---------------- */

test("a missed meal period owes exactly one hour at the regular rate", () => {
  const r = computeWorkweek({
    days: [day("mon", 8, { mealPeriodsProvided: 0, restPeriodsProvided: 2 })],
    baseHourlyRate: 20,
  });
  assert.equal(r.premiums.length, 1);
  assert.equal(r.pay.premiumPay, 20);
});

test("a late first meal period is a violation even when one was provided", () => {
  const r = computeWorkweek({
    days: [day("mon", 8, { mealPeriodsProvided: 1, restPeriodsProvided: 2, firstMealBeganAfterHours: 5.5 })],
    baseHourlyRate: 20,
  });
  assert.equal(r.premiums.length, 1);
  assert.match(r.premiums[0].reason, /began after 5\.5 hours/);
});

test("meal and rest premiums are capped at one each per day", () => {
  const r = computeWorkweek({
    days: [day("mon", 12, { mealPeriodsProvided: 0, restPeriodsProvided: 0 })],
    baseHourlyRate: 20,
  });
  assert.equal(r.premiums.length, 2, "one meal premium and one rest premium, not one per missed break");
  assert.equal(r.pay.premiumPay, 40);
});

test("a validly waived meal period is not a violation", () => {
  const r = computeWorkweek({
    days: [day("mon", 6, { mealPeriodsProvided: 0, mealPeriodsWaived: 1, restPeriodsProvided: 1 })],
    baseHourlyRate: 20,
  });
  assert.equal(r.premiums.length, 0);
});

test("premiums use the bonus-inflated regular rate, not the base rate", () => {
  const r = computeWorkweek({
    days: [day("mon", 8, { mealPeriodsProvided: 0, restPeriodsProvided: 2 })],
    baseHourlyRate: 20,
    nonDiscretionaryPay: 80, // over 8 hours -> +$10/hr
  });
  assert.equal(r.regularRate, 30);
  assert.equal(r.pay.premiumPay, 30);
});

/* ---------------- the whole-week case ---------------- */

test("a realistic underpaid week produces a defensible shortfall", () => {
  // Six 10-hour days, seventh day 6 hours, no meal breaks all week.
  const days = ["mon", "tue", "wed", "thu", "fri", "sat"].map((d) =>
    day(d, 10, { mealPeriodsProvided: 0, restPeriodsProvided: 3 })
  );
  days.push(day("sun", 6, { mealPeriodsProvided: 1, restPeriodsProvided: 2, firstMealBeganAfterHours: 4 }));

  const r = computeWorkweek({ days, baseHourlyRate: 20, paid: { grossPay: 1320, totalHours: 66 } });

  assert.equal(r.totalHours, 66);
  // Days 1-6: 8 straight + 2 OT each = 48 straight, 12 OT.
  // Day 7 is the seventh consecutive day: 6 hours all at 1.5x.
  // Weekly: 48 straight - 40 = 8 hours convert to 1.5x -> 40 straight, 26 at 1.5x.
  assert.equal(r.classification.straight, 40);
  assert.equal(r.classification.timeAndHalf, 26);
  assert.equal(r.classification.doubleTime, 0);
  // 6 missed meal premiums at $20.
  assert.equal(r.pay.premiumPay, 120);
  assert.equal(r.pay.owed, 20 * 40 + 20 * 1.5 * 26 + 120); // 800 + 780 + 120 = 1700
  assert.equal(r.shortfall.difference, 380);
  assert.equal(r.shortfall.hasShortfall, true);
});

test("a compliant week produces no shortfall", () => {
  const r = computeWorkweek({
    days: ["mon", "tue", "wed", "thu", "fri"].map((d) => ok(d, 8)),
    baseHourlyRate: 20,
    paid: { grossPay: 800, totalHours: 40 },
  });
  assert.equal(r.pay.owed, 800);
  assert.equal(r.shortfall.hasShortfall, false);
});

/* ---------------- refusing to answer ---------------- */

test("an alternative workweek blocks the result rather than guessing", () => {
  const r = computeWorkweek({
    days: [ok("mon", 10), ok("tue", 10), ok("wed", 10), ok("thu", 10)],
    baseHourlyRate: 20,
    applicability: { alternativeWorkweek: true },
  });
  assert.equal(r.reliable, false);
  assert.match(r.blockers[0], /Alternative workweek/);
});

test("exempt classification blocks the result", () => {
  const r = computeWorkweek({ days: [ok("mon", 12)], baseHourlyRate: 60, applicability: { exempt: true } });
  assert.equal(r.reliable, false);
});

/* ---------------- wage statement ---------------- */

test("missing Labor Code 226 items are reported", () => {
  const r = computeWorkweek({
    days: [ok("mon", 8)],
    baseHourlyRate: 20,
    wageStatementItems: ["grossWages", "netWages", "payPeriodDates", "employerNameAndAddress"],
  });
  assert.equal(r.wageStatement.compliant, false);
  assert.ok(r.wageStatement.missing.includes("totalHours"));
  assert.ok(r.wageStatement.missing.includes("hourlyRatesAndHours"));
});

/* ---------------- the cumulative number, which is the product ---------------- */

test("cumulative excludes unreliable weeks and totals only the shortfalls", () => {
  const bad = () => computeWorkweek({
    days: ["mon", "tue", "wed", "thu", "fri"].map((d) => day(d, 9, { mealPeriodsProvided: 0, restPeriodsProvided: 3 })),
    baseHourlyRate: 20,
    paid: { grossPay: 900, totalHours: 45 },
  });
  const good = () => computeWorkweek({
    days: ["mon", "tue", "wed", "thu", "fri"].map((d) => ok(d, 8)),
    baseHourlyRate: 20,
    paid: { grossPay: 800, totalHours: 40 },
  });
  const blocked = computeWorkweek({
    days: [ok("mon", 9)], baseHourlyRate: 20, paid: { grossPay: 100, totalHours: 9 },
    applicability: { pieceRate: true },
  });

  const c = cumulative([bad(), good(), bad(), blocked]);
  assert.equal(c.weeksExamined, 4);
  assert.equal(c.weeksUsable, 3);
  assert.equal(c.weeksExcluded, 1);
  assert.equal(c.weeksWithShortfall, 2);
  // Each bad week: 40 straight + 5 at 1.5x + 5 meal premiums
  //   = 800 + 150 + 100 = 1050, paid 900 -> 150 short.
  assert.equal(c.totalShortfall, 300);
  assert.equal(c.averagePerAffectedWeek, 150);
});
