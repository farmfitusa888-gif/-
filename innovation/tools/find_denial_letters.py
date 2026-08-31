#!/usr/bin/env python3
"""
Find real insurance denial letters filed as exhibits in federal court.

Why this exists: the accuracy claim for the contradiction engine has to be
measured against documents nobody on this side of the table wrote. Court
exhibits are the only large pool of denial letters that are already public,
already lawful to read, and already attached to a case where somebody argued
about whether the denial was right.

The pool is the RECAP Archive — PACER documents that somebody already bought
and donated. Anything already in RECAP is free. Anything not in RECAP costs
PACER money, and this script never touches that path. It only reports what is
free, and says so per row.

Two search strategies, because neither one alone works:

  text         Full-text search inside the OCR'd body of the PDF. Finds the
               actual letter language. Misses every scanned exhibit that was
               never OCR'd, which is a lot of them.

  description  Search the docket-entry and attachment descriptions, which are
               typed by the filing clerk and always present. Finds entries
               literally labelled "Exhibit B - Denial Letter". Misses every
               exhibit filed under a generic label.

Run both. They overlap by less than you would expect.

  python3 innovation/tools/find_denial_letters.py --dry-run
  python3 innovation/tools/find_denial_letters.py --self-test
  COURTLISTENER_TOKEN=... python3 innovation/tools/find_denial_letters.py \
      --strategy both --filed-after 2018-01-01 --out candidates.csv

Field names below were read out of the CourtListener source rather than guessed:
cl/search/constants.py (queryable field names), cl/search/documents.py (the
Elasticsearch document for RECAPDocument), cl/search/forms.py (the sidebar
filter parameter names), and cl/lib/models.py (the note that a stored file's
public URL is https://storage.courtlistener.com/ + filepath_local).

What was NOT verified: the exact JSON envelope the search endpoint returns for
type=rd, because this machine cannot reach courtlistener.com. Every field read
below goes through pick(), which tries several plausible key names and gives up
quietly. Run once with --raw-dump and fix the mapping in one place if it drifts.
"""

import argparse
import csv
import json
import os
import re
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from datetime import date

API_ROOT = "https://www.courtlistener.com/api/rest/v4"
SEARCH_URL = f"{API_ROOT}/search/"
WEB_ROOT = "https://www.courtlistener.com"

# Verified from cl/lib/models.py: "To find the location in S3, concatenate
# https://storage.courtlistener.com/ and the value of this field."
STORAGE_ROOT = "https://storage.courtlistener.com"

# Free authenticated accounts get 5/min, 50/hour, 125/day. That is not a typo
# and it is not the old 5,000/hour figure that still shows up in blog posts.
# Read from cl/settings/third_party/rest_framework.py, DEFAULT_THROTTLE_RATES.
# 12.5s between calls keeps us under 5/min with a little headroom for clock
# skew; the daily ceiling is the one that actually bites, so the script counts
# its own calls and stops rather than collecting 429s.
FREE_TIER_SECONDS_BETWEEN_CALLS = 12.5
FREE_TIER_CALLS_PER_DAY = 125

# Nature of suit 110 is "Insurance" on the JS-44 civil cover sheet: actions
# alleging breach of an insurance contract. 190 is "Other Contract" and catches
# the cases where the filer did not tick 110, which happens often enough to be
# worth the extra queries.
NOS_INSURANCE = "110"
NOS_OTHER_CONTRACT = "190"

# Districts that carry first-party property claims in volume: Texas and Florida
# for hail, wind and hurricane; Louisiana for the same; Colorado for hail. A
# denial letter is a denial letter anywhere, but hit rate per API call is the
# scarce resource on a 125/day budget, so start where the cases are.
STORM_DISTRICTS = "txsd txnd txwd txed flsd flmd flnd laed lamd cod"

