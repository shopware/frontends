---
nav:
  position: 40
recipe:
  area: catalog
  status: stable
  frameworks:
    - vue
  composables:
    - useProductAssociations
    - useProductSearch
    - useProduct
  helpers:
    - getTranslatedProperty
    - getProductRoute
  operations:
    - readProductCrossSellings post /product/{productId}/cross-selling
    - readProductCrossSellingsGet get /product/{productId}/cross-selling
    - readProductDetail post /product/{productId}
    - readProductDetailGet get /product/{productId}
  schemas:
    - CrossSellingElementCollection
    - CrossSellingElement
    - ProductCrossSelling
    - Product
---

<script setup>
import RecipeFlowDiagram from "../../components/RecipeFlowDiagram.vue";
import SchemaTypeTooltip from "../../components/SchemaTypeTooltip.vue";
import CodeExample from "../../components/CodeExample.vue";

const steps = [
  {
    title: "Composable",
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
    action: "Read the groups",
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
      "A configured group can come back with no products. Filter on products.length before rendering, or the page shows a heading with nothing under it.",
    code: "productAssociations.filter((group) => group.products.length)",
    state: "reactive UI",
    typeKeys: ['Schemas["CrossSellingElement"]'],
  },
  {
    title: "Errors",
    action: "Fail silently",
    detail:
      "loadAssociations catches its own errors and logs them. isLoading returns to false and productAssociations keeps whatever it held before — on a first load, that is an empty array.",
    code: "catch (error) { console.error(...) }",
    state: "productAssociations unchanged",
    typeKeys: [],
  },
  {
    title: "UI",
    action: "Render from state",
    detail:
      "The rendered groups are read straight from productAssociations. Nothing is copied into a local array, so a reload replaces them without a second source of truth to keep in sync.",
    code: 'v-for="group in groups"',
    state: "productAssociations",
    typeKeys: ['Schemas["ProductCrossSelling"]'],
  },
];
</script>

# Cross-Selling

## Goal

Render the cross-selling groups of a product — "customers also bought", accessories, a related stream. The important part is what this operation does _not_ accept: it declares no request body, so the criteria argument the composable advertises has nowhere to go, and the association context it takes is never used.

## Shopware Flow

`readProductCrossSellings post /product/{productId}/cross-selling` is a `POST` with no request body. Its entire input is the product id in the path plus two optional headers, `sw-language-id` and `sw-include-seo-urls`. There is nothing to filter, sort or paginate.

The Store API also exposes `readProductCrossSellingsGet get /product/{productId}/cross-selling`, and it takes exactly the same three inputs — no `_criteria` query parameter. `useProductAssociations` always calls the `POST` variant and does not branch on `cacheableReads`, so these reads never become HTTP-cacheable the way the read composables listed under [Caching](../../best-practices/caching.html) do.

The response is a bare array — `CrossSellingElementCollection` is `CrossSellingElement[]`, not an object wrapping one. Each `CrossSellingElement` carries its `crossSelling` configuration, its `products`, and its own `total`, so a page with three cross-selling groups gets all three, fully populated, in one request.

<RecipeFlowDiagram label="Cross-selling flow diagram" :steps="steps" />

Read the diagram from left to right:

1. A resolved product ref is passed to `useProductAssociations(product, options)`, which throws if the ref is empty.
2. `loadAssociations({ searchParams: {} })` is called explicitly — the composable loads nothing on mount.
3. The request carries the product id and, when `includeSeoUrls` is set, the `sw-include-seo-urls` header.
4. The response array becomes `productAssociations`.
5. The UI filters out groups whose `products` array is empty before rendering.
6. A failed request is caught and logged, leaving `productAssociations` at its previous value.
7. The UI reads the groups from `productAssociations` instead of keeping its own copy.

You do not need this composable on a CMS-driven product page whose layout contains a cross-selling CMS element (`CmsElementCrossSelling`). The backend resolves that element's groups into the CMS page payload, so the request is only needed where you build the detail page yourself.

