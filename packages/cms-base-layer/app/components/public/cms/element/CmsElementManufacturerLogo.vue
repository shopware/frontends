<script setup lang="ts">
import type { CmsElementManufacturerLogo } from "@shopware/composables";
import CmsElementImage from "./CmsElementImage.vue";

defineProps<{
  content: CmsElementManufacturerLogo;
}>();
</script>
<template>
  <CmsElementImage :content="content" />
</template>
