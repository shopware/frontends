<script setup lang="ts">
import type { CmsElementProductName } from "@shopware/composables";

defineProps<{
  content: CmsElementProductName;
}>();
</script>
<template>
  <!-- there is no css config coming from API for this element so we don't need to merge -->
  <CmsElementText :content="content as any" class="self-stretch justify-start text-surface-on-surface text-4xl font-normal font-['Noto_Serif'] leading-[60px]" />
</template>
