<script setup lang="ts">
import type { Schemas } from "#shopware";

const orderId = useRoute().params.id as string;

const { order, loadOrderDetails, paymentChangeable, getPaymentMethods } =
  useOrderDetails(orderId);
const { state, paymentMethod, paymentUrl, handlePayment, changePaymentMethod } =
  useOrderPayment(order);

const availablePaymentMethods = ref<Schemas["PaymentMethod"][]>([]);
const isChangingPaymentMethod = ref(false);
const isLoaded = ref(false);
const loadError = ref("");
const paymentError = ref("");

const isPaid = computed(() => state.value?.technicalName === "paid");
const isPaymentOpen = computed(() => state.value?.technicalName === "open");

const hasValidPaymentUrl = computed(() => {
  if (typeof paymentUrl.value !== "string") return false;

  try {
    return new URL(paymentUrl.value).protocol === "https:";
  } catch {
    return false;
  }
});
const safePaymentUrl = computed(() =>
  hasValidPaymentUrl.value ? (paymentUrl.value ?? undefined) : undefined,
);

const loadOrder = async () => {
  loadError.value = "";

  try {
    await loadOrderDetails();
  } catch {
    loadError.value =
      "We could not load your order. If you have just paid, do not pay again — check your order history.";
  } finally {
    isLoaded.value = true;
  }
};

onMounted(async () => {
  await loadOrder();
  if (!order.value) return;

  if (isPaymentOpen.value && !paymentUrl.value) {
    const origin = window.location.origin;
    try {
      await handlePayment(
        `${origin}/checkout/success/${orderId}/paid`,
        `${origin}/checkout/success/${orderId}/unpaid`,
      );
    } catch {
      paymentError.value = "The payment could not be started.";
    }
  }

  if (paymentChangeable.value) {
    try {
      availablePaymentMethods.value = await getPaymentMethods();
    } catch {
      paymentError.value = "We could not load the other payment methods.";
    }
  }
});

const changeMethod = async (paymentMethodId: string) => {
  if (isChangingPaymentMethod.value) return;
  if (paymentMethodId === paymentMethod.value?.id) return;

  paymentError.value = "";
  isChangingPaymentMethod.value = true;

  try {
    await changePaymentMethod(paymentMethodId);
  } catch {
    paymentError.value = "The payment method could not be changed.";
    isChangingPaymentMethod.value = false;
    return;
  }

  try {
    await loadOrderDetails();
  } catch {
    paymentError.value =
      "Your payment method was changed, but this page could not be refreshed. Reload before paying.";
  } finally {
    isChangingPaymentMethod.value = false;
  }
};
</script>

<template>
  <section>
    <h1>Payment</h1>

    <p v-if="!isLoaded" aria-live="polite">Loading your order…</p>

    <div v-else-if="loadError" role="alert">
      <p>{{ loadError }}</p>
      <button type="button" @click="loadOrder">Try again</button>
    </div>

    <p v-else-if="!order" role="alert">
      We could not find this order. Sign in again, or open it from your order
      confirmation link.
    </p>

    <div v-else>
      <p>Order {{ order.orderNumber }}</p>

      <p v-if="paymentError" role="alert">{{ paymentError }}</p>

      <dl aria-live="polite">
        <dt>Payment method</dt>
        <dd>{{ paymentMethod?.name ?? "Not available" }}</dd>
        <dt>Payment state</dt>
        <dd>{{ state?.translated.name ?? "Unknown" }}</dd>
      </dl>

      <p v-if="isPaid">Your payment was received.</p>

      <div v-else-if="isPaymentOpen">
        <p>Your payment is still open.</p>
        <a v-if="safePaymentUrl" :href="safePaymentUrl" rel="noopener">
          Continue to the payment provider
        </a>
      </div>

      <p v-else>
        We cannot confirm the payment for this order yet. Contact us before
        paying again.
      </p>

      <fieldset v-if="paymentChangeable && !isPaid">
        <legend>Pay with a different method</legend>
        <button
          v-for="method in availablePaymentMethods"
          :key="method.id"
          type="button"
          :aria-disabled="isChangingPaymentMethod"
          :aria-busy="isChangingPaymentMethod"
          :aria-current="
            method.id != null && method.id === paymentMethod?.id
              ? 'true'
              : undefined
          "
          @click="method.id && changeMethod(method.id)"
        >
          {{ method.name }}
        </button>
      </fieldset>
    </div>
  </section>
</template>
