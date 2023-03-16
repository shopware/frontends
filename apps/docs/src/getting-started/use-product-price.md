# Product price

This article covers how to display prices for products in product listing and product details page using available helpers.

:::tip
To see how the prices are designed in the backend, read [Building > Prices](../getting-started/prices.md) article.
:::

## useProductPrice() composable

See dedicated [page](../packages/composables/useProductPrice.md) to see the details of the composable.

## Product listing

Price for **non-variant** product (also for having tier pricing):

```vue{6}
<script setup lang="ts">
const { unitPrice, displayFrom } = useProductPrice(/** argument omitted - Product object */);
</script>
<template>
<div>
  <span v-if="displayFrom">from</span>{{ unitPrice }} $
</div>
</template>
```

If there is a range of prices available, you can point this out by adding `from` prefix, using the `displayFrom` indicator. The result will be an unit price, prefixed by `from` phrase. In this case, unit price is equal to the lowest price available.

In order to ensure if the variant prices are available, you can utilize the `displayVariantsFrom` computed property, that contains the value in current currency:

```vue
<script setup lang="ts">
const { unitPrice, displayVariantsFrom } =
  useProductPrice(/** argument omitted - Product object */);
</script>
<template>
  <div>
    {{ unitPrice }} $
    <span v-if="displayVariantsFrom">
      Variants from {{ displayVariantsFrom }} $
    </span>
  </div>
</template>
```

## Product details page

In this case, there are few options to display:

- Regular price
- Product with list price (kind of discount)
- Tier prices

```ts
const { unitPrice, price, tierPrices, isListPrice } = useProductPrice(product);
const { getFormattedPrice } = usePrice();
```

Regular price, with list price included (in case of manufacturer's suggested retail price):

```vue
<template>
  <div v-if="isListPrice">
    {{ price?.listPrice?.price }} $
    <!-- old price before discount -->
  </div>
  <div v-if="unitPrice">
    {{ unitPrice }} $
    <!-- actual price after discount -->
  </div>
</template>
```

Tier prices presented as a table with range labeled by "to" and "from":

```vue
<template>
  <div>
    <table v-if="tierPrices.length">
      <!-- check if tierPrices array is not empty -->
      <tr v-for="(tierPrice, index) in tierPrices" :key="tierPrice.label">
        <td>
          <span v-if="index < tierPrices.length - 1"> To </span>
          <span v-else> From </span>
          {{ tierPrice.quantity }}
        </td>
        <td>{{ tierPrice.unitPrice }} $</td>
      </tr>
    </table>
    <div v-else>
      <!-- show the regular unit price instead -->
      {{ unitPrice }} $
    </div>
  </div>
</template>
```

## Format price according to current context

There are additional metadata available in current API context. One of them is current currency. In order to display price together with currency symbol applied to the current context, use `getFormattedPrice` helper:

```ts
const price = 12.95;
const { getFormattedPrice } = usePrice();
const priceWithCurrency = getFormattedPrice(price);
// output: 12.95 $
```

Thanks to this, the `priceWithCurrency` will have the current currency symbol prefixed or suffixed, according to the configuration.
