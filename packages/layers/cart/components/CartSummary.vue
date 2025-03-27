<script setup>
defineProps({
  subtotal: {
    type: Number,
    required: true,
  },
  shipping: {
    type: Number,
    required: true,
  },
  total: {
    type: Number,
    required: true,
  },
});
</script>

<template>
  <div class="space-y-3 pt-4 w-full">
    <div class="flex justify-between text-sm">
      <span class="text-[#696470]">Subtotal</span>
      <span class="text-[#1d1b20]">{{ subtotal.toFixed(2) }} €</span>
    </div>
    <div class="flex justify-between text-sm">
      <span class="text-[#696470]">Shipping</span>
      <span class="text-[#1d1b20]">{{ shipping.toFixed(2) }} €</span>
    </div>
    <div class="border-t border-[#e8e8e8] pt-3 mt-3"></div>
    <div class="flex justify-between font-medium">
      <span class="text-[#1d1b20]">Total</span>
      <span class="text-[#1d1b20]">{{ total.toFixed(2) }} €</span>
    </div>
  </div>
</template>