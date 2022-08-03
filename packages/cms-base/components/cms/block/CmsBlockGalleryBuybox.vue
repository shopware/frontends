<script setup lang="ts">
import {
  CmsBlockGalleryBuybox,
  CmsElementProductBox,
} from "@shopware-pwa/composables-next";
import { CmsProductPageResponse } from "@shopware-pwa/types";

const props = defineProps<{
  content: CmsBlockGalleryBuybox;
}>();

const { getSlotContent } = useCmsBlock(props.content);
const slotContent = getSlotContent("right");

const { cmsContent } = useCms();
const product = computed(
  () =>
    // transform into generic
    (slotContent as CmsElementProductBox)?.data?.product ||
    (cmsContent.value as CmsProductPageResponse)?.product
);
</script>

<template>
  <div class="container mx-auto flex flex-row">
    <div class="mt-6 mb-8 rounded-lg overflow-hidden lg:pr-8 basis-4/6">
      <SwProductGallery :product="product" />
    </div>
    <div class="mt-6 mb-9 basis-2/6">
      <h2 class="sr-only">Product information</h2>
      <SwProductPrice :product="product" />
      <SwVariantConfigurator :product="product" />
      <SwProductAddToCart :product="product" />
    </div>
  </div>
</template>
