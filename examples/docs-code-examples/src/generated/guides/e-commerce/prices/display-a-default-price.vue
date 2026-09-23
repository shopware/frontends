<script setup>
import { useProductSearch } from '@shopware/composables';

const { getFormattedPrice } = usePrice();
const { search } = useProductSearch();

const { product } = await search('some-product-id');

const { unitPrice, price, tierPrices, hasListPrice } = useProductPrice(ref(product));
</script>

<template>
  <div>
    <div>
      <b>{{ product.name }}</b>
    </div>
    <div>
      {{ getFormattedPrice(unitPrice) }}
      <small>
        incl. {{ price.taxRules[0].taxRate }}% tax
      </small>
    </div>
    <div v-if="hasListPrice">
      <small>
        <del>
          {{ getFormattedPrice(price.listPrice.price) }}
        </del>
        (-{{ price.listPrice.percentage }}%)
      </small>
    </div>
  </div>
</template>
