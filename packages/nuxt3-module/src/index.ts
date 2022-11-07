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
    // TODO: remove it once nitro server build contains all external packages of nuxt3-module (composables-next)
    nuxt.options.build.transpile.push("@shopware-pwa/composables-next");

    nuxt.hook("imports:sources", (dirs) => {
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
          "useCategory",
          "useCategorySearch",
          "useNavigation",
          "useNavigationContext",
          "useNavigationSearch",
          "useNotifications",
          "useLandingSearch",
          "useListing",
          "useCms",
          "useCmsBlock",
          "useOrderDetails",
          "useProduct",
          "useProductAssociations",
          "useProductConfigurator",
          "useProductPrice",
          "useProductReviews",
          "useProductSearch",
          "useProductSearchSuggest",
          "useProductWishlist",
          "useSalutations",
          "useUser",
          "useWishlist",
          "usePrice",
          "useCustomerOrders",
          "useAddress",
          "useCmsMeta",
          "useNewsletter",
          "useNavigationContext",
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
