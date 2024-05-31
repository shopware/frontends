<script setup lang="ts">
import { useRoute } from "#app";
const route = useRoute();

const { register, amazonSessionData, pay } = useAmazonPay();

const registerAmazonUserAndPay = async () => {
  await register(route.query.amazonCheckoutSessionId as string);

  const response = await (await pay(route.query.amazonCheckoutSessionId as string)).json();

  const redirectUrl = response.result?.webCheckoutDetails?.amazonPayRedirectUrl;
  // Redirect to Amazon Pay
  if (redirectUrl) {
    window.location.href = redirectUrl;
  }
};


</script>

<template>
<div class="flex flex-col items-center justify-center">
<button @click="registerAmazonUserAndPay" class="p-2 mt-8">Register & Checkout</button>
</div>
</template>
