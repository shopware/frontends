<script setup lang="ts">
import type { CmsBlockTextTeaser } from "@shopware-pwa/composables-next/composables";

const props = defineProps<{
  content: CmsBlockTextTeaser;
}>();
</script>
<template>
  <div>
    <CmsGenericElement
      v-for="slot in content.slots"
      :key="slot.id"
      :content="slot"
    />
  </div>
</template>
