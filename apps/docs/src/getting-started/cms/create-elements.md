---
head:
  - - meta
    - name: og:title
      content: Create Elements (CMS)
  - - meta
    - name: og:description
      content: "In this chapter you will learn how to create CMS elements."
  - - meta
    - name: og:image
      content: "https://frontends-og-image.vercel.app/Create%20Elements.png?fontSize=120px"
nav:
  position: 30
---

# Create Elements (CMS)

Start with importing the correct element type from the `composables-next` package and using it in the `defineProps` method to define the type of your `content` property:

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
