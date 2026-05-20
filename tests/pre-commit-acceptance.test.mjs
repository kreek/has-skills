import { mkdirSync } from "node:fs";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";

import { cleanupTempDir, makeTempDir, ROOT, run } from "./helpers.mjs";
import { formatCommand, selectChecks } from "../scripts/pre-commit-acceptance.mjs";

const SCRIPT = join(ROOT, "scripts/pre-commit-acceptance.mjs");
let tmp;

function commandStrings(paths) {
  return selectChecks(paths).map((check) => formatCommand(check.command));
}

function runScript(...args) {
  return run("node", [SCRIPT, ...args], { cwd: ROOT });
}

describe("pre-commit acceptance command selection", () => {
  it("always checks the staged diff", () => {
    expect(commandStrings(["README.md"])).toContain("git diff --cached --check");
  });

  it("checks Markdown when Markdown files are staged", () => {
    expect(commandStrings(["README.md"])).toContain("pnpm run check:links");
  });

  it("keeps non-Pi Vitest suites out of pre-commit", () => {
    const scriptCommands = commandStrings(["scripts/pre-commit-acceptance.mjs"]);

    expect(scriptCommands).not.toContain("pnpm exec vitest run tests/abp-header.test.mjs tests/pi-install-local-make-target.test.mjs tests/pi-local-yeet-command.test.mjs tests/pi-meta-package-local-dependencies.test.mjs tests/pi-sibling-skill-bundles.test.mjs tests/publish-pi-packages.test.mjs");
    expect(scriptCommands).not.toContain("pnpm --dir agent-booster-pack test");
  });

  it("checks Pi package and extension changes", () => {
    const commands = commandStrings(["agent-booster-pack/extensions/self-review-guard.ts"]);

    expect(commands).toContain("pnpm exec vitest run tests/abp-header.test.mjs tests/pi-install-local-make-target.test.mjs tests/pi-local-yeet-command.test.mjs tests/pi-meta-package-local-dependencies.test.mjs tests/pi-sibling-skill-bundles.test.mjs tests/publish-pi-packages.test.mjs");
    expect(commands).toContain("pnpm --dir agent-booster-pack test");
  });
});

describe("pre-commit acceptance CLI", () => {
  afterEach(() => {
    if (tmp) cleanupTempDir(tmp);
    tmp = undefined;
  });

  it("allows dry-run checks on main", () => {
    tmp = makeTempDir();
    run("git", ["init", "-b", "main"], { cwd: tmp });

    const result = runScript("--repo-root", tmp, "--dry-run");

    expect(result.status).toBe(0);
    expect(result.stdout).toContain("No staged files; nothing to validate.");
  });

  it("reports no staged files on topic branches", () => {
    tmp = makeTempDir();
    mkdirSync(join(tmp, "repo"), { recursive: true });
    run("git", ["init", "-b", "chore/test"], { cwd: tmp });

    const result = runScript("--repo-root", tmp, "--dry-run");

    expect(result.status).toBe(0);
    expect(result.stdout).toContain("No staged files; nothing to validate.");
  });
});
