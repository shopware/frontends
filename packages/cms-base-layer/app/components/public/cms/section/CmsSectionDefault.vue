<script setup lang="ts">
import type { CmsSectionDefault } from "@shopware/composables";
import { getCmsLayoutConfiguration } from "@shopware/helpers";

const props = defineProps<{
  content: CmsSectionDefault;
}>();

const { cssClasses, layoutStyles } = getCmsLayoutConfiguration(props.content);
</script>

<template>
  <div >
    <CmsGenericBlock
      v-for="cmsBlock in content.blocks"
      :key="cmsBlock.id"
      class="overflow-auto my-4"
      :content="cmsBlock"
    />
  </div>
</template>
