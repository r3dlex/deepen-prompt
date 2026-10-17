#!/usr/bin/env bash
# Exercise install.sh in a throwaway HOME. Fails on the first broken expectation.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
T="$(mktemp -d)"; trap 'rm -rf "$T"' EXIT
fail() { echo "FAIL: $*" >&2; exit 1; }
inst() { HOME="$T" "$ROOT/install.sh" "$@" >/dev/null; }

inst
[ -f "$T/.claude/skills/deepen-prompt/SKILL.md" ] || fail "default: claude"
[ -f "$T/.agents/skills/deepen-prompt/SKILL.md" ] || fail "default: agents"
[ -f "$T/.agents/skills/deepen-prompt/references/examples.md" ] || fail "references copied"

inst --all
for p in .config/opencode/skills/deepen-prompt/SKILL.md .config/opencode/commands/deepen-prompt.md \
         .copilot/skills/deepen-prompt/SKILL.md .cursor/skills/deepen-prompt/SKILL.md \
         .gemini/skills/deepen-prompt/SKILL.md .gemini/commands/deepen-prompt.toml \
         .gemini/config/skills/deepen-prompt/SKILL.md .gemini/antigravity-cli/skills/deepen-prompt/SKILL.md; do
  [ -f "$T/$p" ] || fail "--all: $p"
done

inst --all --uninstall
[ -z "$(find "$T" -name 'deepen-prompt*' -print -quit)" ] || fail "uninstall left files"

inst --tool cursor,gemini --symlink
[ -L "$T/.cursor/skills/deepen-prompt" ] || fail "symlink cursor"
[ -L "$T/.gemini/commands/deepen-prompt.toml" ] || fail "symlink gemini command"
[ ! -e "$T/.claude/skills/deepen-prompt" ] || fail "--tool must not install claude"

inst --tool cursor   # re-install over a symlink must copy, not write through it
[ -d "$T/.cursor/skills/deepen-prompt" ] && [ ! -L "$T/.cursor/skills/deepen-prompt" ] || fail "overwrite symlink"

out="$(HOME="$T/dry" "$ROOT/install.sh" --tool claude --dry-run)"
[ ! -e "$T/dry" ] || fail "dry-run wrote files"
echo "$out" | grep -q "cp -R" || fail "dry-run output"

if HOME="$T" "$ROOT/install.sh" --tool nope >/dev/null 2>&1; then fail "unknown tool accepted"; fi
echo "install.sh: all tests passed"
