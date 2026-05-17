import { describe, expect, it } from "vitest";

import releaseCommand, { buildYeetPrompt } from "../.pi/extensions/abp-release.js";

function makePi() {
  const commands = new Map();
  const messages = [];
  return {
    commands,
    messages,
    registerCommand(name, command) {
      commands.set(name, command);
    },
    sendUserMessage(message, options) {
      messages.push(options ? { message, options } : message);
    },
  };
}

function makeContext(idle = true) {
  const notifications = [];
  return {
    notifications,
    isIdle: () => idle,
    ui: {
      notify(message, level) {
        notifications.push({ message, level });
      },
    },
  };
}

describe("ABP yeet slash command", () => {
  it("builds an add, commit, and push prompt", () => {
    const prompt = buildYeetPrompt("");

    expect(prompt).toContain("Commit and push the current repository changes.");
    expect(prompt).toContain("Add all unstaged changes with `git add -A`");
    expect(prompt).toContain("If the current branch is not `main`, create or update a pull request into `main`");
    expect(prompt).toContain("Write a concise PR description with a summary and validation notes");
    expect(prompt).not.toContain("ABP release packaging workflow");
  });

  it("appends additional user instructions", () => {
    const prompt = buildYeetPrompt("use subject header");

    expect(prompt).toContain("Additional instructions from the user:\nuse subject header");
  });

  it("registers /yeet and sends the prompt when idle", async () => {
    const pi = makePi();
    const ctx = makeContext();
    releaseCommand(pi);

    expect(pi.commands.has("yeet")).toBe(true);
    expect(pi.commands.has("abp:commit-bump-merge-push")).toBe(false);
    expect(pi.commands.has("abp:release")).toBe(false);

    await pi.commands.get("yeet").handler("", ctx);

    expect(pi.messages).toHaveLength(1);
    expect(pi.messages[0]).toContain("Commit and push the current repository changes.");
    expect(ctx.notifications).toEqual([]);
  });

  it("queues the prompt as a follow-up when the agent is busy", async () => {
    const pi = makePi();
    const ctx = makeContext(false);
    releaseCommand(pi);

    await pi.commands.get("yeet").handler("later", ctx);

    expect(pi.messages[0]).toEqual({
      message: expect.stringContaining("Additional instructions from the user:\nlater"),
      options: { deliverAs: "followUp" },
    });
    expect(ctx.notifications[0]).toEqual({
      message: "Queued /yeet as a follow-up",
      level: "info",
    });
  });
});
