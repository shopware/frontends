<script setup lang="ts">
import { defu } from "defu";
import { computed, onMounted, ref, toRefs } from "vue";
import {
  useCmsTranslations,
  useProductReviews,
  useShopwareContext,
} from "#imports";
import type { Schemas } from "#shopware";

const props = defineProps<{
  product: Schemas["Product"];
  reviews?: Schemas["ProductReview"][];
}>();

type Translations = {
  product: {
    noReviews: string;
    reviewNotAccepted: string;
  };
};

let translations: Translations = {
  product: {
    noReviews: "No reviews yet.",
    reviewNotAccepted: "Your review has not been approved yet",
  },
};

translations = defu(useCmsTranslations(), translations) as Translations;

const { product, reviews } = toRefs(props);

const shouldLoadReviews = !reviews?.value;

const loadingReviews = ref<boolean>(shouldLoadReviews);
const { loadProductReviews, productReviews } = useProductReviews(product);

onMounted(async () => {
  if (shouldLoadReviews) {
    await loadProductReviews();
  }
  loadingReviews.value = false;
});
const reviewsList = computed<Schemas["ProductReview"][]>(
  () => reviews?.value || productReviews.value || [],
);

const format: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "numeric",
  day: "numeric",
  hour: "numeric",
  minute: "numeric",
};

const { browserLocale } = useShopwareContext();

const formatDate = (date: string) => {
  return new Intl.DateTimeFormat(browserLocale, format).format(new Date(date));
};
</script>

<template>
  <div
    v-if="loadingReviews"
    class="absolute inset-0 flex items-center justify-center z-10 bg-white/75"
  >
    <div
      class="h-15 w-15 i-carbon-progress-bar-round animate-spin c-gray-500"
    />
  </div>
  <div v-else-if="reviewsList.length">
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
        {{ translations.product.reviewNotAccepted }}
      </div>
      <div
        class="cms-block-product-description-reviews__reviews-rating inline-flex items-center mt-2"
      >
        <div
          v-for="_ in review.points"
          :key="`filled-star-${_}`"
          class="w-5 h-5 i-carbon-star-filled"
        ></div>
        <div
          v-for="_ in 5 - (review.points || 0)"
          :key="`empty-star-${_}`"
          class="w-5 h-5 i-carbon-star"
        ></div>
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

  <div v-else>{{ translations.product.noReviews }}.</div>
</template>
