# Worked examples

Each example shows the original prompt, the four answers, and the rewrite. Note that every rewrite
keeps the original deliverable size.

## 1. Debugging: "Fix this crash in our Electron app"

- **Field:** release / reliability engineer.
- **What they would do:** reproduce on every target OS before touching code; map the crashing build
  to its exact commit; check whether the crash is new (regression) or old-but-newly-frequent.
- **Raw material:** minidumps from the crash reporter (Sentry/Crashpad), symbol files for that build,
  the git range between the last good and first bad release, not the one-line user report.
- **Methods and tools:** symbolicate with `minidump_stackwalk`; `git bisect` across the release range;
  run under AddressSanitizer; Windows/macOS/Linux VMs or CI runners for reproduction.
- **Outside check:** a regression test that crashes before the fix and passes after, on all three
  platforms in CI; crash-free sessions for that signature drop to zero in the next canary.

> Fix the crash with signature <sig>. Start from the minidumps in <crash reporter> and symbolicate
> them for build <ver>. Reproduce on Windows, macOS, and Linux before changing code; if you cannot
> reproduce, stop and tell me what is missing. Use `git bisect` between <good> and <bad> to find the
> introducing commit. Write a regression test that fails before your fix and passes after, and run it
> in CI on all three platforms. Report the root cause in three sentences.

## 2. Research: "Summarize what's known about intermittent fasting and longevity"

- **Field:** systematic reviewer / epidemiologist.
- **What they would do:** separate animal from human evidence; separate RCTs from observational
  studies; look for the strongest disconfirming study; grade evidence quality.
- **Raw material:** the primary trials on PubMed / ClinicalTrials.gov, with their registered outcomes,
  not wellness articles or reviews of reviews.
- **Methods and tools:** a PRISMA-style search log; GRADE for evidence quality; check registered vs
  reported outcomes for outcome switching.
- **Outside check:** every claim links to a primary source with PMID; a second search string reproduces
  the included-study list; registered outcomes match what is reported.

> Summarize human evidence on intermittent fasting and longevity markers in one page. Search PubMed and
> ClinicalTrials.gov directly and keep a search log (query, date, hits). Include only human RCTs and
> large cohorts; list animal findings separately in one line. Grade each finding with GRADE. Compare
> registered vs reported outcomes and flag any switching. Find the strongest study that contradicts the
> popular view and give it equal space. Every claim must cite a PMID.

## 3. Writing: "Make this essay better"

- **Field:** magazine editor.
- **What they would do:** find the one sentence the essay is about and cut everything that does not
  serve it; fact-check; read it aloud.
- **Raw material:** the author's notes, sources, and interviews, not just the draft.
- **Methods and tools:** a reverse outline (one line per paragraph); claim-by-claim fact check; a
  read-aloud pass; target length set by cutting, not adding.
- **Outside check:** a reader from the target audience restates the main point in one sentence after one
  read; every factual claim maps to a source.

> Edit this essay to be 20% shorter, not longer. First write a reverse outline (one line per paragraph)
> and the one-sentence thesis; cut any paragraph that does not serve it. Fact-check each claim against the
> sources I attach and list any you cannot verify. Do a read-aloud pass for rhythm. Return the edited
> essay, the outline, and the unverified-claims list.

## 4. Performance: "Make our landing page faster"

- **Field:** web performance engineer.
- **What they would do:** measure real-user data before lab data; set a hard budget; attack the critical
  rendering path, not micro-optimizations.
- **Raw material:** CrUX / RUM field data and a WebPageTest trace on a throttled mid-range device, not a
  single Lighthouse score from a fast laptop.
- **Methods and tools:** Chrome DevTools performance traces, WebPageTest filmstrips, bundle analyzer,
  Lighthouse CI with budgets.
- **Outside check:** Lighthouse CI budget (LCP under 1.2 s on Moto G-class throttling) enforced in CI; p75
  LCP in field data improves over two weeks.

> Get the landing page's LCP under 1.2 s on a throttled mid-range mobile profile (current: <x>). Start
> from our RUM/CrUX data and a WebPageTest trace, not a desktop Lighthouse run. Find the LCP element and
> its critical path; fix the biggest blocker first. Add a Lighthouse CI budget so the build fails above
> 1.2 s. Report before/after traces.

## 5. Personal finance: "Should I pay off my mortgage early?"

- **Field:** fee-only financial planner.
- **What they would do:** compare after-tax returns, liquidity needs, and risk, not just interest rates.
- **Raw material:** the actual loan contract (rate, prepayment terms), tax situation, and account
  statements, not rules of thumb.
- **Methods and tools:** a cash-flow model with after-tax rates; Monte Carlo of the investment
  alternative; sensitivity to job loss.
- **Outside check:** the model reproduces the bank's amortization schedule to the cent; a planner or the
  bank's prepayment calculator confirms prepayment penalties.

> Help me decide whether to overpay my mortgage. Use my loan terms (<rate, balance, prepayment clause>)
> and tax situation, not rules of thumb. Build a spreadsheet model that first reproduces the bank's
> amortization schedule exactly, then compares overpaying vs investing after tax with a Monte Carlo of
> returns, and shows the six-month emergency-fund constraint. One-page recommendation.
