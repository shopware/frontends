<script setup lang="ts">
import type { CmsBlockProductHeading } from "@shopware/composables";
import { computed } from "vue";

import { useCmsBlock } from "#imports";

const props = defineProps<{
  content: CmsBlockProductHeading;
}>();

const { getSlotContent } = useCmsBlock(() => props.content);

const leftContent = computed(() => getSlotContent("left"));
const rightContent = computed(() => getSlotContent("right"));
</script>

<template>
  <div class="cms-block-product-heading flex justify-between pt-4">
    <CmsGenericElement :content="leftContent" />
    <CmsGenericElement :content="rightContent" />
  </div>
</template>

<style scoped>
.cms-block-product-heading .cms-element-image {
  max-height: 7.5rem;
  max-width: 7.5rem;
}
</style>
