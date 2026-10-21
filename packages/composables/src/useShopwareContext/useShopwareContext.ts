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
   * When `true`, reads may use the cacheable GET variants of the Store API.
   * `useCacheableRead().invokeRead` decides per request.
   *
   * @deprecated Do not branch on this flag. For a registered read, use
   * `useCacheableRead().invokeRead`. It also checks the session. Keep other
   * reads on POST. A branch on this flag sends GET with the context token,
   * also for a logged-in customer.
   * @default false
   */
  cacheableReads: boolean;
  /**
   * `true` when the server render runs without the visitor's session.
   *
   * @default false
   */
  ssrWithoutUserContext?: boolean;
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
    ssrWithoutUserContext: shopwareContext.ssrWithoutUserContext ?? false,
  };
}
