/**
 * @module @shopware/nuxt3
 */
import { defineNuxtModule, addPluginTemplate } from "@nuxt/kit";
import { resolve } from "path";
import { isDependencyInstalledLocally, resolveOwnDependency } from "./utils";

export default defineNuxtModule<ShopwareNuxtOptions>({
  meta: {
    name: "@shopware/nuxt3",
    configKey: "shopware",
  },
  async setup(moduleConfig, nuxt) {
    const shopwareEndpoint =
      moduleConfig.shopwareEndpoint ?? "https://demo-frontends.shopware.store";
    const accessToken =
      moduleConfig.shopwareAccessToken ?? "SWSCBHFSNTVMAWNZDNFKSHLAYW";

    addPluginTemplate({
      filename: "runtime/shopware.plugin.mjs",
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      src: resolve(__dirname, "../plugin.ts"),
      options: {
        shopwareEndpoint: shopwareEndpoint,
        shopwareAccessToken: accessToken,
        shopwareApiClient: {
          timeout: moduleConfig.apiClientConfig?.timeout ?? "10000",
        },
      },
    });

    // TODO: remove it once nitro server build contains all external packages of nuxt3-module (composables-next)
    //nuxt.options.build.transpile.push("@shopware-pwa/composables-next");

    // use a module's dependency in order to not install it again within an end-project to keep compatibility
    const apiClientDependencyPath = await resolveOwnDependency(
      "@shopware-pwa/api-client",
      nuxt,
    );
    const isApiClientInstalledLocally = await isDependencyInstalledLocally(
      nuxt.options.rootDir,
      "@shopware-pwa/api-client",
    );
    if (!isApiClientInstalledLocally && apiClientDependencyPath) {
      nuxt.options.alias["@shopware-pwa/api-client"] = apiClientDependencyPath;
    }

    const isComposablesNextInstalledLocally =
      await isDependencyInstalledLocally(
        nuxt.options.rootDir,
        "@shopware-pwa/composables-next",
      );
    const composablesDependencyPath = await resolveOwnDependency(
      "@shopware-pwa/composables-next",
      nuxt,
    );
    if (!isComposablesNextInstalledLocally && composablesDependencyPath) {
      nuxt.options.alias["@shopware-pwa/composables-next"] =
        composablesDependencyPath;
    }

    nuxt.hook("imports:sources", (dirs) => {
      dirs.push({
        from: "@shopware-pwa/composables-next",
        imports: [
          "useAddress",
          "useAddToCart",
          "useBreadcrumbs",
          "useCart",
          "useCartItem",
          "useCategory",
          "useCategorySearch",
          "useCheckout",
          "useCms",
          "useCmsBlock",
          "useCmsElementConfig",
          "useCmsMeta",
          "useCmsSection",
          "useConnectionTest",
          "useCountries",
          "useCustomerOrders",
          "useCustomerPassword",
          "useInternationalization",
          "useLandingSearch",
          "useListing",
          "useNavigation",
          "useNavigationContext",
          "useNavigationSearch",
          "useNewsletter",
          "useNotifications",
          "useOrderDetails",
          "useOrderPayment",
          "usePrice",
          "useProduct",
          "useProductAssociations",
          "useProductConfigurator",
          "useProductPrice",
          "useProductReviews",
          "useProductSearch",
          "useProductSearchSuggest",
          "useProductWishlist",
          "useSalutations",
          "useSessionContext",
          "useShopwareContext",
          "useUser",
          "useWishlist",
        ],
      });
    });

    // @ts-expect-error - private API
    nuxt.hook("devtools:customTabs", (iframeTabs) => {
      iframeTabs.push({
        name: "frontends",
        title: "Shopware",
        icon: "fa6-brands:shopware",
        view: {
          type: "iframe",
          src: "https://frontends.shopware.com/",
        },
      });
    });
  },
});

export type ShopwareNuxtOptions = {
  /**
   * Endpoint for your shopware backend.
   *
   * Default demo store: "https://demo-frontends.swstage.store/"
   */
  shopwareEndpoint?: string;
  shopwareAccessToken?: string;
  devStorefrontUrl?: string;
  apiClientConfig?: {
    timeout?: number | string;
  };
  /**
   * Use user context in SSR mode. Warning: with wrong edge caching it can cause serving another user's data.
   * Use when edge caching is configured properly.
   *
   * @default false
   */
  useUserContextInSSR?: boolean;
};

declare module "@nuxt/schema" {
  interface NuxtConfig {
    shopware?: ShopwareNuxtOptions;
  }
  interface NuxtOptions {
    shopware?: ShopwareNuxtOptions;
  }

  interface PublicRuntimeConfig {
    shopware: ShopwareNuxtOptions;
  }
}
