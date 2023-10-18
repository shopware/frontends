<script setup lang="ts">
const { isLoggedIn, login} = useUser();
const { getPaymentMethods, createOrder } = useCheckout();
const { public: { adyenCheckout, loginData }} = useRuntimeConfig();
const { addProduct } = useCart();


await login({
  ...loginData
});
await addProduct({
  id: "2a88d9b59d474c7e869d8071649be43c",
  quantity: 1,
});
</script>
<template>
 <div>
 <ProgressBar :activeStep="1"/>
 <div class="messages">
    <div v-if="!isLoggedIn" class="error p-8">
      You are not logged in, visit `nuxt.config.ts` > [runtimeConfig > loginData] and change demo credentials.
    </div>
  </div>
    <ClientOnly><AdyenCreditCard /></ClientOnly>
  </div>
  
 
</template>