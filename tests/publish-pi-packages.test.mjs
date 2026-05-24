import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";

import { cleanupTempDir, makeTempDir, ROOT, run, shellQuote, writeExecutable } from "./helpers.mjs";

const SCRIPT = join(ROOT, "scripts/publish-pi-packages.sh");
const VERSION = "5.1.0";

let tmp;

function writePackage(root) {
  const path = join(root, "consult");
  mkdirSync(path, { recursive: true });
  writeFileSync(join(path, "package.json"), JSON.stringify({ name: "consult", version: VERSION }), "utf8");
}

function makeRepo({ dirty = false } = {}) {
  const root = join(tmp, "repo");
  mkdirSync(root);
  writePackage(root);

  const binDir = join(tmp, "bin");
  mkdirSync(binDir);
  const log = join(tmp, "commands.log");
  const publishedPath = shellQuote(join(tmp, "published.txt"));
  const logPath = shellQuote(log);
  const rootPath = shellQuote(root);
  const dirtyCommand = dirty ? "printf 'dirty\\n'" : ":";

  writeExecutable(
    join(binDir, "git"),
    `#!/usr/bin/env bash
set -euo pipefail
printf 'git %s\n' "$*" >> ${logPath}
case "$*" in
  'rev-parse --show-toplevel') printf '%s\n' ${rootPath} ;;
  'status --porcelain') ${dirtyCommand} ;;
  'describe --tags --match v[0-9]*.[0-9]*.[0-9]* --abbrev=0') printf 'v5.1.0\n' ;;
  *) exit 0 ;;
esac
`,
  );
  writeExecutable(
    join(binDir, "npm"),
    `#!/usr/bin/env bash
set -euo pipefail
printf 'npm %s\n' "$*" >> ${logPath}
case "$1" in
  whoami) printf 'tester\n' ;;
  view)
    grep -Fxq "$2" ${publishedPath} 2>/dev/null && printf '%s\n' "\${2##*@}" || exit 1 ;;
  publish)
    node -e 'const fs = require("fs"); const pkg = JSON.parse(fs.readFileSync(process.argv[1] + "/package.json", "utf8")); console.log(pkg.name + "@" + pkg.version);' "$2" >> ${publishedPath}
    printf 'published %s\n' "$2" ;;
  *) exit 0 ;;
esac
`,
  );
  return root;
}

function runScript(root, ...args) {
  return run("bash", [SCRIPT, ...args], {
    cwd: root,
    env: { ...process.env, PATH: `${join(tmp, "bin")}:${process.env.PATH}` },
  });
}

function commandLog() {
  return readFileSync(join(tmp, "commands.log"), "utf8");
}

describe("Pi package npm publish script", () => {
  afterEach(() => {
    if (tmp) cleanupTempDir(tmp);
    tmp = undefined;
  });

  it("publishes only consult", () => {
    tmp = makeTempDir();
    const root = makeRepo();

    const result = runScript(root);

    expect(result.status).toBe(0);
    const publishLines = commandLog()
      .split(/\r?\n/)
      .filter((line) => line.startsWith("npm publish"));
    expect(publishLines).toEqual(["npm publish ./consult --access public"]);
  });

  it("dry-run reports the single package without publishing", () => {
    tmp = makeTempDir();
    const root = makeRepo();

    const result = runScript(root, "--dry-run");

    expect(result.status).toBe(0);
    expect(result.stdout).toContain("would publish consult@5.1.0");
    expect(commandLog()).not.toContain("npm publish");
  });

  it("waits until the published version is visible", () => {
    tmp = makeTempDir();
    const root = makeRepo();

    const result = runScript(root);

    expect(result.status).toBe(0);
    const lines = commandLog().split(/\r?\n/);
    const publish = lines.indexOf("npm publish ./consult --access public");
    const confirm = lines.indexOf("npm view consult@5.1.0 version", publish + 1);
    expect(publish).toBeLessThan(confirm);
  });

  it("refuses dirty working trees before npm publish", () => {
    tmp = makeTempDir();
    const root = makeRepo({ dirty: true });

    const result = runScript(root);

    expect(result.status).not.toBe(0);
    expect(result.stderr).toContain("working tree is not clean");
    expect(commandLog()).not.toContain("npm publish");
  });
});
