<script setup lang="ts">
import type { CmsBlockText } from "@shopware-pwa/composables-next";
import { useCmsBlock } from "#imports";

const props = defineProps<{
  content: CmsBlockText;
}>();

const { getSlotContent } = useCmsBlock(props.content);

const slotContent = getSlotContent("content");
</script>
<template>
  <CmsGenericElement :content="slotContent" />
</template>
