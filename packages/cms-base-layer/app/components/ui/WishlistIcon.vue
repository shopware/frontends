<script setup lang="ts">
const { filled = false } = defineProps<{
  filled?: boolean;
}>();
</script>
<template>
  <div class="relative">
    <!-- use when filled icon is ready -->
    <!-- <Icon size="1rem" name="shopware:heart" v-if="type !== 'filled'" class="w-6 h-5 block hover:cursor-pointer" :class="[
      styles[type]
    ]" /> -->
    <div class="i-carbon-favorite w-6 h-5 hover:cursor-pointer" v-if="!filled"></div>
    <div class="i-carbon-favorite-filled w-6 h-5 hover:cursor-pointer" v-else></div>
  </div>
</template>
