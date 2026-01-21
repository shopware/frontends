<script setup lang="ts">
const { isLoggedIn, login } = useUser();
const { createOrder, getPaymentMethods, paymentMethods, setPaymentMethod } =
  useCheckout();
const { refreshSessionContext, sessionContext } = useSessionContext();

const config = useRuntimeConfig();
const { search, getElements } = useProductSearchListing();
const { addProduct } = useCart();
const { apiClient } = useShopwareContext();

// State
const activeStep = ref(0);
const paymentState = ref<unknown>();
const error = ref<string>();
const braintreeNonce = ref<string>();
const deviceData = ref<string>();

// Debug info
const debugInfo = ref<{
  shopId?: string;
  currencyId?: string;
  salesChannelId?: string;
  paymentMethodId?: string;
  paymentMethodName?: string;
  braintreePaymentMethodId?: string;
}>({});

try {
  await refreshSessionContext();

  // Collect debug info from session context
  debugInfo.value = {
    currencyId: sessionContext.value?.currency?.id,
    salesChannelId: sessionContext.value?.salesChannel?.id,
    paymentMethodId: sessionContext.value?.paymentMethod?.id,
  };

  // Auto log-in for demo
  const loginData = config?.public?.loginData as {
    username: string;
    password: string;
  };

  if (loginData?.username && loginData?.password) {
    await login(loginData);
    activeStep.value = 1;
  }

  // Search for a product and add to cart
  await search({
    search: "product",
    limit: 1,
  });

  const product = getElements.value.pop();
  if (product?.id) {
    await addProduct({
      id: product.id,
      quantity: 1,
    });
    activeStep.value = 2;
  }

  // Fetch payment methods and find Braintree
  await getPaymentMethods();
  const braintreeMethod = paymentMethods.value.find(
    (pm) =>
      pm.technicalName === "payment_braintree_creditcard" ||
      pm.shortName?.toLowerCase().includes("braintree") ||
      pm.name?.toLowerCase().includes("braintree"),
  );

  if (braintreeMethod) {
    debugInfo.value.braintreePaymentMethodId = braintreeMethod.id;
    // Select Braintree as the payment method
    await setPaymentMethod({ id: braintreeMethod.id });
    await refreshSessionContext();
  } else {
    console.warn(
      "Braintree payment method not found. Available methods:",
      paymentMethods.value.map((pm) => ({
        id: pm.id,
        name: pm.name,
        technicalName: pm.technicalName,
      })),
    );
  }

  // Update debug info with current payment method
  debugInfo.value.paymentMethodId = sessionContext.value?.paymentMethod?.id;
  debugInfo.value.paymentMethodName = sessionContext.value?.paymentMethod?.name;
} catch (err) {
  console.error("Setup error:", err);
  error.value =
    "Configuration error. Please check the README.md and nuxt.config.ts.";
}

// Handler for payment submission from BraintreeCreditCard component
// See: https://github.com/shopware/braintree-app/wiki/3.-Headless-integration
const onPaymentSubmit = async (payload: {
  nonce: string;
  deviceData?: string;
}) => {
  try {
    braintreeNonce.value = payload.nonce;
    deviceData.value = payload.deviceData;
    activeStep.value = 3;

    // Create the order
    const order = await createOrder();
    activeStep.value = 4;

    // Handle payment - pass braintreeNonce and braintreeDeviceData here (not in createOrder)
    const paymentResponse = await apiClient.invoke(
      "handlePaymentMethod post /handle-payment",
      {
        body: {
          orderId: order.id,
          finishUrl: `${window.location.origin}/?success=true&orderId=${order.id}`,
          errorUrl: `${window.location.origin}/?error=payment-failed&orderId=${order.id}`,
          braintreeNonce: payload.nonce,
          braintreeDeviceData: payload.deviceData,
        },
      },
    );

    activeStep.value = 5;
    paymentState.value = {
      orderId: order.id,
      orderNumber: order.orderNumber,
      orderState: order.stateMachineState?.technicalName,
      paymentResponse: paymentResponse?.data,
      status: "Order created, payment handled",
    };
  } catch (err) {
    console.error("Payment error:", err);
    error.value = `Payment failed: ${err instanceof Error ? err.message : "Unknown error"}`;
  }
};
</script>

<template>
  <div class="p-4 max-w-2xl mx-auto">
    <h1 class="text-2xl font-bold mb-4">Braintree Credit Card - Headless Test</h1>

    <!-- Progress indicator -->
    <div class="mb-6 flex gap-2">
      <div
        v-for="(step, index) in [
          'Init',
          'Logged in',
          'Cart ready',
          'Processing',
          'Order created',
          'Done',
        ]"
        :key="index"
        class="px-3 py-1 rounded text-sm"
        :class="
          activeStep >= index
            ? 'bg-green-500 text-white'
            : 'bg-gray-200 text-gray-600'
        "
      >
        {{ step }}
      </div>
    </div>

    <!-- Debug info -->
    <details class="mb-4 p-3 bg-gray-100 rounded">
      <summary class="cursor-pointer font-medium">Debug Info</summary>
      <pre class="mt-2 text-xs overflow-auto">{{ JSON.stringify(debugInfo, null, 2) }}</pre>
    </details>

    <!-- Error display -->
    <div
      v-if="error"
      class="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50"
      role="alert"
    >
      <span class="font-medium">Error:</span> {{ error }}
    </div>

    <!-- Payment state display -->
    <div
      v-if="paymentState"
      class="p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50"
      role="alert"
    >
      <span class="font-medium">Payment Result:</span>
      <pre class="mt-2 text-xs overflow-auto">{{ JSON.stringify(paymentState, null, 2) }}</pre>
    </div>

    <!-- Login warning -->
    <div v-if="!isLoggedIn" class="p-4 mb-4 bg-yellow-50 text-yellow-800 rounded">
      Not logged in. Update credentials in nuxt.config.ts
    </div>

    <!-- Payment method warning -->
    <div
      v-if="debugInfo.paymentMethodId && !debugInfo.paymentMethodName?.toLowerCase().includes('braintree')"
      class="p-4 mb-4 bg-orange-50 text-orange-800 rounded"
    >
      <p class="font-medium">Warning: Braintree payment method not selected</p>
      <p class="text-sm mt-1">
        Current: {{ debugInfo.paymentMethodName }} ({{ debugInfo.paymentMethodId }})
      </p>
    </div>

    <!-- Braintree component -->
    <ClientOnly v-if="!paymentState && isLoggedIn">
      <BraintreeCreditCard
        class="mt-4"
        @payment-submit="onPaymentSubmit"
      />
    </ClientOnly>
  </div>
</template>
