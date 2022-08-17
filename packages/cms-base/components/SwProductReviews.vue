<script setup lang="ts">
import { Product, ProductReview } from "@shopware-pwa/types";
import SwStarIcon from "./SwStarIcon.vue";
import LoadingCircle from "./icons/LoadingCircle.vue";

const props = defineProps<{
  product: Product;
}>();

const { loadProductReviews, productReviews, loadingReviews } =
  useProductReviews({
    product: props.product,
  });

onMounted(async () => {
  await loadProductReviews();
});
const reviews = computed<ProductReview[]>(() => productReviews.value ?? []);

const format: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "numeric",
  hour12: true,
};

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("en-us", format);
</script>

<template>
  <div
    v-if="loadingReviews"
    class="absolute inset-0 flex items-center justify-center z-10 bg-white/75"
  >
    <LoadingCircle class="text-3xl text-indigo-600" />
  </div>
  <div v-else-if="reviews.length">
    <div v-for="review in reviews" :key="review.id">
      <div
        class="cms-block-product-description-reviews__reviews-time mt-3 text-gray-600 text-sm"
      >
        <span>{{ formatDate(review.createdAt) }}</span>
      </div>
      <div
        class="cms-block-product-description-reviews__reviews-rating inline-flex items-center mt-2"
      >
        <div v-for="value in review.points"><SwStarIcon /></div>
        <div v-for="value in 5 - (review.points || 0)">
          <SwStarIcon :is-empty="true" />
        </div>
        <div
          class="cms-block-product-description-reviews__reviews-title font-semibold ml-2"
        >
          <p>{{ review.title }}</p>
        </div>
      </div>
      <div class="cms-block-product-description-reviews__reviews-content mt-2">
        <span>{{ review.content }}</span>
      </div>
    </div>
  </div>

  <div v-else>No comments yet.</div>
</template>
