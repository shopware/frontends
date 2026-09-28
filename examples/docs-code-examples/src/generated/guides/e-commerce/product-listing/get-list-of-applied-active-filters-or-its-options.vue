<script setup lang="ts">
const { getCurrentFilters } = useListing(/** parameters omitted */);
</script>
<template>
  {{ getCurrentFilters.navigationId }}
  <!-- "category-A-ID-1" -->
  {{ getCurrentFilters.manufacturer }}
  <!-- ["manufacturer-A-option-ID-1"] -->
  {{ getCurrentFilters.price }}
  <!-- { min: 0, max: 299 } -->
  {{ getCurrentFilters.rating }}
  <!-- null -->
  {{ getCurrentFilters["shipping-free"] }}
  <!-- false -->
  {{ getCurrentFilters.properties }}
  <!-- ["property-A-option-ID-1", "property-A-option-ID-2", "property-B-option-ID-1"]-->
</template>
