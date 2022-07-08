<script setup lang="ts">
import { CmsBlockImage } from "@shopware-pwa/composables-next";

const props = defineProps<{
  content: CmsBlockImage;
}>();
</script>
<template>
  <CmsGenericElement
    v-for="slot in content.slots"
    :key="slot.id"
    :content="slot"
  />
</template>
