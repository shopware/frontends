<script setup lang="ts">
const { search, getElements: products } = useProductSearchListing();
const { addProduct, cartItems } = useCart();

await search({
  search: "prod",
});
// setInitialListing;()
function handleAddToCart(data: CustomEvent) {
  console.log("Product added to cart", data.detail);
  addProduct({
    id: data.detail.productId,
    quantity: data.detail.quantity,
  });
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
      <div class="flex flex-row gap-4">
        <ListingProductTile
          class="w-full"
          v-for="product in products"
          :product
        />
      </div>

      <h2>Cart</h2>
      <div>{{ cartItems.length }}</div>
    </NuxtLayout>
  </div>
</template>
