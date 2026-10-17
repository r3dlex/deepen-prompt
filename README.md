# deepen-prompt

[![CI](https://github.com/r3dlex/deepen-prompt/actions/workflows/ci.yml/badge.svg)](https://github.com/r3dlex/deepen-prompt/actions/workflows/ci.yml)

An [Agent Skill](https://agentskills.io) that turns a task into a **deeper** version of itself, not a
bigger one. It works in Claude Code, OpenAI Codex, GitHub Copilot, Cursor, Gemini CLI, Google
Antigravity, and OpenCode.

## Credit

This skill packages a prompt by **Felix Rieseberg**, from his essay
[How to be more ambitious: A tutorial for humans with models](https://felixrieseberg.com/how-to-be-more-ambitious-a-tutorial-for-humans-with-models/)
(13 October 2026):

> I want a deeper version of this task, not a bigger one. Before rewriting it: (1) say what a top
> professional in this field would do here that I'm not asking for; (2) name the rawest material
> they would start from instead of what has already been digested for me; (3) name the specific
> methods and tools they would use; (4) say what, other than you or me, would show the result is
> right. Then rewrite my prompt to ask for exactly that.

All credit for the idea goes to Felix. This repo adds a procedure, domain hints, worked examples,
anti-patterns, an output template, and packaging for the tools listed below.

## What it does

Ask the agent to "deepen" a task (or run `/deepen-prompt <task>`). It answers four questions and
then gives you a paste-ready rewrite:

1. What would a top professional in this field do that you're not asking for?
2. What is the rawest material they would start from?
3. Which specific methods and tools would they use?
4. What, other than the model or you, would show the result is right?

It refuses to make the task bigger (more sections, more deliverables) and refuses generic answers
("use best practices", "be rigorous"). See [the skill](skills/deepen-prompt/SKILL.md) and
[worked examples](skills/deepen-prompt/references/examples.md).

## Install

```bash
git clone https://github.com/r3dlex/deepen-prompt.git
cd deepen-prompt
./install.sh                      # Claude Code + the shared ~/.agents/skills dir
./install.sh --tool cursor,gemini # specific tools
./install.sh --all --symlink      # everything, as symlinks to this checkout
./install.sh --list               # show tools and paths
./install.sh --tool claude --uninstall
```

`~/.agents/skills` is read by Codex, Copilot, Cursor, Gemini CLI, and OpenCode, so the default
install covers most tools at once. Installing into several dirs for the same tool may make the
skill appear twice there.

### Claude Code

- Skill: `~/.claude/skills/deepen-prompt/SKILL.md` (`./install.sh --tool claude`), or per project
  in `.claude/skills/`.
- Plugin marketplace (this repo is both a marketplace and a plugin):
  ```
  /plugin marketplace add r3dlex/deepen-prompt
  /plugin install deepen-prompt@deepen-prompt
  ```
- Invoke: `/deepen-prompt <task>` (or `/deepen-prompt:deepen-prompt` when installed as a plugin), or
  just ask "deepen this prompt".

### OpenAI Codex

- Skill: `~/.agents/skills/deepen-prompt/` (`./install.sh --tool codex`), or `.agents/skills/` in a repo.
- Invoke: `$deepen-prompt` or `/skills`; Codex also picks it implicitly from the description.

### GitHub Copilot (CLI, cloud agent, VS Code agent mode, JetBrains)

- Skill: `~/.copilot/skills/` or `~/.agents/skills/` (`./install.sh --tool copilot`); per project in
  `.github/skills/`, `.claude/skills/`, or `.agents/skills/`.
- Prompt file (VS Code): copy `adapters/copilot/prompts/deepen-prompt.prompt.md` into your repo's
  `.github/prompts/` and run `/deepen-prompt` in chat.

### Cursor

- Skill: `~/.cursor/skills/` (`./install.sh --tool cursor`) or `.cursor/skills/` / `.agents/skills/`
  per project. Invoke with `/deepen-prompt`. (Cursor also reads `~/.claude/skills` and
  `~/.agents/skills`, so the default install already works.)

### Gemini CLI

- Skill: `~/.gemini/skills/` or `~/.agents/skills/`; plus a custom command
  `~/.gemini/commands/deepen-prompt.toml` (`./install.sh --tool gemini`). Run `/deepen-prompt <task>`.
- Or: `gemini skills install https://github.com/r3dlex/deepen-prompt.git --path skills/deepen-prompt`

### Google Antigravity

- App/IDE global skills: `~/.gemini/config/skills/`; Antigravity CLI: `~/.gemini/antigravity-cli/skills/`
  (`./install.sh --tool antigravity`). Per workspace: `.agents/skills/`. Invoke with `/deepen-prompt`.
- Legacy workflows (`.agents/workflows/`) stop working on 19 October 2026, so no workflow adapter is shipped.

### OpenCode

- Skill: `~/.config/opencode/skills/` (also reads `~/.claude/skills` and `~/.agents/skills`);
  plus a command `~/.config/opencode/commands/deepen-prompt.md` (`./install.sh --tool opencode`).
  Run `/deepen-prompt <task>`.

## Repository layout

```
skills/deepen-prompt/SKILL.md      canonical skill (edit this)
skills/deepen-prompt/references/   worked examples, domain cheat sheet
adapters/                          GENERATED command/prompt files (OpenCode, Copilot, Gemini CLI)
.claude-plugin/                    Claude Code plugin + marketplace manifests
scripts/build_adapters.py          regenerates adapters/ from SKILL.md (--check in CI)
scripts/validate_skill.py          checks frontmatter against the Agent Skills spec
scripts/test_install.sh            tests install.sh in a temporary HOME
docs/                              essay and post drafts
```

## Contributing

Edit only `skills/deepen-prompt/`. Then run:

```bash
python3 scripts/build_adapters.py
python3 scripts/validate_skill.py
bash scripts/test_install.sh
```

CI fails if `adapters/` is out of sync with the skill.

## License

MIT, see [LICENSE](LICENSE). The original prompt text is Felix Rieseberg's, quoted with attribution.
