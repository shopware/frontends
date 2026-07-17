import type { ExperienceSignals, RouteKind } from "#shared/experience/types";

/** Semantic events only. No DOM detail, no free text, no PII. */
export type ExperienceEvent =
  | { type: "product-viewed"; productId: string }
  | { type: "added-to-comparison"; productId: string }
  | { type: "removed-from-comparison"; productId: string }
  | { type: "comparison-cleared" }
  | { type: "price-sort-used" };

const MAX_COMPARISON_ITEMS = 4;

function routeKindFromPath(path: string): RouteKind {
  if (path.includes("/checkout")) return "checkout";
  if (path.includes("/search")) return "listing";
  return "other";
}

/**
 * The event log and the signals derived from it.
 *
 * Selection lives here rather than in the plan because the registry only allows
 * the comparison tray in compare mode: a shopper adding their first product while
 * still in explore mode would otherwise have their own action rejected. Events
 * are the source of truth, the plan is a projection of them.
 */
export function useExperienceSignals() {
  const route = useRoute();
  const comparisonProductIds = useState<string[]>(
    "experience-comparison",
    () => [],
  );
  const productsViewed = useState<Set<string>>(
    "experience-viewed",
    () => new Set(),
  );
  const priceSortCount = useState<number>("experience-price-sorts", () => 0);

  const track = (event: ExperienceEvent) => {
    switch (event.type) {
      case "product-viewed":
        productsViewed.value = new Set(productsViewed.value).add(
          event.productId,
        );
        break;
      case "added-to-comparison":
        if (
          comparisonProductIds.value.includes(event.productId) ||
          comparisonProductIds.value.length >= MAX_COMPARISON_ITEMS
        ) {
          break;
        }
        comparisonProductIds.value = [
          ...comparisonProductIds.value,
          event.productId,
        ];
        break;
      case "removed-from-comparison":
        comparisonProductIds.value = comparisonProductIds.value.filter(
          (id) => id !== event.productId,
        );
        break;
      case "comparison-cleared":
        comparisonProductIds.value = [];
        break;
      case "price-sort-used":
        priceSortCount.value += 1;
        break;
    }
  };

  const signals = computed<ExperienceSignals>(() => ({
    comparisonProductIds: comparisonProductIds.value,
    productsViewed: productsViewed.value.size,
    priceSortCount: priceSortCount.value,
    routeKind: routeKindFromPath(route.path),
  }));

  const isCompared = (productId: string) =>
    comparisonProductIds.value.includes(productId);

  const canCompareMore = computed(
    () => comparisonProductIds.value.length < MAX_COMPARISON_ITEMS,
  );

  return { signals, track, isCompared, canCompareMore };
}
