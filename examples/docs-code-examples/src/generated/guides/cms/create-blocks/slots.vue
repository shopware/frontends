<!-- components/cms/CmsBlockImageThreeColumn.vue -->
<script setup lang="ts">
import type { CmsBlockImageThreeColumn } from "@shopware/composables";

import { useCmsBlock } from "#imports";

const props = defineProps<{
  content: CmsBlockImageThreeColumn;
}>();

const { getSlotContent } = useCmsBlock(props.content);

const leftContent = getSlotContent("left");
const centerContent = getSlotContent("center");
const rightContent = getSlotContent("right");
</script>

<template>
  <div class="grid grid-cols-3">
    <CmsGenericElement :content="leftContent" />
    <CmsGenericElement :content="centerContent" />
    <CmsGenericElement :content="rightContent" />
  </div>
</template>
