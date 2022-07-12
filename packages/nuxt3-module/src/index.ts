/**
 * @module @shopware/nuxt3
 */
import { defineNuxtModule, addPluginTemplate } from "@nuxt/kit";
import { NuxtModule } from "@nuxt/schema";
import { resolve } from "path";

export interface ShopwareNuxtOptions {
  example: string;
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
        shopwareEndpoint: "https://demo-frontends.swstage.store/",
        shopwareAccessToken: "SWSCBHFSNTVMAWNZDNFKSHLAYW",
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
        imports: ["useProduct", "useProductConfigurator", "useListing"],
      });
      dirs.push({
        from: "@shopware-pwa/composables-next",
        imports: [
          "useAddToCart",
          "useShopwareContext",
          "useSessionContext",
          "useCart",
          "useCartItem",
          "useNavigation",
          "useNotifications",
          "useCms",
          "useCmsBlock",
          "useUser",
        ],
      });
    });
  },
});

export default nuxtModule;
