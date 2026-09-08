---
nav:
  position: 10
recipe:
  area: catalog
  status: stable
  frameworks:
    - vue
  composables:
    - useListing
    - useCategory
  helpers:
    - getListingFilters
    - getTranslatedProperty
  operations:
    - readProductListing post /product-listing/{categoryId}
    - searchPage post /search
  schemas:
    - ProductListingResult
    - ProductListingCriteria
    - Product
    - Criteria
---

<script setup>
import RecipeFlowDiagram from "../../components/RecipeFlowDiagram.vue";
import SchemaTypeTooltip from "../../components/SchemaTypeTooltip.vue";

const steps = [
  {
    title: "Page",
    action: "Seed from the CMS payload",
    detail:
      "A category page already carries a listing in its CMS data. setInitialListing stores it, so the first render needs no request of its own.",
    code: "setInitialListing(cmsListingElement.data.listing)",
    state: "useListingInitial-categoryListing",
    typeKeys: ['Schemas["ProductListingResult"]'],
  },
  {
    title: "UI",
    action: "Change a filter",
    detail:
      "Filter controls do not send requests. They collect shortcut filter params — a code from ProductListingCriteria and a value — and hand them to the composable.",
    code: "setCurrentFilters([{ code: 'manufacturer', value: ids }])",
    state: "local control state",
    typeKeys: ['Schemas["ProductListingCriteria"]'],
  },
  {
    title: "Composable",
    action: "Merge and search",
    detail:
      "search deep-merges the criteria over the defaults passed to useListing, then calls the operation the listing type selected. Both requests carry sw-include-seo-urls.",
    code: "search(merge({}, searchDefaults, criteria))",
    state: "loading",
    typeKeys: [
      'operations["readProductListing post /product-listing/{categoryId}"]["body"]',
    ],
  },
  {
    title: "Store API",
    action: "Return one page",
    detail:
      "The result is an EntitySearchResult carrying elements, total, page, limit, availableSortings, currentFilters and aggregations. Everything a listing UI needs is in one response.",
    code: 'apiClient.invoke("readProductListing post /product-listing/{categoryId}")',
    state: "sw-context-token",
    typeKeys: [
      'operations["readProductListing post /product-listing/{categoryId}"]["response"]',
    ],
  },
  {
    title: "Composable",
    action: "Replace the applied listing",
    detail:
      "The result becomes the applied listing, which shadows the initial one. getCurrentListing is applied ?? initial, so a reset means clearing applied rather than refetching.",
    code: "_storeAppliedListing.value = result",
    state: "useListingApplied-categoryListing",
    typeKeys: [],
  },
  {
    title: "UI",
    action: "Render from one listing",
    detail:
      "getElements, getTotal, getCurrentPage, getSortingOrders and getAvailableFilters are all computed over that single listing. The filter UI is built from the aggregations it carries.",
    code: "getAvailableFilters, getElements, getTotal",
    state: "reactive UI",
    typeKeys: ['Schemas["Product"]'],
  },
  {
    title: "UI",
    action: "Append the next page",
    detail:
      "loadMore keeps the previous elements and concatenates the new ones. Only page and elements are taken from the response — total and aggregations stay as they were.",
    code: "loadMore()",
    state: "loadingMore",
    typeKeys: [],
  },
];
</script>

# Product Listing and Filters

## Goal

Build a product listing with filters, sorting, pagination and an infinite-scroll variant. The important part is that a listing response already contains everything the UI needs — elements, totals, available sortings, current filters and the aggregations the filter panel is built from — so the page is one request, not one per concern.

## Shopware Flow

`useListing` wraps two different operations behind one API. With `listingType: "categoryListing"` it calls `readProductListing post /product-listing/{categoryId}`; with `listingType: "productSearchListing"` it calls `searchPage post /search`. Both send `sw-include-seo-urls: true`, so the products come back with the URLs a listing needs for its links.

The composable holds two listings rather than one. An _initial_ listing is what the page was rendered with — typically the listing embedded in a category's CMS payload — and an _applied_ listing is the result of the last search. `getCurrentListing` is the applied one falling back to the initial one, which is why the first render needs no request and a reset is a search rather than a rollback.

<RecipeFlowDiagram label="Product listing flow diagram" :steps="steps" />

Read the diagram from left to right:

