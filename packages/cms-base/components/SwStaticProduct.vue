<script setup lang="ts">
defineProps({
  product: Object,
});
</script>

<template>
  <!-- Image gallery -->

  <div class="product-gallery lg:basis-3/5">
    <div
      class="mt-6 hidden aspect-w-1 aspect-h-4 rounded-lg overflow-hidden lg:block lg:px-8"
    >
      <SwProductGallery :product="product" />
    </div>
  </div>

  <div class="product-description lg:basis-2/5">
    <!-- Product info -->
    <div
      class="max-w-2xl mx-auto pb-16 px-4 sm:px-6 lg:max-w-7xl lg:pb-24 lg:px-8 lg:grid lg:grid-cols-1 lg:grid-rows-[auto] lg:gap-x-8"
    >
      <div class="lg:col-span-2 lg:pr-8 static-container">
        <CmsBlockProductHeading :product="product" />
      </div>

      <!-- Options -->
      <div class="mt-4 lg:mt-0 lg:row-span-3">
        <h2 class="sr-only">Product information</h2>
        <form class="product-variants mt-10">
          <SwProductPrice :product="product" />
          <SwVariantConfigurator :product="product" />
          <SwProductAddToCart :product="product" />
        </form>
      </div>

      <div class="py-10 lg:pt-6 lg:pb-16 lg:col-start-1 lg:col-span-2 lg:pr-8">
        <CmsBlockProductDescriptionReviews :product="product" />
      </div>
    </div>
  </div>
</template>
