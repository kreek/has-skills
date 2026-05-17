import { describe, expect, it, vi } from "vitest";

vi.mock("../src/proof/index.js", () => ({
  default: vi.fn(),
}));
vi.mock("../extensions/self-review-guard.js", () => ({
  default: vi.fn(),
}));

import agentBoosterPack from "../src/index.ts";
import proofExtension from "../src/proof/index.js";
import selfReviewGuard from "../extensions/self-review-guard.js";

describe("agent booster pack Pi extension", () => {
  it("registers only proof and self-review runtimes", () => {
    const pi = {};

    agentBoosterPack(pi);

    expect(proofExtension).toHaveBeenCalledWith(pi);
    expect(selfReviewGuard).toHaveBeenCalledWith(pi);
  });
});
