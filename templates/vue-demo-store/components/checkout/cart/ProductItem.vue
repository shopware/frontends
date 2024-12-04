<script setup lang="ts">
import { getSmallestThumbnailUrl } from "@shopware-pwa/helpers-next";
import { ApiClientError } from "@shopware/api-client";
import type { Schemas } from "#shopware";

const miniCartModal = useMiniCartModal();
const localePath = useLocalePath();
const { formatLink } = useInternationalization(localePath);
const { resolveCartError } = useCartErrorParamsResolver();

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
  isRemovable,
  isStackable,
  isDigital,
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
      for (const error of errors) {
        pushError(error);
      }
    }
  }

  for (const element of getErrorsCodes() ?? []) {
    const { messageKey, params } = resolveCartError(element);
    pushError(t(`errors.${messageKey}`, params as Record<string, unknown>));
  }

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

  <div class="flex flex-1 flex-col text-left">
    <div>
      <div
        class="flex flex-col lg:flex-row justify-between text-base font-medium text-secondary-900"
      >
        <h3
          class="text-base cursor-pointer pr-2"
          data-testid="cart-product-name"
        >
          <NuxtLink
            :to="formatLink(`/detail/${cartItem.id}`)"
            class="flex items-left text-base font-normal text-secondary-900 break-words hover:underline"
            @click="miniCartModal.close"
          >
            {{ cartItem.label }}
            <span
              v-if="isDigital"
              data-testid="cart-product-digital-label"
              class="bg-blue-100 text-blue-800 text-xs mr-2 px-2.5 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-300"
              >{{ $t("cart.digital") }}</span
            >
          </NuxtLink>
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
      v-if="isStackable"
      class="flex flex-1 items-end justify-between text-sm"
    >
      <input
        v-model="quantity"
        type="number"
        :disabled="isLoading"
        :min="cartItem.quantityInformation?.minPurchase || 1"
        :max="cartItem.quantityInformation?.maxPurchase || maxQty"
        :step="cartItem.quantityInformation?.purchaseSteps || 1"
        data-testid="cart-product-qty-select"
        name="quantity"
        aria-label="Cart item quantity"
        class="w-18 mt-1 inline-block py-2 px-3 border border-secondary-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
      />
      <div class="flex">
        <button
          v-if="isRemovable"
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
