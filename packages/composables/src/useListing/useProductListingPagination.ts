import { computed } from "vue";
import type { ComputedRef } from "vue";
import type { Schemas, operations } from "#shopware";

export function useProductListingPagination({
  getCurrentListing,
  getLimit,
  getTotal,
  search,
}: {
  getCurrentListing: ComputedRef<Schemas["ProductListingResult"] | null>;
  getLimit: ComputedRef<number>;
  getTotal: ComputedRef<number>;
  search(
    criteria: operations["searchPage post /search"]["body"],
  ): Promise<void>;
}) {
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
