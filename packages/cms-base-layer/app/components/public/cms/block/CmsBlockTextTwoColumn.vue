<script setup lang="ts">
import type { CmsBlockTextTwoColumn } from "@shopware/composables";
import { computed } from "vue";

import { useCmsBlock } from "#imports";

const props = defineProps<{
  content: CmsBlockTextTwoColumn;
}>();

const { getSlotContent } = useCmsBlock(() => props.content);

const leftContent = computed(() => getSlotContent("left"));
const rightContent = computed(() => getSlotContent("right"));
</script>

<template>
  <article
    class="cms-block-text-two-column grid md:grid-cols-2 gap-5 md:gap-20"
  >
    <CmsGenericElement
      :content="leftContent"
      class="cms-block-text-two-column__text"
    />
    <CmsGenericElement
      :content="rightContent"
      class="cms-block-text-two-column__text"
    />
  </article>
</template>
