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
    - PropertyGroupOption
    - ProductManufacturer
---

<script setup>
import RecipeFlowDiagram from "../../components/RecipeFlowDiagram.vue";
import SchemaTypeTooltip from "../../components/SchemaTypeTooltip.vue";
import CodeExample from "../../components/CodeExample.vue";

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
      "Filter controls do not send requests. They produce shortcut filter params — a code from ProductListingCriteria and a pipe-joined value — either by writing them to the URL or by handing them to the composable.",
    code: "router.push({ query: { manufacturer: ids.join('|') } })",
    state: "route query",
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
      "The result becomes the applied listing, which shadows the initial one. getCurrentListing is applied || initial. resetFilters still issues a search — only setInitialListing clears the applied listing.",
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
      "loadMore keeps the previous elements and concatenates the new ones. Only page and elements are taken from the response, and with no argument it sends only p — pass the criteria again on a filtered listing.",
    code: "loadMore({ ...criteria, p: page + 1 })",
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
7. `loadMore()` appends the next page's elements instead of replacing them — passed the same criteria, or the appended page ignores them.

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
| Append the next page | `loadMore({ ...criteria, p })`          | either                               | <SchemaTypeTooltip type-key='operations["searchPage post /search"]["response"]' />                               |

The two pagination rows do not use the same field. `changeCurrentPage(page)` sends `page`, which comes from the base `Criteria`, while `loadMore()` sends `p`, the listing-specific page parameter. Hover both chips to see where each is declared.

`changeCurrentPage` and `changeCurrentSortingOrder` both take an optional second `query` argument, applied as `Object.assign({ page }, query)` and `Object.assign({ order }, query)`. It is merged last, so anything it carries wins over the field the method itself set. That argument is how a listing rebuilds its whole criteria while changing one thing — `CmsElementProductListing` in `cms-base-layer` uses it to rebuild a whitelisted criteria from the URL query on every navigation, coercing the strings the router hands it into the numbers and booleans the criteria declares.

## Composables

Pick by scope — how much of the listing the composable is about:

| Composable                     | Scope                       | Reach for it when                                               |
| ------------------------------ | --------------------------- | --------------------------------------------------------------- |
| `useListing`                   | one listing                 | building any listing, filter panel, sorting or pagination       |
| `useCategory`                  | the category in context     | you need the category itself — `useListing` consults it for you |
| `createCategoryListingContext` | one shared category listing | a filter panel and a product grid are separate components       |
| `useProductSearchListing`      | the shared search listing   | building a search results page                                  |

`useListing` is the one you reach for most:

- **Read** — `getElements`, `getTotal`, `getTotalPagesCount`, `getLimit`, `getCurrentPage`, `getCurrentSortingOrder`, `getSortingOrders`.
- **Filter** — `getInitialFilters`, `getAvailableFilters`, `getCurrentFilters`, `setCurrentFilters`, `resetFilters`, `filtersToQuery`.
- **Act** — `search`, `loadMore`, `changeCurrentPage`, `changeCurrentSortingOrder`, `setInitialListing`.
- **State** — `loading`, `loadingMore`, `getCurrentListing`, `getInitialListing`.

Six things the generated reference will not tell you:

- `initSearch()` is deprecated and is not `search()` with a return value. It runs the request and hands you the result **without storing it**, so the UI never updates. It is named here only so you recognise it in older code.
- `search()` deep-merges your criteria over the `defaultSearchCriteria` you passed to `useListing`, then calls the operation the listing type selected. `loadMore()` merges the same defaults, but it does not carry over the criteria of the last `search()`. With no argument it sends `defaultSearchCriteria` plus `{ p }`, so on a filtered or sorted listing you have to pass the filters and the sorting again.
- `setCurrentFilters()` narrows the products but not the filter options. A source comment states it outright: the aggregations are not reduced by the filter, so the option lists do not shrink as the customer selects. Send `reduce-aggregations` when you do want them narrowed.
- `loading` and `loadingMore` are plain refs created per composable call, not injected like the listings themselves. Two components that share the same listing state still track their own loading flags.
- Nothing here carries a request deadline, a cancellation signal or a sequence guard. Two overlapping searches are stored in the order their responses arrive, not the order they were sent. A deadline is available one layer down: `runtimeConfig.apiClientConfig.timeout` applies to every call, and `isTimeoutError` from `@shopware/api-client` tells a timeout apart from any other rejection.
- `useCategory` is consulted automatically when `listingType` is `categoryListing` and no `categoryId` was passed. The category id comes from `category.value?.id`, and `useCategory()` throws when no category is in context, so the listing hard-depends on a category being resolved.

