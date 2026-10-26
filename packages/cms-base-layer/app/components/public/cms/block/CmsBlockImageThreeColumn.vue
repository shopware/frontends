<script setup lang="ts">
import type { CmsBlockImageThreeColumn } from "@shopware/composables";
import { computed } from "vue";

import { useCmsBlock } from "#imports";

const props = defineProps<{
  content: CmsBlockImageThreeColumn;
}>();

const { getSlotContent } = useCmsBlock(() => props.content);

const leftContent = computed(() => getSlotContent("left"));
const rightContent = computed(() => getSlotContent("right"));
const centerContent = computed(() => getSlotContent("center"));
</script>
<template>
  <div class="flex flex-col sm:flex-row justify-start items-start gap-6 w-full">
    <div class="w-full sm:flex-1">
      <CmsGenericElement :content="leftContent" />
    </div>
    <div class="w-full sm:flex-1">
      <CmsGenericElement :content="centerContent" />
    </div>
    <div class="w-full sm:flex-1">
      <CmsGenericElement :content="rightContent" />
    </div>
  </div>
</template>
