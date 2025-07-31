<script setup lang="ts">
import type { CmsBlockForm } from "@shopware/composables";
import { useCmsBlock } from "#imports";

const props = defineProps<{
  content: CmsBlockForm;
}>();

const { getSlotContent } = useCmsBlock(props.content);

const cmsContent = getSlotContent("content");
</script>
<template>
  <div class="cms-block-form">
    <CmsGenericElement v-if="cmsContent" :content="cmsContent" />
  </div>
</template>
