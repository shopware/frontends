import type { Schemas } from "#shopware";

type MediaOption = { media: { filename: string; id: string } };

export type UseProductCustomizedProductConfiguratorReturn = {
  /**
   * Assigned template of the product
   */
  customizedProduct: ComputedRef<
    Schemas["SwagCustomizedProductsTemplate"] | undefined
  >;
  /**
   * State of the product selected options
   */
  state: Ref<{
    [key: string]: string | MediaOption;
  }>;
  /**
   * Is product customizable
   */
  isActive: ComputedRef<boolean>;
  /**
   * Add product to cart
   */
  addToCart: () => void;
  /**
   * Handle file upload
   * Gets mediaId from API and assigns it to the state
   */
  handleFileUpload: (event: Event, optionId: string) => Promise<void>;
};

/**
 * Global state for selected options
 */
const productsState = ref<{
  [productId: string]: {
    [key: string]: string | MediaOption;
  };
}>({});

/**
 * Composable to change product variant.
 * @public
 * @category Product
 */
export function useProductCustomizedProductConfigurator(): UseProductCustomizedProductConfiguratorReturn {
  const { apiClient } = useShopwareContext();
  const { product } = useProduct();
  const { refreshCart } = useCart();
  if (!productsState.value[product.value.id]) {
    productsState.value[product.value.id] = {};
  }
  const customizedProduct = computed(
    () =>
      product.value?.extensions
        ?.swagCustomizedProductsTemplate as Schemas["SwagCustomizedProductsTemplate"],
  );

  const isActive = computed<boolean>(() => !!customizedProduct.value?.active);
  const state = computed(() => productsState.value[product.value.id]);

  const addToCart = async () => {
    /**
     * Payload for adding product to cart
     */
    const payload: Schemas["AddToCartPayload"] = {
      "customized-products-template": {
        id: customizedProduct.value.id,
        options: Object.assign(
          {},
          ...Object.entries(state.value).map(([id, value]) => ({
            [id]: (value as MediaOption).media
              ? {
                  media: {
                    [(value as MediaOption).media.filename]: (
                      value as MediaOption
                    ).media,
                  },
                }
              : { value },
          })),
        ),
      },
      lineItems: {
        [product.value.id]: {
          id: product.value.id,
          type: "product",
          referencedId: product.value.id,
          quantity: 1,
          stackable: true,
          removable: true,
        },
      },
    };

    await apiClient.invoke(
      "addCustomizedProductToCart post /customized-products/add-to-cart",
      { body: payload },
    );
    refreshCart();
  };

  const handleFileUpload = async (event: Event, optionId: string) => {
    const file = (event.target as EventTarget & { files: FileList }).files[0];
    const formData = new FormData();
    formData.append("file", file);
    formData.append("optionId", `"${optionId}"`);
    const addedMediaResponse = await apiClient.invoke(
      "uploadCustomizedProductImage post /customized-products/upload",
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        accept: "application/json",
        body: formData,
      },
    );

    state.value[optionId] = {
      media: {
        id: addedMediaResponse.data.mediaId,
        filename: addedMediaResponse.data.fileName,
      },
    };
  };

  return {
    isActive,
    customizedProduct,
    state,
    addToCart,
    handleFileUpload,
  };
}
