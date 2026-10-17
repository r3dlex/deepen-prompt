# Reddit post draft

## Suggested subreddits

1. **r/ClaudeAI**: showcase posts are allowed under Rule 7 if you say you built it, explain what it
   does and how Claude/Claude Code helped, say it's free, keep marketing language minimal, and use
   no referral links. Feed posts need OP karma above 100. Use the Showcase/project flair.
2. **r/PromptEngineering**: text posts only, and posting is limited to approved users. No explicit
   promotion rule is published, so disclose ownership and make the post useful without the link;
   consider a quick modmail first.
3. **r/ChatGPTCoding** (alternative, since the skill also works in Codex and Copilot): check the
   sidebar's current self-promotion rules before posting.

Rules were checked on 17 Oct 2026 via third-party rule indexes and the r/ClaudeAI Rule 7
announcement. Re-read each sub's sidebar before posting.

## Title

"Deeper, not bigger": I turned Felix Rieseberg's depth prompt into a free Agent Skill, and tried to address the criticism it got

## Body

Felix Rieseberg (eng lead on Claude) posted an essay on being more ambitious with models this week ([X post](https://x.com/felixrieseberg/status/2110023283169247623), [essay](https://felixrieseberg.com/how-to-be-more-ambitious-a-tutorial-for-humans-with-models/)). The depth section ends with this prompt:

> I want a deeper version of this task, not a bigger one. Before rewriting it: (1) say what a top professional in this field would do here that I'm not asking for; (2) name the rawest material they would start from instead of what has already been digested for me; (3) name the specific methods and tools they would use; (4) say what, other than you or me, would show the result is right. Then rewrite my prompt to ask for exactly that.

The core idea: ask a model for "better" and it usually gives you *more* (more sections, more caveats). "Act like an expert" changes the vocabulary but not the methods. The four questions force a change in inputs (raw data, not summaries), instruments (tools you can name), and verification (an outside judge, not self-review).

What changed for me after a week: fewer "no, I meant…" re-prompts, shorter but denser prompts, and output I can check (a test, a benchmark, a reconciliation) instead of output that just sounds confident.

**The criticism is fair too.** From the HN thread and X: it costs extra tokens and a round trip; there's little hard evidence yet; models can invent expert-sounding methods or game the checks; it's overkill for small tasks; and the real bottleneck is often access to the raw data, not the prompt.

So the skill tries to bake those in:

- a test for each question ("would a competent non-expert skip this step? If not, it isn't depth"), so generic answers get rejected
- no fake raw material: if the data isn't accessible, it says so and names the access needed
- outside judges ranked by strength, each with a pass condition precise enough to fail; self-review is ruled out
- an explicit "when not to use" for trivial tasks
- a closing "what I deliberately did not add" line so scope can't creep in
- worked examples (debugging, churn analysis, research, editing, web perf)

How Claude helped: I used Claude Code to build and test the skill. It's designed for Claude Code first (a skill plus a plugin marketplace entry), and since it follows the open Agent Skills format, the same SKILL.md works in Codex, Copilot, Cursor, Gemini CLI, Antigravity, and OpenCode.

It's free and MIT-licensed. `./install.sh` on macOS/Linux, `.\install.ps1` on Windows, or `/plugin marketplace add r3dlex/deepen-prompt` in Claude Code: https://github.com/r3dlex/deepen-prompt

All credit for the idea goes to Felix. I'd especially like to hear about cases where the rewrite got bigger instead of deeper.
