import { ComputedRef, Ref, ref } from "vue";

import { ShopwareSearchParams, Product } from "@shopware-pwa/types";
import { useListing } from "./useListing";

export type UseProductSearchSuggestReturn = {
  /**
   * Current search term
   */
  searchTerm: Ref<string>;
  /**
   * Indicates if the search is in progress
   */
  loading: ComputedRef<boolean>;
  /**
   * Performs the search
   * @param additionalCriteria - additional search criteria of type {@link ShopwareSearchParams}
   * @returns
   */
  search(additionalCriteria?: Partial<ShopwareSearchParams>): Promise<void>;
  /**
   * Loads more products for current search criteria
   */
  loadMore(): Promise<void>;
  /**
   * Returns the product list found by the search
   */
  getProducts: ComputedRef<Product[]>;
  /**
   * Returns the total number of products found by the search
   */
  getTotal: ComputedRef<number>;
};

/**
 * Composable for product suggest search.
 * @public
 * @category Product
 */
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
