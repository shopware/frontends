import type {
  ExperienceContext,
  ExperiencePatch,
  ExperiencePlan,
  ExperienceSignals,
} from "./types";

export const COMPARISON_MODULE_ID = "comparison";
export const PRODUCT_GRID_MODULE_ID = "product-grid";

/**
 * A local rule: pure, synchronous, and free to return null when it has nothing
 * to say. Rules never mutate; they propose a patch that the merger may still
 * reject.
 */
export type ExperienceRule = {
  id: string;
  evaluate: (
    signals: ExperienceSignals,
    plan: ExperiencePlan,
  ) => ExperiencePatch | null;
};

/** Two or more products staged for comparison means the shopper is comparing. */
const compareOnComparisonIntent: ExperienceRule = {
  id: "compare-on-comparison-intent",
  evaluate: (signals) => {
    if (signals.comparisonProductIds.length < 2) return null;
    return {
      operations: [
        { type: "set-mode", mode: "compare" },
        {
          type: "ensure-module",
          moduleId: COMPARISON_MODULE_ID,
          moduleType: "comparison-tray",
          region: "main",
          priority: 0,
        },
        {
          type: "update-module-props",
          moduleId: COMPARISON_MODULE_ID,
          props: { productIds: signals.comparisonProductIds },
        },
      ],
      assistantMessage: "Comparing your selection",
    };
  },
};

/**
 * Back out of compare mode once the shopper has emptied the tray, so the UI does
 * not get stuck in a mode the selection no longer justifies.
 */
const leaveCompareWhenTrayEmpty: ExperienceRule = {
  id: "leave-compare-when-tray-empty",
  evaluate: (signals, plan) => {
    if (plan.mode !== "compare" || signals.comparisonProductIds.length > 0) {
      return null;
    }
    return {
      operations: [{ type: "set-mode", mode: "explore" }],
    };
  },
};

/** Repeated sorting by price reads as price sensitivity: fit more products on screen. */
const densifyOnPriceSensitivity: ExperienceRule = {
  id: "densify-on-price-sensitivity",
  evaluate: (signals) => {
    if (signals.priceSortCount < 2) return null;
    return {
      operations: [
        { type: "set-workspace", density: "compact", width: "wide" },
        {
          type: "update-module-props",
          moduleId: PRODUCT_GRID_MODULE_ID,
          props: { columns: 4 },
        },
        { type: "set-shell", header: "compact", navigation: "minimal" },
      ],
    };
  },
};

export const localRules: readonly ExperienceRule[] = [
  compareOnComparisonIntent,
  leaveCompareWhenTrayEmpty,
  densifyOnPriceSensitivity,
];

/**
 * Reduces the local signals to the scalar projection the planner endpoint is
 * allowed to see. Identifiers are dropped here, not at the call site, so there
 * is one place to audit what leaves the browser.
 */
export function toAiContext(signals: ExperienceSignals): ExperienceContext {
  return {
    comparisonIntent: Math.min(signals.comparisonProductIds.length / 2, 1),
    priceSensitivity: Math.min(signals.priceSortCount / 3, 1),
    productsViewed: signals.productsViewed,
    comparisonCount: signals.comparisonProductIds.length,
    routeKind: signals.routeKind,
  };
}
