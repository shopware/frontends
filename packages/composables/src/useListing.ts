import { getCategoryProducts, searchProducts } from "@shopware-pwa/api-client";

import {
  ShopwareSearchParams,
  Product,
  ListingResult,
  Sort,
  ListingFilter,
} from "@shopware-pwa/types";
import { inject, computed, ComputedRef, ref, provide } from "vue";
import { getListingFilters } from "@shopware-pwa/helpers-next";
import { useShopwareContext, useCategory } from ".";

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

export type UseListingReturn<ELEMENTS_TYPE> = {
  getInitialListing: ComputedRef<ListingResult<ELEMENTS_TYPE> | null>;
  setInitialListing: (
    initialListing: Partial<ListingResult<ELEMENTS_TYPE>>
  ) => Promise<void>;
  initSearch: (
    criteria: Partial<ShopwareSearchParams>
  ) => Promise<ListingResult<ELEMENTS_TYPE>>;
  search: (
    criteria: Partial<ShopwareSearchParams>,
    options?: {
      preventRouteChange?: boolean;
    }
  ) => Promise<void>;
  loadMore: () => Promise<void>;
  getCurrentListing: ComputedRef<Partial<ListingResult<ELEMENTS_TYPE>> | null>;
  getElements: ComputedRef<ELEMENTS_TYPE[]>;
  getSortingOrders: ComputedRef<Sort[] | { key: string; label: string }[]>;
  getCurrentSortingOrder: ComputedRef<string | undefined>;
  changeCurrentSortingOrder: (order: string) => Promise<void>;
  getCurrentPage: ComputedRef<string | number>;
  changeCurrentPage: (pageNumber?: number) => Promise<void>;
  getTotal: ComputedRef<number>;
  getTotalPagesCount: ComputedRef<number>;
  getLimit: ComputedRef<number>;
  getInitialFilters: ComputedRef<ListingFilter[]>;
  getAvailableFilters: ComputedRef<ListingFilter[]>;
  getCurrentFilters: ComputedRef<any>;
  setCurrentFilters: (filters: any) => Promise<void>;
  loading: ComputedRef<boolean>;
  loadingMore: ComputedRef<boolean>;
  resetFilters: () => Promise<void>;
};

export function useListing(params?: {
  listingType: ListingType;
  categoryId?: string;
  defaultSearchCriteria?: Partial<ShopwareSearchParams>;
}): UseListingReturn<Product> {
  const listingType = params?.listingType || "categoryListing";

  // const { getDefaults } = useDefaults({ defaultsKey: contextName });
  const { apiInstance } = useShopwareContext();

  let searchMethod;
  if (listingType === "productSearchListing") {
    searchMethod = async (searchCriteria: Partial<ShopwareSearchParams>) => {
      return searchProducts(searchCriteria, apiInstance);
    };
  } else {
    const { category } = useCategory();
    const resourceId = category.value?.id || params?.categoryId;

    searchMethod = async (searchCriteria: Partial<ShopwareSearchParams>) => {
      if (!resourceId) {
        throw new Error(
          "[useListing][search] Search category id does not exist."
        );
      }
      return getCategoryProducts(resourceId, searchCriteria, apiInstance);
    };
  }

  return createListingComposable<Product>({
    listingKey: listingType,
    searchMethod,
    searchDefaults: params?.defaultSearchCriteria || {}, //getDefaults(),
  });
}

/**
 * Factory to create your own listing. By default you can use useListing composable, which provides you predefined listings for category(cms) listing and product search listing.
 * Using factory you can provide our own compatible search method and use it for example for creating listing of orders in my account.
 *
 * @public
 */
