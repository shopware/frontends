<script setup lang="ts">
const props = defineProps<{
  rating: number;
  reviews?: number;
  maxStars?: number;
}>();

const stars = props.maxStars || 5;
</script>
<template>
  <div class="flex items-center">
    <span v-for="i in stars" :key="i" class="mr-0.5">
      <div 
        class="w-4 h-4 i-carbon-star" 
        :class="i <= rating ? 'fill-surface-on-surface-variant text-surface-on-surface-variant' : 'text-outline-outline-variant'" 
      />
    </span>
    <span v-if="reviews !== undefined" class="ml-1 text-scale-01 text-outline-outline">({{ reviews }})</span>
  </div>
</template>