Two wrappers exist for sharing one listing across components. `createCategoryListingContext(initialListing)` must be called on a parent before any child calls `useCategoryListing()`, which throws otherwise. `useProductSearchListing()` is a shared composable and needs no setup. Both are documented in the source as temporary.

The [composables reference](../../packages/composables/) is generated from source and lists every member.

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

<!-- automd:file src="examples/docs-code-examples/src/generated/frontends-recipes/catalog/listing/types.ts" code lang="ts" no-name -->

```ts
import type { Schemas, operations } from "#shopware";

type CategoryListingBody =
  operations["readProductListing post /product-listing/{categoryId}"]["body"];
type SearchBody = operations["searchPage post /search"]["body"];
type ProductListingResult = Schemas["ProductListingResult"];
type ProductListingCriteria = Schemas["ProductListingCriteria"];
type Product = Schemas["Product"];
```

<!-- /automd -->

`ProductListingCriteria` is what `setCurrentFilters` keys its codes on. It extends the base `Criteria`, so `filter`, `sort`, `page` and the rest are accepted too; its own listing-specific codes are `order`, `limit`, `p`, `manufacturer`, `min-price`, `max-price`, `rating`, `shipping-free`, `properties`, `property-whitelist`, `reduce-aggregations` and the `*-filter` toggles. `SearchBody` adds `search` on top of it, which is the one field a category listing does not declare. Both bodies additionally intersect `ProductListingFlags`, which contributes the `no-aggregations` and `only-aggregations` flags.

## Minimal Vue Example

<CodeExample title="Minimal category listing page">

<!-- automd:file src="examples/docs-code-examples/src/generated/frontends-recipes/catalog/listing/minimal-vue-example.vue" code lang="vue" no-name -->

