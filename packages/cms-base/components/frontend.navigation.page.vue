<script setup lang="ts">
import { Shopware } from "@shopware-pwa/composables-next";

defineProps<{
  cmsPage: Shopware.CmsPage;
}>();
</script>

<template>
  <CmsPage :content="cmsPage" />
</template>
