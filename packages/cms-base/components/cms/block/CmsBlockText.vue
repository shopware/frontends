<script setup lang="ts">
import { CmsBlockText } from "@shopware-pwa/composables-next";

const props = defineProps<{
  content: CmsBlockText;
}>();
</script>
<template>
  <CmsGenericElement
    v-for="slot in content.slots"
    :key="slot.id"
    :content="slot"
  />
</template>
