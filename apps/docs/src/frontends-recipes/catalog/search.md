---
nav:
  position: 20
recipe:
  area: catalog
  status: stable
  frameworks:
    - vue
  composables:
    - useProductSearchSuggest
    - useProductSearch
    - useListing
  helpers:
    - getTranslatedProperty
    - getProductRoute
  operations:
    - searchPage post /search
    - searchSuggest post /search-suggest
    - readProductDetail post /product/{productId}
  schemas:
    - ProductListingResult
    - ProductDetailResponse
    - ProductListingFlags
    - Product
---

<script setup>
import RecipeFlowDiagram from "../../components/RecipeFlowDiagram.vue";
import SchemaTypeTooltip from "../../components/SchemaTypeTooltip.vue";

const steps = [
  {
    title: "UI",
    action: "Debounce the typing",
    detail:
      "The composable has no debounce and no minimum length. Both belong in the component, which is why the input keeps its own typing ref separate from searchTerm.",
    code: "useDebounceFn(() => { searchTerm.value = value; search(); }, 300)",
    state: "typingQuery",
    typeKeys: [],
  },
  {
    title: "Composable",
    action: "Overwrite the term",
    detail:
      "useProductSearchSuggest().search() builds the criteria from its argument and then sets search from searchTerm, so the term on the ref always wins.",
    code: "search({ limit: 10 })",
    state: "searchTerm",
    typeKeys: ['operations["searchPage post /search"]["body"]'],
  },
  {
    title: "Store API",
    action: "Run a full search",
    detail:
      "The request goes to searchPage post /search — the same operation as the results page, not the lighter search-suggest one. It returns a full ProductListingResult with aggregations.",
    code: 'apiClient.invoke("searchPage post /search")',
    state: "sw-context-token",
    typeKeys: ['operations["searchPage post /search"]["response"]'],
  },
  {
    title: "Shared state",
    action: "Write the applied listing",
    detail:
      "useProductSearchSuggest delegates to useProductSearchListing, a shared composable. The dropdown therefore writes into the same applied listing the results page reads.",
    code: "listingComposable.search(searchCriteria)",
    state: "useListingApplied-productSearchListing",
    typeKeys: ['Schemas["ProductListingResult"]'],
  },
  {
    title: "UI",
    action: "Render the preview",
    detail:
      "getProducts and getTotal are the listing's elements and total re-exported. loading is the listing's loading flag, so it is true for the results page too.",
    code: "getProducts, getTotal, loading",
    state: "reactive UI",
    typeKeys: ['Schemas["Product"]'],
  },
  {
    title: "Detail",
    action: "Open one product",
    detail:
      "useProductSearch().search(productId) is a lookup by id, not a text search. It calls the product detail operation and returns the product with its configurator.",
    code: "await search(productId, { withCmsAssociations: true })",
    state: "none shared",
    typeKeys: ['Schemas["ProductDetailResponse"]'],
  },
];
</script>

# Search and Suggest

## Goal

Build a search input with a suggestion dropdown and a full results page. The important part is that the two share one listing: `useProductSearchSuggest` delegates to the shared product search listing, so the dropdown and the results page are the same state rendered twice.

## Shopware Flow

The Store API has two text search operations. `searchPage post /search` returns a full `ProductListingResult` with aggregations and sortings, and `searchSuggest post /search-suggest` is documented as the lighter one for previews and suggestion listings.

Shopware Frontends uses only the first. `useProductSearchSuggest` calls `useProductSearchListing().search()`, which sends `searchPage post /search`. No composable wraps `searchSuggest post /search-suggest` — reaching for it means calling `apiClient.invoke` yourself.

The naming needs care too. `useProductSearch` is not a text search at all: its `search(productId)` is a lookup by id against `readProductDetail post /product/{productId}`, used to open a product once the customer picks one from the results.

<RecipeFlowDiagram label="Search and suggest flow diagram" :steps="steps" />

Read the diagram from left to right:

1. The input debounces the typing and enforces a minimum length itself — the composable does neither.
2. `searchTerm.value` is set, then `search()` builds the criteria and overwrites `search` with that term.
3. `searchPage post /search` returns a full listing result.
4. That result lands in the applied listing of the shared `productSearchListing`.
5. `getProducts`, `getTotal` and `loading` are that listing's `getElements`, `getTotal` and `loading`.
6. Selecting a product calls `useProductSearch().search(productId)`, which is a detail request by id.

You do not need a second request for the results page. Because the state is shared, navigating from the dropdown to the results page finds the listing already populated.

## Request Flow

