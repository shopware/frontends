<script setup lang="ts">
const { isLoggedIn, login } = useUser();
const { createOrder } = useCheckout();
const { refreshSessionContext } = useSessionContext();

const {
  public: { loginData },
} = useRuntimeConfig();
const { search, getElements } = useListing({
  listingType: "productSearchListing",
});
const { addProduct } = useCart();
const { apiInstance } = useShopwareContext();
const activeStep = ref(0);
const paymentState = ref();

await refreshSessionContext();

await login({
  ...loginData,
});
activeStep.value = 1;
await search({
  query: "product",
  limit: 1,
});

await addProduct({
  id: getElements.value.pop()?.id as string,
  quantity: 1,
});
activeStep.value = 2;

const onPayButton = async (state: any) => {
  const order = await createOrder();
  activeStep.value = 3;
  await apiInstance.invoke.post("/store-api/handle-payment", {
    orderId: order.id,
    finishUrl: "http://localhost:3000/success",
    errorUrl: "http://localhost:3000/failure?payment-failed",
    // adyen specific
    stateData: JSON.stringify(state.data),
  });
  activeStep.value = 4;

  // check for current payment status after payment authorization attempt
  const paymentStateResponse = await apiInstance.invoke.post(
    "/store-api/adyen/payment-status",
    {
      orderId: order.id,
    },
  );

  paymentState.value = paymentStateResponse.data;

  activeStep.value = 5;
};
</script>
<template>
  <div class="p-4">
    <ProgressBar :activeStep="activeStep" />
    <div class="messages">
      <div
        v-if="paymentState"
        class="p-4 mb-4 mt-4 text-sm text-green-800 rounded-lg bg-green-50"
        role="alert"
      >
        <span class="font-medium">Payment state:</span>
        <pre>{{ paymentState }}</pre>
      </div>
      <div v-if="!isLoggedIn" class="error p-8">
        You are not logged in, visit `nuxt.config.ts` > [runtimeConfig >
        loginData] and change demo credentials.
      </div>
    </div>
    <ClientOnly v-if="!paymentState?.isFinal">
      <AdyenCreditCard
        class="mt-4"
        @checkoutInitialized=""
        @payButtonClicked="onPayButton"
      />
    </ClientOnly>
  </div>
</template>
