<script setup lang="ts">
defineProps<{
  counter: number;
}>();
</script>
<template>
  <div class="relative">
    <Icon
      size="1.2rem"
      name="shopware:shopping-cart"
      class="color-brand-primary"
    />
    <SwMainCounter
      v-if="counter > 0"
      class="absolute top-[-50%] left-[50%]"
      :count="counter"
    />
  </div>
</template>
