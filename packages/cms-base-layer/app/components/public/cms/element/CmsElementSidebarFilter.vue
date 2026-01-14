<script setup lang="ts">
import type { CmsElementSidebarFilter } from "@shopware/composables";
import { inject } from "vue";

defineProps<{
  content: CmsElementSidebarFilter;
}>();

// Inject layout context from parent section
// If in sidebar section -> use vertical accordion filters
// Otherwise -> use horizontal dropdown filters
const sectionLayout = inject<string>("cms-section-layout", "default");
const isInSidebar = sectionLayout === "sidebar";
</script>
<template>
  <div>
    <SwProductListingFilters v-if="isInSidebar" :content="content" />
    <SwProductListingFiltersHorizontal v-else :content="content" />
  </div>
</template>
