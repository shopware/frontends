<script setup lang="ts">
import type { Schemas } from "#shopware";

const props = defineProps<{
  product: Schemas["Product"];
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
    } as unknown as CmsElementImageGallery;
  },
  {
    immediate: true,
  },
);
</script>

<template>
  <CmsElementImageGallery v-if="content" :content="content" />
</template>
