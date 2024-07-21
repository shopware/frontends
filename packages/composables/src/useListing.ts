import { inject, computed, ref, provide } from "vue";
import type { ComputedRef, Ref } from "vue";
import { getListingFilters } from "@shopware-pwa/helpers-next";
import { useShopwareContext, useCategory } from "#imports";
import type { Schemas, operations } from "#shopware";
import { createInjectionState, createSharedComposable } from "@vueuse/core";

function isObject<T>(item: T): boolean {
  return item && typeof item === "object" && !Array.isArray(item);
}

function merge<T extends { [key in keyof T]: unknown }>(
  target: T,
  ...sources: T[]
): T {
  if (!sources.length) return target;
  const source = sources.shift();

  if (source === undefined) {
    return target;
  }

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} });
        merge(target[key], source[key]);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    }
  }

  return merge(target, ...sources);
}

export type ListingType = "productSearchListing" | "categoryListing";

export type UseListingReturn = {
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
   * Total number of elements found for the current search criteria
   */
  getTotal: ComputedRef<number>;
  /**
   * Total number of pages found for the current search criteria
   */
  getTotalPagesCount: ComputedRef<number>;
  /**
   * Number of elements per page
   */
  getLimit: ComputedRef<number>;
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
  setCurrentFilters(filters: { code: string; value: unknown }): Promise<void>;
  /**
   * Indicates if the listing is being fetched
   */
  loading: ComputedRef<boolean>;
  /**
   * Indicates if the listing is being fetched via `loadMore` method
   */
  loadingMore: ComputedRef<boolean>;
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
};

/**
 * @public
 */
export function useListing(params?: {
  listingType: ListingType;
  categoryId?: string;
  defaultSearchCriteria?: operations["searchPage post /search"]["body"];
}): UseListingReturn {
  const listingType = params?.listingType || "categoryListing";
  let categoryId = params?.categoryId || null;

  // const { getDefaults } = useDefaults({ defaultsKey: contextName });
  const { apiClient } = useShopwareContext();

  let searchMethod: typeof listingType extends "productSearchListing"
    ? (
        searchParams: operations["readProductListing post /product-listing/{categoryId}"]["body"],
      ) => Promise<Schemas["ProductListingResult"]>
    : (
        searchParams: operations["searchPage post /search"]["body"],
      ) => Promise<Schemas["ProductListingResult"]>;

  if (listingType === "productSearchListing") {
    searchMethod = async (
      searchCriteria: operations["searchPage post /search"]["body"],
    ) => {
      const { data } = await apiClient.invoke("searchPage post /search", {
        headers: {
          "sw-include-seo-urls": true,
        },
        body: searchCriteria,
      });
      return data;
    };
  } else {
    if (!categoryId) {
      const { category } = useCategory();
      categoryId = category.value?.id;
    }

    searchMethod = async (
      searchCriteria: operations["readProductListing post /product-listing/{categoryId}"]["body"],
    ) => {
      const { data } = await apiClient.invoke(
        "readProductListing post /product-listing/{categoryId}",
        {
          headers: {
            "sw-include-seo-urls": true,
          },
          pathParams: {
            categoryId: categoryId as string, // null exception in useCategory,
          },
          body: searchCriteria,
        },
      );
      return data;
    };
  }

  return createListingComposable({
    listingKey: listingType,
    searchMethod,
    searchDefaults:
      params?.defaultSearchCriteria ||
      ({} as operations["searchPage post /search"]["body"]), //getDefaults(),
  });
}

const [_createCategoryListingContext, _categoryListingContext] =
  createInjectionState(
    () => {
      return useListing({ listingType: "categoryListing" });
    },
    {
      injectionKey: "categoryListing",
    },
  );

export const createCategoryListingContext = _createCategoryListingContext;

/**
 * Temporary workaround over `useListing` to support shared data. This composable API will change in the future.
 *
 * You need to call `createCategoryListingContext` before this composable.
 */
export const useCategoryListing = () => {
  const listingContext = _categoryListingContext();

  if (!listingContext) {
    throw new Error(
      "[useCategoryListing] Please call `createCategoryListingContext` on the appropriate parent component",
    );
  }

  return listingContext;
};

/**
 * Temporary workaround over `useListing` to support shared data. This composable API will change in the future.
 */
export const useProductSearchListing = createSharedComposable(() =>
  useListing({ listingType: "productSearchListing" }),
);

/**
 * Factory to create your own listing.
 *
 * By default you can use useListing composable, which provides you predefined listings for category(cms) listing and product search listing.
 * Using factory you can provide our own compatible search method and use it for example for creating listing of orders in my account.
 *
 * @public
 */