1. The page seeds the initial listing from its CMS payload with `setInitialListing()`.
2. A filter, a sorting select or a pagination control produces new criteria.
3. `search()` deep-merges those criteria over the `defaultSearchCriteria` passed to `useListing` and issues one request.
4. The Store API returns one page as a `ProductListingResult`.
5. That result becomes the applied listing, shadowing the initial one.
6. `getElements`, `getTotal`, `getCurrentPage`, `getSortingOrders`, `getCurrentFilters` and `getAvailableFilters` all read from it.
7. `loadMore()` appends the next page's elements instead of replacing them.

You do not need a separate request for the filter options. They are the `aggregations` on the same response, converted into a filter model by the `getListingFilters` helper.

## Request Flow

| Step                 | Code                                    | Store API                            | Type                                                                                                             |
| -------------------- | --------------------------------------- | ------------------------------------ | ---------------------------------------------------------------------------------------------------------------- |
| Seed from the CMS    | `setInitialListing(listing)`            | none                                 | <SchemaTypeTooltip type-key='Schemas["ProductListingResult"]' />                                                 |
| Search a category    | `search({ limit: 24 })`                 | `POST /product-listing/{categoryId}` | <SchemaTypeTooltip type-key='operations["readProductListing post /product-listing/{categoryId}"]["body"]' />     |
| Search by term       | `search({ search: term })`              | `POST /search`                       | <SchemaTypeTooltip type-key='operations["searchPage post /search"]["body"]' />                                   |
| Read the page        | `getElements`, `getTotal`               | either                               | <SchemaTypeTooltip type-key='operations["readProductListing post /product-listing/{categoryId}"]["response"]' /> |
| Apply filters        | `setCurrentFilters([{ code, value }])`  | either                               | <SchemaTypeTooltip type-key='Schemas["ProductListingCriteria"]' />                                               |
| Change the sorting   | `changeCurrentSortingOrder("name-asc")` | either                               | <SchemaTypeTooltip type-key='Schemas["ProductListingCriteria"]' />                                               |
| Change the page      | `changeCurrentPage(2)`                  | either                               | <SchemaTypeTooltip type-key='Schemas["Criteria"]' />                                                             |
| Append the next page | `loadMore()`                            | either                               | <SchemaTypeTooltip type-key='operations["searchPage post /search"]["response"]' />                               |

The two pagination rows do not use the same field. `changeCurrentPage(page)` sends `page`, which comes from the base `Criteria`, while `loadMore()` sends `p`, the listing-specific page parameter. Hover both chips to see where each is declared.

## Composables

- `useListing`: the listing itself. Reads `getElements`, `getTotal`, `getTotalPagesCount`, `getLimit`, `getCurrentPage`, `getCurrentSortingOrder`, `getSortingOrders`, `getCurrentFilters`, `getAvailableFilters`, `getInitialFilters`, `getCurrentListing`, `getInitialListing`, `loading`, `loadingMore`. Acts with `search`, `loadMore`, `setInitialListing`, `setCurrentFilters`, `resetFilters`, `changeCurrentPage`, `changeCurrentSortingOrder` and `filtersToQuery`.
- `useCategory`: consulted automatically when `listingType` is `categoryListing` and no `categoryId` was passed. The category id comes from `category.value?.id`, so the listing silently depends on a category being resolved.

Two wrappers exist for sharing one listing across components. `createCategoryListingContext(initialListing)` must be called on a parent before any child calls `useCategoryListing()`, which throws otherwise. `useProductSearchListing()` is a shared composable and needs no setup. Both are documented in the source as temporary.

## Types

Use generated Store API types when you need to type criteria, results, or lower-level API client calls:

<div style="display: flex; flex-wrap: wrap; gap: 6px; margin: 12px 0 18px;">
  <SchemaTypeTooltip type-key='operations["readProductListing post /product-listing/{categoryId}"]["body"]' />
  <SchemaTypeTooltip type-key='operations["readProductListing post /product-listing/{categoryId}"]["response"]' />
  <SchemaTypeTooltip type-key='operations["searchPage post /search"]["body"]' />
  <SchemaTypeTooltip type-key='Schemas["ProductListingResult"]' />
  <SchemaTypeTooltip type-key='Schemas["ProductListingCriteria"]' />
  <SchemaTypeTooltip type-key='Schemas["Product"]' />
</div>

