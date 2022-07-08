<script setup lang="ts">
import { CmsBlockImageCover } from "@shopware-pwa/composables-next";

const props = defineProps<{
  content: CmsBlockImageCover;
}>();

const { getSlotContent } = useCmsBlock(props.content);

const cmsContent = getSlotContent("image");
</script>
<template>
  <CmsGenericElement v-if="cmsContent" :content="cmsContent" />
</template>
