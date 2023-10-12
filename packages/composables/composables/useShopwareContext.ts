import { ShopwareApiInstance } from "@shopware-pwa/api-client";
import { inject } from "vue";
import ContextError from "./helpers/ContextError";

export type ShopwareContext = {
  /**
   * Shopware API instance
   */
  apiInstance: ShopwareApiInstance;
  devStorefrontUrl: string | null;
};

/**
 * @public
 * @category Context & Language
 */
export function useShopwareContext(): ShopwareContext {
  const shopwareContext = inject<ShopwareContext | null>("shopware", null);

  if (!shopwareContext) throw new ContextError("Shopware");

  return {
    apiInstance: shopwareContext.apiInstance,
    devStorefrontUrl: shopwareContext.devStorefrontUrl,
  };
}