## Request Flow

| Step                   | Code                                     | Store API                                 | Type                                                                                                                        |
| ---------------------- | ---------------------------------------- | ----------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| Resolve the product    | `useProductSearch().search(productId)`   | `POST /product/{productId}`               | <SchemaTypeTooltip type-key='operations["readProductDetail post /product/{productId}"]["response"]' />                      |
| Load the groups        | `loadAssociations({ searchParams: {} })` | `POST /product/{productId}/cross-selling` | none — the operation declares no request body                                                                               |
| Read the groups        | `productAssociations`                    | `POST /product/{productId}/cross-selling` | <SchemaTypeTooltip type-key='operations["readProductCrossSellings post /product/{productId}/cross-selling"]["response"]' /> |
| Read one group         | `group.crossSelling`, `group.products`   | none                                      | <SchemaTypeTooltip type-key='Schemas["CrossSellingElement"]' />                                                             |
| Read its configuration | `group.crossSelling.position`, `.type`   | none                                      | <SchemaTypeTooltip type-key='Schemas["ProductCrossSelling"]' />                                                             |

The load row's `Type` cell is empty because there is nothing to type. That is the fact this whole recipe hangs on.

The first row assumes the default configuration. With `shopware: { cacheableReads: true }` in `nuxt.config`, `useProductSearch` switches to `readProductDetailGet get /product/{productId}` and moves the criteria into a `_criteria` query parameter. The cross-selling rows do not change: the composable never calls the GET variant, and neither variant accepts criteria.

## Composables

Pick by scope — where the product ref comes from, then what you do with it:

| Composable               | Scope                                   | Reach for it when                                                        |
| ------------------------ | --------------------------------------- | ------------------------------------------------------------------------ |
| `useProductSearch`       | one product, fetched by id              | you build the detail page yourself and have to resolve the product first |
| `useProduct`             | the product a parent already provided   | you are inside a detail page that injected the product                   |
| `useProductAssociations` | the cross-selling groups of one product | rendering "customers also bought", accessories, or a related stream      |

`useProductAssociations` is the one this recipe is about:

- **Create** — `useProductAssociations(product, options)`. `product` is a `ComputedRef<Product>`, not an id; `options` is `{ associationContext, includeSeoUrls? }`.
- **Read** — `productAssociations` and `isLoading`, both `ComputedRef`.
- **Write** — `loadAssociations({ searchParams: {} })`, the only thing that fetches anything.

Seven things the generated reference will not tell you:

- `loadAssociations` declares a `params` argument with `method` and `searchParams`, and the implementation takes no parameters at all. Both are discarded — but the argument is still **required by the type**, so a bare `loadAssociations()` fails to compile with `TS2554`. Pass `{ searchParams: {} }` and expect it to be thrown away. `examples/product-detail-page` passes a full `associations` object inside `searchParams` that goes nowhere — treat it as a warning, not a pattern.
- `options.associationContext` accepts `"cross-selling" | "reviews"`, but the implementation always calls the cross-selling operation. Passing `"reviews"` fetches cross-sellings. Use `useProductReviews` instead — see the [Product Reviews recipe](reviews.html).
- The composable throws `[useProductAssociations]: Product is not provided.` during setup when the product ref is empty. It is a `throw` in the composable body, not a rejected promise, so it takes the whole component down — and on a server render it propagates to Nitro as a 500 for the entire route unless a `<NuxtErrorBoundary>` catches it. Resolve the product first.
- Errors from the request are caught, logged to the console and swallowed. A resolved `loadAssociations()` is not proof that anything was fetched.
- `productAssociations` is backed by a plain `ref([])` created per call. Nothing is provided or shared, so two components calling it for the same product each issue their own request.
- It does not branch on `cacheableReads`, unlike `useProductSearch` and the other composables listed under [Caching](../../best-practices/caching.html). Every call is a `POST`.
- `includeSeoUrls` is the only option that changes the request. It adds `sw-include-seo-urls: true`; without it the cross-sold products come back with no `seoUrls`.