# Phrases that appear in real denial letters. This list is a HYPOTHESIS, not a
# finding. It came from carrier correspondence conventions and from the
# language state unfair-claims rules push carriers toward, not from measuring
# 500 letters. Every run writes a per-phrase hit count to stderr so the dead
# ones can be cut and better ones added. Prune it after the first real run.
#
# Ordered roughly by how specific each phrase is. The generic ones at the
# bottom pull in reservation-of-rights letters and adjuster correspondence,
# which are near-misses worth reading but should score lower.
DENIAL_PHRASES = [
    "we have completed our review of your claim",
    "we have completed our investigation of your claim",
    "your claim is denied",
    "your claim has been denied",
    "we must respectfully deny",
    "we are denying your claim",
    "we are unable to make payment on your claim",
    "no coverage is available under the policy",
    "coverage is not afforded",
    "there is no coverage for this loss",
    "this letter is to inform you that coverage",
    "this letter is to advise you that coverage",
    "the policy specifically excludes",
    "the following exclusion applies",
    "is excluded under the policy",
    "based upon our investigation",
    "reservation of rights",
]

# Words in a docket entry or attachment description that mean somebody attached
# the letter itself. "denial letter" is the jackpot. The rest are the shapes
# that same document gets filed under.
DESCRIPTION_TERMS = [
    "denial letter",
    "letter of denial",
    "denial of claim",
    "claim denial",
    "coverage denial",
    "denial correspondence",
    "reservation of rights letter",
]

# Exclusion reasons worth spreading the corpus across. Used only for scoring
# hints in the CSV so the collection can be balanced later; a letter that names
# one of these is more useful than a fifteenth late-notice denial.
REASON_HINTS = {
    "late notice": ["prompt notice", "late notice", "failure to give notice",
                    "notice was not timely", "delay in reporting"],
    "wear and tear": ["wear and tear", "deterioration", "marring",
                      "inherent vice", "faulty workmanship"],
    "flood exclusion": ["flood", "surface water", "storm surge",
                        "water damage exclusion"],
    "misrepresentation": ["material misrepresentation", "concealment",
                          "misrepresented", "rescind", "void ab initio"],
    "failure to mitigate": ["failure to mitigate", "protect the property",
                            "further damage", "reasonable steps"],
    "pre-existing damage": ["pre-existing", "predates the policy",
                            "prior damage", "not caused by the reported"],
    "wind/hail": ["wind", "hail", "windstorm", "cosmetic damage"],
    "anti-concurrent": ["anti-concurrent", "concurrent causation",
                        "regardless of any other cause"],
}


# ------------------------------------------------------------------ scoring

def pick(record, *keys, default=""):
    """First non-empty value among several plausible key names.

    The search API has changed shape between v3 and v4 and again when type=r
    stopped returning a flat document list. Rather than pin one spelling and
    break silently, try the ones that have existed and let --raw-dump settle
    any argument.
    """
    for k in keys:
        v = record.get(k)
        if v not in (None, "", [], {}):
            return v
    return default


def _text_blob(record):
    """Everything on a record that could hold letter language, lowercased.

    snippet is what the API returns when highlighting is on; plain_text is the
    full body when it is not. Both may be absent, which is not an error.
    """
    parts = [
        pick(record, "snippet", "plain_text", "text"),
        pick(record, "description"),
        pick(record, "short_description"),
    ]
    blob = " ".join(p for p in parts if isinstance(p, str))
    # Collapse whitespace so a phrase split across a line break still matches.
    return re.sub(r"\s+", " ", blob).lower()


