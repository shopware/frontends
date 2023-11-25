<script setup lang="ts">
import type { CmsBlockProductListing } from "@shopware-pwa/composables-next";
import { useCmsBlock } from "#imports";

const props = defineProps<{
  content: CmsBlockProductListing;
}>();

const { getSlotContent } = useCmsBlock(props.content);
const slotContent = getSlotContent("content");
</script>

<template>
  <div>
    <CmsGenericElement v-if="slotContent" :content="slotContent" />
  </div>
</template>
