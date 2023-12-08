<script setup lang="ts">
const props = defineProps<{
  controller: ReturnType<typeof useModal>;
}>();

const { cartItems, totalPrice, isEmpty } = useCart();
const localePath = useLocalePath();
const { formatLink } = useInternationalization(localePath);
</script>

<template>
  <LayoutSidebar :controller="props.controller" side="right">
    <aside class="flex-1 overflow-y-auto py-6 px-4 sm:px-6">
      <div class="flex items-start justify-between">
        <h2
          id="slide-over-title"
          class="text-lg font-medium text-gray-900 py-0"
        >
          Shopping cart
        </h2>
        <div class="ml-3 flex h-7 items-center">
          <button
            type="button"
            class="-m-2 p-2 bg-transparent text-gray-400 hover:text-gray-500"
            data-testid="cart-close-button"
            @click="props.controller.close"
          >
            <span class="sr-only">Close panel</span>
            <div class="w-6 h-6 i-carbon-close" />
          </button>
        </div>
      </div>

      <div class="mt-8">
        <div class="flow-root">
          <ul
            v-if="!isEmpty"
            role="list"
            class="-my-6 px-0 divide-y divide-gray-200"
          >
            <li
              v-for="cartItem in cartItems"
              :key="cartItem.id"
              class="flex py-6"
            >
              <CheckoutCartItem :cart-item="cartItem" />
            </li>
          </ul>
          <div v-else class="text-2xl text-center">
            Your shopping cart is empty
          </div>
        </div>
      </div>
    </aside>

    <aside
      aria-label="Side Cart Links"
      class="border-t border-gray-200 py-6 px-4 sm:px-6"
    >
      <div class="flex justify-between text-base font-medium text-gray-900">
        <p>Subtotal</p>
        <SharedPrice :value="totalPrice" data-testid="cart-subtotal" />
      </div>
      <p class="mt-0.5 text-sm text-gray-500">
        Shipping and taxes calculated at checkout.
      </p>
      <div class="mt-6">
        <NuxtLink
          class="flex items-center justify-center rounded-md border border-transparent px-6 py-3 text-base font-medium text-white shadow-sm bg-brand-primary hover:bg-brand-dark"
          :class="{
            'bg-gray': isEmpty,
            'hover:bg-gray': isEmpty,
          }"
          :to="formatLink(isEmpty ? '' : '/checkout')"
          data-testid="cart-checkout-link"
        >
          Checkout
        </NuxtLink>

        <NuxtLink
          class="flex items-center justify-center py-3 text-sm font-medium text-brand-dark"
          :to="formatLink(`/checkout/cart`)"
          data-testid="cart-checkout-shopping-cart"
          @click="props.controller.close"
        >
          Go to shopping cart
        </NuxtLink>
      </div>
      <div class="mt-6 flex justify-center text-center text-sm text-brand-dark">
        <p>
          or
          <button
            type="button"
            class="font-medium bg-transparent"
            data-testid="cart-continue-button"
            @click="props.controller.close"
          >
            Continue Shopping<span aria-hidden="true"> &rarr;</span>
          </button>
        </p>
      </div>
    </aside>
  </LayoutSidebar>
</template>
