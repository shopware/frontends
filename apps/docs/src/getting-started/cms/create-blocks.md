---
head:
  - - meta
    - name: og:title
      content: Create Blocks (CMS)
  - - meta
    - name: og:description
      content: "In this chapter you will learn how to create CMS blocks."
  - - meta
    - name: og:image
      content: "https://frontends-og-image.vercel.app/Create%20Blocks.png?fontSize=120px"
nav:
  position: 30
---

# Create Blocks (CMS)

Make sure, you've created a new file as described in [customize components](customize-components.html#create-new-files).

Next, import the correct type for your block and use it to define the `content` property:

```vue
<!-- components/cms/CmsBlockImageThreeColumn.vue -->
<script setup lang="ts">
import { CmsBlockImageThreeColumn } from "@shopware/composables";

const props = defineProps<{
  content: CmsBlockImageThreeColumn;
}>();
</script>
```

## Slots

:::info Only for `cms-base` package
Also here, if you are not using the `cms-base` package, you have to come up with your own implementation of a generic component that handles the slot resolution. In that case, please ignore the mentions of `CmsGenericElement`.
:::

Since blocks are usually layouts, they have slots which can be filled with dynamic content - CMS elements. Since blocks are flexible, the specific type of the element is not known in advance.

For that reason, there's a generic element `CmsGenericElement` which can be placed in every slot. It receives the `content` configuration as its only prop.

Let's build the `image-three-column` block, which has three slots - `left`, `center` and `right`.

```vue{4-15}
<!-- components/cms/CmsBlockImageThreeColumn.vue -->
<template>
    <div class="grid grid-cols-3">
        <CmsGenericElement
            :content="props.content.slots.filter(
                (slot) => slot.slot === 'left')
            " />
        <CmsGenericElement
            :content="props.content.slots.filter(
                (slot) => slot.slot === 'center')
            " />
        <CmsGenericElement
            :content="props.content.slots.filter(
                (slot) => slot.slot === 'right')
            " />
    </div>
</template>
```

That works, but it's quite repetiive and hard to read. So we can use another composable `useCmsBlock` which makes our lives way easier.

```vue{8,10-12,16-18}
<script setup lang="ts">
import { CmsBlockImageThreeColumn } from "@shopware/composables";

const props = defineProps<{
  content: CmsBlockImageThreeColumn;
}>();

const { getSlotContent } = useCmsBlock(props.content);

const leftContent = getSlotContent("left");
const rightContent = getSlotContent("right");
const centerContent = getSlotContent("center");
</script>
<template>
    <div class="grid grid-cols-3">
        <CmsGenericElement :content="leftContent" />
        <CmsGenericElement :content="centerContent" />
        <CmsGenericElement :content="rightContent" />
    </div>
</template>
```

No you can go ahead and override blocks and elements step by step.
