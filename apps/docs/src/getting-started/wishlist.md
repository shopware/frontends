# Create a wishlist

::: warning Work in progress
This page is currently work in progress and will be updated soon.
:::

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

## Wishlist page

### Get product list

::: warning
`getWishlistProducts` should not be invoked on server-side rendering calls
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
