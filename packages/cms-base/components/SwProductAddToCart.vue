<script setup lang="ts">
import { useCmsTranslations } from "@shopware-pwa/composables-next";
import {
  useAddToCart,
  useNotifications,
  useCartNotification,
  useCartErrorParamsResolver,
} from "#imports";
import { toRefs } from "vue";
import { defu } from "defu";
import type { Schemas } from "#shopware";
import { getCmsTranslate } from "@shopware-pwa/helpers-next";

const { pushSuccess, pushError } = useNotifications();
const { getErrorsCodes } = useCartNotification();
const { resolveCartError } = useCartErrorParamsResolver();
const props = defineProps<{
  product: Schemas["Product"];
}>();

type Translations = {
  product: {
    addedToCart: string;
    qty: string;
    addToCart: string;
  };
  errors: {
    [key: string]: string;
  };
};

let translations: Translations = {
  product: {
    addedToCart: "has been added to cart.",
    qty: "Qty",
    addToCart: "Add to cart",
  },
  errors: {
    "product-stock-reached":
      "The product {name} is only available {quantity} times",
  },
};

translations = defu(useCmsTranslations(), translations) as Translations;

const { product } = toRefs(props);
const { addToCart, quantity } = useAddToCart(product);

const addToCartProxy = async () => {
  await addToCart();
  const errors = getErrorsCodes();
  errors?.forEach((element) => {
    const { messageKey, params } = resolveCartError(element);
    pushError(getCmsTranslate(translations.errors[messageKey], params));
  });

  if (!errors.length)
    pushSuccess(
      `${props.product?.translated.name} ${translations.product.addedToCart}`,
    );
};
</script>

<template>
  <div class="flex flex-row mt-10">
    <div class="basis-1/4 relative -top-6">
      <label for="qty" class="text-sm">{{ translations.product.qty }}</label>
      <input
        id="qty"
        v-model="quantity"
        type="number"
        :min="product.minPurchase || 1"
        :max="product.calculatedMaxPurchase"
        :step="product.purchaseSteps || 1"
        class="border rounded-md py-2 px-4 border-solid border-1 border-cyan-600 w-full mt-4"
        data-testid="product-quantity"
      />
    </div>
    <div class="basis-3/4 ml-4">
      <button
        :disabled="!product.available"
        class="py-2 px-6 w-full mt-4 bg-gradient-to-r from-cyan-500 to-blue-500 transition ease-in-out hover:bg-gradient-to-l duration-300 cursor-pointer border border-transparent rounded-md flex items-center justify-center text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        :class="{
          'opacity-50 cursor-not-allowed': !product.available,
        }"
        data-testid="add-to-cart-button"
        @click="addToCartProxy"
      >
        🛍 {{ translations.product.addToCart }}
      </button>
    </div>
  </div>
</template>