```vue
<script setup lang="ts">
import { getTranslatedProperty } from "@shopware/helpers";
import type { LocationQuery } from "vue-router";

import type { Schemas } from "#shopware";

const props = defineProps<{
  // the listing the category page was rendered with
  initialListing: Schemas["ProductListingResult"];
}>();

const LIMIT = 24;

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
  setInitialListing,
} = useListing({ listingType: "categoryListing" });

const route = useRoute();
const router = useRouter();
const listingError = ref("");

// Renders before any request is sent: the CMS payload already carries a page.
setInitialListing(props.initialListing);

// getInitialFilters returns one entry per aggregation, except `properties`,
// which yields one entry per property group. Only these two are option lists;
// price, rating and shipping-free need their own controls, and categories is a
// search-listing filter a category listing cannot apply.
const optionFilters = computed(() =>
  getInitialFilters.value.filter(
    (filter) => filter.code === "manufacturer" || filter.code === "properties",
  ),
);

// The composable types availableSortings as a union that includes a plain
// { key, label }[], so narrowing it locally is what makes `translated` readable.
type SortOption = {
  key: string;
  label: string | null;
  translated?: { label: string };
};
const sortOptions = computed<SortOption[]>(() => getSortingOrders.value ?? []);

// getListingFilters types its options far more loosely than the payload is:
// a property group carries PropertyGroupOption[] under `options`, a manufacturer
// aggregation carries ProductManufacturer[] under `entities`. Both have a name.
type PropertyOption = Schemas["PropertyGroupOption"];
type ManufacturerOption = Schemas["ProductManufacturer"];
type FilterOption = PropertyOption | ManufacturerOption;

const optionsOf = (filter: { options?: unknown; entities?: unknown }) =>
  (filter.options ?? filter.entities ?? []) as FilterOption[];

// A repeated param (?manufacturer=a&manufacturer=b) arrives as an array.
// String() would join it with a comma and the API would read one unknown id.
const firstValue = (value: LocationQuery[string] | undefined) =>
  (Array.isArray(value) ? value[0] : value) ?? "";

// The criteria expects pipe-joined ids, which is exactly what the URL holds.
const selectedIds = (code: string) =>
  new Set(firstValue(route.query[code]).split("|").filter(Boolean));

const isSelected = (code: string, id: string) => selectedIds(code).has(id);

const toggleOption = (code: string, id: string) => {
  const selected = selectedIds(code);
  if (selected.has(id)) {
    selected.delete(id);
  } else {
    selected.add(id);
  }

  const query = { ...route.query, [code]: [...selected].join("|") };
  // An empty value would be sent as "" and come back as [""].
  if (!query[code]) delete query[code];

  return router.push({ query });
};

const changeSorting = (order: string) =>
  router.push({ query: { ...route.query, order } });

// Filters only. The sorting is not a filter, so it survives the reset — the
// same distinction resetFilters() draws when it keeps the search term.
const clearFilters = () =>
  router.push({ query: route.query.order ? { order: route.query.order } : {} });

function buildCriteria(query: LocationQuery) {
  const criteria: Schemas["ProductListingCriteria"] = { limit: LIMIT };
  const manufacturer = firstValue(query.manufacturer);
  if (manufacturer) criteria.manufacturer = manufacturer;
  const properties = firstValue(query.properties);
  if (properties) criteria.properties = properties;
  const order = firstValue(query.order);
  if (order) criteria.order = order;
  return criteria;
}

// useListing stores whatever response lands last, so back/forward or a quick
// second toggle can leave a stale listing on screen. The token cannot unsend the
// request or reorder the writes — it only keeps a stale failure from replacing
// the error state of the request that superseded it.
let requestId = 0;

const searchFromQuery = async (query: LocationQuery) => {
  const id = ++requestId;
  listingError.value = "";
  try {
    await search(buildCriteria(query));
  } catch (error) {
    // The raw ApiClientError carries status and details.errors — log it rather
    // than rendering it, and show the customer one sentence.
    console.error(error);
    if (id === requestId)
      listingError.value = "The products could not be loaded.";
  }
};

const loadNext = async () => {
  if (loadingMore.value || !hasMore.value) return;
  listingError.value = "";
  try {
    // loadMore() does not reuse the criteria of the last search, so the filters,
    // the sorting and the limit have to be passed again or the page ignores them.
    await loadMore({
      ...buildCriteria(route.query),
      p: getCurrentPage.value + 1,
    });
  } catch (error) {
    console.error(error);
    listingError.value = "More products could not be loaded.";
  }
};

// The only place that fetches, so back, forward and a refresh all agree.
watch(() => route.query, searchFromQuery, { deep: true });

// A deep link arrives with filters the seeded listing does not reflect.
// Client-only on purpose: useListing keeps its listings in plain refs rather
// than useState, so a server-side search is never serialized into the payload.
// Running it during SSR would spend a request whose result is discarded and
// render the loading state into the cached HTML.
onMounted(() => {
  if (Object.keys(route.query).length) searchFromQuery(route.query);
});

const hasMore = computed(() => getCurrentPage.value < getTotalPagesCount.value);

// Announces the count after a filter change and the new total after an
// append, so "Show more" is not silent for a screen reader.
const statusMessage = computed(() =>
  loading.value
    ? "Loading products…"
    : `${getElements.value.length} of ${getTotal.value} products`,
);
</script>

<template>
  <!-- Rendered unconditionally so the text is announced when it is written. -->
  <p role="alert">{{ listingError }}</p>

  <aside aria-labelledby="filters-heading">
    <h2 id="filters-heading">Filters</h2>

    <!-- every property group shares code "properties", so key on the id -->
    <fieldset v-for="filter in optionFilters" :key="filter.id ?? filter.code">
      <legend>{{ filter.label }}</legend>

      <!-- Not disabled while loading: disabling the control being operated
           blurs it, and focus drops to the document body. -->
      <label v-for="option in optionsOf(filter)" :key="option.id">
        <input
          type="checkbox"
          :checked="isSelected(filter.code, option.id)"
          @change="toggleOption(filter.code, option.id)"
        />
        {{ getTranslatedProperty(option, "name") }}
      </label>
    </fieldset>

    <button type="button" @click="clearFilters()">Clear all filters</button>
  </aside>

  <section aria-labelledby="results-heading" :aria-busy="loading">
    <h2 id="results-heading">Products</h2>

    <label>
      Sort by
      <select
        :value="getCurrentSortingOrder"
        @change="changeSorting(($event.target as HTMLSelectElement).value)"
      >
        <option
          v-for="sorting in sortOptions"
          :key="sorting.key"
          :value="sorting.key"
        >
          {{ sorting.translated?.label ?? sorting.label }}
        </option>
      </select>
    </label>

    <!-- One live region for the count and the loading state, so a filter
         change is announced instead of silently swapping the list. -->
    <p role="status">{{ statusMessage }}</p>

    <p v-if="!loading && !getElements.length">
      No products match these filters.
    </p>

    <!-- The previous page stays on screen while the next one loads;
         aria-busy is what tells assistive tech to hold off. -->
    <ul v-else>
      <li v-for="product in getElements" :key="product.id">
        {{ getTranslatedProperty(product, "name") }}
      </li>
    </ul>

    <!-- Always mounted and aria-disabled rather than disabled: removing or
         disabling the focused button drops focus to the document body.
         loadNext() guards the click. -->
    <button
      type="button"
      :aria-disabled="loadingMore || !hasMore"
      @click="loadNext()"
    >
      {{
        loadingMore ? "Loading…" : hasMore ? "Show more" : "All products loaded"
      }}
    </button>
  </section>
</template>
```

