<script setup lang="ts">
import {
  StarIcon,
} from '@heroicons/vue/24/solid';
import {
  Product,
} from "@shopware-pwa/types";

const props = defineProps<{
  product: Product;
  hideCount?: boolean;
  numberOfReviews?: number;
}>();

const rating = computed<number>(() =>
  props.product.ratingAverage ? Math.round(props.product.ratingAverage) : 0
);

</script>

<template>
  <div class="flex items-center">
    <div class="flex">
      <StarIcon
        v-for="value in rating"
        class="w-4 h-4 text-black"
      />
      <StarIcon
        v-for="value in (5 - rating)"
        class="w-4 h-4 text-gray-300"
      />
    </div>
    <span v-if="!hideCount" class="pl-1.5 text-sm">({{numberOfReviews}})</span>
  </div>
</template>
