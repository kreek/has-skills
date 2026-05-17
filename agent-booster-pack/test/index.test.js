import { describe, expect, it, vi } from "vitest";

vi.mock("../src/proof/index.js", () => ({
  default: vi.fn(),
}));
vi.mock("../extensions/self-review-guard.js", () => ({
  default: vi.fn(),
}));
vi.mock("../extensions/openai-codex-fast-mode.js", () => ({
  default: vi.fn(),
}));
vi.mock("../extensions/abp-header.js", () => ({
  default: vi.fn(),
}));

import agentBoosterPack from "../src/index.ts";
import proofExtension from "../src/proof/index.js";
import selfReviewGuard from "../extensions/self-review-guard.js";
import openaiCodexFastMode from "../extensions/openai-codex-fast-mode.js";
import abpHeader from "../extensions/abp-header.js";

describe("agent booster pack Pi extension", () => {
  it("registers proof, self-review, OpenAI Codex fast mode, and startup header runtimes", () => {
    const pi = {};

    agentBoosterPack(pi);

    expect(proofExtension).toHaveBeenCalledWith(pi);
    expect(selfReviewGuard).toHaveBeenCalledWith(pi);
    expect(openaiCodexFastMode).toHaveBeenCalledWith(pi);
    expect(abpHeader).toHaveBeenCalledWith(pi);
  });
});
