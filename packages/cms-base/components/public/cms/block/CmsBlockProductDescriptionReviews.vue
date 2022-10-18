<script setup lang="ts">
import { CmsBlockProductDescriptionReviews } from "@shopware-pwa/composables-next";

const props = defineProps<{
  content: CmsBlockProductDescriptionReviews;
}>();
const { getSlotContent } = useCmsBlock(props.content);
const content = getSlotContent("content");
</script>
<template>
  <div class="cms-block-product-description-reviews">
    <CmsGenericElement :content="content" />
  </div>
</template>
