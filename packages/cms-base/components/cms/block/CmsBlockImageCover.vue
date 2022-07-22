<script setup lang="ts">
import { CmsBlockImageCover } from "@shopware-pwa/composables-next";

const props = defineProps<{
  content: CmsBlockImageCover;
}>();

const { getSlotContent } = useCmsBlock(props.content);

const cmsContent = getSlotContent("image");
</script>
<template>
  <div class="cms-block-image-cover">
    <CmsGenericElement v-if="cmsContent" :content="cmsContent" />
  </div>
</template>

<style scoped>
.cms-block-image-cover .cms-element-image {
  @apply aspect-square object-cover;
}
</style>
