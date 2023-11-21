<script setup lang="ts">
import type { CmsBlockText } from "@shopware-pwa/composables-next/composables";
import { useCmsBlock } from "#imports";

const props = defineProps<{
  content: CmsBlockText;
}>();

const { getSlotContent } = useCmsBlock(props.content);

const content = getSlotContent("content");
</script>
<template>
  <CmsGenericElement :content="content" />
</template>
