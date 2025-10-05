<script setup lang="ts">
import type { CmsBlockImage } from "@shopware/composables";
import { useCmsBlock } from "#imports";

const props = defineProps<{
  content: CmsBlockImage;
}>();

const { getSlotContent } = useCmsBlock(props.content);
const imageContent = getSlotContent("image");
</script>
<template>
  <div>
    <CmsGenericElement :content="imageContent" />
  </div>
</template>
