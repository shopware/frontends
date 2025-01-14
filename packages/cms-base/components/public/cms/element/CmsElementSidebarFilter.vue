<script setup lang="ts">
import type { CmsElementSidebarFilter } from "@shopware-pwa/composables-next";

defineProps<{
  content: CmsElementSidebarFilter;
}>();
</script>
<template>
  <div class="max-w-screen-xl mx-auto">
    <SwProductListingFilters :content="content" />
  </div>
</template>
