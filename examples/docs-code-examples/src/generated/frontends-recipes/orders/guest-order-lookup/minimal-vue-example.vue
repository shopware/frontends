<script setup lang="ts">
import { ApiClientError } from "@shopware/api-client";

import type { Schemas } from "#shopware";

const { apiClient } = useShopwareContext();
const deepCode = useRoute().params.deepCode as string;

const order = ref<Schemas["Order"] | null>(null);
const isLoading = ref(true);
const isSubmitting = ref(false);
const notFound = ref(false);
const needsCredentials = ref(false);
const credentialsError = ref("");
const loadError = ref("");

const heading = ref<HTMLElement | null>(null);
const credentials = reactive({ email: "", zipcode: "" });

const GENERIC_FAILURE = "This order could not be opened.";

const lookupOrder = async (withGuestCredentials: boolean) => {
  notFound.value = false;
  credentialsError.value = "";
  loadError.value = "";

  // The retry has a form on screen to report into; the first attempt does not.
  const reportFailure = (message: string) => {
    if (withGuestCredentials) credentialsError.value = message;
    else loadError.value = message;
  };

  try {
    const { data } = await apiClient.invoke("readOrder post /order", {
      body: {
        filter: [{ field: "deepLinkCode", type: "equals", value: deepCode }],
        ...(withGuestCredentials
          ? {
              email: credentials.email,
              zipcode: credentials.zipcode,
              login: true,
            }
          : {}),
      },
    });

    order.value = data.orders?.elements?.[0] ?? null;
    notFound.value = !order.value;
    needsCredentials.value = false;
  } catch (error) {
    // A timeout, an abort or a dropped connection is not an ApiClientError.
    // Rethrowing here would reach nothing: Nuxt clears its own error handler
    // once suspense resolves, so the rejection would end as a console.error
    // and leave the customer on a page with no branch rendered.
    if (!(error instanceof ApiClientError)) {
      console.error(error);
      reportFailure(`${GENERIC_FAILURE} Please try again.`);
      return;
    }

    // Decide once, from the whole payload. Looping and assigning per error
    // lets the last element overwrite the message the customer can act on.
    const codes = new Set(
      error.details.errors.map((apiError: { code?: string }) => apiError.code),
    );

    if (codes.has("CHECKOUT__GUEST_NOT_AUTHENTICATED")) {
      needsCredentials.value = true;
    }

    if (codes.has("CHECKOUT__CART_ORDER_DEEP_LINK_NOT_FOUND")) {
      notFound.value = true;
    } else if (codes.has("CHECKOUT__GUEST_WRONG_CREDENTIALS")) {
      needsCredentials.value = true;
      credentialsError.value =
        "The email address or postal code does not match this order.";
    } else if (!needsCredentials.value) {
      reportFailure(GENERIC_FAILURE);
    }
  }
};

const loadOrder = async () => {
  isLoading.value = true;

  try {
    await lookupOrder(false);
  } finally {
    isLoading.value = false;
  }
};

const submitCredentials = async () => {
  if (isSubmitting.value) return;
  isSubmitting.value = true;

  try {
    await lookupOrder(true);
  } finally {
    isSubmitting.value = false;
  }
};

// The form appears after an async failure, so nothing has moved focus to it.
watch(needsCredentials, async (isNeeded) => {
  if (!isNeeded) return;
  await nextTick();
  heading.value?.focus();
});

onMounted(loadOrder);
</script>

<template>
  <section>
    <!-- One heading outside the branch chain, so every state has a landmark
         and a focus target. -->
    <h1 ref="heading" tabindex="-1">
      {{ order ? `Order ${order.orderNumber}` : "Your order" }}
    </h1>

    <p v-if="isLoading" role="status">Looking up your order…</p>

    <p v-else-if="notFound" role="alert">
      This link is no longer valid. Please use the link from your order
      confirmation mail.
    </p>

    <div v-else-if="loadError" role="alert">
      <p>{{ loadError }}</p>
      <button type="button" @click="loadOrder">Try again</button>
    </div>

    <!-- isSubmitting rather than isLoading: the form must stay mounted while
         the retry is in flight, or it takes the focused button with it. -->
    <form
      v-else-if="needsCredentials && !order"
      :aria-busy="isSubmitting"
      @submit.prevent="submitCredentials"
    >
      <p>Confirm the details you used for this order.</p>

      <p v-if="credentialsError" id="credentials-error" role="alert">
        {{ credentialsError }}
      </p>

      <label>
        Email
        <input
          v-model="credentials.email"
          type="email"
          autocomplete="email"
          required
          :aria-invalid="credentialsError ? 'true' : undefined"
          :aria-describedby="credentialsError ? 'credentials-error' : undefined"
        />
      </label>

      <label>
        Postal code
        <input
          v-model="credentials.zipcode"
          type="text"
          autocomplete="postal-code"
          required
          :aria-invalid="credentialsError ? 'true' : undefined"
          :aria-describedby="credentialsError ? 'credentials-error' : undefined"
        />
      </label>

      <button type="submit" :aria-disabled="isSubmitting">
        {{ isSubmitting ? "Checking…" : "Show my order" }}
      </button>
    </form>

    <article v-else-if="order">
      <p>{{ order.stateMachineState?.translated?.name }}</p>
      <p>{{ order.price?.totalPrice }}</p>
    </article>

    <!-- Terminal branch. Without it an unhandled state renders an empty page. -->
    <p v-else role="alert">
      {{ GENERIC_FAILURE }} Please use the link from your order confirmation
      mail.
    </p>
  </section>
</template>
