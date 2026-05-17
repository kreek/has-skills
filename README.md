# Agent Booster Pack

<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="assets/ABP_logo_header_dark.png">
    <source media="(prefers-color-scheme: light)" srcset="assets/ABP_logo_header_light.png">
    <img src="assets/ABP_logo_header_light.png" alt="Comic-style Agent Booster Pack header: a robot launching from a booster-pack package beside the headline 'Up-level your coding agents' and a panel describing practical guidance for simpler, evidence-backed, accessible, production-grade software.">
  </picture>
</p>

Drawn from 25 years of software engineering across startups and large
organizations, Agent Booster Pack (ABP) is a portable skill library for
raising the engineering maturity of coding agents. ABP is not designed to 
automate humans out of the loop or reshape how the underlying harness works. 

Humans are good at mapping real-world issues to technical solutions, and Anthropic 
and OpenAI have poured billions into models and harnesses. The skill library your
angel investor or PM created is not going to replace either of those (no offense).

## What ABP guides agents to do

- Keep humans in the loop when choices shape contracts, data, boundaries, or
  long-lived behavior.
- Use AI to improve the developer's mental model, not to replace it.
- Model data first: make values, states, and rules clear; limit side effects;
  keep state changes at the edges.
- Show their work: prove behavior with tests, contracts, logs, or visible
  checks rather than relying on what seems correct.
- Treat security, data safety, and accessibility as essential, not extras.
- Plan beyond launch: invest in observability, reliability, safe deployment,
  and a rollback plan.
- Organize work into clear, reviewable changes humans can trust and maintain.

## Install

Pick the install for your agent. Most users want the packaged install for
their primary tool; use the manual install only if you switch between several
agents or use one without plugin support.

### Claude Code

Inside Claude Code:

```text
/plugin marketplace add kreek/agent-booster-pack
/plugin install abp@abp
```

### Codex

```sh
codex plugin marketplace add kreek/agent-booster-pack
```

Then open `/plugins` in Codex, select **Agent Booster Pack**, and install.

To update later, run:

```sh
codex plugin marketplace upgrade abp
```

Then reinstall from `/plugins`.

The ABP self-review pass uses a Codex plugin Stop hook. Enable hooks in
`~/.codex/config.toml`:

```toml
[features]
hooks = true
plugin_hooks = true
```

### Pi

ABP for Pi now ships as one package. It installs the bundled skills plus two
runtime extensions: proof and self-review.

```sh
pi install github:kreek/agent-booster-pack

# Registry-pinned install, when preferred:
pi install npm:agent-booster-pack
```

After installing, run `/reload` inside Pi to activate. Use `/proof` for
proof-first mode and `/abp:self-review` for the same final-pass self-review gate
used by the Claude and Codex ABP hooks.

### Manual (multi-agent or unsupported plugins)

Use this if your agent reads `~/.agents/skills/`, or if you want one skill
directory shared across Codex, Claude, Pi, and others.

Prerequisites: Git and GNU Stow. Install Stow with one of:

```sh
brew install stow   # macOS
apt install stow    # Debian/Ubuntu
dnf install stow    # Fedora/RHEL
```

```sh
git clone https://github.com/kreek/agent-booster-pack.git
cd agent-booster-pack
./setup.sh
```

`setup.sh` prints the actions it will take and confirms before changing
anything. It links `~/.agents/skills/` and adds tool-specific links for
Claude (`~/.claude/skills/`), Codex (`~/.codex/skills/<name>/`, unless the
Codex plugin is installed), and Windsurf (`~/.codeium/windsurf/skills/<name>/`)
when those tools are present.

Pi, Cursor, Gemini CLI, OpenCode, GitHub Copilot CLI, and other tools
auto-discover `~/.agents/skills/`. End-user installs do not need Python or
uv.

## Skills

24 skills, grouped by the engineering pressure they apply. Open a skill for
its triggers, principles, workflow, and verification.

### Always-on routing and proof

The two skills the agent should reach for on every task, plus the gate for
durable interfaces.

