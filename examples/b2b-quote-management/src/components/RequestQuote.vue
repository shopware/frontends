<script setup lang="ts">
import { onMounted, ref } from "vue";
import {
  usePrice,
  useProductPrice,
  useProductSearch,
  useCart,
} from "@shopware-pwa/composables-next/dist";
import { useB2bQuoteManagement } from "@shopware-pwa/composables-next";
import Textarea from "primevue/textarea";
import Button from "primevue/button";

const product = ref();
const requestComment = ref("");
const requested = ref(false);
const { createOrderFromQuote } = useB2bQuoteManagement();
const { search } = useProductSearch();
const { cartItems, refreshCart, cart, addProduct } = useCart();

const proxyAddToCart = async (quantity: number = 1) => {
  await addProduct({ id: product.value?.id, quantity });
  refreshCart();
};
const handleCreateQuote = async () => {
  await createOrderFromQuote(cart.value.token, requestComment.value);
};
onMounted(async () => {
  refreshCart();
  const productResponse = await search("85a0d7e39bdf49d0a6f6318c6e464cc1");
  product.value = productResponse.product;
});
</script>
<template>
  <div>
    <pre>{{ cart }}</pre>
    <p>Quote can requested only for not empty cart</p>
    <div v-if="cartItems.length > 0">Items in cart {{ cartItems.length }}</div>
    <div v-else>
      <p>Your cart is empty. Click button bellow to add an item</p>
      <button
        @click="proxyAddToCart(1)"
        class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
      >
        Add item to cart
      </button>
    </div>
  </div>
  <div class="flex flex-col">
    <template v-if="!requested">
      <Textarea v-model="requestComment" rows="5" cols="30" />
      <Button label="Request quote" @click="handleCreateQuote" />
    </template>
    <template v-else>
      Quote requested.
      <RouterLink :to="'/quotes'">CLICK HERE TO SEE THE LIST</RouterLink>
    </template>
  </div>
</template>
