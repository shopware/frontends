import { describe, expect, it } from "vitest";

import { createDefaultExperiencePlan } from "./defaults";
import {
  experiencePatchSchema,
  experiencePlanningRequestSchema,
  experiencePlanningResponseSchema,
  experiencePlanSchema,
  productComparisonPropsSchema,
  productGridPropsSchema,
} from "./schemas";

describe("experiencePlanSchema", () => {
  it("accepts the §9 default plan", () => {
    expect(
      experiencePlanSchema.safeParse(createDefaultExperiencePlan()).success,
    ).toBe(true);
  });

  it("rejects an unknown region key (strictObject)", () => {
    const plan = createDefaultExperiencePlan() as unknown as {
      regions: Record<string, unknown>;
    };
    plan.regions.hero = [];
    expect(experiencePlanSchema.safeParse(plan).success).toBe(false);
  });

  it("rejects duplicate module ids across regions (§7 refine)", () => {
    const plan = createDefaultExperiencePlan();
    plan.regions.bottom.push({ ...plan.regions.main[0]! });
    const result = experiencePlanSchema.safeParse(plan);
    expect(result.success).toBe(false);
  });

  it("rejects more than 20 modules (§7 module-count limit)", () => {
    const plan = createDefaultExperiencePlan();
    const template = plan.regions.main[0]!;
    for (let i = 0; i < 21; i++) {
      plan.regions.bottom.push({ ...template, id: `m-${i}` });
    }
    expect(experiencePlanSchema.safeParse(plan).success).toBe(false);
  });
});

describe("experiencePatchSchema (§17 limits)", () => {
  it("rejects a patch with more than 5 operations", () => {
    const operations = Array.from({ length: 6 }, () => ({
      type: "set-mode" as const,
      mode: "compare" as const,
    }));
    expect(experiencePatchSchema.safeParse({ operations }).success).toBe(false);
  });

  it("rejects an empty patch", () => {
    expect(experiencePatchSchema.safeParse({ operations: [] }).success).toBe(
      false,
    );
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
});

describe("module prop schemas (§8, strict)", () => {
  it("defaults product-grid limit to 12 and rejects unknown props", () => {
    expect(productGridPropsSchema.parse({})).toEqual({ limit: 12 });
    expect(productGridPropsSchema.safeParse({ columns: 3 }).success).toBe(
      false,
    );
  });

  it("rejects a product-grid limit over 24", () => {
    expect(productGridPropsSchema.safeParse({ limit: 99 }).success).toBe(false);
  });

  it("requires at least two ids for a comparison", () => {
    expect(
      productComparisonPropsSchema.safeParse({ productIds: ["a"] }).success,
    ).toBe(false);
    expect(
      productComparisonPropsSchema.safeParse({ productIds: ["a", "b"] })
        .success,
    ).toBe(true);
  });
});

describe("planner endpoint contracts (§4)", () => {
  it("accepts a minimal well-formed request", () => {
    const request = {
      requestId: "r1",
      sessionId: "s1",
      planVersion: 3,
      currentPlan: { mode: "explore", routeKey: "search", moduleIds: ["g"] },
      context: {
        route: { kind: "search" },
        signals: {
          visualInterest: 0,
          technicalInterest: 0,
          priceSensitivity: 0.2,
          uncertainty: 0,
          decisionReadiness: 0,
          comparisonIntent: 0.5,
          supportNeed: 0,
        },
        comparedProductCount: 2,
        viewedProductCount: 4,
        searchCount: 1,
      },
      allowed: {
        canSwitchSalesChannelAutomatically: false,
        canChangeShell: true,
        canMoveModules: true,
        canShowAssistant: true,
      },
    };
    expect(experiencePlanningRequestSchema.safeParse(request).success).toBe(
      true,
    );
  });

  it("allows a null patch response (planner had nothing to propose)", () => {
    const response = {
      requestId: "r1",
      basedOnPlanVersion: 3,
      patch: null,
      confidence: 0.4,
      reasonCode: "no-action",
      expiresAt: "2026-07-22T00:00:00Z",
    };
    expect(experiencePlanningResponseSchema.safeParse(response).success).toBe(
      true,
    );
  });
});
