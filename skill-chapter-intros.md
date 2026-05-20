# Skill Chapter Intros

## Accessibility

Accessibility begins with a blunt engineering fact: a system that some users cannot operate is not complete. This chapter treats WCAG, semantic HTML, keyboard flow, focus, contrast, motion preferences, and assistive technology as design constraints, not polish. Good accessibility work starts before the first custom control is built, because the cheapest accessible interface is usually the one that uses native platform behavior well. The craft is knowing where semantics already solve the problem, where ARIA is necessary, and how to prove the result with real navigation, real states, and real user paths.

## API

An API is a promise made to callers who cannot see the code behind it. This chapter starts from the contract: resources, fields, status codes, pagination, errors, idempotency, authentication, and evolution rules that integrations will bind to for years. The core discipline is to design the boundary before implementation, then change it without surprising consumers. A good API does not merely expose behavior; it gives other systems a stable language for depending on that behavior safely.

## Architecture

Architecture is the work of deciding what changes together and what must remain separate. This chapter approaches modules, packages, layers, and bounded contexts as tools for preserving understanding, not as diagrams to satisfy ceremony. The central question is whether a boundary exposes a clear contract or leaks internal steps. Good architecture keeps domain meaning local, makes data flow visible, and avoids scattering one behavior across a maze of files that only looks organized from far away.

## Async Systems

Async systems fail in the spaces between components: ownership, lifetime, ordering, cancellation, retry, and backpressure. This chapter studies those spaces directly. Queues, streams, workers, tasks, locks, live updates, and brokers are not magic concurrency dust; each one creates obligations around bounds, idempotency, delivery, shutdown, poison messages, and visibility. The engineering skill is to choose the simplest asynchronous boundary that preserves control, then make every failure mode explicit enough to test and operate.

## Code Review

Code review is defect discovery under constraints. This chapter treats review as a disciplined search for behavioral regressions, unsafe edge cases, security flaws, missing proof, dead surfaces, and complexity that will outlive the diff. A strong review starts with findings, not commentary, and it grounds each concern in impact and evidence. The reviewer protects the system's correctness and the maintainer's mental model by refusing to treat plausible code as proven code.

## Commit

A commit is a unit of reviewed change, not a bucket for whatever happened to be dirty. This chapter frames staging, splitting, and message writing as engineering controls that preserve history as a useful tool. The discipline is to package only the slice that was understood and proven, stage files by name, and write a subject that tells the next reader what changed and why it belongs together. Good commits make review, rollback, and future archaeology cheaper.

## Contract First

Contract-first work asks for agreement before callers are forced to live with a shape. This chapter covers the moment when a function signature, endpoint, event payload, CLI flag, config key, file format, schema, or module boundary becomes shared structure. The implementation can wait until the boundary is clear: who calls it, what it accepts, what it returns, what it guarantees, and what changes would be breaking. The habit prevents accidental APIs from becoming permanent debt.

## Database

Database engineering is where code meets durable truth. This chapter treats schemas, migrations, indexes, transactions, query plans, locks, deletion semantics, and production data access as changes with memory. A database change is rarely local: it affects existing rows, concurrent writers, deploy order, rollback paths, backups, and the operators who must diagnose it under pressure. The craft is to model the data honestly, move it safely, and prove that both old and new states behave under real constraints.

## Debugging

Debugging starts when the explanation is not yet earned. This chapter rejects guesswork and follows evidence: reproduce the symptom, isolate the smallest failing case, inspect the boundaries, test hypotheses, and change only what the facts support. A bug fix is complete only when the cause is named and the proof would have failed before the repair. Good debugging is less about clever intuition than about building a trail from observed failure to verified correction.

## Documentation

Documentation is engineering prose with an owner, a reader, and a reason to exist. This chapter separates durable explanation from duplicated facts that belong in code, schemas, tests, or generated references. Good docs teach terms before relying on them, put the reader's task in order, and explain context and tradeoffs that the implementation cannot carry by itself. The goal is not more words; it is fewer surprises for the next person who must understand, operate, or change the system.

## Domain Modeling

Domain modeling is the discipline of making the business rules hard to violate. This chapter begins with data shapes, values, states, transitions, invariants, parsing, and effects before it talks about classes or storage. The best model makes illegal states unrepresentable and names the difference between external input, trusted domain data, and output shape. Good domain work turns vague nouns into explicit rules, then lets the rest of the system compose around those rules.

## Error Handling

Error handling is the user-visible shape of failure. This chapter studies how errors are classified, propagated, retried, reported, recovered, and translated at boundaries. A system that catches everything understands nothing; a system that leaks raw failures teaches callers the wrong contract. Good error handling separates expected from exceptional, local from upstream, retryable from terminal, and operator detail from user message, then proves each path behaves when the happy path disappears.

