<script setup lang="ts">
const {
  shippingMethods,
  paymentMethods,
  getShippingMethods,
  getPaymentMethods,
  selectedShippingMethod,
  setShippingMethod,
  selectedPaymentMethod,
  setPaymentMethod,
  createOrder,
  billingAddress,
} = useCheckout();
const { refreshSessionContext } = useSessionContext();
const { cart, cartItems, totalPrice, isEmpty, isVirtualCart, refreshCart } =
  useCart();

const isLoadingCheckout = ref(true);
const isSelectingMethod = ref(false);
const isPlacingOrder = ref(false);
const loadError = ref("");
const checkoutError = ref("");
const customerComment = ref("");
const placedOrderId = ref("");
const placedOrderNumber = ref("");
const heading = ref<HTMLElement | null>(null);

const shippingId = ref("");
const paymentId = ref("");
watch(selectedShippingMethod, (m) => (shippingId.value = m?.id ?? ""), {
  immediate: true,
});
watch(selectedPaymentMethod, (m) => (paymentId.value = m?.id ?? ""), {
  immediate: true,
});

const loadCheckout = async () => {
  loadError.value = "";
  checkoutError.value = "";
  isLoadingCheckout.value = true;

  try {
    await Promise.all([refreshSessionContext(), refreshCart()]);

    const results = await Promise.allSettled([
      ...(isVirtualCart.value
        ? []
        : [getShippingMethods({ forceReload: true })]),
      getPaymentMethods({ forceReload: true }),
    ]);
    if (results.some((result) => result.status === "rejected")) {
      loadError.value = "The delivery and payment options could not be loaded.";
    }
  } catch (error) {
    console.error(error);
    loadError.value = "The checkout could not be loaded.";
  } finally {
    isLoadingCheckout.value = false;
  }
};

onMounted(loadCheckout);

const selectMethod = async (
  patch: () => Promise<void>,
  reloadOtherList: () => Promise<unknown>,
  failure: string,
) => {
  if (isSelectingMethod.value) return;
  checkoutError.value = "";
  isSelectingMethod.value = true;

  try {
    await patch();

    const results = await Promise.allSettled([
      reloadOtherList(),
      refreshCart(),
    ]);
    if (results.some((result) => result.status === "rejected")) {
      checkoutError.value =
        "Your selection was saved, but the totals could not be updated. Please reload before ordering.";
    }
  } catch (error) {
    console.error(error);
    checkoutError.value = failure;
  } finally {
    shippingId.value = selectedShippingMethod.value?.id ?? "";
    paymentId.value = selectedPaymentMethod.value?.id ?? "";
    isSelectingMethod.value = false;
  }
};

const chooseShippingMethod = (id: string) =>
  selectMethod(
    () => setShippingMethod({ id }),
    () => getPaymentMethods({ forceReload: true }),
    "The shipping method could not be selected.",
  );

const choosePaymentMethod = (id: string) =>
  selectMethod(
    () => setPaymentMethod({ id }),
    () =>
      isVirtualCart.value
        ? Promise.resolve()
        : getShippingMethods({ forceReload: true }),
    "The payment method could not be selected.",
  );

const canPlaceOrder = computed(
  () =>
    !isPlacingOrder.value &&
    !isSelectingMethod.value &&
    !!selectedPaymentMethod.value &&
    (isVirtualCart.value || !!selectedShippingMethod.value),
);

const submitHint = computed(() => {
  if (!isVirtualCart.value && !selectedShippingMethod.value)
    return "Select a shipping method to continue.";
  if (!selectedPaymentMethod.value)
    return "Select a payment method to continue.";
  return "";
});

const placeOrder = async () => {
  if (!canPlaceOrder.value) return;
  checkoutError.value = "";
  isPlacingOrder.value = true;

  try {
    const order = await createOrder({ customerComment: customerComment.value });
    placedOrderId.value = order.id;
    placedOrderNumber.value = order.orderNumber ?? "";
    await nextTick();
    heading.value?.focus();
  } catch (error) {
    console.error(error);
    checkoutError.value = "The order could not be placed. Please try again.";
  } finally {
    isPlacingOrder.value = false;
    try {
      await refreshCart();
    } catch (error) {
      console.error(error);
      checkoutError.value = "Reload the page to refresh your cart display.";
    }
  }
};
</script>

<template>
  <section>
    <h1 ref="heading" tabindex="-1">
      {{ placedOrderId ? "Thank you for your order" : "Checkout" }}
    </h1>

    <p v-if="checkoutError" role="alert">{{ checkoutError }}</p>

    <p v-if="placedOrderId" role="status">
      Your order number is {{ placedOrderNumber }}.
    </p>

    <p v-else-if="isLoadingCheckout" role="status">Loading the checkout…</p>

    <div v-else-if="loadError" role="alert">
      <p>{{ loadError }}</p>
      <button type="button" @click="loadCheckout">Try again</button>
    </div>

    <p v-else-if="!cart">Your cart could not be read.</p>

    <p v-else-if="isEmpty">Your cart is empty.</p>

    <form v-else @submit.prevent="placeOrder">
      <fieldset v-if="!isVirtualCart" :aria-busy="isSelectingMethod">
        <legend>Shipping method</legend>
        <label v-for="method in shippingMethods" :key="method.id">
          <input
            v-model="shippingId"
            type="radio"
            name="shippingMethod"
            :value="method.id"
            :aria-disabled="isSelectingMethod"
            @change="chooseShippingMethod(method.id)"
          />
          {{ method.name }}
        </label>
      </fieldset>

      <fieldset :aria-busy="isSelectingMethod">
        <legend>Payment method</legend>
        <label v-for="method in paymentMethods" :key="method.id">
          <input
            v-model="paymentId"
            type="radio"
            name="paymentMethod"
            :value="method.id"
            :aria-disabled="isSelectingMethod"
            @change="choosePaymentMethod(method.id)"
          />
          {{ method.name }}
        </label>
      </fieldset>

      <p v-if="billingAddress">
        Billing to {{ billingAddress.street }}, {{ billingAddress.city }}
      </p>

      <label>
        Comment
        <textarea v-model="customerComment" />
      </label>

      <h2>Order summary</h2>
      <ul>
        <li v-for="item in cartItems" :key="item.id">
          {{ item.label }}, quantity {{ item.quantity }}
        </li>
      </ul>

      <dl aria-live="polite">
        <dt>Total</dt>
        <dd>{{ totalPrice }}</dd>
      </dl>

      <p v-if="submitHint" id="submit-hint">{{ submitHint }}</p>

      <button
        type="submit"
        :aria-disabled="!canPlaceOrder"
        :aria-describedby="submitHint ? 'submit-hint' : undefined"
      >
        {{ isPlacingOrder ? "Placing the order…" : "Place the order" }}
      </button>
    </form>
  </section>
</template>
