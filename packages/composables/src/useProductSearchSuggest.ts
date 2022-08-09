import { ComputedRef, Ref, ref } from "vue";

import { useShopwareContext, useListing } from ".";

import { searchSuggestedProducts } from "@shopware-pwa/shopware-6-client";

import { ShopwareSearchParams, Product } from "@shopware-pwa/types";

/**
 * @beta
 */
export interface IUseProductSearchSuggest {
  searchTerm: Ref<string>;
  loading: ComputedRef<boolean>;
  search: (additionalCriteria?: Partial<ShopwareSearchParams>) => Promise<void>;
  loadMore: () => Promise<void>;
  getProducts: ComputedRef<Product[]>;
  getTotal: ComputedRef<number>;
}

/**
 * @beta
 */
export function useProductSearchSuggest(): IUseProductSearchSuggest {
  const COMPOSABLE_NAME = "useProductSearchSuggest";
  const contextName = COMPOSABLE_NAME;

  const { apiInstance } = useShopwareContext();

  const searchTerm = ref("");

  const listingKey = "productSearchSuggest";
  const searchMethod = async (
    searchCriteria: Partial<ShopwareSearchParams>
  ) => {
    return searchSuggestedProducts(searchCriteria, apiInstance);
  };

  const listingComposable = useListing({
    listingType: "productSearchListing",
  });

  const search = async (
    additionalCriteria: Partial<ShopwareSearchParams> = {}
  ) => {
    const searchCriteria = {
      query: searchTerm.value,
      ...additionalCriteria,
    };
    return listingComposable.search(searchCriteria, {
      preventRouteChange: true,
    });
  };

  return {
    searchTerm,
    loading: listingComposable.loading,
    search,
    loadMore: listingComposable.loadMore,
    getProducts: listingComposable.getElements,
    getTotal: listingComposable.getTotal,
  };
}
