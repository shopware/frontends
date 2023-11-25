<script setup lang="ts">
import type { CmsElementProductListing } from "@shopware-pwa/composables-next";
import SwProductCard from "../../../SwProductCard.vue";
import SwPagination from "../../../SwPagination.vue";
import deepMerge from "../../../../helpers/deepMerge";
import getTranslations from "../../../../helpers/getTranslations";
import { useListing } from "#imports";
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import type { RequestParameters, Schemas } from "#shopware";

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
  changeCurrentPage(
    page,
    route.query as unknown as RequestParameters<"searchPage">,
  );
};
const isProductListing = computed(
  () => props.content?.type === "product-listing",
);

setInitialListing(
  props?.content?.data?.listing as Schemas["ProductListingResult"],
);
</script>

<template>
  <div class="bg-white">
    <div class="max-w-2xl mx-auto lg:max-w-full">
      <div v-if="getElements?.length" class="mt-6">
        <div
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8 p-4 md:p-6 lg:p-8"
        >
          <SwProductCard
            v-for="product in getElements"
            :key="product.id"
            :product="product"
            :isProductListing="isProductListing"
            class="p-4 border rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 ease-in-out"
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
