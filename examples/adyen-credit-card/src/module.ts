import {
  defineNuxtModule,
  addPlugin,
  addComponent,
  createResolver,
} from "@nuxt/kit";
import AdyenCheckout from "@adyen/adyen-web";
export type AdyenCheckoutOptions = Parameters<typeof AdyenCheckout>[0];

export default defineNuxtModule<AdyenCheckoutOptions>({
  meta: {
    name: "adyen-checkout",
    configKey: "adyenCheckout",
  },
  defaults: {},
  setup(options, nuxtApp) {
    const resolver = createResolver(import.meta.url);

    nuxtApp.options.runtimeConfig.public.adyenCheckout ||= options;

    addPlugin({
      src: resolver.resolve("./runtime/AdyenCheckout.client"),
      mode: "client",
    });

    addComponent({
      name: "AdyenCreditCard",
      filePath: resolver.resolve("./runtime/AdyenCreditCard.vue"),
    });
  },
});

declare module "#app" {
  interface NuxtApp {
    $adyenCheckout: Awaited<ReturnType<typeof AdyenCheckout>>;
  }
}

declare module "@nuxt/schema" {
  interface NuxtConfig {
    adyenCheckout?: AdyenCheckoutOptions;
  }

  interface PublicRuntimeConfig {
    adyenCheckout: AdyenCheckoutOptions;
  }

  interface NuxtOptions {
    adyenCheckout: AdyenCheckoutOptions;
  }
}

export {};
