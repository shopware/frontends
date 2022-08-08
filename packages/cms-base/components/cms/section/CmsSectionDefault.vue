<script setup lang="ts">
import {
  CmsSectionDefault,
  useCmsSection,
} from "@shopware-pwa/composables-next";

const props = defineProps<{
  content: CmsSectionDefault;
}>();

const { getPositionContent } = useCmsSection<CmsSectionDefault>(props.content);

const blocks = getPositionContent("main");

let boxedSizing = computed(() => props.content.sizingMode === "boxed");
</script>

<template>
  <div class="cms-section-default">
    <CmsGenericBlock
      v-for="cmsBlock in blocks"
      :key="cmsBlock.id"
      :content="cmsBlock"
      class="overflow-auto bg-center bg-cover"
      :class="[boxedSizing ? ['max-w-screen-xl', 'mx-auto'] : '']"
    />
  </div>
</template>
