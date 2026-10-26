<script setup lang="ts">
import { useB2bQuoteManagement } from "@shopware/composables";
import { ref } from "vue";
const quoteId = ref("example-id");
const changeRequest = ref("");
const { requestChangeQuote } = useB2bQuoteManagement();
const handleChangeRequest = async () => {
  await requestChangeQuote(quoteId.value, changeRequest.value);
  changeRequest.value = "";
};
</script>
<template>
  <form @submit.prevent="handleChangeRequest">
    <textarea v-model="changeRequest"> </textarea>
    <button type="submit">Send</button>
  </form>
</template>
