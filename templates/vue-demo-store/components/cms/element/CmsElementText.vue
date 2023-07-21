<script setup lang="ts">
import { CmsElementText } from "@shopware-pwa/composables-next";

const props = defineProps<{
  content: CmsElementText;
}>();

</script>
<template>
  <div v-html="props.content?.data?.content">
  </div>
</template>

<!-- <style>
// @import "@/cms/settings.scss";

// .cms-element-text {
//   @include sizing-mode-boxed;
//   padding: var(--spacer-xl);
// }
</style> -->
