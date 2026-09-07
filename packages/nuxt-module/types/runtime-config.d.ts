import type { ShopwareNuxtOptions } from "../src";

declare module "nuxt/schema" {
  interface NuxtConfig {
    shopware?: ShopwareNuxtOptions;
  }
  interface NuxtOptions {
    shopware?: ShopwareNuxtOptions;
  }
  interface ApiClientConfig {
    headers?: {
      [key: string]: string;
    };
    /** Milliseconds to wait for response headers before a Store API request is aborted. */
    timeout?: number;
  }

  interface RuntimeConfig {
    shopware: ShopwareNuxtOptions;
    apiClientConfig?: ApiClientConfig;
    public: PublicRuntimeConfig;
  }
  interface PublicRuntimeConfig {
    shopware: ShopwareNuxtOptions;
    apiClientConfig?: ApiClientConfig;
  }
}
