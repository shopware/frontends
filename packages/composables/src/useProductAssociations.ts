import { ref, computed, ComputedRef } from "vue";
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
   * Start loading resources. Search Parameters and HTTP method can be passed.
   *
   */
  loadAssociations(params: {
    method?: "post" | "get";
    searchParams: ShopwareSearchParams;
  }): Promise<void>;
  /**
   * If it's loading - indicator
   */
  isLoading: ComputedRef<boolean>;
  /**
   * Product associations, like CrossSelling[]
   */
  productAssociations: ComputedRef<CrossSelling[]>;
};

/**
 * Get product association entity.
 * @public
 * @category Product
 */
export function useProductAssociations(
  product: ComputedRef<Product>,
  options: {
    associationContext: "cross-selling" | "reviews";
  },
): UseProductAssociationsReturn {
  if (!product.value)
    throw new Error("[useProductAssociations]: Product is not provided.");

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
              product.value.id,
            )}/${association}${params.searchParams || ""}`,
          },
          apiInstance,
        );

        associations.value = response?.data as [];
        return;
      }

      const response = await invokePost(
        {
          address: `${getProductDetailsEndpoint(
            product.value.id,
          )}/${association}`,
          payload: params?.searchParams || {},
        },
        apiInstance,
      );

      associations.value = response?.data as [];
    } catch (error) {
      console.error(
        "[useProductAssociations][loadAssociations][error]:",
        error,
      );
    } finally {
      isLoading.value = false;
    }
  };

  return {
    isLoading: computed(() => isLoading.value),
    productAssociations: computed(() => associations.value),
    loadAssociations,
  };
}
