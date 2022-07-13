<script setup lang="ts">
import { CmsElementSidebarFilter } from "@shopware-pwa/composables-next";

const props = defineProps<{
  content: CmsElementSidebarFilter;
}>();
</script>
<template>
  <div class="container mx-auto sm:py-4">
    <SwProductListingFilters :content="content" />
  </div>
</template>