| Step                       | Code                                           | Store API                   | Type                                                                                                   |
| -------------------------- | ---------------------------------------------- | --------------------------- | ------------------------------------------------------------------------------------------------------ |
| Run a suggest search       | `search({ limit: 10 })`                        | `POST /search`              | <SchemaTypeTooltip type-key='operations["searchPage post /search"]["body"]' />                         |
| Read the results           | `getProducts`, `getTotal`                      | `POST /search`              | <SchemaTypeTooltip type-key='operations["searchPage post /search"]["response"]' />                     |
| Load the next page         | `loadMore({ p: 2 })`                           | `POST /search`              | <SchemaTypeTooltip type-key='Schemas["ProductListingResult"]' />                                       |
| Skip the aggregations      | `search({ "only-aggregations": "" })`          | `POST /search`              | <SchemaTypeTooltip type-key='Schemas["ProductListingFlags"]' />                                        |
| Call the suggest operation | `invoke("searchSuggest post /search-suggest")` | `POST /search-suggest`      | <SchemaTypeTooltip type-key='operations["searchSuggest post /search-suggest"]["body"]' />              |
| Open one product           | `useProductSearch().search(productId)`         | `POST /product/{productId}` | <SchemaTypeTooltip type-key='operations["readProductDetail post /product/{productId}"]["response"]' /> |

The `searchSuggest` row has no composable. Its body is the same shape as the search body, with `search` required rather than optional.

## Composables

- `useProductSearchSuggest`: the suggestion surface. Owns `searchTerm` and re-exports `search`, `loadMore`, `getProducts`, `getTotal` and `loading` from the shared product search listing.
- `useProductSearch`: a product lookup by id. `search(productId, options)` accepts `withCmsAssociations` to pull in the CMS association tree, plus `criteria` and `associations`, and returns a `ProductDetailResponse` carrying `product` and `configurator`.
- `useListing`: the listing underneath. Use `useProductSearchListing()` — the shared wrapper `useProductSearchSuggest` builds on — when the results page needs the parts the suggest composable does not re-export, such as `getAvailableFilters`, `getSortingOrders` or `resetFilters`.

## Types

Use generated Store API types when you need to type the search body, the results, or lower-level API client calls:

<div style="display: flex; flex-wrap: wrap; gap: 6px; margin: 12px 0 18px;">
  <SchemaTypeTooltip type-key='operations["searchPage post /search"]["body"]' />
  <SchemaTypeTooltip type-key='operations["searchPage post /search"]["response"]' />
  <SchemaTypeTooltip type-key='operations["searchSuggest post /search-suggest"]["body"]' />
  <SchemaTypeTooltip type-key='Schemas["ProductListingResult"]' />
  <SchemaTypeTooltip type-key='Schemas["ProductDetailResponse"]' />
  <SchemaTypeTooltip type-key='Schemas["ProductListingFlags"]' />
</div>

```ts
import type { Schemas, operations } from "#shopware";

type SearchBody = operations["searchPage post /search"]["body"];
type SuggestBody = operations["searchSuggest post /search-suggest"]["body"];
type SearchResult = operations["searchPage post /search"]["response"];
type ProductDetailResponse = Schemas["ProductDetailResponse"];
type ListingFlags = Schemas["ProductListingFlags"];
```

Comparing `SearchBody` and `SuggestBody` in the tooltips shows how close they are: both extend `ProductListingCriteria` and `ProductListingFlags`, and the only difference is that `search` is required on the suggest body.

## Minimal Vue Example

```vue
<script setup lang="ts">
import { getProductRoute, getTranslatedProperty } from "@shopware/helpers";

const { searchTerm, search, getProducts, getTotal, loading } =
  useProductSearchSuggest();

const MIN_LENGTH = 3;

const typingQuery = ref("");
const isOpen = ref(false);
const searchError = ref("");

// the composable has no debounce and no minimum length — both live here
const runSuggestSearch = useDebounceFn(async (term: string) => {
  searchTerm.value = term;

  try {
    await search({ limit: 10 });
  } catch {
    searchError.value = "The search is currently unavailable.";
  }
}, 300);

watch(typingQuery, (term) => {
  searchError.value = "";

  if (term.length >= MIN_LENGTH) {
    runSuggestSearch(term);
  }
});

const showSuggest = computed(
  () => isOpen.value && typingQuery.value.length >= MIN_LENGTH
);
</script>

<template>
  <div>
    <label>
      Search
      <input
        v-model="typingQuery"
        type="search"
        autocomplete="off"
        role="combobox"
        :aria-expanded="showSuggest"
        @focus="isOpen = true"
      />
    </label>

    <div v-if="showSuggest">
      <p v-if="searchError">{{ searchError }}</p>

      <p v-else-if="loading">Searching…</p>

      <p v-else-if="!getProducts.length">
        Nothing matches “{{ typingQuery }}”.
      </p>

      <template v-else>
        <ul>
          <li v-for="product in getProducts" :key="product.id">
            <NuxtLink :to="getProductRoute(product)">
              {{ getTranslatedProperty(product, "name") }}
            </NuxtLink>
          </li>
        </ul>

        <NuxtLink :to="{ path: '/search', query: { search: typingQuery } }">
          Show all {{ getTotal }} results
        </NuxtLink>
      </template>
    </div>
  </div>
</template>
```