def score(record, phrase_counter=None):
    """Rank a candidate and say why, in words a human can check.

    Deliberately not a black box. The 'why' column is the whole point: every
    row in the CSV has to be checkable by opening the PDF and looking, because
    the corpus this feeds is meant to settle an accuracy argument, and a corpus
    assembled by an unexplainable filter cannot settle anything.
    """
    blob = _text_blob(record)
    reasons = []
    points = 0

    for phrase in DENIAL_PHRASES:
        if phrase in blob:
            # Reservation-of-rights letters are adjacent, not denials. Worth
            # keeping as near-misses but they must not outrank a real denial.
            weight = 1 if phrase == "reservation of rights" else 4
            points += weight
            reasons.append(f'body: "{phrase}"')
            if phrase_counter is not None:
                phrase_counter[phrase] = phrase_counter.get(phrase, 0) + 1

    desc = " ".join(str(pick(record, k)) for k in
                    ("description", "short_description")).lower()
    for term in DESCRIPTION_TERMS:
        if term in desc:
            points += 6
            reasons.append(f'label: "{term}"')

    # An attachment is where exhibits live. document_type 2 == ATTACHMENT,
    # 1 == PACER_DOCUMENT, from cl/search/models.py RECAPDocument.
    if str(pick(record, "document_type")) in ("2", "Attachment"):
        points += 2
        reasons.append("filed as an attachment")
    if "exhibit" in desc:
        points += 2
        reasons.append("labelled an exhibit")

    # A denial letter is one to four pages. A 300-page exhibit is the whole
    # claim file, which is not useless but is a different job.
    pages = pick(record, "page_count", default=None)
    try:
        pages = int(pages)
    except (TypeError, ValueError):
        pages = None
    if pages is not None:
        if 1 <= pages <= 6:
            points += 3
            reasons.append(f"{pages} pages, letter-shaped")
        elif pages > 60:
            points -= 3
            reasons.append(f"{pages} pages, probably a claim file not a letter")

    # No PDF in the archive means a PACER purchase, which this script will not
    # do. Keep the row so the case can be found another way, but bury it.
    available = pick(record, "is_available", default=None)
    if available is False:
        points -= 8
        reasons.append("NOT in RECAP — would cost PACER money")

    hints = [name for name, words in REASON_HINTS.items()
             if any(w in blob for w in words)]
    if hints:
        reasons.append("reason hints: " + ", ".join(sorted(hints)))

    return points, "; ".join(reasons), sorted(hints)


def to_row(record, points, why, hints):
    """Flatten one search hit into the CSV shape."""
    filepath = pick(record, "filepath_local")
    doc_url = f"{STORAGE_ROOT}/{filepath}" if filepath else ""
    abs_url = pick(record, "absolute_url", "docket_absolute_url")
    docket_url = f"{WEB_ROOT}{abs_url}" if abs_url.startswith("/") else abs_url
    return {
        "score": points,
        "case_name": pick(record, "caseName", "case_name", "case_name_full"),
        "court": pick(record, "court_id", "court"),
        "date_filed": pick(record, "dateFiled", "entry_date_filed", "date_filed"),
        "docket_number": pick(record, "docketNumber", "docket_number"),
        "nature_of_suit": pick(record, "suitNature", "nature_of_suit"),
        "entry": pick(record, "document_number"),
        "attachment": pick(record, "attachment_number"),
        "pages": pick(record, "page_count"),
        "free_in_recap": pick(record, "is_available", default=""),
        "docket_url": docket_url,
        "document_url": doc_url,
        "description": pick(record, "short_description", "description"),
        "reason_hints": ", ".join(hints),
        "why_it_matched": why,
    }


CSV_COLUMNS = [
    "score", "case_name", "court", "date_filed", "docket_number",
    "nature_of_suit", "entry", "attachment", "pages", "free_in_recap",
    "docket_url", "document_url", "description", "reason_hints",
    "why_it_matched",
]


# ------------------------------------------------------------------ queries

def quoted_or(phrases):
    """Elasticsearch OR of quoted phrases, which is what CourtListener speaks."""
    return " OR ".join(f'"{p}"' for p in phrases)


