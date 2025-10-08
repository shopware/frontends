import { getListingFilters } from "@shopware/helpers";
import { computed } from "vue";
import type { ComputedRef } from "vue";
import type { Schemas, operations } from "#shopware";
import type { UseListingCoreReturn } from "./useListingCore";
import type { UseProductListingProductsReturn } from "./useProductListingProducts";
import type { ShortcutFilterParam } from "./utils";

export interface UseProductListingFiltersReturn {
  /**
   * Initial filters
   */
  getInitialFilters: ComputedRef<ReturnType<typeof getListingFilters>>;
  /**
   * All available filters
   */
  getAvailableFilters: ComputedRef<ReturnType<typeof getListingFilters>>;
  /**
   * Filters that are currently set
   */
  getCurrentFilters: ComputedRef<
    Schemas["ProductListingResult"]["currentFilters"]
  >;
  /**
   * Sets the filters to be applied for the listing
   * @param filters
   * @returns
   */
  setCurrentFilters(filters: ShortcutFilterParam[]): Promise<void>;
  /**
   * Resets the filters - clears the current filters
   */
  resetFilters(): Promise<void>;
  /**
   * Change selected filters to the query object
   */
  filtersToQuery(
    filters: Schemas["ProductListingCriteria"],
  ): Record<string, unknown>;
}

export function useProductListingFilters(
  core: UseListingCoreReturn,
  products: UseProductListingProductsReturn,
): UseProductListingFiltersReturn {
  const getInitialFilters = computed(() => {
    return getListingFilters(products.getInitialListing.value?.aggregations);
  });

  const getAvailableFilters = computed(() => {
    return getListingFilters(
      core.appliedListing.value?.aggregations ||
        products.getCurrentListing.value?.aggregations,
    );
  });

  const getCurrentFilters = computed(() => {
    return products.getCurrentListing.value
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

    if (core.appliedListing.value) {
      core.appliedListing.value.currentFilters = {
        ...appliedFilters,
        manufacturer: appliedFilters.manufacturer?.split("|"),
        properties: appliedFilters.properties?.split("|"),
      };
    }

    return core.search(
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
      core.searchDefaults,
    );

    if (core.appliedListing.value) {
      core.appliedListing.value.currentFilters =
        defaultFilters as unknown as Schemas["ProductListingResult"]["currentFilters"];
    }
    return core.search({ search: getCurrentFilters.value?.search || "" });
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
