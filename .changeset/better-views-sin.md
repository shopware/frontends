---
"@shopware/composables": minor
---

Refactor product listing composables into modular, context-based architecture with improved SSR support.

## Breaking Changes

### Composable Structure

The `useListing` composable has been refactored into smaller, focused composables:

- `useListingCore` - Core listing state management
- `useProductListingFilters` - Filter state and operations
- `useProductListingPagination` - Pagination logic
- `useProductListingProducts` - Product data handling
- `useProductListingSorting` - Sorting functionality

**The public API of `useListing` remains the same**, but internal implementation has changed significantly.

### Context-Based Architecture

Introduced injection state pattern for product listings:

```ts
// New context creation helper
import { createCategoryListingContext } from "@shopware/composables";

// Create context with initial listing data (SSR-friendly)
createCategoryListingContext(initialListing);

// Access listing in any child component
const listing = useCategoryListing();
```

This replaces the previous approach where listing data had to be passed through props.

### SSR Improvements

- **Removed `<ClientOnly>` wrappers** from filter components
- Initial listing data is now provided via context during SSR
- Components can access listing data synchronously on server and client

## Migration Guide

### Before (prop drilling)

```vue
<template>
  <SwProductListingFilters
    :listing="listing"
    @filter-change="handleFilterChange"
  />
</template>

<script setup>
const listing = useListing();
</script>
```

### After (context-based)

```vue
<!-- In CmsPage.vue or layout -->
<script setup>
import { createCategoryListingContext } from "@shopware/composables";

// Create context once at top level
if (initialListing) {
  createCategoryListingContext(initialListing);
}
</script>

<!-- In any child component -->
<template>
  <SwProductListingFilters @filter-change="handleFilterChange" />
</template>

<script setup>
// Access listing from context
const listing = useCategoryListing();
</script>
```

### Using the New Composables

If you need fine-grained control, use the individual composables:

```ts
import {
  useProductListingFilters,
  useProductListingPagination,
  useProductListingSorting,
  useProductListingProducts,
} from "@shopware/composables";

// Access specific functionality
const { getInitialFilters, getCurrentFilters } = useProductListingFilters();
const { currentPage, totalPages, loadMore } = useProductListingPagination();
const { getSortingOrders, changeCurrentSortingOrder } = useProductListingSorting();
const { getElements, search } = useProductListingProducts();
```

## New Features

### Helper Functions

Added `getProductListingFromCmsPage` helper to extract listing data from CMS pages:

```ts
import { getProductListingFromCmsPage } from "@shopware/helpers";

const listing = getProductListingFromCmsPage(cmsPage);
```

### Utility Functions

New internal utilities for listing operations (exported from `utils.ts`):
- Improved type safety with `ListingType` and `ShortcutFilterParam` types
- Better merge strategies for listing criteria

## What Changed

### File Structure
- Split monolithic `useListing.ts` (~500 lines) into focused modules
- Each module handles a single responsibility
- Better tree-shaking and code organization

### Performance
- Reduced prop drilling
- More efficient reactive updates
- Better separation of concerns

### Developer Experience
- Easier to test individual features
- Clearer API boundaries
- Better TypeScript inference
- Simplified component templates
