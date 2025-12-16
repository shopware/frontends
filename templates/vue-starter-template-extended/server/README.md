# Mock Content API

Mock server routes for testing the new Content API before backend implementation.

## Available Endpoints

### 1. GET `/api/mock/content/{path}`
Returns fully hydrated content with all properties attached to elements.

**Example:**
```
GET /api/mock/content/product/test-product
GET /api/mock/content/category/electronics
GET /api/mock/content/landing-page/home
```

**Response:** `ContentPage`

---

### 2. GET `/api/mock/content-decomposed/{path}`
Returns content with skeletons, deduplicated data, and assignments.

**Example:**
```
GET /api/mock/content-decomposed/product/test-product
```

**Response:** `ContentDecomposedPage`

---

### 3. GET `/api/mock/content-skeleton/{path}`
Returns only the layout skeleton without any hydrated data.

**Example:**
```
GET /api/mock/content-skeleton/product/test-product
```

**Response:** `ContentSkeletonPage`

---

### 4. GET `/api/mock/content-data/{path}`
Returns only data and assignments (no skeleton).

**Example:**
```
GET /api/mock/content-data/product/test-product
```

**Response:** `ContentDataPage`

---

## Usage in Components

### Using Fetch Directly

```vue
<script setup lang="ts">
// Full content
const { data: content } = await useFetch('/api/mock/content/product/my-product');

// Skeleton first
const { data: skeleton } = await useFetch('/api/mock/content-skeleton/product/my-product');
const { data: dataResponse } = await useFetch('/api/mock/content-data/product/my-product');
</script>

<template>
  <ContentPage v-if="content" :content="content" />
</template>
```

### Using with ContentHydrator

```vue
<script setup lang="ts">
const productId = 'test-product';
const { data: skeleton } = await useFetch(`/api/mock/content-skeleton/product/${productId}`);
</script>

<template>
  <ContentHydrator
    :path="`product/${productId}`"
    :skeleton="skeleton"
    strategy="skeleton-first"
  />
</template>
```

## Mock Data Structure

The mock data includes:

- **Hero Section**: Grid layout with text, button, and image
- **Product Grid**: 3 products with images, descriptions, and prices
- **Responsive Layout**: Mobile-first responsive grid
- **Tailwind CSS Classes**: Ready for UnoCSS/Tailwind rendering

## Testing Different Strategies

### Full Hydration
```bash
curl http://localhost:3000/api/mock/content/product/test
```

### Skeleton-First
```bash
# Step 1: Get skeleton
curl http://localhost:3000/api/mock/content-skeleton/product/test

# Step 2: Get data
curl http://localhost:3000/api/mock/content-data/product/test
```

### Decomposed
```bash
curl http://localhost:3000/api/mock/content-decomposed/product/test
```

## Path Patterns

The `{path}` parameter supports:
- `product/{productId}` - Product detail pages
- `category/{categoryId}` - Category listing pages
- `landing-page/{landingPageId}` - Landing pages
- Any custom path pattern

The mock will generate appropriate content based on the path.
