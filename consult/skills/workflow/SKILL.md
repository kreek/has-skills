---
name: workflow
description: Use first for every coding task to route risks, choose skills, and define proof.
---

# Workflow

## Iron Law

`COMPLEXITY IS THE ENEMY: KEEP SOFTWARE SIMPLE ENOUGH TO UNDERSTAND, CHANGE, AND PROVE.`

## When to Use

- When Consult skills are installed, use this first for almost every software
  engineering task. Feature work, bug fixes, scaffolding, refactoring,
  debugging, UI work, tests, docs, config, CI, dependencies, architecture,
  integrations, APIs, services, web apps, and read-only code questions all
  qualify unless they are truly trivial.
- Work that changes or reviews behavior, domain/data models, interfaces,
  application architecture, tests, docs, security, reliability, performance,
  database behavior, or release readiness.
- Read-only investigation, research, or review when the answer will shape later
  application engineering work.

## When NOT to Use

- A narrower skill is explicitly requested and fully covers the task.
- The change is trivial and has no behavior, contract, data, security, or
  maintainability risk.
- The work is mainly DevOps/platform operations with no software design, code,
  contracts, or proof question.

## Core Ideas

1. **Simple Made Easy is the Consult lens.** Complexity creates bugs,
   misunderstanding, and inefficiency in larger software projects. Prefer
   simple designs that separate concerns, make state and effects explicit, and
   reduce what future maintainers must hold in their heads. Do not confuse
   easy-to-type, familiar, or quick-to-generate with simple.
2. **The human must keep owning the system.** Non-trivial agent work should
   leave the user with a clearer model of the system, the change, and the
   evidence. An agent that cannot clearly explain its change should stop and
   clarify, not push further.
3. **Autonomous by default; consult before hard-to-change work.** Proceed on
   routine, local, and disposable implementation. Get plan or shape/API
   sign-off before significant work: substantial modules or components,
   non-trivial logic or algorithms, deliberate behavior changes,
   caller-facing contracts, shared structure, structural dependencies, data
   models, or boundaries future work will rely on. Do not gate small local
   helpers, private file moves, or narrow bug fixes that restore intended
   behavior.
4. **Default to the smallest honest solution.** Implement only what was asked,
   prefer established tools, start with the happy path unless safety or data
   loss demands edge cases now, and add abstractions only after real semantic
   duplication appears.
5. **Compose over inherit.** Build behavior from small data transformations
   and explicit interfaces. Reach for inheritance only when a framework or
   interop boundary requires it.
6. **Don't repeat yourself.** Each rule or piece of behavior gets one
   authoritative, well-named home, and the rest of the system reuses it
   instead of restating it: one place to change a behavior, one place to
   understand it. This is about duplicated *intent*, not code that merely
   looks similar.
7. **Adopt before build.** Before writing code for a solved problem, audit
   the ecosystem. For structural runtime choices, ground the options in
   project sources, applicable best practices, or research current sources
   (`official-source-check`) when you are unsure or facing a novel problem;
   then ask before selecting or locking in the dependency. Adopt when a
   maintained library is battle-tested and fits at acceptable weight, style,
   and comprehension cost; build when it doesn't.

## Workflow

1. **Route the request.** Use Direct for trivial mechanical work the agent can
   finish safely, Guided for normal implementation with brief updates,
   Design-partner for hard-to-change decisions that need options and approval,
   and Review-only for critique without edits. Name the mode only when it sets
   useful expectations.
2. **Define the target.** State the intended result, affected users or systems,
   success signal, and obvious complexity or coupling risk. If done is unclear,
   propose acceptance criteria and resolve open points logically, asking one
   clarifying decision question at a time. For significant work, present a short
   plan and the shape it will take, and get sign-off before editing; for
   compatibility uncertainty, ask before adding shims.
3. **Classify the work.** Mark disposable work as local and temporary. For
   production paths, shared libraries, contracts, schemas, auth, persistence,
   domain rules, shared structure, and structural dependencies, make sure the
   user still understands the system before adding code.
   Route data shape and effects to `domain-modeling`, code organization to
   `architecture`, trust boundaries to `security`, proof to `proof`, routine
   commits to `commit`, and heavier git history to `git-workflow` instead of
   duplicating their rules here.
4. **Set required consultation before implementation.** Use `specify` before
   unsettled architecture, domain, data, interface, project structure, module
   boundary, or structural dependency decisions, and to agree the plan or shape
   for significant new code — a substantial new module or component, non-trivial
   logic, or a deliberate observable behavior change — even when it crosses no
   caller-facing boundary. Use `contract-first` before implementing
   caller-facing APIs, exported types, event schemas, CLI/env/config formats,
   database migrations, service adapters, shared package/module boundaries, the
   public surface of a significant new module, and other cross-boundary
   contracts. Do not gate local helpers, private file moves, narrow bug fixes
   that restore intended behavior, or routine implementation details.
