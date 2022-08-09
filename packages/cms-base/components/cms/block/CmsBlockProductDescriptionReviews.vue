<script setup lang="ts">
import { CmsProductPageResponse, ProductReview } from "@shopware-pwa/types";
import { CmsBlockProductDescriptionReviews } from "@shopware-pwa/composables-next";
import {
  getTranslatedProperty,
  getProductName,
} from "@shopware-pwa/helpers-next";
import { getProductReviews } from "@shopware-pwa/shopware-6-client";
import { Ref, ref } from "vue";
import SwStarIcon from "./../../SwStarIcon.vue";

const props = defineProps<{
  content: CmsBlockProductDescriptionReviews;
}>();

const { getSlotContent } = useCmsBlock(props.content);

const slotContent = getSlotContent("content");

const { cmsContent } = useCms();
const product = computed(
  () =>
    (slotContent?.data as any)?.product ||
    (cmsContent.value as CmsProductPageResponse)?.product
);

const description = computed(() =>
  getTranslatedProperty(product.value, "description")
);
const properties = computed(() => product.value?.properties || []);
const reviews: Ref<ProductReview[]> = ref([]);

const { apiInstance } = useShopwareContext();
onMounted(async () => {
  const reviewsResponse = await getProductReviews(
    product.value?.id,
    undefined,
    apiInstance
  );
  reviews.value = reviewsResponse?.elements || [];
});

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

const openTab: Ref<number> = ref(1);
const toggleTabs = (tabNumber: number, event: MouseEvent) => {
  if (event) {
    event.preventDefault();
  }
  openTab.value = tabNumber;
};
</script>

<template>
  <div class="cms-block-product-description-reviews flex flex-wrap">
    <div class="w-full">
      <ul
        class="flex flex-wrap text-sm font-medium list-none text-center text-gray-500 border-b border-gray-200 dark:border-gray-500 dark:text-gray-400"
      >
        <li class="mr-2 text-center">
          <a
            class="font-bold uppercase px-5 py-3 block leading-normal"
            :class="{
              'text-gray-500 bg-white': openTab !== 1,
              'text-white bg-gray-500': openTab === 1,
            }"
            @click="(event) => toggleTabs(1, event)"
          >
            <i class="fas fa-space-shuttle text-base mr-1" /> Description
          </a>
        </li>
        <li class="mr-2 text-center">
          <a
            class="font-bold uppercase px-5 py-3 block leading-normal"
            :class="{
              'text-gray-500 bg-white': openTab !== 2,
              'text-white bg-gray-500': openTab === 2,
            }"
            @click="(event) => toggleTabs(2, event)"
          >
            <i class="fas fa-cog text-base mr-1" /> Reviews
          </a>
        </li>
      </ul>
      <div class="relative flex flex-col min-w-0 break-words w-full mb-6">
        <div class="px-4 py-5 flex-auto">
          <div class="tab-content tab-space">
            <div
              :class="[
                'cms-block-product-description-reviews__description',
                { hidden: openTab !== 1, block: openTab === 1 },
              ]"
            >
              <p class="text-xl font-bold mt-3">
                {{ getProductName({ product }) }}
              </p>
              <p class="mt-2" v-if="description" v-html="description" />
            </div>
            <div :class="{ hidden: openTab !== 2, block: openTab === 2 }">
              <div
                class="cms-block-product-description-reviews__reviews"
                v-if="reviews.length"
              >
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
                    <div v-for="value in 5 - review.points">
                      <SwStarIcon :is-empty="true" />
                    </div>
                    <div
                      class="cms-block-product-description-reviews__reviews-title font-semibold ml-2"
                    >
                      <p>{{ review.title }}</p>
                    </div>
                  </div>
                  <div
                    class="cms-block-product-description-reviews__reviews-content mt-2"
                  >
                    <span>{{ review.content }}</span>
                  </div>
                </div>
              </div>

              <div v-else>No comments yet.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