The [composables reference](../../packages/composables/) is generated from source and lists every member.

## Types

Use generated Store API types when you need to type the response, one group, or lower-level API client calls:

<div style="display: flex; flex-wrap: wrap; gap: 6px; margin: 12px 0 18px;">
  <SchemaTypeTooltip type-key='operations["readProductCrossSellings post /product/{productId}/cross-selling"]["response"]' />
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

`CrossSellingCollection` is declared as an array in the schema, so `productAssociations` is iterable directly. Most Store API list responses wrap their rows in an `elements` key; this one, like `readNavigation` and `readBreadcrumb`, does not.

## Minimal Vue Example

<CodeExample title="Cross-selling groups on a product page">

```vue
<script setup lang="ts">
import { getProductRoute, getTranslatedProperty } from "@shopware/helpers";

import type { Schemas } from "#shopware";

const { product } = defineProps<{ product: Schemas["Product"] }>();

const { productAssociations, isLoading, loadAssociations } =
  useProductAssociations(
    computed(() => product),
    { associationContext: "cross-selling", includeSeoUrls: true },
  );

const groups = computed(() =>
  productAssociations.value.filter((group) => group.products.length > 0),
);

watch(
  () => product.id,
  () => loadAssociations({ searchParams: {} }),
  { immediate: import.meta.client },
);
</script>

<template>
  <p role="status">{{ isLoading ? "Loading recommendations…" : "" }}</p>

  <section v-for="group in groups" :key="group.crossSelling.id">
    <h2>{{ getTranslatedProperty(group.crossSelling, "name") }}</h2>

    <ul>
      <li v-for="crossSellProduct in group.products" :key="crossSellProduct.id">
        <NuxtLink :to="getProductRoute(crossSellProduct)">
          {{ getTranslatedProperty(crossSellProduct, "name") }}
        </NuxtLink>
      </li>
    </ul>

    <p v-if="group.total > group.products.length">
      Showing {{ group.products.length }} of {{ group.total }}
    </p>
  </section>
</template>
```

</CodeExample>

The groups are rendered stacked, each under its own `h2`, rather than as tabs. A tab strip needs the full `tablist`/`tab`/`tabpanel` pattern with roving focus to be reachable by keyboard, and none of that is about cross-selling — stacked headings are navigable out of the box and cannot strand the reader on a panel that no longer exists.

`crossSelling.limit` is configured in the Admin and caps how many products a group returns, so `group.total` can be the larger number. The operation takes no limit and no page of its own, so there is no way to load the remainder — render the count as information, not as a control.

## State And Session

`productAssociations` is a local `ref([])` inside each `useProductAssociations()` call. Nothing is provided or shared, so two instances for the same product each issue their own request.

The watcher is guarded with `immediate: import.meta.client`, so the load is deliberately client-only. That keeps session-dependent prices and rule-based exclusion out of the server-rendered response, which matters because catalog routes are ISR-cached — the cost is that the block is absent from the cached HTML and appears after hydration.

The request carries the `sw-context-token` like any other Store API call, and the response depends on that session. Prices on the cross-sold products are calculated for the current currency and tax state, and a product excluded by the customer's rules does not appear. Switching currency or language leaves the already-loaded groups in place, stale, until you call `loadAssociations({ searchParams: {} })` again — the composable watches nothing itself, which is why the example wires its own watcher.

`includeSeoUrls` is the one option that has an effect. Setting it adds `sw-include-seo-urls: true`, which is what `getProductRoute` needs to build a link — without it the cross-sold products come back with no SEO URLs.

## Edge Cases

