---
head:
  - - meta
    - name: og:title
      content: Prices
  - - meta
    - name: og:description
      content: "Learn how to work with prices in Shopware Frontends."
  - - meta
    - name: og:image
      content: "https://frontends-og-image.vercel.app/Working%20with%20**Prices**.png"
---

# Prices

In this chapter you will learn how

- The price object is structured
- To format and indicate pricing tiers
- Display the correct prices depending on context

## Structure of a price

A product in Shopware can have multiple prices. All these prices are defined in a `CalculatedPrice` object, which contains the following fields:

| Field               | Description                                                                                                         |
| ------------------- | ------------------------------------------------------------------------------------------------------------------- |
| **unitPrice**       | The price of a single product item (e.g. only selling toilet rolls in packs of 12)                                  |
| **quantity**        | The quantity of units that the price applies to (usually 1)                                                         |
| **totalPrice**      | The price for one product                                                                                           |
| **calculatedTaxes** | The calculated tax rates and their proportions of the total price                                                   |
| **taxRules**        | Composition of the underlying tax rates                                                                             |
| **referencePrice**  | The price per unit (e.g. 1.99€ per 100g)                                                                            |
| **listPrice**       | The list price of the product                                                                                       |
| **regulationPrice** | Some local laws enforce showing the cheapest price within the last 30 days. This is the price that is used for that |

::: details Example of a `CalculatedPrice` object

```json
{
  "unitPrice": 58,
  "quantity": 1,
  "totalPrice": 58,
  "calculatedTaxes": [
    {
      "tax": 9.26,
      "taxRate": 19,
      "price": 58,
      "apiAlias": "cart_tax_calculated"
    }
  ],
  "taxRules": [
    {
      "taxRate": 19,
      "percentage": 100,
      "apiAlias": "cart_tax_rule"
    }
  ],
  "referencePrice": null,
  "listPrice": {
    "price": 83.3,
    "discount": -25.3,
    "percentage": 30.37,
    "apiAlias": "cart_list_price"
  },
  "regulationPrice": {
    "price": 54,
    "apiAlias": "cart_regulation_price"
  },
  "apiAlias": "calculated_price"
}
```

:::

Each product has at least one `CalculatedPrice` object assigned to it, which can be acessed through `product.calculatedPrice`. It contains the default price of the product, which applies when no other prices are defined.

## Display a default price

All prices are passed as floating point numbers, rounded to the decimals which are specified in your stores currency settings. You can use the `getFormattedPrice` helper method to apply the the correct formatting including currency symbol to the price.

<div class="mx-auto p-10 shadow-md rounded-md dark:bg-#242424">
	<div><b>Phantom™ Weekender Boardshorts 20"</b></div>
	<div>40.00 € <small>incl. 19% tax</small></div>
	<div>
		<small class="text-green-600"><del class="text-slate-500">83.30 €</del> (-51.98%) </small>
	</div>
</div>

```vue{4,16,24}
<script setup>
import { useProduct } from "@shopware-pwa/composables-next";

const { getFormattedPrice } = usePrice();
const { product, search } = useProduct();

await search("some-product-id");
</script>

<template>
  <div>
    <div>
      <b>{{ product.name }}</b>
    </div>
    <div>
      {{ getFormattedPrice(product.calculatedPrice.totalPrice) }}
      <small>
        incl. {{ product.calculatedPrice.taxRules[0].taxRate }}% tax
      </small>
    </div>
    <div v-if="!!product.calculatedPrice.listPrice">
      <small>
        <del>
          {{ getFormattedPrice(product.calculatedPrice.listPrice.price) }}
        </del>
        (-{{ product.calculatedPrice.listPrice.percentage }}%)
      </small>
    </div>
  </div>
</template>
```

## Pricing tiers and quantity prices

Pricing tiers add one layer of complextity into the pricing model. In Shopware, you can define multiple pricing tiers for a product. Each tier has a quantity and a price.

These pricing tiers are passed through the `calculatedPrices` field of a product. The `calculatedPrices` field is an array of `CalculatedPrice` objects, which are sorted by the `quantity` field (which defines the bounds of a pricing range).

```json
[
	{
		"unitPrice": 58,
		"quantity": 5, // quantity from 1 to 5
		"totalPrice": 290,
		/* ... */
	},
	{
		"unitPrice": 50,
		"quantity": 10, // quantity from 6 to 10
		"totalPrice": 500,
		/* ... */
	},
	{
		"unitPrice": 44,
		"quantity": 11, // quantity from 11 to max
		"totalPrice": 484,
		/* ... */
]
```

