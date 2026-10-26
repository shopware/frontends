<script setup lang="ts">
import { ApiClientError } from "@shopware/api-client";

import type { Schemas } from "#shopware";

const {
  cartItems,
  count,
  subtotal,
  totalPrice,
  isEmpty,
  refreshCart,
  changeProductQuantity,
  removeItemById,
} = useCart();
const { getErrorsCodes } = useCartNotification();

// Start as loading so the first render shows the loading state instead of
// flashing "Your cart is empty." before the cart has arrived.
const isLoading = ref(true);
const loadError = ref("");
const pendingItemId = ref("");
const writeError = ref("");
const cartErrors = ref<Schemas["CartError"][]>([]);

// Only one write may be in flight: every write returns the whole recalculated
// cart, so two in parallel race and the slower response overwrites the faster.
const isWriting = computed(() => pendingItemId.value !== "");

// Load on the client: a cart rendered during SSR is baked into the ISR-cached
// HTML and served to every other visitor.
const loadCart = async () => {
  isLoading.value = true;
  loadError.value = "";

  try {
    await refreshCart();
  } catch (error) {
    console.error(error);
    loadError.value = "Your cart could not be loaded.";
  } finally {
    // Errors that arrived with the initial cart belong to the load, not to the
    // customer's next action.
    cartErrors.value = getErrorsCodes();
    isLoading.value = false;
  }
};

onMounted(loadCart);

const runCartWrite = async (
  item: Schemas["LineItem"],
  write: () => Promise<Schemas["Cart"]>,
  fallbackMessage: string,
) => {
  if (isWriting.value) return;

  writeError.value = "";
  pendingItemId.value = item.id;

  try {
    await write();
  } catch (error) {
    // Keep the real error for the developer, show the customer a mapped one.
    console.error(error);
    writeError.value =
      error instanceof ApiClientError && error.status === 403
        ? "Your session has expired. Please sign in again."
        : fallbackMessage;
  } finally {
    // Consume on both paths: a 2xx response can carry errors, and a rejected
    // write must not strand earlier ones in the shared state.
    cartErrors.value = getErrorsCodes();
    pendingItemId.value = "";
  }
};

const changeLineItemQuantity = (item: Schemas["LineItem"], value: string) => {
  // min="1" constrains the stepper and validation, not the value you read here:
  // a cleared field still reaches this handler as "", which parseInt turns into
  // NaN - hence the isInteger guard rather than a bare > 0 check.
  const quantity = Number.parseInt(value);
  if (!Number.isInteger(quantity) || quantity < 1) return;
  if (quantity === item.quantity) return;

  return runCartWrite(
    item,
    () => changeProductQuantity({ id: item.id, quantity }),
    "The quantity could not be updated.",
  );
};

const removeLineItem = (item: Schemas["LineItem"]) =>
  runCartWrite(
    item,
    () => removeItemById(item.id),
    "The item could not be removed.",
  );
</script>

<template>
  <section>
    <h1>Cart</h1>

    <!-- role="alert" so a failed write is announced: the control the customer
         used has just been re-enabled, so focus is nowhere near this message. -->
    <p v-if="writeError" role="alert">{{ writeError }}</p>

    <ul v-if="cartErrors.length" role="alert">
      <li v-for="error in cartErrors" :key="error.key">{{ error.message }}</li>
    </ul>

    <p v-if="isLoading">Loading your cart…</p>

    <div v-else-if="loadError" role="alert">
      <p>{{ loadError }}</p>
      <button type="button" @click="loadCart">Try again</button>
    </div>

    <p v-else-if="isEmpty">Your cart is empty.</p>

    <div v-else>
      <ul>
        <li v-for="item in cartItems" :key="item.id">
          <h2>{{ item.label }}</h2>

          <!-- aria-disabled rather than disabled: a disabled control cannot
               hold focus, so a keyboard user is thrown back to the top of the
               document mid-interaction. The handler enforces the guard. -->
          <label v-if="item.stackable">
            <span>Quantity for {{ item.label }}</span>
            <input
              type="number"
              min="1"
              :value="item.quantity"
              :aria-disabled="isWriting"
              :aria-busy="pendingItemId === item.id"
              @change="
                changeLineItemQuantity(
                  item,
                  ($event.target as HTMLInputElement).value,
                )
              "
            />
          </label>
          <span v-else>Quantity: {{ item.quantity }}</span>

          <span>Total: {{ item.price?.totalPrice }}</span>

          <button
            v-if="item.removable"
            type="button"
            :aria-label="`Remove ${item.label} from cart`"
            :aria-disabled="isWriting"
            :aria-busy="pendingItemId === item.id"
            @click="removeLineItem(item)"
          >
            Remove
          </button>
        </li>
      </ul>

      <dl aria-live="polite">
        <dt>Items</dt>
        <dd>{{ count }}</dd>
        <dt>Subtotal</dt>
        <dd>{{ subtotal }}</dd>
        <dt>Total</dt>
        <dd>{{ totalPrice }}</dd>
      </dl>
    </div>
  </section>
</template>
