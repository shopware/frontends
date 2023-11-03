import { ref, computed, reactive } from "vue";
import type { Ref, ComputedRef, UnwrapNestedRefs } from "vue";
import type { Media, Product } from "@shopware-pwa/types";
import type { Price } from "@shopware-pwa/types/shopware-6-client/models/framework/pricing/Price";
import { useAddToCart, useCart, useProduct, useShopwareContext } from ".";

export type UseProductCustomizedProductConfiguratorReturn = {
  customizedProduct: ComputedRef<SwagCustomizedProductsTemplate>;
  state: Ref<{
    [key: string]: string | { media: { filename: string; id: string } };
  }>;
  addToCart: () => void;
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
    swagCustomizedProductsTemplate: SwagCustomizedProductsTemplate;
  };
};

/**
 * Composable to change product variant.
 * @public
 * @category Product
 */
export function useProductCustomizedProductConfigurator(): UseProductCustomizedProductConfiguratorReturn {
  const { apiInstance } = useShopwareContext();
  const { configurator, product } = useProduct();
  const { refreshCart } = useCart();

  const state = ref<{
    [key: string]: string | { media: { filename: string; id: string } };
  }>({});

  const customizedProduct = computed<SwagCustomizedProductsTemplate>(
    () =>
      (product.value as ProductExtensionsExtended).extensions
        ?.swagCustomizedProductsTemplate,
  );

  const addToCart = async () => {
    const payload = {
      "customized-products-template": {
        id: customizedProduct.value.id,
        options: Object.assign(
          {},
          ...Object.entries(state.value).map(([id, value]) => ({
            [id]: (value as any).media
              ? {
                  media: {
                    [(value as any).media.filename]: (value as any).media,
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

  return {
    customizedProduct,
    state,
    addToCart,
  };
}
