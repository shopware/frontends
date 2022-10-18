<script setup lang="ts">
import { CmsBlockCategoryNavigation } from "@shopware-pwa/composables-next";

const props = defineProps<{
  content: CmsBlockCategoryNavigation;
}>();
const { getSlotContent } = useCmsBlock(props.content);
const slotContent = getSlotContent("content");
</script>

<template>
  <div>
    <CmsGenericElement v-if="slotContent" :content="slotContent" />
  </div>
</template>
