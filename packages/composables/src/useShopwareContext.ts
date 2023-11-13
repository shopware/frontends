import type { ShopwareApiInstance } from "@shopware-pwa/api-client";
import { inject } from "vue";
import ContextError from "./helpers/ContextError";
import type { ApiClient } from "#shopware";

export type ShopwareContext = {
  /**
   * Shopware API instance
   * @deprecated use `apiClient` instead
   */
  apiInstance: ShopwareApiInstance;
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
export function useShopwareContext() {
  const shopwareContext = inject<ShopwareContext | null>("shopware", null);

  const apiClient = inject<ApiClient>("apiClient");

  if (!shopwareContext || !apiClient)
    throw new ContextError("Shopware or apiClient");

  return {
    /**
     * @deprecated use `apiClient` instead
     */
    apiInstance: shopwareContext.apiInstance,
    apiClient,
    devStorefrontUrl: shopwareContext.devStorefrontUrl,
  };
}
