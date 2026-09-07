import { getCategoryFilterPostFilter } from "@shopware/helpers";
import { computed } from "vue";
import type { ComputedRef } from "vue";
import type { LocationQueryRaw } from "vue-router";

import {
  firstQueryValue,
  getVisibleListingFilters,
  toNumber,
  useCategoryListing,
  useProductSearchListing,
  useRoute,
  useRouter,
  useSelectedListingFilters,
} from "#imports";
import type { Schemas } from "#shopware";

/** Shared by the sidebar and horizontal filter components. */
export function useListingFilters(isProductSearch: boolean) {
  const route = useRoute();
  const router = useRouter();

  const { getCurrentSortingOrder, getInitialFilters, getSortingOrders } =
    isProductSearch ? useProductSearchListing() : useCategoryListing();

  const selectedFilters = useSelectedListingFilters();

  // Only the filters this listing can apply: the category filter is
  // search-only, matching the post-filter and URL gates below.
  const visibleFilters = computed(() =>
    getVisibleListingFilters(getInitialFilters.value, { isProductSearch }),
  );

  const showResetFiltersButton = computed<boolean>(
    () =>
      selectedFilters.manufacturer.size !== 0 ||
      selectedFilters.properties.size !== 0 ||
      (isProductSearch && selectedFilters.categories.size !== 0) ||
      !!selectedFilters["max-price"] ||
      !!selectedFilters["min-price"] ||
      !!selectedFilters.rating ||
      !!selectedFilters["shipping-free"],
  );

  const searchCriteriaForRequest: ComputedRef<
    Schemas["ProductListingCriteria"]
  > = computed(() => ({
    manufacturer: [...(selectedFilters.manufacturer as Set<string>)]?.join("|"),
    properties: [...(selectedFilters.properties as Set<string>)]?.join("|"),
    // A post-filter so the category aggregation itself is not reduced. Search
    // pages only: a stale ?categories= must not narrow a category page.
    ...(isProductSearch && selectedFilters.categories.size > 0
      ? {
          "post-filter": [
            getCategoryFilterPostFilter([
              ...(selectedFilters.categories as Set<string>),
            ]),
          ],
        }
      : {}),
    "min-price": selectedFilters["min-price"] as number,
    "max-price": selectedFilters["max-price"] as number,
    order: getCurrentSortingOrder.value as string,
    "shipping-free": selectedFilters["shipping-free"] as boolean,
    rating: selectedFilters.rating as number,
    search: isProductSearch ? (firstQueryValue(route.query.search) ?? "") : "",
    limit: toNumber(firstQueryValue(route.query.limit)) ?? 15,
  }));

  const executeSearch = async () => {
    try {
      const criteria = searchCriteriaForRequest.value;
      const query: Record<string, unknown> = {};

      if (criteria.manufacturer) query.manufacturer = criteria.manufacturer;
      if (criteria.properties) query.properties = criteria.properties;
      if (isProductSearch && selectedFilters.categories.size > 0)
        query.categories = [
          ...(selectedFilters.categories as Set<string>),
        ].join("|");
      if (criteria["min-price"]) query["min-price"] = criteria["min-price"];
      if (criteria["max-price"]) query["max-price"] = criteria["max-price"];
      if (criteria.rating) query.rating = criteria.rating;
      if (criteria["shipping-free"])
        query["shipping-free"] = criteria["shipping-free"];
      if (criteria.order) query.order = criteria.order;
      // Keep the search term so filtering does not reset the query.
      if (isProductSearch && route.query.search)
        query.search = route.query.search;
      // Preserve the page size, which rebuilding the query would drop.
      if (route.query.limit) query.limit = route.query.limit;

      // URL first: gating it on the request lost the filter when the call
      // failed. The listing refetches from the URL, so this is the whole job.
      await router.push({ query: query as LocationQueryRaw });
    } catch (error) {
      console.error("Search execution failed:", error);
    }
  };

  const handleFilterChange = async (event: {
    code: string;
    value: string | number | boolean;
  }) => {
    try {
      const { code, value } = event;

      if (
        code === "manufacturer" ||
        code === "properties" ||
        code === "categories"
      ) {
        const filterSet = selectedFilters[code];
        const stringValue = String(value);
        if (filterSet.has(stringValue)) filterSet.delete(stringValue);
        else filterSet.add(stringValue);
      } else if (code === "min-price" || code === "max-price") {
        selectedFilters[code] =
          typeof value === "number" ? value : Number(value);
      } else if (code === "rating") {
        selectedFilters.rating = Number(value);
      } else if (code === "shipping-free") {
        selectedFilters["shipping-free"] = Boolean(value);
      }

      await executeSearch();
    } catch (error) {
      console.error("Filter update failed:", error);
    }
  };

  const clearFilters = () => {
    (selectedFilters.manufacturer as Set<string>).clear();
    (selectedFilters.properties as Set<string>).clear();
    (selectedFilters.categories as Set<string>).clear();
    selectedFilters["min-price"] = undefined;
    selectedFilters["max-price"] = undefined;
    selectedFilters.rating = undefined;
    selectedFilters["shipping-free"] = undefined;
  };

  async function invokeCleanFilters() {
    try {
      clearFilters();
      await executeSearch();
    } catch (error) {
      console.error("Clear filters failed:", error);
    }
  }

  const currentSortingOrder = computed({
    get: (): string => getCurrentSortingOrder.value || "",
    set: async (order: string): Promise<void> => {
      try {
        // Pushing is the whole job; the listing refetches from the URL.
        await router.push({ query: { ...route.query, order } });
      } catch (error) {
        console.error("Sorting order change failed:", error);
      }
    },
  });

  const handleSortChange = (sortKey: string) => {
    currentSortingOrder.value = sortKey;
  };

  const handleRemoveFilterChip = async (chip: {
    code: string;
    value: string | number;
  }) => {
    if (
      chip.code === "properties" ||
      chip.code === "manufacturer" ||
      chip.code === "categories"
    ) {
      (selectedFilters[chip.code] as Set<string>).delete(String(chip.value));
    } else if (chip.code === "price") {
      selectedFilters["min-price"] = undefined;
      selectedFilters["max-price"] = undefined;
    } else if (chip.code === "rating") {
      selectedFilters.rating = undefined;
    } else if (chip.code === "shipping-free") {
      selectedFilters["shipping-free"] = undefined;
    }

    await executeSearch();
  };

  return {
    currentSortingOrder,
    executeSearch,
    getSortingOrders,
    handleFilterChange,
    handleRemoveFilterChip,
    handleSortChange,
    invokeCleanFilters,
    searchCriteriaForRequest,
    selectedFilters,
    showResetFiltersButton,
    visibleFilters,
  };
}
