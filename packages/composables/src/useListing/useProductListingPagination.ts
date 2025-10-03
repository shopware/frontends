import { computed } from "vue";
import type { ComputedRef } from "vue";
import type { operations } from "#shopware";
import type { UseListingCoreReturn } from "./useListingCore";
import type { UseProductListingProductsReturn } from "./useProductListingProducts";

export interface UseProductListingPaginationReturn {
  /**
   * Current page number
   */
  getCurrentPage: ComputedRef<number>;
  /**
   * Changes the current page number
   * @param pageNumber - page number to change to
   * @returns
   */
  changeCurrentPage(
    page: number,
    query?: operations["searchPage post /search"]["body"],
  ): Promise<void>;
  /**
   * Total number of pages found for the current search criteria
   */
  getTotalPagesCount: ComputedRef<number>;
  /**
   * Number of elements per page
   */
  getLimit: ComputedRef<number>;
}

export function useProductListingPagination(
  core: UseListingCoreReturn,
  products: UseProductListingProductsReturn,
): UseProductListingPaginationReturn {
  const getCurrentPage = computed(
    () => products.getCurrentListing.value?.page || 1,
  );

  const getLimit = computed(() => {
    return (
      products.getCurrentListing.value?.limit ||
      core.searchDefaults?.limit ||
      10
    );
  });

  const getTotalPagesCount = computed(() =>
    Math.ceil(products.getTotal.value / getLimit.value),
  );

  const changeCurrentPage = async (
    page: number,
    query?: operations["searchPage post /search"]["body"],
  ) => {
    await core.search(
      Object.assign(
        {
          page,
        },
        query,
      ),
    );
  };

  return {
    getCurrentPage,
    changeCurrentPage,
    getTotalPagesCount,
    getLimit,
  };
}
