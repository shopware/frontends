import { describe, expect, it } from "vitest";

import { checkGuardrails, type GuardrailInput } from "./guardrails";
import type { ExperiencePatch } from "./types";

const patch: ExperiencePatch = {
  operations: [{ type: "set-mode", mode: "compare" }],
};

const input = (overrides: Partial<GuardrailInput> = {}): GuardrailInput => ({
  patch,
  source: "rule",
  routeKind: "listing",
  patchPlanVersion: 3,
  currentPlanVersion: 3,
  ...overrides,
});

describe("checkGuardrails", () => {
  it("allows a current patch on a listing", () => {
    expect(checkGuardrails(input())).toEqual({ allowed: true });
  });

  describe("checkout lock", () => {
    it.each(["rule", "ai", "default"] as const)(
      "freezes out %s patches during checkout",
      (source) => {
        expect(
          checkGuardrails(input({ routeKind: "checkout", source })),
        ).toEqual({ allowed: false, reason: "checkout-locked" });
      },
    );

    it("still lets the shopper change their own view during checkout", () => {
      expect(
        checkGuardrails(input({ routeKind: "checkout", source: "user" })),
      ).toEqual({ allowed: true });
    });
  });

  describe("stale response rejection", () => {
    it("rejects a patch computed against an older plan", () => {
      expect(
        checkGuardrails(input({ patchPlanVersion: 2, currentPlanVersion: 3 })),
      ).toEqual({ allowed: false, reason: "stale-plan-version" });
    });

    it("rejects a patch claiming a version the plan has not reached", () => {
      expect(
        checkGuardrails(input({ patchPlanVersion: 9, currentPlanVersion: 3 })),
      ).toEqual({ allowed: false, reason: "stale-plan-version" });
    });
  });

  it("reports the checkout lock first when a patch is both stale and mid-checkout", () => {
    const verdict = checkGuardrails(
      input({ routeKind: "checkout", patchPlanVersion: 1 }),
    );

    expect(verdict).toEqual({ allowed: false, reason: "checkout-locked" });
  });
});
