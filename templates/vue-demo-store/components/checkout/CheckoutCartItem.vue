<script setup lang="ts">
import { getMainImageUrl } from "@shopware-pwa/helpers-next";
import { LineItem, PropertyGroupOptionCart } from "@shopware-pwa/types";

const props = defineProps<{
  cartItem: LineItem;
}>();

const isLoading = ref(false);

const { itemOptions, removeItem, itemRegularPrice, itemQuantity, isPromotion } =
  useCartItem({ cartItem: props.cartItem });

const removeCartItem = async () => {
  isLoading.value = true;
  await removeItem();
  isLoading.value = false;
};
</script>

<template>
  <div
    v-if="!isPromotion"
    class="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200"
  >
    <img
      :src="getMainImageUrl(cartItem)"
      alt="Salmon orange fabric pouch with match zipper, gray zipper pull, and adjustable hip belt."
      class="h-full w-full object-cover object-center"
    />
  </div>

  <div class="ml-4 flex flex-1 flex-col">
    <div>
      <div class="flex justify-between text-base font-medium text-gray-900">
        <h3 class="text-base" data-testid="cart-product-name">
          {{ cartItem.label }}
        </h3>
        <SharedPrice
          v-if="itemRegularPrice"
          :value="itemRegularPrice"
          data-testid="cart-product-price"
        />
      </div>
      CART ITEM
      <p
        v-if="itemOptions"
        class="mt-1 text-sm text-gray-500"
        data-testis="cart-product-options"
      >
        <span
          v-for="option in itemOptions"
          :key="(option as PropertyGroupOptionCart).group"
          class="mr-2"
        >
          {{ option.group }}: {{ (option as PropertyGroupOptionCart).option }}
        </span>
      </p>
    </div>
    <div class="flex flex-1 items-end justify-between text-sm">
      <p class="text-gray-500" data-testid="cart-product-qty">
        Qty {{ itemQuantity }}
      </p>

      <div class="flex">
        <button
          v-if="!isPromotion"
          type="button"
          :class="{ 'animate-pulse': isLoading }"
          class="font-medium text-brand-dark"
          @click="removeCartItem"
          data-testid="product-remove-button"
        >
          Remove
        </button>
      </div>
    </div>
  </div>
</template>
