<script setup lang="ts">
import type { CmsElementImageGallery } from "@shopware-pwa/composables-next";
import type { Product } from "@shopware-pwa/types";

const props = defineProps<{
  product: Product;
}>();
const content = ref<CmsElementImageGallery>();

watch(
  () => props.product,
  (value) => {
    const media = value.media;
    content.value = {
      config: {
        minHeight: {
          value: "600px",
          source: "static",
        },
        navigationArrows: {
          value: "inside",
          source: "static",
        },
      },
      data: {
        sliderItems: media,
      },
    } as CmsElementImageGallery;
  },
  {
    immediate: true,
  },
);
</script>

<template>
  <CmsElementImageGallery v-if="content" :content="content" />
</template>
