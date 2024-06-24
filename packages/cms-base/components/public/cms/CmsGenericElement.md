Renders an Element type structure

Example usage:

```vue{19,22}
<script setup lang="ts">
import type { CmsBlockGalleryBuybox } from "@shopware-pwa/composables-next";
import { useCmsBlock } from "#imports";

const props = defineProps<{
  content: CmsBlockGalleryBuybox;
}>();

const { getSlotContent } = useCmsBlock(props.content);
const rightContent = getSlotContent("right");
const leftContent = getSlotContent("left");
</script>

<template>
  <div
    class="lg:container mx-auto flex flex-col lg:flex-row gap-10 justify-center"
  >
    <div class="overflow-hidden basis-4/6">
      <CmsGenericElement :content="leftContent" />
    </div>
    <div class="basis-2/6">
      <CmsGenericElement :content="rightContent" />
    </div>
  </div>
</template>
```
