import { createInjectionState, createSharedComposable } from "@vueuse/core";
import { computed } from "vue";
import { useCategory, useShopwareContext } from "#imports";
import type { Schemas, operations } from "#shopware";
import { useListingCore } from "./useListingCore";
import { useProductListingFilters } from "./useProductListingFilters";
import { useProductListingPagination } from "./useProductListingPagination";
import { useProductListingSorting } from "./useProductListingSorting";

export type {
  ListingType,
  ShortcutFilterParam,
  UseListingReturn,
} from "./utils";
export { useListingCoreContext } from "./useListingCore";
export { useProductListingPagination } from "./useProductListingPagination";
export { useProductListingSorting } from "./useProductListingSorting";
export { useProductListingFilters } from "./useProductListingFilters";
import type { ListingType, UseListingReturn } from "./utils";

/**
 * @public
 * @category Product
 */
export function useListing(params?: {
  listingType: ListingType;
  categoryId?: string;
  defaultSearchCriteria?: operations["searchPage post /search"]["body"];
  initialListing?: Schemas["ProductListingResult"] | null;
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
    initialListing: params?.initialListing,
  });
}

const [_createCategoryListingContext, _categoryListingContext] =
  createInjectionState(
    (initialListing?: Schemas["ProductListingResult"] | null) => {
      return useListing({
        listingType: "categoryListing",
        initialListing,
      });
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
  initialListing,
}: {
  searchMethod(
    searchParams:
      | operations["readProductListing post /product-listing/{categoryId}"]["body"]
      | operations["searchPage post /search"]["body"],
  ): Promise<Schemas["ProductListingResult"]>;
  searchDefaults: operations["searchPage post /search"]["body"];
  listingKey: string;
  initialListing?: Schemas["ProductListingResult"] | null;
}): UseListingReturn {
  const core = useListingCore({
    listingKey,
    searchMethod,
    searchDefaults,
    initialListing,
  });

  const pagination = useProductListingPagination({
    getCurrentListing: core.getCurrentListing,
    getLimit: core.getLimit,
    getTotal: core.getTotal,
    search: core.search,
  });

  const sorting = useProductListingSorting({
    getCurrentListing: core.getCurrentListing,
    search: core.search,
  });

  const filters = useProductListingFilters({
    getInitialListing: core.getInitialListing,
    getCurrentListing: core.getCurrentListing,
    _storeAppliedListing: core._storeAppliedListing,
    search: core.search,
    searchDefaults,
  });

  return {
    // Core
    getInitialListing: core.getInitialListing,
    setInitialListing: core.setInitialListing,
    initSearch: core.initSearch,
    search: core.search,
    loadMore: core.loadMore,
    getCurrentListing: core.getCurrentListing,
    getElements: core.getElements,
    getTotal: core.getTotal,
    getLimit: core.getLimit,
    loading: computed(() => core.loading.value),
    loadingMore: computed(() => core.loadingMore.value),
    // Pagination
    getCurrentPage: pagination.getCurrentPage,
    changeCurrentPage: pagination.changeCurrentPage,
    getTotalPagesCount: pagination.getTotalPagesCount,
    // Sorting
    getSortingOrders: sorting.getSortingOrders,
    getCurrentSortingOrder: sorting.getCurrentSortingOrder,
    changeCurrentSortingOrder: sorting.changeCurrentSortingOrder,
    // Filters
    getInitialFilters: filters.getInitialFilters,
    getAvailableFilters: filters.getAvailableFilters,
    getCurrentFilters: filters.getCurrentFilters,
    setCurrentFilters: filters.setCurrentFilters,
    resetFilters: filters.resetFilters,
    filtersToQuery: filters.filtersToQuery,
  };
}
