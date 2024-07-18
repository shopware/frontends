<script setup lang="ts">
import type { CmsBlockProductDescriptionReviews } from "@shopware-pwa/composables-next";
import { useCmsBlock } from "#imports";

const props = defineProps<{
  content: CmsBlockProductDescriptionReviews;
}>();
const { getSlotContent } = useCmsBlock(props.content);
const slotContent = getSlotContent("content");
</script>
<template>
  <div class="cms-block-product-description-reviews">
    <CmsGenericElement :content="slotContent" />
  </div>
</template>
