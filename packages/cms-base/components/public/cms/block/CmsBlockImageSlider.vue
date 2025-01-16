<script setup lang="ts">
import type { CmsBlockImageSlider } from "@shopware/composables";
import { useCmsBlock } from "#imports";

const props = defineProps<{
  content: CmsBlockImageSlider;
}>();

const { getSlotContent } = useCmsBlock(props.content);
const cmsContent = getSlotContent("imageSlider");
</script>

<template>
  <div class="cms-block-image-slider">
    <CmsGenericElement :content="cmsContent" />
  </div>
</template>