| Skill | Use when |
|---|---|
| [`workflow`](agents/.agents/skills/workflow/SKILL.md) | Choosing the working mode, scoped skill set, and proof plan. |
| [`proof`](agents/.agents/skills/proof/SKILL.md) | Behavior, contracts, invariants, root causes, or completion claims need evidence. |
| [`contract-first`](agents/.agents/skills/contract-first/SKILL.md) | Durable interfaces need approval before implementation lands. |

### Foundational design

Shape the problem before writing code: design partner, data, and boundaries.

| Skill | Use when |
|---|---|
| [`specify`](agents/.agents/skills/specify/SKILL.md) | Architecture or design decisions need human collaboration before code changes. |
| [`domain-modeling`](agents/.agents/skills/domain-modeling/SKILL.md) | Data, states, invariants, allowed combinations, transitions, or effects need shaping. |
| [`architecture`](agents/.agents/skills/architecture/SKILL.md) | Module boundaries, bounded contexts, or independently changing concerns need design. |

### Correctness and change

Day-to-day skills for reviewing, debugging, and reshaping code without
regressions.

| Skill | Use when |
|---|---|
| [`code-review`](agents/.agents/skills/code-review/SKILL.md) | Diffs, branches, PRs, requested changes, or generated code need review. |
| [`debugging`](agents/.agents/skills/debugging/SKILL.md) | Bugs, flakes, regressions, or symptoms need root-cause investigation. |
| [`error-handling`](agents/.agents/skills/error-handling/SKILL.md) | Error types, propagation, retries, timeouts, crash boundaries, or recovery need design. |
| [`refactoring`](agents/.agents/skills/refactoring/SKILL.md) | Structure changes must preserve behavior while improving clarity. |
| [`official-source-check`](agents/.agents/skills/official-source-check/SKILL.md) | Current external framework, runtime, SDK, browser, cloud, or platform behavior matters. |

### Safety gates

Block-or-approve lenses that can stop an otherwise-good change.

| Skill | Use when |
|---|---|
| [`security`](agents/.agents/skills/security/SKILL.md) | Auth, secrets, crypto, input validation, dependency trust, or trust boundaries are in scope. |
| [`database`](agents/.agents/skills/database/SKILL.md) | Schemas, migrations, indexes, queries, transactions, or production data access are in scope. |
| [`release`](agents/.agents/skills/release/SKILL.md) | Approved release prep, versioning, changelogs, rollout, or rollback work is in scope. |

### Public and user surfaces

Anything users, integrators, or readers see — APIs, docs, UI, and inclusive
design.

| Skill | Use when |
|---|---|
| [`api`](agents/.agents/skills/api/SKILL.md) | HTTP APIs, OpenAPI, status codes, pagination, idempotency, versioning, or webhooks are in scope. |
| [`documentation`](agents/.agents/skills/documentation/SKILL.md) | READMEs, ADRs, runbooks, tutorials, reference docs, or comments are requested or approved. |
| [`ui-design`](agents/.agents/skills/ui-design/SKILL.md) | Pages, components, interaction flows, responsive layout, or visual design need work. |
| [`accessibility`](agents/.agents/skills/accessibility/SKILL.md) | WCAG, semantic HTML, ARIA, keyboard, focus, contrast, forms, or inclusive UI are in scope. |

### Production quality

What keeps the system running once it ships.

| Skill | Use when |
|---|---|
| [`async-systems`](agents/.agents/skills/async-systems/SKILL.md) | Async tasks, workers, queues, streams, ordering, delivery, or backpressure are in scope. |
| [`observability`](agents/.agents/skills/observability/SKILL.md) | Logs, metrics, traces, health checks, dashboards, alerts, or telemetry need work. |
| [`performance`](agents/.agents/skills/performance/SKILL.md) | Latency, throughput, p99s, CPU, memory, I/O, caching, or resource saturation matters. |

### Project and repo workflow

Mechanics for packaging changes and keeping the repo navigable.

