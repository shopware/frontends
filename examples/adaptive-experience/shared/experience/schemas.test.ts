import { describe, expect, it } from "vitest";

import { createDefaultPlan } from "./defaults";
import {
  experiencePatchSchema,
  experiencePlanSchema,
  MAX_OPERATIONS_PER_PATCH,
} from "./schemas";

describe("experiencePlanSchema", () => {
  it("accepts the default plan", () => {
    expect(experiencePlanSchema.safeParse(createDefaultPlan()).success).toBe(
      true,
    );
  });

  it("rejects a plan with an unknown region", () => {
    const plan = createDefaultPlan() as unknown as Record<string, unknown>;
    plan.regions = { ...createDefaultPlan().regions, hero: [] };

    expect(experiencePlanSchema.safeParse(plan).success).toBe(false);
  });
});

describe("experiencePatchSchema", () => {
  it("accepts the shape the gist documents for an AI response", () => {
    const result = experiencePatchSchema.safeParse({
      operations: [
        { type: "set-mode", mode: "compare" },
        { type: "move-module", moduleId: "comparison", region: "main" },
      ],
      assistantMessage: "Let's compare these options",
    });

    expect(result.success).toBe(true);
  });

  it("rejects an operation type outside the closed set", () => {
    const result = experiencePatchSchema.safeParse({
      operations: [{ type: "render-component", component: "<script>" }],
    });

    expect(result.success).toBe(false);
  });

  it("rejects unknown keys smuggled onto a valid operation", () => {
    const result = experiencePatchSchema.safeParse({
      operations: [{ type: "set-mode", mode: "compare", script: "alert(1)" }],
    });

    expect(result.success).toBe(false);
  });

  it("rejects an empty patch", () => {
    expect(experiencePatchSchema.safeParse({ operations: [] }).success).toBe(
      false,
    );
  });

  it("rejects a patch larger than the operation limit", () => {
    const operations = Array.from(
      { length: MAX_OPERATIONS_PER_PATCH + 1 },
      () => ({ type: "set-mode", mode: "compare" }),
    );

    expect(experiencePatchSchema.safeParse({ operations }).success).toBe(false);
  });

  it("rejects an oversized assistant message", () => {
    const result = experiencePatchSchema.safeParse({
      operations: [{ type: "set-mode", mode: "compare" }],
      assistantMessage: "x".repeat(281),
    });

    expect(result.success).toBe(false);
  });
});
