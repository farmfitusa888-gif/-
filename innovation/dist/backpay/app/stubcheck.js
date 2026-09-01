// stubcheck.js — does the pay stub itself comply with Labor Code 226(a)?
//
// A separate question from whether the pay was right, and one people do not
// know to ask. Section 226(a) lists nine items an itemised wage statement must
// show. Missing items carry their own penalties, $50 for the first violation
// and $100 for each after, capped at $4,000, whether or not a single cent of
// pay was wrong.
//
// This needs no arithmetic at all. It is nine questions a person can answer by
// looking at the piece of paper in front of them, which makes it the cheapest
// useful thing this whole product can do, and a reason to visit before anyone
// has worked out a single hour.
//
// Runs entirely in the page. Nothing is sent anywhere.

const $ = (s, r = document) => r.querySelector(s);

// The nine, in plain language, with the statutory wording kept beside each so
// the page is checkable against the section rather than trusted.
const ITEMS = [
  { id: "grossWages", q: "Gross wages earned",
    plain: "The total you earned before anything was taken out." },
  { id: "totalHours", q: "Total hours worked",
    plain: "The total hours for the pay period. Not required if you are salaried and exempt." },
  { id: "pieceRateUnits", q: "Piece-rate units and the rate",
    plain: "Only if you are paid by the piece. Skip this if you are paid hourly.",
    optional: true },
  { id: "deductions", q: "All deductions",
    plain: "Every deduction, itemised. Taxes, insurance, anything withheld." },
  { id: "netWages", q: "Net wages earned",
    plain: "What you actually received after deductions." },
  { id: "payPeriodDates", q: "The dates the pay period covers",
    plain: "Both the start and the end date. One date alone is not enough." },
  { id: "employeeNameAndIdentifier", q: "Your name, and the last four of your Social Security number or an employee ID",
    plain: "A full Social Security number on a stub is itself a violation." },
  { id: "employerNameAndAddress", q: "The legal name and address of your employer",
    plain: "The legal entity, not just a trading name." },
  { id: "hourlyRatesAndHours", q: "Every hourly rate, and the hours worked at each",
    plain: "If some hours were overtime, both rates and both hour counts must appear." },
];

const PENALTY = { first: 50, subsequent: 100, cap: 4000 };

function buildForm(root) {
  root.innerHTML = `
    <form id="sc" novalidate>
      <fieldset>
        <legend>Look at your stub and tick what is actually printed on it</legend>
        <p class="hint">If you cannot find something, leave it unticked. Being unsure is
        itself worth knowing, because a stub a person cannot read is close to the problem
        the section exists to prevent.</p>
        <div class="checks">
          ${ITEMS.map((i) => `<label class="chk">
            <input type="checkbox" name="${i.id}"${i.optional ? " data-optional='1'" : ""}>
            <span><strong>${i.q}</strong><span class="hint">${i.plain}</span></span>
          </label>`).join("")}
        </div>
      </fieldset>
      <fieldset>
        <legend>How many pay periods looked like this?</legend>
        <label>Pay periods
          <span class="hint">Roughly. Twenty-six is a year of fortnightly pay.</span>
          <input name="periods" type="number" min="1" max="500" step="1" value="26" inputmode="numeric">
        </label>
      </fieldset>
      <div class="cta-row"><button class="btn" type="submit">Check it</button></div>
      <p class="note">Nothing is sent anywhere. Close the tab and it is gone.</p>
    </form>
    <div id="scout" aria-live="polite"></div>`;
}

function penaltyFor(periods) {
  if (periods < 1) return 0;
  return Math.min(PENALTY.cap, PENALTY.first + (periods - 1) * PENALTY.subsequent);
}

function render(out, missing, periods) {
  if (!missing.length) {
    out.innerHTML = `<div class="result">
      <h2>Every required item is there</h2>
      <p class="v-ok">On the nine items section 226(a) lists, this stub is complete.
      That is a separate question from whether the pay on it was correct, and the
      calculator answers that one.</p>
      <p class="after"><a href="/check">Check whether the pay was right</a></p>
    </div>`;
    out.scrollIntoView({ behavior: "smooth", block: "start" });
    return;
  }
  const p = penaltyFor(periods);
  out.innerHTML = `<div class="result">
    <h2>${missing.length} required item${missing.length === 1 ? " is" : "s are"} missing</h2>
    <div class="ledger">
      <div class="lg-head"><span>Missing from the stub</span><span>Lab. Code &sect; 226(a)</span></div>
      ${missing.map((m) => `<div class="lg-row cited">
        <div class="lg-label">${m.q}<span class="lg-cite">${m.plain}</span></div>
        <div class="lg-val">absent</div></div>`).join("")}
      <div class="lg-total">
        <div class="lg-label">Statutory penalty across ${periods} pay period${periods === 1 ? "" : "s"}</div>
        <div class="lg-val">${"$" + p.toLocaleString("en-US")}</div></div>
    </div>
    <p class="v-short">Section 226(e) sets this at $50 for a first violation and $100 for
    each after, capped at $4,000${p === PENALTY.cap ? ", which this reaches" : ""}.
    <strong>It applies whether or not the pay itself was wrong.</strong></p>
    <p class="after">This is what the section requires, not a prediction about a claim.
    Recovering it turns on facts a calculator cannot see, including whether the omission
    was knowing and intentional and whether it caused injury, which are the words the
    statute uses and the ones an actual case argues about.</p>
    <p class="after"><a href="/check">Now check whether the pay itself was right</a></p>
  </div>`;
  out.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function mount(root) {
  buildForm(root);
  const form = $("#sc", root);
  const out = $("#scout", root);
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const missing = ITEMS.filter((i) => !i.optional && !form.elements[i.id].checked);
    const periods = Math.max(1, Number(form.elements.periods.value) || 1);
    render(out, missing, periods);
  });
}

const el = document.getElementById("stubcheck");
if (el) mount(el);
