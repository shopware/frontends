import { inject } from "vue";
import { ShopwareApiInstance } from "@shopware-pwa/shopware-6-client";

export * from './useCms'

export type ShopwareContext = {
  apiInstance: ShopwareApiInstance;
};

export function useShopwareContext() {
  const shopwareContext = inject<ShopwareContext | null>("shopware", null);

  if (!shopwareContext) throw new Error("Shopware context is not available.");

  return {
    apiInstance: shopwareContext.apiInstance,
  };
}
