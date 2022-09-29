import { ref, computed, ComputedRef, Ref, unref } from "vue";
import {
  Product,
  CrossSelling,
  ShopwareSearchParams,
} from "@shopware-pwa/types";

import {
  invokeGet,
  invokePost,
  getProductDetailsEndpoint,
} from "@shopware-pwa/api-client";
import { useShopwareContext } from "./useShopwareContext";

export type UseProductAssociationsReturn = {
  /**
   * Start loading resources
   */
  loadAssociations: (params: {
    method?: "post" | "get";
    searchParams: ShopwareSearchParams;
  }) => Promise<void>;
  /**
   * If it's loading - indicator
   */
  isLoading: ComputedRef<boolean>;

  productAssociations: ComputedRef<CrossSelling[]>;
};

/**
 * Get product association entity. Options - {@link UseProductAssociationsReturn}
 *
 */
export function useProductAssociations(
  product: Ref<Product>,
  options: {
    associationContext: "cross-selling" | "reviews";
  }
): UseProductAssociationsReturn {
  const association = options.associationContext;

  const { apiInstance } = useShopwareContext();
  const isLoading = ref(false);
  const associations = ref([]);

  const loadAssociations = async (params: {
    method?: "post" | "get";
    searchParams: ShopwareSearchParams;
  }) => {
    isLoading.value = true;
    const method = params.method || "get";
    try {
      if (method && method === "get") {
        const response = await invokeGet(
          {
            address: `${getProductDetailsEndpoint(
              product.value.id
            )}/${association}${params.searchParams || ""}`,
          },
          apiInstance
        );

        associations.value = response?.data as [];
        return;
      }

      const response = await invokePost(
        {
          address: `${getProductDetailsEndpoint(
            product.value.id
          )}/${association}`,
          payload: params,
        },
        apiInstance
      );

      associations.value = response?.data as [];
    } catch (error) {
      console.error(
        "[useProductAssociations][loadAssociations][error]:",
        error
      );
    } finally {
      isLoading.value = false;
    }
  };

  return {
    isLoading: computed(() => isLoading.value),
    productAssociations: computed(() => associations.value || []),
    loadAssociations,
  };
}
