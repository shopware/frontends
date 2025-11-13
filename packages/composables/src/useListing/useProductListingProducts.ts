import { computed } from "vue";
import type { ComputedRef } from "vue";
import type { Schemas, operations } from "#shopware";
import type { UseListingCoreReturn } from "./useListingCore";
import { merge } from "./utils";

export interface UseProductListingProductsReturn {
  /**
   * Listing that is currently set
   * {@link ListingResult} object
   */
  getInitialListing: ComputedRef<Schemas["ProductListingResult"] | null>;
  /**
   * Sets the initial listing - available synchronously
   * @param {@link initialListing} - initial listing to set
   * @returns
   */
  setInitialListing(
    initialListing: Schemas["ProductListingResult"],
  ): Promise<void>;
  /**
   * @deprecated - use `search` instead
   * Searches for the listing based on the criteria
   * @param criteria {@link Schemas['Criteria']}
   * @returns
   */
  initSearch(
    criteria: operations["searchPage post /search"]["body"],
  ): Promise<Schemas["ProductListingResult"]>;
  /**
   * Searches for the listing based on the criteria
   * @param criteria
   * @returns
   */
  search(
    criteria:
      | operations["readProductListing post /product-listing/{categoryId}"]["body"]
      | operations["searchPage post /search"]["body"],
  ): Promise<void>;
  /**
   * Loads more (next page) elements to the listing
   */
  loadMore(
    criteria?: operations["searchPage post /search"]["body"],
  ): Promise<void>;
  /**
   * Listing that is currently set
   */
  getCurrentListing: ComputedRef<Schemas["ProductListingResult"] | null>;
  /**
   * Listing elements ({@link Product}) that are currently set
   */
  getElements: ComputedRef<Schemas["ProductListingResult"]["elements"]>;
  /**
   * Total number of elements found for the current search criteria
   */
  getTotal: ComputedRef<number>;
  /**
   * Indicates if the listing is being fetched
   */
  loading: ComputedRef<boolean>;
  /**
   * Indicates if the listing is being fetched via `loadMore` method
   */
  loadingMore: ComputedRef<boolean>;
}

export function useProductListingProducts(
  core: UseListingCoreReturn,
): UseProductListingProductsReturn {
  const getInitialListing = computed(() => core.initialListing.value);

  const setInitialListing = async (
    initialListing: Schemas["ProductListingResult"],
  ) => {
    core.setInitialListing(initialListing);
    core.appliedListing.value = null;
  };

  const initSearch = async (
    criteria: operations["searchPage post /search"]["body"],
  ): Promise<Schemas["ProductListingResult"]> => {
    core.loading.value = true;
    try {
      const searchCriteria = merge(
        {} as operations["searchPage post /search"]["body"],
        core.searchDefaults,
        criteria,
      );
      const result = await core.searchMethod(searchCriteria);
      return result;
    } finally {
      core.loading.value = false;
    }
  };

  const search = async (
    criteria: operations["searchPage post /search"]["body"],
  ) => {
    await core.search(criteria);
  };

  const getCurrentListing = computed(() => {
    return core.appliedListing.value || getInitialListing.value;
  });

  const loadMore = async (
    criteria?: operations["searchPage post /search"]["body"],
  ): Promise<void> => {
    core.loadingMore.value = true;
    try {
      const currentPage = getCurrentListing.value?.page || 1;
      const q = criteria
        ? criteria
        : {
            p: currentPage + 1,
          };

      const searchCriteria = merge(
        {} as operations["searchPage post /search"]["body"],
        core.searchDefaults,
        q,
      ) as operations["searchPage post /search"]["body"];
      const result = await core.searchMethod(searchCriteria);
      core.appliedListing.value = {
        ...(getCurrentListing.value || {}),
        page: result.page,
        elements: [
          ...(getCurrentListing.value?.elements || []),
          ...(result.elements ?? []),
        ],
      } as Schemas["ProductListingResult"];
    } finally {
      core.loadingMore.value = false;
    }
  };

  const getElements = computed(() => {
    return getCurrentListing.value?.elements || [];
  });

  const getTotal = computed(() => {
    return getCurrentListing.value?.total || 0;
  });

  return {
    getInitialListing,
    setInitialListing,
    initSearch,
    search,
    loadMore,
    getCurrentListing,
    getElements,
    getTotal,
    loading: computed(() => core.loading.value),
    loadingMore: computed(() => core.loadingMore.value),
  };
}
