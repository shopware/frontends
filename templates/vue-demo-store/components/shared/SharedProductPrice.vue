<script setup lang="ts">
import { Product } from '@shopware-pwa/types';
import {
  getProductTierPrices,
  getProductCalculatedListingPrice,
} from "@shopware-pwa/helpers-next";

const { getFormattedPrice } = usePrice();
const props = defineProps<{
  product: Product;
}>();

const price = computed(() => {
  if (props.product) {
    const tierPrices = getProductTierPrices(props.product);
    return (
      tierPrices?.[0]?.unitPrice ||
      getProductCalculatedListingPrice(props.product)
    );
  } else {
    return null;
  }
});

const oldPrice = computed(() => {
  if (props.product) {
    const oldPriceTemp = getProductCalculatedListingPrice(props.product);
    if (oldPriceTemp && price.value && oldPriceTemp > price.value) {
      return oldPriceTemp
    } else {
      return null;
    }
  } else {
    return null;
  }
});

const percent = computed(() => {
  if (oldPrice.value && price.value) {
    return Math.floor((oldPrice.value - price.value) / oldPrice.value * 100)
  }
  return null;
})

</script>

<template>
  <div v-if="price">
    <p class="flex">
      <span 
        :class="[
          'text-lg',
          oldPrice ? 'font-medium text-red-900' : ''
        ]
      ">
        {{ getFormattedPrice(price!) }}
      </span>
      <span v-if="oldPrice" class="pl-2 line-through text-lg">{{ getFormattedPrice(oldPrice!) }}</span>
    </p>
    <p v-if="oldPrice" class="text-xs text-red-900">Save {{ getFormattedPrice(oldPrice - price) }} (-{{percent }}%)</p>
  </div>
</template>
