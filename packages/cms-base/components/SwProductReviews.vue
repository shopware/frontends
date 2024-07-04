<script setup lang="ts">
import type { Schemas } from "#shopware";
import { useProductReviews, useCmsTranslations } from "#imports";
import { computed, onMounted, ref, toRefs } from "vue";
import { defu } from "defu";

const props = defineProps<{
  product: Schemas["Product"];
  reviews?: Schemas["ProductReview"][];
}>();

type Translations = {
  product: {
    noReviews: string;
  };
};

let translations: Translations = {
  product: {
    noReviews: "No reviews yet.",
  },
};

translations = defu(useCmsTranslations(), translations) as Translations;

const { product, reviews } = toRefs(props);

const shouldLoadReviews = !reviews?.value;

const loadingReviews = ref<boolean>(shouldLoadReviews);
const { loadProductReviews, productReviews } = useProductReviews(product);

onMounted(async () => {
  shouldLoadReviews && (await loadProductReviews());
  loadingReviews.value = false;
});
const reviewsList = computed<Schemas["ProductReview"][]>(
  () => reviews?.value || productReviews.value || [],
);

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
    <div
      class="h-15 w-15 i-carbon-progress-bar-round animate-spin c-gray-500"
    />
  </div>
  <div v-else-if="reviewsList.length">
    <div v-for="review in reviews" :key="review.id">
      <div
        class="cms-block-product-description-reviews__reviews-time mt-3 text-gray-600 text-sm"
      >
        <span>{{ formatDate(review.createdAt) }}</span>
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
