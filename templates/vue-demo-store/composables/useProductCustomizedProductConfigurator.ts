import { ref, computed } from "vue";
import type { Ref, ComputedRef } from "vue";
import type { Media, Product } from "@shopware-pwa/types";
import type { Price } from "@shopware-pwa/types/shopware-6-client/models/framework/pricing/Price";
import {
  useCart,
  useProduct,
  useShopwareContext,
} from "@shopware-pwa/composables-next";

type MediaOption = { media: { filename: string; id: string } };

export type UseProductCustomizedProductConfiguratorReturn = {
  /**
   * Assigned template of the product
   */
  customizedProduct: ComputedRef<SwagCustomizedProductsTemplate | undefined>;
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

export type CustomizedProductOptionValue = {
  versionId: string;
  translated: {
    displayName: string;
  };
  createdAt: string;
  updatedAt: null | string;
  oneTimeSurcharge: boolean;
  relativeSurcharge: boolean;
  advancedSurcharge: boolean;
  taxId: string;
  tax: null | unknown;
  price: Price[];
  percentageSurcharge: number;
  prices: [];
  id: string;
  templateOptionId: string;
  value: {
    _value: string;
  };
  displayName: string;
  itemNumber: null | number;
  default: boolean;
  position: number;
  templateOption: null | unknown;
  translations: null | unknown;
  templateExclusionConditions: null | unknown;
  templateOptionVersionId: string;
  apiAlias: "swag_customized_products_template_option_value";
};

export type CustomizedProductOption = {
  translated: {
    displayName: "Outer leather";
    description: null;
    placeholder: null;
  };
  createdAt: "2020-08-06T06:26:55.533+00:00";
  updatedAt: null;
  oneTimeSurcharge: false;
  relativeSurcharge: false;
  advancedSurcharge: false;
  taxId: null;
  tax: null;
  calculatedPrice: null;
  percentageSurcharge: 0;
  price: Price[];
  prices: [];
  id: string;
  type: "select" | "colorselect" | "imageupload" | "textfield" | "imageselect";
  displayName: string;
  description: null | string;
  placeholder: null | string;
  templateId: string;
  typeProperties: {
    isMultiSelect: boolean;
  };
  itemNumber: null | number;
  required: boolean;
  position: number;
  translations: null | unknown;
  template: null | unknown;
  values: CustomizedProductOptionValue[];
};

export type SwagCustomizedProductsTemplate = {
  versionId: string;
  translated: {
    displayName: string;
    description: string;
  };
  createdAt: string;
  updatedAt: null | string;
  internalName: string;
  displayName: string;
  description: string;
  mediaId: null | string;
  active: boolean;
  stepByStep: boolean;
  confirmInput: boolean;
  optionsAutoCollapse: boolean;
  decisionTree: unknown[];
  translations: null | unknown;
  media: null | Media;
  products: null | Product[];
  exclusions: unknown[];
  configurations: null | unknown;
  id: string;
  parentVersionId: string;
  options: CustomizedProductOption[];
  apiAlias: "swag_customized_products_template";
};

export type ProductExtensionsExtended = Product & {
  extensions: {
    swagCustomizedProductsTemplate?: SwagCustomizedProductsTemplate;
  };
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
  const { apiInstance } = useShopwareContext();
  const { product } = useProduct();
  const { refreshCart } = useCart();
  if (!productsState.value[product.value.id]) {
    productsState.value[product.value.id] = {};
  }
  const customizedProduct = computed<
    SwagCustomizedProductsTemplate | undefined
  >(
    () =>
      (product.value as ProductExtensionsExtended).extensions
        ?.swagCustomizedProductsTemplate,
  );

  const isActive = computed<boolean>(() => !!customizedProduct.value?.active);
  const state = computed(() => productsState.value[product.value.id]);

  const addToCart = async () => {
    /**
     * Payload for adding product to cart
     */
    const payload = {
      "customized-products-template": {
        id: customizedProduct.value?.id,
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
    await apiInstance.invoke.post(
      "/store-api/customized-products/add-to-cart",
      payload,
    );
    refreshCart();
  };

  const handleFileUpload = async (event: Event, optionId: string) => {
    const file = (event.target as EventTarget & { files: FileList }).files[0];
    const formData = new FormData();
    formData.append("file", file);
    formData.append("optionId", optionId);
    const headers = { "Content-Type": "multipart/form-data" };
    const addedMediaResponse = await apiInstance.invoke.post<{
      mediaId: string;
      fileName: string;
    }>(`/store-api/customized-products/upload`, formData, {
      headers,
    });

    state.value[optionId] = {
      media: {
        id: addedMediaResponse?.data?.mediaId,
        filename: addedMediaResponse?.data?.fileName,
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
