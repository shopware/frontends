<script setup lang="ts">
import { onMounted } from "#imports";
import { useAmazonPayButton } from "../composables/useAmazonPayButton";
const { mount } = useAmazonPayButton("#amazon-pay-button", {
  buttonColor: "Gold",
  placement: "Cart",
  productType: "PayOnly",
});

onMounted(() => {
  mount();
});
</script>
<template>
  <div id="amazon-pay-button">loading a button...</div>
</template>
