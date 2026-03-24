import { computed } from "vue";
import type { ComputedRef } from "vue";
import type { Schemas, operations } from "#shopware";
import { useListingCoreContext } from "./useListingCore";
import type { ListingCoreContext } from "./useListingCore";

type UseProductListingSortingParams = {
  getCurrentListing: ComputedRef<Schemas["ProductListingResult"] | null>;
  search(
    criteria: operations["searchPage post /search"]["body"],
  ): Promise<void>;
};

export function useProductListingSorting(
  params?: UseProductListingSortingParams,
) {
  const { getCurrentListing, search } =
    params || (useListingCoreContext() as ListingCoreContext);
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