<!-- /automd -->

</CodeExample>

The example is URL-first: a control writes its selection to the query, and one watcher turns the query into a single `search()`. That is what makes the back button, a refresh and a shared link land on the same listing, and it is the pattern `useListingFilters` uses in `cms-base-layer`. `setCurrentFilters()` is the shorter alternative when the listing state does not have to survive a reload — it takes the shortcut filter params directly and searches for you. `filtersToQuery()` is the piece for the other direction: it turns a `ProductListingCriteria` into a query object, joining array values with `|`. It gates on truthiness rather than on emptiness, so `shipping-free: false`, `rating: 0` and `min-price: 0` are dropped along with the genuinely empty values.

Everything the listing needs from the URL goes through `buildCriteria`, including the page size and the sorting. That matters most for `loadMore()`: called with no argument it sends `{ p }` and nothing else, so the appended page would ignore the filters and come back at the shop's default page size rather than at `LIMIT`. `cms-base-layer` solves the same problem the same way, in `CmsElementProductListing`, by passing a rebuilt criteria as the second argument to `changeCurrentPage`.

The filter panel reads `getInitialFilters` rather than `getAvailableFilters`. Both come from `getListingFilters`, but the initial one is computed over the listing the page was rendered with, so the options do not reshuffle while the customer is selecting.

It also narrows that list. `getListingFilters` returns one entry per aggregation, except `properties`, which expands into one entry per property group; the `options` and `categories-counts` aggregations are dropped entirely. A category listing carries `price`, `rating` and `shipping-free` alongside `manufacturer` and `properties`. Those three hold no options to tick — they are labelled with the raw aggregation name and need a range input and toggles of their own. A minimal example drops them; `cms-base-layer` instead routes each code to its own component in `SwProductListingFilter`, and drops only the `categories` filter, which is search-only, in `getVisibleListingFilters`.

Each remaining filter carries its options under `options` for a property group and under `entities` for manufacturers and categories, which is why `optionsOf` falls back from one to the other. It also asserts the element type: `getListingFilters` declares those arrays as little more than `{ id, translated }`, so `getTranslatedProperty(option, "name")` does not typecheck against them even though every real payload has a name. `SwFilterProperties` in `cms-base-layer` solves the same mismatch with a generic that pins `options` to `PropertyGroupOption[]` and `entities` to `ProductManufacturer[]`.

The list key is `filter.id ?? filter.code`. Property-group entries carry an `id`, and so does the `categories` filter; `manufacturer`, `price`, `rating` and `shipping-free` do not. The fallback is what keeps those four apart, and the `id` is what keeps the property groups apart — every property group is emitted as its own filter sharing the single `properties` code.

