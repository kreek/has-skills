export const REMINDER = `HAS self-review — before declaring this turn done, run a final-pass self-review of your diff against HAS engineering maturity.

Apply the has:code-review skill (already installed) to your own changes.
Report findings first, in severity order, anchored to file:line. Cover the
lenses that apply to this diff:

  - Correctness & behaviour: regressions, edge cases, ordering, error shape,
    compatibility.
  - Security: trust boundaries, auth, secrets, input handling, unsafe sinks.
  - Evidence: for every behaviour-changing claim, name the proof (test +
    command + observed result) or mark it unproven with a blocker. A passing
    check that does not exercise the new behaviour is not proof. Hand off to
    has:proof if claims need new coverage.
  - Dead surface & AI-risk: speculative abstraction, defensive code with no
    real caller, unused exports, fabricated APIs, scope creep, comprehension
    debt.
  - Simplicity: hidden mutable state, tangled effects, premature abstraction.

If no issues are found, say so explicitly and name residual risk / unreviewed
scope. If the change is mechanical (rename, format, comment-only) and tooling
covers it, say so and exit.

This reminder fires once per task. Address it and finish.`;

/**
 * Checks if the assistant has already acknowledged the self-review obligation.
 */
export function alreadyAcknowledged(message) {
  if (!message || typeof message !== "string") return false;
  const lower = message.toLowerCase();
  return (
    lower.includes("self-review:") ||
    lower.includes("findings:") ||
    lower.includes("proof:") ||
    lower.includes("evidence:") ||
    lower.includes("unproven")
  );
}
