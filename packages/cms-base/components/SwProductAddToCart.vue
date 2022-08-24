<script setup lang="ts">
import {
  getProductTierPrices,
  getProductCalculatedListingPrice,
} from "@shopware-pwa/helpers-next";
import { Product } from "@shopware-pwa/types";

const { pushSuccess } = useNotifications();
const props = defineProps<{
  product: Product;
}>();

const { addToCart, quantity } = useAddToCart({
  product: props.product,
});

const addToCartProxy = async () => {
  await addToCart();
  pushSuccess(`${props.product?.translated?.name} has been added to cart.`);
};

function getPrice(product: Product) {
  const tierPrices = getProductTierPrices(product);
  return (
    (tierPrices.length && tierPrices[0] && tierPrices[0].unitPrice) ||
    getProductCalculatedListingPrice(product)
  );
}
</script>

<template>
  <div class="flex flex-row mt-10">
    <div class="basis-1/4">
      <input
        type="number"
        v-model="quantity"
        min="1"
        class="border rounded-md py-2 px-4 border-solid border-1 border-cyan-600 w-full"
        data-testid="product-quantity"
      />
    </div>
    <div class="basis-3/4 ml-4">
      <button
        @click="addToCartProxy"
        class="py-2 px-6 w-full bg-gradient-to-r from-cyan-500 to-blue-500 transition ease-in-out hover:bg-gradient-to-l duration-300 cursor-pointer border border-transparent rounded-md flex items-center justify-center text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        data-testid="add-to-cart-button"
      >
        Add to bag
      </button>
    </div>
  </div>
</template>