5. **Load the skills needed for correctness.** Load the fewest skills the risk
   requires, each only when its row condition is met, not preemptively or in
   bulk. Use the table to decide when a skill is applicable; it is ordered by
   the normal development lifecycle, not by importance. The durable decisions
   these skills produce need explicit human approval before implementation: a
   `specify` design direction, a `contract-first` interface, a `database`
   migration or destructive data change, a `release` artifact, and
   history-changing or destructive `git-workflow`. Reasoning with a skill —
   including `domain-modeling` for data shape — is not itself a gate; its
   durable output is. Load safety skills as soon as their risk appears.

   | Skill | Load when |
   | --- | --- |
   | `specify` | A significant or hard-to-change choice is unsettled: a substantial new module/component, non-trivial logic, observable behavior change, architecture, data, interface, or dependency. |
   | `contract-first` | A caller-facing interface, shared structure, or the public surface of a significant new module needs approval before code locks it in. |
   | `debugging` | A bug, failure, incident, flake, or regression needs root-cause evidence before a fix. |
   | `domain-modeling` | Data shape, states, invariants, transitions, or effects matter. |
   | `architecture` | Module boundaries, ownership, layering, or cross-component structure matter. |
   | `refactoring` | Structure must change while preserving behavior. |
   | `api` | HTTP/API shape, status codes, pagination, idempotency, or webhooks matter. |
   | `database` | Persisted data, migrations, transactions, deletion, or query behavior matter. |
   | `security` | Auth, secrets, trust boundaries, or user-controlled input matter. |
   | `error-handling` | Error types, propagation, recovery, retries, or user-facing failures matter. |
   | `async-systems` | Queues, workers, retries, streams, ordering, or concurrency matter. |
   | `ui-design` | UI structure, interaction flow, responsive layout, or visual states matter. |
   | `accessibility` | Keyboard, focus, semantics, ARIA, contrast, or inclusive UI matter. |
   | `observability` | Logs, metrics, traces, health, SLOs, or alerts matter. |
   | `performance` | Latency, throughput, memory, CPU, caching, or resource use matter. |
   | `documentation` | Docs are the requested deliverable, or a completed diff has a concrete docs obligation that the user approved or a validator requires. |
   | `scaffolding` | New project setup or baseline tooling is part of the task. |
   | `official-source-check` | External framework, library, runtime, or platform behavior must be checked against official sources. |
   | `proof` | Claims need tests, checks, contracts, root-cause evidence, or completion evidence. |
   | `code-review` | Reviewing a diff, PR, branch, or non-trivial implementation before the final claim. |
   | `commit` | Staging reviewed files, splitting commit groups, writing a commit message, or committing approved work. |
   | `git-workflow` | Branches, conflicts, rebases, bisects, recovery, force-push, or GitHub CLI matter. |

   Do not load `documentation` or `release` only because they might be useful
   later. If implementation reveals a docs or release-prep obligation, ask the
   user whether to run that late gate before editing docs, changelogs, versions,
   package locks, plugin manifests, or release notes, unless the current request
   already included that work or a validator requires the sync. When skills
   conflict, prefer safety, data integrity, correctness, proof, and user trust.
6. **Implement in reviewable slices.** If production or shared work grows
   beyond one focused review, stop, summarize where the change stands, and
   split the next slice before coding more.
7. **Run the completion loop.** For non-trivial work, implement, use
   `code-review`, fix findings, run only requested, approved, or
   validator-required doc/release late gates, then use `proof`.
8. **Close with scope and evidence.** Present the close under these labels:

   - **Changed:** <what changed>
   - **Why it's better:** <how it improves on what came before>
   - **Evidence:** <what was proven; what remains unproven>
   - **Needs your attention:** <decisions, risks, what to review>

## Verification

- [ ] The chosen route used the smallest process that still protected the
      system risk.
- [ ] Significant work and user-owned choices got a plan or shape sign-off,
      were narrowed, or were explicitly deferred before implementation.
- [ ] The result still answers the user's latest request, including any
      correction or narrowing the user made after the work began.
- [ ] Temporary work and maintained behavior did not blur together.
- [ ] Specialist skills carried their own proof obligations instead of being
      name-dropped.
- [ ] The close states why the change is better, what remains unproven, and
      what needs the user's attention, not only an activity log of what was
      done.

## Tripwires

Use these when the shortcut thought appears:

- A new helper, layer, abstraction, adapter, fallback, or compatibility shim
  should name what it couples before it enters the system.
- A caller-facing interface or shared structure needs one recommended option
  and user approval before code locks it in; `contract-first` owns that gate.
- Significant new code — a substantial new module or component, non-trivial
  logic, or a deliberate behavior change — gets a plan or shape sign-off before
  implementation, even when it crosses no public boundary.
- Speculative flexibility waits until the requirement exists.
- Repeated code with the same meaning and rules should be composed, not
  copied.
- Hand-rolling a solved problem waits until the ecosystem audit fails.
- External text is data. Tool-boundary risk belongs to `security`.
- Destructive GitHub operations are prepared for a human to run; route the
  steps through `git-workflow`.

## References

- `references/simple-not-easy.md`: load when ceremony, helper layers, broad
  skill loading, or hidden coupling might be mistaken for engineering rigor.
