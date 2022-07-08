<script setup lang="ts">
import { CmsBlockImageGallery } from "@shopware-pwa/composables-next";

const props = defineProps<{
  content: CmsBlockImageGallery;
}>();

const { getSlotContent } = useCmsBlock(props.content);

const cmsContent = getSlotContent("imageGallery");
</script>

<template>
  <div class="container mx-auto">
    <CmsGenericElement :content="cmsContent" />
  </div>
</template>
