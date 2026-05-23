import { describe, expect, it } from "vitest";

import selfReviewGuard, {
  SELF_REVIEW_MARKER,
  selfReviewPromptFor,
  selfReviewPromptForSessionEntries,
  shouldRequestSelfReview,
} from "../extensions/self-review-guard.ts";

const assistantToolCall = (name, args = {}) => ({
  role: "assistant",
  content: [{ type: "toolCall", name, arguments: args }],
});

const assistantText = (text) => ({
  role: "assistant",
  content: [{ type: "text", text }],
});

const entry = (role, content) => ({ type: "message", message: { role, content } });

describe("self-review guard", () => {
  it("registers the manual self-review command and passive message_end hook", () => {
    const commands = new Map();
    const handlers = new Map();
    const fakePi = {
      registerCommand: (name, definition) => commands.set(name, definition),
      on: (eventName, handler) => handlers.set(eventName, handler),
    };

    selfReviewGuard(fakePi);

    expect(commands.get("has:self-review")).toBeTruthy();
    expect(handlers.get("message_end")).toBeTruthy();
  });

  it("asks for a hidden follow-up self-review after production changes", async () => {
    const handlers = new Map();
    const sent = [];
    const sessionEntries = [
      entry("user", "implement the cache"),
      entry("assistant", [{ type: "toolCall", name: "write", arguments: { path: "src/cache.js" } }]),
    ];
    const fakePi = {
      registerCommand() {},
      sendMessage: (message, options) => sent.push({ message, options }),
      on: (eventName, handler) => handlers.set(eventName, handler),
    };

    selfReviewGuard(fakePi);
    const result = await handlers.get("message_end")(
      { message: assistantText("Done.") },
      { sessionManager: { getBranch: () => sessionEntries } },
    );

    expect(result).toBeUndefined();
    expect(sent).toHaveLength(1);
    expect(sent[0].message).toMatchObject({ customType: "has-self-review", display: false });
    expect(sent[0].options).toEqual({ triggerTurn: true, deliverAs: "followUp" });
    expect(sent[0].message.content).toContain(SELF_REVIEW_MARKER);
    expect(sent[0].message.content).toMatch(/run a final-pass self-review/i);
    expect(sent[0].message.content).toMatch(/Previous final response:\nDone\./);
  });

  it("manual command asks for the same self-review gate", async () => {
    const commands = new Map();
    const sent = [];
    const fakePi = {
      registerCommand: (name, definition) => commands.set(name, definition),
      sendUserMessage: (message) => sent.push(message),
      on() {},
    };

    selfReviewGuard(fakePi);
    await commands.get("has:self-review").handler("focus on auth", {
      sessionManager: { getBranch: () => [] },
    });

    expect(sent).toHaveLength(1);
    expect(sent[0]).toContain(SELF_REVIEW_MARKER);
    expect(sent[0]).toMatch(/focus on auth/i);
  });

  it("does not request self-review for read-only or docs-only turns", () => {
    expect(shouldRequestSelfReview([assistantToolCall("read"), assistantText("Inspected it.")])).toBe(false);
    expect(selfReviewPromptFor([assistantToolCall("write", { path: "README.md" }), assistantText("Updated docs.")])).toBeNull();
  });

  it("does not request self-review when the final response already acknowledges it", () => {
    const turnMessages = [
      assistantToolCall("write", { path: "src/cache.js" }),
      assistantText("Self-review: no findings. Proof: npm test passed. Unproven: CI not checked."),
    ];

    expect(shouldRequestSelfReview(turnMessages)).toBe(false);
  });

  it("treats pathless mutating shell commands as production changes", () => {
    const turnMessages = [
      assistantToolCall("bash", { command: "python - <<'PY'\nopen('src/cache.js', 'w').write('x')\nPY" }),
      assistantText("Updated cache handling."),
    ];

    expect(selfReviewPromptFor(turnMessages)).toMatch(/HAS self-review/);
  });

  it("detects changes from session entries scoped to the latest user turn", () => {
    const sessionEntries = [
      entry("user", "older request"),
      entry("assistant", [{ type: "toolCall", name: "write", arguments: { path: "src/old.js" } }]),
      entry("assistant", [{ type: "text", text: "Self-review: old change checked." }]),
      entry("user", "implement the cache"),
      entry("assistant", [{ type: "toolCall", name: "write", arguments: { path: "src/cache.js" } }]),
      entry("assistant", [{ type: "text", text: "Implemented the cache." }]),
    ];

    const prompt = selfReviewPromptForSessionEntries(sessionEntries);

    expect(prompt).toMatch(/Previous final response:\nImplemented the cache\./);
    expect(prompt).toMatch(/run a final-pass self-review/i);
  });
});
