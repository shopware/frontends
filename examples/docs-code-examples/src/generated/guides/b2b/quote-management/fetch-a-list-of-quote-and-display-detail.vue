<script setup lang="ts">
import { useB2bQuoteManagement } from "@shopware/composables";
import { ref, onBeforeMount } from "vue";

import type { Schemas } from "#shopware";

const quotesList = ref<Schemas["Quote"][]>([]);
const { getQuoteList } = useB2bQuoteManagement();
onBeforeMount(async () => {
  quotesList.value = await getQuoteList();
});
</script>
<template>
  <table>
    <thead>
      <tr>
        <th>Quote #</th>
        <th>Created at</th>
        <th>Valid until</th>
        <th>Grand total</th>
        <th>Status</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="quote in quotesList" :key="quote.id">
        <td>{{ quote.quoteNumber }}</td>
        <td>{{ quote.createdAt }}</td>
        <td>{{ quote.expirationDate }}</td>
        <td>
          {{ quote.price?.totalPrice }}
        </td>
        <td>
          {{ quote.stateMachineState?.translated.name }}
        </td>
      </tr>
    </tbody>
  </table>
</template>
