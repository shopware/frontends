<script setup lang="ts">
import type { CmsBlockHtml } from "@shopware/composables";

import { getCmsLayoutConfiguration } from "@shopware/helpers";

const props = defineProps<{
  content: CmsBlockHtml;
}>();

const { cssClasses, layoutStyles } = getCmsLayoutConfiguration(props.content);
</script>
<template>
   <div :class="cssClasses" v-html="props.content.slots[0].data.content || ''" :style="layoutStyles"  > </div>
</template>