def build_queries(args):
    """Every request this run intends to make, as (label, params) pairs.

    Built up front rather than lazily so --dry-run can print the whole plan and
    so the daily call budget can be checked before the first byte goes out.
    """
    common = {
        "type": "rd",                # flat list of documents, not dockets
        "order_by": "dateFiled desc",
    }
    if args.available_only:
        # The sidebar checkbox "Only show results with PDFs". Without it most
        # hits are docket entries whose PDF nobody ever donated.
        common["available_only"] = "on"
    if args.court:
        common["court"] = args.court
    if args.filed_after:
        # The form takes US-style dates. ISO in, US out, so the CLI stays sane.
        common["filed_after"] = _us_date(args.filed_after)
    if args.filed_before:
        common["filed_before"] = _us_date(args.filed_before)

    plans = []
    for nos in args.nos:
        if args.strategy in ("text", "both"):
            # Phrases split into batches. One giant OR is legal but a smaller
            # query is easier to attribute when a phrase turns out to be dead.
            for i in range(0, len(DENIAL_PHRASES), args.phrases_per_query):
                batch = DENIAL_PHRASES[i:i + args.phrases_per_query]
                p = dict(common, q=quoted_or(batch), nature_of_suit=nos)
                plans.append((f"text nos={nos} phrases {i + 1}-{i + len(batch)}", p))
        if args.strategy in ("description", "both"):
            # description= is a sidebar filter over the docket-entry text, so
            # it does not depend on the PDF ever having been OCR'd. This is the
            # strategy that works on scanned exhibits.
            p = dict(common, description=quoted_or(DESCRIPTION_TERMS),
                     nature_of_suit=nos)
            plans.append((f"description nos={nos}", p))
    return plans


def _us_date(iso):
    y, m, d = iso.split("-")
    return f"{m}/{d}/{y}"


def request_url(params):
    return f"{SEARCH_URL}?{urllib.parse.urlencode(params)}"


# ------------------------------------------------------------------ fetching

class Fetcher:
    """One place that touches the network, so one place can fail clearly."""

    def __init__(self, token, sleep_seconds, budget):
        self.token = token
        self.sleep_seconds = sleep_seconds
        self.budget = budget
        self.calls = 0
        self._last = 0.0

    def get(self, url):
        if self.calls >= self.budget:
            raise Budget(f"stopped at {self.calls} calls, the daily free-tier "
                         f"ceiling is {self.budget}")
        gap = self.sleep_seconds - (time.monotonic() - self._last)
        if gap > 0:
            time.sleep(gap)
        req = urllib.request.Request(url, headers={
            "Authorization": f"Token {self.token}",
            # Free Law Project asks callers to be identifiable. Being a polite,
            # named client is also the cheapest insurance against being blocked.
            "User-Agent": "Counterweight denial-letter corpus builder "
                          "(contact: see innovation/research/09-DENIAL-LETTER-CORPUS.md)",
            "Accept": "application/json",
        })
        self._last = time.monotonic()
        self.calls += 1
        try:
            with urllib.request.urlopen(req, timeout=60) as r:
                return json.loads(r.read().decode("utf-8"))
        except urllib.error.HTTPError as e:
            if e.code == 401:
                raise Fatal("CourtListener rejected the token (HTTP 401). Get "
                            "one from your account page and put it in "
                            "COURTLISTENER_TOKEN.")
            if e.code == 429:
                retry = e.headers.get("Retry-After", "?")
                raise Fatal(f"Rate limited (HTTP 429). Retry-After: {retry}s. "
                            f"Free accounts get 5/min, 50/hour, 125/day.")
            raise Fatal(f"CourtListener returned HTTP {e.code}: {e.reason}")
        except urllib.error.URLError as e:
            raise Fatal(
                f"Could not reach {SEARCH_URL}\n"
                f"  underlying error: {e.reason}\n\n"
                "If this is the sandbox, that is expected: courtlistener.com is\n"
                "not on the egress allowlist. Run with --dry-run to print the\n"
                "exact requests and run them from an unblocked machine."
            )


class Fatal(Exception):
    pass


class Budget(Exception):
    pass


# ------------------------------------------------------------------ self-test

