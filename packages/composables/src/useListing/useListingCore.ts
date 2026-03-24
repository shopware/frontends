import { computed, inject, provide, ref } from "vue";
import type { Ref } from "vue";
import type { Schemas, operations } from "#shopware";
import { merge } from "./utils";

export function useListingCore({
  listingKey,
  searchMethod,
  searchDefaults,
  initialListing,
}: {
  listingKey: string;
  searchMethod(
    searchParams:
      | operations["readProductListing post /product-listing/{categoryId}"]["body"]
      | operations["searchPage post /search"]["body"],
  ): Promise<Schemas["ProductListingResult"]>;
  searchDefaults: operations["searchPage post /search"]["body"];
  initialListing?: Schemas["ProductListingResult"] | null;
}) {
  const loading = ref(false);
  const loadingMore = ref(false);

  const _storeInitialListing = inject<
    Ref<Schemas["ProductListingResult"] | null>
  >(`useListingInitial-${listingKey}`, ref(initialListing ?? null));
  provide(`useListingInitial-${listingKey}`, _storeInitialListing);

  const _storeAppliedListing = inject<
    Ref<Schemas["ProductListingResult"] | null>
  >(`useListingApplied-${listingKey}`, ref(null));
  provide(`useListingApplied-${listingKey}`, _storeAppliedListing);

  const getInitialListing = computed(() => _storeInitialListing.value);

  const setInitialListing = async (
    initialListing: Schemas["ProductListingResult"],
  ) => {
    _storeInitialListing.value = initialListing;
    _storeAppliedListing.value = null;
  };

  const getCurrentListing = computed(() => {
    return _storeAppliedListing.value || getInitialListing.value;
  });

  const getElements = computed(() => {
    return getCurrentListing.value?.elements || [];
  });

  const getTotal = computed(() => {
    return getCurrentListing.value?.total || 0;
  });

  const getLimit = computed(() => {
    return getCurrentListing.value?.limit || searchDefaults?.limit || 10;
  });

  const initSearch = async (
    criteria: operations["searchPage post /search"]["body"],
  ): Promise<Schemas["ProductListingResult"]> => {
    loading.value = true;
    try {
      const searchCriteria = merge(
        {} as operations["searchPage post /search"]["body"],
        searchDefaults,
        criteria,
      );
      const result = await searchMethod(searchCriteria);
      return result;
    } finally {
      loading.value = false;
    }
  };

  async function search(
    criteria: operations["searchPage post /search"]["body"],
  ) {
    loading.value = true;
    try {
      const searchCriteria = merge(
        {} as operations["searchPage post /search"]["body"],
        searchDefaults,
        criteria,
      );
      const result = await searchMethod(searchCriteria);

      _storeAppliedListing.value = result;
    } finally {
      loading.value = false;
    }
  }

  const loadMore = async (
    criteria?: operations["searchPage post /search"]["body"],
  ): Promise<void> => {
    loadingMore.value = true;
    try {
      const q = criteria
        ? criteria
        : {
            p: (getCurrentListing.value?.page || 1) + 1,
          };

      const searchCriteria = merge(
        {} as operations["searchPage post /search"]["body"],
        searchDefaults,
        q,
      ) as operations["searchPage post /search"]["body"];
      const result = await searchMethod(searchCriteria);
      _storeAppliedListing.value = {
        ...(getCurrentListing.value || {}),
        page: result.page,
        elements: [
          ...(getCurrentListing.value?.elements || []),
          ...(result.elements ?? []),
        ],
      } as Schemas["ProductListingResult"];
    } finally {
      loadingMore.value = false;
    }
  };

  return {
    _storeInitialListing,
    _storeAppliedListing,
    loading,
    loadingMore,
    getInitialListing,
    setInitialListing,
    getCurrentListing,
    getElements,
    getTotal,
    getLimit,
    initSearch,
    search,
    loadMore,
  };
}
