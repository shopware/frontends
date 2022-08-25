<script setup lang="ts">
import type { CmsElementBuyBox } from "@shopware-pwa/composables-next";
import { useCmsElementConfig } from "@shopware-pwa/composables-next";
import {
  getProductTierPrices,
  getProductCalculatedListingPrice,
} from "@shopware-pwa/helpers-next";
import { Product } from "@shopware-pwa/types";

const props = defineProps<{
  content: CmsElementBuyBox;
}>();

const { getConfigValue } = useCmsElementConfig(props.content);
const alignment = computed(() => getConfigValue("alignment"));

const { taxState, currency } = useSessionContext();
const product = ref<Product>();
watch(
  () => props.content?.data?.product,
  (value) => {
    if (value) {
      value.configuratorSettings = props.content?.data?.configuratorSettings;
    }
    product.value = value;
  },
  {
    immediate: true,
  }
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
const handleVariantChange = (val: Product) => {
  const temp = product.value;
  if (temp) {
    temp.id = val.id;
    temp.productNumber = val.productNumber;
    const seoUrl = temp.seoUrls?.find(
      (seoUrl) => seoUrl.apiAlias === "seo_url"
    );
    if (seoUrl) {
      seoUrl.seoPathInfo = val.seoUrls?.[0]?.seoPathInfo ?? "";
    }
    product.value = temp;
  }
};
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
    <SwVariantConfigurator :product="product" @change="handleVariantChange" />
    <SwProductAddToCart :product="product" />
    <div class="mt-3 product-detail-ordernumber-container">
      <span class="font-bold text-gray-900"> Product number: </span>
      <span>
        {{ productNumber }}
      </span>
    </div>
  </div>
</template>
