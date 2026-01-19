<script setup lang="ts">
import type {
  CmsElementImageGallery,
  SliderElementConfig,
} from "@shopware/composables";
import { ref, watch } from "vue";
import type { Schemas } from "#shopware";

const { product, config = {} } = defineProps<{
  product: Schemas["Product"];
  config?: Partial<SliderElementConfig>;
}>();

const defaultConfig: SliderElementConfig = {
  minHeight: { value: "300px", source: "static" },
  navigationArrows: { value: "inside", source: "static" },
  navigationDots: { value: "inside", source: "static" },
};

const content = ref<CmsElementImageGallery>();

watch(
  [() => product, () => config],
  ([currentProduct, currentConfig]) => {
    content.value = {
      config: {
        ...defaultConfig,
        ...currentConfig,
      },
      data: {
        sliderItems: currentProduct.media,
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
