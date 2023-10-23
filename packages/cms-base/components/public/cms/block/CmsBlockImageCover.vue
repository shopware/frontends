<script setup lang="ts">
import type { CmsBlockImageCover } from "@shopware-pwa/composables-next";

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
