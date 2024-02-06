<script setup lang="ts">
import type { Schemas } from "#shopware";

const props = defineProps<{
  product: Schemas["Product"];
}>();
const { product } = toRefs(props);

const { unitPrice, price, tierPrices, isListPrice } = useProductPrice(product);
const { getFormattedPrice } = usePrice();
</script>

<template>
  <div>
    <div v-if="tierPrices.length <= 1">
      <SharedPrice
        v-if="isListPrice"
        class="text-1xl text-secondary-900 basis-2/6 justify-end line-through"
        :value="price?.listPrice?.price"
      />
      <SharedPrice
        v-if="unitPrice"
        class="text-3xl text-secondary-900 basis-2/6 justify-end"
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
              {{ $t("product.amount") }}
            </th>

            <th
              class="border-b dark:border-slate-600 font-medium p-4 pr-8 pt-0 pb-3 text-slate-600 dark:text-slate-200 text-left"
            >
              {{ $t("product.price.label") }}
            </th>
          </tr>
        </thead>
        <tbody class="bg-white dark:bg-secondary-800">
          <tr v-for="(tierPrice, index) in tierPrices" :key="tierPrice.label">
            <td
              class="border-b border-slate-100 dark:border-slate-700 p-4 pl-8 font-medium text-slate-500 dark:text-slate-400"
            >
              <span v-if="index < tierPrices.length - 1">
                {{ $t("product.price.to") }}</span
              ><span v-else> {{ $t("product.price.from") }}</span>
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
