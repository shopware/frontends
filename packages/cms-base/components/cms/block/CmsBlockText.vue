<script setup lang="ts">
import { CmsBlockText } from "@shopware-pwa/composables-next";

const props = defineProps<{
  content: CmsBlockText;
}>();

const { getSlotContent } = useCmsBlock(props.content);

const content = getSlotContent("content");
</script>
<template>
  <CmsGenericElement :content="content" />
</template>
