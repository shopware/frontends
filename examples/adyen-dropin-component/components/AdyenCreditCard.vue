<script setup lang="ts">
import "@adyen/adyen-web/dist/adyen.css";
import type { SessionContext } from "@shopware-pwa/types";
import {
  onMounted,
  useSessionContext,
  useShopwareContext,
  useRuntimeConfig,
} from "#imports";
import { useNuxtApp } from "#app";

const emits = defineEmits<{
  // to inform the upper levels of an app that payButton was clicked (that means it was validated by Adyen and we can proceed)
  payButtonClicked: [state: any];
}>();

const { apiInstance } = useShopwareContext();
const { sessionContext } = useSessionContext();
const {
  public: { adyenCheckout },
} = useRuntimeConfig();

const nuxtApp = useNuxtApp();

// get the clientKey and environment settings from backend (will overwrite the corresponding settings from nuxt.config.ts)
const adyenConfigResponse = await apiInstance.invoke.get(
  "/store-api/adyen/payment-methods",
);

// adjust a SessionContext type to reflect actual one enhanced by Adyen add-on
type AdyenEnhancedSessionContext = SessionContext & {
  extensions: {
    adyenData: unknown;
  };
};
// init the AdyenCheckout instance
const checkout = await nuxtApp.$adyenCheckout({
  ...((sessionContext.value as AdyenEnhancedSessionContext)?.extensions
    ?.adyenData || adyenCheckout),
  paymentMethodsResponse: adyenConfigResponse.data,
  paymentMethodsConfiguration: {
    card: {
      hasHolderName: true,
      holderNameRequired: true,
      billingAddressRequired: false,
    },
  },
  async onSubmit(state, element) {
    // emit the payButtonClicked event with a current state coming from Adyen checkout instance
    emits("payButtonClicked", state);
  },
});
onMounted(async () => {
  // Create an instance of the Component and mount it to the container you created.
  checkout.create("dropin").mount("#adyen-credit-card");
});
</script>
<template>
  <div id="adyen-credit-card" />
</template>
