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

**Understanding Properties:**

Properties are dynamic and specific to each content element type. They're stored in `element.properties` and contain the configuration for that element.

Use the `getElementProperty<T>()` helper to safely access properties with type checking and defaults:

```typescript
import { getElementProperty } from "~/composables/contentHelpers";

// Access specific properties with type safety
const title = computed(() => 
  getElementProperty<string>(props.element, "title", "")
);
const alignment = computed(() => 
  getElementProperty<"left" | "center" | "right">(
    props.element, 
    "alignment", 
    "left"
  )
);
const isVisible = computed(() => 
  getElementProperty<boolean>(props.element, "visible", true)
);
```

**Common Properties by Element Type:**

- **Text Elements** (`Sw:Content:Text`):
  - `title: string` - Heading text
  - `content: string` - HTML content
  - `alignment: "left" | "center" | "right"` - Text alignment
  - `verticalAlignment: "top" | "center" | "bottom"` - Vertical position

- **Button Elements** (`Sw:Content:Button`):
  - `text: string` - Button label
  - `url: string` - Link destination
  - `newTab: boolean` - Open in new tab
  - `variant: "primary" | "secondary" | "outline" | "ghost"` - Style variant
  - `size: "small" | "medium" | "large"` - Button size
  - `alignment: "left" | "center" | "right"` - Horizontal alignment

- **Image Elements** (`Sw:Content:Image`):
  - `url: string` - Image source URL
  - `alt: string` - Alt text
  - `title?: string` - Image title
  - `displayMode: "standard" | "cover" | "contain"` - How to display
  - `minHeight?: string` - Minimum height (e.g., "400px")

- **Grid Elements** (`Sw:Grid`):
  - `columns: number` - Number of columns
  - `gap: "small" | "medium" | "large"` - Gap between items
  - `displayMode?: string` - Display mode

- **Product Card Elements** (`Sw:Product:Card`):
  - `product: object` - Product data
  - `displayMode: "standard" | "minimal" | "cover"` - Card style

**Example:**
```vue
<!-- app/components/content/ContentText.vue -->
<script setup lang="ts">
import { computed } from "vue";
import { getElementProperty } from "~/composables/contentHelpers";
import type { Schemas } from "#shopware";

defineProps<{
  element: Schemas["ContentElement"];
  properties: Record<string, unknown>;
}>();

const title = computed(() =>
  getElementProperty<string>(props.element, "title", ""),
);
const content = computed(() =>
  getElementProperty<string>(props.element, "content", ""),
);
const alignment = computed(() =>
  getElementProperty<"left" | "center" | "right">(
    props.element,
    "alignment",
    "left",
  ),
);
</script>

<template>
  <div class="content-text" :class="`text-${alignment}`">
    <h1 v-if="title">{{ title }}</h1>
    <div v-if="content" v-html="content" />
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
