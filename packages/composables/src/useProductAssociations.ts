import { ref, computed } from "vue";
import type { ComputedRef } from "vue";
import { useShopwareContext } from "#imports";
import type { Schemas } from "#shopware";

export type UseProductAssociationsReturn = {
  /**
   * Start loading resources. Search Parameters and HTTP method can be passed.
   *
   */
  loadAssociations(params: {
    method?: "post" | "get";
    searchParams: Schemas["Criteria"];
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
  options: {
    associationContext: "cross-selling" | "reviews";
  },
): UseProductAssociationsReturn {
  if (!product.value)
    throw new Error("[useProductAssociations]: Product is not provided.");

  // @ts-ignore: temporary until fixed or removed
  const association = options.associationContext;

  const { apiClient } = useShopwareContext();
  const isLoading = ref(false);
  const associations = ref<Schemas["CrossSellingElementCollection"]>([]);

  // params: {
  // method?: "post" | "get";
  // searchParams: Schemas["Criteria"];
  // }
  const loadAssociations = async () => {
    isLoading.value = true;
    // const method = params.method || "get";
    try {
      // TODO: someting might be wrong with the endpoint, figure it out and fix definitions
      // if (method && method === "get") {
      //   // const response = await invokeGet(
      //   //   {
      //   //     address: `${getProductDetailsEndpoint(
      //   //       product.value.id as string,
      //   //     )}/${association}${params.searchParams || ""}`,
      //   //   },
      //   //   apiInstance,
      //   // );
      //   const response = await apiClient.invoke(
      //     "readProductDetail post /product/{productId}",
      //     {
      //       productId: product.value.id,
      //     },
      //   );

      //   associations.value = response?.data as [];
      //   return;
      // }

      // const response = await invokePost(
      //   {
      //     address: `${getProductDetailsEndpoint(
      //       product.value.id as string,
      //     )}/${association}`,
      //     payload: params?.searchParams || {},
      //   },
      //   apiInstance,
      // );
      const response = await apiClient.invoke(
        "readProductCrossSellings post /product/{productId}/cross-selling",
        {
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
