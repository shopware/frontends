import type { ExperienceRule, RuleResult } from "./types";
import { ASSISTANT_MODULE_ID } from "./vibe";

export const COMPARISON_MODULE_ID = "product-comparison";
export const PRIMARY_GRID_MODULE_ID = "primary-product-grid";

/**
 * §16. Rules are pure functions returning a `RuleResult` or null. The priority
 * orders conflicting results; the reason is for the decision log.
 */

/** §16's worked example: at least two products compared means the shopper is comparing. */
export const comparisonRule: ExperienceRule = (context, plan) => {
  const ids = context.comparedProductIds.slice(0, 4);
  if (ids.length < 2) return null;
  if (plan.mode === "compare") return null;

  return {
    ruleId: "comparison-intent",
    priority: 100,
    reason: "at-least-two-products-compared",
    patch: {
      operations: [
        { type: "set-mode", mode: "compare" },
        { type: "show-overlay", overlay: "comparisonTray" },
        {
          type: "ensure-module",
          module: {
            id: COMPARISON_MODULE_ID,
            type: "product-comparison",
            // Above the listing (§7 "top"), so the comparison is the first thing
            // seen once the shopper is comparing rather than a footer to scroll to.
            region: "top",
            priority: 10,
            props: { productIds: ids },
            // The tray reflects the shopper's own selection, so it must never be
            // held in place by the anti-flap window when they remove a product.
            minimumLifetimeMs: 0,
          },
        },
      ],
    },
  };
};

/**
 * Keeps the tray's contents honest while comparing.
 *
 * Separate from `comparisonRule`, which bails once the mode is already compare.
 * Without this, removing one of two staged products updates nothing and the tray
 * goes on rendering a product the shopper removed.
 */
export const comparisonSyncRule: ExperienceRule = (context, plan) => {
  if (plan.mode !== "compare") return null;
  const tray = plan.regions.top.find(
    (module) => module.id === COMPARISON_MODULE_ID,
  );
  if (!tray) return null;

  const ids = context.comparedProductIds.slice(0, 4);
  // The comparison props schema requires at least two ids, so at one the module
  // has to go rather than be updated into an invalid state.
  if (ids.length < 2) {
    return {
      ruleId: "comparison-sync",
      priority: 90,
      reason: "fewer-than-two-products-left",
      patch: {
        operations: [{ type: "hide-module", moduleId: COMPARISON_MODULE_ID }],
      },
    };
  }

  return {
    ruleId: "comparison-sync",
    priority: 90,
    reason: "staged-selection-changed",
    patch: {
      operations: [
        {
          type: "update-module-props",
          moduleId: COMPARISON_MODULE_ID,
          props: { productIds: ids },
        },
      ],
    },
  };
};

/** Fewer than two staged means compare mode is no longer justified. */
export const leaveCompareRule: ExperienceRule = (context, plan) => {
  if (plan.mode !== "compare" || context.comparedProductIds.length >= 2) {
    return null;
  }
  return {
    ruleId: "leave-compare",
    priority: 80,
    reason: "comparison-emptied",
    patch: {
      operations: [
        { type: "set-mode", mode: "explore" },
        { type: "hide-overlay", overlay: "comparisonTray" },
      ],
    },
  };
};

/** Repeated price sorting reads as price sensitivity: fit more on screen. */
export const priceSensitivityRule: ExperienceRule = (context, plan) => {
  if (context.signals.priceSensitivity < 0.6) return null;
  if (plan.workspace.density === "compact" && plan.workspace.columns === 3) {
    return null;
  }
  return {
    ruleId: "price-sensitivity",
    priority: 50,
    reason: "repeated-price-sorting",
    patch: {
      operations: [
        { type: "set-workspace", target: "density", value: "compact" },
        { type: "set-workspace", target: "columns", value: 3 },
        { type: "set-workspace", target: "maxWidth", value: "wide" },
      ],
    },
  };
};

/**
 * Heavy visual browsing (many products looked at) reads as an expressive,
 * image-led shopper. Rather than flip the whole storefront unasked, surface the
 * assistant to *offer* the bold Gen Z feed - the shopper accepts with one tap
 * (§16 user action). The engine drops this rule once they have decided either
 * way, so it offers once and never nags.
 */
// Low on purpose: looking at a couple of products is enough for the assistant to
// offer. The offer is opt-in, so an eager threshold costs nothing and makes the
// adaptation discoverable instead of hidden behind a long browse.
export const VISUAL_BROWSING_THRESHOLD = 0.2;
export const vibeOfferRule: ExperienceRule = (context, plan) => {
  if (context.signals.visualInterest < VISUAL_BROWSING_THRESHOLD) return null;
  if (plan.theme === "genz") return null;
  const regions = ["top", "main", "aside", "bottom"] as const;
  const hasAssistant = regions.some((region) =>
    plan.regions[region].some((module) => module.type === "assistant-message"),
  );
  if (hasAssistant) return null;
  return {
    ruleId: "vibe-offer",
    priority: 45,
    reason: "high-visual-interest",
    patch: {
      operations: [
        {
          type: "ensure-module",
          module: {
            id: ASSISTANT_MODULE_ID,
            type: "assistant-message",
            region: "aside",
            priority: 20,
            props: {
              message:
                "You've clearly got an eye. Want a bolder, feed-style view?",
            },
            minimumLifetimeMs: 0,
          },
        },
      ],
    },
  };
};

export const localRules: readonly ExperienceRule[] = [
  comparisonRule,
  comparisonSyncRule,
  leaveCompareRule,
  priceSensitivityRule,
  vibeOfferRule,
];

/**
 * §16 conflict handling: sort by priority, highest first. Each result is applied
 * against the plan the previous one left, so the merger stays the only thing
 * that decides what is legal.
 */
export function evaluateLocalRules(
  rules: readonly ExperienceRule[],
  context: Parameters<ExperienceRule>[0],
  plan: Parameters<ExperienceRule>[1],
): RuleResult[] {
  return rules
    .map((rule) => rule(context, plan))
    .filter((result): result is RuleResult => result !== null)
    .sort((a, b) => b.priority - a.priority);
}
