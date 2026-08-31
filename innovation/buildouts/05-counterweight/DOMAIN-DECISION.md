# Counterweight: the domain decision

Written 2026-08-31. Every price below comes from a web search summary, not from
a page I could open. The egress proxy on this machine blocks the registrars and
the price-comparison sites, so nothing here is a live quote. Marked `[review]`
throughout. Check every number at the registrar before you pay.

---

## The recommendation, in one line

**Buy a Counterweight `.com` variant, use it for both the website and the cold
campaign, and skip `.app` and `.tools`; the three-year price difference is
under $40 and the 1,203-firm Florida list is a one-shot asset you cannot
re-send if the first pass lands in quarantine.**

---

## 1. Three-year cost of ownership

Registration prices are for one year. Prices are first-year and renewal at the
same registrar, so the second and third years are renewals.

| Option | Registrar | Yr 1 | Yr 2 | Yr 3 | **3-yr total** |
|---|---|---|---|---|---|
| A Counterweight `.com` | Cloudflare (at cost) | ~$10.44 | ~$11.15 | ~$11.15 | **~$32.75** |
| A Counterweight `.com` | Porkbun (flat renewal) | $11.80 | ~$12.50 | ~$12.50 | **~$36.80** |
| `counterweight.app` | Dynadot | $10.00 | $14.50 | $14.50 | **$39.00** |
| `counterweight.app` | Porkbun | $9.81 | $14.93 | $14.93 | **$39.67** |
| `counterweight.app` | Namecheap | $10.98 | [NOT ESTABLISHED] | [NOT ESTABLISHED] | [NOT ESTABLISHED] |
| `counterweight.tools` | Dynadot | $9.85 | $30.18 | $30.18 | **$70.21** |
| `counterweight.tools` | Namecheap | $8.48 | [NOT ESTABLISHED] | [NOT ESTABLISHED] | [NOT ESTABLISHED] |

### Where those numbers come from, and where they are soft

**`.com`.** This is the only line I trust to the cent, because `.com` pricing is
contractually capped and published. Verisign's wholesale price is $10.26 and
rises to $10.97 on 1 November 2026, a 7% increase, the first of four annual
increases Verisign is permitted in the back half of its contract term
[review, corroborated by two independent reports]. Add the $0.18 ICANN
transaction fee. A registrar selling at cost lands near $10.44 today and $11.15
after 1 November.

One search summary claimed Cloudflare sells `.com` at $8.03. That is below the
registry's own wholesale price, so it cannot be true. I am flagging it rather
than quietly dropping it, because it tells you how much confidence to place in
the aggregator sites generally. Treat every "cheapest domain 2026" page as
marketing until you see the number in a cart.

**`.app`.** Google Registry runs it. The renewal is real and modest: $14.50 at
Dynadot, $14.93 at Porkbun, $14.20 as the lowest seen across 43 registrars
[review]. The average renewal across all registrars is $24.39, which means your
registrar choice costs more than your TLD choice here. Registering `.app` at
GoDaddy and renewing at Porkbun differ by more than `.app` differs from `.com`.

**`.tools`.** Identity Digital (formerly Donuts) runs it. This is the classic
pattern you spotted. Dynadot registers at $9.85 on a promotion running to
31 December 2026 and renews at $30.18 [review]. Namecheap's first year is $8.48
and I could not establish its renewal. Registration prices across 50 registrars
span $5.99 to $89.77, which is a spread that only exists when the registry
price is high and everybody is discounting year one to hide it.

Whether Identity Digital raises `.tools` again inside three years is
[NOT ESTABLISHED]. New gTLD registries have no price cap. Verisign is capped at
7% per year by contract; Identity Digital is capped by nothing. A ten-year view
makes `.tools` materially worse than the table shows, and a ten-year view is the
right one for a domain you print on invoices.

**What settles this:** open Porkbun, Cloudflare and Dynadot, search the exact
string, and read the renewal line under the cart price. Ten minutes.

