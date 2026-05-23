import proofExtension from "./proof/index.js";
import selfReviewGuard from "../extensions/self-review-guard.ts";
import openaiCodexFastMode from "../extensions/openai-codex-fast-mode.ts";
import hasHeader from "../extensions/has-header.ts";

export default function agentBoosterPack(pi) {
  proofExtension(pi);
  selfReviewGuard(pi);
  openaiCodexFastMode(pi);
  hasHeader(pi);
}
