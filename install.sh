#!/usr/bin/env bash
# Install the deepen-prompt skill into user-level directories of AI coding tools.
# Usage: ./install.sh [--tool NAME[,NAME...]]... [--all] [--symlink] [--uninstall] [--dry-run] [--list]
set -euo pipefail

SKILL=deepen-prompt
SRC_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SKILL_SRC="$SRC_DIR/skills/$SKILL"
ADAPTERS="$SRC_DIR/adapters"
ALL_TOOLS="claude agents codex opencode copilot cursor gemini antigravity"
DEFAULT_TOOLS="claude agents"

usage() {
  cat <<USAGE
Install the $SKILL agent skill.

  --tool NAME     Tool(s) to install for (repeatable or comma-separated):
                    claude       ~/.claude/skills/$SKILL
                    agents       ~/.agents/skills/$SKILL  (shared: Codex, Copilot, Cursor, Gemini CLI, OpenCode)
                    codex        ~/.agents/skills/$SKILL  (same as agents)
                    opencode     ~/.config/opencode/skills/$SKILL + ~/.config/opencode/commands/$SKILL.md
                    copilot      ~/.copilot/skills/$SKILL
                    cursor       ~/.cursor/skills/$SKILL
                    gemini       ~/.gemini/skills/$SKILL + ~/.gemini/commands/$SKILL.toml
                    antigravity  ~/.gemini/config/skills/$SKILL + ~/.gemini/antigravity-cli/skills/$SKILL
  --all           Every tool above (tools that read several dirs may list the skill twice)
  --symlink       Symlink instead of copy (edits in this repo apply immediately)
  --uninstall     Remove what this script installs for the chosen tools
  --dry-run       Print actions without changing anything
  --list          Show tools and target paths, then exit
  -h, --help      This help

Default with no --tool: $DEFAULT_TOOLS
USAGE
}

TOOLS=""; MODE=copy; ACTION=install; DRY=0
while [ $# -gt 0 ]; do
  case "$1" in
    --tool) [ $# -ge 2 ] || { echo "--tool needs a value" >&2; exit 2; }; TOOLS="$TOOLS ${2//,/ }"; shift 2 ;;
    --tool=*) v="${1#--tool=}"; TOOLS="$TOOLS ${v//,/ }"; shift ;;
    --all) TOOLS="$ALL_TOOLS"; shift ;;
    --symlink) MODE=symlink; shift ;;
    --uninstall) ACTION=uninstall; shift ;;
    --dry-run) DRY=1; shift ;;
    --list) usage | sed -n '/--tool NAME/,/--all/p'; exit 0 ;;
    -h|--help) usage; exit 0 ;;
    *) echo "Unknown option: $1" >&2; usage >&2; exit 2 ;;
  esac
done
[ -n "${TOOLS// /}" ] || TOOLS="$DEFAULT_TOOLS"
[ -f "$SKILL_SRC/SKILL.md" ] || { echo "Cannot find $SKILL_SRC/SKILL.md" >&2; exit 1; }

run() { if [ "$DRY" = 1 ]; then echo "+ $*"; else "$@"; fi; }

place() { # place SRC DEST
  local src="$1" dest="$2"
  if [ "$ACTION" = uninstall ]; then
    if [ -e "$dest" ] || [ -L "$dest" ]; then run rm -rf "$dest"; echo "removed $dest"; fi
    return
  fi
  run mkdir -p "$(dirname "$dest")"
  if [ -e "$dest" ] || [ -L "$dest" ]; then run rm -rf "$dest"; fi
  if [ "$MODE" = symlink ]; then run ln -s "$src" "$dest"; else run cp -R "$src" "$dest"; fi
  echo "installed $dest"
}

skill_to() { place "$SKILL_SRC" "$1/$SKILL"; }

DONE=" "
for t in $TOOLS; do
  case " $ALL_TOOLS " in *" $t "*) ;; *) echo "Unknown tool: $t (use --list)" >&2; exit 2 ;; esac
  case "$t" in
    claude) skill_to "$HOME/.claude/skills" ;;
    agents|codex)
      case "$DONE" in *" agents "*) continue ;; esac
      skill_to "$HOME/.agents/skills"; DONE="$DONE agents " ;;
    opencode)
      skill_to "$HOME/.config/opencode/skills"
      place "$ADAPTERS/opencode/commands/$SKILL.md" "$HOME/.config/opencode/commands/$SKILL.md" ;;
    copilot) skill_to "$HOME/.copilot/skills" ;;
    cursor) skill_to "$HOME/.cursor/skills" ;;
    gemini)
      skill_to "$HOME/.gemini/skills"
      place "$ADAPTERS/gemini/commands/$SKILL.toml" "$HOME/.gemini/commands/$SKILL.toml" ;;
    antigravity)
      skill_to "$HOME/.gemini/config/skills"
      skill_to "$HOME/.gemini/antigravity-cli/skills" ;;
  esac
done

if [ "$ACTION" = install ]; then
  echo "Done. Restart your tool(s), then try: /$SKILL <your task>  (or just ask to 'deepen this prompt')."
fi
