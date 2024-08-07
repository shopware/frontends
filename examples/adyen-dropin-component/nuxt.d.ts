import type { CoreConfiguration, AdyenCheckout } from "@adyen/adyen-web";

declare module "nuxt/schema" {
  interface NuxtApp {
    $adyenCheckout: ReturnType<typeof AdyenCheckout>;
  }

  interface PublicRuntimeConfig {
    loginData: {
      username: string;
      password: string;
    };
    adyenCheckout: CoreConfiguration;
  }
}

export {};
