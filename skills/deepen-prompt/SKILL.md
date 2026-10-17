---
name: deepen-prompt
description: "Rewrites a task or prompt into a deeper version (not a bigger one) by asking what a top practitioner would do, which raw material they would start from, which methods and tools they would use, and what outside check would prove the result right. Use when the user says deepen, go deeper, make this prompt better, what would an expert do, sharpen this task, or before starting non-trivial research, analysis, debugging, writing, or data work where a shallow answer is likely. Based on Felix Rieseberg's depth prompt."
license: MIT
metadata:
  author: "Andre Burgstahler"
  version: "1.0.0"
  source: "https://felixrieseberg.com/how-to-be-more-ambitious-a-tutorial-for-humans-with-models/"
---

# Deepen prompt

Turn a task into the version a field-leading professional would actually do: same scope, deeper
work. The output is a short diagnosis plus a rewritten prompt the user can run.

The original prompt, by Felix Rieseberg ([How to be more ambitious](https://felixrieseberg.com/how-to-be-more-ambitious-a-tutorial-for-humans-with-models/)):

> I want a deeper version of this task, not a bigger one. Before rewriting it: (1) say what a top
> professional in this field would do here that I'm not asking for; (2) name the rawest material
> they would start from instead of what has already been digested for me; (3) name the specific
> methods and tools they would use; (4) say what, other than you or me, would show the result is
> right. Then rewrite my prompt to ask for exactly that.

## Core rule: deeper, not bigger

Depth changes **how** the work is done (inputs, instruments, verification). Bigness changes
**how much** is delivered (more sections, more features, more pages). Reject bigness.

A deeper rewrite usually has the same or a *smaller* deliverable, and a much more demanding path
to it. If your rewrite adds deliverables, cut them until only the original goal remains.

## When to use

- The user asks to deepen, sharpen, or "expert-ify" a prompt or task.
- Before starting non-trivial analysis, research, debugging, writing, design, or data work where
  the obvious approach would summarize already-digested material.
- When the user's prompt names a deliverable ("make a deck", "write a report", "fix this bug")
  but not the evidence, method, or acceptance test behind it.

Do not use it for trivial lookups, pure formatting, or when the user explicitly wants a quick answer.

## Procedure

### 0. Identify the field and the real goal

Name the profession that would own this task at the highest level (e.g. "SRE", "forensic
accountant", "survey statistician", "copy editor at a magazine"). If two fields compete, pick the
one whose methods would change the answer most, and mention the other in one line. Restate the
goal in one sentence; do not raise it to a different goal (that is altitude, not depth).

If the task is ambiguous in a way that changes the field, ask one clarifying question. Otherwise
proceed with explicit assumptions.

### 1. What would a top professional do that the user is not asking for?

List 2-4 concrete practices, each phrased as an action, not a quality.

- Good: "Reproduce the crash on a clean machine before reading any stack trace."
- Bad: "Be thorough." "Use best practices." "Think like an expert."

Test each item: would a competent but non-expert person skip this? If not, it is not depth.

### 2. What is the rawest material they would start from?

Name the primary source upstream of what the user has been handed. Be specific about format and
where it lives.

| Digested (what users usually have) | Raw (what experts start from) |
| --- | --- |
| Dashboard / summary metrics | Event logs, transaction tables, SQL access |
| A blog post about a paper | The paper, its dataset and code |
| A bug report | Crash dumps, logs, the failing commit, a reproduction |
| Survey summary slides | Respondent-level responses and the questionnaire wording |
| A news article | The filing, court record, dataset, or transcript |
| "Customers say X" | Support tickets, call recordings, churned-account histories |

If the raw material is not accessible, say so and name the nearest obtainable proxy and what
access would be needed. Never pretend to have data you do not.

### 3. Which specific methods and tools would they use?

Name real instruments: libraries, statistical methods, commands, standards, instruments of the
trade. Prefer names that can be searched or installed.

- Good: "Kaplan-Meier survival curves and a Cox model in Python (lifelines) on account-level data."
- Bad: "Advanced analytics." "Data science techniques."

Watch for the vocabulary trap: models asked to "act like an expert" switch vocabulary without
switching methods. If the rewrite would still be satisfied by a markdown table and prose, you have
not changed the method.

### 4. What, other than the model or the user, would show the result is right?

Name an outside judge: something that can disagree. Rank by strength:

1. A tool or test the agent can run itself (test suite, type checker, benchmark, held-out data,
   reproduction script, linter, compiler, a diff against ground truth).
2. A prediction checked against unseen or future data.
3. An external reference (official record, standard, independent dataset, measurement).
4. A named human acceptance test (who checks what, against which criterion).

"The model reviews its own work" and "the user will like it" are not outside judges. State a pass
condition precisely enough that someone could fail it.

### 5. Rewrite the prompt

Write a prompt the user can paste as-is. It must:

- Keep the original goal and deliverable size (or shrink it).
- Name the raw inputs and where to get them, or ask for access explicitly.
- Prescribe the methods and tools from step 3.
- Include the outside check from step 4 as an explicit, runnable step with a pass condition.
- Ask the agent to adversarially test the user's current assumption where one exists
  ("We believe churn is an onboarding problem; try to reproduce that from the raw data").
- Say what to do when raw data or tools are missing (stop and report, or use a stated proxy).
- Be concise. A deeper prompt is not a longer prompt; aim for under 200 words.

## Output template

Use this structure, in this order. Keep sections 1-4 to bullets.

```markdown
**Field:** <profession> - **Goal (unchanged):** <one sentence>

**1. What a top <profession> would do that you didn't ask for**
- ...

**2. Rawest material**
- <raw source> instead of <digested source> (access: <how>)

**3. Methods and tools**
- ...

**4. Outside check**
- <judge> - passes if <condition>

**Rewritten prompt**
> <paste-ready prompt>

**What I deliberately did not add:** <one line naming the "bigger" temptations you cut>
```

If the user asked you to also *do* the task, run the rewritten prompt next, after showing it.

## Domain hints

Quick starting points; see [references/domains.md](references/domains.md) for more.

- **Software / debugging:** reproduce first; bisect (`git bisect`); read the actual crash dump or
  core file; write a failing test before the fix. Judge: the new test fails before and passes after,
  on all target platforms.
- **Data / business analysis:** raw event or transaction tables over dashboards; cohorts, survival
  analysis, causal methods (difference-in-differences, regression discontinuity); keep a held-out
  period. Judge: backtest on data the analysis did not see.
- **Research / literature:** primary papers and datasets over reviews; check citations forward and
  backward; replicate one key number. Judge: the replicated number matches within stated tolerance.
- **Writing / editing:** the source interviews, documents, or data behind the claims; fact-check each
  claim to a primary source; read aloud; cut. Judge: a named reader from the audience can restate
  the main point; every claim has a source link.
- **Performance:** profile before changing (flame graphs, `perf`, Chrome DevTools traces); set an
  unreasonable target (e.g. 200 ms, not 5 s). Judge: a benchmark harness in CI on fixed hardware.
- **Security:** threat model (STRIDE), read the actual code paths and configs, fuzz. Judge: a
  proof-of-concept exploit fails after the fix; scanner and fuzzer run clean for N hours.

## Anti-patterns

- **Bigger, not deeper:** adding sections, features, stakeholders, or deliverables. Cut them.
- **Persona cosplay:** "You are a world-class analyst..." with no change in inputs or methods.
  Describe what the expert *does*, never ask the model to *sound* like one.
- **Generic answers:** "use best practices", "be rigorous", "consider edge cases". Every item must
  be specific enough to be checked off.
- **Self-grading:** "double-check your work" as the verification step.
- **Fake raw material:** naming data the user cannot get without saying how to get it.
- **Altitude drift:** silently replacing the user's goal with a grander one. You may suggest the
  higher goal in one line at the end, clearly labelled as optional.
- **Lecture instead of prompt:** a long essay on methodology with no paste-ready rewrite.

## Worked example

**User:** "Make me slides for our quarterly business review using the numbers in this template."

**Field:** business analyst / data scientist - **Goal (unchanged):** a QBR deck that tells
leadership what changed, why, and what to do.

1. Explain changes rather than restating numbers; test the team's existing story about churn
   instead of repeating it; end with the two or three decisions leadership must make.
2. Account-level subscription and event tables (SQL export or warehouse access) instead of the
   pre-aggregated template numbers.
3. Cohort retention tables and Kaplan-Meier curves (Python, pandas, lifelines); a Cox model for
   churn drivers; SQL in DuckDB for reproducibility.
4. Fit on the first three quarters, predict churn in the most recent one; passes if the identified
   driver ranks churned accounts better than chance (AUC reported) and the deck's numbers reconcile
   with finance's revenue figure to the cent.

**Rewritten prompt**
> Build our QBR deck (same length as the template) from the raw account and event tables, not the
> template numbers: <access details>. Load them into DuckDB. Explain what changed this quarter and
> why using cohort retention and Kaplan-Meier curves (lifelines). We believe churn is an onboarding
> problem; try to reproduce that from the data and say plainly if it fails. Validate any churn
> driver by fitting on Q1-Q3 and predicting Q4; report AUC. Reconcile revenue with finance's figure
> before making slides. End with the three most urgent decisions, each with for/against evidence.
> If you cannot access a table, stop and tell me which one.

**What I deliberately did not add:** an appendix, a dashboard, a new reporting process.

More examples (debugging, research, writing, performance, personal finance) are in
[references/examples.md](references/examples.md).
