# Simple Product Detail Page

::: tip 🙋‍♀️ How to use these example?
Just copy the code snippet and paste it into your project. Sometimes it's useful to create a new component and use it in a higher level component like a page or a layout.
:::

See also the [complete guide](../../../../getting-started/e-commerce/product-detail-page) about the product detail page from the BUILDING section.

## Simple Product Detail Page

<div class="flex flex-col items-center">

<img src="./pdp-simple-example.png" alt="Image of Product Detail Page simple example" class="border-1px border-#eeeeee rounded-md shadow-md my-8 hover:shadow-2xl hover:scale-105 transition duration-200" />

</div>

<div>

Path: `templates/vue-demo-store/components/product/ProductStatic.vue`

```vue
<script setup lang="ts">
import type { Product, ProductReview } from "@shopware-pwa/types";
import {
  getProductRoute,
  getTranslatedProperty,
} from "@shopware-pwa/helpers-next";
import { getProductReviews } from "@shopware-pwa/api-client";
import type { Ref } from "vue";

const reviews: Ref<ProductReview[]> = ref([]);
const router = useRouter();

const { search } = useProductSearch();
const { data: productResponse } = await useAsyncData(
  "productExample",
  async () => {
    const productResponse = await search("4fd7aa46370147d4963784e4e8821f8c", {
      withCmsAssociations: true,
    });
    return productResponse;
  },
);

const { product } = useProduct(
  productResponse.value?.product,
  productResponse.value?.configurator,
);

const { apiInstance } = useShopwareContext();
onMounted(async () => {
  const reviewsResponse = await getProductReviews(
    product.value.id,
    undefined,
    apiInstance,
  );
  reviews.value = reviewsResponse?.elements || [];
});

const productName = computed(() =>
  getTranslatedProperty(product.value, "name"),
);
const manufacturerName = computed(() =>
  getTranslatedProperty(product.value.manufacturer, "name"),
);

const description = computed(() =>
  getTranslatedProperty(product.value, "description"),
);
const properties = computed(() => product.value?.properties || []);

const handleVariantChange = (val: Product) => {
  const newRoute = getProductRoute(val);
  router.push(newRoute);
};
</script>

<template>
  <div class="m-5 flex flex-row flex-wrap justify-start">
    <!-- Product name for mobile view -->
    <div class="basis-12/12 display lg:hidden">
      <h1
        class="pl-4 py-4 text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl"
        v-html="productName"
      />
    </div>
    <div class="basis-12/12 lg:basis-7/12 product-gallery overflow-hidden">
      <ProductGallery :product="product" />
    </div>
    <div class="basis-12/12 lg:basis-5/12 product-description">
      <!-- Product info -->
      <div
        class="max-w-2xl mx-auto pb-16 px-4 sm:px-6 lg:max-w-7xl lg:pb-24 lg:pl-16 lg:pr-0"
      >
        <!-- Product name starting from lg breakpoint -->
        <div
          class="hidden lg:block text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl"
          v-html="productName"
        />

        <div
          v-show="manufacturerName !== ''"
          class="lg:col-span-2 lg:pr-8 static-container"
        >
          <div class="container mx-auto pt-8 flex flex-row">
            <div class="basis-2/6 text-right">
              {{ manufacturerName }}
            </div>
          </div>
        </div>

        <!-- Options -->
        <div class="mt-4 lg:mt-0 lg:row-span-3">
          <h2 class="sr-only">Product information</h2>
          <div class="product-variants mt-10">
            <ProductPrice :product="product" />
            <ProductUnits :product="product" class="text-sm" />
            <ProductVariantConfigurator @change="handleVariantChange" />
            <ProductAddToCart :product="product" />
          </div>
        </div>

        <div
          class="py-10 lg:pt-6 lg:pb-16 lg:col-start-1 lg:col-span-2 lg:pr-8"
        >
          <div class="container mx-auto mb-8">
            <!-- Description and details -->
            <div v-if="description">
              <h3 class="text-sm font-bold text-gray-900">
                {{ $t("product.description") }}
              </h3>
              <div class="mt-4 space-y-6">
                <div class="text-base text-gray-900" v-html="description" />
              </div>
            </div>

            <div v-if="properties?.length" class="mt-10">
              <h3 class="text-sm font-medium text-gray-900">
                {{ $t("product.price.properties") }}
              </h3>

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

            <div v-if="reviews?.length" class="mt-10">
              <h3 class="text-sm font-medium text-gray-900">
                {{ $t("product.reviews") }}
              </h3>
              <div v-if="reviews?.length" class="mt-4">
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
  </div>
</template>
```

</div>
