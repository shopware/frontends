<script setup lang="ts">
import type { Schemas } from "@shopware/api-client/store-api-types";

type Product = Schemas["Product"];

import { useProductAssociations } from "@shopware/composables/lib";
import { ChevronDown } from "lucide-vue-next";
import { computed, ref } from "vue";
import AddToCart from "./ProductAddToCart.vue";
import ProductGallery from "./ProductGallery.vue";
import QuantityChanger from "./ProductQuantityChanger.vue";
import VariantSelector from "./ProductVariantSelector.vue";

// Define product prop
const props = defineProps<{
  product: Product;
}>();

const { loadAssociations, productAssociations } = useProductAssociations(
  computed(() => props.product),
  {
    associationContext: "cross-selling",
  },
);

// Map product properties to color variants if available
const colorVariants = computed(() => {
  if (!props.product.options) return [];

  // Find color options if they exist
  const colorOptions = props.product.options.filter(
    (option) =>
      option.group?.name?.toLowerCase().includes("color") ||
      option.name?.toLowerCase().includes("color"),
  );

  return (
    colorOptions.map((option) => ({
      id: option.id,
      name: option.name || "",
      value: option.colorHexCode || "#000000", // Fallback to black if no hex code
    })) || []
  );
});

const categories: { id: string; name: string; content: string }[] = [
  {
    id: "details",
    name: "Product details",
    content: props.product.description || "No product details available.",
  },
  {
    id: "shipping",
    name: "Shipping & Returns",
    content:
      props.product?.deliveryTime?.translated?.name ||
      "Please contact us for shipping and return information.",
  },
  {
    id: "reviews",
    name: "Reviews",
    content: "No reviews available for this product yet.",
  },
];

const activeCategory = ref<{
  id: string;
  name: string;
  content: string;
} | null>(null);

const toggleCategory = (index: string) => {
  activeCategory.value =
    categories.find((category) => category.id === index) || null;
};

// State
const selectedVariant = ref(
  colorVariants.value.length > 0 ? colorVariants.value[0] : null,
);
const quantity = ref(1);

// Format price with currency
const formattedPrice = computed(() => {
  if (!props.product.calculatedPrice) return "";

  const price = props.product.calculatedPrice.unitPrice;
  const currency = "€";

  return `${price.toFixed(2)} ${currency}`;
});

// Get manufacturer name
const manufacturerName = computed(() => {
  return props.product.manufacturer?.name || "";
});

onMounted(() => {
  loadAssociations({
    searchParams: {
      limit: 4,
    },
  });
});
</script>
<template>
  <div class="max-w-7xl mx-auto p-6 py-12 font-sans bg-surface-surface">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <!-- Left column - Product Gallery -->
      <ProductGallery v-if="product.media?.length" :images="product.media" />

      <!-- Right column - Product details -->
      <div class="space-y-9">
        <div>
          <p class="text-outline-outline text-scale-02">{{ manufacturerName }}</p>
          <h1 class="text-surface-on-surface text-scale-07 font-serif mt-1">{{ product.name }}</h1>
        </div>

        <p class="text-surface-on-surface text-scale-04 font-medium">{{ formattedPrice }}</p>

        <!-- Color variant selector - only show if variants exist -->
        <VariantSelector 
          v-if="colorVariants.length > 0"
          :variants="colorVariants" 
          @select="selectedVariant = $event" 
        />

        <!-- Quantity changer -->
        <QuantityChanger :quantity="quantity" @update:quantity="quantity = $event" />

        <!-- Add to cart -->
        <div class="space-y-2">
          <AddToCart 
            :product="product"
            :quantity="quantity"
            :selected-options="selectedVariant ? [selectedVariant.id] : []"
          />
          <p class="text-scale-01 text-outline-outline">
            {{ product.deliveryTime || 'Standard delivery times apply' }}
          </p>
        </div>
        
        <!-- Product description -->
        <div class="self-stretch justify-start text-surface-on-surface font-['Inter'] text-surface-on-surface space-y-2">
          <div v-html="product.description"></div>
        </div>

        <div v-for="category in categories" :key="category.id" class="border-t border-outline-outline-variant py-4">
          <button @click="toggleCategory(category.id)"
            class="flex justify-between items-center w-full text-left font-medium text-surface-on-surface focus:outline-none bg-transparent">
            <span>{{ category.name }}</span>
            <ChevronDown class="h-5 w-5 text-surface-on-surface transition-transform duration-300"
              :class="{ 'rotate-180': activeCategory?.id === category.id }" />
          </button>

          <div v-show="activeCategory?.id === category?.id" class="mt-2 text-sm text-gray-600">
            {{ category.content }}
          </div>
        </div>
      </div>
    </div>
    
    <ProductCrossSelling v-for="crossSelling in productAssociations" :key="crossSelling.crossSelling.id" :crossSelling="crossSelling"/>
  </div>
</template>