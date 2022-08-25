<script setup lang="ts">
import { CmsBlockTextTeaser } from "@shopware-pwa/composables-next";

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
