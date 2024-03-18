/**
 * @module @shopware/nuxt3
 */
import {
  defineNuxtModule,
  addPlugin,
  createResolver,
  useLogger,
  // addTypeTemplate,
} from "@nuxt/kit";
import { addCustomTab } from "@nuxt/devtools-kit";
import { defu } from "defu";
import { isConfigDeprecated } from "./utils";
const MODULE_ID = "@shopware/nuxt3";

export default defineNuxtModule<ShopwareNuxtOptions>({
  meta: {
    name: MODULE_ID,
    configKey: "shopware",
  },
  async setup(options: ShopwareNuxtOptions, nuxt) {
    const logger = useLogger(MODULE_ID);
    const resolver = createResolver(import.meta.url);

    nuxt.options.runtimeConfig.public.shopware = defu(
      nuxt.options.runtimeConfig.public.shopware || {},
      options || {},
    );

    if (isConfigDeprecated(nuxt.options?.runtimeConfig?.public?.shopware)) {
      logger.warn(
        "You are using deprecated configuration (shopwareEndpoint or shopwareAccessToken). 'shopware' prefix is not needed anymore. Please update your _nuxt.config.ts_ ",
      );
    }

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

  interface RuntimeConfig {
    shopware?: Pick<ShopwareNuxtOptions, "endpoint" | "shopwareEndpoint">;
  }
  interface PublicRuntimeConfig {
    shopware: ShopwareNuxtOptions;
  }
}
