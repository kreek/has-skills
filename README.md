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
and OpenAI have poured billions into models and harnesses.

## What ABP guides agents to do

- Keep humans in the loop for hard-to-change choices: public interfaces, project
  structure, dependency picks, data boundaries, and long-lived behavior.
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

Most users should install the package for their primary agent. Use the manual
install only when you want one shared skill directory across several tools, or
when your tool does not support plugins.

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

To update:

```sh
codex plugin marketplace upgrade abp
```

Then reinstall from `/plugins`.

The self-review hook requires Codex plugin hooks in `~/.codex/config.toml`:

```toml
[features]
hooks = true
plugin_hooks = true
```

### Pi

```sh
pi install github:kreek/agent-booster-pack

# Registry-pinned install:
pi install npm:agent-booster-pack
```

After installing, run `/reload` inside Pi. ABP includes bundled skills plus
runtime extensions for `/proof` and `/abp:self-review`.

### Manual (multi-agent or unsupported plugins)

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
anything. It links `~/.agents/skills/` and tool-specific skill locations when
those tools are present. End-user installs do not need Python or uv.

## Skills

ABP includes 24 skills. Open a skill for its triggers, workflow, and
verification.

- Routing and proof: [`workflow`](agents/.agents/skills/workflow/SKILL.md),
  [`proof`](agents/.agents/skills/proof/SKILL.md),
  [`contract-first`](agents/.agents/skills/contract-first/SKILL.md).
- Design: [`specify`](agents/.agents/skills/specify/SKILL.md),
  [`domain-modeling`](agents/.agents/skills/domain-modeling/SKILL.md),
  [`architecture`](agents/.agents/skills/architecture/SKILL.md).
- Correctness and change: [`code-review`](agents/.agents/skills/code-review/SKILL.md),
  [`debugging`](agents/.agents/skills/debugging/SKILL.md),
  [`error-handling`](agents/.agents/skills/error-handling/SKILL.md),
  [`refactoring`](agents/.agents/skills/refactoring/SKILL.md),
  [`official-source-check`](agents/.agents/skills/official-source-check/SKILL.md).
- Safety: [`security`](agents/.agents/skills/security/SKILL.md),
  [`database`](agents/.agents/skills/database/SKILL.md),
  [`release`](agents/.agents/skills/release/SKILL.md).
- Public surfaces: [`api`](agents/.agents/skills/api/SKILL.md),
  [`documentation`](agents/.agents/skills/documentation/SKILL.md),
  [`ui-design`](agents/.agents/skills/ui-design/SKILL.md),
  [`accessibility`](agents/.agents/skills/accessibility/SKILL.md).
- Production quality: [`async-systems`](agents/.agents/skills/async-systems/SKILL.md),
  [`observability`](agents/.agents/skills/observability/SKILL.md),
  [`performance`](agents/.agents/skills/performance/SKILL.md).
- Repo workflow: [`commit`](agents/.agents/skills/commit/SKILL.md),
  [`scaffolding`](agents/.agents/skills/scaffolding/SKILL.md),
  [`git-workflow`](agents/.agents/skills/git-workflow/SKILL.md).

Greenfield stack templates live under
[`scaffolding/references/stacks/`](agents/.agents/skills/scaffolding/references/stacks/).
Shared language defaults are in
[`language-defaults.md`](agents/.agents/skills/scaffolding/references/language-defaults.md).

## How routing works

ABP routing is **collaboration-aware, quality-driven, and risk-triggered**.
Risk determines which skills load; working mode determines whether the agent
should continue, ask for approval, or stay read-only.

The working modes are **Direct**, **Guided**, **Design-partner**, and
**Review-only**. Most implementation work stays in Direct or Guided mode.

ABP is autonomous by default and consultative for hard-to-change choices. The agent
should ask before it locks in a caller-facing interface, class or library API,
project/package/module structure, structural runtime dependency, data model, or
boundary that future work will depend on. Local helpers, private file moves,
and narrow bug fixes should not become consultation gates.

Caller-facing interfaces and shared structure trigger `contract-first`: the
agent stops at one recommended contract/API/structure and high-level plan, then
asks for approval before implementation continues.

See [`workflow`](agents/.agents/skills/workflow/SKILL.md) for the full
routing model and [`contract-first`](agents/.agents/skills/contract-first/SKILL.md)
for sign-off on interfaces and shared structure.

## What makes ABP unique

ABP is skills, not orchestration. It does not replace your harness's browser,
memory, planning, sub-agent, or tool surfaces.

ABP is not meant to interrupt every coding step. It slows agents down where
judgment matters: architecture, structural dependency choices, project shape,
caller-facing interfaces, safety gates, and proof. Mechanical work can stay
fast.

The high-level lens is Rich Hickey's "Simple Made Easy": separate concerns,
make state and effects explicit, and keep designs simple enough to understand,
change, and prove.

## Evaluation

[`eval/README.md`](eval/README.md) benchmarks Codex with and without ABP
against shared engineering tasks. It combines deterministic hidden tests with
LLM-judged engineering maturity, proof quality, simplicity, and risk handling.

## Contributing

See [`CONTRIBUTING.md`](CONTRIBUTING.md) for project conventions, the skill
authoring template, branching rules, checks, and maintenance steps. Skill
authoring rules and pack-versioning policy live in
[`AGENTS.md`](AGENTS.md#skill-anatomy-enforced-by-the-validator).

## License

MIT — see [`LICENSE`](LICENSE). Third-party/adapted extension notices are listed
in [`THIRD_PARTY_NOTICES.md`](THIRD_PARTY_NOTICES.md).

## Uninstall

Manual install:

```sh
stow --target="$HOME" -D agents
```

Manual cleanup may still be needed for tool-specific symlinks.

If you installed the Claude Code plugin, run these from inside Claude Code:

```text
/plugin uninstall abp@abp
/plugin marketplace remove abp
```

For Codex, remove ABP from the plugin UI or marketplace commands.
