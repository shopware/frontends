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
  checkoutInitialized: [];
  payButtonClicked: [state: any];
}>();

const { apiInstance } = useShopwareContext();
const { sessionContext } = useSessionContext();
const {
  public: { adyenCheckout },
} = useRuntimeConfig();

const nuxtApp = useNuxtApp();

const adyenConfigResponse = await apiInstance.invoke.get(
  "/store-api/adyen/payment-methods",
);

type AdyenEnhancedSessionContext = SessionContext & {
  extensions: {
    adyenData: unknown;
  };
};

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
