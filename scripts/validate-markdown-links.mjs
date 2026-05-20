#!/usr/bin/env node

import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync, spawnSync } from "node:child_process";

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const remarkBin = join(repoRoot, "node_modules", ".bin", process.platform === "win32" ? "remark.cmd" : "remark");

function trackedMarkdownFiles() {
  const output = execFileSync("git", ["ls-files", "-z", "--", "*.md"], {
    cwd: repoRoot,
    encoding: "utf8",
  });

  return output.split("\0").filter((file) => file && existsSync(join(repoRoot, file)));
}

const files = trackedMarkdownFiles();

if (files.length === 0) {
  console.log("No tracked Markdown files to validate.");
  process.exit(0);
}

const result = spawnSync(
  remarkBin,
  ["--use", "remark-validate-links", "--frail", "--quiet", ...files],
  {
    cwd: repoRoot,
    stdio: "inherit",
  },
);

if (result.error) {
  console.error(result.error.message);
  process.exit(1);
}

process.exit(result.status ?? 1);
