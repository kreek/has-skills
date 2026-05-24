import { isProductionFile } from "../src/classify.mjs";
import { REMINDER, alreadyAcknowledged } from "../src/self-review-core.mjs";

const CHANGE_TOOL_NAMES = new Set(["edit", "write"]);
export const SELF_REVIEW_MARKER = "Consult self-review";
const SELF_REVIEW_MESSAGE = "consult-self-review";
const MUTATING_BASH_PATTERN = /(\btee\b|\bpython\b[\s\S]*\bopen\([^)]*['"]w|\bnode\b[\s\S]*writeFile|\bperl\s+-pi\b|\bsed\s+-i\b|\bmv\b|\bcp\b|\btouch\b|\bchmod\b|\bgit\s+apply\b|\bpatch\b)/i;

function messageText(value) {
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return value.map((item) => (typeof item?.text === "string" ? item.text : "")).join("\n");
  return "";
}

function changedPath(toolCall) {
  return String(toolCall?.arguments?.path ?? toolCall?.input?.path ?? "");
}

function normalizeMessages(values) {
  return values.map((value) => value?.message ?? value).filter(Boolean);
}

function latestUserScopedMessages(entries) {
  const messages = normalizeMessages(entries);
  for (let index = messages.length - 1; index >= 0; index -= 1) {
    if (messages[index]?.role === "user") return messages.slice(index + 1);
  }
  return messages;
}

function isToolCall(item) {
  return item?.type === "toolCall";
}

function hasToolCall(message) {
  return Array.isArray(message?.content) && message.content.some(isToolCall);
}

function isProductionPath(path) {
  return isProductionFile(path);
}

function isProductionChangeToolCall(item) {
  if (!isToolCall(item)) return false;
  if (CHANGE_TOOL_NAMES.has(item.name)) return isProductionPath(changedPath(item));
  if (item.name !== "bash") return false;

  const command = typeof item?.arguments?.command === "string" ? item.arguments.command : "";
  return MUTATING_BASH_PATTERN.test(command);
}

function hasProductionChanges(messages) {
  return normalizeMessages(messages)
    .filter((message) => message?.role === "assistant" && Array.isArray(message.content))
    .flatMap((message) => message.content)
    .some(isProductionChangeToolCall);
}

function lastAssistantText(messages) {
  const normalized = normalizeMessages(messages);
  for (let index = normalized.length - 1; index >= 0; index -= 1) {
    const message = normalized[index];
    if (message?.role !== "assistant") continue;

    const text = messageText(message.content).trim();
    if (text) return text;
  }
  return "";
}


function isSelfReviewCorrectionTurn(messages) {
  return normalizeMessages(messages).some((message) => messageText(message.content).includes(SELF_REVIEW_MARKER));
}

export function shouldRequestSelfReview(messages) {
  return selfReviewPromptFor(messages) !== null;
}

export function selfReviewPromptForSessionEntries(entries) {
  return selfReviewPromptFor(latestUserScopedMessages(entries));
}

export function selfReviewPromptFor(messages) {
  if (!Array.isArray(messages) || messages.length === 0) return null;
  if (isSelfReviewCorrectionTurn(messages)) return null;
  if (!hasProductionChanges(messages)) return null;

  const finalText = lastAssistantText(messages);
  if (alreadyAcknowledged(finalText)) return null;

  return makeSelfReviewPrompt(finalText);
}

export function makeSelfReviewPrompt(finalText = "") {
  const previous = String(finalText ?? "").trim();
  return previous ? `${REMINDER}\n\nPrevious final response:\n${previous}` : REMINDER;
}

function entryFromMessage(message) {
  return { type: "message", message };
}

function genericSelfReviewPrompt(args) {
  const intent = String(args ?? "").trim();
  return [REMINDER, intent ? `Focus: ${intent}` : ""].filter(Boolean).join("\n\n");
}

export default function selfReviewGuard(pi) {
  pi.registerCommand("consult:self-review", {
    description: "Run the Consult self-review gate",
    handler: async (args, ctx) => {
      const branchEntries = ctx.sessionManager?.getBranch?.() ?? [];
      const prompt = selfReviewPromptForSessionEntries(branchEntries) ?? genericSelfReviewPrompt(args);
      await pi.sendUserMessage(prompt);
    },
  });

  pi.on("message_end", async (event, ctx) => {
    if (event.message.role !== "assistant") return;
    if (hasToolCall(event.message)) return;

    const branchEntries = ctx.sessionManager?.getBranch?.() ?? [];
    const prompt = selfReviewPromptForSessionEntries([...branchEntries, entryFromMessage(event.message)]);
    if (!prompt) return;

    await pi.sendMessage(
      {
        customType: SELF_REVIEW_MESSAGE,
        content: prompt,
        display: false,
      },
      { triggerTurn: true, deliverAs: "followUp" },
    );
  });
}
