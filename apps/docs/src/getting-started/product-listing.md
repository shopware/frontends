# Create a Product Listing

In this chapter you will learn how to

- Initialize the `useListing` composable
- Search for products
- Display listing elements
- Add pagination
- Sort the products
- TODO: Handle filters
- Use helpers

## Listing context

Product listing is a structure related to the predefined areas and it has always the same interface: `ProductListingResult`:

- Response of product-listing endpoint `/store-api/product-listing/{id}`
- Product search result
- Cms Page (via `product-listing` element, nested among other CMS element)

## Listing type & current context

Before using the composable, define the type (related to the context):

- `categoryListing` for navigation/category/cms pages
- `productSearchListing` for search page

```ts{3}
const { search, getElements } = useListing({
  listingType: "categoryListing",
  categoryId: "dfd52ab937f840fd87e9d24ebf6bd245",
});
```

The `categoryId` is obligatory only if the current page IS NOT a result of use of `useCms` composable (generated from Shopping Experiences).

:::info
If the `useListing` composable is used within a CMS Page, `categoryId` is resolved internally.
:::

## Define search criteria

In order to get the expected products, we need to define the search criteria. The criteria is an object of type Search Parameters explained in [documentation of API](https://shopware.stoplight.io/docs/store-api/cf710bf73d0cd-search-queries).

```ts
const { search } = useListing();

search({
  limit: 2, // get only 2 products
  p: 1, // page 1
  includes: {
    // things we actually need in the response for learning purposes
    product: ["id", "name", "cover", "calculatedPrice"],
    product_media: ["media"],
    media: ["url"],
  },
});
```

:::tip
Don't use `includes` parameter if you want to have the whole entity object available in the response. More about `includes` in the [documentation](https://shopware.stoplight.io/docs/store-api/cf710bf73d0cd-search-queries#includes-apialias).
:::

## Display listing elements (Products)

In order to display products of product listing we need to:

- Invoke `search()` method with positive result
- Iterate over `getElements` computed array of elements, where each element is in type of `Product`.

```vue{11,22}
<script setup lang="ts">
const { search, getElements } = useListing(
    listingType: "categoryListing",
    categoryId: "dfd52ab937f840fd87e9d24ebf6bd245", // entrypoint to browse
    defaultSearchCriteria: { // set the default criteria
        limit: 3,
        p: 1,
    },
)

search({ // invoke search() method
  includes: { // omit this parameter if you want to use the whole product entity
    product: ["id", "name", "cover", "calculatedPrice", "translated"],
    product_media: ["media"],
    media: ["url", "thumbnails"],
  },
});
</script>
<template>
 <div class="product-listing">
    <!-- iterate the getElements array -->
    <div v-for="product in getElements" :key="product.id">
        {{ product.name }}
        <!-- use other properties of type Product -->
    </div>
 </div>
</template>
```

## Sorting

Available methods of `useListing` to manage sorting order:

- `getSortingOrders()` - returns all available sorting options
- `getCurrentSortingOrder()` - returns the current order, available in the response
- `changeCurrentSortingOrder()` - sets the new order, invoking a `search` method internally

```ts{3-5}
// part of <script setup> section
const {
  getCurrentSortingOrder,
  getSortingOrders,
  changeCurrentSortingOrder,
} = useListing({
  listingType: "categoryListing",
  categoryId: "dfd52ab937f840fd87e9d24ebf6bd245",
  defaultSearchCriteria: {
    limit: 3,
    p: 1,
  },
});
```

Show all available sortings:

```html
<!-- part of <template> -->
<select>
  <option
    v-for="sortingOrder in getSortingOrders"
    :key="sortingOrder.key"
    :value="sortingOrder.key"
    :selected="sortingOrder.key === getCurrentSortingOrder"
  >
    {{ sortingOrder.label }}
  </option>
</select>
```

Refresh the product listing on option's change:

```ts{4-6}
const onOrderChange = (onOrderChangeEvent: Event) => {
    // accept the DOM Event and extract the option's value
    // pass the value to the listing method that triggers the search() method internally
    changeCurrentSortingOrder(
        (onOrderChangeEvent.target as HTMLSelectElement).value
    );
};
```

Add event listener to the `<select>` element:

```html
<select @change="onOrderChange"></select>
```

## Enable adding to the cart

To achieve this, you can use `useCart` composable which expose `addProduct` method, including other useful functions to manage a cart.

```ts
// part of <script setup> section
const { addProduct } = useCart();
```

Utilize the method in a template:

```html
<!-- part of <template> -->
<div>price: {{ product?.calculatedPrice?.unitPrice }} $</div>
<button @click="addProduct(product)">Add to cart</button>
```

Now, when the customer click the `Add to cart` button, the proper request is being sent to the API. After that, the cart is refreshed and up to date in entire application.

:::tip
Alternatively, instead of using `useCart`, you can use `useAddToCart` composable when you create a separate Vue component to keep a single `Product` for product listing. That option would enhance the code organization.
:::

## Add pagination

Pagination is available by using three methods from `useListing` composable:

- `getCurrentPage`
- `changeCurrentPage` - invokes `search()` method internally with the provided number of the page
- `getTotalPagesCount` - calculates the number of available pages depending on products per page parameters (i.e. `limit` in search criteria)

```ts{5-7}
// part of <script setup> section
const {
    search,
    getElements,
    getCurrentPage,
    changeCurrentPage,
    getTotalPagesCount
} = useListing({
    listingType: "categoryListing",
    categoryId: "dfd52ab937f840fd87e9d24ebf6bd245",
    defaultSearchCriteria: {
        limit: 3,
        p: 1,
    },
})
```

The implementation can look similar to:

```html
<!-- part of <template> -->
<div class="pagination">
  <div>pages: {{ getTotalPagesCount }}</div>
  <button
    v-if="getCurrentPage > 1"
    @click="changeCurrentPage(parseInt(getCurrentPage) - 1)"
  >
    prev
  </button>
  <span> {{ getCurrentPage }} </span>
  <button
    v-if="getCurrentPage < getTotalPagesCount"
    @click="changeCurrentPage(parseInt(getCurrentPage) + 1)"
  >
    next
  </button>
</div>
```

## Get some help using helpers package

The purpose of `@shopware-pwa/helpers-next` is to make developer's life easier.

In the present case, we could use the product's thumbnail or use the translated name, or even get the product details page's URL, if the application supports a routing.

```ts
// part of <script setup> section
import {
  getProductThumbnailUrl,
  getProductUrl,
  getTranslatedProperty,
} from "@shopware-pwa/helpers-next";
```

```html
<img
  :src="getProductThumbnailUrl(product)"
  width="100"
  height="100"
  :alt="product.name"
/>
<a :href="getProductUrl(product)">
  {{ getTranslatedProperty(product, "name") }}
</a>
```
