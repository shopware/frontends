<script setup lang="ts">
import type { CmsElementBuyBox } from "@shopware-pwa/composables-next";
import { useCmsElementConfig } from "@shopware-pwa/composables-next";
import {
  getProductTierPrices,
  getProductCalculatedListingPrice,
} from "@shopware-pwa/helpers-next";
import { Product } from "@shopware-pwa/types";
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

const price = computed(() => {
  if (product.value) {
    const tierPrices = getProductTierPrices(product.value);
    return (
      tierPrices?.[0]?.unitPrice ||
      getProductCalculatedListingPrice(product.value)
    );
  } else {
    return null;
  }
});
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
      <SharedPrice
        v-if="price"
        :value="price"
        class="font-bold text-2xl text-gray-900 text-left"
      />
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
