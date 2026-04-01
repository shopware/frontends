import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { addCustomTab } from "@nuxt/devtools-kit";
/**
 * @module @shopware/nuxt3
 */
import {
  addPlugin,
  addTypeTemplate,
  createResolver,
  defineNuxtModule,
  useLogger,
} from "@nuxt/kit";
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
    nuxt.options.runtimeConfig.shopware = defu(
      nuxt.options.runtimeConfig.shopware || {},
      options || {},
    );
    const shopwareConfig =
      (nuxt.options.runtimeConfig?.public?.shopware as ShopwareNuxtOptions) ??
      undefined;
    nuxt.options.runtimeConfig.public.shopware = defu(
      nuxt.options.runtimeConfig.public.shopware || {},
      options || {},
    );
    const resolvedPublicShopwareConfig = nuxt.options.runtimeConfig.public
      .shopware as ShopwareNuxtOptions;
    const resolvedPrivateShopwareConfig = nuxt.options.runtimeConfig
      .shopware as ShopwareNuxtOptions;

    if (isConfigDeprecated(shopwareConfig)) {
      logger.warn(
        "You are using deprecated configuration (shopwareEndpoint or shopwareAccessToken). 'shopware' prefix is not needed anymore. Please update your _nuxt.config.ts_ ",
      );
    }
    const envPublicEndpoint =
      process.env.NUXT_PUBLIC_SHOPWARE_ENDPOINT ||
      process.env.NUXT_PUBLIC_SHOPWARE_SHOPWARE_ENDPOINT;
    const envPrivateEndpoint =
      process.env.NUXT_SHOPWARE_ENDPOINT ||
      process.env.NUXT_SHOPWARE_SHOPWARE_ENDPOINT;

    const csrEndpoint =
      envPublicEndpoint ||
      resolvedPublicShopwareConfig?.endpoint ||
      resolvedPublicShopwareConfig?.shopwareEndpoint;

    const ssrEndpoint =
      envPrivateEndpoint ||
      resolvedPrivateShopwareConfig?.endpoint ||
      resolvedPrivateShopwareConfig?.shopwareEndpoint ||
      csrEndpoint;

    if (ssrEndpoint) {
      nuxt.options.runtimeConfig.shopware = defu(
        nuxt.options.runtimeConfig.shopware || {},
        {
          endpoint: ssrEndpoint,
        },
      );
    }

    if (ssrEndpoint) {
      logger.info(`You are using SSR Shopware API endpoint: ${ssrEndpoint}`);
    }
    logger.info(`CSR Shopware API endpoint: ${csrEndpoint}`);
    addPlugin({
      src: resolver.resolve("../plugin.ts"),
    });

    const projectShopwareTypes = resolve(nuxt.options.rootDir, "shopware.d.ts");
    if (!existsSync(projectShopwareTypes)) {
      addTypeTemplate({
        filename: "shopware.d.ts",
        src: resolver.resolve("../shopware.d.ts"),
      });
    }

    addCustomTab({
      name: "shopware-frontends",
      title: "Shopware Frontends",
      icon: "fa6-brands:shopware",
      view: {
        type: "iframe",
        src: "https://frontends.shopware.com/",
      },
    });

    addCustomTab({
      name: "shopware-cms",
      title: "CMS Elements",
      icon: "carbon:assembly-cluster",
      view: {
        type: "iframe",
        src: "https://frontends.shopware.com/getting-started/cms/",
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
