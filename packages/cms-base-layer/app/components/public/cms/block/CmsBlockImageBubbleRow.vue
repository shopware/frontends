<script setup lang="ts">
import type { CmsBlockImageBubbleRow } from "@shopware/composables";
import { computed } from "vue";

import { useCmsBlock } from "#imports";

const props = defineProps<{
  content: CmsBlockImageBubbleRow;
}>();

const { getSlotContent } = useCmsBlock(() => props.content);

const leftContent = computed(() => getSlotContent("left"));
const rightContent = computed(() => getSlotContent("right"));
const centerContent = computed(() => getSlotContent("center"));
</script>
<template>
  <div
    class="cms-block-image-bubble-row flex flex-col sm:flex-row justify-start items-start gap-6 w-full"
  >
    <div class="w-full sm:flex-1 flex items-center justify-center">
      <CmsGenericElement :content="leftContent" class="w-full" />
    </div>
    <div class="w-full sm:flex-1 flex items-center justify-center">
      <CmsGenericElement :content="centerContent" class="w-full" />
    </div>
    <div class="w-full sm:flex-1 flex items-center justify-center">
      <CmsGenericElement :content="rightContent" class="w-full" />
    </div>
  </div>
</template>
<style scoped>
.cms-block-image-bubble-row :deep(.cms-element-image) {
  aspect-ratio: 1 / 1;
  max-width: 20rem;
  overflow: hidden;
  border-radius: 9999px;
  object-fit: cover;
}
</style>
