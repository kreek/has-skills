#!/usr/bin/env node
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { fileURLToPath } from "node:url";
import { join } from "node:path";

import { isProductionFile } from "../../agent-booster-pack/src/classify.mjs";
import { REMINDER, alreadyAcknowledged } from "../../agent-booster-pack/src/self-review-core.mjs";

export const MAX_RUNS = Number(process.env.ABP_SELF_REVIEW_MAX_RUNS) || 3;

export function readStdinSync() {
  try {
    return JSON.parse(readFileSync(0, "utf8") || "{}");
  } catch {
    return {};
  }
}

export function gitRoot(cwd) {
  try {
    return execFileSync("git", ["-C", cwd, "rev-parse", "--show-toplevel"], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
  } catch {
    return null;
  }
}

export function gitStatus(root) {
  try {
    return execFileSync("git", ["-C", root, "status", "--porcelain"], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    });
  } catch {
    return "";
  }
}

export function gitHead(root) {
  try {
    return execFileSync("git", ["-C", root, "rev-parse", "HEAD"], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
  } catch {
    return "";
  }
}

export function parseChangedPaths(status) {
  const paths = [];
  for (const line of status.split("\n")) {
    if (line.length < 4) continue;
    const tail = line.slice(3);
    const renameIdx = tail.indexOf(" -> ");
    paths.push(renameIdx >= 0 ? tail.slice(renameIdx + 4) : tail);
  }
  return paths;
}


export function stateFilePath() {
  return process.env.ABP_SELF_REVIEW_STATE_FILE || join(homedir(), ".abp-self-review-state.json");
}

export function readState() {
  const path = stateFilePath();
  if (!existsSync(path)) return {};
  try {
    return JSON.parse(readFileSync(path, "utf8") || "{}");
  } catch {
    return {};
  }
}

export function writeState(state) {
  try {
    writeFileSync(stateFilePath(), JSON.stringify(state, null, 2));
  } catch {
    // Non-fatal: idempotency degrades to "fires once per script invocation"
    // rather than "once per task", which is acceptable for a reminder.
  }
}

export function computeHash(sessionId, head, status) {
  return createHash("sha256").update(`${sessionId}\0${head}\0${status}`).digest("hex");
}

// Accepts the legacy string shape ({ sessionId: "hash" }) or the new
// object shape ({ sessionId: { hash, count } }). Returns the normalized
// { hash, count } form, or null if unseen.
export function readEntry(state, sessionId) {
  const raw = state[sessionId];
  if (!raw) return null;
  if (typeof raw === "string") return { hash: raw, count: 1 };
  return { hash: raw.hash, count: raw.count ?? 1 };
}

export function buildDecision() {
  return {
    decision: "block",
    reason: REMINDER,
  };
}

// Pure decision function — takes resolved inputs, returns either a silent
// outcome or the decision JSON to emit. Side-effect-free for testing.
export function decide({ input, root, status, head, prevEntry, maxRuns = MAX_RUNS }) {
  if (input.stop_hook_active === true) return { action: "silent", reason: "stop_hook_active" };
  if (!root) return { action: "silent", reason: "not_a_repo" };
  if (!status.trim()) return { action: "silent", reason: "clean_tree" };

  const changed = parseChangedPaths(status);
  const productionChanges = changed.filter(isProductionFile);
  if (productionChanges.length === 0) return { action: "silent", reason: "no_production_changes" };

  if (alreadyAcknowledged(input.last_assistant_message)) {
    return { action: "silent", reason: "already_acknowledged" };
  }

  const sessionId = input.session_id || "no-session";
  const hash = computeHash(sessionId, head, status);
  if (prevEntry?.hash === hash) return { action: "silent", reason: "duplicate_hash" };

  const prevCount = prevEntry?.count ?? 0;
  if (prevCount >= maxRuns) return { action: "silent", reason: "max_runs_reached" };

  return {
    action: "block",
    hash,
    sessionId,
    nextCount: prevCount + 1,
    decision: buildDecision(),
  };
}

function main() {
  const input = readStdinSync();
  const cwd = input.cwd || process.cwd();
  const root = gitRoot(cwd);
  const status = root ? gitStatus(root) : "";
  const head = root ? gitHead(root) : "";

  const sessionId = input.session_id || "no-session";
  const state = readState();

  const outcome = decide({ input, root, status, head, prevEntry: readEntry(state, sessionId) });

  if (outcome.action === "silent") {
    process.exit(0);
  }

  state[outcome.sessionId] = { hash: outcome.hash, count: outcome.nextCount };
  writeState(state);
  process.stdout.write(JSON.stringify(outcome.decision));
  process.exit(0);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main();
}
