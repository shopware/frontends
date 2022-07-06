<script setup lang="ts">
import { CmsBlockImageText } from "@shopware-pwa/composables-next";

const props = defineProps<{
  content: CmsBlockImageText;
}>();

const { getSlotContent } = useCmsBlock(props.content);

const leftContent = getSlotContent("left");
const rightContent = getSlotContent("right");
</script>
<template>
  <div class="flex flex-col md:flex-row container mx-auto mb-8 mt-8">
    <div class="md:basis-1/2 self-center">
      <CmsGenericElement :content="leftContent" />
    </div>
    <div class="md:basis-1/2 md:pl-8">
      <CmsGenericElement :content="rightContent" />
    </div>
  </div>
</template>
