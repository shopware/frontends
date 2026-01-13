<script setup lang="ts">
import { computed } from "vue";

const props = withDefaults(
  defineProps<{
    rating: number;
    reviewCount?: number;
    starSize?: number;
    showCount?: boolean;
  }>(),
  {
    rating: 0,
    reviewCount: 0,
    starSize: 12,
    showCount: true,
  },
);

const filledStars = computed(() => Math.round(props.rating));
</script>

<template>
  <div class="flex items-center gap-2">
    <div
      class="flex items-center"
      role="img"
      :aria-label="`${rating} out of 5 stars`"
    >
      <SwStarIcon
        v-for="i in 5"
        :key="`star-${i}`"
        :filled="i <= filledStars"
        :size="starSize"
      />
    </div>
    <span
      v-if="showCount && reviewCount > 0"
      class="text-surface-on-surface-variant text-base leading-normal"
    >
      ({{ reviewCount }})
    </span>
  </div>
</template>
