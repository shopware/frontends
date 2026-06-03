import { inject } from "vue";
import type { ApiClient } from "#shopware";
import ContextError from "../helpers/ContextError";

export type ShopwareContext = {
  devStorefrontUrl: string | null;
  /**
   * Shopware API client
   */
  apiClient: ApiClient;
  /**
   * Browser locale, working in SSR
   * If not provided, it will be "en-US"
   */
  browserLocale: string;
  /**
   * When `true`, composables read data through the cacheable GET variants of
   * the Store API (criteria compressed into the `_criteria` query param)
   * instead of POST, so the responses can be cached by HTTP infrastructure
   * (CDN, reverse proxy, browser). Requires a backend that supports the GET
   * read routes.
   *
   * @default false
   */
  cacheableReads: boolean;
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
    browserLocale: shopwareContext.browserLocale || "en-US",
    cacheableReads: shopwareContext.cacheableReads ?? false,
  };
}
