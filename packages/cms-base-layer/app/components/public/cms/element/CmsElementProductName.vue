<script setup lang="ts">
import type { CmsElementProductName } from "@shopware/composables";

defineProps<{
  content: CmsElementProductName;
}>();
</script>
<template>
  <CmsElementText :content="content as any" />
</template>
