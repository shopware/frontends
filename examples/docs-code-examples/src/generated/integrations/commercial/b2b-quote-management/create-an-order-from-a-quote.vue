<script setup lang="ts">
import { useB2bQuoteManagement } from "@shopware/composables";
import { ref } from "vue";
const quote = ref("example-id");
const comment = ref("");
const { createOrderFromQuote } = useB2bQuoteManagement();
const handleCreateOrder = async () => {
  await createOrderFromQuote(quote.value.id, comment.value);
};
</script>
<template>
  <template>
    <form @submit.prevent="handleCreateOrder">
      <textarea v-model="comment"> </textarea>
      <button type="submit">Create order</button>
    </form>
  </template>
</template>
