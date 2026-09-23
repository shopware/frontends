<script setup lang="ts">
import { ref } from "vue";
import { useB2bQuoteManagement } from "@shopware/composables";
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
