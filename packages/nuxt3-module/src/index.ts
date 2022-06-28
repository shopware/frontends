/**
 * @module @shopware/nuxt3
 */
import { defineNuxtModule, addPluginTemplate } from "@nuxt/kit";
import { NuxtModule } from "@nuxt/schema";
import { resolve } from "path";

export interface ShopwareNuxtOptions {
  shopwareEndpoint: string;
}

const nuxtModule: NuxtModule<ShopwareNuxtOptions> = defineNuxtModule({
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
        shopwareEndpoint: "https://frontends.shopware.store/",
        shopwareAccessToken: "SWSCNKY0DKJEN3FLTFI4SGPXEG",
        shopwareApiClient: {
          timeout: "10000",
          //   auth: {
          //     username: "",
          //     password: "",
          //   },
        },
        ...moduleConfig,
      },
    });

    nuxt.hook("autoImports:sources", (dirs) => {
      dirs.push({
        from: "@shopware-pwa/composables",
        imports: [
          "useCms",
          "useProduct",
          "useNavigation",
          "useAddToCart",
          "useSessionContext",
          "useProductConfigurator",
          "useUser",
          "useListing",
        ],
      });
      dirs.push({
        from: "@shopware-pwa/composables-next",
        imports: ["useShopwareContext"],
      });
    });
  },
});

export default nuxtModule;
