import { ComputedRef, Ref, ref } from "vue";

import { ShopwareSearchParams, Product } from "@shopware-pwa/types";
import { useListing } from "./useListing";

export type UseProductSearchSuggestReturn = {
  searchTerm: Ref<string>;
  loading: ComputedRef<boolean>;
  search: (additionalCriteria?: Partial<ShopwareSearchParams>) => Promise<void>;
  loadMore: () => Promise<void>;
  getProducts: ComputedRef<Product[]>;
  getTotal: ComputedRef<number>;
};

export function useProductSearchSuggest(): UseProductSearchSuggestReturn {
  const searchTerm = ref("");

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
