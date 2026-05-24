import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { describe, expect, it } from "vitest";

import { ROOT } from "./helpers.mjs";

const CANONICAL_SKILLS = join(ROOT, "agents/.agents/skills");
const PACKAGE_SKILLS = join(ROOT, "consult/skills");

function walkRelativeFiles(root, prefix = "") {
  const files = [];
  for (const name of readdirSync(join(root, prefix)).sort()) {
    const rel = prefix ? join(prefix, name) : name;
    const path = join(root, rel);
    if (statSync(path).isDirectory()) files.push(...walkRelativeFiles(root, rel));
    else files.push(rel);
  }
  return files;
}

function diffReport(left, right) {
  const diffs = [];
  const leftFiles = new Set(walkRelativeFiles(left));
  const rightFiles = new Set(existsSync(right) ? walkRelativeFiles(right) : []);

  for (const file of leftFiles) {
    if (!rightFiles.has(file)) diffs.push(`only in package copy: ${file}`);
    else if (!readFileSync(join(left, file)).equals(readFileSync(join(right, file)))) {
      diffs.push(`content differs: ${file}`);
    }
  }
  for (const file of rightFiles) {
    if (!leftFiles.has(file)) diffs.push(`only in canonical: ${file}`);
  }
  return diffs;
}

describe("Pi packaged skill bundle", () => {
  it("keeps the bundled skills byte-identical to the canonical source", () => {
    const problems = [];
    for (const name of readdirSync(PACKAGE_SKILLS).sort()) {
      const bundledDir = join(PACKAGE_SKILLS, name);
      if (!statSync(bundledDir).isDirectory()) continue;

      const canonicalDir = join(CANONICAL_SKILLS, name);
      if (!existsSync(canonicalDir) || !statSync(canonicalDir).isDirectory()) {
        problems.push(`${relative(ROOT, bundledDir)}: bundled skill has no canonical source at ${relative(ROOT, canonicalDir)}`);
        continue;
      }

      for (const detail of diffReport(bundledDir, canonicalDir)) {
        problems.push(`${relative(ROOT, bundledDir)}: ${detail}`);
      }
    }

    expect(problems).toEqual([]);
  });
});
