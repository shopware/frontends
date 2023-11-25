import type { ApiClient } from "#shopware";
import type { ShopwareContext } from "@shopware-pwa/composables-next";

export function useShopwareContext() {
  const shopwareContext = inject<ShopwareContext | null>("shopware", null);

  const apiClient = inject<ApiClient>("apiClient");

  if (!shopwareContext || !apiClient)
    throw new Error("Critical error. Shopware context is not provided.");

  return {
    /**
     * @deprecated use `apiClient` instead
     */
    apiInstance: shopwareContext.apiInstance,
    apiClient,
    devStorefrontUrl: shopwareContext.devStorefrontUrl,
  };
}
