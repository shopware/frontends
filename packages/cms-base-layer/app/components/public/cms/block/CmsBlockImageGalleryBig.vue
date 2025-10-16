<script setup lang="ts">
import type { CmsBlockImageGalleryBig } from "@shopware/composables";
import { useCmsBlock } from "#imports";

const props = defineProps<{
  content: CmsBlockImageGalleryBig;
}>();

const { getSlotContent } = useCmsBlock(props.content);

const cmsContent = getSlotContent("imageGallery");
</script>

<template>
  <div class="cms-block-image-gallery-big">
    <CmsGenericElement :content="cmsContent" />
  </div>
</template>

<style scoped>
.cms-block-image-gallery-big {
  @apply w-full;
}

.cms-block-image-gallery-big :deep(.cms-element-image-gallery) {
  @apply max-w-screen-xl mx-auto;
}

/* Enhanced styling for the big gallery version */
.cms-block-image-gallery-big :deep(.gallery-slider) {
  @apply max-h-[800px];
}

.cms-block-image-gallery-big :deep(img) {
  @apply object-contain mx-auto;
}

/* Larger navigation controls */
.cms-block-image-gallery-big :deep(.gallery-slider-controls) {
  @apply scale-125;
}
</style>
