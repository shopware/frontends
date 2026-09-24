<script setup lang="ts">
import { getProductRoute } from "@shopware/helpers";
</script>

<template>
  <RouterLink :to="getProductRoute(product)">
    {{ getTranslatedProperty(product, "name") }}
  </RouterLink>
</template>
