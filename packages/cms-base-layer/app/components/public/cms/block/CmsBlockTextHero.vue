<script setup lang="ts">
import type { CmsBlockTextHero } from "@shopware/composables";
import { computed } from "vue";

import { useCmsBlock } from "#imports";

const props = defineProps<{
  content: CmsBlockTextHero;
}>();

const { getSlotContent } = useCmsBlock(() => props.content);

const slotContent = computed(() => getSlotContent("content"));
</script>
<template>
  <CmsGenericElement :content="slotContent" />
</template>
