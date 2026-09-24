<script setup lang="ts">
import { useB2bQuoteManagement } from "@shopware/composables";
import { ref } from "vue";
const quoteId = ref("example-id");
const { changeShippingMethod, changePaymentMethod } = useB2bQuoteManagement();
const handleChangeMethods = async () => {
  await changeShippingMethod(quoteId.value, "example-shipping-id");
  await changePaymentMethod(quoteId.value, "example-payment-id");
};
</script>
<template>
  <button @click="handleChangeMethods">Change methods</button>
</template>
