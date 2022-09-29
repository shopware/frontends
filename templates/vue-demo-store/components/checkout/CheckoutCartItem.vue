<script setup lang="ts">
import { getMainImageUrl } from "@shopware-pwa/helpers-next";
import { LineItem, PropertyGroupOptionCart } from "@shopware-pwa/types";

const props = withDefaults(
  defineProps<{
    cartItem: LineItem;
    maxQty?: number;
  }>(),
  {
    maxQty: 100,
  }
);

const isLoading = ref(false);

const {
  itemOptions,
  removeItem,
  itemRegularPrice,
  itemQuantity,
  isPromotion,
  itemStock,
  changeItemQuantity,
} = useCartItem(props.cartItem);

const quantity = ref(itemQuantity.value);

const updateQuantity = async (quantity: number | undefined) => {
  if (quantity === itemQuantity.value) return;

  isLoading.value = true;

  await changeItemQuantity(Number(quantity));

  isLoading.value = false;
};

watch(quantity, () => updateQuantity(quantity.value));

const removeCartItem = async () => {
  isLoading.value = true;
  await removeItem();
  isLoading.value = false;
};
</script>

<template>
  <div
    v-if="!isPromotion"
    class="mr-4 h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200"
  >
    <img
      :src="getMainImageUrl(cartItem)"
      alt="Salmon orange fabric pouch with match zipper, gray zipper pull, and adjustable hip belt."
      class="h-full w-full object-cover object-center"
    />
  </div>

  <div class="flex flex-1 flex-col">
    <div>
      <div
        class="flex flex-col lg:flex-row justify-between text-base font-medium text-gray-900"
      >
        <h3 class="text-base" data-testid="cart-product-name">
          {{ cartItem.label }}
        </h3>
        <SharedPrice
          v-if="itemRegularPrice"
          :value="itemRegularPrice"
          data-testid="cart-product-price"
        />
      </div>

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
    <div
      v-if="!isPromotion"
      class="flex flex-1 items-end justify-between text-sm"
    >
      <select
        v-if="itemStock && itemStock > 0"
        v-model="quantity"
        name="quantity"
        class="w-18 mt-1 inline-block py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
      >
        <option
          v-for="entry in itemStock > maxQty ? maxQty : itemStock"
          :key="entry"
          :value="entry"
        >
          {{ entry }}
        </option>
      </select>
      <!-- Stock is lower than 1 -->
      <div v-else>
        <div
          class="w-18 mt-1 inline-block py-2 px-3 border border-gray-300 bg-white opacity-50 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          {{ quantity }}
        </div>
      </div>
      <div class="flex">
        <button
          v-if="!isPromotion"
          type="button"
          :class="{ 'animate-pulse': isLoading }"
          class="font-medium text-brand-dark"
          data-testid="product-remove-button"
          @click="removeCartItem"
        >
          Remove
        </button>
      </div>
    </div>
  </div>
</template>
