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

Create the file under a directory registered with `global: true` — `app/components/cms/` in `vue-starter-template` — as [Overwrite CMS components](overwriting-cms.html#where-the-file-goes) explains.

Next, import the correct type for your block and use it to define the `content` property:

<!-- automd:file src="examples/docs-code-examples/src/generated/guides/cms/create-blocks/example.vue" code lang="vue" no-name -->

```vue
<!-- app/components/cms/CmsBlockImageThreeColumn.vue -->
<script setup lang="ts">
import type { CmsBlockImageThreeColumn } from "@shopware/composables";

const props = defineProps<{
  content: CmsBlockImageThreeColumn;
}>();
</script>
```

<!-- /automd -->

## Slots

:::info Only for `cms-base` package
Also here, if you are not using the `cms-base` package, you have to come up with your own implementation of a generic component that handles the slot resolution. In that case, please ignore the mentions of `CmsGenericElement`.
:::

Since blocks are usually layouts, they have slots which can be filled with dynamic content - CMS elements. Since blocks are flexible, the specific type of the element is not known in advance.

For that reason, there's a generic element `CmsGenericElement` which can be placed in every slot. It receives the `content` configuration as its only prop.

Let's build the `image-three-column` block, which has three slots - `left`, `center` and `right`.

<!-- automd:file src="examples/docs-code-examples/src/generated/guides/cms/create-blocks/slots-2.vue" code lang="vue{12,14-16,20-22}" no-name -->

```vue{12,14-16,20-22}
<script setup lang="ts">
import type { CmsBlockImageThreeColumn } from "@shopware/composables";

import { computed, useCmsBlock } from "#imports";

const props = defineProps<{
  content: CmsBlockImageThreeColumn;
}>();

// A getter keeps the lookups pointed at the current block, and a computed
// re-runs the lookup when that block is replaced.
const { getSlotContent } = useCmsBlock(() => props.content);

const leftContent = computed(() => getSlotContent("left"));
const rightContent = computed(() => getSlotContent("right"));
const centerContent = computed(() => getSlotContent("center"));
</script>
<template>
  <div class="grid grid-cols-3">
    <CmsGenericElement :content="leftContent" />
    <CmsGenericElement :content="centerContent" />
    <CmsGenericElement :content="rightContent" />
  </div>
</template>
```

<!-- /automd -->

Now you can go ahead and override blocks and elements step by step. The [Rendering CMS Pages recipe](../../frontends-recipes/cms/rendering.html) explains how a block's `content` reaches this component, and why the getter and the `computed` matter.
