<script setup lang="ts">
import type { Schemas } from "#shopware";
import {
  getSmallestThumbnailUrl,
  getTranslatedProperty,
} from "@shopware-pwa/helpers-next";

const props = defineProps<{ product: Schemas["Product"] }>();

const { product } = toRefs(props);
const { unitPrice, displayFrom } = useProductPrice(product);

const DEFAULT_THUMBNAIL_SIZE = 10;
const imageElement = ref(null);
const { width, height } = useElementSize(imageElement);

function roundUp(num: number) {
  return num ? Math.ceil(num / 100) * 100 : DEFAULT_THUMBNAIL_SIZE;
}

const srcPath = computed(() => {
  const biggestParam =
    width.value > height.value
      ? `width=${roundUp(width.value)}`
      : `height=${roundUp(height.value)}`;
  return `${getSmallestThumbnailUrl(
    product.value.cover?.media,
  )}?${biggestParam}&fit=crop,smart`;
});
</script>
<template>
  <div
    class="p-3 h-14 text-sm flex items-center gap-3 hover:bg-secondary-100 cursor-pointer transition duration-300 bg-white"
  >
    <div
      class="rounded-md border-1 border-secondary-200 overflow-hidden flex-none"
    >
      <img
        ref="imageElement"
        loading="lazy"
        data-testid="layout-search-suggest-image"
        :src="srcPath"
        class="h-8 w-8 object-cover"
        alt="Product image"
      />
    </div>
    <div class="flex items-center justify-between overflow-hidden gap-5 grow">
      <div
        data-testid="layout-search-suggest-name"
        class="text-secondary-500 whitespace-nowrap overflow-hidden text-ellipsis"
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
            <span v-if="displayFrom">{{ $t("product.price.from") }}</span>
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
