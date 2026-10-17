import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

export const ROOT: string = join(dirname(fileURLToPath(import.meta.url)), "..");
export const SKILL_NAME = "deepen-prompt";
export const SKILL_DIR: string = join(ROOT, "skills", SKILL_NAME);
export const SKILL_PATH: string = join(SKILL_DIR, "SKILL.md");

export interface SkillParts {
  frontmatter: string;
  body: string;
}

/** Split a SKILL.md into its YAML frontmatter and Markdown body. Returns null if malformed. */
export function splitSkill(text: string): SkillParts | null {
  const m = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/.exec(text.replace(/\r\n/g, "\n"));
  if (!m || m[1] === undefined || m[2] === undefined) return null;
  return { frontmatter: m[1], body: m[2] };
}

export function readText(path: string): string {
  return readFileSync(path, "utf8");
}
