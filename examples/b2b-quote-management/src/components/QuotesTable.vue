<script setup lang="ts">
import { ref, onBeforeMount } from "vue";
import { useB2bQuoteManagement, useUser } from "@shopware-pwa/composables-next";
import Login from "./Login.vue";
import type { Schemas } from "#shopware";

const quotesList = ref<Schemas["Quote"][]>([]);
const { getQuoteList } = useB2bQuoteManagement();
const { isLoggedIn } = useUser();

const refreshList = async () => {
  quotesList.value = await getQuoteList();
};

onBeforeMount(async () => {
  refreshList();
});
</script>
<template>
  <div v-if="isLoggedIn">
    <table class="min-w-full divide-y divide-gray-200 overflow-x-auto">
      <thead class="bg-gray-50">
        <tr>
          <th
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            Quote #
          </th>
          <th
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            Created at
          </th>
          <th
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            Valid until
          </th>
          <th
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            Grand total
          </th>
          <th
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            Status
          </th>
          <th
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          ></th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-200">
        <tr v-for="quote in quotesList" :key="quote.id">
          <td class="px-6 py-4 whitespace-nowrap">{{ quote.quoteNumber }}</td>
          <td class="px-6 py-4 whitespace-nowrap">{{ quote.createdAt }}</td>
          <td class="px-6 py-4 whitespace-nowrap">
            {{ quote.expirationDate }}
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            {{ quote.price.totalPrice }}
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            {{ quote.stateMachineState.translated.name }}
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            <router-link :to="`/quote/${quote.id}`">Details</router-link>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <Login v-else @success="refreshList" />
</template>
