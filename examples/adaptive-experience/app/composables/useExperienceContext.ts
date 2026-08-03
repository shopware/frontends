import {
  createDefaultContext,
  deriveSignals,
} from "#shared/experience/context";
import type { ExperienceContext, RouteKind } from "#shared/experience/types";

/** Semantic events only. No DOM detail, no free text beyond a search query. */
export type ExperienceEvent =
  | { type: "product-viewed"; productId: string }
  | { type: "added-to-comparison"; productId: string }
  | { type: "removed-from-comparison"; productId: string }
  | { type: "comparison-cleared" }
  | { type: "price-sort-used" }
  | { type: "search"; query: string };

const MAX_COMPARISON_ITEMS = 4;

/** §15 route classification. */
function routeKindFromPath(path: string): RouteKind {
  if (path.includes("/checkout")) return "checkout";
  if (path.includes("/account")) return "account";
  if (path.includes("/cart")) return "cart";
  if (path.includes("/adaptive") || path.includes("/search")) return "search";
  return "home";
}

/**
 * §15 `ExperienceContext`: the aggregated, anonymous view of the session.
 *
 * Events are the source of truth and the plan is a projection of them (§2.5).
 * The comparison selection lives here, not in the plan, because the registry
 * only admits the comparison module in compare mode - a shopper staging their
 * first product in explore would otherwise have their own action rejected.
 */
export function useExperienceContext() {
  const route = useRoute();

  const sessionId = useState<string>(
    "experience-session",
    () => "local-session",
  );
  const comparedProductIds = useState<string[]>(
    "experience-compared",
    () => [],
  );
  const viewedProducts = useState<
    { productId: string; timestamp: number; count: number }[]
  >("experience-viewed", () => []);
  const searches = useState<{ query: string; timestamp: number }[]>(
    "experience-searches",
    () => [],
  );
  const priceSortCount = useState<number>("experience-price-sorts", () => 0);

  const track = (event: ExperienceEvent) => {
    const now = import.meta.client ? Date.now() : 0;
    switch (event.type) {
      case "product-viewed": {
        const existing = viewedProducts.value.find(
          (v) => v.productId === event.productId,
        );
        viewedProducts.value = existing
          ? viewedProducts.value.map((v) =>
              v.productId === event.productId
                ? { ...v, count: v.count + 1, timestamp: now }
                : v,
            )
          : [
              ...viewedProducts.value,
              { productId: event.productId, timestamp: now, count: 1 },
            ];
        break;
      }
      case "added-to-comparison":
        if (
          comparedProductIds.value.includes(event.productId) ||
          comparedProductIds.value.length >= MAX_COMPARISON_ITEMS
        ) {
          break;
        }
        comparedProductIds.value = [
          ...comparedProductIds.value,
          event.productId,
        ];
        break;
      case "removed-from-comparison":
        comparedProductIds.value = comparedProductIds.value.filter(
          (id) => id !== event.productId,
        );
        break;
      case "comparison-cleared":
        comparedProductIds.value = [];
        break;
      case "price-sort-used":
        priceSortCount.value += 1;
        break;
      case "search":
        searches.value = [
          ...searches.value,
          { query: event.query, timestamp: now },
        ];
        break;
    }
  };

  /**
   * Forgets everything observed about this shopper. The plan is a projection of
   * these signals, so restoring the standard view has to clear the source, not
   * just the plan (§19: remember an explicit revert for the session).
   */
  const reset = () => {
    comparedProductIds.value = [];
    viewedProducts.value = [];
    searches.value = [];
    priceSortCount.value = 0;
  };

  const context = computed<ExperienceContext>(() => ({
    ...createDefaultContext(sessionId.value, 0),
    route: { path: route.path, kind: routeKindFromPath(route.path) },
    searches: searches.value,
    viewedProducts: viewedProducts.value,
    comparedProductIds: comparedProductIds.value,
    signals: deriveSignals({
      comparedProductCount: comparedProductIds.value.length,
      repeatedProductViews: viewedProducts.value.filter((v) => v.count > 1)
        .length,
      technicalFilterCount: 0,
      priceSortCount: priceSortCount.value,
      searchCount: searches.value.length,
      productViewCount: viewedProducts.value.length,
      cartProductCount: 0,
    }),
  }));

  const isCompared = (productId: string) =>
    comparedProductIds.value.includes(productId);

  const canCompareMore = computed(
    () => comparedProductIds.value.length < MAX_COMPARISON_ITEMS,
  );

  return {
    context,
    track,
    reset,
    comparedProductIds,
    isCompared,
    canCompareMore,
  };
}
