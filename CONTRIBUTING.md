# Contributing

Thanks for your interest in Consult. This file covers what you
need to know before opening a PR.

## Project conventions

- Read [`AGENTS.md`](AGENTS.md) before authoring or editing skills. It defines
  the engineering defaults the skill bodies assume.
- Skills live under `agents/.agents/skills/<name>/SKILL.md`. The
  `plugin/skills/` tree is symlinked from there; edit the canonical
  copy only.
- Each skill must conform to the anatomy enforced by
  `scripts/validate-skill-anatomy.mjs`: frontmatter (name + description),
  `# Title`, `## When to Use`, `## When NOT to Use`, `## Verification`,
  optional `## Tripwires`, and any other sections the skill needs.
  Use the section ownership rules in `AGENTS.md` when choosing where content
  belongs.
- Keep skill descriptions concise (120 characters or fewer) and trigger-rich.
  Lead with verbs and named scenarios; avoid marketing language.
- Names of authors, books, papers, or external products belong in the
  `## References` section only, not in skill bodies or frontmatter.

## Skill body template

Use this order unless the skill has a clear reason to omit an optional section.
Insert skill-specific contract or template sections after `## Core Ideas` and
before `## Workflow`.

```md
---
name: kebab-case-name
description: Use when <trigger-focused scenarios>.
---

# Skill Title

## Iron Law

One non-negotiable rule, if the skill has one.

## When to Use

- Routing triggers only.

## When NOT to Use

- Routing exclusions and neighboring-skill handoffs only.

## Core Ideas

1. Durable judgment rules and mental models.
2. No ordered workflow steps, commands, examples, or completion checks.

## Workflow

1. Ordered actions the agent should take.
2. Apply Core Ideas without re-explaining them.

## Before Saying Done

1. Final completion gate, only when the skill needs one.
2. Latest request, final artifact/diff check, freshest proof, honest status.

## Verification

- [ ] Checks that audit the skill's output.
- [ ] No new doctrine appears here.

## Tripwires

- Take the concrete corrective action when the high-probability shortcut
  appears.
- Prefer positive instructions over negated warnings; move rare exceptions to
  references.

## Handoffs

- Use `neighbor-skill` when that skill owns the unresolved concern.

## References

- Deeper examples, recipes, citations, and ecosystem detail.
```

## Branching and commits

- Branch per change: `feature/`, `fix/`, `refactor/`, `chore/`, `docs/`.
- Feature work and bug fixes should use a branch.
- Imperative-mood commit subjects, ≤72 characters, explain *why* not
  *what*. No AI-attribution trailers (`Co-Authored-By`,
  `Generated-by`, etc.).

## Local checks

Run before opening a PR:

```sh
make test
pnpm run check:links
node scripts/validate-skill-anatomy.mjs
```

The validator checks all 21 skills, the `plugin/skills/` symlinks, and
the Codex plugin manifest in one pass.

The optional repo pre-commit hook is intentionally narrow: it checks staged
whitespace, runs the Markdown validator for staged Markdown files, and runs
Pi-focused tests for Pi package or extension changes.

```sh
git config core.hooksPath .githooks
```

## Pull requests

- One logical change per PR. Rebase onto the current `main` before
  opening.
- Reference any related issue and explain the engineering motivation.
  PR descriptions should make tradeoffs visible.
- New skills require: a clear risk profile, named tripwires, a
  verification checklist, and at least one handoff to an existing
  skill.

## Reporting bugs

Open an issue with: a short title, the agent runtime in use, the skill
involved, the prompt or scenario that reproduces the behavior, and the
observed vs. expected outcome.

## Security

Security disclosures go through the channel described in
[`SECURITY.md`](SECURITY.md), not public issues.

## After adding or renaming a skill

Run:

```sh
./setup.sh
```

This refreshes the per-agent symlink fan-out for manual installs and regenerates
the `plugin/skills/` mirror used by the Claude Code, Codex, and Cursor plugin
builds. Pi
npm packages rebuild their `skills/` directories at `npm pack` time via each
package's `scripts/build-skills.mjs`; those bundles are gitignored.

Then update, as relevant:

- [`workflow`](agents/.agents/skills/workflow/SKILL.md): when routing for broad
  tasks changes.
- [`README.md`](README.md): the human-facing skill list.
- Neighboring skills' `## Handoffs` sections: when the routing graph changes.
- [`.claude-plugin/marketplace.json`](.claude-plugin/marketplace.json): per
  the pack-versioning rules in [`AGENTS.md`](AGENTS.md#pack-versioning-marketplacejson--pluginjson).
- [`.agents/plugins/marketplace.json`](.agents/plugins/marketplace.json) and
  [`plugin/.codex-plugin/plugin.json`](plugin/.codex-plugin/plugin.json):
  when Codex plugin metadata or packaged skill content changes.
- [`.cursor-plugin/marketplace.json`](.cursor-plugin/marketplace.json) and
  [`plugin/.cursor-plugin/plugin.json`](plugin/.cursor-plugin/plugin.json):
  when Cursor plugin metadata or packaged skill content changes.
- `consult*/package.json`: when Pi package metadata, composition,
  or versions change.

## Local plugin development

For testing a local checkout as a plugin source. End users should use the
marketplace install commands in the README.

Claude Code:

```sh
/plugin install /path/to/consult/plugin
```

Codex:

```sh
codex plugin marketplace add /path/to/consult
```

Google Antigravity (`agy`):

```sh
agy plugin install /path/to/consult/plugin
```

Cursor (local plugin directory):

```sh
mkdir -p ~/.cursor/plugins/local
cp -R /path/to/consult/plugin ~/.cursor/plugins/local/consult
```

Reload Cursor (**Developer: Reload Window**). Skills-only: do not add hooks or MCP
to the Cursor manifest until that is an explicit pack decision.

**Duplicate skills in Settings when this repo is open:** Cursor discovers
`agents/.agents/skills/` from the workspace and also loads
`~/.cursor/plugins/local/consult`. The same skill names then appear twice under
**Settings → Rules**. That is expected here; marketplace users on other
projects do not see it. While editing canonical skills in this checkout, remove
the local plugin copy (`rm -rf ~/.cursor/plugins/local/consult`) and reload. To
smoke-test the plugin bundle only, keep the local copy and open a different
folder, or stay here and accept the duplicate listing.

### Cursor Marketplace submission

After packaging validates, submit the repository at
[cursor.com/marketplace/publish](https://cursor.com/marketplace/publish).
Listing is manual review and requires an open-source license (MIT). When approved,
update the README marketplace install section with the live listing link.

The Claude Code plugin reads `plugin/.claude-plugin/plugin.json`; the Codex
plugin reads `plugin/.codex-plugin/plugin.json`; the Cursor plugin reads
`plugin/.cursor-plugin/plugin.json`; Google Antigravity treats `plugin/plugin.json`
as the plugin marker and `agy plugin install` copies the plugin into
`~/.gemini/antigravity-cli/plugins/` (re-run to pick up edits). All load the
generated skill mirror under `plugin/skills/`. Edit canonical skills under
`agents/.agents/skills/`, then run `./setup.sh` to refresh the mirror.

To refresh installed plugins through each agent's own update path after a local
change or release, run:

```sh
make update-installed-plugins-dry-run
make update-installed-plugins
```

The script invokes agent plugin commands or headless harness prompts. It does
not copy skills into plugin cache directories.