export function createListingComposable<ELEMENTS_TYPE>({
  searchMethod,
  searchDefaults,
  listingKey,
}: {
  searchMethod: (
    searchParams: Partial<ShopwareSearchParams>
  ) => Promise<ListingResult<ELEMENTS_TYPE>>;
  searchDefaults: ShopwareSearchParams;
  listingKey: string;
}): UseListingReturn<ELEMENTS_TYPE> {
  const COMPOSABLE_NAME = "createListingComposable";
  const contextName = COMPOSABLE_NAME;

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
  const _storeInitialListing = inject(`useListingInitial-${listingKey}`, ref());
  provide(`useListingInitial-${listingKey}`, _storeInitialListing);
  // const _storeInitialListing = sharedRef<ListingResult<ELEMENTS_TYPE>>(
  //   `${cacheKey}-initialListing-${listingKey}`
  // );
  // const _storeAppliedListing = sharedRef<Partial<ListingResult<ELEMENTS_TYPE>>>(
  //   `${cacheKey}-appliedListing-${listingKey}`
  // );
  const _storeAppliedListing = inject(`useListingApplied-${listingKey}`, ref());
  provide(`useListingApplied-${listingKey}`, _storeAppliedListing);

  const getInitialListing = computed(() => _storeInitialListing.value);
  const setInitialListing = async (
    initialListing: Partial<ListingResult<ELEMENTS_TYPE>>
  ) => {
    // note: only v6.3.x compatible
    /* istanbul ignore next */
    if (
      initialListing?.currentFilters?.manufacturer?.length ||
      initialListing?.currentFilters?.properties?.length
    ) {
      loading.value = true;
      const allFiltersResult = await searchMethod({
        query: initialListing.currentFilters.search || undefined,
      });
      initialListing = Object.assign({}, initialListing, {
        aggregations: allFiltersResult?.aggregations,
      });
    }
    _storeInitialListing.value = initialListing;
    _storeAppliedListing.value = null;
    loading.value = false;
  };

  const initSearch = async (
    criteria: Partial<ShopwareSearchParams>
  ): Promise<ListingResult<ELEMENTS_TYPE>> => {
    loading.value = true;
    try {
      const searchCriteria = merge({}, searchDefaults, criteria);
      const result = await searchMethod(searchCriteria);
      return result;
      await setInitialListing(result);
    } catch (e) {
      throw e;
    } finally {
      loading.value = false;
    }
  };

  async function search(
    criteria: Partial<ShopwareSearchParams>,
    options?: {
      preventRouteChange?: boolean;
    }
  ) {
    loading.value = true;
    // const changeRoute = options?.preventRouteChange !== true && !cmsContext;
    try {
      // replace URL query params with currently selected criteria
      // changeRoute &&
      //   router
      //     .replace({
      //       query: {
      //         ...criteria,
      //       },
      //     })
      //     .catch(() => {});

      // prepare full criteria using defaults and currently selected criteria
      const searchCriteria = merge({}, searchDefaults, criteria);

      // TODO: investigate why filters are not complete
      const [result, allFiltersResult] = await Promise.all([
        searchMethod(searchCriteria),
        searchMethod({
          query: searchCriteria.query,
          includes: { product_listing: ["aggregations"] },
        }),
      ]);

      _storeAppliedListing.value = Object.assign({}, result, {
        aggregations: Object.assign(
          {},
          result?.aggregations,
          allFiltersResult?.aggregations
        ),
      });
      // final result should be:
      // _storeAppliedListing.value = result;
    } catch (e) {
      throw e;
    } finally {
      loading.value = false;
    }
  }

  const loadMore = async (): Promise<void> => {
    loadingMore.value = true;
    try {
      const query = {
        // ...router.currentRoute.query,
        p: getCurrentPage.value + 1,
      };

      const searchCriteria = merge({}, searchDefaults, query);
      const result = await searchMethod(searchCriteria);
      _storeAppliedListing.value = {
        ...getCurrentListing.value,
        page: result.page,
        elements: [
          ...(getCurrentListing.value?.elements || []),
          ...result.elements,
        ],
      };
    } catch (e) {
      throw e;
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
    Math.ceil(getTotal.value / getLimit.value)
  );

  const getSortingOrders = computed(() => {
    const oldSortings = Object.values(getCurrentListing.value?.sortings || {}); // before Shopware 6.4
    return getCurrentListing.value?.availableSortings || oldSortings;
  });

  const getCurrentSortingOrder = computed(
    () => getCurrentListing.value?.sorting
  );
  async function changeCurrentSortingOrder(order: string) {
    const query: Partial<ShopwareSearchParams> = {
      //...router.currentRoute.query,
      order,
    };
    await search(query);
  }

  const getCurrentPage = computed(() => getCurrentListing.value?.page || 1);
  const changeCurrentPage = async (pageNumber?: number) => {
    const query: Partial<ShopwareSearchParams> = {
      //...router.currentRoute.query,
      p: pageNumber || 1,
    };
    await search(query);
  };

  const getInitialFilters = computed(() => {
    return getListingFilters(getInitialListing.value?.aggregations);
  });

  const getAvailableFilters = computed(() => {
    return getListingFilters(
      _storeAppliedListing.value?.aggregations ||
        getCurrentListing.value?.aggregations
    );
  });

  const getCurrentFilters = computed(() => {
    const currentFiltersResult: any = {};
    const currentFilters = {
      ...getCurrentListing.value?.currentFilters,
      // ...router.currentRoute.query,
    };
    Object.keys(currentFilters).forEach((objectKey) => {
      if (!currentFilters[objectKey]) return;
      if (objectKey === "navigationId") return;
      if (objectKey === "price") {
        if (currentFilters[objectKey].min)
          currentFiltersResult["min-price"] = currentFilters[objectKey].min;
        if (currentFilters[objectKey].max)
          currentFiltersResult["max-price"] = currentFilters[objectKey].max;
        return;
      }
      if (objectKey === "p") return;
      currentFiltersResult[objectKey] = currentFilters[objectKey];
    });
    return currentFiltersResult;
  });

  const setCurrentFilters = (filter: { code: string; value: any }) => {
    const appliedFilters = Object.assign({}, getCurrentFilters.value, filter, {
      query: getCurrentFilters.value.search,
    });
    _storeAppliedListing.value.currentFilters = appliedFilters;
    return search(appliedFilters);
  };

  const resetFilters = () => {
    const defaultFilters = Object.assign(
      {
        manufacturer: [],
        properties: [],
        price: { min: 0, max: 0 },
        search: getCurrentFilters.value.search,
      },
      searchDefaults
    );

    _storeAppliedListing.value.currentFilters = defaultFilters;
    return search({ query: getCurrentFilters.value.search });
  };

  return {
    getInitialListing,
    setInitialListing,
    initSearch,
    search,
    getCurrentListing,
    getElements,
    getSortingOrders,
    getCurrentSortingOrder,
    changeCurrentSortingOrder,
    getCurrentPage,
    changeCurrentPage,
    getTotal,
    getTotalPagesCount,
    getLimit,
    getInitialFilters,
    getAvailableFilters,
    getCurrentFilters,
    setCurrentFilters,
    loading: computed(() => loading.value),
    loadMore,
    loadingMore: computed(() => loadingMore.value),
    resetFilters,
  };
}