| Skill | Use when |
|---|---|
| [`commit`](agents/.agents/skills/commit/SKILL.md) | Reviewed work needs staging, logical commit grouping, or a right-sized commit message. |
| [`scaffolding`](agents/.agents/skills/scaffolding/SKILL.md) | New projects, baseline tooling, package-manager defaults, test runners, linting, or CI need setup. |
| [`git-workflow`](agents/.agents/skills/git-workflow/SKILL.md) | Branch hygiene, rebases, conflicts, bisects, history recovery, force-push decisions, or GitHub CLI are in scope. |

Greenfield stack picks live as editable
[Backstage Software Templates](https://backstage.io/docs/features/software-templates/)
YAML files under
[`scaffolding/references/stacks/`](agents/.agents/skills/scaffolding/references/stacks/).
Edit them to match your preferred frameworks, databases, auth, jobs, and
observability. Shared language defaults are in
[`language-defaults.md`](agents/.agents/skills/scaffolding/references/language-defaults.md).

## How routing works

ABP routing is **collaboration-aware, quality-driven, and risk-triggered**.
Quality is the goal; risk is the signal that a quality concern matters enough
to change the next action; working mode determines how much human involvement
that action needs.

The four working modes are **Direct** (mechanical work on autopilot), **Guided**
(default — normal feature/bug/refactor), **Design-partner** (architecture,
domain, durable-interface decisions), and **Review-only** (critique without
edits). When a durable interface is in scope, the agent stops at the
contract/API and high-level plan and asks for approval before implementation
continues.

See [`workflow`](agents/.agents/skills/workflow/SKILL.md) for the full
routing model and skill-loading table, and
[`contract-first`](agents/.agents/skills/contract-first/SKILL.md) for the
durable-interface definition and required sign-off artifacts.

## What makes ABP unique

ABP is designed to improve engineering quality by routing agents toward the
risks and human decisions that matter for the task. Three properties
distinguish it:

**Skills, not orchestration.** ABP names engineering risk and proof
obligations; it does not replace the host harness's browser, memory,
planning, sub-agent, or tool surfaces. The doctrine adds focused engineering
support without changing agent internals.

**Graduated user involvement.** ABP leans into human collaboration rather
than maximum automation. Mechanical work proceeds quickly; architecture and
durable interfaces slow down for approval; review requests stay read-only.
This is a skill pack for users who want to stay part of the coding process —
especially architecture and design.

**Proof, not test-first.** Behavior-changing claims need evidence, but the
order is yours: agents can discover shape first, then attach tests,
contracts, command output, or other evidence before claiming work is done.

The high-level lens is Rich Hickey's "Simple Made Easy": complexity is the
enemy. ABP pushes agents toward designs that separate concerns, make state
and effects explicit, and remain simple enough to understand, change, and
prove.

ABP assumes coding agents already know the basics of coding, planning, and
tool use, and that syntax is handled by linters, formatters, type checkers,
and test suites. The skills do not cover those areas.

## Evaluation

ABP ships an eval suite under [`eval/README.md`](eval/README.md) that
benchmarks Codex with and without the ABP plugin against shared engineering
tasks. The current smoke trial shows a +17 lift on the proof-first bugfix
task; an LLM judge adds engineering-maturity, proof-quality, simplicity, and
risk-handling scores on top of deterministic hidden tests.

## Contributing

See [`CONTRIBUTING.md`](CONTRIBUTING.md) for project conventions, the skill
authoring template, branching and commit rules, local checks, and the
maintenance steps to run after adding or renaming a skill. Skill authoring
rules and pack-versioning policy live in
[`AGENTS.md`](AGENTS.md#skill-anatomy-enforced-by-the-validator).

## Uninstall

For the manual install:

```sh
stow --target="$HOME" -D agents
```

Manual cleanup may still be needed for tool-specific symlinks under
`~/.claude/skills/`, `~/.codex/skills/`, and `~/.codeium/windsurf/skills/`.

If you installed the Claude Code plugin, run these from inside Claude Code:

```text
/plugin uninstall abp@abp
/plugin marketplace remove abp
```

The marketplace remove is optional.

For the Codex plugin, remove it from Codex's plugin UI or marketplace
commands.
