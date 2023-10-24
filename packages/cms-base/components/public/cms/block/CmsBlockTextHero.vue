<script setup lang="ts">
import type { CmsBlockTextHero } from "@shopware-pwa/composables-next";

const props = defineProps<{
  content: CmsBlockTextHero;
}>();

const { getSlotContent } = useCmsBlock(props.content);

const content = getSlotContent("content");
</script>
<template>
  <CmsGenericElement :content="content" />
</template>
