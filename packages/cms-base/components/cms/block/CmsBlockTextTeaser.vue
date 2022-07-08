<script setup lang="ts">
import { CmsBlockTextTeaser } from "@shopware-pwa/composables-next";

const props = defineProps<{
  content: CmsBlockTextTeaser;
}>();
</script>
<template>
  <CmsGenericElement
    v-for="slot in content.slots"
    :key="slot.id"
    :content="slot"
  />
</template>
