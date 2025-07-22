// import type { RuntimeConfig, PublicRuntimeConfig } from "nuxt/schema";
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
  }

  interface RuntimeConfig {
    shopware?: Pick<
      ShopwareNuxtOptions,
      "endpoint" | "shopwareEndpoint" | "useUserContextInSSR"
    >;
    apiClientConfig?: ApiClientConfig;
    public: PublicRuntimeConfig;
  }
  interface PublicRuntimeConfig {
    shopware: ShopwareNuxtOptions;
    apiClientConfig?: ApiClientConfig;
  }
}
