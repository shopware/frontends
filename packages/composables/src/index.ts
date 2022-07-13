import { inject } from "vue";
import { ShopwareApiInstance } from "@shopware-pwa/shopware-6-client";

export * from "./types";
export * from "./useCms";
export * from "./useProductConfigurator";
export * from "./useProductAssociations";
export * from "./useCmsBlock";
export * from "./useNavigation";
export * from "./useCart";
export * from "./useCartItem";
export * from "./useUser";
export * from "./useSessionContext";
export * from "./useAddToCart";
export * from "./useNotifications";
export * from "./useListing";
export * from "./useProduct";
export * from "./useCheckout";
export * from "./useSalutations";
export * from "./useCountries";
export * from "./useOrderDetails";

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
