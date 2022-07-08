<script setup lang="ts">
import { CmsBlockTextOnImage } from "@shopware-pwa/composables-next";

const props = defineProps<{
  content: CmsBlockTextOnImage;
}>();

const { getSlotContent } = useCmsBlock(props.content);

const slotContent = getSlotContent("content");

const getBackgroundStyle = computed(() => {
  return `background-image: url('${props.content.backgroundMedia?.url}');`;
});
</script>

<template>
  <article class="min-h-sm bg-center bg-cover p-10" :style="getBackgroundStyle">
    <CmsGenericElement
      v-if="slotContent"
      :content="slotContent"
      class="cms-block-text-on-image__content"
    />
  </article>
</template>
