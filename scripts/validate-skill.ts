/** Validate every skills/<name>/SKILL.md against the Agent Skills spec (agentskills.io/specification). */
import { existsSync, readdirSync } from "node:fs";
import { join, relative } from "node:path";
import { parse as parseYaml } from "yaml";
import { ROOT, readText, splitSkill } from "./lib.ts";

const NAME_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const ALLOWED = new Set(["name", "description", "license", "compatibility", "metadata", "allowed-tools"]);
const errors: string[] = [];

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

const skillsRoot = join(ROOT, "skills");
const skills = readdirSync(skillsRoot, { withFileTypes: true })
  .filter((d) => d.isDirectory() && existsSync(join(skillsRoot, d.name, "SKILL.md")))
  .map((d) => ({ dir: d.name, path: join(skillsRoot, d.name, "SKILL.md") }));
if (skills.length === 0) errors.push("no skills/*/SKILL.md found");

for (const { dir, path } of skills) {
  const rel = relative(ROOT, path);
  const parts = splitSkill(readText(path));
  if (!parts) {
    errors.push(`${rel}: missing YAML frontmatter`);
    continue;
  }
  const fm: unknown = parseYaml(parts.frontmatter);
  if (!isRecord(fm)) {
    errors.push(`${rel}: frontmatter is not a mapping`);
    continue;
  }
  for (const key of Object.keys(fm)) {
    if (!ALLOWED.has(key)) errors.push(`${rel}: unknown top-level field '${key}' (put it under metadata)`);
  }
  const name = fm["name"];
  if (typeof name !== "string" || name.length < 1 || name.length > 64 || !NAME_RE.test(name)) {
    errors.push(`${rel}: invalid name ${JSON.stringify(name)}`);
  } else if (name !== dir) {
    errors.push(`${rel}: name '${name}' must match directory '${dir}'`);
  }
  const desc = fm["description"];
  if (typeof desc !== "string" || desc.length < 1 || desc.length > 1024) {
    errors.push(`${rel}: description must be 1-1024 chars`);
  } else if (!desc.toLowerCase().includes("use when")) {
    errors.push(`${rel}: description should say when to use the skill ('Use when ...')`);
  }
  const compat = fm["compatibility"];
  if (compat !== undefined && (typeof compat !== "string" || compat.length < 1 || compat.length > 500)) {
    errors.push(`${rel}: compatibility must be a 1-500 char string`);
  }
  const md = fm["metadata"];
  if (md !== undefined && (!isRecord(md) || !Object.values(md).every((v) => typeof v === "string"))) {
    errors.push(`${rel}: metadata must be a string-to-string map`);
  }
  if (parts.body.split("\n").length > 500) errors.push(`${rel}: body over 500 lines`);
  for (const m of parts.body.matchAll(/\]\(((?:references|scripts|assets)\/[^)]+)\)/g)) {
    const ref = m[1];
    if (ref !== undefined && !existsSync(join(ROOT, "skills", dir, ref))) errors.push(`${rel}: broken link ${ref}`);
  }
}

const plugin: unknown = JSON.parse(readText(join(ROOT, ".claude-plugin/plugin.json")));
const market: unknown = JSON.parse(readText(join(ROOT, ".claude-plugin/marketplace.json")));
if (!isRecord(plugin) || !isRecord(market)) {
  errors.push("plugin manifests must be JSON objects");
} else {
  for (const key of ["name", "owner", "plugins"]) {
    if (!(key in market)) errors.push(`marketplace.json: missing '${key}'`);
  }
  const entries: unknown[] = Array.isArray(market["plugins"]) ? market["plugins"] : [];
  const names = entries.filter(isRecord).map((p) => p["name"]);
  if (!names.includes(plugin["name"])) errors.push("marketplace.json entry name must equal plugin.json name");
}

if (errors.length > 0) {
  for (const e of errors) console.error(`ERROR: ${e}`);
  process.exit(1);
}
console.log(`OK: ${skills.length} skill(s) valid, plugin manifests consistent`);
