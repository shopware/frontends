<script setup lang="ts">
import type { CmsElementManufacturerLogo } from "@shopware-pwa/composables-next/composables";
import CmsElementImage from "./CmsElementImage.vue";

const props = defineProps<{
  content: CmsElementManufacturerLogo;
}>();
</script>
<template>
  <CmsElementImage :content="content" />
</template>
