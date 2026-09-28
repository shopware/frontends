<script setup lang="ts">
import { useB2bQuoteManagement } from "@shopware/composables";
import { ref } from "vue";
const declineComment = ref("");
const declineLineItemId = ref<string>();
const quoteId = ref("example-id");
const { declineQuoteWithComment, createDraftQuoteVersion } =
  useB2bQuoteManagement();
const handleDecline = async () => {
  const lineItemId = declineLineItemId.value;
  if (!lineItemId) return;

  const versionId = await createDraftQuoteVersion(quoteId.value);

  await declineQuoteWithComment(quoteId.value, {
    comment: declineComment.value,
    lineItemId,
    versionId,
  });
  declineComment.value = "";
};
</script>
<template>
  <form @submit.prevent="handleDecline">
    <textarea v-model="declineComment"> </textarea>
    <button>Decline</button>
  </form>
</template>
