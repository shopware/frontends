<script setup lang="ts">
import { CmsSlot } from "@shopware-pwa/commons";

const props = defineProps<{
  content: CmsSlot;
}>();
</script>

<template>
  <img class="h-full w-full" :src="content.data?.media?.url" />
</template>
