<script setup lang="ts">
import "@adyen/adyen-web/dist/adyen.css";
import { onMounted } from "#imports";
import { useNuxtApp } from "#app";

const nuxtApp = useNuxtApp();

onMounted(() => {
  // Create an instance of the Component and mount it to the container you created.
  nuxtApp.$adyenCheckout.create("card").mount("#adyen-credit-card");
});
</script>
<template>
  <div id="adyen-credit-card" />
</template>