```ts
import type { Schemas, operations } from "#shopware";

type CategoryListingBody =
  operations["readProductListing post /product-listing/{categoryId}"]["body"];
type SearchBody = operations["searchPage post /search"]["body"];
type ProductListingResult = Schemas["ProductListingResult"];
type ProductListingCriteria = Schemas["ProductListingCriteria"];
type Product = Schemas["Product"];
```

`ProductListingCriteria` is the list of codes `setCurrentFilters` accepts: `order`, `limit`, `p`, `manufacturer`, `min-price`, `max-price`, `rating`, `shipping-free`, `properties` and the `*-filter` toggles. `SearchBody` adds `search` on top of it, which is the one field a category listing does not declare.

## Minimal Vue Example

```vue
<script setup lang="ts">
import { getTranslatedProperty } from "@shopware/helpers";

const {
  getElements,
  getTotal,
  getCurrentPage,
  getTotalPagesCount,
  getSortingOrders,
  getCurrentSortingOrder,
  getInitialFilters,
  loading,
  loadingMore,
  search,
  loadMore,
  setCurrentFilters,
  resetFilters,
  changeCurrentSortingOrder,
  filtersToQuery,
} = useListing({ listingType: "categoryListing" });

const router = useRouter();
const listingError = ref("");

// the criteria expects pipe-joined ids, so the UI keeps sets and joins on send
const selected = reactive({
  manufacturer: new Set<string>(),
  properties: new Set<string>(),
});

onMounted(async () => {
  try {
    await search({ limit: 24 });
  } catch {
    listingError.value = "The products could not be loaded.";
  }
});

const applyFilters = async () => {
  const criteria = {
    manufacturer: [...selected.manufacturer].join("|"),
    properties: [...selected.properties].join("|"),
  };

  await setCurrentFilters([
    { code: "manufacturer", value: criteria.manufacturer },
    { code: "properties", value: criteria.properties },
  ]);

  router.replace({ query: filtersToQuery(criteria) });
};

const toggleOption = (code: "manufacturer" | "properties", id: string) => {
  const set = selected[code];
  set.has(id) ? set.delete(id) : set.add(id);
  return applyFilters();
};

const clearFilters = async () => {
  selected.manufacturer.clear();
  selected.properties.clear();
  await resetFilters();
  router.replace({ query: {} });
};

const hasMore = computed(() => getCurrentPage.value < getTotalPagesCount.value);
</script>

<template>
  <p v-if="listingError">{{ listingError }}</p>

  <aside>
    <h2>Filters</h2>

    <fieldset v-for="filter in getInitialFilters" :key="filter.code">
      <legend>{{ filter.label }}</legend>

      <label
        v-for="option in filter.options ?? filter.entities ?? []"
        :key="option.id"
      >
        <input
          type="checkbox"
          :checked="
            filter.code === 'manufacturer'
              ? selected.manufacturer.has(option.id)
              : selected.properties.has(option.id)
          "
          :disabled="loading"
          @change="
            toggleOption(
              filter.code === 'manufacturer' ? 'manufacturer' : 'properties',
              option.id
            )
          "
        />
        {{ getTranslatedProperty(option, "name") }}
      </label>
    </fieldset>

    <button type="button" :disabled="loading" @click="clearFilters()">
      Clear all filters
    </button>
  </aside>

  <section>
    <label>
      Sort by
      <select
        :value="getCurrentSortingOrder"
        :disabled="loading"
        @change="
          changeCurrentSortingOrder(($event.target as HTMLSelectElement).value)
        "
      >
        <option
          v-for="sorting in getSortingOrders ?? []"
          :key="sorting.key"
          :value="sorting.key"
        >
          {{ sorting.translated?.label ?? sorting.label }}
        </option>
      </select>
    </label>

    <p>{{ getTotal }} products</p>

    <p v-if="loading">Loading products…</p>

    <p v-else-if="!getElements.length">No products match these filters.</p>

    <ul v-else>
      <li v-for="product in getElements" :key="product.id">
        {{ getTranslatedProperty(product, "name") }}
      </li>
    </ul>

    <button
      v-if="hasMore"
      type="button"
      :disabled="loadingMore"
      @click="loadMore()"
    >
      {{ loadingMore ? "Loading…" : "Show more" }}
    </button>
  </section>
</template>
```

The filter panel reads `getInitialFilters` rather than `getAvailableFilters`. Both come from `getListingFilters`, but the initial one is computed over the listing the page was rendered with, so the options do not reshuffle while the customer is selecting.

Each filter carries its options under `options` for a property group and under `entities` for manufacturers and categories, which is why the loop falls back from one to the other.

