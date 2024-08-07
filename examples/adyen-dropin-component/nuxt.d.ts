import type { CoreConfiguration } from "@adyen/adyen-web";
import { AdyenCheckout } from "@adyen/adyen-web";
declare module "nuxt/schema" {
  interface PublicRuntimeConfig {
    loginData: {
      username: string;
      password: string;
    };
    adyenCheckout: CoreConfiguration;
  }
}

declare module "#app" {
  interface NuxtApp {
    $adyenCheckout: typeof AdyenCheckout;
  }
}

export {};
