<script setup lang="ts">
import { StarIcon } from "@heroicons/vue/24/solid";

const props = withDefaults(
  defineProps<{
    rating?: number
  }>(),
  {
    rating: 0
  }
);
</script>
<template>
  <div class="flex items-center">
    <StarIcon
      v-for="value in props.rating"
      class="w-4 h-4 text-black cursor-pointer"
    />
    <StarIcon
      v-for="value in 5 - props.rating"
      class="w-4 h-4 text-gray-300 cursor-pointer"
    />
  </div>
</template>