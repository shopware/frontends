<script setup lang="ts">
import type { CmsElementProductName } from "@shopware-pwa/composables-next";

const props = defineProps<{
  content: CmsElementProductName;
}>();
</script>
<template>
  <CmsElementText :content="content as any" />
</template>
