<script setup lang="ts">
const { totalPrice, displayFrom } = useProductPrice(/** argument omitted - Product object */);
</script>
<template>
<div>
  <span v-if="displayFrom">from</span>{{ totalPrice }} $
</div>
</template>
