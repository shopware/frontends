<script setup lang="ts">
import type { Schemas } from "#shopware";

const props = defineProps<{
  reviews: Schemas["ProductReview"][];
}>();

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
  <div>
    <h4 class="text-xl font-bold dark:text-white mt-3">
      {{ $t("product.reviews") }}
    </h4>
    <div v-if="props.reviews.length">
      <div v-for="review in reviews" :key="review.id">
        <div
          v-if="review.createdAt"
          class="cms-block-product-description-reviews__reviews-time mt-3 text-gray-600 text-sm"
        >
          <span>{{ formatDate(review.createdAt) }}</span>
        </div>
        <div
          v-if="!review.status"
          class="mt-2 text-3 p-2 bg-[#d4f0f5] flex gap-2 items-center"
        >
          <div class="w-6 h-6 i-carbon-warning" />
          {{ $t("product.reviewNotAccepted") }}
        </div>
        <div
          class="cms-block-product-description-reviews__reviews-rating inline-flex items-center mt-2"
        >
          <div
            v-for="(value, index) in review.points"
            :key="index"
            class="w-5 h-5 i-carbon-star-filled"
          ></div>
          <div
            v-for="(value, index) in 5 - (review.points || 0)"
            :key="index"
            class="w-5 h-5 i-carbon-star"
          ></div>
          <div
            class="cms-block-product-description-reviews__reviews-title font-semibold ml-2"
          >
            <p>{{ review.title }}</p>
          </div>
        </div>
        <div
          class="cms-block-product-description-reviews__reviews-content mt-2"
        >
          <p class="break-words">{{ review.content }}</p>
          <p v-if="review.comment" class="text-gray">
            - {{ $t("product.reviewFeedback") }}: {{ review.comment }}
          </p>
        </div>
      </div>
    </div>
    <div v-else>{{ $t("product.noReviews") }}</div>
  </div>
</template>
