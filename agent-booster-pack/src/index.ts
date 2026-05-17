import proofExtension from "./proof/index.js";
import selfReviewGuard from "../extensions/self-review-guard.js";

export default function agentBoosterPack(pi) {
  proofExtension(pi);
  selfReviewGuard(pi);
}
