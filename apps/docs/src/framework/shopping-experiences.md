---
head:
  - - meta
    - name: og:title
      content: Shopping Experiences
  - - meta
    - name: og:description
      content: "This guide will discuss how to use and customize Shopping Experiences in your Shopware Frontends project."
  - - meta
    - name: og:image
      content: "https://frontends-og-image.vercel.app/Shopping%20Experiences?fontSize=150px"
---

# Shopping Experiences

This guide will discuss how to use and customize Shopping Experiences in your Shopware Frontends project.

## How it works

Shopping Experiences are implemented as a dedicated package that you can install in your project.

If your project ist based on the [Demo Store Template](../getting-started/templates/demo-store-template.md), that package is already installed. In that case, you probably want to know how to [customize CMS components](#customize-components).

## Customize Components

In order to customize a component, you need to override it. The process is the same regardless what type of component you want to override

- Sections
- Blocks
- Elements

To do so, you need to create a file with the same name as the component in the `components/cms` directory.

```json
demo-store/
├─ components/
|  ├─ cms/
|  ├─ ├─ CmsBlockImageHighlightRow.vue
```

Now the CMS module will automatically resolve that file based on the name and you can start writing your component.

## Override Elements

Start with importing the correct element type from the `composables-next` pacakge and using it in the `defineProps` method to define the type of your `content` property:

```vue
<!-- components/cms/CmsElementImage.vue -->

<script setup lang="ts">
import { CmsElementImage } from "@shopware-pwa/composables-next";

const props = defineProps<{
  content: CmsElementImage;
}>();
</script>
```

Now, you can use `props.content` to access all properties of the element in your template.

```vue{8}
<!-- components/cms/CmsElementImage.vue -->

<script setup lang="ts">
// see above
</script>

<template>
    <img :src="props.content.data.media.url" />
</template>
```

However, for some elements the configuration can be quite complex, so there are composables to give you a hand:

```vue{10-14,18-20}
<!-- components/cms/CmsElementImage.vue -->

<script setup lang="ts">
import { CmsElementImage, useCmsElementImage } from "@shopware-pwa/composables-next";

const props = defineProps<{
    content: CmsElementImage
}>();

const {
    containerStyle, // padding, background-color etc.
    displayMode, // cover, contain, stretch etc.
    imageAttrs, // automatically resolves src, alt and srcset attributes
} = useCmsElementImage(props.content);
</script>

<template>
    <div :style="containerStyle">
        <img v-bind="imageAttrs"/>
    </div>
</template>
```

## Override Blocks

Make sure, you've created a new file as described in [the introduction](#customize-components).

Next, import the correct type for your block and use it to define the `content` property:

```vue
<!-- components/cms/CmsBlockImageThreeColumn.vue -->
<script setup lang="ts">
import { CmsBlockImageThreeColumn } from "@shopware-pwa/composables-next";

const props = defineProps<{
  content: CmsBlockImageThreeColumn;
}>();
</script>
```

### Slots

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
import { CmsBlockImageThreeColumn } from "@shopware-pwa/composables-next";

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