The results page reads the same state. Calling `useProductSearchListing()` there gives you the filters and sortings that `useProductSearchSuggest` does not re-export, over the listing the dropdown already filled.

## State And Session

`useProductSearchListing` is wrapped in `createSharedComposable`, so there is exactly one product search listing in the application. `useProductSearchSuggest` adds a local `searchTerm` ref on top of it but shares everything else.

That sharing is a feature and a trap. A dropdown search updates the results page behind it, and `loading` is `true` on both surfaces at once. Two suggest inputs — a header and a mobile overlay — each get their own `searchTerm` but write to the same listing.

The results are context-dependent like any listing: prices arrive calculated in the current currency and tax state, and visibility follows the customer's rules. A currency or language switch invalidates whatever is currently rendered, and nothing re-runs the search for you.

## Edge Cases

- `useProductSearchSuggest().search(criteria)` sets `search` from `searchTerm` **after** spreading the criteria, so a `search` key passed in the argument is silently discarded.
- There is no debounce and no minimum term length in the composable. Binding `search()` straight to an `input` event issues one request per keystroke.
- The suggest search runs `searchPage post /search`, which computes aggregations and sortings the dropdown never renders. Pass the `only-aggregations` or `no-aggregations` flag from `ProductListingFlags`, or a small `limit`, if that cost matters.
- `searchSuggest post /search-suggest` exists for exactly this case but has no composable. Its `search` field is required, unlike on `searchPage post /search`.
- `getProducts` and `getTotal` come from the shared listing. A `loadMore()` on the results page changes what the dropdown shows.
- `loading` is the shared listing's flag. A results-page fetch makes the dropdown show its loading state as well.
- `useProductSearch().search()` takes a **product id**, not a term. The name suggests a text search and it is not one.
- `useProductSearch` merges `withCmsAssociations`, `criteria` and `associations` with `defu`, in that precedence order. Passing both `criteria.associations` and `associations` merges them rather than picking one.
- `useProductSearch` sends `sw-include-seo-urls: true`, so the returned product carries the data a link needs — do not resolve the route separately.
- An empty `searchTerm` produces a search for an empty string, which is a valid request returning the unfiltered listing. Guard on the term length before calling.

## Common Mistakes

- Do not pass `search` in the criteria to `useProductSearchSuggest().search()`. It is overwritten.
- Do not bind the search request directly to keystrokes. Debounce it in the component.
- Do not assume the dropdown and the results page are independent. They are one listing.
- Do not use `useProductSearch` for a text search. It resolves a product by id.
- Do not implement the suggest dropdown against `searchSuggest post /search-suggest` and expect a composable to exist for it.
- Do not render a suggest dropdown for a one-character term.
- Do not read filters or sortings from `useProductSearchSuggest`. It does not re-export them — use `useProductSearchListing()`.
- Do not keep a local copy of the results or the total.

## Testing Checklist

- Typing fewer than the minimum number of characters issues no request.
- Typing quickly issues one request after the debounce, not one per keystroke.
- A suggest search calls `searchPage post /search` with the term from `searchTerm`.
- A `search` key passed to `search()` does not reach the request body.
- The dropdown and the results page render the same elements and total.
- `loading` is `true` on the dropdown while the results page is fetching.
- An empty result set renders the empty state rather than the previous results.
- Selecting a product calls `readProductDetail post /product/{productId}` with that product's id.
- A failing search shows a UI-level error and leaves the previous results intact.

## Related Links

- [Product listing documentation](../../getting-started/e-commerce/product-listing.html)
- [Product detail page](../../getting-started/e-commerce/product-detail-page.html)
- [Helpers package](../../packages/helpers.html)
- [Composables reference](../../packages/composables/)
- [API client package](../../packages/api-client.html)