- The operation declares no request body, which is the underlying reason `searchParams` cannot work. There is nothing to send, and the GET variant has no `_criteria` parameter either.
- `CrossSellingElementCollection` is an array, not an object with `elements`. Iterate it directly.
- A configured cross-selling group can return zero products — a stream that currently matches nothing, or products hidden by the customer's rules. Filter on `products.length`.
- `group.total` can exceed `group.products.length` because `crossSelling.limit` caps how many products the group returns. There is no way to fetch the rest through this operation.
- Without `includeSeoUrls: true` the returned products carry no `seoUrls`, so `getProductRoute` falls back to `/detail/{id}`.
- A failed **first** load renders nothing and is indistinguishable from a product that has no cross-selling at all: `productAssociations` stays `[]`, `isLoading` returns to `false`, and no error is observable from outside the composable. Nothing the consumer writes can tell the two apart.
- A failed **reload** looks identical to a successful one that changed nothing, because the errors are swallowed and the previous groups stay rendered.
- `loadAssociations` has no in-flight guard, no sequence token and no cancellation. Two overlapping calls both write to `productAssociations` and the last response to arrive wins regardless of the order they were issued, while `isLoading` flips back to `false` as soon as the first one settles. Guard the caller if you wire a reload to a control a customer can activate twice.
- The composable passes no `fetchOptions`, so there is no per-request timeout or `AbortSignal`. A request that never settles leaves `isLoading` at `true` for the life of the page — set `runtimeConfig.apiClientConfig.timeout` if that matters.
- Prices, availability and group membership all follow the session context, so the loaded groups go stale on a currency, language or login change and nothing reloads them for you.
- On a CMS-driven product page whose layout contains a cross-selling CMS element, the groups already arrive in the page payload as `content.data.crossSellings`. Calling this composable there re-fetches data the page already has.

## Common Mistakes

- Do not pass criteria to `loadAssociations`. They are discarded — but the argument itself is required, so pass `{ searchParams: {} }`.
- Do not use `associationContext: "reviews"` and expect reviews.
- Do not expect `loadAssociations` to run on mount.
- Do not treat a resolved `loadAssociations()` as proof the request succeeded. Errors are swallowed.
- Do not read `productAssociations.elements`. It is an array.
- Do not render a group without checking `products.length`.
- Do not offer a "show more" control per group. The operation cannot page.
- Do not omit `includeSeoUrls` when the groups link to product pages.
- Do not call this composable on a CMS product page that already has the data.
- Do not expect `cacheableReads` to make these requests cacheable. This composable always sends a `POST`.
- Do not keep an index into the rendered groups without clamping it. A reload can return fewer groups than are on screen.

## Testing Checklist

- Creating the composable with an empty product ref throws during setup.
- `loadAssociations({ searchParams: {} })` issues exactly one `readProductCrossSellings post /product/{productId}/cross-selling` request.
- The request carries no body.
- With `includeSeoUrls: true` the request carries the `sw-include-seo-urls` header, and the rendered links use the SEO path.
- Groups with an empty `products` array are not rendered.
- For a request that settles, `isLoading` is `true` during it and `false` afterwards on both the success and the failure path, because the composable uses `finally`. A request that never settles leaves it `true`.
- A failed reload leaves the previously rendered groups in place; a failed first load renders nothing.
- A group whose `total` exceeds its `products` length renders the count without a paging control.

## Related Links

- [Product Listing and Filters recipe](listing.html)
- [Product Reviews recipe](reviews.html)
- [Language and Currency Switch recipe](../context/language-and-currency.html)
- [Product detail page](../../guides/e-commerce/product-detail-page.html)
- [Product listing documentation](../../guides/e-commerce/product-listing.html)
- [Caching best practices](../../best-practices/caching.html)
- [CMS base layer package](../../packages/cms-base-layer.html)
- [Helpers package](../../packages/helpers.html)
- [Composables reference](../../packages/composables/)
- [API client package](../../packages/api-client.html)
