<script setup lang="ts">
import { CmsElementProductListing } from "@shopware-pwa/composables-next";
import SwProductCard from "../../../SwProductCard.vue";
import SwPagination from "../../../SwPagination.vue";
import { ShopwareSearchParams } from "@shopware-pwa/types";

const props = withDefaults(
  defineProps<{
    content: CmsElementProductListing;
    translations?: {
      noProducts: string;

    }
  }>(), {
  translations: () => ({
    "noProducts": "No products found 😔",
  })
});

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
  () => props.content?.type === "product-listing"
);

setInitialListing(props?.content?.data?.listing);
</script>

<template>
  <div class="bg-white">
    <div class="max-w-2xl mx-auto lg:max-w-full">
      <div v-if="getElements.length" class="mt-6">
        <div class="flex-1 flex-col justify-around">
          <SwProductCard
            v-for="product in getElements"
            :key="product.id"
            :product="product"
            :isProductListing="isProductListing"
            class="sm:w-6/12 lg:w-3/12 md:max-w-xs"
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
        <h2 class="mx-auto text-center">{{ props.translations.noProducts }}</h2>
      </div>
    </div>
  </div>
</template>
