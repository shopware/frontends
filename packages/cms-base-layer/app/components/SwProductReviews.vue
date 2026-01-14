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
    reviewFeedback: string;
  };
};

let translations: Translations = {
  product: {
    noReviews: "No reviews yet.",
    reviewNotAccepted: "Your review has not been approved yet",
    reviewFeedback: "Shop feedback",
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
    class="absolute inset-0 flex items-center justify-center z-10 bg-surface-surface/75"
  >
    <div
      class="h-15 w-15 i-carbon-progress-bar-round animate-spin text-outline-outline"
    />
  </div>
  <div v-else-if="reviewsList.length" class="flex flex-col gap-6">
    <div
      v-for="(review, index) in reviewsList"
      :key="review.id"
      class="pb-6"
      :class="{ 'border-b border-surface-surface-container-highest': index < reviewsList.length - 1 }"
    >
      <div
        v-if="review.createdAt"
        class="cms-block-product-description-reviews__reviews-time text-surface-on-surface-variant text-sm"
      >
        <span v-if="review.externalUser">{{ review.externalUser }} - </span>
        <span>{{ formatDate(review.createdAt) }}</span>
      </div>
      <div
          v-if="!review.status"
          class="mt-2 text-3 p-2 bg-states-info-container text-states-on-info-container flex gap-2 items-center"
        >
        <div class="w-6 h-6 i-carbon-warning" />
        {{ translations.product.reviewNotAccepted }}
      </div>
      <div class="cms-block-product-description-reviews__reviews-rating inline-flex items-center mt-2">
        <SwProductRating
          :rating="review.points ?? 0"
          :star-size="20"
          :show-count="false"
        />
        <div class="cms-block-product-description-reviews__reviews-title font-semibold ml-2">
          <p>{{ review.title }}</p>
        </div>
      </div>
      <div class="cms-block-product-description-reviews__reviews-content mt-2">
        <p class="break-words">{{ review.content }}</p>
        <p v-if="review.comment" class="text-surface-on-surface-variant mt-2">
          - {{ translations.product.reviewFeedback }}: {{ review.comment }}
        </p>
      </div>
    </div>
  </div>

  <div v-else>{{ translations.product.noReviews }}.</div>
</template>
