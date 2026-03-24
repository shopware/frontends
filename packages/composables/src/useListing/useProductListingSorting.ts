import { computed } from "vue";
import type { ComputedRef } from "vue";
import type { Schemas, operations } from "#shopware";

export function useProductListingSorting({
  getCurrentListing,
  search,
}: {
  getCurrentListing: ComputedRef<Schemas["ProductListingResult"] | null>;
  search(
    criteria: operations["searchPage post /search"]["body"],
  ): Promise<void>;
}) {
  const getSortingOrders = computed(() => {
    return getCurrentListing.value?.availableSortings;
  });

  const getCurrentSortingOrder = computed(
    () => getCurrentListing.value?.sorting,
  );

  async function changeCurrentSortingOrder(
    order: string,
    query?: operations["searchPage post /search"]["body"],
  ) {
    await search(
      Object.assign(
        {
          order,
        },
        query,
      ),
    );
  }

  return {
    getSortingOrders,
    getCurrentSortingOrder,
    changeCurrentSortingOrder,
  };
}
