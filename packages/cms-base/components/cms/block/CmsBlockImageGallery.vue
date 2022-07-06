<script setup lang="ts">
import { CmsBlock } from "@shopware-pwa/commons";

const props = defineProps<{
  content: CmsBlock;
}>();

const { getSlotContent } = useCmsBlock(props.content);

const cmsContent = getSlotContent("slot");
</script>

<template>
  <div class="container mx-auto">
    <CmsGenericElement :content="cmsContent" />
  </div>
</template>
