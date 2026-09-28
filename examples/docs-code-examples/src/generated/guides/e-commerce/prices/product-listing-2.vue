<script setup lang="ts">
import { ref } from "vue";

import { useProductPrice } from "#imports";
import type { Schemas } from "#shopware";

const product = ref({} as Schemas["Product"]);
const { totalPrice, displayFromVariants } = useProductPrice(product);
</script>
<template>
  <div>
    {{ totalPrice }} $
    <span v-if="displayFromVariants">
      Variants from {{ displayFromVariants }} $
    </span>
  </div>
</template>
