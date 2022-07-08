<script setup lang="ts">
import { CmsBlockForm } from "@shopware-pwa/composables-next";

const props = defineProps<{
  content: CmsBlockForm;
}>();

const { getSlotContent } = useCmsBlock(props.content);

const cmsContent = getSlotContent("content");
</script>
<template>
  <CmsGenericElement v-if="cmsContent" :content="cmsContent" />
</template>
