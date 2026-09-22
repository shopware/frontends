<script setup lang="ts">
import type { CmsBlockText } from "@shopware/composables";
import { computed } from "vue";

import { useCmsBlock } from "#imports";

const props = defineProps<{
  content: CmsBlockText;
}>();

const { getSlotContent } = useCmsBlock(() => props.content);

const slotContent = computed(() => getSlotContent("content"));
</script>
<template>
  <CmsGenericElement :content="slotContent" />
</template>
