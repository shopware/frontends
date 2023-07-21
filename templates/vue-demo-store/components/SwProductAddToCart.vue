<script setup lang="ts">
import { Product } from "@shopware-pwa/types";
import SwQuantitySelector from './SwQuantitySelector.vue';
import SwAddToWishlist from './SwAddToWishlist.vue';

const { pushSuccess } = useNotifications();
const props = defineProps<{
  product: Product;
}>();
const { product } = toRefs(props);

const { addToCart, quantity } = useAddToCart(product);

const addToCartProxy = async () => {
  await addToCart();
  pushSuccess(`${props.product?.translated?.name} has been added to cart.`);
};
</script>

<template>
  <div class="flex flex-row gap-4">
    <div>
      <SwQuantitySelector 
        v-model="quantity" 
        :min="product.minPurchase || 1"
        :max="product.calculatedMaxPurchase"
      />
    </div>
    <div class="flex-1">
      <button
        @click="addToCartProxy"
        class="w-full h-full bg-gray-800 py-3 text-white font-medium text-base px-3"
        data-testid="add-to-cart-button"
      >
        {{ $t('add_to_cart') }}
      </button>
    </div>
    <div>
      <SwAddToWishlist 
        class="w-[50px] h-[50px] border border-gray-300 flex items-center justify-center bg-white bg-opacity-50 p-1"
        :product="product"
      />
    </div>
  </div>
</template>
