<script setup lang="ts">
import type {
  CmsElementImage,
  CmsElementImageSlider,
} from "@shopware/composables";
import { computed } from "vue";

const props = defineProps<{
  content: CmsElementImageSlider;
}>();
const items = computed(() => props.content.data.sliderItems);
</script>
<template>
  <!-- need some width here for small views that the slider can calculate the correct items with -->
  <div class="cms-element-image-slider w-[92vw] sm:w-[94vw] md:w-full">
    <SwSlider :config="props.content.config">
      <CmsElementImage
        v-for="image of items"
        :key="image.media.url"
        :content="
          {
            data: image,
            config: props.content.config,
          } as unknown as CmsElementImage
        "
      />
    </SwSlider>
  </div>
</template>
