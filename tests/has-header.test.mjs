import { describe, expect, it } from "vitest";

import hasHeader, { renderHasHeader } from "../agent-booster-pack/extensions/has-header.ts";

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

describe("HAS Pi startup header", () => {
  it("renders the selected large HAS ASCII header with session context and no border", () => {
    const lines = renderHasHeader(80, "test-model · repo");
    const plainText = lines.join("\n");

    expect(plainText).toContain("    ___    ____  ____ ");
    expect(plainText).toContain("   /   |  / __ )/ __ \\");
    expect(plainText).toContain("/_/  |_/_____/_/");
    expect(plainText).toContain("test-model · repo");
    expect(plainText).not.toContain("practical guidance");
    expect(plainText).not.toContain("proven software");
    expect(plainText).not.toContain("╭");
    expect(plainText).not.toContain("╰");
  });

  it("colors the startup logo with pi's context green", () => {
    const lines = renderHasHeader(80, "test-model · repo");

    expect(lines.join("\n")).toContain("\x1b[38;2;181;189;104m    ___    ____  ____ ");
  });

  it("installs the startup header when a UI session starts", async () => {
    const pi = makePi();
    const ctx = makeContext();
    hasHeader(pi);

    await pi.handlers.get("session_start")({}, ctx);

    expect(ctx.ui.calls).toHaveLength(1);
    const component = ctx.ui.calls[0]({}, { fg: (_name, text) => text });
    expect(component.render(80).join("\n")).toContain("AGENT BOOSTER PACK");
  });

  it("registers commands to toggle the startup header for the current session", async () => {
    const pi = makePi();
    const ctx = makeContext();
    hasHeader(pi);

    await pi.commands.get("has:header-off").handler("", ctx);
    await pi.commands.get("has:header-on").handler("", ctx);

    expect(ctx.ui.calls[0]).toBeUndefined();
    expect(ctx.ui.calls.at(-1)).toEqual({ message: "HAS startup header enabled", level: "info" });
  });
});
