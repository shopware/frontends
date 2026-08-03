import { describe, expect, it } from "vitest";

import { applyExperiencePatch } from "#shared/experience/applyPatch";
import { createDefaultContext } from "#shared/experience/context";
import { createDefaultExperiencePlan } from "#shared/experience/defaults";
import { defaultAdaptationPolicy } from "#shared/experience/policy";
import { experiencePatchSchema } from "#shared/experience/schemas";
import type {
  ExperiencePlanningRequest,
  ExperienceSignals,
} from "#shared/experience/types";

import { mockPlanner, rogueMockPlanner } from "./planner";

const request = (
  signals: Partial<ExperienceSignals> = {},
): ExperiencePlanningRequest => ({
  requestId: "r1",
  sessionId: "s1",
  planVersion: 1,
  currentPlan: { mode: "explore", routeKey: "search", moduleIds: ["grid"] },
  context: {
    route: { kind: "search" },
    signals: {
      visualInterest: 0,
      technicalInterest: 0,
      priceSensitivity: 0,
      uncertainty: 0,
      decisionReadiness: 0,
      comparisonIntent: 0,
      supportNeed: 0,
      ...signals,
    },
    comparedProductCount: 0,
    viewedProductCount: 0,
    searchCount: 0,
  },
  allowed: {
    canSwitchSalesChannelAutomatically: false,
    canChangeShell: true,
    canMoveModules: true,
    canShowAssistant: true,
  },
});

describe("mockPlanner", () => {
  it("proposes nothing without a signal worth acting on", async () => {
    expect(await mockPlanner.propose(request())).toBeNull();
  });

  it("proposes a contract-valid patch on high comparison intent", async () => {
    const proposal = await mockPlanner.propose(
      request({ comparisonIntent: 0.5 }),
    );
    expect(proposal?.reasonCode).toBe("comparison-intent");
    expect(experiencePatchSchema.safeParse(proposal?.patch).success).toBe(true);
  });
});

describe("planner output is untrusted", () => {
  // Safety must not depend on the provider behaving. A model that returns
  // component names and script tags is stopped by validation, not by hope.
  it("rejects a rogue proposal at the schema", async () => {
    const proposal = await rogueMockPlanner.propose(request());
    expect(experiencePatchSchema.safeParse(proposal?.patch).success).toBe(
      false,
    );
  });

  it("would still refuse the rogue operations if validation were bypassed", async () => {
    // Defence in depth: handed straight to the merger with the schema out of the
    // way, the closed operation set has nowhere to put these.
    const rogue = {
      operations: [
        {
          type: "ensure-module",
          module: {
            id: "x",
            type: "product-grid",
            region: "top",
            priority: 10,
            props: {},
          },
        },
        { type: "suggest-sales-channel", channelId: "other", reasonCode: "x" },
      ],
    } as never;

    const result = applyExperiencePatch(
      createDefaultExperiencePlan("search", 0),
      rogue,
      createDefaultContext("s", 0),
      defaultAdaptationPolicy,
      { source: "ai", now: 1_000 },
    );

    expect(result.accepted).toHaveLength(0);
    expect(result.rejected.map((entry) => entry.reason)).toEqual([
      "region-not-allowed",
      "not-implemented",
    ]);
  });
});
