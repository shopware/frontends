<script setup lang="ts">
import { CmsElementProductName } from "@shopware-pwa/composables-next";
import CmsElementText from "./CmsElementText.vue";

const props = defineProps<{
  content: CmsElementProductName;
}>();
</script>
<template>
  <CmsElementText :content="content" />
</template>
