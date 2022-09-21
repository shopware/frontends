import { ref, Ref, unref } from "vue";
import { getProduct, getCmsPage } from "@shopware-pwa/api-client";
import {
  Product,
  CmsProductPageResponse,
  ClientApiError,
} from "@shopware-pwa/types";
import { useShopwareContext } from "./useShopwareContext";
// import { getApplicationContext, useDefaults } from "@shopware-pwa/composables";
const NO_PRODUCT_REFERENCE_ERROR =
  "Associations cannot be loaded for undefined product";

export type UseProductReturn = {
  product: Ref<Product | null>;
  search: (path: string, associations?: any) => any;
  loading: Ref<boolean>;
  error: Ref<any>;
  [x: string]: any;
};

export function useProduct(params?: {
  product?: Ref<Product> | Product;
}): UseProductReturn {
  const COMPOSABLE_NAME = "useProduct";
  const contextName = COMPOSABLE_NAME;

  const { apiInstance } = useShopwareContext();
  // const { getAssociationsConfig, getIncludesConfig } = useDefaults({
  //   defaultsKey: contextName,
  // });

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
    loading.value = true;
    try {
      const result = await getProduct(productId, null, apiInstance);
      product.value = result?.product as Product;
      return result;
    } catch (e) {
      const err = e as ClientApiError;
      error.value = err.messages;
    } finally {
      loading.value = false;
    }
  };

  return {
    product,
    loading,
    search,
    error,
    loadAssociations,
  };
}
