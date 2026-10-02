<script setup lang="ts">
definePageMeta({
  layout: "checkout",
});

const { cartItems, subtotal, removeItemById, changeProductQuantity, isEmpty } =
  useCart();
const localePath = useLocalePath();
const { formatLink } = useInternationalization(localePath);

function handleRemoveItem(id: string) {
  removeItemById(id);
}

function handleUpdateQuantity(id: string, quantity: number) {
  changeProductQuantity({ id, quantity });
}
</script>
<template>
  <div class="container mx-auto px-6 sm:px-4">
    <h1 class="text-10 my-10 font-['Noto_Serif']">
      {{ $t("cart.title") }}
    </h1>

    <div
      v-if="isEmpty"
      class="flex flex-col items-center justify-center gap-4 py-20 text-center"
    >
      <SharedIconBadge icon="i-carbon-shopping-cart" size="large" />
      <p class="text-lg text-surface-on-surface">
        {{ $t("cart.emptyCartLabel") }}
      </p>
      <NuxtLink
        :to="formatLink('/')"
        class="mt-2 px-4 py-3 rounded bg-brand-primary text-brand-on-primary font-bold leading-normal inline-flex items-center justify-center hover:bg-brand-primary-hover transition-colors"
      >
        {{ $t("cart.continueShopping") }}
      </NuxtLink>
    </div>

    <template v-else>
      <ul role="list" class="md:col-span-2 mb-10">
        <li
          v-for="cartItem in cartItems"
          :key="cartItem.id"
          class="flex py-6 border-b border-secondary-200"
        >
          <CheckoutProductTile
            @remove="handleRemoveItem"
            @updateQuantity="handleUpdateQuantity"
            class="w-full"
            :item="cartItem"
          />
        </li>
      </ul>

      <div class="block w-fit ml-auto mb-20">
        <div class="flex items-center justify-between mb-2">
          <div class="text-surface-on-surface">
            {{ $t("cart.miniCart.subtotal") }}
          </div>
          <SharedPrice
            class="text-surface-on-surface font-bold leading-6"
            :value="subtotal"
          />
        </div>
        <div
          class="text-right text-surface-on-surface-variant leading-6 mb-6 text-sm"
        >
          {{ $t("cart.miniCart.taxEstimation") }}
        </div>
        <NuxtLink
          :to="formatLink('/checkout')"
          class="bg-brand-primary text-brand-on-primary text-center font-bold leading-6 py-3 px-4 rounded-md mb-2 ml-auto block w-fit"
          >{{ $t("cart.proceedToCheckout") }}</NuxtLink
        >
      </div>
    </template>
  </div>
</template>