FIXTURES = [
    # A near-perfect hit: labelled, short, in the archive, real letter language.
    {"caseName": "Fixture v. Carrier", "court_id": "txsd", "dateFiled": "2021-03-04",
     "docketNumber": "4:21-cv-00001", "suitNature": "Insurance",
     "document_type": "2", "attachment_number": 1, "page_count": 3,
     "is_available": True, "filepath_local": "recap/gov.uscourts.txsd.1/x.pdf",
     "absolute_url": "/docket/1/fixture-v-carrier/",
     "short_description": "Exhibit A - Denial Letter",
     "snippet": "We have completed our review of your claim. The policy "
                "specifically excludes loss caused by wear and tear."},
    # Right language, wrong shape: a 400-page claim file, no PDF donated.
    {"caseName": "Fixture Two v. Carrier", "court_id": "flsd",
     "dateFiled": "2020-08-01", "document_type": "1", "page_count": 412,
     "is_available": False, "short_description": "Notice of Removal",
     "snippet": "your claim is denied"},
    # Noise: nothing here should score above zero.
    {"caseName": "Unrelated v. Nobody", "court_id": "cand",
     "dateFiled": "2019-01-01", "document_type": "1", "page_count": 8,
     "is_available": True, "short_description": "Scheduling Order",
     "snippet": "The parties shall confer and file a joint report."},
]


def self_test():
    """Adversarial rather than confirmatory: the interesting assertions are the
    ones about what must NOT rank highly."""
    scored = [(score(f)[0], f["caseName"]) for f in FIXTURES]
    scored.sort(reverse=True)
    ok = True

    def check(label, condition):
        nonlocal ok
        print(f"  {'PASS' if condition else 'FAIL'}  {label}")
        ok = ok and condition

    top = scored[0][1]
    check("labelled short letter ranks first", top == "Fixture v. Carrier")
    check("unrelated order scores <= 0",
          dict((n, s) for s, n in scored)["Unrelated v. Nobody"] <= 0)
    check("400-page unavailable file loses to the 3-page letter",
          dict((n, s) for s, n in scored)["Fixture Two v. Carrier"]
          < dict((n, s) for s, n in scored)["Fixture v. Carrier"])

    _, why, hints = score(FIXTURES[0])
    check("wear-and-tear hint detected", "wear and tear" in hints)
    check("why-column is human-readable", "Denial Letter".lower() in why.lower())

    row = to_row(FIXTURES[0], *score(FIXTURES[0]))
    check("document URL is built from filepath_local",
          row["document_url"] == f"{STORAGE_ROOT}/recap/gov.uscourts.txsd.1/x.pdf")
    check("docket URL is absolute",
          row["docket_url"] == f"{WEB_ROOT}/docket/1/fixture-v-carrier/")
    check("every CSV column is populated or deliberately blank",
          set(row) == set(CSV_COLUMNS))

    # A row that scores well but has is_available False must never be presented
    # as free. This is the one that costs money if it is wrong.
    check("unavailable rows are flagged in the why column",
          "PACER money" in score(FIXTURES[1])[1])

    print()
    print("  self-test PASSED" if ok else "  self-test FAILED")
    return 0 if ok else 1


# ------------------------------------------------------------------ main

