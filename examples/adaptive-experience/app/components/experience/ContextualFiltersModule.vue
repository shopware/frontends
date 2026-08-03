<script setup lang="ts">
// Inline concrete shape (mirrors `contextualFiltersPropsSchema`): the Vue macro
// cannot resolve a zod `z.infer` alias at compile time.
defineProps<{ listingKey?: string; collapsed?: boolean }>();
</script>

<template>
  <div
    :class="{ 'max-md:hidden': collapsed }"
    data-testid="experience-filter-panel"
  >
    <SwProductListingFilters listing-type="productSearchListing" />
  </div>
</template>
