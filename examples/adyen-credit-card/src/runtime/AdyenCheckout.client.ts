import { defineNuxtPlugin } from "#app";
import { useRuntimeConfig } from "#imports";
import AdyenCheckout from "@adyen/adyen-web";

export default defineNuxtPlugin(async () => {
  const runtimeConfig = useRuntimeConfig();

  if (!runtimeConfig?.public?.adyenCheckout) {
    throw Error(
      "[AdyenChechout.client plugin][config]: Adyen Module is not configured properly. Check out your nuxt.config file under 'adyenCheckout' key.",
    );
  }
  const checkout = await AdyenCheckout(runtimeConfig?.public?.adyenCheckout);

  return {
    provide: {
      adyenCheckout: checkout,
    },
  };
});
