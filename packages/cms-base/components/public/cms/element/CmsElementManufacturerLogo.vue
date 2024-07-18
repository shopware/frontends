<script setup lang="ts">
import type { CmsElementManufacturerLogo } from "@shopware-pwa/composables-next";
import CmsElementImage from "./CmsElementImage.vue";

defineProps<{
  content: CmsElementManufacturerLogo;
}>();
</script>
<template>
  <CmsElementImage :content="content" />
</template>
