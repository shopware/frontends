<script setup lang="ts">
import type { CmsBlockCenterText } from "@shopware/composables";
import { computed } from "vue";

import { useCmsBlock } from "#imports";

const props = defineProps<{
  content: CmsBlockCenterText;
}>();

const { getSlotContent } = useCmsBlock(() => props.content);
const slotLeftContent = computed(() => getSlotContent("left"));
const slotRightContent = computed(() => getSlotContent("right"));
const slotCenterContent = computed(() => getSlotContent("center"));
</script>
<template>
  <div class="cms-block-center-text grid md:grid-cols-3 gap-10 content-center">
    <CmsGenericElement :content="slotLeftContent" />
    <CmsGenericElement :content="slotCenterContent" />
    <CmsGenericElement :content="slotRightContent" />
  </div>
</template>

<style scoped>
.cms-block-center-text .cms-element-image {
  align-self: stretch;
  min-height: 3rem;
}
</style>
