import proofExtension from "./proof/index.js";
import selfReviewGuard from "../extensions/self-review-guard.js";
import openaiCodexFastMode from "../extensions/openai-codex-fast-mode.js";

export default function agentBoosterPack(pi) {
  proofExtension(pi);
  selfReviewGuard(pi);
  openaiCodexFastMode(pi);
}
