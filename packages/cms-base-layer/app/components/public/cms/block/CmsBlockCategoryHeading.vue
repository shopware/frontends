<script setup lang="ts">
import type { CmsBlockCategoryHeading } from "@shopware/composables";
import { computed } from "vue";

import { useCmsBlock } from "#imports";

const props = defineProps<{
  content: CmsBlockCategoryHeading;
}>();

const { getSlotContent } = useCmsBlock(() => props.content);

const slotContent = computed(() => getSlotContent("content"));
</script>
<template>
  <div class="cms-block-category-heading">
    <CmsGenericElement :content="slotContent" />
  </div>
</template>
