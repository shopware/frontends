---
nav:
  position: 90
---

# Create a wishlist

In this chapter you will learn how to use the built-in wishlist API to create wishlist functionalities in your application. Specifically, you will learn how to

- Create a wishlist page
- Synchronize local and remote wishlist data
- Add products to and remove products from the wishlist

## Remote and local wishlists

In Shopware's Store API, only authenticated (logged-in) users can manage a custom wishlist.

The composables related to wishlists are built in a way that allows you to maintain a local (in-memory) wishlist for unauthenticated users and synchronize it with the server when the user logs in.

::: info
The `useWishlist` and `useProductWishlist` view helpers decide whether to use the local or the server wishlist based on the user's authentication status.
:::

| Composable           | Description                            |
| -------------------- | -------------------------------------- |
| `useLocalWishlist`   | manages the local (in-memory) wishlist |
| `useSyncWishlist`    | manages the remote (server) wishlist   |
| `useWishlist`        | view helper for the wishlist page      |
| `useProductWishlist` | view helper for a single product       |

## Get wishlist

You can use the `useWishlist` composable to get the wishlist products.

:::tip
`getWishlistProducts` method will detect if the customer is logged in or not
:::

```vue
<script>
import { getProducts } from "@shopware-pwa/api-client";
import { ClientApiError, Product } from "@shopware-pwa/types";

// Contains a list of products ids in the wishlist
const { getWishlistProducts, items } = useWishlist();

// Load products data
const loadProductsByItemIds = async (itemIds: string[]): Promise<void> => {
  isLoading.value = true;

  try {
    // Backend API call for product data
    const result = await getProducts(
      {
        ids: itemIds || items.value,
      },
      apiInstance
    );

    if (result) products.value = result.elements;
  } catch (error) {
    console.error(error);
  }
};

// Watch changes and update product data
watch(
  items,
  (items, oldItems) => {
    if (items.length !== oldItems?.length) {
      products.value = products.value.filter(({ id }) => items.includes(id));
    }
    if (!items.length) {
      return;
    }
    loadProductsByItemIds(items);
  },
  {
    immediate: true,
  }
);

onMounted(async () => {
  // Fetch wishlist products
  await getWishlistProducts();
});
</script>
<template>
  <div v-if="products.length">
    <h1>Wishlist</h1>
    <ProductCard
      v-for="product in products"
      :key="product.id"
      :product="product"
    />
  </div>
</template>
```

## Add product to the wishlist

You can use the `useProductWishlist` composable to add a product to the wishlist.
If the product is already added to the wishlist, the API will return an error.
To avoid such a situation, `isInWishlist` property should protect `addToWishlist` method.

:::tip
`addToWishlist` method will detect if the customer is logged in or not
:::

```vue
<script setup lang="ts">
// Mocked product
const product: Product = {
  id: "7b5b97bd48454979b14f21c8ef38ce08",
};
const { addToWishlist, isInWishlist } = useProductWishlist(product);
</script>

<template>
  <button v-if="!isInWishlist" @click="addToWishlist">
    Add product to wishlist
  </button>
</template>
```

## Remove product from the wishlist

You can use the `useProductWishlist` composable to remove a product from the wishlist.
If the product doesn't exist in the wishlist, the API will return an error.
To avoid such a situation, `isInWishlist` property should protect `removeFromWishlist` method.

:::tip
`removeFromWishlist` method will detect if the customer is logged in or not
:::

```vue
<script setup lang="ts">
// Mocked product
const product: Product = {
  id: "7b5b97bd48454979b14f21c8ef38ce08",
};
const { removeFromWishlist, isInWishlist } = useProductWishlist(product);
</script>

<template>
  <button v-if="isInWishlist" @click="removeFromWishlist">
    Remove product from the wishlist
  </button>
</template>
```

## Merge wishlists

To synchronize the local wishlist with the remote wishlist (associated with the user's account), the `mergeWishlistProducts()` method must be triggered after the customer has logged in.

```vue{10}
<script setup lang="ts">
const formData = ref({
  username: "",
  password: "",
});
const invokeLogin = async (): Promise<void> => {
  try {
    // Login function
    await login(formData.value);
    mergeWishlistProducts();
  } catch (error) {
    console.error(error);
  }
};
</script>
<template>
  <form @submit.prevent="invokeLogin">
    <div>
      <label for="email-address">Email address</label>
      <input
        id="email-address"
        v-model="formData.username"
        name="email"
        type="email"
        autocomplete="email"
        required
        placeholder="Email address"
      />
    </div>
    <div>
      <label for="password" class="sr-only">Password</label>
      <input
        id="password"
        v-model="formData.password"
        name="password"
        type="password"
        autocomplete="current-password"
        required
        placeholder="Password"
      />
    </div>
    <div>
      <button type="submit">Sign in</button>
    </div>
  </form>
</template>
```