## Git Workflow

Git workflow is change control for people working in time. This chapter treats branches, rebases, conflicts, history repair, recovery, force-pushes, and GitHub interactions as operations that can either preserve context or destroy it. The skill is not memorizing commands; it is knowing which history is shared, which work is user-owned, what can be rewritten safely, and how to recover when the graph stops matching the team's intent. Good Git practice keeps collaboration legible.

## Observability

Observability is how a system explains itself after it leaves the developer's machine. This chapter connects logs, metrics, traces, health checks, dashboards, alerts, redaction, and SLOs to the questions operators actually ask during incidents. Instrumentation is useful only when it identifies symptoms, scope, cause, user impact, and recovery. Good observability avoids both silence and noise by making the important state transitions visible without leaking sensitive data or drowning the signal.

## Official Source Check

Engineering memory expires faster than most teams admit. This chapter covers the discipline of checking current official sources when correctness depends on framework, runtime, SDK, browser, cloud, or platform behavior. The goal is not research theater; it is to anchor decisions in the version and authority that the system actually depends on. Good source checking names what was verified, what remains an inference, and where local convention intentionally diverges from vendor guidance.

## Performance

Performance work begins with measurement, not discomfort. This chapter treats latency, throughput, p99s, CPU, memory, allocation, I/O, cache behavior, invalidation, and hot paths as observable properties of a system under load. The engineer's job is to locate the real constraint, change the smallest thing that affects it, and prove the improvement against the workload that matters. Good performance work resists folklore, because every optimization has a cost in complexity, freshness, or capacity somewhere else.

## Proof

Proof is the difference between a claim and an engineering result. This chapter covers tests, checks, invariants, behavior specs, edge cases, and evidence as the completion gate for meaningful work. The strongest proof sits near the boundary the user or caller reaches, and it fails for the bug or behavior under discussion. Good proof is focused, current, and honest about what it does not cover; it turns "should work" into a result the next maintainer can trust.

## Refactoring

Refactoring is behavior-preserving change made in service of future clarity. This chapter treats extraction, renaming, migration, module reshaping, and simplification as work that must keep the observable contract stable while improving the structure beneath it. The discipline is to prove the old behavior, make small reversible moves, and stop before a cleanup becomes an unreviewable rewrite. Good refactoring makes the next change easier without asking users to pay for the internal repair.

## Release

Release work is where internal changes become external commitments. This chapter covers versioning, changelogs, package metadata, deprecation notes, migration plans, rollout, rollback, and compatibility promises as a separate decision from implementation. A release is not done because the code merged; it is done when the affected surfaces, users, artifacts, and recovery path are understood. Good release engineering keeps every published version telling the same truth.

## Scaffolding

Scaffolding creates the conditions under which future work can be trusted. This chapter treats a new project, package setup, quality tooling, test runner, type checker, formatter, coverage, and CI as the baseline contract for a clean clone. Feature code can wait until the toolchain proves it can fail and pass. Good scaffolding makes the boring path obvious: install, check, test, run, and understand where the next piece belongs.

## Security

Security engineering starts by deciding what must not happen. This chapter studies trust boundaries, authentication, authorization, secrets, cryptography, input validation, dependency risk, logging, egress, and agent tool surfaces through a fail-closed lens. The system must parse untrusted input at the boundary, authorize at the protected operation, and keep secrets and sensitive data out of places they do not belong. Good security work prefers maintained primitives over custom invention and treats every bypass as a design failure.

## Specify

Specification is the design conversation before code makes a choice expensive. This chapter covers discovery, tradeoffs, contracts, states, constraints, and agreed decisions for work that touches durable shape. The skill is to read the system first, propose one coherent direction, ask the smallest question that changes the design, and record only what will guide implementation. Good specifying keeps the human in control of the parts that will be hard to reverse later.

## UI Design

UI design is applied judgment about tasks, hierarchy, state, and interaction. This chapter begins with the user and the primary action, then works through layout, components, typography, color, motion, responsive behavior, and visual density. A good interface does not add decoration to compensate for unclear structure; it makes information order and available actions obvious. The craft is to use a small, consistent system of choices so the screen feels calm, capable, and direct.

## Workflow

Workflow is the meta-discipline that decides how engineering work should proceed. This chapter frames complexity as the enemy and routes each task through the smallest useful set of skills, proof obligations, and user decisions. The goal is not process for its own sake; it is to keep implementation, review, validation, and communication aligned with the actual risk of the change. Good workflow lets agents move autonomously on routine work while pausing for the choices humans must own.
