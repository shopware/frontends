<script setup lang="ts">
import { computed } from "vue";
import { extractProperties } from "~/composables/useContentFactory";
import type { ProductCardProperties } from "~/composables/useContentProperties";
import type { Schemas } from "#shopware";

const props = defineProps<{
  element: Schemas["ContentElement"];
  properties: Record<string, unknown>;
}>();

// Type-safe property extraction
const { product, displayMode, layout } =
  extractProperties<ProductCardProperties>(props.properties, {
    product: { default: undefined },
    displayMode: { default: "standard" },
    layout: { default: "standard" },
  });

const productName = computed(
  () => product?.translated?.name || product?.name || "",
);
const productDescription = computed(
  () => product?.translated?.description || product?.description || "",
);
const productImage = computed(() => product?.cover?.media?.url || "");
const productPrice = computed(() => product?.calculatedPrice);
const productUrl = computed(() => {
  const seoUrls = product?.seoUrls;
  if (seoUrls && seoUrls.length > 0 && seoUrls[0]) {
    return `/${seoUrls[0].seoPathInfo}`;
  }
  return `/product/${product?.id}`;
});

const showDetails = computed(() => displayMode === "standard");
const isMinimal = computed(() => displayMode === "minimal");
const isImageOnly = computed(() => displayMode === "image");
</script>

<template>
  <div v-if="product" class="content-product-card group">
    <NuxtLink
      :to="productUrl"
      class="block bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden h-full"
    >
      <!-- Product Image -->
      <div class="relative aspect-square overflow-hidden bg-gray-100">
        <NuxtImg
          v-if="productImage"
          :src="productImage"
          :alt="productName"
          class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        <div v-else class="w-full h-full flex items-center justify-center text-gray-400">
          <span class="text-sm">No image</span>
        </div>
      </div>

      <!-- Product Info -->
      <div v-if="!isImageOnly" class="p-4">
        <!-- Product Name -->
        <h3
          class="font-semibold text-gray-900 mb-2 line-clamp-2"
          :class="isMinimal ? 'text-sm' : 'text-base'"
        >
          {{ productName }}
        </h3>

        <!-- Product Description (standard mode only) -->
        <p
          v-if="showDetails && productDescription"
          class="text-sm text-gray-600 mb-3 line-clamp-2"
        >
          {{ productDescription }}
        </p>

        <!-- Product Price -->
        <div v-if="productPrice" class="flex items-center justify-between">
          <div class="flex items-baseline gap-2">
            <span class="text-lg font-bold text-gray-900">
              {{ productPrice.totalPrice }}
            </span>
            <span
              v-if="productPrice.listPrice?.percentage"
              class="text-sm text-red-600 font-medium"
            >
              -{{ productPrice.listPrice.percentage }}%
            </span>
          </div>
        </div>

        <!-- Add to Cart button (standard mode only) -->
        <button
          v-if="showDetails"
          class="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
          @click.prevent="$emit('add-to-cart', product)"
        >
          Add to Cart
        </button>
      </div>
    </NuxtLink>
  </div>

  <!-- Fallback if no product -->
  <div v-else class="content-product-card-empty bg-gray-100 rounded-lg p-8 text-center">
    <span class="text-gray-400 text-sm">No product data</span>
  </div>
</template>
