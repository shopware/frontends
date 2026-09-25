<script setup lang="ts">
import { ApiClientError } from "@shopware/api-client";
import { downloadFile } from "@shopware/helpers";

import type { Schemas } from "#shopware";

const orderId = useRoute().params.id as string;

const {
  order,
  status,
  statusTechnicalName,
  total,
  subtotal,
  shippingCosts,
  billingAddress,
  shippingAddress,
  personalDetails,
  shippingMethod,
  paymentMethod,
  documents,
  hasDocuments,
  loadOrderDetails,
  cancel,
  getDocumentFile,
} = useOrderDetails(orderId);

const isLoading = ref(true);
const isCancelling = ref(false);

const loadError = ref("");
const cancelError = ref("");
const documentError = ref("");

const canCancelOrder = computed(
  () =>
    !!order.value &&
    !["cancelled", "completed"].includes(statusTechnicalName.value ?? ""),
);

const messageFor = (error: unknown, fallback: string) =>
  error instanceof ApiClientError && error.status === 403
    ? "Your session has expired. Please sign in again."
    : fallback;

onMounted(async () => {
  try {
    await loadOrderDetails();
  } catch (error) {
    console.error(error);
    loadError.value = messageFor(error, "This order could not be loaded.");
  } finally {
    isLoading.value = false;
  }
});

const requestCancellation = async () => {
  if (isCancelling.value) return;

  cancelError.value = "";
  isCancelling.value = true;

  try {
    await cancel();
  } catch (error) {
    console.error(error);
    cancelError.value = messageFor(
      error,
      "We could not confirm the cancellation. Please reload this page before trying again.",
    );
  } finally {
    isCancelling.value = false;
  }
};

const downloadDocument = async (orderDocument: Schemas["Document"]) => {
  documentError.value = "";
  const fileType = orderDocument.fileType ?? "pdf";

  try {
    const file = await getDocumentFile(
      orderDocument.id,
      orderDocument.deepLinkCode,
    );

    // A PDF arrives as a Blob, the HTML and XML variants as text. Both are
    // valid documents, so wrap the text instead of treating it as a failure.
    const blob =
      typeof file === "string"
        ? new Blob([file], {
            type: fileType === "xml" ? "application/xml" : "text/html",
          })
        : file;

    if (!(blob instanceof Blob) || blob.size === 0) {
      documentError.value = "This document is no longer available.";
      return;
    }

    downloadFile(blob, `${orderDocument.config.name}.${fileType}`);
  } catch (error) {
    console.error(error);
    documentError.value = messageFor(
      error,
      "This document could not be downloaded.",
    );
  }
};
</script>

<template>
  <p v-if="isLoading" role="status">Loading your order…</p>

  <p v-else-if="loadError" role="alert">{{ loadError }}</p>

  <p v-else-if="!order">This order does not exist.</p>

  <article v-else>
    <h1>Order {{ order.orderNumber }}</h1>
    <p aria-live="polite">Status: {{ status }}</p>
    <p>
      Customer: {{ personalDetails.firstName }} {{ personalDetails.lastName }}
    </p>

    <h2>Items</h2>
    <ul>
      <li v-for="item in order.lineItems" :key="item.id">
        {{ item.label }}
        <span class="sr-only">Quantity:</span> × {{ item.quantity }}
        <span class="sr-only">Total:</span> — {{ item.totalPrice }}
      </li>
    </ul>

    <h2>Summary</h2>
    <dl>
      <dt>Subtotal</dt>
      <dd>{{ subtotal }}</dd>
      <dt>Shipping</dt>
      <dd>{{ shippingCosts }}</dd>
      <dt>Total</dt>
      <dd>{{ total }}</dd>
    </dl>

    <section v-if="shippingAddress">
      <h2>Delivery</h2>
      <p>{{ shippingAddress.street }}, {{ shippingAddress.city }}</p>
      <p>{{ shippingMethod?.name }}</p>
    </section>

    <section v-if="billingAddress">
      <h2>Billing</h2>
      <p>{{ billingAddress.street }}, {{ billingAddress.city }}</p>
      <p>{{ paymentMethod?.name }}</p>
    </section>

    <section v-if="hasDocuments">
      <h2>Documents</h2>

      <p v-if="documentError" role="alert">{{ documentError }}</p>

      <button
        v-for="orderDocument in documents"
        :key="orderDocument.id"
        type="button"
        :aria-label="`Download ${orderDocument.config.name} (${orderDocument.fileType ?? 'pdf'})`"
        @click="downloadDocument(orderDocument)"
      >
        {{ orderDocument.config.name }}
      </button>
    </section>

    <p v-if="cancelError" role="alert">{{ cancelError }}</p>

    <button
      v-if="canCancelOrder"
      type="button"
      :aria-disabled="isCancelling"
      :aria-busy="isCancelling"
      @click="requestCancellation()"
    >
      {{ isCancelling ? "Cancelling…" : "Cancel this order" }}
    </button>
  </article>
</template>
