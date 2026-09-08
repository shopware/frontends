---
nav:
  position: 60
recipe:
  area: catalog
  status: stable
  frameworks:
    - vue
  composables:
    - useProductAssociations
    - useProduct
  helpers:
    - getTranslatedProperty
    - getProductRoute
  operations:
    - readProductCrossSellings post /product/{productId}/cross-selling
    - readProductDetail post /product/{productId}
  schemas:
    - CrossSellingElementCollection
    - CrossSellingElement
    - ProductCrossSelling
    - Product
---

<script setup>
import RecipeFlowDiagram from "../../components/RecipeFlowDiagram.vue";
import SchemaTypeTooltip from "../../components/SchemaTypeTooltip.vue";

const steps = [
  {
    title: "Page",
    action: "Provide a product",
    detail:
      "useProductAssociations takes a ComputedRef of the product and throws immediately if it is empty. The product has to be resolved before the composable is created.",
    code: "useProductAssociations(product, { associationContext: 'cross-selling' })",
    state: "product ref",
    typeKeys: ['Schemas["Product"]'],
  },
  {
    title: "UI",
    action: "Trigger the load",
    detail:
      "Nothing loads on its own. loadAssociations is called explicitly, and its declared params argument is ignored by the implementation.",
    code: "await loadAssociations({ searchParams: {} })",
    state: "isLoading",
    typeKeys: [],
  },
  {
    title: "Store API",
    action: "Read the collections",
    detail:
      "The operation takes only a product id in the path and two optional headers. It declares no request body at all, which is why no criteria can be passed.",
    code: 'apiClient.invoke("readProductCrossSellings post /product/{productId}/cross-selling")',
    state: "sw-context-token",
    typeKeys: [
      'operations["readProductCrossSellings post /product/{productId}/cross-selling"]["response"]',
    ],
  },
  {
    title: "Response",
    action: "An array of groups",
    detail:
      "The response is a bare array of cross-selling elements. Each one carries its configuration, its products and its own total — there is no outer envelope.",
    code: "associations.value = response.data",
    state: "productAssociations",
    typeKeys: ['Schemas["CrossSellingElement"]'],
  },
  {
    title: "UI",
    action: "Filter empty groups",
    detail:
      "A configured group can come back with no products. Filter on products.length before rendering, or the page shows an empty tab with a heading.",
    code: "productAssociations.filter((group) => group.products.length)",
    state: "reactive UI",
    typeKeys: ['Schemas["ProductCrossSelling"]'],
  },
  {
    title: "Errors",
    action: "Fail silently",
    detail:
      "loadAssociations catches its own errors and logs them. isLoading returns to false and productAssociations keeps whatever it held before.",
    code: "catch (error) { console.error(...) }",
    state: "productAssociations unchanged",
    typeKeys: [],
  },
];
</script>

# Cross-Selling and Associations

## Goal

Render the cross-selling groups of a product — "customers also bought", accessories, a related stream. The important part is what this operation does _not_ accept: it declares no request body, so the criteria argument the composable advertises has nowhere to go, and the association context it takes is never used.

## Shopware Flow

`readProductCrossSellings post /product/{productId}/cross-selling` is a `POST` with no request body. Its entire input is the product id in the path plus two optional headers, `sw-language-id` and `sw-include-seo-urls`. There is nothing to filter, sort or paginate.

The response is a bare array — `CrossSellingElementCollection` is `CrossSellingElement[]`, not an object wrapping one. Each element carries its `crossSelling` configuration, its `products`, and its own `total`, so a page with three cross-selling groups gets all three, fully populated, in one request.

<RecipeFlowDiagram label="Cross-selling flow diagram" :steps="steps" />

Read the diagram from left to right:

1. A resolved product ref is passed to `useProductAssociations(product, options)`, which throws if the ref is empty.
2. `loadAssociations()` is called explicitly — the composable loads nothing on mount.
3. The request carries the product id and, when `includeSeoUrls` is set, the `sw-include-seo-urls` header.
4. The response array becomes `productAssociations`.
5. The UI filters out groups whose `products` array is empty before rendering.
6. A failed request is caught and logged, leaving `productAssociations` at its previous value.

