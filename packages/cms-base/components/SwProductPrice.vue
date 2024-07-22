<script setup lang="ts">
import type { Schemas } from "#shopware";
import { useCmsTranslations } from "@shopware-pwa/composables-next";
import SwSharedPrice from "./SwSharedPrice.vue";
import { useProductPrice, usePrice } from "#imports";
import { toRefs } from "vue";
import { defu } from "defu";

const props = defineProps<{
  product: Schemas["Product"];
}>();

type Translations = {
  product: {
    amount: string;
    price: {
      [key: string]: string;
    };
    to: string;
    from: string;
  };
};

let translations: Translations = {
  product: {
    amount: "Amount",
    price: {
      label: "Price",
      to: "To",
      from: "From",
    },
    to: "To",
    from: "From",
  },
};

translations = defu(useCmsTranslations(), translations) as Translations;

const { product } = toRefs(props);

const { unitPrice, price, tierPrices, isListPrice } = useProductPrice(product);
const { getFormattedPrice } = usePrice();
</script>

<template>
  <div>
    <div v-if="!tierPrices.length">
      <SwSharedPrice
        v-if="isListPrice"
        class="text-1xl text-gray-900 basis-2/6 justify-end line-through"
        :value="price?.listPrice?.price"
      />
      <SwSharedPrice
        v-if="unitPrice"
        class="text-3xl text-gray-900 basis-2/6 justify-end"
        :class="{
          'text-red': isListPrice,
        }"
        :value="unitPrice"
      />
    </div>
    <div v-else>
      <table class="border-collapse table-auto w-full text-sm mb-8">
        <thead>
          <tr>
            <th
              class="border-b dark:border-slate-600 font-medium p-4 pl-8 pt-0 pb-3 text-slate-600 dark:text-slate-200 text-left"
            >
              {{ translations.product.amount }}
            </th>

            <th
              class="border-b dark:border-slate-600 font-medium p-4 pr-8 pt-0 pb-3 text-slate-600 dark:text-slate-200 text-left"
            >
              {{ translations.product.price.label }}
            </th>
          </tr>
        </thead>
        <tbody class="bg-white dark:bg-slate-800">
          <tr v-for="(tierPrice, index) in tierPrices" :key="tierPrice.label">
            <td
              class="border-b border-slate-100 dark:border-slate-700 p-4 pl-8 font-medium text-slate-500 dark:text-slate-400"
            >
              <span v-if="index < tierPrices.length - 1">{{
                translations.product.price.to
              }}</span
              ><span v-else>{{ translations.product.price.from }}</span>
              {{ tierPrice.quantity }}
            </td>
            <td
              class="border-b border-slate-100 dark:border-slate-700 p-4 pr-8 font-medium text-current-500 dark:text-slate-400"
            >
              {{ getFormattedPrice(tierPrice.unitPrice) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
