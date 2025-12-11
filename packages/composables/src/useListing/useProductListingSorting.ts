import { computed } from "vue";
import type { ComputedRef } from "vue";
import type { Schemas, operations } from "#shopware";
import type { UseListingCoreReturn } from "./useListingCore";
import type { UseProductListingProductsReturn } from "./useProductListingProducts";

export interface UseProductListingSortingReturn {
  /**
   * Available sorting orders
   */
  getSortingOrders: ComputedRef<
    Schemas["ProductSorting"][] | { key: string; label: string }[] | undefined
  >;
  /**
   * Current sorting order
   */
  getCurrentSortingOrder: ComputedRef<string | undefined>;
  /**
   * Changes the current sorting order
   * @param order - i.e. "name-asc"
   * @returns
   */
  changeCurrentSortingOrder(
    order: string,
    query?: operations["searchPage post /search"]["body"],
  ): Promise<void>;
}

export function useProductListingSorting(
  core: UseListingCoreReturn,
  products: UseProductListingProductsReturn,
): UseProductListingSortingReturn {
  const getSortingOrders = computed(() => {
    return products.getCurrentListing.value?.availableSortings;
  });

  const getCurrentSortingOrder = computed(
    () => products.getCurrentListing.value?.sorting,
  );

  const changeCurrentSortingOrder = async (
    order: string,
    query?: operations["searchPage post /search"]["body"],
  ) => {
    await core.search(
      Object.assign(
        {
          order,
        },
        query,
      ),
    );
  };

  return {
    getSortingOrders,
    getCurrentSortingOrder,
    changeCurrentSortingOrder,
  };
}
