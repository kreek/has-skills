import { join } from "node:path";
import { describe, expect, it } from "vitest";

import { readJson, ROOT } from "./helpers.mjs";

const META_PACKAGE = join(ROOT, "agent-booster-pack");

function readPackage(packageDir) {
  return readJson(join(packageDir, "package.json"));
}

describe("Pi single-package layout", () => {
  it("makes the repo root installable from GitHub with only the bundled HAS package surface", () => {
    const pkg = readPackage(ROOT);

    expect(pkg.private).toBe(true);
    expect(pkg.name).toBe("agent-booster-pack-github");
    expect(pkg.pi.extensions).toEqual(["./agent-booster-pack/src/index.ts"]);
    expect(pkg.pi.skills).toEqual(["./agent-booster-pack/skills"]);
    expect(pkg.files).toEqual([
      "agent-booster-pack/src",
      "agent-booster-pack/extensions",
      "agent-booster-pack/skills",
      "agent-booster-pack/README.md",
      "agent-booster-pack/LICENSE",
      "README.md",
      "LICENSE",
    ]);
    expect(pkg.files.some((path) => path.includes("node_modules"))).toBe(false);
  });

  it("publishes agent-booster-pack without local sibling package dependencies", () => {
    const pkg = readPackage(META_PACKAGE);

    expect(pkg.pi.extensions).toEqual(["./src/index.ts"]);
    expect(pkg.pi.skills).toEqual(["./skills"]);
    expect(pkg.dependencies).toBeUndefined();
    expect(pkg.bundledDependencies).toBeUndefined();
    expect(pkg.files).toEqual(["src", "extensions", "skills", "README.md", "LICENSE"]);
  });

  it("uses a single Pi extension entrypoint for packaged runtimes", () => {
    const pkg = readPackage(META_PACKAGE);

    expect(pkg.pi.extensions).toEqual(["./src/index.ts"]);
    expect(pkg.scripts.test).toBe("vitest run test");
  });
});
