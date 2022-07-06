<script setup lang="ts">
import { CmsSlot } from "@shopware-pwa/commons";

const props = defineProps<{
  content: CmsSlot;
}>();
</script>
<template>
  <div class="container mx-auto sm:py-4">
    <SwProductListingFilters :content="content" />
  </div>
</template>
