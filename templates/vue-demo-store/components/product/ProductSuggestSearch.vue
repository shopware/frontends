<script setup lang="ts">
import type { Product } from "@shopware-pwa/types";
import {
  getMainImageUrl,
  getProductCalculatedListingPrice,
  getTranslatedProperty,
} from "@shopware-pwa/helpers-next";

const props = defineProps<{ product: Product }>();

const { product } = toRefs(props);
const { unitPrice, displayFromVariants, displayFrom } =
  useProductPrice(product);
</script>
<template>
  <div
    class="p-3 h-14 text-sm flex items-center gap-3 hover:bg-gray-100 cursor-pointer transition duration-300 bg-white"
  >
    <div class="rounded-md border-1 border-gray-200 overflow-hidden flex-none">
      <img
        data-testid="layout-search-suggest-image"
        :src="getMainImageUrl(product)"
        class="h-8 w-8 object-cover"
        alt="Product image"
      />
    </div>
    <div class="flex items-center justify-between overflow-hidden gap-5 grow">
      <div
        data-testid="layout-search-suggest-name"
        class="text-gray-500 whitespace-nowrap overflow-hidden text-ellipsis"
      >
        {{ getTranslatedProperty(product, "name") }}
      </div>
      <div class="flex-none text-right">
        <SharedPrice
          v-if="unitPrice"
          data-testid="layout-search-suggest-price"
          class="justify-end"
          :value="unitPrice"
        >
          <template #beforePrice>
            <span v-if="displayFrom">from</span>
          </template>
        </SharedPrice>
        <ProductUnits
          data-testid="layout-search-suggest-units"
          :product="product"
          :show-content="false"
          class="text-3"
        />
      </div>
    </div>
  </div>
</template>