You do not need this composable on a CMS-driven product page. The cross-selling CMS element receives its groups in the page payload, so the request is only needed where you build the detail page yourself.

## Request Flow

| Step                   | Code                                     | Store API                                 | Type                                                                                                                        |
| ---------------------- | ---------------------------------------- | ----------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| Resolve the product    | `useProductSearch().search(productId)`   | `POST /product/{productId}`               | <SchemaTypeTooltip type-key='operations["readProductDetail post /product/{productId}"]["response"]' />                      |
| Load the groups        | `loadAssociations({ searchParams: {} })` | `POST /product/{productId}/cross-selling` | none — the operation declares no request body                                                                               |
| Read the groups        | `productAssociations`                    | `POST /product/{productId}/cross-selling` | <SchemaTypeTooltip type-key='operations["readProductCrossSellings post /product/{productId}/cross-selling"]["response"]' /> |
| Read one group         | `group.crossSelling`, `group.products`   | none                                      | <SchemaTypeTooltip type-key='Schemas["CrossSellingElement"]' />                                                             |
| Read its configuration | `group.crossSelling.position`, `.type`   | none                                      | <SchemaTypeTooltip type-key='Schemas["ProductCrossSelling"]' />                                                             |

The load row has no `Type` cell because there is nothing to type. That is the fact this whole recipe hangs on.

## Composables

- `useProductAssociations`: takes a `ComputedRef<Product>` and an options object with `associationContext` and an optional `includeSeoUrls`. Exposes `productAssociations`, `isLoading` and `loadAssociations`.
- `useProduct`: supplies the product ref on a detail page. `useProduct()` injects the product a parent provided, which is the ref to hand to `useProductAssociations`.

## Types

Use generated Store API types when you need to type the response, one group, or lower-level API client calls:

<div style="display: flex; flex-wrap: wrap; gap: 6px; margin: 12px 0 18px;">
  <SchemaTypeTooltip type-key='operations["readProductCrossSellings post /product/{productId}/cross-selling"]["response"]' />
  <SchemaTypeTooltip type-key='Schemas["CrossSellingElementCollection"]' />
  <SchemaTypeTooltip type-key='Schemas["CrossSellingElement"]' />
  <SchemaTypeTooltip type-key='Schemas["ProductCrossSelling"]' />
  <SchemaTypeTooltip type-key='Schemas["Product"]' />
</div>

```ts
import type { Schemas, operations } from "#shopware";

type CrossSellingResponse =
  operations["readProductCrossSellings post /product/{productId}/cross-selling"]["response"];
type CrossSellingCollection = Schemas["CrossSellingElementCollection"];
type CrossSellingElement = Schemas["CrossSellingElement"];
type CrossSellingConfig = Schemas["ProductCrossSelling"];
```

`CrossSellingCollection` is declared as an array in the schema, so `productAssociations` is iterable directly. There is no `elements` key to unwrap here, unlike every other list in the Store API.

## Minimal Vue Example

```vue
<script setup lang="ts">
import { getProductRoute, getTranslatedProperty } from "@shopware/helpers";

import type { Schemas } from "#shopware";

const { product } = defineProps<{ product: Schemas["Product"] }>();

const { productAssociations, isLoading, loadAssociations } =
  useProductAssociations(
    computed(() => product),
    { associationContext: "cross-selling", includeSeoUrls: true }
  );

const activeGroup = ref(0);

// a configured group can come back with no products at all
const groups = computed(() =>
  productAssociations.value.filter((group) => group.products.length > 0)
);

onMounted(() => {
  // nothing is loaded automatically, and the argument is ignored
  loadAssociations({ searchParams: {} });
});
</script>

<template>
  <p v-if="isLoading">Loading recommendations…</p>

  <section v-else-if="groups.length">
    <nav v-if="groups.length > 1">
      <button
        v-for="(group, index) in groups"
        :key="group.crossSelling.id"
        type="button"
        :aria-pressed="activeGroup === index"
        @click="activeGroup = index"
      >
        {{ getTranslatedProperty(group.crossSelling, "name") }}
      </button>
    </nav>

    <template v-for="(group, index) in groups" :key="group.crossSelling.id">
      <div v-if="activeGroup === index">
        <h2>{{ getTranslatedProperty(group.crossSelling, "name") }}</h2>

        <ul>
          <li
            v-for="crossSellProduct in group.products"
            :key="crossSellProduct.id"
          >
            <NuxtLink :to="getProductRoute(crossSellProduct)">
              {{ getTranslatedProperty(crossSellProduct, "name") }}
            </NuxtLink>
          </li>
        </ul>

        <p v-if="group.total > group.products.length">
          Showing {{ group.products.length }} of {{ group.total }}
        </p>
      </div>
    </template>
  </section>
</template>
```

