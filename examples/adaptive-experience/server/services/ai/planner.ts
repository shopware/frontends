import type { ExperiencePlanRequest } from "#shared/experience/types";

/**
 * A planner provider proposes a patch from the anonymous context.
 *
 * The return type is deliberately `unknown`: whatever a model produces is
 * untrusted text until the endpoint has validated it against
 * `experiencePatchSchema`. Typing this as `ExperiencePatch` would be a lie that
 * lets an unvalidated object reach the client.
 */
export type PlannerProvider = {
  name: string;
  propose: (request: ExperiencePlanRequest) => Promise<unknown>;
};

/**
 * Stand-in for a real model, driven by the same context an LLM would see.
 *
 * Keeping a deterministic provider behind the same interface means the endpoint,
 * the validation and the client loop can all be exercised before any model is
 * wired in, and it stays useful afterwards as the fallback when the provider is
 * slow or unavailable.
 */
export const mockPlanner: PlannerProvider = {
  name: "mock",
  propose: async (request) => {
    const { context } = request;

    if (context.comparisonIntent >= 1 && context.routeKind === "listing") {
      return {
        operations: [
          { type: "show-overlay", overlay: "assistant" },
          {
            type: "ensure-module",
            moduleId: "assistant",
            moduleType: "assistant-panel",
            region: "sidebar",
            props: {
              message: `Comparing ${context.comparisonCount} products. Ask me what sets them apart.`,
            },
          },
        ],
        assistantMessage: "Let's compare these options",
      };
    }

    if (context.priceSensitivity >= 1) {
      return {
        operations: [{ type: "set-workspace", density: "compact" }],
      };
    }

    return null;
  },
};

/**
 * A provider that returns exactly the kind of output the guardrails exist for:
 * a plausible-looking patch that names a component and smuggles in markup.
 * Used by the endpoint's tests to prove validation rejects it.
 */
export const rogueMockPlanner: PlannerProvider = {
  name: "rogue-mock",
  propose: async () => ({
    operations: [
      { type: "set-mode", mode: "compare", script: "alert(1)" },
      { type: "render-component", component: "<script>alert(1)</script>" },
    ],
  }),
};