## State And Session

The two listings live in the `useListingInitial-<listingKey>` and `useListingApplied-<listingKey>` injections, keyed by listing type. That keying is what lets a category listing and a search listing coexist on one page without overwriting each other — and it is also why a `useListing()` call in a child component picks up the listing a parent already provided. Siblings do not share: `inject` resolves through the parent chain, so two calls that are not in an ancestor relationship each keep their own state.

A listing is context-dependent. Prices come back calculated in the current currency and tax state, and availability depends on the customer's rules, so a currency or a language switch invalidates everything currently rendered. Nothing in `useListing` reacts to that — refetch with `search()` after a context change.

`loading` and `loadingMore` are separate on purpose. `search()` toggles `loading` and replaces the elements; `loadMore()` toggles `loadingMore` and appends to them. Binding a skeleton to `loading` therefore does not blank the list during an infinite-scroll fetch.

## Edge Cases

- `loadMore()` with no argument sends only `p`. On a filtered or sorted listing you have to pass your criteria again, or the appended page ignores the filters and comes back at the shop's default page size instead of yours.
- `loadMore()` copies only `page` and `elements` from the response and keeps everything else from the previous listing. `getTotal` and `getAvailableFilters` stay at the values from the earlier request.
- `search()`, `loadMore()` and `setCurrentFilters()` reject on API failure and reset their loading flag in a `finally`. A rejected call looks exactly like a completed one unless you catch it.
- `useListing` has no request cancellation and no sequence guard. Two overlapping searches are stored in the order their responses arrive, not the order they were sent, so a slow first request can overwrite a fast second one. Add your own token when a control can be operated twice before the first response lands.
- Nothing in the composables carries a request deadline. Configure `apiClientConfig.timeout` and branch on `isTimeoutError`, or a request that never settles leaves the listing on its loading state with no error and no way out.
- `initSearch()` is deprecated and behaves differently from `search()`: it returns the result and does **not** store it, so the UI does not update. Use `search()` unless you specifically want the raw result.
- `setCurrentFilters` narrows the products but not the filter options. A source comment states this explicitly: the aggregations are not reduced by the filter, so the option lists do not shrink as the customer selects. Send `reduce-aggregations` in the criteria when you do want them narrowed to the values that would still return products.
- `setCurrentFilters` rewrites the current filters before searching: a `query` key is added holding the search term — `search` is kept alongside it, so both go out in the body — and `manufacturer` and `properties` are joined with `|`. Passing an array where the criteria expects a pipe-joined string sends the wrong shape.
- An emptied selection round-trips through `join("|")` and `split("|")` and comes back as `[""]`, a one-element array holding an empty string. That write-back only happens once an applied listing exists, and it does not need you to send `""` — an already-empty array joins to `""` on its own.
- `resetFilters()` always sends a `search` key. That field exists on `searchPage post /search` but not on `readProductListing post /product-listing/{categoryId}`, so on a category listing it is a key the operation does not declare.
- `resetFilters()` deliberately keeps the search term. It clears filters, not the query.
- With `listingType: "categoryListing"` and no `categoryId`, the composable reads the id from `useCategory()`, which throws a `ContextError` when no category is in context. The failure happens at the `useListing()` call, not as a request with `undefined` in the path.
- `getInitialFilters` and `getAvailableFilters` return one entry per aggregation, except `properties`, which expands into one entry per property group; the `options` and `categories-counts` aggregations are dropped. Not every entry has selectable options.
- Property-group entries carry an `id`, and so does the `categories` filter; `manufacturer`, `price`, `rating` and `shipping-free` do not. Key a filter list on `filter.id ?? filter.code` — every property group is a separate filter sharing the `properties` code.
- A search listing can also carry a `categories` filter. Its code is not part of `ProductListingCriteria`; it is applied as a post filter, and `cms-base-layer` hides it on a category listing because it would otherwise render a checkbox the next query sync resets and that never changes the result set.
- `getLimit` falls back to the `limit` from `defaultSearchCriteria` and then to `10`. It is not the shop's configured products-per-page until a response has arrived.
- `getTotalPagesCount` is derived from `getTotal / getLimit`, so it is `0` until a listing exists. A page seeded with `setInitialListing()` has one on the first render; a page that fetches on mount does not, so a "last page" check there needs a guard.
- `getAvailableFilters` reads the applied listing's aggregations and falls back to the current listing's. Since `getCurrentListing` is the applied listing or the initial one, that fallback only ever resolves to the initial listing. `getInitialFilters` always reads the initial listing — useful for a filter panel that must not reshuffle as the customer filters.
- `changeCurrentSortingOrder` sends `order`, which sorts by one of `availableSortings`. The criteria also has a `sort` field, and the schema warns against using both together.

