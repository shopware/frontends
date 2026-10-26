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

Start with importing the correct element type from the `@shopware/composables` package and using it in the `defineProps` method to define the type of your `content` property:

<!-- automd:file src="examples/docs-code-examples/src/generated/guides/cms/create-elements/example.vue" code lang="vue" no-name -->

```vue
<!-- app/components/cms/CmsElementImage.vue -->

<script setup lang="ts">
import type { CmsElementImage } from "@shopware/composables";

const props = defineProps<{
  content: CmsElementImage;
}>();
</script>
```

<!-- /automd -->

Now, you can use `props.content` to access all properties of the element in your template.

<!-- automd:file src="examples/docs-code-examples/src/generated/guides/cms/create-elements/example-2.vue" code lang="vue{12}" no-name -->

```vue{12}
<!-- app/components/cms/CmsElementImage.vue -->

<script setup lang="ts">
import type { CmsElementImage } from "@shopware/composables";

const props = defineProps<{
  content: CmsElementImage;
}>();
</script>

<template>
  <img :src="props.content.data.media.url" />
</template>
```

<!-- /automd -->

However, for some elements the configuration can be quite complex, so there are composables to give you a hand:

<!-- automd:file src="examples/docs-code-examples/src/generated/guides/cms/create-elements/example-3.vue" code lang="vue{11-15,19-21}" no-name -->

```vue{11-15,19-21}
<!-- app/components/cms/CmsElementImage.vue -->

<script setup lang="ts">
import { useCmsElementImage } from "@shopware/composables";
import type { CmsElementImage } from "@shopware/composables";

const props = defineProps<{
  content: CmsElementImage;
}>();

const {
  containerStyle,
  displayMode, // cover, contain, stretch etc.
  imageAttrs, // automatically resolves src, alt and srcset attributes
} = useCmsElementImage(props.content);
</script>

<template>
  <div :style="containerStyle">
    <img v-bind="imageAttrs" />
  </div>
</template>
```

<!-- /automd -->

`useCmsElementImage` returns more than these three values, and `getConfigValue` from `useCmsElementConfig` returns `false` for a config entry mapped from the surrounding entity. The [Rendering CMS Pages recipe](../../frontends-recipes/cms/rendering.html#composables) lists both.
