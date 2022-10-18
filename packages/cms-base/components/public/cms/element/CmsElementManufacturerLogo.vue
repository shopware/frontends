<script setup lang="ts">
import { CmsElementManufacturerLogo } from "@shopware-pwa/composables-next";
import CmsElementImage from "./CmsElementImage.vue";

const props = defineProps<{
  content: CmsElementManufacturerLogo;
}>();
</script>
<template>
  <CmsElementImage :content="content" />
</template>
