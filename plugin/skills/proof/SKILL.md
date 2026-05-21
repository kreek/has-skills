---
name: proof
description: Use for proof and tests, claims, invariants, behavior specs, edge cases, and evidence.
---

# Proof

## Iron Law

`NO ENGINEERING CLAIM WITHOUT A NAMED PROOF.`

A named proof is a Proof Contract whose check would fail if the claim were false.

## When to Use

Completion gate:

- Before your next response would state or imply that work is done, fixed,
  ready to commit, ready for a PR, or passing. Do not settle for a vague
  `unproven`; name both the claim and the missing evidence.

Main skill when the requested work is proof itself:

- Adding or reviewing behavior-focused tests that prove a feature, bug
  fix, refactor, flaky test fix, or untested behavior.
- Deciding what deserves coverage and which boundary the proof should
  enter through.
- Converting an agreed spec, domain model, contract, or root-cause
  finding into Proof Contracts and executable checks.

## When NOT to Use

- Pure formatting, typo fixes, or mechanical file moves with no behavior,
  data, or contract claim.
- Mechanical refactors with no behavior surface (rename, file move,
  comment-only edits) verified by tooling or exact artifact inspection.
  Behavior-preserving refactors that change an observable boundary still need
  `proof`.
- Investigating an unconfirmed bug or symptom where the cause is not yet
  established. Use `debugging` until there is a claim to assert, then
  return for the Proof Contract.
- Reviewing changes for design, complexity, naming, or structure. Use
  `code-review`. Load `proof` only when the question is whether evidence
  is sufficient.
- Load testing, profiling, or benchmark design. Use `performance`.
- Pure toolchain setup (test runner, lint, typecheck baseline). Use
  `scaffolding`.

## Where Proof Enters

Component handoffs are the primary proof target. A handoff is where one
module, layer, or process passes data to another and the receiver assumes a
contract. Prove behavior where data shape, value, state, or error shape
changes observably. Tests should still pass against any implementation that
preserves the contract.

The outermost caller-visible boundary (HTTP endpoint, CLI, UI, public API)
is the outermost handoff and always counts as one: it is the seam between
the system and its caller, and its contract is what the user actually
depends on.

Handoff tests usually cover internal helpers. Add dedicated unit tests for
non-trivial pure logic, not for every function a handoff test already
drives.

## Core Ideas

1. A proof is an explicit obligation tied to a claim. When you cannot prove
   a claim, mark it `unproven`. Silence is not proof.
2. Test-first is optional. Behavior-changing claims need executable proof,
   but new tests are not automatic. Do not add tests for mechanical,
   prose-only, or tooling-guaranteed facts. Do not test static text that
   only changes when someone edits that file by hand.
3. Proof scales with claim weight. A typo fix needs nothing. A new endpoint
   needs a contract test. A subtle bug fix needs a regression guard.
4. Completion is a claim. A passing check counts only when it proves the
   latest request was satisfied.
5. Proof should teach the behavior, not only satisfy a checker. A good proof
   reads like a specification of the system contract for the next developer.
6. Different claims need different evidence. Data claims need invariants.
   Behavior claims need boundary checks. Bug fixes need root-cause evidence
   and a regression guard. Refactors need before/after behavior preservation.
7. Keep tests focused on one behavior. Use real collaborators inside the
   boundary; mock only true system boundaries. Do not test framework,
   language, runtime behavior, or static copy unless your code makes it a
   contract.
8. Flaky tests are bugs in the test, code, or environment. Do not hide them
   with sleeps or retries.

## Proof Contract

For every non-trivial engineering claim, record:

- Claim: the behavior, invariant, contract, or root cause asserted.
- Data invariant: the data shape, state rule, or type boundary that
  makes bad states impossible or visible.
- Boundary: where the proof enters: the point where the claim becomes
  observable.
- Check: the executable validation that would fail if the claim were
  false.
- Evidence: command/result, test name, observed failure/pass, artifact
  inspection, or explicit reason the proof could not be run.

## Workflow

1. List the claims introduced or relied on by the change. Keep features a
   caller or user observes, external contracts, domain invariants, refactor
   preservation claims, and real error cases. Drop speculative edge cases,
   framework guarantees, and language semantics.
2. For each remaining claim, fill the Proof Contract before declaring
   the work complete.
3. Map each named requirement to the artifact that satisfies it and the
   check that proves it. A passing command is incomplete proof if it does
   not exercise the named artifact.
