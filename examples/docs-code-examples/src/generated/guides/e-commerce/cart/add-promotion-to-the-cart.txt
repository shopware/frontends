<script setup lang="ts">
import { ref, useCart } from "#imports";
const promotionCode = ref<string>();
const { addPromotionCode, appliedPromotionCodes } = useCart();
</script>
<template>
  <input type="text" v-model="promotionCode" />
  <button @click="addPromotionCode(promotionCode)">Apply promotion code</button>
</template>
