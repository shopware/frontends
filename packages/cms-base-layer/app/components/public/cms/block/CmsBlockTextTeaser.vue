<script setup lang="ts">
import type { CmsBlockTextTeaser } from "@shopware/composables";

defineProps<{
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
