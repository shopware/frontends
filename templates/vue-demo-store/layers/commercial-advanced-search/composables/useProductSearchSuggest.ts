import { ref } from "vue";
import type { ComputedRef, Ref } from "vue";
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
   * @returns
   */
  search(
    criteria?: Partial<
      operations["searchSuggest post /search-suggest"]["body"]
    >,
  ): Promise<void>;
  /**
   * Returns the product list found by the search
   */
  getProducts: ComputedRef<Schemas["Product"][]>;
  /**
   * Returns the total number of products found by the search
   */
  getTotal: ComputedRef<number>;
  getCategories: ComputedRef<Schemas["Category"][]>;
  getManufacturers: ComputedRef<Schemas["ProductManufacturer"][]>;
  getSuggestions: ComputedRef<string[]>;
};

/**
 * Composable for product suggest search.
 * @public
 * @category Product
 */
export function useProductSearchSuggest(): UseProductSearchSuggestReturn {
  const searchTerm = ref("");
  const isLoading = ref(false);
  const suggestResponse =
    ref<operations["searchSuggest post /search-suggest"]["response"]>();

  const productElements = computed(() => suggestResponse.value?.elements || []);
  const getCategories = computed<Schemas["Category"][]>(
    () =>
      Object.values(
        suggestResponse.value?.extensions?.multiSuggestResult?.suggestResults
          ?.category?.elements,
      ) || [],
  );
  const getManufacturers = computed<Schemas["ProductManufacturer"][]>(
    () =>
      Object.values(
        suggestResponse.value?.extensions?.multiSuggestResult?.suggestResults
          ?.product_manufacturer?.elements,
      ) || [],
  );
  const getTotal = computed(() => suggestResponse.value?.total || 0);

  const { apiClient } = useShopwareContext();

  const search = async (
    additionalCriteria: operations["searchSuggest post /search-suggest"]["body"],
  ) => {
    isLoading.value = true;
    const searchCriteria: operations["searchSuggest post /search-suggest"]["body"] =
      {
        ...additionalCriteria,
        search: searchTerm.value,
      };
    const result = await apiClient.invoke(
      "searchSuggest post /search-suggest",
      {
        body: searchCriteria,
        headers: {
          // @ts-expect-error: this header is not documented yet
          "sw-include-seo-urls": true,
        },
      },
    );
    isLoading.value = false;
    suggestResponse.value = result.data;
  };

  return {
    searchTerm,
    loading: computed(() => !!isLoading.value),
    search,
    getProducts: computed(() => productElements.value),
    getCategories,
    getManufacturers,
    getSuggestions: computed(
      () =>
        Object.values(
          suggestResponse.value?.extensions?.completionResult || {},
        )?.filter((phrase) => phrase !== "array_struct") || [],
    ),
    getTotal,
  };
}
