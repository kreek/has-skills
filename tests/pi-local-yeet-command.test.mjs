import { describe, expect, it } from "vitest";

import yeetCommand, { buildYeetPrompt } from "../.pi/extensions/yeet.ts";

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

describe("repo-local Pi yeet slash command", () => {
  it("builds a non-empty prompt", () => {
    expect(buildYeetPrompt("").trim()).not.toEqual("");
  });

  it("pushes the current branch without merging to main", () => {
    const prompt = buildYeetPrompt("");

    expect(prompt).toContain("Push the commit to the current branch's remote.");
    expect(prompt).toContain("create one by pushing with upstream tracking");
    expect(prompt).toContain("output a URL to create a pull request from the pushed branch into `main`");
    expect(prompt).not.toContain("Push `main` to `origin main`.");
    expect(prompt).not.toContain("merge the topic branch into `main`");
  });

  it("appends additional user instructions", () => {
    const prompt = buildYeetPrompt("use subject header");

    expect(prompt).toContain("Additional instructions from the user:\nuse subject header");
  });

  it("registers /yeet and sends the prompt when idle", async () => {
    const pi = makePi();
    const ctx = makeContext();
    yeetCommand(pi);

    expect(pi.commands.has("yeet")).toBe(true);
    expect(pi.commands.has("abp:commit-bump-merge-push")).toBe(false);
    expect(pi.commands.has("abp:release")).toBe(false);

    await pi.commands.get("yeet").handler("", ctx);

    expect(pi.messages).toEqual([buildYeetPrompt("")]);
    expect(ctx.notifications).toEqual([]);
  });

  it("queues the prompt as a follow-up when the agent is busy", async () => {
    const pi = makePi();
    const ctx = makeContext(false);
    yeetCommand(pi);

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
