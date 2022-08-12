<script setup lang="ts">
import { ElementConfig } from "@shopware-pwa/composables-next";
import { Product, ProductMedia } from "@shopware-pwa/types";

const props = defineProps<{
  product: Product;
}>();
const content = ref<{
  config: {
    minHeight: ElementConfig<string>;
    navigationArrows: ElementConfig<"outside" | "inside" | "">;
  };
  data: {
    sliderItems: ProductMedia[];
  };
}>();

watch(
  () => props.product,
  (value) => {
    const media = value.media;
    content.value = {
      config: {
        minHeight: {
          value: "300px",
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
    };
  },
  {
    immediate: true,
  }
);
</script>

<template>
  <CmsElementImageGallery v-if="content" :content="content" />
</template>
