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
</script>

<template>
  <div class="cms-section-default">
    <CmsGenericBlock
      v-for="cmsBlock in blocks"
      class="overflow-auto"
      :key="cmsBlock.id"
      :content="cmsBlock"
    />
  </div>
</template>
