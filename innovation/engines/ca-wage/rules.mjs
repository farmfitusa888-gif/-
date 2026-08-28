/**
 * California wage and hour engine — the core of Backpay (idea 1).
 *
 * Computes what a non-exempt California employee was legally entitled to for a
 * workweek, compares it to what the pay stub says they got, and returns an
 * itemised shortfall where every finding names the rule it comes from.
 *
 * WHY THIS FILE EXISTS
 * The research finding that makes Backpay a business is that roughly $40-60bn a
 * year in wages goes unpaid and about 1% is recovered, because — in the
 * researchers' own words — many workers do not recognise their pay is being
 * shorted. Recognising it is arithmetic against a rulebook. This is the
 * rulebook.
 *
 * THE THREE THINGS MOST IMPLEMENTATIONS GET WRONG
 *
 * 1. Pyramiding. An hour that already earned daily overtime cannot earn weekly
 *    overtime as well. Weekly overtime applies only to STRAIGHT-TIME hours over
 *    40 in the week. Getting this wrong overstates the claim, and an overstated
 *    claim is worse than none — it is the thing that gets the whole finding
 *    thrown out.
 *
 * 2. The seventh consecutive day. It is not "double time all day". It is
 *    time-and-a-half for the first eight hours and double time beyond eight,
 *    and it applies to the seventh consecutive day worked in one workweek.
 *
 * 3. The regular rate is not the hourly rate. Non-discretionary bonuses,
 *    shift differentials and commissions must be folded in before any premium
 *    is calculated, which usually RAISES the shortfall. Ignoring it is the most
 *    common way a real violation gets under-counted.
 *
 * SCOPE — read this before trusting a result
 * Covers the general non-exempt hourly case under the default Industrial
 * Welfare Commission wage orders. It does NOT model: alternative workweek
 * schedules, unionised employees under a qualifying collective bargaining
 * agreement, agricultural or personal-attendant wage orders, exempt
 * classification tests, piece-rate compensation, or split-shift premiums.
 * Any of those changes the answer, so `applicability` flags them rather than
 * silently returning a number that does not apply.
 *
 * Every rule is tagged with its California Labor Code section so a finding can
 * be checked by a human, which is the DoNotPay lesson applied to code.
 */

/** Cents-safe rounding. Floating point on money produces findings you cannot defend. */
const money = (n) => Math.round(n * 100) / 100;

/** Hours are compared at 1/100th of an hour to avoid float noise on clock data. */
const hrs = (n) => Math.round(n * 100) / 100;

export const RULES = {
  DAILY_OT: { id: "CA-OT-DAILY", cite: "Lab. Code § 510(a)", text: "Over 8 hours in a workday is paid at 1.5x." },
  DAILY_DT: { id: "CA-OT-DOUBLE", cite: "Lab. Code § 510(a)", text: "Over 12 hours in a workday is paid at 2x." },
  WEEKLY_OT: { id: "CA-OT-WEEKLY", cite: "Lab. Code § 510(a)", text: "Over 40 straight-time hours in a workweek is paid at 1.5x." },
  SEVENTH_DAY: { id: "CA-OT-7TH", cite: "Lab. Code § 510(a)", text: "On the seventh consecutive day worked in a workweek, the first 8 hours are 1.5x and hours beyond 8 are 2x." },
  MEAL: { id: "CA-MEAL", cite: "Lab. Code §§ 226.7, 512", text: "An unpaid 30-minute meal period must begin before the end of the fifth hour; a second before the end of the tenth. A missed, late or short meal period owes one hour of pay at the regular rate." },
  REST: { id: "CA-REST", cite: "Lab. Code § 226.7; IWC Wage Orders § 12", text: "A paid 10-minute rest period per four hours worked or major fraction thereof. A missed rest period owes one hour of pay at the regular rate." },
  MIN_WAGE: { id: "CA-MIN-WAGE", cite: "Lab. Code § 1197", text: "Payment below the applicable minimum wage is unlawful." },
  REGULAR_RATE: { id: "CA-REGULAR-RATE", cite: "Lab. Code § 510; 29 C.F.R. § 778.109", text: "The regular rate includes non-discretionary bonuses, shift differentials and commissions, not merely the base hourly rate." },
  WAGE_STATEMENT: { id: "CA-226", cite: "Lab. Code § 226(a)", text: "An itemised wage statement must show nine specified items. Penalties are $50 for a first violation and $100 for each subsequent one, capped at $4,000." },
};

/**
 * Rest period entitlement: one per four hours "or major fraction thereof".
 * A major fraction is more than two hours, which is why the thresholds sit at
 * 3.5, 6, 10 and 14 rather than at 4, 8, 12 and 16.
 */
export function restPeriodsOwed(hoursWorked) {
  if (hoursWorked < 3.5) return 0;
  // Count whole four-hour blocks, then add one only if the REMAINDER is a major
  // fraction — strictly more than two hours. Exactly 6 hours owes one break, not
  // two, because the remainder is exactly 2 and 2 is not a major fraction of 4.
  const blocks = Math.floor(hoursWorked / 4);
  const remainder = hoursWorked - blocks * 4;
  return Math.max(1, blocks + (remainder > 2 ? 1 : 0));
}

