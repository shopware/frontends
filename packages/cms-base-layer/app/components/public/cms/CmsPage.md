An entrypoint to render the whole CMS object.

Resolves all CMS sections dynamically and applies their layout configuration. When a section has a `backgroundMedia` set, the component automatically optimizes the background image URL using the `getBackgroundImageUrl` helper from `@shopware/helpers`, appending `format` and `quality` parameters from the `backgroundImage` app config.

### Background Image Optimization

Background image settings are read from `app.config.ts`:

```ts
export default defineAppConfig({
  backgroundImage: {
    format: "webp", // output format
    quality: 85, // image quality (0-100)
  },
});
```

See the [cms-base-layer README](../../../../../../README.md#%EF%B8%8F-background-image-optimization) for full details.

### Example usage

```vue{29}
<script setup lang="ts">
import { useLandingSearch } from "#imports";
import type { Schemas } from "#shopware";

const props = defineProps<{
  navigationId: string;
}>();

const { search } = useLandingSearch();

const { data: landingResponse } = await useAsyncData(
  "cmsLanding" + props.navigationId,
  async () => {
    const landingPage = await search(props.navigationId, {
      withCmsAssociations: true,
    });
    return landingPage;
  },
);

if (typeof landingResponse?.value !== null) {
  const landingPage = landingResponse as Ref<Schemas["LandingPage"]>;
  useCmsHead(landingPage, { mainShopTitle: "Shopware Frontends Demo Store" });
}
</script>

<template>
  <LayoutBreadcrumbs />
  <CmsPage v-if="landingResponse?.cmsPage" :content="landingResponse.cmsPage" />
</template>
```
