import { describe, expect, it } from "vitest";

import abpHeader, { renderAbpHeader } from "../agent-booster-pack/extensions/abp-header.js";

function makePi() {
  const handlers = new Map();
  const commands = new Map();

  return {
    handlers,
    commands,
    on(event, handler) {
      handlers.set(event, handler);
    },
    registerCommand(name, command) {
      commands.set(name, command);
    },
  };
}

function makeContext() {
  const calls = [];

  return {
    hasUI: true,
    model: { id: "test-model" },
    ui: {
      calls,
      setHeader(value) {
        calls.push(value);
      },
      notify(message, level) {
        calls.push({ message, level });
      },
    },
  };
}

describe("ABP Pi startup header", () => {
  it("renders the selected large ABP ASCII header with session context and no border", () => {
    const lines = renderAbpHeader(80, "test-model · repo");
    const plainText = lines.join("\n");

    expect(plainText).toContain("    ___    ____  ____ ");
    expect(plainText).toContain("   /   |  / __ )/ __ \\");
    expect(plainText).toContain("/_/  |_/_____/_/");
    expect(plainText).toContain("test-model · repo");
    expect(plainText).not.toContain("╭");
    expect(plainText).not.toContain("╰");
  });

  it("installs the startup header when a UI session starts", async () => {
    const pi = makePi();
    const ctx = makeContext();
    abpHeader(pi);

    await pi.handlers.get("session_start")({}, ctx);

    expect(ctx.ui.calls).toHaveLength(1);
    const component = ctx.ui.calls[0]({}, { fg: (_name, text) => text });
    expect(component.render(80).join("\n")).toContain("AGENT BOOSTER PACK");
  });

  it("registers commands to toggle the startup header for the current session", async () => {
    const pi = makePi();
    const ctx = makeContext();
    abpHeader(pi);

    await pi.commands.get("abp:header-off").handler("", ctx);
    await pi.commands.get("abp:header-on").handler("", ctx);

    expect(ctx.ui.calls[0]).toBeUndefined();
    expect(ctx.ui.calls.at(-1)).toEqual({ message: "ABP startup header enabled", level: "info" });
  });
});
