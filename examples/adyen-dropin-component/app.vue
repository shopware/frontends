<script setup lang="ts">
const { isLoggedIn, login } = useUser();
const { createOrder } = useCheckout();
const { refreshSessionContext } = useSessionContext();

// get the login data from nuxt.config.ts
const {
  public: { loginData },
} = useRuntimeConfig();

// useListing for further product search
const { search, getElements } = useListing({
  listingType: "productSearchListing",
});
// composable used to add to cart a product
const { addProduct } = useCart();
// configured apiClient instance in order to make a custom API call
const { apiInstance } = useShopwareContext();
// current step for progress bar displaying <ProgressBar /> in a template
const activeStep = ref(0);
// container for keeping and displaying an incoming payment state from adyen
const paymentState = ref();

try {
  await refreshSessionContext();
  // auto log-in

  await login({
    ...loginData,
  });
  activeStep.value = 1;
  // search for a product to be added to cart
  await search({
    query: "product",
    limit: 1,
  });
  // add to cart a found product
  await addProduct({
    id: getElements.value.pop()?.id as string,
    quantity: 1,
  });
  activeStep.value = 2;
} catch (error) {
  console.error(
    "Your configuration isn't correct. Please check the README.md and try again.",
  );
  console.error("Error details: ", error);
}

// handler for @payButtonClicked event from <AdyenCreditCard /> component located a template
const onPayButton = async (state: any) => {
  // when user clicks "Pay" button in a drop-in component, create an order based on current session (automatically logged in user & product added to cart)
  const order = await createOrder();
  activeStep.value = 3;
  // send a state got from onPayButton handler to Shopware 6 API
  await apiInstance.invoke.post("/store-api/handle-payment", {
    orderId: order.id,
    finishUrl: "http://localhost:3000/success",
    errorUrl: "http://localhost:3000/failure?payment-failed",
    // adyen specific data
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
  <div class="p-4" test-id="test-wrapper">
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
      <AdyenCreditCard class="mt-4" @payButtonClicked="onPayButton" />
    </ClientOnly>
  </div>
</template>
