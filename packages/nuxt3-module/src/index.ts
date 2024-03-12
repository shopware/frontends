/**
 * @module @shopware/nuxt3
 */
import {
  defineNuxtModule,
  addPlugin,
  createResolver,
  logger,
  // addTypeTemplate,
} from "@nuxt/kit";
import { addCustomTab } from "@nuxt/devtools-kit";
import { defu } from "defu";
import { isConfigDeprecated } from "./utils";

export default defineNuxtModule<ShopwareNuxtOptions>({
  meta: {
    name: "@shopware/nuxt3",
    configKey: "shopware",
  },
  async setup(options, nuxt) {
    const resolver = createResolver(import.meta.url);

    if (
      isConfigDeprecated(options) ||
      isConfigDeprecated(nuxt.options?.runtimeConfig?.public?.shopware)
    ) {
      logger.warn(
        "You are using deprecated Shopware Nuxt3 module configuration. Please update your configuration to the new format. More information: <>",
      );
    }
    nuxt.options.runtimeConfig.public.shopware = defu(
      nuxt.options.runtimeConfig.public.shopware || {},
      options || {},
    );
    addPlugin({
      src: resolver.resolve("../plugin.ts"),
    });

    // TODO: define template only when file is not present in root directory
    // addTypeTemplate({
    //   filename: "shopware.d.ts",
    //   src: resolve(__dirname, "../shopware.d.ts"),
    // });

    addCustomTab({
      name: "shopware-frontends",
      title: "Shopware Frontends",
      icon: "fa6-brands:shopware",
      view: {
        type: "iframe",
        src: "https://frontends.shopware.com/",
      },
    });
  },
});

export type ShopwareNuxtOptions = {
  /**
   * Endpoint for your shopware backend.
   *
   * Default demo store: "https://demo-frontends.swstage.store/"
   */
  endpoint?: string;
  shopwareEndpoint?: string;
  accessToken?: string;
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
