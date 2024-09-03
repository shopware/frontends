<script setup lang="ts">
import { Dropin } from "@adyen/adyen-web";
import "@adyen/adyen-web/styles/adyen.css";

const emits = defineEmits<{
  // to inform the upper levels of an app that payButton was clicked (that means it was validated by Adyen and we can proceed)
  payButtonClicked: [state: any];
}>();

const { apiClient } = useShopwareContext();
const { sessionContext } = useSessionContext();
const {
  public: { adyenCheckout },
} = useRuntimeConfig();

const nuxtApp = useNuxtApp();

let adyenConfigResponse;
// get the clientKey and environment settings from backend (will overwrite the corresponding settings from nuxt.config.ts)
try {
  adyenConfigResponse = await apiClient.invoke(
    "readAdyenConfiguration post /adyen/payment-status",
    {
      body: {
        orderId: "123",
      },
    },
  );
} catch (error) {
  alert(
    "The project or API instance isn't configured properly. Please check the README.md to have it working correctly.",
  );
}

// init the AdyenCheckout instance
const checkout = await nuxtApp.$adyenCheckout({
  ...(sessionContext.value?.extensions?.adyenData || adyenCheckout),
  paymentMethodsResponse: adyenConfigResponse?.data,
  async onSubmit(state, element) {
    // emit the payButtonClicked event with a current state coming from Adyen checkout instance
    emits("payButtonClicked", state);
  },
});
onMounted(async () => {
  // Create an instance of the Component and mount it to the container you created.
  new Dropin(checkout).mount("#adyen-credit-card");
});
</script>
<template>
  <div id="adyen-credit-card" />
</template>
