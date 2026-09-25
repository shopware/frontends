<script setup lang="ts">
import { useB2bQuoteManagement } from "@shopware/composables";
import { ref } from "vue";
const quoteId = ref("example-id");
const comment = ref("");
const { createOrderFromQuote } = useB2bQuoteManagement();
const handleCreateOrder = async () => {
  await createOrderFromQuote(quoteId.value, comment.value);
};
</script>
<template>
  <form @submit.prevent="handleCreateOrder">
    <textarea v-model="comment"> </textarea>
    <button type="submit">Create order</button>
  </form>
</template>
