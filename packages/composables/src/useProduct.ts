import { computed, ComputedRef, ref, Ref, unref } from "vue";
import { getProduct, getCmsPage } from "@shopware-pwa/api-client";
import {
  Product,
  CmsProductPageResponse,
  ClientApiError,
  ProductResponse,
} from "@shopware-pwa/types";
import { useShopwareContext } from "./useShopwareContext";
// import { getApplicationContext, useDefaults } from "@shopware-pwa/composables";
const NO_PRODUCT_REFERENCE_ERROR =
  "Associations cannot be loaded for undefined product";

export type UseProductReturn = {
  product: ComputedRef<Product | null>;
  search: (productId: string) => Promise<ProductResponse>;
  loadAssociations: () => Promise<void>;
};

export function useProduct(params?: {
  product?: Ref<Product> | Product;
}): UseProductReturn {
  const { apiInstance } = useShopwareContext();

  const loading: Ref<boolean> = ref(false);
  // @ts-ignore
  const product: Ref<Product | null> = ref(unref(params?.product) || null);
  const error: Ref<any> = ref(null);

  const loadAssociations = async () => {
    if (!product || !product.value || !product.value.id) {
      throw NO_PRODUCT_REFERENCE_ERROR;
    }

    const searchCriteria = {
      // includes: getIncludesConfig(),
      // associations: getAssociationsConfig(),
    };

    const urlPath = `detail/${product.value.parentId || product.value.id}`;
    const result = await getCmsPage(urlPath, searchCriteria, apiInstance);

    // load only children; other properties are loaded synchronously
    product.value = Object.assign({}, product.value, {
      crossSellings: (result as CmsProductPageResponse).product?.crossSellings,
    }) as Product;
  };

  const search = async (productId: string) => {
    const result = await getProduct(productId, null, apiInstance);
    product.value = result?.product as Product;
    return result;
  };

  return {
    product: computed(() => product.value),
    search,
    loadAssociations,
  };
}