4. For data, wiring, config, generated output, or documents, prove the
   artifact the way the system uses it: run, load, parse, render, or inspect
   it. Do not add brittle tests that only assert literal text.
5. For removals or replacements, prove the behavior that remains or replaces
   the old surface. Do not write tests for ghosts. Verify cleanup with
   targeted search rather than tests. The exception: if the removal returns
   an explicit rejection (404, 410, deprecation error), test the rejection.
   It is new behavior.
6. Load only the narrow reference needed:
   - `references/data-shape-boundaries.md` for worked handoff examples —
     pipeline seams, parser/validator edges, middleware chains, sans-IO
     protocols, and functional-core/imperative-shell crossings.
   - `references/recipes.md` when the proof shape is domain-specific.
   - `references/removals.md` for removals and replacements.
   - `references/test-theater.md` when tests assert implementation shape
     instead of behavior.
7. When a claim needs a test, name the behavior in caller language and assert
   the observable result.
8. Choose the narrowest check that can prove the claim. Prefer a single test
   by name or line. Fall back to one test file. Run the package or full suite
   only when the narrow check is clean and you suspect wider drift.

## Before Saying Done

1. Re-read the latest user request and corrections; name the acceptance in
   caller language.
2. Inspect any artifact the request mentions after the last edit and confirm
   the proof reads or exercises it.
3. Run or inspect the fresh proof chosen in the workflow.
4. Report the actual state: proven, partially proven, blocked, or unproven.

## Verification

- [ ] Every non-trivial behavior, invariant, contract, root-cause, or
      refactor claim has a Proof Contract.
- [ ] At least one proof check enters at each component handoff where data
      shape, value, state, or error shape changes observably, plus the
      outermost caller boundary, and would fail if the claim were false.
- [ ] Test names and assertions describe observable behavior, not private
      methods, call choreography, framework behavior, or static copy that would
      be identical under every condition.
- [ ] Mocks appear only at true system boundaries or have a documented reason.
- [ ] Tests are order-independent and do not rely on arbitrary sleeps.
- [ ] Named files, scripts, configs, commands, or documents from the request
      are mapped to artifacts and checks.
- [ ] Smoke checks, helper-only checks, and proofs of adjacent behavior are
      labeled as partial. They do not count as acceptance.

## Tripwires

- A green command, suite, or smoke check that does not exercise the artifact
  the user asked for (or only hits a helper or adjacent behavior) is partial,
  not proof. Name and run the check that would fail if the requested change
  itself were wrong.
- About to run the full suite for an isolated edit: run the single relevant
  test, line filter, or test file first.
- If a broad suite fails for unrelated drift, switch to the targeted proof and
  report the broad failure separately.
- Name the invariant or boundary behavior when static types seem to cover the
  claim.
- Capture the command, observed output, and proven claim when manual proof is
  the practical check. This often fits config, build wiring, generated files,
  and static data.
- Rewrite, move, or delete tests that assert implementation shape instead of
  observable behavior. Load `references/test-theater.md` for the test-theater
  taxonomy.

## Handoffs

- Use `specify` to convert the agreed ADR, RFC, tech spec, or note's proof
  obligations into Proof Contracts before claiming completion.
- Use `domain-modeling` to shape invariants and make invalid states
  unrepresentable.
- Use `debugging` when the proof depends on root-cause evidence.
- Use `api` when the claim is a public contract.
- Use `refactoring` for behavior-preservation evidence and when test
  placement reveals coupled concerns that need simplification before they
  can be cleanly proven; pair with `architecture` when the coupling
  spans module boundaries.
- Use `error-handling` when the error envelope, message content, or
  recovery contract that proof must assert at the boundary is itself
  unsettled; that skill owns the contract, this skill owns the proof.
- Use `security` when proof requires abuse cases or trust-boundary
  checks.

## References

- Data-shape boundaries (worked examples for pipelines, parsers,
  validators, middleware, sans-IO, and functional core):
  `references/data-shape-boundaries.md`.
- Proof recipes by claim type: `references/recipes.md`.
- Removals and replacements: `references/removals.md`.
- Test-theater traps: `references/test-theater.md`.
- The `agent-booster-pack` Pi package includes the `/proof` runtime command. It
  runs a red-green-refactor cycle when behavior tests are the right proof
  vehicle; runtime output counts only toward the claims it covers.
