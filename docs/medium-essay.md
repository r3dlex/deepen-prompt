# Deeper, Not Bigger: A Four-Question Habit for Working With AI Agents

*Draft. By André Burgstahler.*

For most of the last year, my instinct when an AI agent gave me a mediocre result was to ask for
more. More sections. More options. More detail. A longer report, a fuller deck, a second pass "with
more depth". The output grew. It rarely got better.

Last week Felix Rieseberg, who works on Claude at Anthropic, published an essay called
[How to be more ambitious: A tutorial for humans with models](https://felixrieseberg.com/how-to-be-more-ambitious-a-tutorial-for-humans-with-models/).
He splits ambition into four kinds: speed, altitude, depth, and range. The section on depth names
the mistake I kept making, and it ends with a prompt I've used every day since:

> I want a deeper version of this task, not a bigger one. Before rewriting it: (1) say what a top
> professional in this field would do here that I'm not asking for; (2) name the rawest material
> they would start from instead of what has already been digested for me; (3) name the specific
> methods and tools they would use; (4) say what, other than you or me, would show the result is
> right. Then rewrite my prompt to ask for exactly that.

That paragraph is the whole idea, and the credit is Felix's. This essay is about why it works, what
I learned using it on real engineering tasks, and the small open-source skill I built so the habit
is one slash command away in whatever agent I happen to be using.

## Bigger is the default failure mode

When you ask a capable model for a better answer without saying what "better" means, it does the
cheapest thing that looks like effort: it adds. Another heading, another caveat, another bulleted
list of considerations. Size is easy to produce and easy to mistake for quality, for the model and
for us.

Depth is different. A deeper answer often has the *same* deliverable, sometimes a smaller one, and
a far more demanding path to it. A senior engineer fixing a crash doesn't write a longer bug
report. They reproduce the crash on a clean machine, find the commit that introduced it, and write
a test that fails before the fix and passes after. The output is a three-line root cause and a
small diff. All the depth went into the method.

Felix makes a point I'd noticed but never put into words: when you tell a model to "act like an
expert", it often switches vocabulary without switching methods. You get the confident tone of a
statistician on top of the same markdown table. Persona prompting changes the costume, not the
instruments.

## The four questions

What I like about Felix's prompt is that each question pins down something you can check.

**1. What would a top professional do that I'm not asking for?** This finds the missing practice.
The answer has to be an action, not a quality. "Be thorough" fails. "Reproduce the bug on all three
operating systems before reading the stack trace" passes. My test: would a competent non-expert
skip this step? If not, it isn't depth.

**2. What is the rawest material they would start from?** Most of what we hand an agent has already
been digested: a dashboard instead of the event table, a blog post instead of the paper, a bug
report instead of the crash dump, "customers say X" instead of the support tickets. Every layer of
digestion bakes in someone's assumptions. Going one layer down is where you find out whether those
assumptions hold.

**3. What specific methods and tools would they use?** This is the one that kills persona cosplay.
The answer has to name things you can search for or install: `git bisect`, Kaplan-Meier curves in
lifelines, a WebPageTest trace on a throttled phone, GRADE for weighing clinical evidence. If the
rewritten task could still be satisfied by prose and a table, the method hasn't changed.

**4. What, other than you or me, would show the result is right?** This is the most important
question, and the one I used to skip. Felix is blunt about it: in October 2026, don't let the model
judge itself. Ask for an outside judge, ideally one the agent can run itself: a test suite, a
benchmark, a prediction checked against data it hasn't seen, a reconciliation against the finance
team's revenue figure. "Double-check your work" doesn't count. Neither does "the user will like it."

Then comes the rewrite, and the rewrite is the point. You don't want an essay on methodology. You
want a prompt you can paste.

## What it looks like in practice

Felix's running example is a quarterly business review deck. The shallow version is "fill in this
template with this quarter's numbers." Run the four questions over it and you get something like
this:

- A top analyst would explain changes instead of restating them, and would test the team's
  existing story ("churn is an onboarding problem") instead of repeating it.
- The raw material is account-level subscription and event data, not the pre-aggregated numbers in
  the template.
- The methods are cohort retention, survival curves, and a model of churn drivers, run in something
  reproducible like DuckDB and Python.
- The outside judge is a backtest: fit on three quarters, predict the fourth, report how well it
  ranks the accounts that actually churned. The deck's revenue figure has to match finance's to the
  cent.

The rewritten prompt asks for the same deck, the same length, built from different inputs with
different instruments, and it can be checked by something that might disagree with it.

I've had the same thing happen on engineering work. "Make the landing page faster" became "get
largest contentful paint under 1.2 seconds on a throttled mid-range phone, starting from field data
rather than a desktop Lighthouse run, and add a performance budget to CI so the build fails above
that." "Summarize the research on X" became "search the primary databases directly, keep a search
log, grade the evidence, compare registered and reported outcomes, and give equal space to the
strongest contradicting study." In every case the deliverable stayed about the same size. The work
behind it changed completely.

## Turning it into a skill

A prompt you have to remember to paste is a prompt you'll forget. So I packaged it as an
[Agent Skill](https://agentskills.io): a folder with a `SKILL.md` file that most agent tools now
load on demand. The same file works in Claude Code, OpenAI Codex, GitHub Copilot, Cursor, Gemini
CLI, Google Antigravity, and OpenCode, because they've all converged on the same open format. That
convergence is underrated, by the way. A year ago this would have been seven different
configuration files.

The skill doesn't just paste Felix's paragraph. It adds what I kept having to correct by hand:

- **A procedure**: identify the field and restate the goal without inflating it, answer the four
  questions with tests for each, then write a rewrite under about 200 words.
- **An output template**, so the answer is scannable and the rewrite is always paste-ready.
- **Domain hints** for debugging, data analysis, research, writing, performance, and security, plus
  a cheat sheet of raw material, instruments, and outside judges for about fifteen fields.
- **Anti-patterns**, in plain words: bigger instead of deeper, persona cosplay, generic advice,
  self-grading, made-up raw material, and quietly swapping my goal for a grander one. (That last
  one is what Felix calls altitude. It's valuable, but it should be a choice, not drift.)
- A closing line, **"what I deliberately did not add"**, that makes the agent name the bigger
  temptations it resisted. It's a small thing, and it noticeably keeps rewrites honest.

The repository has an install script with per-tool flags, a Claude Code plugin marketplace entry,
generated command files for the tools that also support slash commands, and CI that checks the
skill against the spec and fails if the generated files drift from the source. It's MIT-licensed:
[github.com/r3dlex/deepen-prompt](https://github.com/r3dlex/deepen-prompt).

## Limits

This doesn't make an agent smarter. It makes it harder for the agent, and for me, to confuse effort
with rigor. It also exposes a problem the prompt can't solve: the raw material and the outside
judge usually need access the agent doesn't have yet. Felix notes that before he could ask Claude to
keep an app crash-free, he had to give it crash reports, a map from versions to commits, and
machines to reproduce on. The skill tells the agent to say plainly when raw data is missing rather
than pretend. Often the most useful output of a run is a list of access I need to set up.

It's also the wrong tool for quick questions. Not everything deserves an expert's method. Part of
the discipline is knowing when a shallow answer is the right one.

## The habit, not the tool

What I've really taken from Felix's essay is a reflex. When a result disappoints me, I no longer
ask for more. I ask four questions: what would the best person in this field do, what would they
start from, what would they use, and what would prove them wrong. Most of the time, the answer
shows that my prompt was the shallow part.

Read [Felix's original essay](https://felixrieseberg.com/how-to-be-more-ambitious-a-tutorial-for-humans-with-models/).
The sections on altitude and range are just as good. And if you want the depth part in your agent,
the skill is [here](https://github.com/r3dlex/deepen-prompt).