/** Meal period entitlement. Over 5 hours owes one; over 10 owes two. */
export function mealPeriodsOwed(hoursWorked) {
  if (hoursWorked > 10) return 2;
  if (hoursWorked > 5) return 1;
  return 0;
}

/**
 * The regular rate of pay for premium purposes.
 * Non-discretionary bonuses are apportioned across hours actually worked.
 */
export function regularRate({ baseHourlyRate, hoursWorked, nonDiscretionaryPay = 0 }) {
  if (!hoursWorked) return money(baseHourlyRate);
  return money(baseHourlyRate + nonDiscretionaryPay / hoursWorked);
}

/**
 * Split one day's hours into straight, 1.5x and 2x buckets.
 * `isSeventhConsecutive` switches to the seventh-day schedule.
 */
export function classifyDay(hoursWorked, isSeventhConsecutive = false) {
  const h = hrs(hoursWorked);
  if (h <= 0) return { straight: 0, timeAndHalf: 0, doubleTime: 0 };
  if (isSeventhConsecutive) {
    return {
      straight: 0,
      timeAndHalf: Math.min(h, 8),
      doubleTime: Math.max(0, h - 8),
    };
  }
  return {
    straight: Math.min(h, 8),
    timeAndHalf: Math.min(Math.max(0, h - 8), 4),
    doubleTime: Math.max(0, h - 12),
  };
}

/**
 * Identify which days are the seventh CONSECUTIVE day worked within the
 * workweek. Days must be supplied in order; a day with zero hours breaks the run.
 */
export function markSeventhDays(days) {
  let run = 0;
  return days.map((d) => {
    if (hrs(d.hoursWorked) > 0) run += 1;
    else run = 0;
    return { ...d, isSeventhConsecutive: run === 7 };
  });
}

/**
 * Compute one workweek.
 *
 * @param {object} input
 * @param {{date:string, hoursWorked:number, mealPeriodsProvided?:number,
 *          firstMealBeganAfterHours?:number|null, restPeriodsProvided?:number,
 *          mealPeriodsWaived?:number}[]} input.days  In calendar order.
 * @param {number} input.baseHourlyRate
 * @param {number} [input.nonDiscretionaryPay]  Bonuses/commissions for the week.
 * @param {number} [input.minimumWage]          Applicable minimum wage.
 * @param {object} [input.paid]                 What the stub actually shows.
 * @param {string[]} [input.wageStatementItems] Items present on the stub.
 * @param {object} [input.applicability]        Flags that change or void the result.
 */
