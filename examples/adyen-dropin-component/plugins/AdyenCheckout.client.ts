import { defineNuxtPlugin, useRuntimeConfig } from "#imports";
import { AdyenCheckout, type CoreConfiguration } from "@adyen/adyen-web";
import { defu } from "defu";

export default defineNuxtPlugin(async () => {
  const runtimeConfig = useRuntimeConfig();
  if (!runtimeConfig?.public?.adyenCheckout) {
    throw Error(
      "[AdyenChechout.client plugin][config]: Adyen Module is not configured properly. Check out your nuxt.config file under 'adyenCheckout' key.",
    );
  }

  // factory for creating AdyenCheckout instance by providing its credentials and parameters - use the default one from runtime config instead
  const getInstance = async (createInstanceParams: CoreConfiguration) => {
    return await AdyenCheckout(
      // merge configs
      defu(
        {},
        runtimeConfig?.public.adyenCheckout as CoreConfiguration,
        createInstanceParams,
      ),
    );
  };

  return {
    provide: {
      adyenCheckout: getInstance,
    },
  };
});
