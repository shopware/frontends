<script setup lang="ts">
import type { CmsBlockImageThreeColumn } from "@shopware/composables";

import { computed, useCmsBlock } from "#imports";

const props = defineProps<{
  content: CmsBlockImageThreeColumn;
}>();

// A getter keeps the lookups pointed at the current block, and a computed
// re-runs the lookup when that block is replaced.
const { getSlotContent } = useCmsBlock(() => props.content);

const leftContent = computed(() => getSlotContent("left"));
const rightContent = computed(() => getSlotContent("right"));
const centerContent = computed(() => getSlotContent("center"));
</script>
<template>
  <div class="grid grid-cols-3">
    <CmsGenericElement :content="leftContent" />
    <CmsGenericElement :content="centerContent" />
    <CmsGenericElement :content="rightContent" />
  </div>
</template>
