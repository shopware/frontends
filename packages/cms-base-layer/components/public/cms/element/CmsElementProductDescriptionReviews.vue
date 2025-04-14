<script setup lang="ts">
import type { CmsElementProductDescriptionReviews } from "@shopware/composables";
import { useCmsTranslations } from "@shopware/composables";
import { getProductName, getTranslatedProperty } from "@shopware/helpers";
import { defu } from "defu";
import { type Ref, computed, onMounted, ref } from "vue";
import xss from "xss";
import { useProduct } from "#imports";
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
    };
  };
};

let translations: Translations = {
  product: {
    description: "Description",
    reviews: "Reviews",
    messages: {
      reviewAdded: "Thank you for submitting your review",
    },
  },
};
translations = defu(useCmsTranslations(), translations) as Translations;

const currentTab = ref<number>(1);
const { product } = useProduct(props.content.data?.product);

const description = computed(() =>
  xss(getTranslatedProperty(product.value, "description")),
);

const toggleTabs = (tabNumber: number) => {
  currentTab.value = tabNumber;
};

const reviews: Ref<Schemas["ProductReview"][]> = ref([]);

onMounted(async () => {
  if (props.content.data?.reviews?.elements) {
    reviews.value = props.content.data.reviews.elements;
  }
});
</script>

<template>
  <div
    v-if="product"
    class="cms-block-product-description-reviews flex flex-wrap"
  >
    <div class="w-full">
      <ul
        class="flex flex-wrap text-sm font-medium list-none text-center text-secondary-500 border-b border-secondary-200 dark:border-secondary-500 dark:text-secondary-400"
      >
        <li class="mr-2 text-center">
          <a
            class="font-bold uppercase px-5 py-3 block leading-normal cursor-pointer"
            :class="[
              currentTab !== 1
                ? 'text-secondary-500 bg-white'
                : 'text-white bg-secondary-500',
            ]"
            @click="() => toggleTabs(1)"
          >
            <i class="fas fa-space-shuttle text-base mr-1" />
            {{ translations.product.description }}
          </a>
        </li>
        <li class="mr-2 text-center">
          <a
            class="font-bold uppercase px-5 py-3 block leading-normal cursor-pointer"
            :class="[
              currentTab !== 2
                ? 'text-secondary-500 bg-white'
                : 'text-white bg-secondary-500',
            ]"
            data-testid="product-reviews-tab"
            @click="() => toggleTabs(2)"
          >
            <i class="fas fa-cog text-base mr-1" />
            {{ translations.product.reviews }} ({{ reviews.length }})
          </a>
        </li>
      </ul>
      <div class="relative flex flex-col min-w-0 break-words w-full mb-6">
        <div class="px-4 py-5 flex-auto">
          <div class="tab-content tab-space">
            <div
              :class="[
                'cms-block-product-description-reviews__description',
                currentTab !== 1 ? 'hidden' : 'block',
              ]"
            >
              <p class="text-xl font-bold mt-3">
                {{ getProductName({ product }) }}
              </p>
              <!-- eslint-disable-next-line vue/no-v-html -->
              <div class="mt-2" v-html="description"></div>
            </div>
            <div
              :class="[
                'cms-block-product-description-reviews__reviews',
                currentTab !== 2 ? 'hidden' : 'block',
              ]"
            >
              <SwProductReviews :product="product" :reviews="reviews" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
