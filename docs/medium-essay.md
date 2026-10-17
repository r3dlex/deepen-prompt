# Stop Asking Your AI for More. Ask It to Go Deeper.

*How four questions from Felix Rieseberg rewired the way I prompt, and what the internet thinks of them*

*Draft. By André Burgstahler.*

---

There's a particular kind of disappointment every engineer who works with AI agents knows well.

You ask for something. The agent delivers. It's fine. It's formatted, polite, and plausible, and it's
about as useful as a weather report for a city you're not in. So you do what everyone does: you ask
for *more*. "Be more detailed." "Go deeper." "Add edge cases."

And the agent obliges. The answer gets longer. It gets more headings and more bullet points. If
you're unlucky, it gets a table. Somewhere around the third iteration you realize you've asked for
depth and received volume.

I did this for the better part of a year. Then, last week, I read an essay that named the mistake in
one sentence.

## The sentence

Felix Rieseberg works on Claude at Anthropic. On 13 October he
[posted on X](https://x.com/felixrieseberg/status/2110023283169247623) that he'd written "a tutorial"
on being more ambitious with AI. The essay is called
[How to be more ambitious: A tutorial for humans with models](https://felixrieseberg.com/how-to-be-more-ambitious-a-tutorial-for-humans-with-models/).
It sorts ambition into four kinds: speed, altitude, depth, and range. The depth section ends with
this:

> I want a deeper version of this task, not a bigger one. Before rewriting it: (1) say what a top
> professional in this field would do here that I'm not asking for; (2) name the rawest material
> they would start from instead of what has already been digested for me; (3) name the specific
> methods and tools they would use; (4) say what, other than you or me, would show the result is
> right. Then rewrite my prompt to ask for exactly that.

*Deeper, not bigger.* I read it twice, copied it into a notes file, and then did something I rarely
do with prompting advice: I used it every day for a week.

## Why "bigger" is the trap

When you ask a model for a better answer without defining "better", it does the cheapest thing that
looks like effort: it adds. Size is easy to produce and easy to mistake for quality, for the model
and, honestly, for us.

Depth works differently. Think about how a senior engineer fixes a nasty crash. They don't write a
longer bug report. They reproduce the crash on a clean machine, bisect to the commit that introduced
it, and write a test that fails before the fix and passes after. What they deliver is *smaller* than
what a junior would write: three lines of root cause and a tight diff. All the depth went into the
method.

Felix makes a point that stopped me cold: when you tell a model to "act like an expert", it tends to
switch vocabulary without switching methods. You get a statistician's tone on top of the same
markdown table. The costume changes. The instruments don't.

## The four questions, in plain words

Each question pins down something you can check.

1. **What would a top professional do that I'm not asking for?** This finds the missing practice. It
   has to be an action, not a virtue. "Be thorough" fails. "Reproduce on all three operating systems
   before reading the stack trace" passes.
2. **What's the rawest material they'd start from?** Most of what we hand an agent has already been
   digested: the dashboard instead of the event table, the summary instead of the paper, the ticket
   instead of the logs. Each layer of digestion bakes in someone's assumptions.
3. **Which specific methods and tools would they use?** Things you can search for or install:
   `git bisect`, survival curves, a profiler trace, a property-based test. If the task can still be
   satisfied with prose and a table, the method hasn't changed.
4. **What, other than you or me, would show it's right?** The outside judge: a test suite, a
   benchmark, a prediction checked against data the agent hasn't seen, a number reconciled against an
   independent source. "Double-check your work" doesn't count.

Then comes the rewrite, and the rewrite is the payoff. You don't get a methodology lecture. You get a
prompt you can paste.

## What changed for me

I want to be careful here. I'm not going to wave around numbers I didn't measure, and I'm not going
to talk about my employer's work. But I can describe the *shape* of what changed, because it was
obvious within days.

**I stopped re-prompting.** My old loop was ask, skim, "go deeper", skim, "no, I meant…", and repeat.
The four questions front-load that negotiation. Most of my rounds of "that's not what I meant" simply
disappeared, because the rewrite spelled out what I meant before any work started.

**My prompts got shorter and harder.** That surprised me. The rewrites are rarely longer than the
originals. They're denser: one sentence naming the raw data, one naming the method, one naming the
check. A good deeper prompt reads less like a wish and more like a test plan.

**The agents' output became checkable.** This is the big one. When a result arrives with a named
outside judge (a failing-then-passing test, a benchmark run, a reconciliation), I'm no longer judging
the work by how confident it sounds. I'm judging it by whether it passed. On engineering tasks this
turned review from reading prose into reading evidence.

**I learned what I didn't know I didn't know.** Question one is a cheap private tutor. Ask what a top
performance engineer would do on a slow page, and you'll hear about field data versus lab data,
performance budgets in CI, and the critical rendering path. That kind of knowledge sticks. My prompting
improved because my understanding of the work improved.

## And the people on the other end

Here's the part I underestimated: depth flows downstream.

When the method gets deeper, the people who use the result get something more trustworthy. Think
about the difference, for anyone relying on a piece of software, between a fix that "should work" and
a fix that comes with a regression test proving that exact failure can't come back. Or a performance
change verified on a throttled mid-range phone, which is what real users carry, instead of the
developer's laptop. Or an analysis whose headline number was reconciled against the source system
before anyone made a decision with it.

None of that is flashy. Customers rarely notice depth directly. They notice the absence of the second
bug report, the screen that loads on the train, the decision that didn't need reversing. In domains
where mistakes are expensive, that's the whole game.

## What people are saying

The essay travelled. Felix's post passed four million impressions on X within a few days, and the
prompt itself has been copied, translated, and remixed widely. Some reactions I found genuinely
useful:

- Nicholas Charriere ([@nichochar](https://x.com/nichochar/status/2110589417811579362)): "I love
  seeing how others prompt. This one stood out to me."
- Shardul ([@shardiban](https://x.com/shardiban/status/2111186105496482014)): "This is brilliant and
  has made a significant impact to my work in the last couple of days."
- RileyTheGroove ([@animriley](https://x.com/animriley/status/2110084934605926636)): "'Be more
  ambitious' is the 'be confident' of advice. True, useless, no instructions included. Depth is the one
  I see skipped most. Hand the model raw data and real methods and it stops being a chatbot."
- [@NotairenPapier](https://x.com/NotairenPapier/status/2110755646870265870): "Your crash-free app
  example is the strongest part: the ambition became actionable once the model could access reports,
  reproduce failures and verify fixes."
- The [Intelligent Artifact](https://intelligentartifact.com/posts/ambition-needs-instruments/)
  write-up summed it up neatly: "This is a better request than 'think harder' because it asks for
  changes that can be inspected."
- A [Tenten developer blog post](https://developer.tenten.co/claude-ambition-altitude-depth-range-verifiable-workflows)
  put it this way: "The prompt is useful because it exposes missing work before asking for more output."

## What the critics are saying, and why they have a point

Not everyone was charmed, and the criticisms deserve more than a shrug. The sharpest came from the
[Hacker News thread](https://news.ycombinator.com/item?id=50100345):

- **"It's just 'make no mistakes' with extra steps."** One commenter, TheSamFischer, called the prompt
  "along the same vein as 'make no mistakes'" and added: "Don't give Anthropic even more of your money to
  burn tokens on stuff like this." Cost is real. The four questions add a round trip before any work
  happens. [@Ivrqen](https://x.com/Ivrqen/status/2110976918149550276) made the same point more
  vividly: "cool until it burns 30k tokens reinventing standard libraries from scratch."
- **"Where's the evidence?"** maxcb liked the essay but felt "it's missing substance to help backup the
  idea that generic ambitious prompts are more effective", and asked of the crash-free example: "And did
  it work? What % fewer crashes are there now?" That's fair, and it's why I'm not quoting my own numbers.
- **"The model invents things to look ambitious."** UncleEntity: "the more ambitious I get the more
  Claude doesn't follow the plan and just makes up random stuff to get the tests to pass instead of
  following the design..." A model asked for expert methods can name methods that sound right and
  aren't, or game the very check you gave it.
- **"Handing over judgment is risky."** mjd, on letting the model pick the most urgent decisions: it
  "sounds like it is inviting horribly embarrassing mistakes."
- **"Most people fail earlier than this."** [@spamofthemic](https://x.com/spamofthemic/status/2110502334379987145)
  was "very skeptical" that this is how typical users fail, arguing that "Step 0 is 'understanding how
  to articulate problems to Claude'."

I'd add one of my own: **the raw material is usually the bottleneck.** The prompt happily tells you to
start from the event logs. It can't give you access to them. Felix says as much: before Claude could
keep his apps crash-free, he had to wire up crash reports, version-to-commit mapping, and machines to
reproduce on. Often the most valuable output of a deepening pass is a list of access I need to
request.

And for a quick question, all of this is overkill. Not everything deserves an expert's method.

## So I made it a skill, and tried to bake the criticisms in

A prompt you have to remember to paste is a prompt you'll forget, so I packaged it as an
[Agent Skill](https://agentskills.io): a folder with a `SKILL.md` that Claude Code, OpenAI Codex,
GitHub Copilot, Cursor, Gemini CLI, Google Antigravity, and OpenCode now all load on demand. Seven tools
converging on one open format is quietly one of the best things to happen to this ecosystem.

The skill goes beyond the original paragraph, mostly to answer the critics:

- **Tests for each question.** For example: "Would a competent non-expert skip this step? If not, it
  isn't depth." Generic answers get rejected.
- **No fake raw material.** If data isn't accessible, the agent has to say so and name the access needed.
- **Outside judges ranked by strength**, with a pass condition precise enough to fail. Self-review is
  explicitly ruled out.
- **"When not to use"**: trivial lookups and quick answers skip it.
- **A closing line, "what I deliberately did not add",** which forces the agent to name the bigger
  temptations it resisted. It's a small thing that keeps rewrites honest.

It installs with one script on macOS, Linux, or Windows, and it's MIT-licensed:
[github.com/r3dlex/deepen-prompt](https://github.com/r3dlex/deepen-prompt).

## The habit, not the tool

What I really took from Felix's essay isn't a prompt. It's a reflex. When a result disappoints me, I
no longer ask for more. I ask four questions: what would the best person in this field do, what would
they start from, what would they use, and what would prove them wrong?

Most of the time the answer reveals that the shallow part wasn't the model.

It was my prompt.

*Read [Felix's essay](https://felixrieseberg.com/how-to-be-more-ambitious-a-tutorial-for-humans-with-models/)
(the sections on altitude and range are just as good) and his
[original post on X](https://x.com/felixrieseberg/status/2110023283169247623). All credit for the idea
is his.*
