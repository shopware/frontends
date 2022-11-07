# Creating wishlist

The wishlist can be used locally (for the not logged in customers) and can be synchronized with the backend (for the logged in customers)

`useLocalWishlist` - composable for local wishlist
`useSyncWishlist` - composable for synchronization wishlist
`useWishlist` - composable helper for wishlist page
`useProductWishlist` - composable helper for products

::: info
`useWishlist` and `useProductWishlist` check if user is logged in and decide what composable should be used
:::

## Wishlist page

### Get product list

::: warning
`getWishlistProducts` should not be invoke on the SSR
:::

```ts
const { getWishlistProducts, items } = useWishlist();
const products = ref<Product[]>([]);

const loadProductsByItemIds = async (itemIds: string[]): Promise<void> => {
  isLoading.value = true;

  try {
    const result = await getProducts(
      {
        ids: itemIds || items.value,
      },
      apiInstance
    );

    if (result) {
      products.value = result.elements;
    }
  } catch (error) {
    console.error(
      "[wishlist][loadProductsByItemIds]",
      (error as ClientApiError).messages
    );
  }

  isLoading.value = false;
};

watch(items, (items, oldItems) => {
  if (items.length !== oldItems.length) {
    products.value = products.value.filter(({ id }) => items.includes(id));
  }
  if (!items.length) {
    return;
  }
  loadProductsByItemIds(items);
});

onMounted(async () => {
  getWishlistProducts();
});
```

## Adding/removing to the wishlist
