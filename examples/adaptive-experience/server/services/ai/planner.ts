import type {
  ExperiencePlanningRequest,
  PlannerReasonCode,
} from "#shared/experience/types";

/**
 * §24 planner provider. `patch` is deliberately `unknown`: whatever a model
 * produces is untrusted until the endpoint validates it against
 * `experiencePatchSchema`. Typing it as `ExperiencePatch` would be a lie that
 * lets unvalidated output reach the client.
 */
export type PlannerProposal = {
  patch: unknown;
  confidence: number;
  reasonCode: PlannerReasonCode;
} | null;

export type PlannerProvider = {
  name: string;
  propose: (request: ExperiencePlanningRequest) => Promise<PlannerProposal>;
};

/**
 * A deterministic stand-in for a model, driven by the same anonymous context an
 * LLM would see. Keeping it behind the provider interface means the endpoint,
 * the validation and the client loop can all be exercised before any model is
 * wired in, and it stays useful afterwards as the fallback.
 */
export const mockPlanner: PlannerProvider = {
  name: "mock",
  propose: async (request) => {
    const { signals, route, comparedProductCount } = request.context;

    if (signals.comparisonIntent >= 0.5 && route.kind === "search") {
      return {
        confidence: 0.7,
        reasonCode: "comparison-intent",
        patch: {
          operations: [
            { type: "show-overlay", overlay: "assistant" },
            {
              type: "ensure-module",
              module: {
                id: "assistant",
                type: "assistant-message",
                region: "aside",
                priority: 5,
                props: {
                  message: `Comparing ${comparedProductCount} products - ask me what sets them apart.`,
                  quickActions: ["Sort by price", "Clear comparison"],
                },
              },
            },
          ],
          assistantMessage: "Let's compare these options",
        },
      };
    }

    if (signals.priceSensitivity >= 0.6) {
      return {
        confidence: 0.6,
        reasonCode: "price-sensitivity",
        patch: {
          operations: [
            { type: "set-workspace", target: "density", value: "compact" },
          ],
        },
      };
    }

    return null;
  },
};

/**
 * Returns exactly what the guardrails exist for: a plausible-looking patch that
 * names a component and smuggles in markup. The tests use it to prove validation
 * rejects it. Never wired into the endpoint.
 */
export const rogueMockPlanner: PlannerProvider = {
  name: "rogue-mock",
  propose: async () => ({
    confidence: 0.9,
    reasonCode: "comparison-intent",
    patch: {
      operations: [
        { type: "set-mode", mode: "compare", script: "alert(1)" },
        { type: "render-component", component: "<script>alert(1)</script>" },
      ],
    },
  }),
};
