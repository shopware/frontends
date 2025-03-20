<template>
  <div class="max-w-7xl mx-auto p-6 font-sans">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <!-- Left column - Product Gallery -->
      <ProductGallery :images="productImages" />

      <!-- Right column - Product details -->
      <div class="space-y-6">
        <div>
          <p class="text-outline-outline text-scale-02">Carl Hansen & Sen</p>
          <h1 class="text-surface-on-surface text-scale-07 font-serif mt-1">Product Name</h1>
        </div>

        <p class="text-surface-on-surface text-scale-04 font-medium">580,00 €</p>

        <!-- Color variant selector -->
        <VariantSelector :variants="colorVariants" :selected-variant="selectedVariant"
          @select="selectedVariant = $event" />

        <!-- Quantity changer -->
        <QuantityChanger :quantity="quantity" @update:quantity="quantity = $event" />

        <!-- Add to cart -->
        <AddToCart />

        <p class="text-scale-01 text-outline-outline">Meta information about purchase.</p>

        <!-- Product description -->
        <div class="text-surface-on-surface space-y-4 text-scale-02">
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed iaculis at lacus
            in efficitur. Nulla nec dolor iaculis purus tempus tristique ut nec arcu. In
            ullamcorper purus nec dolor pretium, ac lobortis sem condimentum. In
            consequat erat vel massa egestas, id fermentum velit pharetra.
          </p>
          <p>
            Pellentesque at venenatis lectus. Phasellus eu elementum nisi.
            Pellentesque lobortis risus sed magna pharetra, a aliquet leo viverra.
            Quisque fermentum dictum neque at iaculis.
          </p>
        </div>

        <div v-for="(category, index) in categories" :key="index" class="border-t border-outline-outline-variant py-4">
          <button @click="toggleCategory(index)"
            class="flex justify-between items-center w-full text-left font-medium text-surface-on-surface focus:outline-none bg-transparent">
            <span>{{ category.name }}</span>
            <ChevronDown class="h-5 w-5 text-surface-on-surface transition-transform duration-300"
              :class="{ 'rotate-180': activeCategory === index }" />
          </button>

          <div v-show="activeCategory === index" class="mt-2 text-sm text-gray-600">
            {{ category.content }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ChevronDown } from "lucide-vue-next";
import { ref } from "vue";
import AddToCart from "./LayoutAddToCart.vue";
import ProductGallery from "./LayoutProductGallery.vue";
import QuantityChanger from "./LayoutQuantityChanger.vue";
import VariantSelector from "./LayoutVariantSelector.vue";

// Product data
const productImages = [
  {
    id: 1,
    src: "https://placehold.co/600x600",
    alt: "Wooden chair with woven seat",
    isThumbnail: false,
  },
  {
    id: 2,
    src: "https://placehold.co/300x300",
    alt: "Wooden chair thumbnail 1",
    isThumbnail: true,
  },
  {
    id: 3,
    src: "https://placehold.co/300x300",
    alt: "Wooden chair thumbnail 2",
    isThumbnail: true,
  },
];

const colorVariants = [
  { id: 1, name: "Olive Green", value: "#606c38" },
  { id: 2, name: "Dark Green", value: "#283618" },
  { id: 3, name: "Light Orange", value: "#dda15e" },
  { id: 4, name: "Dark Orange", value: "#bc6c25" },
];

const categories = [
  {
    name: "Product details",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed iaculis at lacus in efficitur. Nulla nec dolor iaculis purus tempus tristique ut nec arcu. In ullamcorper purus nec dolor pretium, ac lobortis sem condimentum. In consequat erat vel massa egestas, id fermentum velit pharetra. Pellentesque at venenatis lectus. Phasellus eu elementum nisi. Pellentesque lobortis risus sed magna pharetra, a aliquet leo viverra. Quisque fermentum dictum neque at iaculis.",
  },
  {
    name: "Shipping & Returns",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed iaculis at lacus in efficitur. Nulla nec dolor iaculis purus tempus tristique ut nec arcu. In ullamcorper purus nec dolor pretium, ac lobortis sem condimentum. In consequat erat vel massa egestas, id fermentum velit pharetra. Pellentesque at venenatis lectus. Phasellus eu elementum nisi. Pellentesque lobortis risus sed magna pharetra, a aliquet leo viverra. Quisque fermentum dictum neque at iaculis.",
  },
  {
    name: "Reviews",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed iaculis at lacus in efficitur. Nulla nec dolor iaculis purus tempus tristique ut nec arcu. In ullamcorper purus nec dolor pretium, ac lobortis sem condimentum. In consequat erat vel massa egestas, id fermentum velit pharetra. Pellentesque at venenatis lectus. Phasellus eu elementum nisi. Pellentesque lobortis risus sed magna pharetra, a aliquet leo viverra. Quisque fermentum dictum neque at iaculis.",
  },
];

const activeCategory = ref(null);

const toggleCategory = (index) => {
  activeCategory.value = activeCategory.value === index ? null : index;
};

// State
const selectedVariant = ref(colorVariants[0]);
const quantity = ref(2);
</script>