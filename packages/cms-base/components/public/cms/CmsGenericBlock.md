Renders a Block type structure

Example usage:

```vue{14-19}
<script setup lang="ts">
import type { CmsSectionDefault } from "@shopware-pwa/composables-next";
import { getCmsLayoutConfiguration } from "@shopware-pwa/helpers-next";

const props = defineProps<{
  content: CmsSectionDefault;
}>();

const { cssClasses, layoutStyles } = getCmsLayoutConfiguration(props.content);
</script>

<template>
  <div class="cms-section-default" :class="cssClasses" :styles="layoutStyles">
    <CmsGenericBlock
      v-for="cmsBlock in content.blocks"
      class="overflow-auto"
      :key="cmsBlock.id"
      :content="cmsBlock"
    />
  </div>
</template>
```