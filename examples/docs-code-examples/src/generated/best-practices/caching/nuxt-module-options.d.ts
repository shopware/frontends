import type { NuxtModule } from "@nuxt/schema";

type ShopwareModuleOptions =
  typeof import("@shopware/nuxt-module").default extends NuxtModule<
    infer Options,
    unknown,
    boolean
  >
    ? Partial<Options> | false
    : Record<string, any> | false;

declare module "@nuxt/schema" {
  interface NuxtConfig {
    shopware?: ShopwareModuleOptions;
  }
}

declare module "nuxt/schema" {
  interface NuxtConfig {
    shopware?: ShopwareModuleOptions;
  }
}