### The number that actually matters

Three years of `.com` versus three years of `.app` is a difference of about $7.
Against `.tools`, about $37. You will spend more than that on Google Workspace
in six weeks. Business Starter is $7.00 per user per month on an annual
commitment or $8.40 month to month [review]; three mailboxes for a year is
roughly $250. The domain is around 4% of what the first year of this campaign
costs you. Price is not the deciding variable, so stop treating it as one.

---

## 2. Deliverability: do newer gTLDs get filtered harder?

This is the question worth spending time on, so I am going to separate what has
been measured from what people say in blog posts selling cold-email software.

### What is measured

**New gTLDs are wildly over-represented in abuse data.** Interisle's Cybercrime
Supply Chain 2025 study found new gTLDs held about 12% of the domain market but
accounted for roughly 47% of reported cybercrime domains. Of the 25 worst TLDs
by abuse, 22 were new gTLDs. Malicious registrations rose 149% year over year
and bulk criminal registration rose 177% [review]. Interisle publishes its
methodology and has no product to sell you, which is why I weight it.

**Spamhaus scores TLDs individually, not as a class.** Its badness index
multiplies the share of bad domains by the log of their count. The TLDs that
surface repeatedly are `.top`, `.bond`, `.xyz`, `.cc`, `.vip`, `.icu`, `.cam`,
`.ooo` [review]. Cheap, permissive, bulk-registrable, often under $2.

**Neither `.app` nor `.tools` appears on any abuse list I found.** That is an
absence of evidence, not evidence of absence, and I could not open the Spamhaus
statistics page to check directly. `.app` costs about $15 to renew and Google
Registry operates it, which is exactly the profile that does not attract bulk
criminal registration. My working position is that `.app` is not a dirty TLD.
Confirming it means loading spamhaus.org/statistics/tlds and reading the row.

### What is folk wisdom dressed as data

Cold-email vendors publish numbers like "93% inbox placement on `.com` versus
61% on `.xyz`," "37% higher placement," and "3 to 5% Gmail open rates on bad
extensions" [review]. No sample size, no seed-list methodology, no dates, and
every one of these sites sells sending infrastructure. I would not put money on
any of them.

Note what they all compare, though. Every single test is `.com` against `.xyz`
or `.top`. **I found no published test of `.app` or `.tools` against `.com` for
cold B2B email.** [NOT ESTABLISHED]. Anyone telling you `.app` performs worse is
extrapolating from `.xyz` data, and that extrapolation is not obviously valid.

### What the deliverability people actually say

The balanced view, from sources without a domain to sell: a receiving filter
does not reject mail because of the TLD. It scores domain age, authentication,
sender reputation, the URLs in the body, complaint history and blocklist hits.
The TLD is a context clue, not a verdict [review]. Spamhaus's guidance on new
domains says the same thing from the other direction: the problem with a fresh
domain is not its ending, it is that a legitimate new registrant does not
normally start blasting bulk mail on day three.

### The risk that is real and is not about scoring

Here is where I part company with the "TLD doesn't matter" camp, and it has
nothing to do with spam scores.

Corporate mail security lets administrators block entire top-level domains
outright. Comodo's secure email gateway ships with a TLD allow/block list.
Check Point, Cisco and Sophos all support it. Cloudflare Gateway publishes
"block these TLDs" as a common recommended DNS policy [review]. After the
`.zip` and `.mov` launches in 2023, blocking new gTLDs as a category became
ordinary hygiene advice in the sysadmin world.

A TLD block is binary and silent. You get no bounce. The message is quarantined
or dropped, your sending statistics look fine, and the firm never knew you
wrote. Against a list of 1,203 businesses you get exactly one shot at, silent
loss is the failure mode to design against.

