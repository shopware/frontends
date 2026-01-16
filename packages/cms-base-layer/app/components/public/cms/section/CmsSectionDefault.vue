<script setup lang="ts">
import type { CmsSectionDefault } from "@shopware/composables";
import { getCmsLayoutConfiguration } from "@shopware/helpers";

const props = defineProps<{
  content: CmsSectionDefault;
}>();

const { cssClasses, layoutStyles } = getCmsLayoutConfiguration(props.content);
</script>

<template>
  <div class="my-4" :class="cssClasses" :style="layoutStyles as any">
    <CmsGenericBlock
      v-for="cmsBlock in content.blocks"
      :key="cmsBlock.id"
      :content="cmsBlock"
    />
  </div>
</template>
