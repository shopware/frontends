<script setup lang="ts">
import type { CmsSectionDefault } from "@shopware-pwa/composables-next/composables";

defineProps<{
  content: CmsSectionDefault;
}>();
</script>

<template>
  <div class="cms-section-default">
    <CmsGenericBlock
      v-for="cmsBlock in content.blocks"
      class="overflow-auto"
      :key="cmsBlock.id"
      :content="cmsBlock"
    />
  </div>
</template>