def main():
    ap = argparse.ArgumentParser(
        description="Find denial-letter exhibits in the RECAP Archive.")
    ap.add_argument("--dry-run", action="store_true",
                    help="print the exact requests and exit, touching nothing")
    ap.add_argument("--self-test", action="store_true",
                    help="run the scorer against fixtures and exit")
    ap.add_argument("--strategy", choices=["text", "description", "both"],
                    default="both")
    ap.add_argument("--nos", nargs="+", default=[NOS_INSURANCE],
                    help=f"nature-of-suit codes (default {NOS_INSURANCE}; "
                         f"add {NOS_OTHER_CONTRACT} to widen)")
    ap.add_argument("--court", default=STORM_DISTRICTS,
                    help="space-separated CourtListener court ids, or '' for all")
    ap.add_argument("--filed-after", default="2015-01-01", help="YYYY-MM-DD")
    ap.add_argument("--filed-before", default=None, help="YYYY-MM-DD")
    ap.add_argument("--available-only", action="store_true", default=True)
    ap.add_argument("--include-unavailable", dest="available_only",
                    action="store_false",
                    help="also return documents that are not in RECAP and would "
                         "cost PACER money to obtain")
    ap.add_argument("--phrases-per-query", type=int, default=6)
    ap.add_argument("--pages", type=int, default=2,
                    help="result pages to follow per query")
    ap.add_argument("--min-score", type=int, default=4)
    ap.add_argument("--out", default="denial_letter_candidates.csv")
    ap.add_argument("--raw-dump", default=None,
                    help="write the first raw API response here, to fix the "
                         "field mapping if the envelope has changed")
    ap.add_argument("--budget", type=int, default=FREE_TIER_CALLS_PER_DAY)
    ap.add_argument("--sleep", type=float, default=FREE_TIER_SECONDS_BETWEEN_CALLS)
    args = ap.parse_args()

    if args.self_test:
        return self_test()

    plans = build_queries(args)
    planned_calls = len(plans) * args.pages

    if args.dry_run:
        print()
        print(f"{len(plans)} queries, up to {args.pages} pages each = "
              f"{planned_calls} API calls")
        print(f"free-tier ceiling is {FREE_TIER_CALLS_PER_DAY}/day and "
              f"5/min, so this run would take about "
              f"{planned_calls * args.sleep / 60:.0f} minutes")
        if planned_calls > FREE_TIER_CALLS_PER_DAY:
            print("  WARNING: over the daily free-tier ceiling. Narrow --court "
                  "or --nos, or raise --budget on a paid membership.")
        print()
        print("Header on every request:")
        print("  Authorization: Token $COURTLISTENER_TOKEN")
        print()
        for label, params in plans:
            print(f"# {label}")
            print(request_url(params))
            print()
        print("Then, for each result with is_available true:")
        print(f"  GET {STORAGE_ROOT}/<filepath_local>   (free, already donated)")
        print("Nothing here ever calls the recap-fetch endpoint, so nothing "
              "here can put a charge on a PACER account.")
        return 0

    token = os.environ.get("COURTLISTENER_TOKEN")
    if not token:
        print("No COURTLISTENER_TOKEN in the environment.\n"
              "Sign in at courtlistener.com, copy the token from your profile,\n"
              "then: export COURTLISTENER_TOKEN=...\n"
              "Or run with --dry-run to see the requests without a token.",
              file=sys.stderr)
        return 2

    fetcher = Fetcher(token, args.sleep, args.budget)
    phrase_counter = {}
    seen = set()
    rows = []
    dumped = False

    try:
        for label, params in plans:
            url = request_url(params)
            for _ in range(args.pages):
                data = fetcher.get(url)
                if args.raw_dump and not dumped:
                    with open(args.raw_dump, "w") as fh:
                        json.dump(data, fh, indent=2)
                    dumped = True
                results = data.get("results", [])
                for rec in results:
                    key = pick(rec, "id", "pk") or json.dumps(rec, sort_keys=True)
                    if key in seen:
                        continue
                    seen.add(key)
                    pts, why, hints = score(rec, phrase_counter)
                    if pts >= args.min_score:
                        rows.append(to_row(rec, pts, f"[{label}] {why}", hints))
                url = data.get("next")
                if not url:
                    break
            print(f"  {label}: {len(rows)} candidates so far "
                  f"({fetcher.calls} calls used)", file=sys.stderr)
    except Budget as e:
        print(f"\nBudget stop: {e}\nWriting what was found.", file=sys.stderr)
    except Fatal as e:
        print(f"\n{e}", file=sys.stderr)
        if not rows:
            return 1
        print("Writing the rows collected before the failure.", file=sys.stderr)

    rows.sort(key=lambda r: -r["score"])
    with open(args.out, "w", newline="") as fh:
        w = csv.DictWriter(fh, fieldnames=CSV_COLUMNS)
        w.writeheader()
        w.writerows(rows)

    print(f"\n{len(rows)} candidates written to {args.out} "
          f"({fetcher.calls} API calls used)")
    free = sum(1 for r in rows if r["free_in_recap"] is True)
    print(f"{free} of them are already in RECAP and cost nothing to download.")

    if phrase_counter:
        print("\nPhrase hit counts — cut the zeroes from DENIAL_PHRASES:",
              file=sys.stderr)
        for p in DENIAL_PHRASES:
            print(f"  {phrase_counter.get(p, 0):>5}  {p}", file=sys.stderr)
    return 0


if __name__ == "__main__":
    sys.exit(main())
