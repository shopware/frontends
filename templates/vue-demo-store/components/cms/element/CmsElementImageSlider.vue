<script setup lang="ts">
import type {
  CmsElementImageSlider,
  CmsElementImage,
} from "@shopware-pwa/composables-next";
import SwSlider from "../../SwSlider.vue";

const props = defineProps<{
  content: CmsElementImageSlider;
}>();
const items = computed(() => props.content.data.sliderItems);
</script>
<template>
  <div class="cms-element-image-slider">
    <!-- <SwSlider :config="props.content.config">
      <CmsElementImage
        v-for="image of items"
        :key="image.media.url"
        :content="({ data: image, config: props.content.config } as unknown as CmsElementImage)"
      />
    </SwSlider> -->
  </div>
</template>
