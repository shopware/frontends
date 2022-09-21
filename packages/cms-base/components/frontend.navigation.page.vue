<script setup lang="ts">
import type { CmsPage } from "@shopware-pwa/types";

defineProps<{
  cmsPage: CmsPage;
}>();
</script>

<template>
  <CmsPage :content="cmsPage" />
</template>
