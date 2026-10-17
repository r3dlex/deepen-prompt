#!/usr/bin/env python3
"""Build per-tool command/prompt adapters from the canonical skills/deepen-prompt/SKILL.md.

Usage: build_adapters.py          # write adapters/
       build_adapters.py --check  # exit 1 if adapters/ is out of sync
"""
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SKILL = ROOT / "skills" / "deepen-prompt" / "SKILL.md"
REPO_URL = "https://github.com/r3dlex/deepen-prompt/blob/main/skills/deepen-prompt/"
HEADER = "<!-- GENERATED from skills/deepen-prompt/SKILL.md by scripts/build_adapters.py. Do not edit. -->"
SHORT = "Rewrite a task into a deeper version, not a bigger one (expert practice, raw material, methods, outside check)."


def split_skill(text):
    m = re.match(r"^---\n(.*?)\n---\n(.*)$", text, re.S)
    if not m:
        sys.exit("SKILL.md has no frontmatter")
    return m.group(1), m.group(2).strip() + "\n"


def absolutize(body):
    # Command files live outside the skill folder, so relative reference links must become URLs.
    return re.sub(r"\]\((references/[^)]+)\)", lambda m: "](" + REPO_URL + m.group(1) + ")", body)


def build():
    _, body = split_skill(SKILL.read_text())
    body = absolutize(body)
    md_task = "\n\n## Task to deepen\n\n$ARGUMENTS\n"
    out = {}
    out["adapters/opencode/commands/deepen-prompt.md"] = (
        f"---\ndescription: {SHORT}\n---\n{HEADER}\n\n{body}{md_task}"
    )
    out["adapters/copilot/prompts/deepen-prompt.prompt.md"] = (
        f"---\ndescription: {SHORT}\n---\n{HEADER}\n\n{body}"
        "\n\n## Task to deepen\n\n${input:task:Paste the task or prompt to deepen}\n"
    )
    toml_body = (body + "\n## Task to deepen\n\n{{args}}\n").replace("\\", "\\\\")
    assert "'''" not in toml_body
    out["adapters/gemini/commands/deepen-prompt.toml"] = (
        "# GENERATED from skills/deepen-prompt/SKILL.md by scripts/build_adapters.py. Do not edit.\n"
        f'description = "{SHORT}"\n'
        f"prompt = '''\n{toml_body}'''\n"
    )
    return out


def main():
    check = "--check" in sys.argv
    stale = []
    for rel, content in build().items():
        p = ROOT / rel
        if check:
            if not p.exists() or p.read_text() != content:
                stale.append(rel)
        else:
            p.parent.mkdir(parents=True, exist_ok=True)
            p.write_text(content)
            print("wrote", rel)
    if stale:
        print("Out of sync (run scripts/build_adapters.py):\n  " + "\n  ".join(stale))
        sys.exit(1)
    if check:
        print("adapters in sync")


if __name__ == "__main__":
    main()
