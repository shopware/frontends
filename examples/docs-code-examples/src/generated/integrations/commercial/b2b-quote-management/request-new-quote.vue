<script setup lang="ts">
import { useCart, useB2bQuoteManagement } from "@shopware/composables";
import { ref } from "vue";
const { cartItems } = useCart();
const { requestQuote } = UseB2bQuoteManagement();
const comment = ref("");
const handleRequestQuote = async () => {
  await requestQuote(comment.value);
};
</script>
<template>
  <textarea v-model="comment"> </textarea>
  <button :disabled="cartItems.length <= 0" @click="handleRequestQuote">
    Request quote
  </button>
</template>
