<script setup lang="ts">
import type { CmsBlockProductThreeColumn } from "@shopware/composables";
import { computed } from "vue";

import { useCmsBlock } from "#imports";

const props = defineProps<{
  content: CmsBlockProductThreeColumn;
}>();

const { getSlotContent } = useCmsBlock(() => props.content);

const leftContent = computed(() => getSlotContent("left"));
const rightContent = computed(() => getSlotContent("right"));
const centerContent = computed(() => getSlotContent("center"));
</script>

<template>
  <div class="flex flex-col sm:flex-row justify-start items-start gap-6 w-full">
    <div class="w-full sm:flex-1">
      <CmsGenericElement :content="leftContent" class="w-full" />
    </div>
    <div class="w-full sm:flex-1">
      <CmsGenericElement :content="centerContent" class="w-full" />
    </div>
    <div class="w-full sm:flex-1">
      <CmsGenericElement :content="rightContent" class="w-full" />
    </div>
  </div>
</template>
