<script setup lang="ts">
import type { CmsBlockImage } from "@shopware-pwa/composables-next";

const props = defineProps<{
  content: CmsBlockImage;
}>();

const { getSlotContent } = useCmsBlock(props.content);
const imageContent = getSlotContent("image");
</script>
<template>
  <div>
    <CmsGenericElement :content="imageContent" />
  </div>
</template>
