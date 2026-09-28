Renders an Element type structure.

`content` is optional: `getSlotContent()` returns `undefined` for a slot the block
does not carry, and this component renders nothing in that case.

Example usage:

```vue{22,25}
<script setup lang="ts">
import type { CmsBlockGalleryBuybox } from "@shopware/composables";
import { computed } from "vue";
import { useCmsBlock } from "#imports";

const props = defineProps<{
  content: CmsBlockGalleryBuybox;
}>();

// Pass a getter so the lookups follow a replaced block, and read them through
// computeds so each one re-runs when it does.
const { getSlotContent } = useCmsBlock(() => props.content);
const rightContent = computed(() => getSlotContent("right"));
const leftContent = computed(() => getSlotContent("left"));
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
