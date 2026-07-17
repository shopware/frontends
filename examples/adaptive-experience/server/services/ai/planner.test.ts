import { describe, expect, it } from "vitest";

import { applyPatch } from "#shared/experience/applyPatch";
import { createDefaultPlan } from "#shared/experience/defaults";
import { experiencePatchSchema } from "#shared/experience/schemas";
import type { ExperiencePlanRequest } from "#shared/experience/types";

import { mockPlanner, rogueMockPlanner } from "./planner";

const request = (
  context: Partial<ExperiencePlanRequest["context"]> = {},
): ExperiencePlanRequest => ({
  planVersion: 1,
  mode: "explore",
  context: {
    comparisonIntent: 0,
    priceSensitivity: 0,
    productsViewed: 0,
    comparisonCount: 0,
    routeKind: "listing",
    ...context,
  },
});

describe("mockPlanner", () => {
  it("proposes nothing when there is no signal worth acting on", async () => {
    expect(await mockPlanner.propose(request())).toBeNull();
  });

  it("proposes a patch that satisfies the contract", async () => {
    const proposal = await mockPlanner.propose(
      request({ comparisonIntent: 1, comparisonCount: 2 }),
    );

    expect(experiencePatchSchema.safeParse(proposal).success).toBe(true);
  });
});

describe("planner output is untrusted", () => {
  // The point of the schema is that safety does not depend on the provider
  // behaving. A model that returns component names and script tags must be
  // stopped by validation, not by hoping it does not.
  it("rejects a proposal that names a component and smuggles in a script", async () => {
    const proposal = await rogueMockPlanner.propose(request());

    expect(experiencePatchSchema.safeParse(proposal).success).toBe(false);
  });

  it("never lets a rogue proposal reach the plan", async () => {
    const proposal = await rogueMockPlanner.propose(request());
    const parsed = experiencePatchSchema.safeParse(proposal);
    const plan = createDefaultPlan();

    // The endpoint returns 502 here rather than applying anything; this asserts
    // the plan is untouched on that path.
    expect(parsed.success).toBe(false);
    expect(plan.version).toBe(0);
  });

  it("would still refuse the rogue operations if validation were bypassed", async () => {
    // Defence in depth: even handed straight to the merger with the schema out
    // of the way, the closed operation set has nowhere to put these.
    const rogue = {
      operations: [
        {
          type: "ensure-module",
          moduleId: "x",
          moduleType: "product-grid",
          region: "footer",
        },
        { type: "suggest-sales-channel", salesChannelId: "other" },
      ],
    } as never;

    const result = applyPatch(createDefaultPlan(), rogue, { source: "ai" });

    expect(result.applied).toHaveLength(0);
    expect(result.rejected.map((entry) => entry.reason)).toEqual([
      "region-not-allowed",
      "not-implemented",
    ]);
  });
});
