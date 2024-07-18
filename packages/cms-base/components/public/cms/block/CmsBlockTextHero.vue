<script setup lang="ts">
import type { CmsBlockTextHero } from "@shopware-pwa/composables-next";
import { useCmsBlock } from "#imports";

const props = defineProps<{
  content: CmsBlockTextHero;
}>();

const { getSlotContent } = useCmsBlock(props.content);

const slotContent = getSlotContent("content");
</script>
<template>
  <CmsGenericElement :content="slotContent" />
</template>
