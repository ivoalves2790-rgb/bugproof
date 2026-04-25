// Verify the Husky pre-commit hook will actually fire.
// On Husky 9, `core.hooksPath` points at `.husky/_` which is created by
// `husky` (the prepare script). A fresh worktree without `node_modules`
// has no `.husky/_/`, so git silently skips the hook and `lib/version.ts`
// never gets stamped — leading to a deployed build that advertises the
// wrong version. This script catches that, attempts to self-heal, and
// fails the parent npm script if it can't.

import { existsSync } from "node:fs";
import { execSync } from "node:child_process";

if (process.env.VERCEL || process.env.CI) {
  process.exit(0);
}

const WRAPPER = ".husky/_/pre-commit";

function tryHeal() {
  try {
    execSync("npx --no-install husky", { stdio: "ignore" });
    return existsSync(WRAPPER);
  } catch {
    return false;
  }
}

if (existsSync(WRAPPER)) {
  process.exit(0);
}

if (tryHeal()) {
  console.log("verify-hooks: restored missing .husky/_/ wrapper.");
  process.exit(0);
}

console.error("");
console.error("verify-hooks: pre-commit hook is NOT wired up in this worktree.");
console.error(`  Missing: ${WRAPPER}`);
console.error("  Without it, commits skip the hook silently and lib/version.ts");
console.error("  never gets stamped — the deployed build will advertise a stale");
console.error("  version. Fix by running:");
console.error("");
console.error("      npm install");
console.error("");
process.exit(1);
