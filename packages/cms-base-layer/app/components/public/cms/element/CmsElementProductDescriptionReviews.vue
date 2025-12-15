<script setup lang="ts">
import type { CmsElementProductDescriptionReviews } from "@shopware/composables";
import { useCmsTranslations } from "@shopware/composables";
import { getTranslatedProperty } from "@shopware/helpers";
import { defu } from "defu";
import { type Ref, computed, onMounted, ref } from "vue";
import xss from "xss";
import { useProduct, useShopwareContext, useUser } from "#imports";
import type { Schemas } from "#shopware";

const props = defineProps<{
  content: CmsElementProductDescriptionReviews;
}>();

type Translations = {
  product: {
    description: string;
    reviews: string;
    messages: {
      reviewAdded: string;
      loginToReview: string;
    };
  };
};

let translations: Translations = {
  product: {
    description: "Description",
    reviews: "Reviews",
    messages: {
      reviewAdded: "Thank you for submitting your review",
      loginToReview: "Please log in to write a review",
    },
  },
};
translations = defu(useCmsTranslations(), translations) as Translations;

const openSections = ref<Set<number>>(new Set([1]));
const { product } = useProduct(props.content.data?.product);

const description = computed(() =>
  xss(getTranslatedProperty(product.value, "description")),
);

const toggleSection = (sectionNumber: number) => {
  if (openSections.value.has(sectionNumber)) {
    openSections.value.delete(sectionNumber);
  } else {
    openSections.value.add(sectionNumber);
  }
};

const isSectionOpen = (sectionNumber: number) => {
  return openSections.value.has(sectionNumber);
};

const reviews: Ref<Schemas["ProductReview"][]> = ref([]);
const { apiClient } = useShopwareContext();
const { isLoggedIn } = useUser();
const reviewAdded = ref(false);

const fetchReviews = async () => {
  try {
    const reviewsResponse = await apiClient.invoke(
      "readProductReviews post /product/{productId}/reviews",
      {
        pathParams: { productId: product.value.id },
      },
    );
    reviews.value = reviewsResponse.data.elements || [];
  } catch (error) {
    console.error("Failed to fetch reviews:", error);
    // Keep existing reviews if fetch fails
  }
};

const handleReviewAdded = () => {
  reviewAdded.value = true;
  fetchReviews();
};

onMounted(async () => {
  if (props.content.data?.reviews?.elements?.length) {
    reviews.value = props.content.data.reviews.elements;
  } else {
    await fetchReviews();
  }
});
</script>

<template>
  <div class="w-full self-stretch inline-flex flex-col justify-start items-start gap-4">
    <div class="self-stretch flex flex-col justify-center items-center">
      <div
        class="self-stretch py-3 border-b border-outline-outline-variant inline-flex justify-start items-center gap-1 cursor-pointer hover:bg-surface-surface-variant transition-colors"
        @click="toggleSection(1)">
        <div class="flex-1 flex items-center gap-2.5">
          <div class="flex-1 text-surface-on-surface text-base font-bold leading-normal">
            {{ translations.product.description }}
          </div>
        </div>
        <div class="w-6 h-6 relative">
          <div class="w-2.5 h-1.5 left-[7px] top-[9.50px] absolute">
            <div class="i-carbon-chevron-down transition-transform duration-200"
              :class="{ 'rotate-180': isSectionOpen(1) }"></div>
          </div>
        </div>
      </div>
    </div>
    <Transition name="accordion">
      <div v-if="isSectionOpen(1)" class="self-stretch flex flex-col justify-center items-center gap-2.5">
        <div
          class="self-stretch text-surface-on-surface text-base font-normal leading-normal">
          <!-- eslint-disable-next-line vue/no-v-html -->
          <div v-html="description"></div>
        </div>
      </div>
    </Transition>
    <div class="self-stretch flex flex-col justify-center items-center">
      <div
        class="self-stretch py-3 border-b border-outline-outline-variant inline-flex justify-start items-center gap-1 cursor-pointer hover:bg-surface-surface-variant transition-colors"
        @click="toggleSection(2)">
        <div class="flex-1 flex items-center gap-2.5">
          <div class="flex-1 text-surface-on-surface text-base font-bold leading-normal">
            {{ translations.product.reviews }} ({{ reviews.length }})
          </div>
        </div>
        <div class="w-6 h-6 relative">
          <div class="w-2.5 h-1.5 left-[7px] top-[9.50px] absolute">
            <div class="i-carbon-chevron-down transition-transform duration-200"
              :class="{ 'rotate-180': isSectionOpen(2) }"></div>
          </div>
        </div>
      </div>
    </div>
    <Transition name="accordion">
      <div v-if="isSectionOpen(2)" class="self-stretch flex flex-col justify-center items-center gap-2.5">
        <div
          class="self-stretch text-surface-on-surface text-base font-normal leading-normal">
          <SwProductReviews v-if="product" :product="product" :reviews="reviews" />
          <ClientOnly>
            <SwProductReviewsForm
              v-if="isLoggedIn && !reviewAdded && product"
              :product-id="product.id"
              @success="handleReviewAdded"
            />
            <div v-else-if="!isLoggedIn && product" class="mt-4 p-3 bg-surface-surface-container border border-surface-on-surface-variant rounded-md flex gap-2 md:gap-3 items-center">
              <div class="w-5 h-5 text-surface-on-surface-variant flex-shrink-0">
                <SwUserIcon :size="20" />
              </div>
              <span class="text-sm text-surface-on-surface-variant">{{ translations.product.messages.loginToReview }}</span>
            </div>
          </ClientOnly>
          <div v-if="reviewAdded" class="mt-4 p-3 bg-surface-surface-container border border-states-success rounded-md flex gap-2 md:gap-3 items-center">
            <div class="w-5 h-5 text-states-success flex-shrink-0">
              <SwCheckmarkIcon :size="20" :filled="true" alt="Success" />
            </div>
            <span class="text-sm text-states-success">{{ translations.product.messages.reviewAdded }}</span>
          </div>
        </div>
      </div>
    </Transition>
    <div class="self-stretch flex flex-col justify-center items-center">
      <div
        class="self-stretch py-3 border-b border-outline-outline-variant inline-flex justify-start items-center gap-1 cursor-pointer hover:bg-surface-surface-variant transition-colors"
        @click="toggleSection(3)">
        <div class="flex-1 flex items-center gap-2.5">
          <div class="flex-1 text-surface-on-surface text-base font-bold leading-normal">
            Category
          </div>
        </div>
        <div class="w-6 h-6 relative">
          <div class="w-2.5 h-1.5 left-[7px] top-[9.50px] absolute">
            <div class="i-carbon-chevron-down transition-transform duration-200"
              :class="{ 'rotate-180': isSectionOpen(3) }"></div>
          </div>
        </div>
      </div>
    </div>
    <Transition name="accordion">
      <div v-if="isSectionOpen(3)" class="self-stretch flex flex-col justify-center items-center gap-2.5">
        <div
          class="self-stretch text-surface-on-surface text-base font-normal leading-normal">
          <div v-if="product?.categories">
            <div v-for="category in product.categories" :key="category.id" class="mb-2">
              {{ category.name }}
            </div>
          </div>
          <div v-else>
            No categories available
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>
<style scoped>
.accordion-enter-active,
.accordion-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
}

.accordion-enter-from,
.accordion-leave-to {
  max-height: 0;
  opacity: 0;
  transform: translateY(-10px);
}

.accordion-enter-to,
.accordion-leave-from {
  max-height: 500px;
  opacity: 1;
  transform: translateY(0);
}
</style>
