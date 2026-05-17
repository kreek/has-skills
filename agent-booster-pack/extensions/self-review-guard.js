const CHANGE_TOOL_NAMES = new Set(["edit", "write"]);
export const SELF_REVIEW_MARKER = "ABP self-review";
const SELF_REVIEW_MESSAGE = "abp-self-review";
const MUTATING_BASH_PATTERN = /(\btee\b|\bpython\b[\s\S]*\bopen\([^)]*['"]w|\bnode\b[\s\S]*writeFile|\bperl\s+-pi\b|\bsed\s+-i\b|\bmv\b|\bcp\b|\btouch\b|\bchmod\b|\bgit\s+apply\b|\bpatch\b)/i;
const PATH_SEGMENT_START = String.raw`(?:^|[\\/])`;
const TEST_FILE_RE = new RegExp(
  [
    String.raw`\.test\.`,
    String.raw`\.spec\.`,
    String.raw`_test\.`,
    String.raw`_spec\.`,
    String.raw`${PATH_SEGMENT_START}__tests__[\\/]`,
    String.raw`${PATH_SEGMENT_START}tests?[\\/]`,
    String.raw`${PATH_SEGMENT_START}test_[^\\/]*\.`,
  ].join("|"),
);
const CONFIG_FILE_RE = new RegExp(
  [
    String.raw`package\.json$`,
    String.raw`package-lock\.json$`,
    String.raw`yarn\.lock$`,
    String.raw`pnpm-lock\.yaml$`,
    String.raw`${PATH_SEGMENT_START}vitest\.config\.[cm]?[jt]s$`,
    String.raw`${PATH_SEGMENT_START}vite\.config\.[cm]?[jt]s$`,
    String.raw`${PATH_SEGMENT_START}jest\.config\.[cm]?[jt]s$`,
    String.raw`${PATH_SEGMENT_START}playwright\.config\.[cm]?[jt]s$`,
    String.raw`${PATH_SEGMENT_START}eslint\.config\.[cm]?[jt]s$`,
    String.raw`${PATH_SEGMENT_START}prettier\.config\.[cm]?[jt]s$`,
    String.raw`tsconfig.*\.json$`,
    String.raw`\.eslintrc`,
    String.raw`\.prettierrc`,
    String.raw`\.gitignore$`,
    String.raw`\.env`,
    String.raw`Cargo\.toml$`,
    String.raw`Cargo\.lock$`,
    String.raw`go\.mod$`,
    String.raw`go\.sum$`,
    String.raw`pyproject\.toml$`,
    String.raw`pytest\.ini$`,
    String.raw`requirements.*\.txt$`,
    String.raw`setup\.py$`,
    String.raw`Gemfile$`,
    String.raw`mix\.exs$`,
    String.raw`[^\\/]+\.sln$`,
    String.raw`[^\\/]+\.csproj$`,
    String.raw`pom\.xml$`,
    String.raw`build\.gradle$`,
    String.raw`build\.gradle\.kts$`,
    String.raw`Makefile$`,
    String.raw`Dockerfile`,
    String.raw`\.ya?ml$`,
    String.raw`\.toml$`,
    String.raw`\.ini$`,
    String.raw`\.cfg$`,
    String.raw`\.md$`,
  ].join("|"),
);

const REMINDER = `${SELF_REVIEW_MARKER} — before declaring this turn done, run a final-pass self-review of your diff against ABP engineering maturity.

Apply the abp:code-review skill to your own changes. Report findings first, in severity order, anchored to file:line. Cover the lenses that apply to this diff:

  - Correctness & behaviour: regressions, edge cases, ordering, error shape, compatibility.
  - Security: trust boundaries, auth, secrets, input handling, unsafe sinks.
  - Evidence: for every behaviour-changing claim, name the proof (test + command + observed result) or mark it unproven with a blocker. A passing check that does not exercise the new behaviour is not proof. Hand off to abp:proof if claims need new coverage.
  - Dead surface & AI-risk: speculative abstraction, defensive code with no real caller, unused exports, fabricated APIs, scope creep, comprehension debt.
  - Simplicity: hidden mutable state, tangled effects, premature abstraction.

If no issues are found, say so explicitly and name residual risk / unreviewed scope. If the change is mechanical (rename, format, comment-only) and tooling covers it, say so and exit.

This reminder fires once per task. Address it and finish.`;

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
  if (!path) return true;
  return !TEST_FILE_RE.test(path) && !CONFIG_FILE_RE.test(path);
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

function alreadyAcknowledged(message) {
  const lower = String(message ?? "").toLowerCase();
  return lower.includes("self-review:") || lower.includes("findings:") || lower.includes("proof:") || lower.includes("evidence:") || lower.includes("unproven");
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
  pi.registerCommand("abp:self-review", {
    description: "Run the ABP self-review gate",
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
