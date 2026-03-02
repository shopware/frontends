Renders a Block type structure.

Resolves the correct CMS block component dynamically and applies layout configuration (CSS classes, background color, background image). When a block has a `backgroundMedia` set, the component automatically optimizes the background image URL using the `getBackgroundImageUrl` helper from `@shopware/helpers`, appending `format` and `quality` parameters from the `backgroundImage` app config.

### Background Image Optimization

Background image settings are read from `app.config.ts`:

```ts
export default defineAppConfig({
  backgroundImage: {
    format: "webp",
    quality: 85,
  },
});
```

### Example usage

```vue{14-19}
<script setup lang="ts">
import type { CmsSectionDefault } from "@shopware/composables";
import { getCmsLayoutConfiguration } from "@shopware/helpers";

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
