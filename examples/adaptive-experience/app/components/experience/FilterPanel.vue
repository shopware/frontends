<script setup lang="ts">
defineProps<{
  collapsed: boolean;
}>();
</script>

<template>
  <div
    :class="{ 'max-md:hidden': collapsed }"
    data-testid="experience-filter-panel"
  >
    <SwProductListingFilters listing-type="productSearchListing" />
  </div>
</template>