## State And Session

The two listings live in the `useListingInitial-<listingKey>` and `useListingApplied-<listingKey>` injections, keyed by listing type. That keying is what lets a category listing and a search listing coexist on one page without overwriting each other — and it is also why two independent `useListing()` calls of the same type in the same tree share their state.

A listing is context-dependent. Prices come back calculated in the current currency and tax state, and availability depends on the customer's rules, so a currency or a language switch invalidates everything currently rendered. Nothing in `useListing` reacts to that — refetch with `search()` after a context change.

`loading` and `loadingMore` are separate on purpose. `search()` toggles `loading` and replaces the elements; `loadMore()` toggles `loadingMore` and appends to them. Binding a skeleton to `loading` therefore does not blank the list during an infinite-scroll fetch.

## Edge Cases

- `initSearch()` is deprecated and behaves differently from `search()`: it returns the result and does **not** store it, so the UI does not update. Use `search()` unless you specifically want the raw result.
- `loadMore()` copies only `page` and `elements` from the response and keeps everything else from the previous listing. `getTotal` and `getAvailableFilters` stay at the values from the earlier request.
- `setCurrentFilters` narrows the products but not the filter options. A source comment states this explicitly: the aggregations are not reduced by the filter, so option counts do not shrink as the customer selects.
- `setCurrentFilters` rewrites the current filters before searching: `search` becomes `query`, and `manufacturer` and `properties` are joined with `|`. Passing an array where the criteria expects a pipe-joined string sends the wrong shape.
- `resetFilters()` always sends a `search` key. That field exists on `searchPage post /search` but not on `readProductListing post /product-listing/{categoryId}`, so on a category listing it is a key the operation does not declare.
- `resetFilters()` deliberately keeps the search term. It clears filters, not the query.
- With `listingType: "categoryListing"` and no `categoryId`, the composable reads the id from `useCategory()`. If no category is resolved, the request goes to `/product-listing/undefined`.
- `getLimit` falls back to the `limit` from `defaultSearchCriteria` and then to `10`. It is not the shop's configured products-per-page until a response has arrived.
- `getTotalPagesCount` is derived from `getTotal / getLimit`, so it is `0` before the first response and cannot be trusted for a "last page" check during the initial render.
- `getAvailableFilters` reads the applied listing's aggregations and falls back to the current listing's. `getInitialFilters` always reads the initial listing — useful for a filter panel that must not reshuffle as the customer filters.
- `changeCurrentSortingOrder` sends `order`, which sorts by one of `availableSortings`. The criteria also has a `sort` field, and the schema warns against using both together.

## Common Mistakes

- Do not request the filter options separately. They are the aggregations on the listing response.
- Do not use `initSearch()` to load a listing. It does not update the state.
- Do not expect option counts to shrink as filters are applied. `setCurrentFilters` does not filter the aggregations.
- Do not pass arrays for `manufacturer` or `properties`. The criteria expects a `|`-joined string.
- Do not bind an infinite-scroll spinner to `loading`. Use `loadingMore`.
- Do not call `useCategoryListing()` without `createCategoryListingContext()` on a parent — it throws by design.
- Do not send both `order` and `sort`. The schema documents that as unpredictable.
- Do not keep a local copy of the elements, the total or the current page.
- Do not assume the listing survives a currency or language switch. Refetch after a context change.

## Testing Checklist

- A page seeded with `setInitialListing()` renders products before any request is sent.
- `search({ limit: 24 })` calls the operation matching the listing type exactly once.
- Both listing requests carry the `sw-include-seo-urls` header.
- Applying a manufacturer filter issues one request and updates `getElements` and `getTotal`.
- Applying a filter leaves `getAvailableFilters` option counts unchanged.
- `resetFilters()` clears the filters but keeps the search term.
- `changeCurrentSortingOrder(key)` sends `order` and re-renders in the new order.
- `changeCurrentPage(2)` replaces the elements, while `loadMore()` appends to them.
- `loading` is `true` during a `search()` and `false` during a `loadMore()`.
- An empty result renders an empty state rather than a stale page.

## Related Links

- [Product listing documentation](../../getting-started/e-commerce/product-listing.html)
- [Prices documentation](../../getting-started/e-commerce/prices.html)
- [Helpers package](../../packages/helpers.html)
- [Composables reference](../../packages/composables/)
- [API client package](../../packages/api-client.html)
