<script setup lang="ts">
import { CmsSectionDefault } from "@shopware-pwa/composables-next";

const props = defineProps<{
  content: CmsSectionDefault;
}>();
</script>

<template>
  <div class="cms-section-default">
    <CmsGenericBlock
      v-for="cmsBlock in content.blocks"
      :key="cmsBlock.id"
      :content="cmsBlock"
    />
  </div>
</template>
