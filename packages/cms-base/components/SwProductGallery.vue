<script setup lang="ts">
import type { CmsElementImageGallery } from "@shopware-pwa/composables-next";
import type { Schemas } from "#shopware";
import { ref, watch } from "vue";

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