How many Florida public adjusting firms sit behind a managed filter with TLD
rules? [NOT ESTABLISHED]. Adjusting firms of 2 to 20 people typically run
Microsoft 365 through an MSP, and MSPs apply templated blocklists [ASSUMPTION,
based on the size profile in your own licence file, not on any survey of these
firms]. Even at 5%, that is 60 firms deleted from your list by a config file.

Separately, and this applies to `.com` too: newly registered domain filtering
quarantines mail from domains registered in the last 7 to 30 days, and some
gateways quarantine mail *containing links to* such domains [review]. Whatever
you buy, buy it now and let it sit.

### Verdict on question 2

`.app` is probably fine on spam scoring and I cannot prove it. `.com` is
certainly fine. The delta is $7 over three years. Buy the certainty.

---

## 3. The `.app` HSTS preload requirement

`.app` is on the Chromium HSTS preload list at the TLD level, so every browser
that ships that list forces HTTPS on every `.app` address before it even
resolves DNS. You cannot serve `.app` over plain HTTP. There is no opt-out.

**Do the free hosts handle it?** Yes, all three.

- **GitHub Pages** issues Let's Encrypt certificates for custom domains and has
  an "Enforce HTTPS" checkbox. GitHub built the Let's Encrypt integration
  specifically because customers could not otherwise host `.app` domains
  [review, from GitHub's own docs and the surrounding discussion]. The
  checkbox can take up to 24 hours to become available after you point DNS.
- **Netlify** provisions certificates automatically and documents HSTS headers
  including `preload`.
- **Cloudflare Pages** terminates TLS by default and Cloudflare has a one-click
  HSTS toggle under SSL/TLS, Edge Certificates.

**Is it a benefit?** Barely. The padlock is not a differentiator, because a
`.com` on the same three hosts gets the identical free certificate with the
identical automation. The only real gain is that you cannot misconfigure your
way into serving HTTP, which is a problem you were not going to have.

**Is it an obstacle?** Two small ones, worth knowing.

First, the failure mode changes shape. On a `.com`, a broken certificate gives
visitors a warning they can click past. On a `.app`, the browser refuses the
connection. During the window between pointing DNS and the certificate being
issued, your site is not "insecure," it is unreachable. Same during any
certificate lapse.

Second, it constrains your tooling permanently. Any form builder, landing-page
tool, redirect service or click-tracking domain you attach to `.app` must
support HTTPS on a custom domain. Most do. The one that does not will surface
at the worst moment.

Net: not a reason to avoid `.app`, and not a reason to choose it either. The
HSTS thing is a wash and it should not appear in the decision at all.

---

## 4. Trust with a conservative professional buyer

The direct evidence does not exist. There is no study of how licensed insurance
adjusters read domain endings. [NOT ESTABLISHED]. Here is the adjacent evidence
and how far I would stretch it.

**GrowthBadger, 2019, updated 2022, n=1,500.** `.com` rated most trusted at 3.5
out of 5, `.co` 3.4, `.org` and `.us` 3.3, `.net` 3.2 [review]. Memorability:
44% for `.com` against 33% for `.co`. Participants were 3.8 times more likely to
misremember a URL as ending in `.com`. Two honest caveats. The study covers
legacy TLDs plus `.io` and `.co`, so it says nothing directly about `.app` or
`.tools`. And the gaps are small. A 3.5 against a 3.2 is not a chasm.

Secondary sites attribute a figure to that study saying **84.1% of consumers
would not click a search result they noticed was not `.com`**. I could not
verify that in the primary source and I do not believe it. It contradicts the
trust ratings in the same study, and 84% of people do not look at the TLD in a
search result at all. Do not repeat that number.

**Registrar-commissioned surveys** report about 70% placing implicit trust in
`.com` and `.org` against 26% for newer extensions like `.us` and `.biz`, and
say two-thirds prefer a longer `.com` to a short alternative extension even for
`.ai` [review]. These come from companies that sell `.com` domains. Directionally
plausible, quantitatively unreliable.

**What I would actually say about your buyer.** A 55-year-old licensed adjuster
in Boca Raton reading a cold email skims the from-address for about half a
second. `counterweight.tools` reads like a hardware supplier and is the weakest
of the three on this axis by a distance. `counterweight.app` reads as software
and is fine to anyone under 45. `.com` reads as nothing at all, which is the
goal. In cold outreach the domain's job is to be invisible.

**A finding that matters more than any of this.** Searching for the name turned
up an existing product at **`counterweight-app.com`** described as immutable
digital-media authentication for photographers, news agencies, **insurance
adjusters** and law enforcement [review]. Another company is already reaching
your buyers under a near-identical name. `counterweight.app` and
`counterweight-app.com` are the same string to a human being. Also live:
`counterweightmedia.com`, `counterweight.org` (weight management),
`counterweight.store`. The name is crowded. Verify the `counterweight-app.com`
collision before you commit to anything, because if it is real, `.app` is not
just a weaker choice, it is an active brand conflict in your own inbox.

---

## 5. Domain age and warmup, and whether it changes the answer

Every option starts at zero. No TLD gives you sending history.

**How long.** Sources cluster at 2 to 4 weeks minimum for a brand-new domain,
with several saying 30 to 60 days, and one advising you not to cold-send for
three months [review]. That spread is honest disagreement, not sloppiness.
Under 100 emails a day, two to three weeks is the common answer.

**The ramp.** Start at 5 to 10 sends per mailbox per day. Add roughly 5 a day.
Cap a mailbox at 25 to 30 a day. Do not grow total volume more than about 30%
week over week [review].

**What that means for 1,203 firms.** Three mailboxes at 30 a day is 90 a day,
so a single clean pass over the Florida list takes about fourteen sending days
once you are at full volume, plus three weeks of warmup before day one. Call it
six weeks from registration to finishing the first pass. Register the domain
this week whatever you decide, because the clock starts at registration and NRD
filters penalise anything under 30 days old.

**Does age change the TLD calculus? Yes, and in the direction that decides
this.** A filter deciding on a domain with no history has only static signals to
work with: authentication, content, URL reputation and the domain string itself.
Once you have six months of clean sending, the TLD is noise. It is at the
beginning, on the first cold campaign, sent to the only list that matters, that
the TLD carries the most weight it will ever carry. You are proposing to spend
your single most valuable asset at the exact moment when the cheap variable is
most likely to hurt.

That is the whole argument. Not that `.app` is bad. That the one campaign where
it could plausibly cost you is this one.

---

## 6. Pitfalls of the recommendation, honestly

I am recommending `.com`. Here is what is wrong with that.

1. **`counterweight.com` is probably gone, and the good variants may be too.**
   I could not check availability. RDAP and WHOIS are both blocked here and
   there is no `dig` on this machine. [NOT ESTABLISHED] for every string below.
   You may work down the shortlist and end up with something clunky.

2. **A prefixed `.com` is a visible compromise.** `getcounterweight.com` tells a
   sharp reader that someone else owns `counterweight.com`. Prefixes like `get`
   and `try` are a recognised SaaS convention and vendors specifically recommend
   them for outbound [review], so the cost is small. It is not zero.

3. **The name collision is the real problem and `.com` does not fix it.**
   If `counterweight-app.com` is genuinely selling to insurance adjusters, no
   domain choice rescues the name. Consider whether Counterweight survives at
   all. That question is above this document's pay grade, but it belongs on the
   table this week rather than after you have printed anything.

4. **`.com` is the expensive option on a ten-year view.** Verisign has four
   annual 7% increases available. Roughly $10.97 becomes about $14.40 by 2030 if
   it takes all of them. `.app` at $15 flat may well be cheaper by 2032. Registering
   for two years before 1 November locks the current price for both.

5. **A `.com` will not save a bad campaign.** Placement is mostly SPF, DKIM,
   DMARC, list hygiene, complaint rate and whether the message reads like a
   person wrote it. The domain buys you the absence of one specific problem.

6. **An aftermarket `.com` can come pre-poisoned.** If you buy a dropped domain,
   the previous owner's sending history and blocklist entries come with it. That
   is a genuinely worse starting position than any new gTLD. Check the domain's
   history before buying anything with a past.

7. **Splitting brand and sending domains doubles the setup.** Two DNS zones, two
   DKIM keys, two DMARC policies. Worth it, but it is an afternoon.

---

## 7. What to do this week

**Monday.** Verify the `counterweight-app.com` collision. Open it, see who they
sell to. If they are genuinely in front of insurance adjusters, pause and
rethink the name before spending anything.

**Monday.** Check availability and true renewal price at Porkbun and Cloudflare,
in this order:

| Priority | Candidate | Why |
|---|---|---|
| 1 | `counterweightcase.com` | Descriptive, no prefix, says what it does |
| 2 | `counterweightclaims.com` | Reads native to the buyer |
| 3 | `usecounterweight.com` | Standard SaaS convention |
| 4 | `getcounterweight.com` | Same, slightly more marketing-flavoured |
| 5 | `trycounterweight.com` | Keep as the second sending domain |

Read the renewal line, not the promotional first-year price.

**Tuesday.** Register two of them for two years at a registrar with flat
renewals. Two years, not one: a domain with a longer registration term reads
better to reputation systems and you lock the price ahead of the 1 November
`.com` increase. Budget about $45.

**Tuesday.** Google Workspace on the primary domain, then SPF, DKIM and DMARC.
Start DMARC at `p=none` with an rua address, move to `quarantine` after two
weeks of clean reports. Two mailboxes to start, roughly $14 a month annually
committed.

**Wednesday.** Put a real page up. One page is enough. Cloudflare Pages or
Netlify, free, automatic certificate. A domain that resolves to nothing is a
spam signal on its own.

**Wednesday, warmup starts.** Whatever the send date is, the warmup clock starts
now. Ten a day, human replies, real conversations.

**Week 3, optional, about $50.** Run a seed test before touching the real list.
Same copy, same day, from your `.com` and from a throwaway `.app`, into a seed
inbox service. That is the experiment that would settle question 2 for your
specific market, and nobody has run it publicly. If you do it, write down the
result. It is worth more than every blog post cited here.

**Do not send to the Florida list before week 4.** The list is 1,203 firms and
you have one clean pass. Everything above exists to protect that pass.

---

## Sources

All accessed 2026-08-31 via search-result summaries only. Pages could not be
opened directly.

- Verisign `.com` wholesale increase to $10.97 on 1 Nov 2026: domainnamewire.com, osir.com
- `.app` pricing: tld-list.com/tld/app, porkbun via domainoffer.net, namecheap.com, dynadot.com
- `.tools` pricing: tld-list.com/tld/tools, dynadot.com/domain/tools, namecheap.com
- New gTLD abuse share: interisle.net Cybercrime Supply Chain 2025; interisle.substack.com
- Abused TLD rankings: spamhaus.org resource hub, "The World's Worst Top Level Domains"
- TLD as context clue, not verdict: suped.com, socketlabs.com "Top-Level Do(n't)mains"
- Vendor placement claims (unverified): winnr.app, mailforge.ai, emailchaser.com
- Trust ratings: growthbadger.com/top-level-domains; atom.com radar survey; varn.co.uk
- TLD blocking in mail gateways: help.comodo.com, community.checkpoint.com, developers.cloudflare.com Gateway DNS policies
- NRD filtering: community.sophos.com NRD Protection
- HSTS and free hosts: docs.github.com Pages custom domains, docs.netlify.com HTTPS, developers.cloudflare.com
- Warmup timelines: warmy.io, instantly.ai, mailreach.co, vendisys.com
- Google Workspace pricing: workspace.google.com/pricing and secondary summaries
