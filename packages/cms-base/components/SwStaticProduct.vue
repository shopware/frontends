<script setup lang="ts">
import { Product, ProductReview } from "@shopware-pwa/commons";
import { getTranslatedProperty } from "@shopware-pwa/helpers";
import { getProductReviews } from "@shopware-pwa/shopware-6-client";
import { Ref } from "vue";

const props = defineProps<{
  product: Product;
}>();

const reviews: Ref<ProductReview[]> = ref([]);

const { apiInstance } = useShopwareContext();
onMounted(async () => {
  const reviewsResponse = await getProductReviews(
    props.product.id,
    undefined,
    apiInstance
  );
  reviews.value = reviewsResponse?.elements || [];
});

const productName = computed(() =>
  getTranslatedProperty(props.product, "name")
);
const manufacturerName = computed(() =>
  getTranslatedProperty(props.product.manufacturer, "name")
);

const description = computed(() =>
  getTranslatedProperty(props.product, "description")
);
const properties = computed(() => props.product?.properties || []);
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
        <div class="container mx-auto pt-8 flex flex-row">
          <h1
            class="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl basis-4/6"
            v-html="productName"
          ></h1>
          <div class="basis-2/6 text-right">{{ manufacturerName }}</div>
        </div>
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
        <div class="container mx-auto mb-8">
          <!-- Description and details -->
          <div v-if="description">
            <h3 class="text-sm font-medium text-gray-900">Description</h3>
            <div class="mt-4 space-y-6">
              <p class="text-base text-gray-900" v-html="description"></p>
            </div>
          </div>

          <div class="mt-10" v-if="properties?.length">
            <h3 class="text-sm font-medium text-gray-900">Properties</h3>

            <div class="mt-4">
              <ul role="list" class="pl-4 list-disc text-sm space-y-2">
                <li
                  v-for="property in properties"
                  :key="property.id"
                  class="text-gray-400"
                >
                  <span class="text-gray-600">{{
                    getTranslatedProperty(property, "name")
                  }}</span>
                </li>
              </ul>
            </div>
          </div>

          <div class="mt-10" v-if="reviews?.length">
            <h3 class="text-sm font-medium text-gray-900">Reviews</h3>
            <div class="mt-4" v-if="reviews?.length">
              <ul role="list" class="pl-4 list-disc text-sm space-y-2">
                <li
                  v-for="review in reviews"
                  :key="review.id"
                  class="text-gray-400"
                >
                  <span class="text-gray-600">{{ review.content }}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
