<script setup lang="ts">
import type { CmsElementProductDescriptionReviews } from "@shopware-pwa/composables-next";
import {
  getTranslatedProperty,
  getProductName,
} from "@shopware-pwa/helpers-next";

const props = defineProps<{
  content: CmsElementProductDescriptionReviews;
}>();
const currentTab = ref<number>(1);
const { product: contextProduct } = useProduct();
const product = computed(
  () => props.content.data.product || contextProduct.value
);

const description = computed(() =>
  getTranslatedProperty(product.value, "description")
);

const toggleTabs = (tabNumber: number) => {
  currentTab.value = tabNumber;
};

const reviews = computed(() => props.content.data.reviews?.elements);
</script>

<template>
  <div
    class="cms-block-product-description-reviews flex flex-wrap"
    v-if="product"
  >
    <div class="w-full">
      <ul
        class="flex flex-wrap text-sm font-medium list-none text-center text-gray-500 border-b border-gray-200 dark:border-gray-500 dark:text-gray-400"
      >
        <li class="mr-2 text-center">
          <a
            class="font-bold uppercase px-5 py-3 block leading-normal cursor-pointer"
            :class="[
              currentTab !== 1
                ? 'text-gray-500 bg-white'
                : 'text-white bg-gray-500',
            ]"
            @click="() => toggleTabs(1)"
          >
            <i class="fas fa-space-shuttle text-base mr-1" /> Description
          </a>
        </li>
        <li class="mr-2 text-center">
          <a
            class="font-bold uppercase px-5 py-3 block leading-normal cursor-pointer"
            :class="[
              currentTab !== 2
                ? 'text-gray-500 bg-white'
                : 'text-white bg-gray-500',
            ]"
            @click="() => toggleTabs(2)"
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
                currentTab !== 1 ? 'hidden' : 'block',
              ]"
            >
              <p class="text-xl font-bold mt-3">
                {{ getProductName({ product }) }}
              </p>
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
