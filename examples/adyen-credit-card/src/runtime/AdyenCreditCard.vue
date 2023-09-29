<script setup lang="ts">
import { useNuxtApp, onMounted } from "#imports";

const { $adyenCheckout } = useNuxtApp();

import "@adyen/adyen-web/dist/adyen.css";

// Access the available payment methods for the session.
console.log($adyenCheckout.paymentMethodsResponse); // => { paymentMethods: [...], storedPaymentMethods: [...] }

onMounted(() => {
  console.warn("adyencheckout", $adyenCheckout);
  // Create an instance of the Component and mount it to the container you created.
  $adyenCheckout.create("card").mount("#adyen-credit-card");
});
</script>
<template>
  <div id="adyen-credit-card" />
</template>
