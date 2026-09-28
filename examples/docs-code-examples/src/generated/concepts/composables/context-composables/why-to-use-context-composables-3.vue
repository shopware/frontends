<!-- ProductPrice.vue -->
<script setup lang="ts">
import { getFormattedPrice } from "@shopware/helpers";

import type { Schemas } from "#shopware";

type Product = Schemas["Product"];

const props = defineProps<{
  product: Product;
}>();
</script>
<template>
  <div>
    {{ getFormattedPrice(product.calculatedPrice.unitPrice, "$") }}
  </div>
</template>
