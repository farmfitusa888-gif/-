// check.js — the worker-facing calculator.
//
// It imports the same rules.mjs the tests run against and the law firms' models
// are built on. One engine, not a simplified copy for consumers, because a
// simplified copy is how two versions of the truth get shipped.
//
// Everything below runs in the browser. No request is made, no value leaves the
// page, and there is no account. That is not a promise about our conduct, it is
// a property of where the code executes, and a worker deciding whether to type
// their pay into a website deserves the second kind of assurance.

import { computeWorkweek, cumulative } from "./rules.mjs";

const $ = (sel, root = document) => root.querySelector(sel);
const money = (n) => "$" + Number(n).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

function weekFieldset(n) {
  return `<fieldset class="fs-days" data-week="${n}">
    <legend>Week ${n + 1}</legend>
    <p class="hint">Hours to the nearest quarter. Leave a day blank if you did not work it.</p>
    <table class="days">
      <thead><tr><th>Day</th><th>Hours</th><th>Meal break</th><th>Rest breaks</th></tr></thead>
      <tbody>${DAYS.map((d, i) => `<tr>
        <th scope="row">${d}</th>
        <td><input name="w${n}h${i}" type="number" step="0.25" min="0" max="24" inputmode="decimal" placeholder="0"></td>
        <td><select name="w${n}m${i}"><option value="1">Took it</option><option value="0">Missed or short</option></select></td>
        <td><select name="w${n}r${i}"><option value="2">Took them</option><option value="1">Took one</option><option value="0">Missed them</option></select></td>
      </tr>`).join("")}</tbody>
    </table>
    <label class="wk-pay">Gross pay for this week
      <span class="hint">Before deductions. Leave blank to see only what was owed.</span>
      <input name="w${n}paid" type="number" step="0.01" min="0" inputmode="decimal" placeholder="optional">
    </label>
  </fieldset>`;
}

function buildForm(root) {
  root.innerHTML = `
    <form id="wk" novalidate>
      <fieldset class="fs-pay">
        <legend>What you are paid</legend>
        <div class="fields">
          <label>Hourly rate
            <span class="hint">The rate printed on your stub.</span>
            <input name="rate" type="number" step="0.01" min="0" inputmode="decimal" placeholder="19.00" required>
          </label>
          <label>Bonus or commission per week
            <span class="hint">A production, attendance or piece bonus. Leave blank if none. This changes the answer more than anything else on the page.</span>
            <input name="bonus" type="number" step="0.01" min="0" inputmode="decimal" placeholder="0.00">
          </label>
        </div>
      </fieldset>

      <div id="weeks">${weekFieldset(0)}${weekFieldset(1)}</div>
      <div class="wk-actions">
        <button type="button" class="btn ghost" id="addwk">Add another week</button>
        <button type="button" class="btn ghost" id="delwk">Remove the last week</button>
      </div>

      <fieldset class="fs-fit">
        <legend>Does any of this apply to you?</legend>
        <p class="hint">If so, the answer would be wrong, so this tool will decline to give one.</p>
        <div class="checks">
          <label class="chk"><input type="checkbox" name="alt"> My schedule was voted in by employees, like four ten-hour days</label>
          <label class="chk"><input type="checkbox" name="cba"> I am covered by a union contract</label>
          <label class="chk"><input type="checkbox" name="exempt"> I am salaried and classified as exempt from overtime</label>
          <label class="chk"><input type="checkbox" name="piece"> I am paid by the piece or by the job, not by the hour</label>
        </div>
      </fieldset>

      <div class="cta-row"><button class="btn" type="submit">Work it out</button></div>
      <p class="note">Nothing is sent anywhere. Close the tab and it is gone.</p>
    </form>
    <div id="out" aria-live="polite"></div>`;

  const weeks = $("#weeks", root);
  $("#addwk", root).addEventListener("click", () => {
    weeks.insertAdjacentHTML("beforeend", weekFieldset(weeks.children.length));
  });
  $("#delwk", root).addEventListener("click", () => {
    if (weeks.children.length > 1) weeks.lastElementChild.remove();
  });
}

function readForm(form) {
  const num = (name, dflt = 0) => {
    const el = form.elements[name];
    if (!el) return dflt;
    const v = el.value.trim();
    return v === "" ? dflt : Number(v);
  };
  const applicability = {
    alternativeWorkweek: form.elements.alt.checked,
    collectiveBargainingAgreement: form.elements.cba.checked,
    exempt: form.elements.exempt.checked,
    pieceRate: form.elements.piece.checked,
  };
  const rate = num("rate", 0);
  const bonus = num("bonus", 0);

  const weeks = [];
  const count = document.querySelectorAll("#weeks fieldset").length;
  for (let n = 0; n < count; n++) {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const h = num(`w${n}h${i}`, 0);
      if (h > 0) days.push({
        date: `Week ${n + 1} ${DAYS[i]}`,
        hoursWorked: h,
        mealPeriodsTaken: Number(form.elements[`w${n}m${i}`].value),
        restPeriodsTaken: Number(form.elements[`w${n}r${i}`].value),
      });
    }
    if (!days.length) continue;
    const paidRaw = form.elements[`w${n}paid`].value.trim();
    const totalHours = days.reduce((a, d) => a + d.hoursWorked, 0);
    weeks.push({
      label: `Week ${n + 1}`,
      baseHourlyRate: rate, nonDiscretionaryPay: bonus, days, applicability,
      paid: paidRaw === "" ? null : { grossPay: Number(paidRaw), totalHours },
    });
  }
  return { rate, bonus, weeks };
}