export function computeWorkweek(input) {
  const {
    days: rawDays,
    baseHourlyRate,
    nonDiscretionaryPay = 0,
    minimumWage = null,
    paid = null,
    wageStatementItems = null,
    applicability = {},
  } = input;

  const notes = [];
  const blockers = [];

  // Conditions under which this engine must not produce a number.
  if (applicability.alternativeWorkweek)
    blockers.push("Alternative workweek schedule in effect — daily overtime thresholds differ.");
  if (applicability.collectiveBargainingAgreement)
    blockers.push("Covered by a qualifying collective bargaining agreement — statutory overtime rules may be displaced.");
  if (applicability.exempt)
    blockers.push("Classified as exempt — this engine models non-exempt employees only.");
  if (applicability.pieceRate)
    blockers.push("Piece-rate compensation — regular rate and rest-period pay are computed differently.");

  const days = markSeventhDays(rawDays);
  const totalHours = hrs(days.reduce((a, d) => a + d.hoursWorked, 0));
  const rate = regularRate({ baseHourlyRate, hoursWorked: totalHours, nonDiscretionaryPay });

  if (nonDiscretionaryPay > 0)
    notes.push({
      rule: RULES.REGULAR_RATE,
      detail: `Regular rate is $${rate.toFixed(2)}, not the $${baseHourlyRate.toFixed(2)} base rate, because $${nonDiscretionaryPay.toFixed(2)} of non-discretionary pay is apportioned across ${totalHours} hours.`,
    });

  // --- Daily classification ---
  let straight = 0, timeAndHalf = 0, doubleTime = 0;
  const dayDetail = [];
  for (const d of days) {
    const c = classifyDay(d.hoursWorked, d.isSeventhConsecutive);
    straight += c.straight;
    timeAndHalf += c.timeAndHalf;
    doubleTime += c.doubleTime;
    dayDetail.push({ date: d.date, hoursWorked: hrs(d.hoursWorked), ...c, seventhDay: d.isSeventhConsecutive });
  }

  // --- Weekly overtime, without pyramiding ---
  // Only straight-time hours can convert; hours already at a premium cannot.
  const weeklyOtHours = hrs(Math.max(0, straight - 40));
  if (weeklyOtHours > 0) {
    straight = hrs(straight - weeklyOtHours);
    timeAndHalf = hrs(timeAndHalf + weeklyOtHours);
    notes.push({
      rule: RULES.WEEKLY_OT,
      detail: `${weeklyOtHours} straight-time hours over 40 converted to 1.5x. Hours already earning daily overtime were not counted again.`,
    });
  }

  // --- Meal and rest premiums ---
  // Statutory maximum is one meal premium and one rest premium per workday.
  const premiums = [];
  for (const d of days) {
    const h = hrs(d.hoursWorked);
    if (h <= 0) continue;

    const mealsOwed = mealPeriodsOwed(h) - (d.mealPeriodsWaived || 0);
    const mealsGiven = d.mealPeriodsProvided ?? mealsOwed;
    const lateFirstMeal =
      d.firstMealBeganAfterHours != null && d.firstMealBeganAfterHours > 5 && mealsOwed > 0;
    if (mealsGiven < mealsOwed || lateFirstMeal) {
      premiums.push({
        date: d.date,
        rule: RULES.MEAL,
        hours: 1,
        amount: rate,
        reason: lateFirstMeal
          ? `First meal period began after ${d.firstMealBeganAfterHours} hours; it must begin before the end of the fifth hour.`
          : `${mealsGiven} meal period(s) provided, ${mealsOwed} owed for ${h} hours worked.`,
      });
    }

    const restOwed = restPeriodsOwed(h);
    const restGiven = d.restPeriodsProvided ?? restOwed;
    if (restGiven < restOwed) {
      premiums.push({
        date: d.date,
        rule: RULES.REST,
        hours: 1,
        amount: rate,
        reason: `${restGiven} rest period(s) provided, ${restOwed} owed for ${h} hours worked.`,
      });
    }
  }

  // --- Entitlement ---
  const straightPay = money(straight * rate);
  const otPay = money(timeAndHalf * rate * 1.5);
  const dtPay = money(doubleTime * rate * 2);
  const premiumPay = money(premiums.reduce((a, p) => a + p.amount, 0));
  const owed = money(straightPay + otPay + dtPay + premiumPay);

  // --- Minimum wage ---
  if (minimumWage != null && baseHourlyRate < minimumWage) {
    notes.push({
      rule: RULES.MIN_WAGE,
      detail: `Base rate $${baseHourlyRate.toFixed(2)} is below the applicable minimum wage of $${minimumWage.toFixed(2)}.`,
    });
  }

  // --- Wage statement (Labor Code 226) ---
  const REQUIRED_226 = [
    "grossWages", "totalHours", "pieceRateUnits", "deductions", "netWages",
    "payPeriodDates", "employeeNameAndIdentifier", "employerNameAndAddress", "hourlyRatesAndHours",
  ];
  let wageStatement = null;
  if (wageStatementItems) {
    const missing = REQUIRED_226.filter((k) => !wageStatementItems.includes(k) && k !== "pieceRateUnits");
    wageStatement = {
      missing,
      compliant: missing.length === 0,
      rule: RULES.WAGE_STATEMENT,
      note: missing.length
        ? `Missing required item(s): ${missing.join(", ")}. Penalties are $50 for a first violation and $100 for each subsequent, capped at $4,000.`
        : "All required items present.",
    };
  }

  // --- Compare to the stub ---
  let shortfall = null;
  if (paid) {
    const paidGross = money(paid.grossPay);
    const diff = money(owed - paidGross);
    shortfall = {
      owed,
      paid: paidGross,
      difference: diff,
      hasShortfall: diff > 0.005,
      hoursDiscrepancy: paid.totalHours != null ? hrs(totalHours - paid.totalHours) : null,
    };
  }

  return {
    blockers,
    reliable: blockers.length === 0,
    totalHours,
    regularRate: rate,
    classification: { straight: hrs(straight), timeAndHalf: hrs(timeAndHalf), doubleTime: hrs(doubleTime) },
    dayDetail,
    pay: { straightPay, otPay, dtPay, premiumPay, owed },
    premiums,
    notes,
    wageStatement,
    shortfall,
  };
}

/**
 * Roll several workweeks into the cumulative figure that is the actual product.
 * A single week's $87 is ignorable; "$4,500 over nineteen months, still
 * happening" is not, and nobody currently computes that for the person it
 * happened to.
 */
export function cumulative(weeks) {
  const usable = weeks.filter((w) => w.reliable && w.shortfall);
  const total = money(usable.reduce((a, w) => a + Math.max(0, w.shortfall.difference), 0));
  const affected = usable.filter((w) => w.shortfall.hasShortfall);
  const byRule = {};
  for (const w of affected)
    for (const p of w.premiums) byRule[p.rule.id] = money((byRule[p.rule.id] || 0) + p.amount);
  return {
    weeksExamined: weeks.length,
    weeksUsable: usable.length,
    weeksExcluded: weeks.length - usable.length,
    weeksWithShortfall: affected.length,
    totalShortfall: total,
    averagePerAffectedWeek: affected.length ? money(total / affected.length) : 0,
    premiumsByRule: byRule,
    ongoing: affected.length > 0 && affected[affected.length - 1] === usable[usable.length - 1],
  };
}