There is no way to load the remainder when `total` exceeds the returned products. The cap comes from `crossSelling.limit`, configured in the Admin, and the operation takes no limit and no page of its own — so the count is informational only.

## State And Session

`productAssociations` is a local `ref([])` inside each `useProductAssociations()` call. Nothing is provided or shared, so two instances for the same product each issue their own request.

The response depends on the session context like any product data. Prices on the cross-sold products are calculated for the current currency and tax state, and a product excluded by the customer's rules does not appear. Switching currency or language invalidates the loaded groups, and nothing reloads them for you.

`includeSeoUrls` is the one option that has an effect. Setting it adds `sw-include-seo-urls: true`, which is what `getProductRoute` needs to build a link — without it the cross-sold products come back with no SEO URLs.

## Edge Cases

- `loadAssociations` declares a `params` argument with `method` and `searchParams`, and the implementation takes no parameters at all. Both are ignored, and the commented-out code that once used them is still in the source.
- `options.associationContext` accepts `"cross-selling" | "reviews"`, but the implementation always calls the cross-selling operation. Passing `"reviews"` fetches cross-sellings. Use `useProductReviews` for reviews.
- The operation declares no request body, which is the underlying reason `searchParams` cannot work. There is nothing to send.
- Errors are caught, logged to the console and swallowed. `productAssociations` keeps its previous value, so a failed reload looks identical to a successful one that changed nothing.
- The composable throws `[useProductAssociations]: Product is not provided.` during setup when the product ref is empty. Resolve the product first.
- `CrossSellingElementCollection` is an array, not an object with `elements`. Iterate it directly.
- A configured cross-selling group can return zero products — a stream that currently matches nothing, or products hidden by the customer's rules. Filter on `products.length`.
- `group.total` can exceed `group.products.length` because `crossSelling.limit` caps how many products the group returns. There is no way to fetch the rest through this operation.
- Without `includeSeoUrls: true` the returned products carry no `seoUrls`, so `getProductRoute` falls back to a non-SEO route.
- On a CMS-driven product page the cross-sellings are already in the CMS element's `data.crossSellings`. Calling this composable there duplicates a request the page already made.

## Common Mistakes

- Do not pass criteria to `loadAssociations`. They are discarded.
- Do not use `associationContext: "reviews"` and expect reviews.
- Do not expect `loadAssociations` to run on mount.
- Do not treat a resolved `loadAssociations()` as proof the request succeeded. Errors are swallowed.
- Do not read `productAssociations.elements`. It is an array.
- Do not render a group without checking `products.length`.
- Do not offer a "show more" control per group. The operation cannot page.
- Do not omit `includeSeoUrls` when the groups link to product pages.
- Do not call this composable on a CMS product page that already has the data.

## Testing Checklist

- Creating the composable with an empty product ref throws during setup.
- `loadAssociations()` issues exactly one `readProductCrossSellings post /product/{productId}/cross-selling` request.
- The request carries no body.
- With `includeSeoUrls: true` the request carries the `sw-include-seo-urls` header, and the rendered links use the SEO path.
- Groups with an empty `products` array are not rendered.
- `isLoading` is `true` during the request and `false` afterwards, including on failure.
- A failed request leaves the previously rendered groups in place.
- A group whose `total` exceeds its `products` length renders the count without a paging control.

## Related Links

- [Product detail page](../../getting-started/e-commerce/product-detail-page.html)
- [Product listing documentation](../../getting-started/e-commerce/product-listing.html)
- [CMS base layer package](../../packages/cms-base-layer.html)
- [Helpers package](../../packages/helpers.html)
- [Composables reference](../../packages/composables/)
