<script setup lang="ts">
import xss from "xss";
import type { CmsElementProductDescriptionReviews } from "@shopware-pwa/composables-next";
import {
  getTranslatedProperty,
  getProductName,
} from "@shopware-pwa/helpers-next";
import { useCmsTranslations } from "@shopware-pwa/composables-next";
import SwProductReviews from "../../../SwProductReviews.vue";
import { computed, ref } from "vue";
import { defu } from "defu";
import { useProduct } from "#imports";

const props = defineProps<{
  content: CmsElementProductDescriptionReviews;
}>();

type Translations = {
  products: {
    description: string;
    reviews: string;
  };
};

let translations: Translations = {
  products: {
    description: "Description",
    reviews: "Reviews",
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

const reviews = computed(() => props.content.data.reviews.elements);
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
            {{ translations.products.description }}
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
            @click="() => toggleTabs(2)"
          >
            <i class="fas fa-cog text-base mr-1" />
            {{ translations.products.reviews }}
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
