<script setup lang="ts">
import "@adyen/adyen-web/dist/adyen.css";
import {
  onMounted,
  useSessionContext,
  useShopwareContext,
  useRuntimeConfig,
} from "#imports";
import { useNuxtApp } from "#app";

const emits = defineEmits<{
  checkoutInitialized: [];
  payButtonClicked: [];
}>();

const { apiInstance } = useShopwareContext();
const { refreshSessionContext, sessionContext } = useSessionContext();
const { getPaymentMethods, createOrder } = useCheckout();
const {
  public: { adyenCheckout },
} = useRuntimeConfig();

const nuxtApp = useNuxtApp();

const adyenConfigResponse = await apiInstance.invoke.get(
  "/store-api/adyen/payment-methods",
);

const checkout = await nuxtApp.$adyenCheckout({
  ...(sessionContext.value?.extensions?.adyenData || adyenCheckout),
  paymentMethodsResponse: adyenConfigResponse.data,
  paymentMethodsConfiguration: {
    card: {
      hasHolderName: true,
      holderNameRequired: true,
      billingAddressRequired: false,
    },
  },
  onPaymentCompleted(data, element) {
    console.warn("onPaymentCompleted");
  },
  async onSubmit(state, element) {
    const order = await createOrder();
    await apiInstance.invoke.post("/store-api/handle-payment", {
      orderId: order.id,
      finishUrl: "http://localhost:3000/success",
      errorUrl: "http://localhost:3000/failure?payment-failed",
      // adyen specific
      stateData: JSON.stringify(state.data),
    });

    // check for current payment status after payment authorization attempt
    await apiInstance.invoke.post("/store-api/adyen/payment-status", {
      orderId: order.id,
    });
    return true;
  },
  onAdditionalDetails(state, element) {
    console.warn("onAdditionalDetails");
  },
  onActionHandled(data) {
    console.warn("onActionHandled");
  },
});
onMounted(async () => {
  getPaymentMethods();
  // Create an instance of the Component and mount it to the container you created.
  refreshSessionContext();
  checkout.create("dropin").mount("#adyen-credit-card");
});
</script>
<template>
  <div id="adyen-credit-card" />
</template>
