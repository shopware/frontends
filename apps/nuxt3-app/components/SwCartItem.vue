<script setup lang="ts">
import { getMainImageUrl } from "@shopware-pwa/helpers-next";
import { LineItem } from "@shopware-pwa/types";

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
        <h3>
          {{ cartItem.label }}
        </h3>
        <p class="ml-4">{{ itemRegularPrice }} EUR</p>
      </div>
      CART ITEM
      <p v-if="itemOptions" class="mt-1 text-sm text-gray-500">
        <span v-for="option in itemOptions" :key="option.group" class="mr-2">
          {{ option.group }}: {{ option.option }}
        </span>
      </p>
    </div>
    <div class="flex flex-1 items-end justify-between text-sm">
      <p class="text-gray-500">Qty {{ itemQuantity }}</p>

      <div class="flex">
        <button
          v-if="!isPromotion"
          type="button"
          :class="{ 'animate-pulse': isLoading }"
          class="font-medium text-black hover:text-gray-700"
          @click="removeCartItem"
        >
          Remove
        </button>
      </div>
    </div>
  </div>
</template>
