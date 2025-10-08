import { inject, provide, ref } from "vue";
import type { Ref } from "vue";
import type { Schemas, operations } from "#shopware";
import { merge } from "./utils";

export type SearchMethod = (
  searchParams:
    | operations["readProductListing post /product-listing/{categoryId}"]["body"]
    | operations["searchPage post /search"]["body"],
) => Promise<Schemas["ProductListingResult"]>;

export interface UseListingCoreOptions {
  searchMethod: SearchMethod;
  searchDefaults: operations["searchPage post /search"]["body"];
  listingKey: string;
  initialListing?: Schemas["ProductListingResult"] | null;
}

export interface UseListingCoreReturn {
  loading: Ref<boolean>;
  loadingMore: Ref<boolean>;
  initialListing: Ref<Schemas["ProductListingResult"] | null>;
  appliedListing: Ref<Schemas["ProductListingResult"] | null>;
  searchDefaults: operations["searchPage post /search"]["body"];
  search(
    criteria: operations["searchPage post /search"]["body"],
  ): Promise<void>;
  searchMethod: SearchMethod;
  setInitialListing(listing: Schemas["ProductListingResult"]): void;
}

export function useListingCore({
  searchMethod,
  searchDefaults,
  listingKey,
  initialListing: initialListingOption,
}: UseListingCoreOptions): UseListingCoreReturn {
  const loading = ref(false);
  const loadingMore = ref(false);

  const hasExistingContext = inject<boolean>(
    `useListingContext-${listingKey}`,
    false,
  );

  if (hasExistingContext && process.env.NODE_ENV !== "production") {
    console.warn(
      `[useListingCore] A listing context with key "${listingKey}" already exists. This may cause unexpected behavior if you're trying to create multiple instances.`,
    );
  }

  provide(`useListingContext-${listingKey}`, true);

  const _storeInitialListing = inject<
    Ref<Schemas["ProductListingResult"] | null>
  >(`useListingInitial-${listingKey}`, ref(initialListingOption ?? null));
  provide(`useListingInitial-${listingKey}`, _storeInitialListing);

  const _storeAppliedListing = inject<
    Ref<Schemas["ProductListingResult"] | null>
  >(`useListingApplied-${listingKey}`, ref(null));
  provide(`useListingApplied-${listingKey}`, _storeAppliedListing);

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

  function setInitialListing(listing: Schemas["ProductListingResult"]) {
    _storeInitialListing.value = listing;
  }

  return {
    loading,
    loadingMore,
    initialListing: _storeInitialListing,
    appliedListing: _storeAppliedListing,
    searchDefaults,
    search,
    searchMethod,
    setInitialListing,
  };
}
