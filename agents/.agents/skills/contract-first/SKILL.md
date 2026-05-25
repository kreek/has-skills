---
name: contract-first
description: Use when caller-facing interfaces or shared structure need approval before implementation.
---

# Contract First

## Iron Law

`CALLER-FACING INTERFACES AND SHARED STRUCTURE MUST BE APPROVED BEFORE IMPLEMENTATION.`

## When to Use

- A task defines or materially changes a caller-facing interface or shared structure:
  exported function, public type, HTTP endpoint, CLI/env/config surface, event
  payload, file format, database schema, migration step, package/module
  boundary, the public surface of a significant new module or component, project
  layout, or cross-component contract.
- A manual or installed Interface Design Gate asks for current interface,
  proposed interface, boundary reason, and user decision.
- Reviewing whether implementation started before contract approval.

## When NOT to Use

- Purely internal helper changes with no caller-facing or shared boundary
  outside the helper.
- Local file moves, private implementation organization, or refactors that do
  not create a package/module boundary future work will depend on.
- Typos, formatting, comment-only edits, or docs-only changes with no contract
  effect.
- Broad routing and skill selection; use `workflow`.
- Collaborative design exploration before a concrete interface proposal; use
  `specify`.

## Core Ideas

1. Contract-first is an approval gate, not a design conversation. If the shape
   is still being explored, use `specify` first.
2. The shape is concrete enough for another caller, process, service,
   user, migration step, package, or future module to depend on it.
3. Approval covers the named shape only. Compatibility, rollout, renames,
   removals, and shims need their own explicit decision.

## Workflow

1. **Stop before implementation lands.** Do not write source, migrations, or
   config that commit the boundary until approval is recorded.
2. **Name the current shape.** Cite file/line evidence, or state "new
   interface" or "new structure" for greenfield work.
3. **Propose the new shape.** Show the concrete signature, type, endpoint,
   CLI/env/config surface, event payload, schema, migration step, file format,
   package/module boundary, or project layout future work will bind to.
4. **Explain the boundary.** State why it belongs here, what owns each side,
   and the key tradeoff in the recommended option.
5. **Separate compatibility.** For public renames or removals, ask for a
   breaking change, alias/shim, deprecation path, or old surface retained.
6. **Record the decision.** List each proposed surface (signature, flags,
   schema, event payload, file format, or output shape) with its evidence,
   state the compatibility impact, and get one approve/revise/reject. An
   approving design or RFC is not this approval; this list is. Silence is not
   approval.
7. **Implement only the approved shape.** If implementation discovers a
   materially different contract, reopen the gate.

## Verification

- [ ] The current interface or structure is named with evidence, or marked as
      new.
- [ ] The proposed shape is concrete enough for callers or future modules to
      bind to.
- [ ] Boundary ownership and compatibility decisions are explicit.
- [ ] The proposed interfaces were listed for the user, who approved, revised,
      or rejected them before implementation landed.
- [ ] Implementation matches the approved shape, or the gate was reopened.

## Optional Runtime Backstop

Some Consult installations include the manual Interface Design Gate runtime. Use
`/consult:contract [intent]` to start it when available.

## Handoffs

- `workflow`: broad routing.
- `specify`: unsettled contract shape.
- `api`, `database`, `async-systems`, `security`: domain boundary risks.
- `architecture`: shared package/module/project structure.
- `proof`: prove the approved interface at the handoff where callers cross
  it; an approved contract without seam proof is unproven.
