import { computed, ref } from "vue";
import type { ComputedRef } from "vue";

import { useShopwareContext } from "#imports";
import type { Schemas } from "#shopware";

export type UseProductAssociationsReturn = {
  /**
   * Loads the cross-selling groups of the product.
   */
  loadAssociations(params?: {
    /**
     * @deprecated Ignored, the request is always sent as `POST`. Will be removed in the next major release.
     */
    method?: "post" | "get";
    /**
     * @deprecated Ignored. Will be removed in the next major release.
     */
    searchParams?: Schemas["Criteria"];
  }): Promise<void>;
  /**
   * If it's loading - indicator
   */
  isLoading: ComputedRef<boolean>;
  /**
   * Product associations, like CrossSelling[]
   */
  productAssociations: ComputedRef<Schemas["CrossSellingElementCollection"]>;
};

/**
 * Get product association entity.
 * @public
 * @category Product
 */
export function useProductAssociations(
  product: ComputedRef<Schemas["Product"]>,
  options?: {
    /**
     * @deprecated Ignored, only cross-selling is loaded. Will be removed in the next major release.
     */
    associationContext?: "cross-selling" | "reviews";
    includeSeoUrls?: boolean;
  },
): UseProductAssociationsReturn {
  if (!product.value)
    throw new Error("[useProductAssociations]: Product is not provided.");

  const { apiClient } = useShopwareContext();
  const isLoading = ref(false);
  const associations = ref<Schemas["CrossSellingElementCollection"]>([]);

  const loadAssociations = async () => {
    isLoading.value = true;
    try {
      const response = await apiClient.invoke(
        "readProductCrossSellings post /product/{productId}/cross-selling",
        {
          ...(options?.includeSeoUrls && {
            headers: {
              "sw-include-seo-urls": true,
            },
          }),
          pathParams: { productId: product.value.id },
        },
      );

      associations.value = response.data;
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
