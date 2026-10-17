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

I turned Felix Rieseberg's "deeper, not bigger" prompt into a free Agent Skill (Claude Code, Codex, Copilot, Cursor, Gemini CLI)

## Body

Felix Rieseberg (works on Claude) published an essay this week on being more ambitious with models:
https://felixrieseberg.com/how-to-be-more-ambitious-a-tutorial-for-humans-with-models/

The depth section ends with this prompt, which has changed how I work:

> I want a deeper version of this task, not a bigger one. Before rewriting it: (1) say what a top professional in this field would do here that I'm not asking for; (2) name the rawest material they would start from instead of what has already been digested for me; (3) name the specific methods and tools they would use; (4) say what, other than you or me, would show the result is right. Then rewrite my prompt to ask for exactly that.

The key idea: when you ask a model for "better", it usually gives you *more* (more sections, more caveats). Asking "act like an expert" changes the vocabulary but not the methods. These four questions force a change in inputs (raw data instead of summaries), instruments (real tools you can name), and verification (an outside judge instead of self-review).

I packaged it as an Agent Skill (SKILL.md) so it's one `/deepen-prompt` away. What I added on top of the prompt:

- a step-by-step procedure with a test for each question (e.g. "would a competent non-expert skip this step? If not, it isn't depth")
- an output template that always ends in a paste-ready rewrite, plus a "what I deliberately did not add" line so it can't sneak in scope
- anti-patterns: bigger-not-deeper, persona cosplay, generic advice, self-grading, invented data
- domain hints and worked examples (debugging, QBR/churn analysis, research, editing, web perf)

Quick example. "Make our landing page faster" becomes: get LCP under 1.2 s on a throttled mid-range phone, start from field RUM data rather than a desktop Lighthouse run, fix the biggest blocker on the critical path, and add a Lighthouse CI budget so the build fails above 1.2 s. Same deliverable, very different work.

How Claude helped: [EDIT BEFORE POSTING. r/ClaudeAI Rule 7 requires a concrete, true description of how Claude/Claude Code was used. Describe your actual workflow, e.g. using Claude Code to test the skill on real tasks, or drop this paragraph for other subs.] The skill is built for Claude Code first (skill plus plugin marketplace) and follows the open Agent Skills format, so the same SKILL.md works in the other tools.

It's free and MIT-licensed. Install: clone and run `./install.sh` (or `/plugin marketplace add r3dlex/deepen-prompt` in Claude Code): https://github.com/r3dlex/deepen-prompt

All credit for the idea goes to Felix. I'd love feedback, especially examples where the rewrite went wrong or got bigger instead of deeper.
