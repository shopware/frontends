<script setup lang="ts">
import type { Schemas } from "#shopware";

/**
 * ContentProductCard - Renders a product card
 */

// Component-specific props (add to schema later)
type ProductCardProps = {
  product?: {
    id: string;
    name: string;
    description?: string;
    cover?: {
      media?: {
        url: string;
      };
    };
    calculatedPrice?: {
      totalPrice: number;
    };
  };
};

const props = defineProps<{
  element: Schemas["ContentElement"];
  htmlProps?: Schemas["ContentHtmlProps"];
  props?: ProductCardProps;
}>();

const componentProps = (props.props ?? {}) as ProductCardProps;

// Extract product with defaults
const product = componentProps.product;
const imageUrl = product?.cover?.media?.url ?? "";
const price = product?.calculatedPrice?.totalPrice ?? 0;
</script>

<template>
  <div class="content-product-card bg-white rounded-lg shadow-md overflow-hidden">
    <!-- Product Image -->
    <div class="aspect-square bg-gray-100">
      <img
        v-if="imageUrl"
        :src="imageUrl"
        :alt="product?.name"
        class="w-full h-full object-cover"
        loading="lazy"
      />
      <div
        v-else
        class="w-full h-full flex items-center justify-center text-gray-400"
      >
        No image
      </div>
    </div>

    <!-- Product Info -->
    <div class="p-4">
      <h3 class="font-medium text-gray-900 truncate">
        {{ product?.name ?? "Product Name" }}
      </h3>
      <p
        v-if="product?.description"
        class="text-sm text-gray-500 mt-1 line-clamp-2"
      >
        {{ product.description }}
      </p>
      <p class="text-lg font-bold text-blue-600 mt-2">
        {{ price.toFixed(2) }} €
      </p>
    </div>

    <!-- Slot for actions -->
    <div v-if="$slots.default" class="px-4 pb-4">
      <slot />
    </div>
  </div>
</template>
