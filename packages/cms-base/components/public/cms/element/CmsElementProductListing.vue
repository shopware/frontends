<script setup lang="ts">
import type { CmsElementProductListing } from "@shopware-pwa/composables-next/composables";
import SwProductCard from "../../../SwProductCard.vue";
import SwPagination from "../../../SwPagination.vue";
import type { ShopwareSearchParams } from "@shopware-pwa/types";
import deepMerge from "../../../../helpers/deepMerge";
import getTranslations from "../../../../helpers/getTranslations";
import { useListing } from "#imports";
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";

const props = defineProps<{
  content: CmsElementProductListing;
}>();

type Translations = {
  listing: {
    noProducts: string;
  };
};
let translations: Translations = {
  listing: {
    noProducts: "No products found 😔",
  },
};
const globalTranslations = getTranslations();
translations = deepMerge(translations, globalTranslations) as Translations;

const {
  getElements,
  setInitialListing,
  getCurrentPage,
  changeCurrentPage,
  getTotalPagesCount,
} = useListing({ listingType: "categoryListing" });

const route = useRoute();
const router = useRouter();

const changePage = async (page: number) => {
  await router.push({
    query: {
      ...route.query,
      p: page,
    },
  });
  changeCurrentPage(page, <Partial<ShopwareSearchParams>>route.query);
};
const isProductListing = computed(
  () => props.content?.type === "product-listing",
);

setInitialListing(props?.content?.data?.listing);
</script>

<template>
  <div class="bg-white">
    <div class="max-w-2xl mx-auto lg:max-w-full">
      <div v-if="getElements.length" class="mt-6">
        <div class="flex flex-wrap justify-center sm:justify-between">
          <SwProductCard
            v-for="product in getElements"
            :key="product.id"
            :product="product"
            :isProductListing="isProductListing"
            class="w-full sm:w-3/7 lg:w-2/7 mb-8"
          />
        </div>
        <div class="mt-10">
          <SwPagination
            :total="getTotalPagesCount"
            :current="Number(getCurrentPage)"
            @changePage="changePage"
          />
        </div>
      </div>
      <div v-else>
        <h2 class="mx-auto text-center">
          {{ translations.listing.noProducts }}
        </h2>
      </div>
    </div>
  </div>
</template>
