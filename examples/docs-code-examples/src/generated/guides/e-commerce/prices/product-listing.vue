<script setup lang="ts">
import { ref } from "vue";

import { useProductPrice } from "#imports";
import type { Schemas } from "#shopware";

const product = ref({} as Schemas["Product"]);
const { totalPrice, displayFrom } = useProductPrice(product);
</script>
<template>
  <div><span v-if="displayFrom">from</span>{{ totalPrice }} $</div>
</template>
