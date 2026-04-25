// Verify the Husky pre-commit hook will actually fire in this worktree.
//
// Two failure modes have hit this repo before:
//   1. Fresh worktree with no node_modules → no .husky/_/ wrapper exists
//      → git silently skips the hook → lib/version.ts not stamped.
//   2. `husky` writes an ABSOLUTE path into the per-worktree git config
//      (.git/worktrees/<name>/config.worktree) pointing at the main repo's
//      .husky/_/. The shared .git/config has the correct relative path,
//      but the worktree-scoped value wins → hooks resolve to a directory
//      that doesn't exist on whatever branch the main repo is checked out
//      to → silent skip again.
//
// Both modes ship a stale APP_VERSION. This script detects them, attempts
// to self-heal, and exits 1 with a clear message if it can't.

import { existsSync } from "node:fs";
import { execSync } from "node:child_process";
import { isAbsolute, resolve } from "node:path";

if (process.env.VERCEL || process.env.CI) {
  process.exit(0);
}

function sh(cmd) {
  return execSync(cmd, { stdio: ["ignore", "pipe", "ignore"] }).toString().trim();
}

function fixAbsoluteHooksPath() {
  let configured;
  try {
    configured = sh("git config --get core.hooksPath");
  } catch {
    return false;
  }
  if (!isAbsolute(configured)) return false;
  const resolvedHere = resolve(".husky/_");
  if (configured === resolvedHere && existsSync(configured)) return false;
  try {
    execSync("git config --worktree --unset core.hooksPath", { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

function tryInstallWrapper() {
  try {
    execSync("npx --no-install husky", { stdio: "ignore" });
    return existsSync(".husky/_/pre-commit");
  } catch {
    return false;
  }
}

const fixedConfig = fixAbsoluteHooksPath();
if (fixedConfig) {
  console.log("verify-hooks: cleared bad absolute core.hooksPath in worktree config.");
}

if (!existsSync(".husky/_/pre-commit") && !tryInstallWrapper()) {
  console.error("");
  console.error("verify-hooks: pre-commit hook is NOT wired up in this worktree.");
  console.error("  Missing: .husky/_/pre-commit");
  console.error("  Without it, commits skip the hook silently and lib/version.ts");
  console.error("  never gets stamped — the deployed build will advertise a stale");
  console.error("  version. Fix by running:");
  console.error("");
  console.error("      npm install");
  console.error("");
  process.exit(1);
}

let resolved;
try {
  resolved = sh("git config --get core.hooksPath");
} catch {
  resolved = "(unset)";
}
const expected = resolve(".husky/_");
const resolvedAbs = isAbsolute(resolved) ? resolved : resolve(resolved);
if (resolvedAbs !== expected) {
  console.error("");
  console.error("verify-hooks: core.hooksPath does not point at this worktree's .husky/_/.");
  console.error(`  configured: ${resolved}`);
  console.error(`  expected:   ${expected} (or relative ".husky/_")`);
  console.error("  Fix:");
  console.error("      git config --worktree --unset core.hooksPath  # if set per-worktree");
  console.error("      git config core.hooksPath .husky/_            # restore shared default");
  console.error("");
  process.exit(1);
}
