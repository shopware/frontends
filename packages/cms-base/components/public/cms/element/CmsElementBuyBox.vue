<script setup lang="ts">
import type { CmsElementBuyBox } from "@shopware-pwa/composables-next";
import { useCmsElementConfig, useProductPrice } from "@shopware-pwa/composables-next";
import SwProductAddToCart from "../../../SwProductAddToCart.vue";
import SwVariantConfigurator from "../../../SwVariantConfigurator.vue";

const props = defineProps<{
  content: CmsElementBuyBox;
}>();

const { getConfigValue } = useCmsElementConfig(props.content);
const alignment = computed(() => getConfigValue("alignment"));

const { taxState, currency } = useSessionContext();

const { product, changeVariant } = useProduct(
  props.content.data.product,
  props.content.data.configuratorSettings || []
);

const { unitPrice, price, tierPrices, isListPrice } = useProductPrice(product);
const regulationPrice = computed(() => price?.value?.regulationPrice?.price)
const { getFormattedPrice } = usePrice();

const referencePrice = computed(
  () => product.value?.calculatedPrice?.referencePrice
);
const productNumber = computed(() => product.value?.productNumber);
const purchaseUnit = computed(() => product.value?.purchaseUnit);
const unitName = computed(() => product.value?.unit?.name);
const availableStock = computed(() => product.value?.availableStock ?? 0);
const minPurchase = computed(() => product.value?.minPurchase ?? 0);
const deliveryTime = computed(() => product.value?.deliveryTime);
const restockTime = computed(() => product.value?.restockTime);
</script>
<template>
  <div
    v-if="product"
    :class="{
      'h-full flex flex-col': true,
      'justify-start': alignment === 'flex-start',
      'justify-end': alignment === 'flex-end',
      'justify-center': alignment === 'center',
    }"
  >
    <div>
      <div v-if="tierPrices.length <= 1">
        <SharedPrice
          v-if="isListPrice"
          class="text-1xl text-gray-900 basis-2/6 justify-start line-through"
          :value="price?.listPrice?.price"
        />
        <SharedPrice
          v-if="unitPrice"
          class="text-3xl text-gray-900 basis-2/6 justify-start"
          :class="{
            'text-red': isListPrice,
          }"
          :value="unitPrice"
        />
        <div class="text-xs flex text-gray-500" v-if="regulationPrice">
          Previously <SharedPrice class="ml-1" :value="regulationPrice"/>
        </div>
      </div>
      <div v-else>
      <table class="border-collapse table-auto w-full text-sm mb-8">
        <thead>
          <tr>
            <th
              class="border-b dark:border-slate-600 font-medium p-4 pl-8 pt-0 pb-3 text-slate-600 dark:text-slate-200 text-left"
            >
              Amount
            </th>

            <th
              class="border-b dark:border-slate-600 font-medium p-4 pr-8 pt-0 pb-3 text-slate-600 dark:text-slate-200 text-left"
            >
              Price
            </th>
          </tr>
        </thead>
        <tbody class="bg-white dark:bg-slate-800">
          <tr v-for="(tierPrice, index) in tierPrices" :key="tierPrice.label">
            <td
              class="border-b border-slate-100 dark:border-slate-700 p-4 pl-8 font-medium text-slate-500 dark:text-slate-400"
            >
              <span v-if="index < tierPrices.length - 1">To</span
              ><span v-else>From</span> {{ tierPrice.quantity }}
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
      <div v-if="purchaseUnit && unitName" class="mt-1">
        <span class="font-light"> Content: </span>
        <span class="font-light"> {{ purchaseUnit }} {{ unitName }} </span>
        <span v-if="referencePrice" class="font-light">
          {{ currency?.symbol }} {{ referencePrice?.price }} / /
          {{ referencePrice?.referenceUnit }} {{ referencePrice?.unitName }}
        </span>
      </div>
      <span class="text-indigo-600">
        <template v-if="taxState === 'gross'">
          Prices incl. VAT plus shipping costs
        </template>
        <template v-else> Prices excl. VAT plus shipping costs </template>
      </span>
    </div>
    <div class="mt-4">
      <span v-if="availableStock >= minPurchase && deliveryTime"
        >Available, delivery time {{ deliveryTime?.name }}
      </span>
      <span
        v-else-if="availableStock < minPurchase && deliveryTime && restockTime"
        >Available in {{ restockTime }} day, delivery time
        {{ deliveryTime?.name }}</span
      >
      <span v-else>No longer available</span>
    </div>
    <SwVariantConfigurator :product="product" @change="changeVariant" />
    <SwProductAddToCart :product="product" />
    <div class="mt-3 product-detail-ordernumber-container">
      <span class="font-bold text-gray-900"> Product number: </span>
      <span>
        {{ productNumber }}
      </span>
    </div>
  </div>
</template>
