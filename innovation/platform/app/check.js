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

import { computeWorkweek } from "./rules.mjs";

const $ = (sel, root = document) => root.querySelector(sel);
const money = (n) => "$" + Number(n).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

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
          <label>Bonus or commission this week
            <span class="hint">A production, attendance or piece bonus. Leave blank if none. This changes the answer more than anything else on the page.</span>
            <input name="bonus" type="number" step="0.01" min="0" inputmode="decimal" placeholder="0.00">
          </label>
          <label>Gross pay you received
            <span class="hint">Before deductions. Leave blank if you only want to see what was owed.</span>
            <input name="paid" type="number" step="0.01" min="0" inputmode="decimal" placeholder="optional">
          </label>
        </div>
      </fieldset>

      <fieldset class="fs-days">
        <legend>The week you worked</legend>
        <p class="hint">Hours to the nearest quarter. Leave a day blank if you did not work it.</p>
        <table class="days">
          <thead><tr><th>Day</th><th>Hours</th><th>Meal break</th><th>Rest breaks</th></tr></thead>
          <tbody>${DAYS.map((d, i) => `<tr>
            <th scope="row">${d}</th>
            <td><input name="h${i}" type="number" step="0.25" min="0" max="24" inputmode="decimal" placeholder="0"></td>
            <td><select name="m${i}"><option value="1">Took it</option><option value="0">Missed or short</option></select></td>
            <td><select name="r${i}"><option value="2">Took them</option><option value="1">Took one</option><option value="0">Missed them</option></select></td>
          </tr>`).join("")}</tbody>
        </table>
      </fieldset>

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
}

function readForm(form) {
  const num = (name, dflt = 0) => {
    const v = form.elements[name].value.trim();
    return v === "" ? dflt : Number(v);
  };
  const days = [];
  for (let i = 0; i < 7; i++) {
    const h = num("h" + i, 0);
    if (h > 0) {
      days.push({
        date: DAYS[i],
        hoursWorked: h,
        mealPeriodsTaken: Number(form.elements["m" + i].value),
        restPeriodsTaken: Number(form.elements["r" + i].value),
      });
    }
  }
  const paidRaw = form.elements.paid.value.trim();
  const totalHours = days.reduce((a, d) => a + d.hoursWorked, 0);
  return {
    baseHourlyRate: num("rate", 0),
    nonDiscretionaryPay: num("bonus", 0),
    days,
    paid: paidRaw === "" ? null : { grossPay: Number(paidRaw), totalHours },
    applicability: {
      alternativeWorkweek: form.elements.alt.checked,
      collectiveBargainingAgreement: form.elements.cba.checked,
      exempt: form.elements.exempt.checked,
      pieceRate: form.elements.piece.checked,
    },
  };
}

function render(out, input, r) {
  if (r.blockers && r.blockers.length) {
    out.innerHTML = `<div class="result refused">
      <h2>This tool will not answer for your situation</h2>
      <p>Not because your pay is fine. Because the rules that would apply to you are
      different from the ones this tool knows, and a confident wrong number is worse
      than none.</p>
      <ul>${r.blockers.map((b) => `<li>${b}</li>`).join("")}</ul>
      <p>Everything above still needs working out. It needs a person who can read the
      schedule or the agreement, which is a thing a calculator cannot do.</p>
    </div>`;
    return;
  }

  const c = r.classification;
  const rows = [];
  if (input.nonDiscretionaryPay > 0) {
    rows.push({ label: "Your real overtime rate, once the bonus is counted",
      value: money(r.regularRate), rule: "Lab. Code &sect; 510; 29 C.F.R. &sect; 778.109" });
  }
  if (c.straight) rows.push({ label: `Straight time, ${c.straight} hours`, value: money(r.pay.straightPay) });
  if (c.timeAndHalf) rows.push({ label: `Overtime at 1.5&times;, ${c.timeAndHalf} hours`, value: money(r.pay.otPay), rule: "Lab. Code &sect; 510(a)" });
  if (c.doubleTime) rows.push({ label: `Double time at 2&times;, ${c.doubleTime} hours`, value: money(r.pay.dtPay), rule: "Lab. Code &sect; 510(a)" });
  if (r.pay.premiumPay) rows.push({ label: "Missed break premiums", value: money(r.pay.premiumPay), rule: "Lab. Code &sect;&sect; 226.7, 512" });

  const sf = r.shortfall;
  let verdict = "";
  if (sf.paid == null) {
    verdict = `<p class="v-none">You did not enter what you were paid, so there is nothing to compare.
      What the law required for this week is <strong>${money(sf.owed)}</strong>.</p>`;
  } else if (sf.difference > 0.005) {
    verdict = `<p class="v-short">For this one week you were short by
      <strong>${money(sf.difference)}</strong>. Over a year of similar weeks that is
      roughly <strong>${money(sf.difference * 52)}</strong>.</p>`;
  } else {
    verdict = `<p class="v-ok">For this week the arithmetic comes out right. That is worth
      knowing too, and it does not mean every week was.</p>`;
  }

  out.innerHTML = `<div class="result">
    <h2>What the law required for this week</h2>
    <div class="ledger">
      <div class="lg-head"><span>${r.totalHours} hours worked</span><span>Rate on your stub ${money(input.baseHourlyRate)}</span></div>
      ${rows.map((x) => `<div class="lg-row cited">
        <div class="lg-label">${x.label}${x.rule ? `<span class="lg-cite">${x.rule}</span>` : ""}</div>
        <div class="lg-val">${x.value}</div></div>`).join("")}
      <div class="lg-row strong"><div class="lg-label">Total owed</div><div class="lg-val">${money(sf.owed)}</div></div>
      ${sf.paid != null ? `<div class="lg-row"><div class="lg-label">You were paid</div><div class="lg-val">${money(sf.paid)}</div></div>` : ""}
      ${sf.paid != null ? `<div class="lg-total"><div class="lg-label">Difference</div><div class="lg-val">${money(sf.difference)}</div></div>` : ""}
    </div>
    ${verdict}
    ${r.notes && r.notes.length ? `<div class="whys"><h3>Why each figure came out that way</h3>
      ${r.notes.map((n) => `<p class="why"><span class="cite">${n.rule.cite}</span> ${n.detail}</p>`).join("")}</div>` : ""}
    <p class="after">This is arithmetic, not advice. It cannot tell you whether to do anything,
    and it has not seen your contract, your schedule agreement or anything your employer would say.
    What it can do is give you a number you did not have.</p>
  </div>`;
  out.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function mount(root) {
  buildForm(root);
  const form = $("#wk", root);
  const out = $("#out", root);
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const input = readForm(form);
    if (!(input.baseHourlyRate > 0)) {
      out.innerHTML = `<div class="result refused"><p>An hourly rate is needed before anything can be worked out.</p></div>`;
      return;
    }
    if (!input.days.length) {
      out.innerHTML = `<div class="result refused"><p>Enter the hours for at least one day.</p></div>`;
      return;
    }
    render(out, input, computeWorkweek(input));
  });
}

const el = document.getElementById("calculator");
if (el) mount(el);
