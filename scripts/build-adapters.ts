/**
 * Build per-tool command/prompt adapters from the canonical skills/deepen-prompt/SKILL.md.
 *   node scripts/build-adapters.ts          write adapters/
 *   node scripts/build-adapters.ts --check  exit 1 if adapters/ is out of sync
 */
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { parse as parseToml } from "smol-toml";
import { ROOT, SKILL_PATH, readText, splitSkill } from "./lib.ts";

const REPO_URL = "https://github.com/r3dlex/deepen-prompt/blob/main/skills/deepen-prompt/";
const HEADER = "<!-- GENERATED from skills/deepen-prompt/SKILL.md by scripts/build-adapters.ts. Do not edit. -->";
const SHORT =
  "Rewrite a task into a deeper version, not a bigger one (expert practice, raw material, methods, outside check).";

/** Command files live outside the skill folder, so relative reference links must become URLs. */
function absolutize(body: string): string {
  return body.replace(/\]\((references\/[^)]+)\)/g, (_m, rel: string) => `](${REPO_URL}${rel})`);
}

export function buildAdapters(): Map<string, string> {
  const parts = splitSkill(readText(SKILL_PATH));
  if (!parts) throw new Error("SKILL.md has no frontmatter");
  const body = absolutize(parts.body.trim()) + "\n";
  const out = new Map<string, string>();

  out.set(
    "adapters/opencode/commands/deepen-prompt.md",
    `---\ndescription: ${SHORT}\n---\n${HEADER}\n\n${body}\n\n## Task to deepen\n\n$ARGUMENTS\n`,
  );
  out.set(
    "adapters/copilot/prompts/deepen-prompt.prompt.md",
    `---\ndescription: ${SHORT}\n---\n${HEADER}\n\n${body}\n\n## Task to deepen\n\n\${input:task:Paste the task or prompt to deepen}\n`,
  );

  const tomlBody = (body + "\n## Task to deepen\n\n{{args}}\n").replaceAll("\\", "\\\\");
  if (tomlBody.includes("'''")) throw new Error("SKILL.md body must not contain ''' (breaks TOML)");
  const toml =
    "# GENERATED from skills/deepen-prompt/SKILL.md by scripts/build-adapters.ts. Do not edit.\n" +
    `description = "${SHORT}"\n` +
    `prompt = '''\n${tomlBody}'''\n`;
  const parsed = parseToml(toml);
  if (typeof parsed["prompt"] !== "string" || typeof parsed["description"] !== "string") {
    throw new Error("generated Gemini TOML is missing prompt/description");
  }
  out.set("adapters/gemini/commands/deepen-prompt.toml", toml);
  return out;
}

function main(): void {
  const check = process.argv.includes("--check");
  const stale: string[] = [];
  for (const [rel, content] of buildAdapters()) {
    const path = join(ROOT, rel);
    if (check) {
      if (!existsSync(path) || readText(path).replace(/\r\n/g, "\n") !== content) stale.push(rel);
    } else {
      mkdirSync(dirname(path), { recursive: true });
      writeFileSync(path, content);
      console.log(`wrote ${rel}`);
    }
  }
  if (stale.length > 0) {
    console.error(`Out of sync (run npm run build):\n  ${stale.join("\n  ")}`);
    process.exit(1);
  }
  if (check) console.log("adapters in sync");
}

main();
