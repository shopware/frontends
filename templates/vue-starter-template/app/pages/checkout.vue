<script setup lang="ts">
const { cart } = useCart();
// const { refreshSessionContext } = useSessionContext();

// onMounted(() => {
//   refreshSessionContext();
// });
</script>
<template>
   <pre> {{ cart }} </pre> 
  <div class="container mx-auto">
    <h1 class="text-10 my-20 font-['Noto_Serif']">
      {{ $t("checkout.title") }}
    </h1>
    <div class="flex gap-20 justify-between ">
      <div class="w-1/2">
        <CheckoutStepHeader :step="1" label="Shipping address" />
        <CheckoutStepHeader :step="2" label="Shipping" />
        <CheckoutStepHeader :step="3" label="Payment information" />
      </div>
      <div class="w-1/2">
        <CheckoutSummaryBox v-if="cart" :cart="cart" />
       
      </div>
    </div>
  </div>
</template>
