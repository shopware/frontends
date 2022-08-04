<script setup lang="ts">
import { CmsElementBuyBox } from "@shopware-pwa/composables-next";
import {
  getProductTierPrices,
  getProductCalculatedListingPrice,
} from "@shopware-pwa/helpers-next";

const props = defineProps<{
  content: CmsElementBuyBox;
}>();

const product = computed(() => props.content?.data?.product);

const { currency } = useSessionContext();

const price = computed(() => {
  const tierPrices = getProductTierPrices(product.value);
  return (
    tierPrices?.[0]?.unitPrice ||
    getProductCalculatedListingPrice(product.value)
  );
});
const referencePrice = computed(
  () => product.value?.calculatedPrice?.referencePrice
);
const productNumber = computed(() => product.value?.productNumber);
const purchaseUnit = computed(() => product.value?.purchaseUnit);
const unitName = computed(() => product.value?.unit?.name);
const deliveryTime = computed(() => product.value?.deliveryTime);
</script>
<template>
  <div class="mt-1">
    <p class="font-bold text-2xl text-gray-900 text-left">
      {{ currency?.symbol }} {{ price }}
    </p>
    <div v-if="purchaseUnit && unitName" class="mt-1">
      <span class="font-light"> Content: </span>
      <span class="font-light"> {{ purchaseUnit }} {{ unitName }} </span>
      <span v-if="referencePrice" class="font-light">
        {{ currency?.symbol }} {{ referencePrice?.price }} / /
        {{ referencePrice?.referenceUnit }} {{ referencePrice?.unitName }}
      </span>
    </div>
    <span> Prices incl. VAT plus shipping costs </span>
  </div>
  <div class="mt-1">
    <span> Delivery time {{ deliveryTime?.name }} </span>
  </div>

  <SwVariantConfigurator :product="product" />
  <SwProductAddToCart :product="product" />
  <div class="mt-3 product-detail-ordernumber-container">
    <span class="font-bold text-gray-900"> Product number: </span>
    <span>
      {{ productNumber }}
    </span>
  </div>
</template>
