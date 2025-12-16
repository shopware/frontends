# Content System Components

This directory contains components for rendering content using the new Content API.

## Components

### ContentPage.vue
Main component for rendering a complete content page. Accepts a `ContentPage` object and dynamically renders all elements.

**Props:**
- `content: Schemas["ContentPage"]` - The content page to render

**Usage:**
```vue
<ContentPage :content="pageContent" />
```

### ContentElement.vue
Generic component for rendering individual content elements. Used internally by ContentPage but can also be used standalone.

**Props:**
- `element: Schemas["ContentElement"]` - The content element to render

**Usage:**
```vue
<ContentElement :element="element" />
```

### ContentHydrator.vue
Wrapper component that handles different loading strategies (SSR, CSR, skeleton-first).

**Props:**
- `path: string` - Content path (e.g., "product/123")
- `skeleton?: Schemas["ContentSkeletonPage"]` - Pre-fetched skeleton (optional)
- `content?: Schemas["ContentPage"]` - Pre-fetched content (optional)
- `strategy?: "full" | "skeleton-first" | "decomposed"` - Loading strategy
- `languageId?: string` - Language ID (optional)
- `elementId?: string` - Element ID for partial rendering (optional)

**Slots:**
- `loading` - Custom loading state
- `error` - Custom error state
- `empty` - Custom empty state

**Usage:**
```vue
<!-- SSR with full hydration -->
<ContentHydrator path="product/my-product" strategy="full" />

<!-- SSR with skeleton-first (progressive enhancement) -->
<ContentHydrator
  :path="`product/${productId}`"
  :skeleton="skeletonData"
  strategy="skeleton-first"
/>

<!-- Custom loading state -->
<ContentHydrator path="category/electronics">
  <template #loading>
    <MyCustomLoader />
  </template>
</ContentHydrator>
```

## Component Resolution

Content elements are mapped to Vue components based on their `component` type:

| Content Type | Component Name | File Location |
|-------------|----------------|---------------|
| `Sw:Content:Text` | `ContentText` | `components/content/ContentText.vue` |
| `Sw:Product:Card` | `ContentProductCard` | `components/content/ContentProductCard.vue` |
| `Sw:Grid` | `ContentGrid` | `components/content/ContentGrid.vue` |

### Creating Custom Content Components

1. Create a new component in `app/components/content/`
2. Name it according to the pattern: `Content{Category}{Name}.vue`
3. Accept these props:
   - `element: Schemas["ContentElement"]`
   - `properties: Record<string, unknown>`

**Example:**
```vue
<!-- app/components/content/ContentText.vue -->
<script setup lang="ts">
import type { Schemas } from "#shopware";

defineProps<{
  element: Schemas["ContentElement"];
  properties: Record<string, unknown>;
}>();
</script>

<template>
  <div class="content-text">
    <h1 v-if="properties.title">{{ properties.title }}</h1>
    <div v-if="properties.content" v-html="properties.content" />
  </div>
</template>
```

## Loading Strategies

### 1. Full Hydration (SSR-optimized)
Fetches complete content with all data in one request.

```vue
<script setup lang="ts">
const { fetchFullContent } = useContent();
const { data } = await useAsyncData('content', () =>
  fetchFullContent('product/my-product')
);
</script>

<template>
  <ContentPage v-if="data" :content="data" />
</template>
```

### 2. Skeleton-First (Progressive Enhancement)
Fetches skeleton on SSR, hydrates with data on client.

```vue
<script setup lang="ts">
const { fetchSkeleton } = useContent();
const { data: skeleton } = await useAsyncData('skeleton', () =>
  fetchSkeleton('product/my-product')
);
</script>

<template>
  <ContentHydrator
    path="product/my-product"
    :skeleton="skeleton"
    strategy="skeleton-first"
  />
</template>
```

### 3. Decomposed (Bandwidth-optimized)
Fetches skeleton + deduplicated data + assignments in one request.

```vue
<ContentHydrator
  path="category/electronics"
  strategy="decomposed"
/>
```

## Migration from CMS API

| Old (CMS API) | New (Content API) |
|--------------|-------------------|
| `CmsPage` | `ContentPage` |
| `CmsGenericElement` | `ContentElement` |
| `useCategorySearch(..., { withCmsAssociations: true })` | `useContent().fetchFullContent('category/123')` |
| `sections[] → blocks[] → slots[]` | `elements[]` with nested `slots{}` |
| `section.type`, `block.type`, `slot.type` | `element.component` |
| `config` + `data` objects | `properties` object |

## Example: Full Page Implementation

```vue
<!-- pages/product/[id].vue -->
<script setup lang="ts">
const route = useRoute();
const productId = route.params.id as string;

// Option 1: Full hydration (SSR)
const { fetchFullContent } = useContent();
const { data: content } = await useAsyncData(
  `content-product-${productId}`,
  () => fetchFullContent(`product/${productId}`)
);

// Option 2: Skeleton-first (Progressive)
// const { fetchSkeleton } = useContent();
// const { data: skeleton } = await useAsyncData(
//   `skeleton-product-${productId}`,
//   () => fetchSkeleton(`product/${productId}`)
// );
</script>

<template>
  <div class="product-page">
    <LayoutHeader />

    <!-- Option 1: Direct rendering -->
    <ContentPage v-if="content" :content="content" />

    <!-- Option 2: With hydration wrapper -->
    <!-- <ContentHydrator
      :path="`product/${productId}`"
      :skeleton="skeleton"
      strategy="skeleton-first"
    /> -->

    <LayoutFooter />
  </div>
</template>
```