## Common Mistakes

- Do not request the filter options separately. They are the aggregations on the listing response.
- Do not call `loadMore()` with no criteria on a filtered listing. It sends only `p`.
- Do not use `initSearch()` to load a listing. It does not update the state.
- Do not expect the option lists to shrink as filters are applied. They only do when you send `reduce-aggregations`.
- Do not render every entry of `getInitialFilters` as a list of checkboxes. `price`, `rating` and `shipping-free` carry no options.
- Do not key a filter list on `filter.code`. Every property group shares `properties`.
- Do not pass arrays for `manufacturer` or `properties`. The criteria expects a `|`-joined string.
- Do not read a repeated query parameter with `String()`. The router hands you an array, and `String()` joins it with a comma into one id the API cannot resolve.
- Do not bind an infinite-scroll spinner to `loading`. Use `loadingMore`.
- Do not disable the control a customer is operating while its request is in flight. The browser blurs a disabled element and focus falls to the document body.
- Do not swallow the rejection. `ApiClientError` carries the status and the backend's own messages — log it, and show the customer one sentence.
- Do not call `useCategoryListing()` without `createCategoryListingContext()` on a parent — it throws by design.
- Do not send both `order` and `sort`. The schema documents that as unpredictable.
- Do not keep a local copy of the elements, the total or the current page.
- Do not assume the listing survives a currency or language switch. Refetch after a context change.

## Testing Checklist

- A page seeded with `setInitialListing()` renders products before any request is sent.
- `search({ limit: 24 })` calls the operation matching the listing type exactly once.
- Both listing requests carry the `sw-include-seo-urls` header.
- Applying a manufacturer filter issues one request and updates `getElements` and `getTotal`.
- A deep link that already carries filter params renders the filtered listing, not the seeded one.
- A URL with a repeated filter param renders the same listing as the single-value form.
- Applying a filter leaves the `getAvailableFilters` option lists unchanged, and `reduce-aggregations` narrows them.
- `resetFilters()` clears the filters but keeps the search term.
- `changeCurrentSortingOrder(key)` sends `order` and re-renders in the new order.
- `changeCurrentPage(2)` replaces the elements, while `loadMore()` appends to them.
- `loadMore()` on a filtered listing appends products that still match the filter, at the same page size.
- `loading` is `true` during a `search()` and `false` during a `loadMore()`.
- A failed `search()` shows an error, keeps the previous products on screen, and lets the customer retry.
- A failed `loadMore()` leaves the already-loaded products in place and says that more could not be loaded.
- Toggling three filters quickly leaves whichever response arrives last on screen. `useListing` has no sequence guard, so a delayed first response replaces a newer one — assert that behaviour rather than a newest-wins one.
- A superseded request that fails does not overwrite the error state of the request that replaced it.
- The result count, the loading state and the error are announced to a screen reader.
- An empty result renders an empty state rather than a stale page.

## Related Links

- [Prices and Tax State recipe](prices.html)
- [Search and Suggest recipe](search.html)
- [Product Reviews recipe](reviews.html)
- [Navigation and Breadcrumbs recipe](../context/navigation.html)
- [Language and Currency Switch recipe](../context/language-and-currency.html)
- [Product listing documentation](../../guides/e-commerce/product-listing.html)
- [Prices documentation](../../guides/e-commerce/prices.html)
- [Helpers package](../../packages/helpers.html)
- [Composables reference](../../packages/composables/)
- [API client package](../../packages/api-client.html)
