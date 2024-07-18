<script setup lang="ts">
import type { CmsSectionDefault } from "@shopware-pwa/composables-next";
import { getCmsLayoutConfiguration } from "@shopware-pwa/helpers-next";

const props = defineProps<{
  content: CmsSectionDefault;
}>();

const { cssClasses, layoutStyles } = getCmsLayoutConfiguration(props.content);
</script>

<template>
  <div class="cms-section-default" :class="cssClasses" :styles="layoutStyles">
    <CmsGenericBlock
      v-for="cmsBlock in content.blocks"
      :key="cmsBlock.id"
      class="overflow-auto"
      :content="cmsBlock"
    />
  </div>
</template>
