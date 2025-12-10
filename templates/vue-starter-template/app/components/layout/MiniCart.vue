<script setup lang="ts">
import { onClickOutside } from "@vueuse/core";

const localePath = useLocalePath();
const { formatLink } = useInternationalization(localePath);
const { cartItems, subtotal, removeItemById } = useCart();

const emit = defineEmits<{
  closeMiniCart: [];
}>();

const miniCartContainer = useTemplateRef("miniCartContainer");

function handleCloseMiniCart() {
  emit("closeMiniCart");
}

function handleRemoveItem(itemId: string) {
  removeItemById(itemId);
}

watch(cartItems, () => {
  if (cartItems.value.length === 0) {
    handleCloseMiniCart();
  }
});

onClickOutside(miniCartContainer, () => {
  handleCloseMiniCart();
});
</script>
<template>
  <div ref="miniCartContainer" class="z-20 max-w-[500px] w-full">
    <div
      class="px-6 pt-4 pb-3 border bg-surface-surface flex items-center justify-between"
    >
      <div
        class="text-surface-on-surface text-2xl font-normal font-['Noto_Serif'] leading-9"
      >
        {{ $t("cart.miniCart.title") }}
      </div>
      <FormIconButton type="ghost" @click.stop="handleCloseMiniCart">
        <Icon name="shopware:times-s" class="w-3 h-3" />
      </FormIconButton>
    </div>
    <div
      class="px-6 py-3 border border-t-0 bg-surface-surface divide-y divide-surface-outline max-h-[365px] overflow-y-auto"
    >
      <CheckoutProductTile
        v-for="item in cartItems"
        :key="item.id"
        :item
        class="py-8 first:pt-3"
        @remove="handleRemoveItem"
      />
    </div>
    <div class="px-6 py-3 border border-t-0 bg-surface-surface-container-low">
      <div class="flex items-center justify-between mb-2">
        <div class="text-surface-on-surface">
          {{ $t("cart.miniCart.subtotal") }}
        </div>
        <SharedPrice
          class="text-surface-on-surface font-bold leading-6"
          :value="subtotal"
        />
      </div>
      <div class="text-right text-surface-on-surface-variant leading-6 mb-6">
        {{ $t("cart.miniCart.taxEstimation") }}
      </div>
      <NuxtLink
        :to="formatLink('/checkout')"
        class="bg-brand-primary text-brand-on-primary block text-center font-bold leading-6 py-1.5 rounded-md mb-2"
        >{{ $t("cart.miniCart.proceedToCheckout") }}</NuxtLink
      >
      <NuxtLink
        :to="formatLink('/checkout/cart')"
        class="bg-brand-secondary text-brand-on-secondary block text-center font-bold leading-6 py-1.5 rounded-md"
        >{{ $t("cart.miniCart.goToShoppingCart") }}</NuxtLink
      >
    </div>
  </div>
</template>
