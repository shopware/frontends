/**
 * @module @shopware/nuxt3
 */
import { defineNuxtModule, addPluginTemplate } from "@nuxt/kit";
import { resolve } from "path";

export type ShopwareNuxtOptions = {
  /**
   * Endpoint for your shopware backend.
   *
   * Default demo store: "https://demo-frontends.swstage.store/"
   */
  shopwareEndpoint?: string;
  shopwareAccessToken?: string;
  apiClientConfig?: {
    timeout?: number | string;
    // auth?: {
    //   username: string;
    //   password: string;
    // };
  };
};

export default defineNuxtModule<ShopwareNuxtOptions>({
  meta: {
    name: "@shopware/nuxt3",
    configKey: "shopware",
  },
  setup(moduleConfig, nuxt) {
    addPluginTemplate({
      filename: "runtime/shopware.plugin.mjs",
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      src: resolve(__dirname, "../plugin.ts"),
      options: {
        shopwareEndpoint:
          moduleConfig.shopwareEndpoint ??
          "https://demo-frontends.shopware.store/",
        shopwareAccessToken:
          moduleConfig.shopwareAccessToken ?? "SWSCBHFSNTVMAWNZDNFKSHLAYW",
        shopwareApiClient: {
          timeout: moduleConfig.apiClientConfig?.timeout ?? "10000",
        },
      },
    });

    nuxt.hook("autoImports:sources", (dirs) => {
      dirs.push({
        from: "@shopware-pwa/composables-next",
        imports: [
          "useAddToCart",
          "useCheckout",
          "useCountries",
          "useCustomerPassword",
          "useCmsElementConfig",
          "useShopwareContext",
          "useSessionContext",
          "useCart",
          "useCartItem",
          "useNavigation",
          "useNotifications",
          "useListing",
          "useCms",
          "useCmsBlock",
          "useOrderDetails",
          "useProduct",
          "useProductConfigurator",
          "useProductReviews",
          "useSalutations",
          "useProductSearchSuggest",
          "useUser",
          "useProductAssociations",
          "useWishlist",
          "usePrice",
          "useCustomerOrders",
        ],
      });
    });
  },
});

declare module "@nuxt/schema" {
  interface NuxtConfig {
    shopware?: ShopwareNuxtOptions;
  }
  interface NuxtOptions {
    shopware?: ShopwareNuxtOptions;
  }
}
