# Highline Agent Skills Evals

This eval suite gates HAS changes against regressions and, when a new
comparison run is wanted, benchmarks whether Codex behaves better when
Highline Agent Skills is installed as a Codex plugin.

**Default workflow: regression.** HAS-vs-baseline behaviour is established;
routine change-validation runs `regression` against `codexWithHasSkills`
only and compares scores against history. Bench (cross-profile comparison)
is reserved for periodic re-baselining or when claiming a directional win
against unaided Codex.

Profiles:

- `codexBaseline`: Codex with an isolated, freshly-authed home and no
  plugins. Used by bench only.
- `codexWithHasSkills`: the same Codex model with the local repo registered
  as a codex plugin marketplace and the `has@has` plugin enabled — the same
  flow a real user gets after `codex plugin marketplace add`. The default
  profile for regression.

Suites:

- `smoke`: one cheap read-only routing task for wiring checks.
- `core`: tasks for HAS's always-on and core design/correctness skills.
- `allSkills`: a larger suite intended to exercise every HAS skill listed in
  the README at least once.
- `largeProject`: one larger project-style task for cross-file reasoning and
  end-to-end proof.
- `regressionCheck`: trials known to have regressed under HAS; rerun after
  fixes to confirm they landed.

Suite membership is defined in `eval/suites/*.yaml`. `eval.config.ts` owns
profile, Bench, judge, timeout, and budget policy only.

The suite uses an LLM judge for qualitative output: engineering maturity,
proof quality, simplicity, and risk handling. Deterministic scoring is limited
to objective evidence such as forbidden file writes, profile isolation,
plugin activation, and executable tests/checks when the trial prompt asks for
code. Hidden implementation checks make sure the task still works even if the
agent edits visible tests. The judge runs by default; pass `--no-judge` only
when you want to inspect objective harness checks without qualitative scoring.

Trial prompts and starter files are intentionally neutral: they describe the
product or maintenance task without naming HAS, skills, or the quality lens
being scored. Intended skill coverage lives in each trial manifest's
`features:` list so suite coverage has one source of truth without leaking
skill names into the agent-visible task.

## Setup

This package depends on the local `do-eval` checkout through
`package.json`:

```sh
cd eval
pnpm install
```

The workspace uses pnpm's `minimumReleaseAge` setting to avoid installing
registry versions published in the last 24 hours.

Set a model if the default is not what you want:

```sh
export HAS_EVAL_MODEL=gpt-5.3-codex
export HAS_EVAL_JUDGE_MODEL=gpt-5.3-codex
export HAS_EVAL_REASONING_EFFORT=low
```

By default, both eval workers and the judge use `gpt-5.5` with medium
reasoning effort. Codex worker effort is passed through
`model_reasoning_effort`; the judge receives the same value as its thinking
setting.

Codex authentication is read from `CODEX_HOME/auth.json` when set, otherwise
from `~/.codex/auth.json`. Each run gets a temporary isolated Codex home.

## Commands

```sh
pnpm run list             # show profiles, suites, and bench configs
pnpm run view             # start the do-eval web UI on http://localhost:4242

# Regression — the default workflow. Runs codexWithHasSkills only.
pnpm run regression:check # the two trials known to have regressed
pnpm run regression:core  # always-on and core design/correctness skills
pnpm run regression:smoke # cheap routing wiring check
pnpm run regression:all   # full HAS-only sweep

pnpm run trial -- proof-first-bugfix --profile codexWithHasSkills

# Bench — cross-profile comparison. Reserved for re-baselining.
pnpm run bench:smoke      # compare Codex baseline vs Codex + HAS
pnpm run bench:core
pnpm run bench:routing
pnpm run bench:large
pnpm run bench:all

pnpm test                 # run eval harness tests
pnpm run typecheck        # type-check the eval harness
```

Use **Regression** for routine HAS change-validation: one profile (HAS),
one suite, score against history. Use **Bench** when a fresh
HAS-vs-baseline comparison is needed (every release, or when claiming
a directional win against unaided Codex). Use **Trial** to debug one
task under one profile.

Results are written under `~/.cache/agent-booster-pack/eval/runs/` by default
(override with `HAS_EVAL_RUNS_DIR`). Trial workdirs live outside the repo to
keep codex's ancestor walk from auto-discovering HAS skills into the baseline
profile.
