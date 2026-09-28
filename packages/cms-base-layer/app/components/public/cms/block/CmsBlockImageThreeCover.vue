<script setup lang="ts">
import type { CmsBlockImageThreeCover } from "@shopware/composables";
import { computed } from "vue";

import { useCmsBlock } from "#imports";

const props = defineProps<{
  content: CmsBlockImageThreeCover;
}>();

const { getSlotContent } = useCmsBlock(() => props.content);

const leftContent = computed(() => getSlotContent("left"));
const rightContent = computed(() => getSlotContent("right"));
const centerContent = computed(() => getSlotContent("center"));
</script>
<template>
  <div
    class="cms-block-image-three-cover flex flex-col sm:flex-row justify-start items-start gap-6 w-full"
  >
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

<style scoped>
.cms-block-image-three-cover :deep(.cms-element-image) {
  position: relative;
  aspect-ratio: 1 / 1;
  height: 100%;
  width: 100%;
}

.cms-block-image-three-cover :deep(.cms-element-image img) {
  height: 100%;
  width: 100%;
  object-fit: cover;
}
</style>
