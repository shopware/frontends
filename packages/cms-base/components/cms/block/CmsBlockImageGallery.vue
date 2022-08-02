<script setup lang="ts">
import { CmsBlockImageGallery } from "@shopware-pwa/composables-next";

const props = defineProps<{
  content: CmsBlockImageGallery;
}>();

const { getSlotContent } = useCmsBlock(props.content);

const cmsContent = getSlotContent("imageGallery");
</script>

<template>
  <div class="cms-block-image-gallery">
    <CmsGenericElement :content="cmsContent" />
  </div>
</template>
