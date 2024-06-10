<script setup lang="ts">
definePageMeta({ layout: "checkout" });

const { cartItems, subtotal, totalPrice, shippingTotal } = useCart();
const localePath = useLocalePath();
const { formatLink } = useInternationalization(localePath);
const hasItems = computed(() => cartItems.value.length > 0);
</script>

<script lang="ts">
export default {
  name: "CartPage",
};
</script>

<template>
  <div v-if="hasItems" class="m-10">
    <h1 class="mb-3 text-2xl font-medium text-secondary-900">
      {{ $t("cart.header") }}
    </h1>

    <div class="my-10 md:grid md:grid-cols-3 md:gap-8">
      <ul
        role="list"
        class="divide-y pl-0 divide-secondary-200 md:col-span-2 border-t"
      >
        <li v-for="cartItem in cartItems" :key="cartItem.id" class="flex py-6">
          <CheckoutCartItem :cart-item="cartItem" />
        </li>
      </ul>

      <aside
        class="md:col-span-1 pb-4 px-4 bg-secondary-50 rounded dark:bg-secondary-800"
      >
        <h2 class="text-xl font-medium text-secondary-900">
          {{ $t("cart.orderSummary") }}
        </h2>

        <div
          class="flex py-4 border-b justify-between text-sm text-secondary-500"
        >
          <p>{{ $t("cart.subtotal") }}</p>
          <SharedPrice
            :value="subtotal"
            class="text-secondary-900 font-medium"
            data-testid="cart-subtotal"
          />
        </div>

        <div
          class="flex py-4 border-b justify-between text-sm text-secondary-500"
        >
          <p>{{ $t("cart.shippingEstimate") }}</p>
          <SharedPrice
            :value="shippingTotal"
            class="text-secondary-900 font-medium"
            data-testid="cart-subtotal"
          />
        </div>

        <div
          class="flex py-4 mb-8 justify-between text-secondary-900 font-medium"
        >
          <p>{{ $t("cart.orderTotal") }}</p>
          <SharedPrice :value="totalPrice" data-testid="cart-subtotal" />
        </div>

        <div class="pb-4 mb-8 justify-between text-secondary-900 font-medium">
          <CheckoutPromotionCode />
        </div>

        <NuxtLink
          class="flex items-center justify-center rounded-md px-6 py-3 text-base font-medium text-white shadow-sm bg-primary hover:bg-dark"
          data-testid="cart-checkout-link"
          :to="formatLink(`/checkout`)"
        >
          {{ $t("cart.checkout") }}
        </NuxtLink>
      </aside>
    </div>
  </div>
  <h1 v-else class="m-10 text-center text-2xl font-medium text-secondary-900">
    {{ $t("cart.emptyCartLabel") }}
  </h1>
</template>
