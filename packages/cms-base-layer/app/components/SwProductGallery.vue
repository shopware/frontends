<script setup lang="ts">
import type {
  CmsElementImageGallery,
  SliderElementConfig,
} from "@shopware/composables";
import { ref, watch } from "vue";
import type { Schemas } from "#shopware";

const props = withDefaults(
  defineProps<{
    product: Schemas["Product"];
    config?: Partial<SliderElementConfig>;
  }>(),
  {
    config: () => ({}),
  },
);

const defaultConfig: SliderElementConfig = {
  minHeight: { value: "300px", source: "static" },
  navigationArrows: { value: "inside", source: "static" },
  navigationDots: { value: "inside", source: "static" },
};

const content = ref<CmsElementImageGallery>();

watch(
  [() => props.product, () => props.config],
  ([product, config]) => {
    content.value = {
      config: {
        ...defaultConfig,
        ...config,
      },
      data: {
        sliderItems: product.media,
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
