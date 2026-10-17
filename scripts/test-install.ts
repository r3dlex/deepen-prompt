/**
 * Exercise an installer in a throwaway HOME / USERPROFILE.
 *   node scripts/test-install.ts --installer sh    (install.sh, macOS/Linux)
 *   node scripts/test-install.ts --installer ps1   (install.ps1 via pwsh, any OS)
 */
import { spawnSync } from "node:child_process";
import { existsSync, lstatSync, mkdtempSync, readdirSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { ROOT } from "./lib.ts";

type Installer = "sh" | "ps1";
type Flag = "all" | "symlink" | "uninstall" | "dry-run";

const arg = process.argv[process.argv.indexOf("--installer") + 1];
if (arg !== "sh" && arg !== "ps1") {
  console.error("usage: test-install.ts --installer sh|ps1");
  process.exit(2);
}
const installer: Installer = arg;

/** Translate one neutral option set into each installer's flag syntax. */
function argv(tools: string[], flags: Flag[]): string[] {
  if (installer === "sh") {
    return [
      join(ROOT, "install.sh"),
      ...(tools.length ? ["--tool", tools.join(",")] : []),
      ...flags.map((f) => `--${f}`),
    ];
  }
  const ps: Record<Flag, string> = { all: "-All", symlink: "-Symlink", uninstall: "-Uninstall", "dry-run": "-DryRun" };
  return [
    "-NoProfile",
    "-NonInteractive",
    "-File",
    join(ROOT, "install.ps1"),
    ...(tools.length ? ["-Tool", tools.join(",")] : []),
    ...flags.map((f) => ps[f]),
  ];
}

interface RunResult {
  status: number | null;
  stdout: string;
}

function run(home: string, tools: string[] = [], flags: Flag[] = []): RunResult {
  const cmd = installer === "sh" ? "bash" : "pwsh";
  const r = spawnSync(cmd, argv(tools, flags), {
    env: { ...process.env, HOME: home, USERPROFILE: home },
    encoding: "utf8",
  });
  if (r.error) throw r.error;
  return { status: r.status, stdout: r.stdout };
}

function fail(msg: string): never {
  console.error(`FAIL (${installer}): ${msg}`);
  process.exit(1);
}
function mustRun(home: string, tools: string[] = [], flags: Flag[] = []): void {
  const r = run(home, tools, flags);
  if (r.status !== 0) fail(`exit ${r.status} for ${tools.join(",")} ${flags.join(" ")}\n${r.stdout}`);
}
const isFile = (p: string): boolean => existsSync(p) && lstatSync(p).isFile();
const isLink = (p: string): boolean => {
  try {
    return lstatSync(p).isSymbolicLink();
  } catch {
    return false;
  }
};
function findAny(dir: string, needle: string): string | null {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.name.startsWith(needle)) return p;
    if (e.isDirectory() && !e.isSymbolicLink()) {
      const hit = findAny(p, needle);
      if (hit) return hit;
    }
  }
  return null;
}

const T = mkdtempSync(join(tmpdir(), "deepen-install-"));
try {
  mustRun(T);
  if (!isFile(join(T, ".claude/skills/deepen-prompt/SKILL.md"))) fail("default: claude");
  if (!isFile(join(T, ".agents/skills/deepen-prompt/SKILL.md"))) fail("default: agents");
  if (!isFile(join(T, ".agents/skills/deepen-prompt/references/examples.md"))) fail("references copied");

  mustRun(T, [], ["all"]);
  for (const p of [
    ".config/opencode/skills/deepen-prompt/SKILL.md",
    ".config/opencode/commands/deepen-prompt.md",
    ".copilot/skills/deepen-prompt/SKILL.md",
    ".cursor/skills/deepen-prompt/SKILL.md",
    ".gemini/skills/deepen-prompt/SKILL.md",
    ".gemini/commands/deepen-prompt.toml",
    ".gemini/config/skills/deepen-prompt/SKILL.md",
    ".gemini/antigravity-cli/skills/deepen-prompt/SKILL.md",
  ]) {
    if (!isFile(join(T, p))) fail(`--all: ${p}`);
  }

  mustRun(T, [], ["all", "uninstall"]);
  const left = findAny(T, "deepen-prompt");
  if (left) fail(`uninstall left ${left}`);

  // Symlinks need Developer Mode on Windows; the installer falls back to a junction/copy there.
  mustRun(T, ["cursor", "gemini"], ["symlink"]);
  if (!isFile(join(T, ".cursor/skills/deepen-prompt/SKILL.md"))) fail("symlink cursor reachable");
  if (process.platform !== "win32" && !isLink(join(T, ".cursor/skills/deepen-prompt"))) fail("symlink cursor");
  if (existsSync(join(T, ".claude/skills/deepen-prompt"))) fail("--tool must not install claude");

  mustRun(T, ["cursor"]); // re-install over a link must replace it with a copy, not write through it
  if (isLink(join(T, ".cursor/skills/deepen-prompt"))) fail("overwrite symlink");
  if (!isFile(join(ROOT, "skills/deepen-prompt/SKILL.md"))) fail("source skill was damaged");
  mustRun(T, ["cursor", "gemini"], ["uninstall"]);

  const dry = join(T, "dry");
  const r = run(dry, ["claude"], ["dry-run"]);
  if (r.status !== 0 || existsSync(dry)) fail("dry-run wrote files");
  if (!/copy|cp -R/.test(r.stdout)) fail(`dry-run output: ${r.stdout}`);

  if (run(T, ["nope"]).status === 0) fail("unknown tool accepted");
  console.log(`${installer === "sh" ? "install.sh" : "install.ps1"}: all tests passed`);
} finally {
  rmSync(T, { recursive: true, force: true });
}
