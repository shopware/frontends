import type { ApiClientRuntimeConfig, ShopwareNuxtOptions } from "../src";

declare module "nuxt/schema" {
  interface NuxtConfig {
    shopware?: ShopwareNuxtOptions;
  }
  interface NuxtOptions {
    shopware?: ShopwareNuxtOptions;
  }
  interface ApiClientConfig extends ApiClientRuntimeConfig {}

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
