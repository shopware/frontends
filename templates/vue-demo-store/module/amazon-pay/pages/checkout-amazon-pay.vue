<script setup lang="ts">
import { useRoute } from "#app";
const route = useRoute();

const { register, amazonSessionData } = useAmazonPay();

const registerAmazonUserAndPay = async () => {
  await register(route.query.amazonCheckoutSessionId as string);

  // Redirect to Amazon Pay
  window.location.href = amazonSessionData.value.webCheckoutDetails.amazonPayRedirectUrl;

};


</script>

<template>
<div class="flex flex-col items-center justify-center">
<button @click="registerAmazonUserAndPay" class="p-2 mt-8">Register & Checkout</button>
</div>
</template>
