import * as os from "node:os";
import * as path from "node:path";
import type { ExecutionProfile, ProjectEvalConfig } from "do-eval";

const provider = process.env["CONSULT_EVAL_PROVIDER"] ?? "openai";
const model = process.env["CONSULT_EVAL_MODEL"] ?? "gpt-5.5";
const judgeModel = process.env["CONSULT_EVAL_JUDGE_MODEL"] ?? "gpt-5.5";
const reasoningEffort = process.env["CONSULT_EVAL_REASONING_EFFORT"] ?? "medium";
const codexReasoningArgs = ["-c", `model_reasoning_effort="${reasoningEffort}"`];

const CONSULT_REPO_ROOT = path.resolve(import.meta.dirname, "..");

const baselineCodexAgent: ExecutionProfile["agent"] = {
  harness: "codex",
  provider,
  model,
  codex: {
    isolateHome: true,
    ignoreUserConfig: true,
    extraArgs: ["--disable", "plugins", ...codexReasoningArgs],
  },
};

const consultCodexAgent: ExecutionProfile["agent"] = {
  harness: "codex",
  provider,
  model,
  codex: {
    isolateHome: true,
    pluginMarketplaces: [CONSULT_REPO_ROOT],
    extraArgs: ["-c", 'plugins."consult@consult".enabled=true', ...codexReasoningArgs],
  },
};

const skillLayerCapabilities = [
  "accessibility",
  "api",
  "architecture",
  "async-systems",
  "code-review",
  "domain-modeling",
  "database",
  "debugging",
  "documentation",
  "error-handling",
  "git-workflow",
  "observability",
  "performance",
  "proof",
  "refactoring",
  "release",
  "scaffolding",
  "security",
  "ui-design",
  "specify",
  "workflow",
];

const config: ProjectEvalConfig = {
  profiles: {
    codexBaseline: {
      id: "codexBaseline",
      label: "Codex baseline",
      agent: baselineCodexAgent,
      factors: {
        harness: "codex",
        provider,
        model,
        reasoningEffort,
        layers: [],
      },
    },
    codexWithConsultSkills: {
      id: "codexWithConsultSkills",
      label: "Codex + Consult skills",
      agent: consultCodexAgent,
      setup: {
        layers: [
          {
            id: "consult",
            kind: "skill-library",
            runtime: "codex",
            source: "../agents/.agents/skills",
            capabilities: skillLayerCapabilities,
          },
        ],
      },
      factors: {
        harness: "codex",
        provider,
        model,
        reasoningEffort,
        layers: [
          {
            id: "consult",
            kind: "plugin",
            runtime: "codex",
            capabilities: skillLayerCapabilities,
          },
        ],
      },
    },
  },
  benches: {
    smoke: {
      profiles: ["codexBaseline", "codexWithConsultSkills"],
      baseline: "codexBaseline",
      reuseBaseline: true,
      requireJudge: true,
      requiredDeterministicScores: {
        baseline_isolation: 100,
        consult_activation: 100,
      },
    },
    core: {
      profiles: ["codexBaseline", "codexWithConsultSkills"],
      baseline: "codexBaseline",
      epochs: 3,
      reuseBaseline: true,
    },
    allSkills: {
      profiles: ["codexBaseline", "codexWithConsultSkills"],
      baseline: "codexBaseline",
      epochs: 1,
      reuseBaseline: true,
    },
    routing: {
      profiles: ["codexBaseline", "codexWithConsultSkills"],
      baseline: "codexBaseline",
      epochs: 3,
      reuseBaseline: true,
    },
    engineeringMaturity: {
      profiles: ["codexBaseline", "codexWithConsultSkills"],
      baseline: "codexBaseline",
      epochs: 1,
      reuseBaseline: true,
    },
    largeProject: {
      profiles: ["codexBaseline", "codexWithConsultSkills"],
      baseline: "codexBaseline",
      epochs: 1,
      reuseBaseline: true,
    },
    linkShortener: {
      profiles: ["codexBaseline", "codexWithConsultSkills"],
      baseline: "codexBaseline",
      epochs: 1,
      reuseBaseline: true,
    },
  },
  defaultProfile: "codexWithConsultSkills",
  defaultPlugin: "engineering-maturity",
  runsDir: process.env["CONSULT_EVAL_RUNS_DIR"] ?? path.join(os.homedir(), ".cache", "consult", "eval", "runs"),
  judge: {
    provider: "openai-codex",
    model: judgeModel,
    thinking: reasoningEffort,
  },
  timeouts: {
    workerMs: 15 * 60 * 1000,
    inactivityMs: 2 * 60 * 1000,
    judgeMs: 2 * 60 * 1000,
  },
  budgets: {
    maxDurationMs: 15 * 60 * 1000,
    maxToolCalls: 200,
    maxBlockedCalls: 0,
  },
  defaultLaunchType: "bench",
};

export default config;
