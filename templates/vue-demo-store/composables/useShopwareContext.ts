import type { ShopwareContext } from "@shopware-pwa/composables-next";
import type { ApiClient } from "#shopware";

export function useShopwareContext() {
  const shopwareContext = inject<ShopwareContext | null>("shopware", null);

  const apiClient = inject<ApiClient>("apiClient");

  if (!shopwareContext || !apiClient)
    throw new Error("Critical error. Shopware context is not provided.");

  return {
    apiClient,
    devStorefrontUrl: shopwareContext.devStorefrontUrl,
  };
}
