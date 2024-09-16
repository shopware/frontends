import { ref } from "vue";
import type { ComputedRef, Ref } from "vue";
import { useProductSearchListing } from "#imports";
import type { Schemas, operations } from "#shopware";

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
  search(
    additionalCriteria?: Partial<operations["searchPage post /search"]["body"]>,
  ): Promise<void>;
  /**
   * Loads more products for current search criteria
   */
  loadMore(
    criteria: operations["searchPage post /search"]["body"],
  ): Promise<void>;
  /**
   * Returns the product list found by the search
   */
  getProducts: ComputedRef<Schemas["ProductListingResult"]["elements"]>;
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

  const listingComposable = useProductSearchListing();

  const search = async (
    additionalCriteria = {} as operations["searchPage post /search"]["body"],
  ) => {
    const searchCriteria: operations["searchPage post /search"]["body"] = {
      ...additionalCriteria,
      search: searchTerm.value,
    };
    return listingComposable.search(searchCriteria);
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
