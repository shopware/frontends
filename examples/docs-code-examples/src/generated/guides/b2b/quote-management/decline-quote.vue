<script setup lang="ts">
import { useB2bQuoteManagement } from "@shopware/composables";
import { ref } from "vue";
const declineComment = ref("");
const quote = ref("example-id");
const { declineQuote } = useB2bQuoteManagement();
const handleDecline = async () => {
  declineQuote(quote.value.id, declineComment.value);
  declineComment.value = "";
};
</script>
<template>
  <form @submit.prevent="handleDecline">
    <textarea v-model="declineComment"> </textarea>
    <button>Decline</button>
  </form>
</template>
