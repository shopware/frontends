<script setup lang="ts">
import { ref } from "vue";

import { useProductPrice } from "#imports";
import type { Schemas } from "#shopware";

const product = ref({} as Schemas["Product"]);
const { tierPrices, totalPrice } = useProductPrice(product);
</script>

<template>
  <div>
    <table v-if="tierPrices.length">
      <!-- check if tierPrices array is not empty -->
      <tr v-for="(tierPrice, index) in tierPrices" :key="tierPrice.label">
        <td>
          <span v-if="index < tierPrices.length - 1"> To </span>
          <span v-else> From </span>
          {{ tierPrice.quantity }}
        </td>
        <td>{{ tierPrice.unitPrice }} $</td>
      </tr>
    </table>
    <div v-else>
      <!-- show the regular unit price instead -->
      {{ totalPrice }} $
    </div>
  </div>
</template>
