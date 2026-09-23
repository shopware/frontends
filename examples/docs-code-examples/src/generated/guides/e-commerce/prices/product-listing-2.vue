<script setup lang="ts">
const { totalPrice, displayVariantsFrom } =
  useProductPrice(/** argument omitted - Product object */);
</script>
<template>
  <div>
    {{ totalPrice }} $
    <span v-if="displayVariantsFrom">
      Variants from {{ displayVariantsFrom }} $
    </span>
  </div>
</template>
