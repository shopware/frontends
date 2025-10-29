---
"@shopware/composables": minor
---

Refactor product listing composables into modular, context-based architecture with improved SSR support.

## Breaking Changes

### 1. Pagination Parameter Change

**Changed:** The pagination parameter has been standardized from `page` to `p`:

```typescript
// Before
changeCurrentPage(2);  // Sends: { body: { page: 2 } }

// After
changeCurrentPage(2);  // Sends: { body: { p: 2 } }
```

**Impact:** If you're directly using the API client or inspecting search parameters, update to use `p` instead of `page`.

### 2. Error Handling - Context Required

**Changed:** `useCategoryListing()` now **throws an error** if called without context:

```typescript
// Before - Would fail silently or return null
const listing = useCategoryListing();

// After - Throws clear error
const listing = useCategoryListing();
// Error: "[useCategoryListing] Please call `createCategoryListingContext`
// on the appropriate parent component"
```

**Impact:** You **must** call `createCategoryListingContext(initialListing)` before using `useCategoryListing()`.

### 3. Loading State Split

**Changed:** Loading states are now separated:

```typescript
// Before - Single loading ref
const { loading } = useListing();

// After - Two separate refs
const { loading, loadingMore } = useListing();
// loading - for search operations
// loadingMore - for pagination/load more operations
```

**Impact:** If you're checking loading state for pagination, also check `loadingMore`.

### 4. Context-Based Architecture (Required for Category Pages)

**New Requirement:** Category pages must create listing context in parent component:

```ts
// Required in CmsPage.vue or similar
import { createCategoryListingContext } from "@shopware/composables";

const initialListing = getProductListingFromCmsPage(props.content);
if (initialListing) {
  createCategoryListingContext(initialListing);
}
```

**Impact:** Without this, child components using `useCategoryListing()` will throw errors.

### 5. Composable Structure (Internal Change)

The `useListing` composable has been refactored into smaller, focused composables:

- `useListingCore` - Core listing state management
- `useProductListingFilters` - Filter state and operations
- `useProductListingPagination` - Pagination logic
- `useProductListingProducts` - Product data handling
- `useProductListingSorting` - Sorting functionality

**The public API of `useListing` remains the same**, but internal implementation has changed significantly.

### 6. SSR Improvements

- **Removed `<ClientOnly>` wrappers** from filter components
- Initial listing data is now provided via context during SSR
- Components can access listing data synchronously on server and client

**Impact:** No hydration mismatches, but ensure context is created during SSR.

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
