<script setup lang="ts">
import deepMerge from "../helpers/deepMerge";
import getTranslations from "../helpers/getTranslations";
import { useAddToCart, useNotifications } from "#imports";
import { toRefs } from "vue";
import type { Schemas } from "#shopware";

const { pushSuccess } = useNotifications();
const props = defineProps<{
  product: Schemas["Product"];
}>();

type Translations = {
  product: {
    addedToCart: string;
    qty: string;
    addToCart: string;
  };
};

let translations: Translations = {
  product: {
    addedToCart: "has been added to cart.",
    qty: "Qty",
    addToCart: "Add to cart",
  },
};

const globalTranslations = getTranslations();
translations = deepMerge(translations, globalTranslations) as Translations;

const { product } = toRefs(props);

const { addToCart, quantity } = useAddToCart(product);

const addToCartProxy = async () => {
  await addToCart();
  pushSuccess(
    `${props.product?.translated?.name} ${translations.product.addedToCart}`,
  );
};
</script>

<template>
  <div class="flex flex-row mt-10">
    <div class="basis-1/4 relative -top-6">
      <label for="qty" class="text-sm">{{ translations.product.qty }}</label>
      <input
        id="qty"
        type="number"
        v-model="quantity"
        :min="product.minPurchase || 1"
        :max="product.calculatedMaxPurchase"
        :step="product.purchaseSteps || 1"
        class="border rounded-md py-2 px-4 border-solid border-1 border-cyan-600 w-full mt-4"
        data-testid="product-quantity"
      />
    </div>
    <div class="basis-3/4 ml-4">
      <button
        @click="addToCartProxy"
        class="py-2 px-6 w-full mt-4 bg-gradient-to-r from-cyan-500 to-blue-500 transition ease-in-out hover:bg-gradient-to-l duration-300 cursor-pointer border border-transparent rounded-md flex items-center justify-center text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        data-testid="add-to-cart-button"
      >
        🛍 {{ translations.product.addToCart }}
      </button>
    </div>
  </div>
</template>
