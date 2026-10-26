<script setup lang="ts">
import type { CmsBlockCategoryNavigation } from "@shopware/composables";
import { computed } from "vue";

import { useCmsBlock } from "#imports";

const props = defineProps<{
  content: CmsBlockCategoryNavigation;
}>();
const { getSlotContent } = useCmsBlock(() => props.content);
const slotContent = computed(() => getSlotContent("content"));
</script>

<template>
  <div>
    <CmsGenericElement v-if="slotContent" :content="slotContent" />
  </div>
</template>
