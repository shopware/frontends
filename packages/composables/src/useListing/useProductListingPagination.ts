import { computed } from "vue";
import type { ComputedRef } from "vue";
import type { Schemas, operations } from "#shopware";
import { useListingCoreContext } from "./useListingCore";
import type { ListingCoreContext } from "./useListingCore";

type UseProductListingPaginationParams = {
  getCurrentListing: ComputedRef<Schemas["ProductListingResult"] | null>;
  getLimit: ComputedRef<number>;
  getTotal: ComputedRef<number>;
  search(
    criteria: operations["searchPage post /search"]["body"],
  ): Promise<void>;
};

export function useProductListingPagination(
  params?: UseProductListingPaginationParams,
) {
  const { getCurrentListing, getLimit, getTotal, search } =
    params || (useListingCoreContext() as ListingCoreContext);
  const getCurrentPage = computed(() => getCurrentListing.value?.page || 1);

  const getTotalPagesCount = computed(() =>
    Math.ceil(getTotal.value / getLimit.value),
  );

  const changeCurrentPage = async (
    page: number,
    query?: operations["searchPage post /search"]["body"],
  ) => {
    await search(
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
    getTotalPagesCount,
    changeCurrentPage,
  };
}