function weekBlock(input, r, label) {
  if (r.blockers && r.blockers.length) {
    return `<div class="wk-result refused"><h3>${label}</h3>
      <ul>${r.blockers.map((b) => `<li>${b}</li>`).join("")}</ul></div>`;
  }
  const c = r.classification;
  const rows = [];
  if (input.nonDiscretionaryPay > 0) rows.push({
    label: "Your real overtime rate, once the bonus is counted",
    value: money(r.regularRate), rule: "Lab. Code &sect; 510; 29 C.F.R. &sect; 778.109" });
  if (c.straight) rows.push({ label: `Straight time, ${c.straight} hours`, value: money(r.pay.straightPay) });
  if (c.timeAndHalf) rows.push({ label: `Overtime at 1.5&times;, ${c.timeAndHalf} hours`, value: money(r.pay.otPay), rule: "Lab. Code &sect; 510(a)" });
  if (c.doubleTime) rows.push({ label: `Double time at 2&times;, ${c.doubleTime} hours`, value: money(r.pay.dtPay), rule: "Lab. Code &sect; 510(a)" });
  if (r.pay.premiumPay) rows.push({ label: "Missed break premiums", value: money(r.pay.premiumPay), rule: "Lab. Code &sect;&sect; 226.7, 512" });

  const sf = r.shortfall;
  return `<div class="wk-result"><h3>${label}</h3>
    <div class="ledger">
      <div class="lg-head"><span>${r.totalHours} hours</span><span>Rate on the stub ${money(input.baseHourlyRate)}</span></div>
      ${rows.map((x) => `<div class="lg-row cited">
        <div class="lg-label">${x.label}${x.rule ? `<span class="lg-cite">${x.rule}</span>` : ""}</div>
        <div class="lg-val">${x.value}</div></div>`).join("")}
      <div class="lg-row strong"><div class="lg-label">Owed</div><div class="lg-val">${money(r.pay.owed)}</div></div>
      ${sf && sf.paid != null ? `<div class="lg-row"><div class="lg-label">Paid</div><div class="lg-val">${money(sf.paid)}</div></div>
      <div class="lg-total"><div class="lg-label">Difference</div><div class="lg-val">${money(sf.difference)}</div></div>` : ""}
    </div></div>`;
}

function render(out, form) {
  const results = form.weeks.map((w) => ({ input: w, r: computeWorkweek(w) }));
  const totals = cumulative(results.map((x) => x.r));
  const refused = results.filter((x) => x.r.blockers && x.r.blockers.length);

  let head = "";
  if (refused.length === results.length) {
    head = `<div class="result refused">
      <h2>This tool will not answer for your situation</h2>
      <p>Not because your pay is fine. Because the rules that would apply to you are
      different from the ones this tool knows, and a confident wrong number is worse
      than none. It still needs working out, by someone who can read the schedule or
      the agreement.</p></div>`;
  } else if (totals.totalShortfall > 0.005) {
    const weeksShort = totals.weeksWithShortfall;
    const perWeek = totals.averagePerAffectedWeek;
    head = `<div class="result">
      <h2>Across ${totals.weeksUsable} week${totals.weeksUsable === 1 ? "" : "s"}, short by
        <strong class="big">${money(totals.totalShortfall)}</strong></h2>
      <p class="v-short">${weeksShort} of those weeks came up short, averaging
        <strong>${money(perWeek)}</strong> each. At that rate a full year of similar
        weeks is about <strong>${money(perWeek * 52)}</strong>, and California wage
        claims commonly reach back several years.</p>
      ${totals.weeksExcluded ? `<p class="v-none">${totals.weeksExcluded} week${totals.weeksExcluded === 1 ? " was" : "s were"} left out because the rules there are different. Those are shown below rather than hidden.</p>` : ""}
    </div>`;
  } else if (results.some((x) => x.r.shortfall && x.r.shortfall.paid != null)) {
    head = `<div class="result"><h2>The arithmetic comes out right</h2>
      <p class="v-ok">For the weeks you entered, what you were paid matches what
      California required. That is worth knowing, and it does not mean every week was.</p></div>`;
  } else {
    head = `<div class="result"><h2>What the law required</h2>
      <p class="v-none">You did not enter what you were paid, so there is nothing to
      compare against. The weeks below show what was owed.</p></div>`;
  }

  const notes = new Map();
  for (const { r } of results) for (const n of r.notes || []) notes.set(n.rule.cite, n.detail);

  out.innerHTML = head +
    `<div class="weeks-out">${results.map((x, i) => weekBlock(x.input, x.r, x.input.label)).join("")}</div>` +
    (notes.size ? `<div class="whys"><h3>Why the figures came out that way</h3>
      ${[...notes].map(([cite, detail]) => `<p class="why"><span class="cite">${cite}</span> ${detail}</p>`).join("")}
    </div>` : "") +
    `<p class="after">This is arithmetic, not advice. It cannot tell you whether to do
     anything, and it has not seen your contract, your schedule agreement or anything
     your employer would say. What it can do is give you a number you did not have.</p>`;
  out.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function mount(root) {
  buildForm(root);
  const form = $("#wk", root);
  const out = $("#out", root);
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = readForm(form);
    if (!(data.rate > 0)) {
      out.innerHTML = `<div class="result refused"><p>An hourly rate is needed before anything can be worked out.</p></div>`;
      return;
    }
    if (!data.weeks.length) {
      out.innerHTML = `<div class="result refused"><p>Enter the hours for at least one day.</p></div>`;
      return;
    }
    render(out, data);
  });
}

const el = document.getElementById("calculator");
if (el) mount(el);
