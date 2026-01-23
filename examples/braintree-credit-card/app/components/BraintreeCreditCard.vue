<script setup lang="ts">
import dropin, { type Dropin } from "braintree-web-drop-in";

const emit = defineEmits<{
  paymentSubmit: [payload: { nonce: string; deviceData?: string }];
}>();

const { sessionContext } = useSessionContext();
const { apiClient } = useShopwareContext();

// State
const loading = ref(true);
const error = ref<string>();
const clientToken = ref<string>();
const dropinInstance = ref<Dropin>();
const tokenResponse = ref<unknown>();

// Decode JWT to inspect payload (for debugging)
function decodeJWT(token: string) {
  try {
    const parts = token.split(".");
    const payloadPart = parts[1];
    if (parts.length !== 3 || !payloadPart) return null;
    const payload = JSON.parse(atob(payloadPart));
    return payload;
  } catch {
    return null;
  }
}

// Official Shopware Braintree App URL (same for all shops using the official app)
// Only change this if you're self-hosting the Braintree app infrastructure
const BRAINTREE_APP_URL = "https://braintree.shopware.com";

// Fetch client token for Braintree SDK
// Flow: Shopware Store-API → JWT → Braintree App → Braintree Client Token
// Reference: https://github.com/FriendsOfShopware/shopware-storefront-sdk/blob/main/src/service/app-client.service.ts
async function fetchClientToken() {
  console.log("Step 1: Get app token from Shopware Store-API...");

  const response = await apiClient.invoke(
    "generateJWTAppSystemAppServer post /app-system/{name}/generate-token",
    {
      pathParams: { name: "SwagBraintreeApp" },
    },
  );

  const token = response.data?.token;
  const shopId = response.data?.shopId;

  if (!token) throw new Error("Failed to get token from Shopware");

  // Also decode JWT to get context IDs
  const decoded = decodeJWT(token);
  const currencyId = decoded?.currencyId || sessionContext.value?.currency?.id;
  const salesChannelId =
    decoded?.salesChannelId || sessionContext.value?.salesChannel?.id;

  console.log("Step 2: Fetch Braintree client config...");
  console.log("Using shopId:", shopId || decoded?.iss);

  // Build URL with query params (like the storefront JS does)
  const params = new URLSearchParams();
  params.set("shop-id", shopId || decoded?.iss || "");
  if (currencyId) params.set("currency-id", currencyId);
  if (salesChannelId) params.set("sales-channel-id", salesChannelId);

  const url = `${BRAINTREE_APP_URL}/api/client/config?${params.toString()}`;
  console.log("Calling:", url);

  // Use the correct headers as per storefront SDK:
  // - shopware-app-token (NOT Authorization: Bearer)
  // - shopware-app-shop-id
  const braintreeResponse = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "shopware-app-token": token,
      "shopware-app-shop-id": shopId || decoded?.iss || "",
    },
  });

  if (!braintreeResponse.ok) {
    const errorText = await braintreeResponse.text();
    tokenResponse.value = {
      token,
      shopId,
      decoded,
      error: errorText,
      status: braintreeResponse.status,
    };
    throw new Error(`Braintree API error: ${braintreeResponse.status}`);
  }

  const braintreeData = await braintreeResponse.json();
  tokenResponse.value = { token, shopId, decoded, braintreeData };

  return braintreeData.clientToken || braintreeData.token;
}

// Initialize Braintree Drop-in
async function initializeDropin(token: string) {
  const instance = await dropin.create({
    authorization: token,
    container: "#braintree-dropin-container",
    // Enable dataCollector for fraud detection (required for deviceData)
    dataCollector: true,
    card: {
      cardholderName: {
        required: true,
      },
    },
  });

  dropinInstance.value = instance;
}

// Handle pay button click
async function handlePayment() {
  if (!dropinInstance.value) {
    error.value = "Braintree not initialized";
    return;
  }

  try {
    const payload = await dropinInstance.value.requestPaymentMethod();

    emit("paymentSubmit", {
      nonce: payload.nonce,
      deviceData: payload.deviceData,
    });
  } catch (err) {
    console.error("Payment method request failed:", err);
    error.value = err instanceof Error ? err.message : "Payment failed";
  }
}

// Initialize on mount
onMounted(async () => {
  try {
    loading.value = true;
    error.value = undefined;

    // Try to get the client token
    const token = await fetchClientToken();
    clientToken.value = token;

    // Initialize the drop-in UI
    await initializeDropin(token);

    loading.value = false;
  } catch (err) {
    console.error("Braintree initialization failed:", err);
    error.value = err instanceof Error ? err.message : "Initialization failed";
    loading.value = false;
  }
});

// Cleanup on unmount
onUnmounted(() => {
  if (dropinInstance.value) {
    dropinInstance.value.teardown();
  }
});
</script>

<template>
  <div class="braintree-wrapper">
    <!-- Loading state -->
    <div v-if="loading" class="p-4 bg-gray-100 rounded animate-pulse">
      Loading Braintree...
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="space-y-4">
      <div class="p-4 bg-red-50 text-red-800 rounded">
        <p class="font-medium">Braintree Error:</p>
        <p class="text-sm mt-1">{{ error }}</p>
      </div>

      <!-- Debug info for troubleshooting -->
      <details class="p-3 bg-gray-100 rounded text-sm">
        <summary class="cursor-pointer font-medium">Troubleshooting Info</summary>
        <div class="mt-2 space-y-2">
          <p><strong>Currency ID:</strong> {{ sessionContext?.currency?.id }}</p>
          <p><strong>Sales Channel ID:</strong> {{ sessionContext?.salesChannel?.id }}</p>
          <div v-if="tokenResponse">
            <p><strong>Token Response:</strong></p>
            <pre class="text-xs overflow-auto">{{ JSON.stringify(tokenResponse, null, 2) }}</pre>
          </div>
        </div>
      </details>

      <div class="p-4 bg-blue-50 text-blue-800 rounded text-sm">
        <p class="font-medium">Integration via Store-API:</p>
        <p class="mt-1">
          Using <code>/store-api/app-system/SwagBraintreeApp/generate-token</code> endpoint.
          See <a href="https://github.com/shopware/braintree-app/wiki/3.-Headless-integration" target="_blank" class="underline">wiki docs</a>.
        </p>
      </div>

      <!-- Manual token input for testing -->
      <div class="p-4 bg-yellow-50 rounded">
        <label class="block text-sm font-medium text-yellow-800 mb-2">
          Manual Client Token (for testing):
        </label>
        <input
          v-model="clientToken"
          type="text"
          class="w-full p-2 border rounded text-sm"
          placeholder="Paste a Braintree client token here..."
        />
        <button
          class="mt-2 px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
          :disabled="!clientToken"
          @click="initializeDropin(clientToken!)"
        >
          Initialize with Manual Token
        </button>
      </div>
    </div>

    <!-- Braintree Drop-in container -->
    <div v-show="!loading && !error">
      <div id="braintree-dropin-container" />

      <button
        class="mt-4 w-full px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400"
        :disabled="!dropinInstance"
        @click="handlePayment"
      >
        Pay Now
      </button>
    </div>
  </div>
</template>