export function createListingComposable({
  searchMethod,
  searchDefaults,
  listingKey,
}: {
  searchMethod(
    searchParams:
      | operations["readProductListing post /product-listing/{categoryId}"]["body"]
      | operations["searchPage post /search"]["body"],
  ): Promise<Schemas["ProductListingResult"]>;
  searchDefaults: operations["searchPage post /search"]["body"];
  listingKey: string;
}): UseListingReturn {
  // const COMPOSABLE_NAME = "createListingComposable";
  // const contextName = COMPOSABLE_NAME;

  // const router = useRouter();

  // Handle CMS context to be able to show different breadcrumbs for different CMS pages.
  // const { isVueComponent } = useVueContext();
  // const cmsContext = isVueComponent && inject("swCmsContext", null);
  // const cacheKey = cmsContext
  //   ? `${contextName}(cms-${cmsContext})`
  //   : contextName;

  const loading = ref(false);
  const loadingMore = ref(false);

  // const { sharedRef } = useSharedState();
  const _storeInitialListing = inject<
    Ref<Schemas["ProductListingResult"] | null>
  >(`useListingInitial-${listingKey}`, ref(null));
  provide(`useListingInitial-${listingKey}`, _storeInitialListing);
  // const _storeInitialListing = sharedRef<Schemas["ProductListingResult"]>(
  //   `${cacheKey}-initialListing-${listingKey}`
  // );
  // const _storeAppliedListing = sharedRef<Partial<Schemas["ProductListingResult"]>>(
  //   `${cacheKey}-appliedListing-${listingKey}`
  // );
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
            // ...router.currentRoute.query,
            p: getCurrentPage.value + 1,
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

  const getTotalPagesCount = computed(() =>
    Math.ceil(getTotal.value / getLimit.value),
  );

  const getSortingOrders = computed(() => {
    return getCurrentListing.value?.availableSortings;
  });

  const getCurrentSortingOrder = computed(
    () => getCurrentListing.value?.sorting,
  );
  async function changeCurrentSortingOrder(
    order: string,
    query?: operations["searchPage post /search"]["body"],
  ) {
    await search(
      Object.assign(
        {
          order,
        },
        query,
      ),
    );
  }

  const getCurrentPage = computed(() => getCurrentListing.value?.page || 1);

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
    // const currentFiltersResult: Schemas["ProductListingResult"]["currentFilters"] =
    //   {};
    // const currentFilters = {
    //   ...getCurrentListing.value?.currentFilters,
    //   // ...router.currentRoute.query,
    // };
    // Object.keys(currentFilters).forEach(
    //   (objectKey: keyof Schemas["ProductListingResult"]["currentFilters"]) => {
    //     if (!currentFilters[objectKey]) return;
    //     if (objectKey === "navigationId") return;
    //     if (objectKey === "price") {
    //       if (currentFilters.price?.min)
    //         currentFiltersResult.price.min = currentFilters[objectKey].min;
    //       if (currentFilters[objectKey].max)
    //         currentFiltersResult["max-price"] = currentFilters[objectKey].max;
    //       return;
    //     }
    //     if (objectKey === "p") return;
    //     currentFiltersResult[objectKey] = currentFilters[objectKey];
    //   },
    // );
    return getCurrentListing.value
      ?.currentFilters as Schemas["ProductListingResult"]["currentFilters"];
  });

  const setCurrentFilters = (filter: { code: string; value: unknown }) => {
    const appliedFilters: operations["searchPage post /search"]["body"] =
      Object.assign({}, getCurrentFilters.value, filter, {
        query: getCurrentFilters.value?.search,
        manufacturer: getCurrentFilters.value?.manufacturer?.join("|"),
        properties: getCurrentFilters.value?.properties?.join("|"),
      });
    if (_storeAppliedListing.value) {
      _storeAppliedListing.value.currentFilters = {
        ...appliedFilters,
        manufacturer: appliedFilters.manufacturer?.split("|") || [],
        properties: appliedFilters.properties?.split("|") || [],
      } as unknown as Schemas["ProductListingResult"]["currentFilters"];
    }
    return search(appliedFilters);
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
    changeCurrentPage,
    changeCurrentSortingOrder,
    filtersToQuery,
    getAvailableFilters,
    getCurrentFilters,
    getCurrentListing,
    getCurrentPage,
    getCurrentSortingOrder,
    getElements,
    getInitialFilters,
    getInitialListing,
    getLimit,
    getSortingOrders,
    getTotal,
    getTotalPagesCount,
    initSearch,
    loadMore,
    loading: computed(() => loading.value),
    loadingMore: computed(() => loadingMore.value),
    resetFilters,
    search,
    setCurrentFilters,
    setInitialListing,
  };
}
