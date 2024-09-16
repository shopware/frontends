import { inject } from "vue";
import ContextError from "../helpers/ContextError";
import type { ApiClient } from "#shopware";

export type ShopwareContext = {
  devStorefrontUrl: string | null;
  /**
   * Shopware API client
   */
  apiClient: ApiClient;
};

/**
 * @public
 * @category Context & Language
 */
export function useShopwareContext(): ShopwareContext {
  const shopwareContext = inject<ShopwareContext | null>("shopware", null);

  const apiClient = inject<ApiClient>("apiClient");

  if (!shopwareContext || !apiClient) {
    console.error("[Error][Shopware] API Client is not provided.");
    throw new ContextError("Shopware or apiClient");
  }

  return {
    apiClient,
    devStorefrontUrl: shopwareContext.devStorefrontUrl,
  };
}
