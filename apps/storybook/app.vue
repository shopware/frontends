<script setup lang="ts">
import { createAPIClient } from "@shopware/api-client";

const apiClient = createAPIClient({
  baseURL: "https://demo-frontends.shopware.store/store-api/",
  accessToken: "SWSCBHFSNTVMAWNZDNFKSHLAYW",
});

const products = ref(
  await apiClient.invoke("searchPage post /search", {
    body: {
      search: "tes",
      limit: 10,
    },
    headers: {
      "sw-include-seo-urls": true,
    },
  }),
);
function handleAddToCart(data: CustomEvent) {
  console.log("Product added to cart", data.detail);
}
onMounted(() => {
  window.addEventListener("add-to-cart", (data) => {
    handleAddToCart(data as CustomEvent);
  });
});

onBeforeMount(() => {
  window.removeEventListener("add-to-cart", (data) => {
    handleAddToCart(data as CustomEvent);
  });
});
</script>

<template>
  <div>
    <NuxtLayout>
      <NuxtPage />

      <h2>Listing example</h2>
 <pre>  {{  products.data.elements[0] }} </pre>
 <ListingProductTile v-for="element in products.data.elements" :key="element.id"
        :product="element" />
      <!-- <ListingProductTile
        :product="{
          translated: {
            name: 'Product Name',
          },
          cover: {
            media: [
              {
                url: 'https://cdn.shopware.store/a/B/m/pPkDE/media/37/23/07/SW10085.jpg?width=1920&ts=1596695194',
              },
            ],
          },
          calculatedCheapestPrice: {
            unitPrice: 100,
          },
    }" /> -->
    </NuxtLayout>
  </div>
</template>