### Display tier prices

Displaying tier prices is fairly straightforward. You can just iterate through the `calculatedPrices` array and display the quantity limit and price for each tier.

<div
class="mx-auto p-10 shadow-md rounded-md dark:bg-#242424 text-gray-700 dark:text-gray-200"
>
<div class="grid divide-y divide-slate-300 dark:divide-gray-600 text-sm">
	<div class="grid grid-cols-2 p-3">
	<div>Quantity</div>
	<div>Price</div>
	</div>
	<div class="grid grid-cols-2 p-3">
	<div>to 5</div>
	<div>58.00 €</div>
	</div>
	<div class="grid grid-cols-2 p-3">
	<div>to 10</div>
	<div>50.00 €</div>
	</div>
	<div class="grid grid-cols-2 p-3">
	<div>to 15</div>
	<div>44.00 €</div>
	</div>
	<div class="grid grid-cols-2 p-3">
	<div>from 16</div>
	<div>40.00 €</div>
	</div>
</div>
</div>

```vue{3,9}
<script setup>
import { useProduct } from "@shopware-pwa/composables-next";

const { getFormattedPrice } = usePrice();
const { product, search } = useProduct();

await search("some-product-id");
</script>

<template>
  <ul>
    <li
      v-for="(tierPrice, index) in product.calculatedPrices"
      :key="tierPrice.quantity">
        <!-- Display "from" or "to" depending on quantity level -->
        {{ index == product.calculatedPrices.length - 1 ? 'from' : 'to' }}
        {{ tierPrice.quantity }} -
        {{ getFormattedPrice(tierPrice.unitPrice) }}
    </li>
  </ul>
</template>
```

### Advanced prices

For more complex pricing models, Shopware also supports advanced prices. The API automatically determines the correct prices for a product based on the user's context, so you don't have to deal with it in your frontend.

## Display the correct price

There's the intricacy that the `calculatedPrice` field of a product is not always the default price, since there may be tier prices OR a single advanced price defined for the product. For that reason, you should create a switch within your template that differs correctly. You can use the following sudo-code as a starting point:

**if `product.calculatedPrices.length` is more than 1**

<div class="border-l ml-2 pl-2 mb-3">
Display <a href="#display-tier-prices">pricing tier table</a>
</div>

**else**

<div class="border-l ml-2 pl-2 mb-3">

**if `product.calculatedPrices.length` equals 1**

<div class="border-l ml-2 pl-2 mb-3">
<strong>set</strong> <code>product.calculatedPrice</code> <strong>to</strong> <code>product.calculatedPrices[0]</code>
</div>
Display <a href="#display-prices">default price</a>
</div>

### Full example

See a full example of displaying the default price or pricing tiers depending on the product's pricing structure below:

:::details Click to expand full example

```vue
<script setup>
import { useProduct } from "@shopware-pwa/composables-next";

const { getFormattedPrice } = usePrice();
const { product, search } = useProduct();

await search("some-product-id");

// If there is exactly one pricing tier, use it as the default price.
// Otherwise use the calculatedPrice
const defaultPrice = computed(() => {
  if (product.value?.calculatedPrices?.length === 1) {
    return product.value.calculatedPrices[0];
  }
  return product.value?.calculatedPrice;
});
</script>

<template>
  <ul v-if="product.calculatedPrices.length > 1">
    <!-- Show pricing tiers -->
    <li
      v-for="(tierPrice, index) in product.calculatedPrices"
      :key="tierPrice.quantity"
    >
      <!-- Display "from" or "to" depending on quantity level -->
      {{ index == product.calculatedPrices.length - 1 ? "from" : "to" }}
      {{ tierPrice.quantity }} -
      {{ getFormattedPrice(tierPrice.unitPrice) }}
    </li>
  </ul>

  <div v-else>
    <!-- Show default price -->
    <div>
      {{ getFormattedPrice(defaultPrice.totalPrice) }}
      <small> incl. {{ defaultPrice.taxRules[0].taxRate }}% tax </small>
    </div>
    <div v-if="!!defaultPrice.listPrice">
      <small>
        <del>
          {{ getFormattedPrice(defaultPrice.listPrice.price) }}
        </del>
        (-{{ defaultPrice.listPrice.percentage }}%)
      </small>
    </div>
  </div>
</template>
```

:::
