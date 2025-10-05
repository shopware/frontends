<script setup lang="ts">
import type { CmsBlockHtml } from "@shopware/composables";

defineProps<{
  content: CmsBlockHtml;
}>();
</script>

<template>
  <div>
    <CmsGenericElement
      v-for="slot in content.slots"
      :key="slot.versionId"
      :content="slot"
    />
  </div>
</template>
