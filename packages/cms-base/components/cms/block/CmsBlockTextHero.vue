<script setup lang="ts">
import { CmsBlockTextHero } from "@shopware-pwa/composables-next";

const props = defineProps<{
  content: CmsBlockTextHero;
}>();
</script>
<template>
  <CmsGenericElement
    v-for="slot in content.slots"
    :key="slot.id"
    :content="slot"
  />
</template>
