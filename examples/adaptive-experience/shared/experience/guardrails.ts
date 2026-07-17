import type { ExperiencePatch, ExperienceSource, RouteKind } from "./types";

/**
 * Policy checks that run before the merger.
 *
 * The merger answers "is this operation structurally legal?". Guardrails answer
 * "should we be adapting at all right now?" - a patch can be perfectly valid and
 * still be the wrong thing to apply mid-payment.
 */
export type GuardrailVerdict =
  | { allowed: true }
  | { allowed: false; reason: GuardrailReason };

export type GuardrailReason =
  | "checkout-locked"
  | "stale-plan-version"
  | "cooldown-active";

export type GuardrailInput = {
  patch: ExperiencePatch;
  source: ExperienceSource;
  routeKind: RouteKind;
  /** Plan version the patch was computed against. */
  patchPlanVersion: number;
  currentPlanVersion: number;
};

const ALLOWED = { allowed: true } as const;

/**
 * Checkout lock: no structural adaptation while the shopper is paying.
 *
 * The user's own actions are exempt - they are the one actor allowed to change
 * their view mid-checkout - but rules and AI are frozen out entirely.
 */
export function checkGuardrails(input: GuardrailInput): GuardrailVerdict {
  if (input.routeKind === "checkout" && input.source !== "user") {
    return { allowed: false, reason: "checkout-locked" };
  }

  // Stale response rejection: the plan moved on while the patch was in flight,
  // so the patch was computed against a view that no longer exists.
  if (input.patchPlanVersion !== input.currentPlanVersion) {
    return { allowed: false, reason: "stale-plan-version" };
  }

  return ALLOWED;
}
