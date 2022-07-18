import {
  getCategoryProducts,
  searchProducts,
} from "@shopware-pwa/shopware-6-client";

// import {
//   useCms,
//   createListingComposable,
//   useVueContext,
// } from "@shopware-pwa/composables";
import {
  ShopwareSearchParams,
  Product,
  CmsPageResponse,
  ListingResult,
  Sort,
} from "@shopware-pwa/commons/interfaces";
// import { IUseListing } from "../factories/createListingComposable";
import { inject, computed, ComputedRef, ref, provide } from "vue";
import { ListingFilter, getListingFilters } from "@shopware-pwa/helpers-next";
import { useShopwareContext, useCms } from ".";
import merge from "lodash/merge.js";

/**
 * @beta
 */
export type ListingType = "productSearchListing" | "categoryListing";

export interface IUseListing<ELEMENTS_TYPE> {
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
  getSortingOrders: ComputedRef<Sort[] | { key: string; label: string }>;
  getCurrentSortingOrder: ComputedRef<string | undefined>;
  changeCurrentSortingOrder: (order: string) => Promise<void>;
  getCurrentPage: ComputedRef<string | number>;
  changeCurrentPage: (pageNumber?: number) => Promise<void>;
  getTotal: ComputedRef<number>;
  getTotalPagesCount: ComputedRef<number>;
  getLimit: ComputedRef<number>;
  getAvailableFilters: ComputedRef<ListingFilter[]>;
  getCurrentFilters: ComputedRef<any>;
  loading: ComputedRef<boolean>;
  loadingMore: ComputedRef<boolean>;
}

/**
 * @beta
 */
export function useListing(params?: {
  listingType: ListingType;
}): IUseListing<Product> {
  const COMPOSABLE_NAME = "useListing";
  const contextName = COMPOSABLE_NAME;

  const listingType = params?.listingType || "categoryListing";

  // const { getDefaults } = useDefaults({ defaultsKey: contextName });
  const { apiInstance } = useShopwareContext();

  let searchMethod;
  if (listingType === "productSearchListing") {
    searchMethod = async (searchCriteria: Partial<ShopwareSearchParams>) => {
      return searchProducts(searchCriteria, apiInstance);
    };
  } else {
    const { resourceIdentifier } = useCms();

    searchMethod = async (searchCriteria: Partial<ShopwareSearchParams>) => {
      if (!resourceIdentifier.value) {
        throw new Error(
          "[useListing][search] Search category id does not exist."
        );
      }
      return getCategoryProducts(
        resourceIdentifier.value,
        searchCriteria,
        apiInstance
      );
    };
  }

  return createListingComposable<Product>({
    listingKey: listingType,
    searchMethod,
    searchDefaults: {}, //getDefaults(),
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
}): IUseListing<ELEMENTS_TYPE> {
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
  const _storeInitialListing = inject(`useListingInitia-${listingKey}`, ref());
  provide(`useListingInitia-${listingKey}`, _storeInitialListing);
  // const _storeInitialListing = sharedRef<ListingResult<ELEMENTS_TYPE>>(
  //   `${cacheKey}-initialListing-${listingKey}`
  // );
  // const _storeAppliedListing = sharedRef<Partial<ListingResult<ELEMENTS_TYPE>>>(
  //   `${cacheKey}-appliedListing-${listingKey}`
  // );
  const _storeAppliedListing = inject(`useListingApplied-${listingKey}`, ref());
  provide(`useListingApplied-${listingKey}`, _storeInitialListing);

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

  const search = async (
    criteria: Partial<ShopwareSearchParams>,
    options?: {
      preventRouteChange?: boolean;
    }
  ): Promise<void> => {
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
      const result = await searchMethod(searchCriteria);
      // TODO: investigate why filters are not complete
      const allFiltersResult = await searchMethod({
        query: searchCriteria.query,
        includes: { product_listing: ["aggregations"] },
      });
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
  };

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
  const changeCurrentSortingOrder = async (order: string) => {
    const query: Partial<ShopwareSearchParams> = {
      //...router.currentRoute.query,
      order,
    };
    await search(query);
  };

  const getCurrentPage = computed(() => getCurrentListing.value?.page || 1);
  const changeCurrentPage = async (pageNumber?: number) => {
    const query: Partial<ShopwareSearchParams> = {
      //...router.currentRoute.query,
      p: pageNumber || 1,
    };
    await search(query);
  };

  const getAvailableFilters = computed(() => {
    return getListingFilters(getCurrentListing.value?.aggregations);
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
    getAvailableFilters,
    getCurrentFilters,
    loading: computed(() => loading.value),
    loadMore,
    loadingMore: computed(() => loadingMore.value),
  };
}
