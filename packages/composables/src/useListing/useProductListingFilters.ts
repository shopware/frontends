import { getListingFilters } from "@shopware/helpers";
import { computed } from "vue";
import type { ComputedRef, Ref } from "vue";
import type { Schemas, operations } from "#shopware";
import type { ShortcutFilterParam } from "./utils";

export function useProductListingFilters({
  getInitialListing,
  getCurrentListing,
  _storeAppliedListing,
  search,
  searchDefaults,
}: {
  getInitialListing: ComputedRef<Schemas["ProductListingResult"] | null>;
  getCurrentListing: ComputedRef<Schemas["ProductListingResult"] | null>;
  _storeAppliedListing: Ref<Schemas["ProductListingResult"] | null>;
  search(
    criteria: operations["searchPage post /search"]["body"],
  ): Promise<void>;
  searchDefaults: operations["searchPage post /search"]["body"];
}) {
  const getInitialFilters = computed(() => {
    return getListingFilters(getInitialListing.value?.aggregations);
  });

  const getAvailableFilters = computed(() => {
    return getListingFilters(
      _storeAppliedListing.value?.aggregations ||
        getCurrentListing.value?.aggregations,
    );
  });

  const getCurrentFilters = computed(() => {
    return getCurrentListing.value
      ?.currentFilters as Schemas["ProductListingResult"]["currentFilters"];
  });

  const setCurrentFilters = (filters: ShortcutFilterParam[]) => {
    const newFilters = {};
    for (const filter of filters) {
      Object.assign(newFilters, { [filter.code]: filter.value });
    }

    const appliedFilters = Object.assign(
      {},
      getCurrentFilters.value,
      {
        query: getCurrentFilters.value?.search,
        manufacturer: getCurrentFilters.value?.manufacturer?.join("|"),
        properties: getCurrentFilters.value?.properties?.join("|"),
      },
      { ...newFilters },
    );

    if (_storeAppliedListing.value) {
      _storeAppliedListing.value.currentFilters = {
        ...appliedFilters,
        manufacturer: appliedFilters.manufacturer?.split("|"),
        properties: appliedFilters.properties?.split("|"),
      };
    }

    return search(
      appliedFilters as operations["searchPage post /search"]["body"],
    );
  };

  const resetFilters = () => {
    const defaultFilters = Object.assign(
      {
        manufacturer: [],
        properties: [],
        price: { min: 0, max: 0 },
        search: getCurrentFilters.value?.search,
      },
      searchDefaults,
    );

    if (_storeAppliedListing.value) {
      _storeAppliedListing.value.currentFilters =
        defaultFilters as unknown as Schemas["ProductListingResult"]["currentFilters"];
    }
    return search({ search: getCurrentFilters.value?.search || "" });
  };

  const filtersToQuery = (filters: Schemas["ProductListingCriteria"]) => {
    const queryObject: Record<string, unknown> = {};

    for (const filter in filters) {
      const currentFilter =
        filters[filter as keyof Schemas["ProductListingCriteria"]];
      if (currentFilter) {
        if (Array.isArray(currentFilter) && currentFilter.length) {
          queryObject[filter] = currentFilter.join("|");
        } else if (!Array.isArray(currentFilter)) {
          queryObject[filter] = currentFilter;
        }
      }
    }

    return queryObject;
  };

  return {
    getInitialFilters,
    getAvailableFilters,
    getCurrentFilters,
    setCurrentFilters,
    resetFilters,
    filtersToQuery,
  };
}
