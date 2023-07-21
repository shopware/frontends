<script setup lang="ts">
import { CmsElementSidebarFilter } from "@shopware-pwa/composables-next";
import SwProductListingFilters from "../../SwProductListingFilters.vue";

const props = defineProps<{
  content: CmsElementSidebarFilter;
}>();
</script>
<template>
  <div class="">
    <SwProductListingFilters :content="content" />
  </div>
</template>
