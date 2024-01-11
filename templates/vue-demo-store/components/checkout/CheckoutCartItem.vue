<script setup lang="ts">
import type { Schemas } from "#shopware";
import { getSmallestThumbnailUrl } from "@shopware-pwa/helpers-next";
import { ApiClientError } from "@shopware/api-client";

const props = withDefaults(
  defineProps<{
    cartItem: Schemas["LineItem"];
    maxQty?: number;
  }>(),
  {
    maxQty: 100,
  },
);

const { cartItem } = toRefs(props);

const isLoading = ref(false);
const { getErrorsCodes } = useCartNotification();
const { refreshCart } = useCart();
const { pushError } = useNotifications();
const { t } = useI18n();

const {
  itemOptions,
  removeItem,
  itemTotalPrice,
  itemQuantity,
  isPromotion,
  changeItemQuantity,
} = useCartItem(cartItem);

const quantity = ref();
syncRefs(itemQuantity, quantity);

const { resolveApiErrors } = useApiErrorsResolver("account_login");

const updateQuantity = async (quantityInput: number | undefined) => {
  if (quantityInput === itemQuantity.value) return;

  isLoading.value = true;

  try {
    const response = await changeItemQuantity(Number(quantityInput));
    // Refresh cart after qty update
    await refreshCart(response);
  } catch (error) {
    if (error instanceof ApiClientError) {
      const errors = resolveApiErrors(error.details.errors);
      errors.forEach((error) => pushError(error));
    }
  }

  // Make sure that qty is the same as it is in the response
  quantity.value = itemQuantity.value;

  getErrorsCodes()?.forEach((element) => {
    pushError(t(`errors.${element.messageKey}`, { ...element }));
  });

  isLoading.value = false;
};
const debounceUpdate = useDebounceFn(updateQuantity, 800);

watch(quantity, () => debounceUpdate(quantity.value));

const removeCartItem = async () => {
  isLoading.value = true;
  await removeItem();
  isLoading.value = false;
};
</script>

<template>
  <div
    v-if="!isPromotion"
    class="mr-4 h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-secondary-200"
  >
    <img
      :src="getSmallestThumbnailUrl(cartItem.cover)"
      :alt="`${cartItem.label || cartItem.payload.name || ''} cart item`"
      class="h-full w-full object-cover object-center"
      data-testid="cart-product-image"
    />
  </div>

  <div class="flex flex-1 flex-col">
    <div>
      <div
        class="flex flex-col lg:flex-row justify-between text-base font-medium text-secondary-900"
      >
        <h3 class="text-base" data-testid="cart-product-name">
          {{ cartItem.label }}
          <span
            v-if="isPromotion"
            class="bg-green-100 text-green-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full dark:bg-green-900 dark:text-green-300"
            >Promotion</span
          >
        </h3>
        <SharedPrice
          v-if="itemTotalPrice"
          :value="itemTotalPrice"
          data-testid="cart-product-price"
        />
      </div>

      <p
        v-if="itemOptions"
        class="mt-1 text-sm text-secondary-500"
        data-testid="cart-product-options"
      >
        <span v-for="option in itemOptions" :key="option.group" class="mr-2">
          {{ option.group }}: {{ option.option }}
        </span>
      </p>
    </div>
    <div
      v-if="!isPromotion"
      class="flex flex-1 items-end justify-between text-sm"
    >
      <input
        v-model="quantity"
        type="number"
        :disabled="isLoading"
        :min="(cartItem as any).quantityInformation?.minPurchase || 1"
        :max="(cartItem as any).quantityInformation?.maxPurchase || maxQty"
        :step="(cartItem as any).quantityInformation?.purchaseSteps || 1"
        data-testid="cart-product-qty-select"
        name="quantity"
        aria-label="Cart item quantity"
        class="w-18 mt-1 inline-block py-2 px-3 border border-secondary-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
      />
      <div class="flex">
        <button
          v-if="!isPromotion"
          type="button"
          class="font-medium text-dark bg-transparent"
          :class="{ 'text-secondary-500': isLoading }"
          data-testid="product-remove-button"
          @click="removeCartItem"
        >
          {{ $t("checkout.items.removeButton") }}
        </button>
      </div>
    </div>
  </div>
</template>
