#!/usr/bin/env python3
"""Validate every skills/*/SKILL.md against the Agent Skills spec (agentskills.io/specification)."""
import json
import re
import sys
from pathlib import Path

import yaml

ROOT = Path(__file__).resolve().parent.parent
NAME_RE = re.compile(r"^[a-z0-9]+(-[a-z0-9]+)*$")
ALLOWED = {"name", "description", "license", "compatibility", "metadata", "allowed-tools"}
errors = []

skills = sorted((ROOT / "skills").glob("*/SKILL.md"))
if not skills:
    errors.append("no skills/*/SKILL.md found")
for path in skills:
    text = path.read_text()
    m = re.match(r"^---\n(.*?)\n---\n(.*)$", text, re.S)
    rel = path.relative_to(ROOT)
    if not m:
        errors.append(f"{rel}: missing YAML frontmatter")
        continue
    fm = yaml.safe_load(m.group(1)) or {}
    body = m.group(2)
    for k in fm:
        if k not in ALLOWED:
            errors.append(f"{rel}: unknown top-level field '{k}' (put it under metadata)")
    name = fm.get("name")
    if not isinstance(name, str) or not (1 <= len(name) <= 64) or not NAME_RE.match(name):
        errors.append(f"{rel}: invalid name {name!r}")
    elif name != path.parent.name:
        errors.append(f"{rel}: name '{name}' must match directory '{path.parent.name}'")
    desc = fm.get("description")
    if not isinstance(desc, str) or not (1 <= len(desc) <= 1024):
        errors.append(f"{rel}: description must be 1-1024 chars")
    elif "use when" not in desc.lower():
        errors.append(f"{rel}: description should say when to use the skill ('Use when ...')")
    if "compatibility" in fm and not (1 <= len(str(fm["compatibility"])) <= 500):
        errors.append(f"{rel}: compatibility must be 1-500 chars")
    md = fm.get("metadata", {})
    if not isinstance(md, dict) or not all(isinstance(k, str) and isinstance(v, str) for k, v in md.items()):
        errors.append(f"{rel}: metadata must be a string-to-string map")
    if len(body.splitlines()) > 500:
        errors.append(f"{rel}: body over 500 lines")
    for ref in re.findall(r"\]\(((?:references|scripts|assets)/[^)]+)\)", body):
        if not (path.parent / ref).exists():
            errors.append(f"{rel}: broken link {ref}")

# Claude Code plugin manifests
plugin = json.loads((ROOT / ".claude-plugin/plugin.json").read_text())
market = json.loads((ROOT / ".claude-plugin/marketplace.json").read_text())
for key in ("name", "owner", "plugins"):
    if key not in market:
        errors.append(f"marketplace.json: missing '{key}'")
names = [p.get("name") for p in market.get("plugins", [])]
if plugin.get("name") not in names:
    errors.append("marketplace.json entry name must equal plugin.json name")

if errors:
    print("\n".join("ERROR: " + e for e in errors))
    sys.exit(1)
print(f"OK: {len(skills)} skill(s) valid, plugin manifests consistent")
