import type { ExperienceContext, ExperienceSignals } from "./types";

const clamp = (value: number) => Math.min(Math.max(value, 0), 1);

/**
 * §15 signal formulas.
 *
 * These are heuristics, not a model. The blueprint is explicit about that and
 * about documenting the formula, so each one is written out here and nowhere
 * else. They must be calibrated against telemetry before anyone trusts them.
 */
export function deriveSignals(input: {
  comparedProductCount: number;
  repeatedProductViews: number;
  technicalFilterCount: number;
  priceSortCount: number;
  searchCount: number;
  productViewCount: number;
  cartProductCount: number;
}): ExperienceSignals {
  return {
    // §15's worked example, verbatim.
    comparisonIntent: clamp(
      input.comparedProductCount * 0.25 +
        input.repeatedProductViews * 0.1 +
        input.technicalFilterCount * 0.05,
    ),
    priceSensitivity: clamp(input.priceSortCount * 0.34),
    technicalInterest: clamp(input.technicalFilterCount * 0.2),
    visualInterest: clamp(input.productViewCount * 0.1),
    // Searching a lot without opening anything reads as not finding it.
    uncertainty: clamp(
      input.searchCount * 0.2 - Math.min(input.productViewCount, 3) * 0.1,
    ),
    decisionReadiness: clamp(
      input.cartProductCount * 0.5 + input.comparedProductCount * 0.15,
    ),
    supportNeed: 0,
  };
}

export function createDefaultContext(
  sessionId: string,
  now = 0,
): ExperienceContext {
  return {
    sessionId,
    startedAt: now,
    lastActivityAt: now,
    route: { path: "/", kind: "home" },
    searches: [],
    viewedProducts: [],
    comparedProductIds: [],
    cartProductIds: [],
    activeFilters: {},
    signals: deriveSignals({
      comparedProductCount: 0,
      repeatedProductViews: 0,
      technicalFilterCount: 0,
      priceSortCount: 0,
      searchCount: 0,
      productViewCount: 0,
      cartProductCount: 0,
    }),
    capabilities: {
      canSwitchSalesChannelAutomatically: false,
      canChangeShell: true,
      canMoveModules: true,
      canShowAssistant: true,
    },
  };
}
