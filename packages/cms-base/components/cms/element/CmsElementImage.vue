<script setup lang="ts">
import { CmsSlot } from "@shopware-pwa/commons";

const props = defineProps<{
  content: CmsSlot;
}>();
</script>

<template>
  <img :src="content.data?.media?.url" />
</template>
