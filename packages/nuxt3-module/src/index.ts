/**
 * @module @shopware/nuxt3
 */
import { defineNuxtModule, addPluginTemplate } from "@nuxt/kit";
import { NuxtModule } from "@nuxt/schema";
import { resolve } from "path";

export interface ShopwareNuxtOptions {}

const nuxtModule: NuxtModule<ShopwareNuxtOptions> = defineNuxtModule({
  meta: {
    name: "@shopware/nuxt3",
    configKey: "shopware",
  },
  setup(_, nuxt) {
    addPluginTemplate({
      filename: "runtime/shopware.plugin.mjs",
      // @ts-ignore
      src: resolve(__dirname, "../src/templates/plugin.ts"),
      options: {
        shopwareEndpoint: "https://pwa-demo-api.shopware.com/trunk/",
        shopwareAccessToken: "SWSC40-LJTNO6COUEN7CJMXKLA",
        shopwareApiClient: {
          timeout: "10000",
          //   auth: {
          //     username: "",
          //     password: "",
          //   },
        },
      },
    });
  },
});

export default nuxtModule;
