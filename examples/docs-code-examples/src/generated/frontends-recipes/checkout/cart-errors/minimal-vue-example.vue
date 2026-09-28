<script setup lang="ts">
import { ApiClientError } from "@shopware/api-client";
import { useI18n } from "vue-i18n";

const { addProduct, appliedPromotionCodes, cartItems, count } = useCart();
const { getErrorsCodes } = useCartNotification();
const { resolveCartError } = useCartErrorParamsResolver();
const { pushError } = useNotifications();
const { t, te } = useI18n();

const isAdding = ref(false);
const writeError = ref("");

const consumeAndPushCartErrors = () => {
  for (const error of getErrorsCodes()) {
    const { messageKey, params } = resolveCartError(error);
    const snippet = `errors.${messageKey}`;

    pushError(
      te(snippet) ? t(snippet, params ?? {}) : t("errors.message-default"),
    );
  }
};

const addToCart = async (productId: string, quantity: number) => {
  if (isAdding.value) return;

  writeError.value = "";
  isAdding.value = true;

  try {
    await addProduct({ id: productId, quantity });
  } catch (error) {
    console.error(error);

    writeError.value =
      error instanceof ApiClientError
        ? t("errors.addToCartError")
        : t("errors.message-default");
  } finally {
    consumeAndPushCartErrors();
    isAdding.value = false;
  }
};
</script>

<template>
  <p v-if="writeError" role="alert">{{ writeError }}</p>

  <p role="status">{{ count }} items in your cart</p>

  <h2>Cart</h2>

  <ul>
    <li v-for="item in cartItems" :key="item.id">
      {{ item.label }} — quantity {{ item.quantity }}
    </li>
  </ul>

  <template v-if="appliedPromotionCodes.length">
    <h2>Applied promotions</h2>

    <ul>
      <li v-for="promotion in appliedPromotionCodes" :key="promotion.id">
        {{ promotion.label }}
      </li>
    </ul>
  </template>

  <button
    type="button"
    :aria-disabled="isAdding"
    :aria-busy="isAdding"
    @click="addToCart('a-product-id', 99)"
  >
    {{ isAdding ? "Adding…" : "Add 99 to the cart" }}
  </button>
</template>
