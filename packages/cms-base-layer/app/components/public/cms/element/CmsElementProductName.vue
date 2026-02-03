<script setup lang="ts">
import type { CmsElementProductName } from "@shopware/composables";

defineProps<{
  content: CmsElementProductName;
}>();
</script>
<template>
  <!-- there is no css config coming from API for this element so we don't need to merge -->
  <h1>
    <CmsElementText
      :content="content as any"
      class="self-stretch text-surface-on-surface text-4xl font-normal font-serif leading-[60px]"
    />
  </h1>
</template>
