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
  width: 100%;
}

.cms-block-image-gallery-big :deep(.cms-element-image-gallery) {
  max-width: 1280px;
  margin-left: auto;
  margin-right: auto;
}

/* Enhanced styling for the big gallery version */
.cms-block-image-gallery-big :deep(.gallery-slider) {
  max-height: 800px;
}

.cms-block-image-gallery-big :deep(img) {
  margin-left: auto;
  margin-right: auto;
  object-fit: contain;
}

/* Larger navigation controls */
.cms-block-image-gallery-big :deep(.gallery-slider-controls) {
  transform: scale(1.25);
}
</style>
