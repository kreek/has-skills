import { describe, expect, it } from "vitest";

import openaiCodexFastMode from "../extensions/openai-codex-fast-mode.js";

function registeredBeforeProviderRequestHandler() {
  const handlers = new Map();
  const pi = {
    on: (eventName, handler) => handlers.set(eventName, handler),
  };

  openaiCodexFastMode(pi);

  return handlers.get("before_provider_request");
}

describe("openai codex fast mode", () => {
  it("sets priority service tier for codex model payloads", () => {
    const handler = registeredBeforeProviderRequestHandler();

    const result = handler({ payload: { model: "codex-mini", stream: true } });

    expect(result).toEqual({ model: "codex-mini", stream: true, service_tier: "priority" });
  });

  it("sets priority service tier for Pi Codex responses payloads", () => {
    const handler = registeredBeforeProviderRequestHandler();

    const result = handler({
      payload: {
        model: "gpt-5.5",
        stream: true,
        instructions: "Follow the instructions.",
        input: [],
        tool_choice: "auto",
        prompt_cache_key: "cache-key",
      },
    });

    expect(result).toMatchObject({ service_tier: "priority" });
  });

  it("leaves unrelated provider payloads unchanged", () => {
    const handler = registeredBeforeProviderRequestHandler();

    const result = handler({ payload: { model: "gpt-4.1", stream: true } });

    expect(result).toBeUndefined();
  });
});
