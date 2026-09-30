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
    - useShopwareContext
  helpers:
    - getTranslatedProperty
    - getProductRoute
  operations:
    - searchPage post /search
    - searchSuggest post /search-suggest
    - searchPageGet get /search
    - searchSuggestGet get /search-suggest
    - readProductDetail post /product/{productId}
    - readProductDetailGet get /product/{productId}
  schemas:
    - ProductListingResult
    - ProductDetailResponse
    - ProductListingFlags
    - Product
---

<script setup>
import RecipeFlowDiagram from "../../components/RecipeFlowDiagram.vue";
import SchemaTypeTooltip from "../../components/SchemaTypeTooltip.vue";
import CodeExample from "../../components/CodeExample.vue";

const steps = [
  {
    title: "UI",
    action: "Debounce the typing",
    detail:
      "The composable has no debounce and no minimum length. Both belong in the component, which is why the input keeps its own typing ref separate from searchTerm.",
    code: "useDebounceFn(() => { searchTerm.value = value; search(); }, 300)",
    state: "typingTerm",
    typeKeys: [],
  },
  {
    title: "Composable",
    action: "Overwrite the term",
    detail:
      "useProductSearchSuggest().search() builds the criteria from its argument and then sets search from searchTerm, so the term on the ref always wins.",
    code: "search({ limit: 10, 'no-aggregations': '1' })",
    state: "searchTerm",
    typeKeys: ['operations["searchPage post /search"]["body"]'],
  },
  {
    title: "Store API",
    action: "Run a full search",
    detail:
      "The request goes to searchPage post /search — the same operation as the results page, not the lighter search-suggest one. It returns a full ProductListingResult, with aggregations unless you switch them off.",
    code: 'apiClient.invoke("searchPage post /search")',
    state: "sw-context-token",
    typeKeys: ['operations["searchPage post /search"]["response"]'],
  },
  {
    title: "Shared state",
    action: "Write the applied listing",
    detail:
      "useProductSearchSuggest delegates to useProductSearchListing, a shared composable. The dropdown therefore writes into the same applied listing the results page reads — until that page replaces it.",
    code: "listingComposable.search(searchCriteria)",
    state: "useListingApplied-productSearchListing",
    typeKeys: ['Schemas["ProductListingResult"]'],
  },
  {
    title: "UI",
    action: "Render the preview",
    detail:
      "getProducts and getTotal are the listing's getElements and getTotal re-exported. loading is the listing's loading flag, so a results-page search turns it on here too.",
    code: "getProducts, getTotal, loading",
    state: "reactive UI",
    typeKeys: ['Schemas["Product"]'],
  },
  {
    title: "Detail",
    action: "Open one product",
    detail:
      "useProductSearch().search(productId) is a lookup by id, not a text search. It calls the product detail operation — POST, or the GET variant when cacheableReads is on — and returns the product with its configurator.",
    code: "await search(productId, { withCmsAssociations: true })",
    state: "none shared",
    typeKeys: ['Schemas["ProductDetailResponse"]'],
  },
];
</script>

# Search and Suggest

## Goal

Build a search input with a suggestion dropdown and a full results page. The important part is not the input but which of the two Store API search routes you hit, and how much state the dropdown shares with the results page: `useProductSearchSuggest` writes into the shared product search listing, while `vue-starter-template` deliberately keeps its dropdown on the lighter suggest endpoint with its own local state.

## Shopware Flow

The Store API has two text search routes, each with a POST and a cacheable GET operation. `searchPage post /search` returns a full `ProductListingResult` with aggregations and sortings; `searchSuggest post /search-suggest` is the lighter one for previews and suggestion listings. Their bodies are the same shape — both extend `ProductListingCriteria` and `ProductListingFlags` — and the only difference is that `search` is required on the suggest body and optional on the search body.

The two GET variants do **not** work the way the cacheable reads elsewhere in Frontends do. `searchPageGet get /search` and `searchSuggestGet get /search-suggest` take the criteria as flattened query params — `filter[]`, `sort[]`, `aggregations[]`, `search`, `limit` — and neither declares the compressed `_criteria` param in the generated types yet, so calling one with `_criteria` needs a local intersection type; `useCategorySearch.search` is the precedent. The two also differ in shape: on the suggest GET the `query` object itself is required and so is `search` inside it, while on the page GET both are optional. Only `readProductDetailGet get /product/{productId}`, further down this page, really does take `_criteria`.

Shopware Frontends ships a composable for only the first. `useProductSearchSuggest` calls `useProductSearchListing().search()`, which sends `searchPage post /search`. Nothing wraps `searchSuggest post /search-suggest`, so using it means calling `apiClient.invoke` from `useShopwareContext()` yourself — which is exactly what `vue-starter-template` does in `app/components/layout/header/Search.vue`.

The naming needs care too. `useProductSearch` is not a text search at all: its `search(productId)` is a lookup by id against the product detail operation, used to open a product once the customer picks one from the results.

<RecipeFlowDiagram label="Search and suggest flow diagram" :steps="steps" />

Read the diagram from left to right:

1. The input debounces the typing and enforces a minimum length itself — the composable does neither.
2. `searchTerm.value` is set, then `search()` builds the criteria and overwrites `search` with that term.
3. `searchPage post /search` returns a full listing result.
4. That result lands in the applied listing of the shared `productSearchListing`.
5. `getProducts`, `getTotal` and `loading` are that listing's `getElements`, `getTotal` and `loading`.
6. Selecting a product calls `useProductSearch().search(productId)`, which is a detail request by id.

What you do not need to call manually is the listing plumbing: `search()` writes the applied listing itself, so no component has to store the elements or the total. What you **do** still need is a request on the results page. The dropdown searched with a preview criteria — a small `limit`, no filters, no sorting, no page — and `setInitialListing` clears the applied listing when the results page seeds itself from its own payload, so the shared state is a live view, not a cache you can navigate into.

## Request Flow

| Step                       | Code                                           | Store API                   | Type                                                                                                   |
| -------------------------- | ---------------------------------------------- | --------------------------- | ------------------------------------------------------------------------------------------------------ |
| Run a suggest search       | `search({ limit: 10 })`                        | `POST /search`              | <SchemaTypeTooltip type-key='operations["searchPage post /search"]["body"]' />                         |
| Read the results           | `getProducts`, `getTotal`                      | `POST /search`              | <SchemaTypeTooltip type-key='operations["searchPage post /search"]["response"]' />                     |
| Load the next page         | `loadMore({ p: 2, search: searchTerm.value })` | `POST /search`              | <SchemaTypeTooltip type-key='Schemas["ProductListingResult"]' />                                       |
| Drop the aggregations      | `search({ "no-aggregations": "1" })`           | `POST /search`              | <SchemaTypeTooltip type-key='Schemas["ProductListingFlags"]' />                                        |
| Call the suggest operation | `invoke("searchSuggest post /search-suggest")` | `POST /search-suggest`      | <SchemaTypeTooltip type-key='operations["searchSuggest post /search-suggest"]["body"]' />              |
| Open one product           | `useProductSearch().search(productId)`         | `POST /product/{productId}` | <SchemaTypeTooltip type-key='operations["readProductDetail post /product/{productId}"]["response"]' /> |

Two rows carry a trap. `loadMore` sends exactly the criteria you hand it — the listing's search defaults are empty — so the `search` key has to be repeated or the next page comes back unfiltered. And the last row is the default only: `cacheableReads` defaults to `false` on the context, but `vue-starter-template` sets it to `true` in its `nuxt.config.ts`, so in that template `useProductSearch()` sends `readProductDetailGet get /product/{productId}` with the criteria in a `_criteria` query param.

## Composables

Pick by scope — how much of the search the composable is about:

| Composable                | Scope                         | Reach for it when                                                      |
| ------------------------- | ----------------------------- | ---------------------------------------------------------------------- |
| `useProductSearchListing` | the whole search listing      | building the results page — filters, sortings, pagination, SSR seeding |
| `useProductSearchSuggest` | the suggest dropdown          | building the suggest dropdown on top of that listing                   |
| `useProductSearch`        | one product, by id            | opening a product after the customer picks it                          |
| `useShopwareContext`      | `apiClient`, `cacheableReads` | calling `searchSuggest post /search-suggest`, which has no composable  |

The results-page members live on `useProductSearchListing`: `getAvailableFilters`, `getSortingOrders` and `resetFilters` for the facets, `loadingMore` for the append state, and `setInitialListing` for seeding from the Nuxt payload.

`useProductSearchSuggest` is the one this recipe is about, and it has six members:

- **Read** — `getProducts` is the listing's `getElements` renamed; `getTotal` and `loading` pass through unchanged.
- **Write** — `searchTerm` holds the term the next request will use; `search(criteria)` runs a search with it; `loadMore(criteria)` appends another page.

Five things the generated reference will not tell you:

- `search()` spreads your criteria and **then** assigns `search: searchTerm.value`, so a `search` key in the argument is silently discarded. The ref is the only way to set the term.
- `loadMore()` does not go through that wrapper — it is `useProductSearchListing().loadMore` re-exported unchanged. It merges your criteria over the listing's search defaults, which are empty for this listing, so a `loadMore({ p: 2 })` sends no `search` at all and appends an unfiltered page to the results. Pass the term with it.
- Only `searchTerm` and the `search` wrapper are local to the composable. `loadMore`, `getProducts`, `getTotal` and `loading` are re-exported straight off `useProductSearchListing`, which is wrapped in `createSharedComposable` — one instance per application.
- `loading` covers `search()` but not `loadMore()`, which sets the listing's separate `loadingMore` flag. `useProductSearchSuggest` does not re-export it, so a "loading more" state needs `useProductSearchListing()`. It is also a single boolean rather than a counter, so with two searches in flight the first one to settle clears it for both.
- `useProductSearch` is unrelated to all of this. `search(productId, options)` takes an id, accepts `withCmsAssociations`, `criteria` and `associations`, and returns a `ProductDetailResponse` carrying `product` and `configurator`.

The [composables reference](../../packages/composables/) is generated from source and lists every member.

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

<!-- automd:file src="examples/docs-code-examples/src/generated/frontends-recipes/catalog/search/types.ts" code lang="ts" no-name -->

```ts
import type { Schemas, operations } from "#shopware";

type SearchBody = operations["searchPage post /search"]["body"];
type SuggestBody = operations["searchSuggest post /search-suggest"]["body"];
type SearchResult = operations["searchPage post /search"]["response"];
type ProductDetailResponse = Schemas["ProductDetailResponse"];
type ListingFlags = Schemas["ProductListingFlags"];
```

<!-- /automd -->

Comparing `SearchBody` and `SuggestBody` in the tooltips shows how close they are: both extend `ProductListingCriteria` and `ProductListingFlags`, and the only difference is that `search` is required on the suggest body.

## Minimal Vue Example

<CodeExample title="Suggest dropdown on the shared listing">

<!-- automd:file src="examples/docs-code-examples/src/generated/frontends-recipes/catalog/search/minimal-vue-example.vue" code lang="vue" no-name -->

```vue
<script setup lang="ts">
import { getProductRoute, getTranslatedProperty } from "@shopware/helpers";
import { onClickOutside, useDebounceFn } from "@vueuse/core";

const { searchTerm, search, getProducts, getTotal } = useProductSearchSuggest();

const localePath = (path: string) => path;
const { formatLink } = useInternationalization(localePath);

const MIN_TERM_LENGTH = 3;

const typingTerm = ref("");
const appliedTerm = ref("");
const isOpen = ref(false);
const pending = ref(false);
const searchError = ref("");

let requestId = 0;

const runSuggestSearch = useDebounceFn(async (term: string) => {
  const id = ++requestId;
  pending.value = true;
  searchTerm.value = term;

  try {
    await search({ limit: 10, "no-aggregations": "1" });
    if (id !== requestId) return;
    appliedTerm.value = term;
    searchError.value = "";
  } catch (error) {
    if (id !== requestId) return;
    console.error(error);
    searchError.value = "The search is currently unavailable.";
  } finally {
    if (id === requestId) pending.value = false;
  }
}, 300);

watch(typingTerm, (term) => {
  searchError.value = "";

  if (term.length >= MIN_TERM_LENGTH) {
    runSuggestSearch(term);
  } else {
    pending.value = false;
  }
});

const showSuggest = computed(
  () => isOpen.value && typingTerm.value.length >= MIN_TERM_LENGTH,
);

const isStale = computed(() => appliedTerm.value !== typingTerm.value);

const close = () => {
  isOpen.value = false;
};

const searchBox = useTemplateRef("searchBox");
onClickOutside(searchBox, close);
</script>

<template>
  <div ref="searchBox">
    <label>
      Search
      <input
        v-model="typingTerm"
        type="search"
        autocomplete="off"
        @focus="isOpen = true"
        @keydown.esc="close"
      />
    </label>

    <p v-if="showSuggest && searchError" role="alert">{{ searchError }}</p>

    <div v-else-if="showSuggest" aria-live="polite">
      <p v-if="pending || isStale">Searching…</p>

      <p v-else-if="!getProducts.length">Nothing matches “{{ typingTerm }}”.</p>

      <template v-else>
        <ul>
          <li v-for="product in getProducts" :key="product.id">
            <NuxtLink :to="formatLink(getProductRoute(product))" @click="close">
              {{ getTranslatedProperty(product, "name") }}
            </NuxtLink>
          </li>
        </ul>

        <NuxtLink
          :to="formatLink({ path: '/search', query: { search: typingTerm } })"
          @click="close"
        >
          Show all {{ getTotal }} results
        </NuxtLink>
      </template>
    </div>
  </div>
</template>
```

<!-- /automd -->

</CodeExample>

Six choices in that example are deliberate, and each one is there because the shared listing does not defend itself.

`requestId` exists because the composable writes every response into the applied listing unconditionally, so two overlapping searches resolve last-to-settle-wins; without the token a slow response for `sho` permanently overwrites a fresh one for `shoes`. The debounce alone does not prevent this — it collapses keystrokes inside 300 ms, it does not cancel a request already in flight.

`appliedTerm` and `isStale` drive the placeholder instead of the composable's `loading`, for two reasons. `loading` belongs to the shared listing, so a results-page fetch turns it on here too; and it is one boolean rather than a counter, so with two searches in flight the first to settle clears it and the dropdown briefly renders "Nothing matches" for a term that has results. `isStale` also covers the window before the debounce fires, where `getProducts` still holds the previous term's products.

`runSuggestSearch.cancel()` in the `else` branch matters because deleting back below the minimum length stops the watcher from re-arming the timer but does not clear it. Without the cancel, a request goes out for a term the customer has just erased, and its result lands in the listing the results page renders from. The `onScopeDispose` covers the same timer firing after the component is gone.

`close` is wired to Escape, to `onClickOutside` and to both links. A header lives in a layout that is not remounted on navigation, so without the click handlers the panel follows the customer onto the product page and covers it.

`formatLink` wraps `getProductRoute` because the helper returns an unprefixed route. In a multi-language storefront the bare route sends a customer browsing `/de-DE` to the default-locale URL — which is why every call site in `vue-starter-template` wraps it.

The input carries no `role="combobox"`. The full pattern needs `aria-controls`, a `listbox` popup, `option` roles, `aria-activedescendant` and arrow-key handling; declaring the role without them tells a screen reader to press Down Arrow and then does nothing, which is worse than leaving the native `type="search"` semantics alone. Build the full pattern or keep the honest one — the suggestions stay reachable by Tab either way.

The results page is a separate request, not a continuation of this one. It reads the same listing through `useProductSearchListing()` — which also gives it the filters and sortings the suggest composable does not re-export — but it builds its own criteria from the URL, so filters, sorting and pagination survive a reload and a shared link. [Product Listing and Filters](listing.html) covers that side in full: how the initial and applied listings differ, what `loadMore` keeps from the previous page, and why the filter option counts do not shrink.

There is one thing the example above cannot fix, and it is the reason to think twice before shipping it as-is. Every suggest search writes into the applied listing the results page renders from, so typing in a header input while the customer is on `/search` replaces the grid behind the open panel with the ten preview products, changes the total, and resets pagination — with no navigation and no way back except a reload. The `no-aggregations` flag makes it worse: `getAvailableFilters` reads the applied listing's aggregations first, so the facet sidebar empties too. No amount of component-level care prevents this, because the component does not own the state being written.

`vue-starter-template` takes the other route for its header input for exactly that reason: it calls `apiClient.invoke("searchSuggest post /search-suggest")` directly and keeps the elements and the total in local refs. That costs you the shared listing and a few lines of wiring, and it buys a lighter request and a dropdown that cannot disturb the results page behind it. Use `useProductSearchSuggest` when the dropdown is the only search surface on screen; use the suggest operation with local state when a header input can be open over a results page. What is not reasonable either way is assuming the shared listing means the results page is already populated.

## State And Session

`useProductSearchListing` is wrapped in `createSharedComposable`, so there is exactly one product search listing in the application. `useProductSearchSuggest` adds a local `searchTerm` ref on top of it but shares everything else.

That sharing is a feature and a trap. A dropdown search updates the results page behind it, and while a single search is running `loading` is `true` on both surfaces at once. It is one boolean, not a counter, so once two searches overlap the first one to settle clears it for both and each surface can render a finished state while its own request is still open. Two suggest inputs — a header and a mobile overlay — each get their own `searchTerm` but write to the same listing.

Writes are unordered too. `search()` assigns the response to the applied listing after the `await`, with nothing comparing it against a newer request, so whichever response arrives last wins regardless of which was asked for last. Any surface that can issue overlapping searches needs its own sequence guard.

It is not a cache, either. The listing keeps an initial listing and an applied listing; `setInitialListing` writes the first and resets the second to `null`, which is how a server-rendered results page seeds itself from the Nuxt payload. Whatever the dropdown applied is discarded at that moment.

The results are context-dependent like any listing: prices arrive calculated in the current currency and tax state, and visibility follows the customer's rules. A currency or language switch invalidates whatever is currently rendered, and nothing re-runs the search for you.

## Edge Cases

- `useProductSearchSuggest().search(criteria)` sets `search` from `searchTerm` **after** spreading the criteria, so a `search` key passed in the argument is silently discarded.
- `loadMore(criteria)` sends your criteria merged over empty search defaults, with no term added. `loadMore({ p: 2 })` therefore requests an unfiltered page and appends it to the search results. Repeat `search: searchTerm.value` in every `loadMore` call.
- There is no debounce and no minimum term length in the composable. Binding `search()` straight to an `input` event issues one request per keystroke.
- Debouncing is not sequencing. `useDebounceFn` collapses keystrokes inside its window but does not cancel a request already in flight, and `search()` assigns the response to the applied listing unconditionally. Two overlapping searches resolve last-to-settle-wins, permanently. Carry a request id and discard late replies.
- Deleting back below your minimum length does not cancel a scheduled request — the watcher simply stops re-arming the timer. Call `.cancel()` on the debounced wrapper in the `else` branch, and again on scope dispose, or a search goes out for an erased term and its result lands in the shared listing.
- `getProducts` and `getTotal` hold whatever was applied last, including by another surface. Track the term you actually searched for and treat a mismatch with the current input as pending; otherwise the dropdown renders the previous listing during the debounce and the round trip.
- The suggest search runs `searchPage post /search`, which computes aggregations and sortings the dropdown never renders. Pass `no-aggregations` from `ProductListingFlags`, or a small `limit`, if that cost matters. `only-aggregations` is the opposite flag — it fetches no products at all — so it is wrong for a dropdown.
- `no-aggregations` is not free on the shared listing. `getAvailableFilters` reads the applied listing's aggregations before falling back, so a dropdown search carrying that flag empties the facet sidebar of a results page mounted at the same time.
- Both aggregation flags are typed `string | null`, and their description says the value has no effect. That means the **choice** of value is free, not that any value works: the backend tests the value for truthiness, so `"no-aggregations": ""` is silently ignored and the aggregations still come back. Send `"1"`.
- `searchSuggest post /search-suggest` exists for exactly this case but has no composable, so it needs `apiClient.invoke`. Its `search` field is required, unlike on `searchPage post /search`.
- `getProducts` and `getTotal` come from the shared listing. A `loadMore(criteria)` on the results page changes what the dropdown shows.
- `loading` is the shared listing's flag, but it only covers `search()`. `loadMore` sets `loadingMore`, which `useProductSearchSuggest` does not re-export. It is also a single boolean: with two searches in flight the first to settle clears it, so a surface can drop out of its loading state while its own request is still open.
- `loadMore`'s argument is optional on `useProductSearchListing` but **required** in the type `useProductSearchSuggest` declares for it, so `loadMore()` type-checks through the listing and not through the suggest composable.
- `useProductSearch().search()` takes a **product id**, not a term. The name suggests a text search and it is not one.
- `useProductSearch` switches operation on the context's `cacheableReads` flag: `readProductDetail post /product/{productId}` when it is `false`, `readProductDetailGet get /product/{productId}` with the criteria in a `_criteria` query param when it is `true`. The context default is `false`, but `vue-starter-template` enables it, so the request you will actually observe there is the GET. Pin your tests to the flag your app sets, not to the composable's default.
- `useProductSearch` merges `withCmsAssociations`, `criteria` and `associations` with `defu`, in that precedence order. Passing both `criteria.associations` and `associations` merges them rather than picking one.
- Both the listing search and `useProductSearch` send `sw-include-seo-urls: true`, so products from the dropdown and from the detail request alike carry the data a link needs — do not resolve the route separately. `getProductRoute` still returns an unprefixed route, so wrap it in `formatLink` from `useInternationalization` unless the storefront is single-language.
- An empty `searchTerm` produces a search for an empty string, which is a valid request returning the unfiltered listing. Guard on the term length before calling.

## Common Mistakes

- Do not pass `search` in the criteria to `useProductSearchSuggest().search()`. It is overwritten.
- Do not call `loadMore` without repeating the search term. The page you get back is not filtered by it.
- Do not reach for `only-aggregations` to make the dropdown cheaper. It returns no products; `no-aggregations` is the flag you want.
- Do not pass an empty string as an aggregation flag. It is falsy and the flag is ignored.
- Do not bind the search request directly to keystrokes. Debounce it in the component.
- Do not treat the debounce as a race guard. It does not cancel a request in flight, and the later response wins whichever term it belongs to.
- Do not leave a scheduled search running when the term drops below the minimum, or when the component goes away. Cancel it.
- Do not drive the dropdown's loading state from the shared `loading`. It is one boolean for every surface, and the first request to settle clears it.
- Do not write `catch {}` without binding the error. You cannot log it, you cannot tell a rejected criteria from a backend outage, and a programming error reaches the customer as "search unavailable".
- Do not declare `role="combobox"` without `aria-controls`, a `listbox` popup and arrow-key handling. A half-built pattern is worse for a screen reader than none.
- Do not leave a panel opened on focus with no way to close it. Wire Escape, click-outside and selection.
- Do not link with a bare `getProductRoute`. Wrap it in `formatLink` or a localised storefront drops the prefix.
- Do not assume the dropdown and the results page are independent. They are one listing.
- Do not mount a `useProductSearchSuggest` dropdown over a results page. Its searches replace that page's listing, and `no-aggregations` empties its filters as well — use `searchSuggest post /search-suggest` with local state there.
- Do not assume the shared listing means the results page needs no request. Its criteria come from the URL, and `setInitialListing` clears what the dropdown applied.
- Do not use `useProductSearch` for a text search. It resolves a product by id.
- Do not expect a composable for `searchSuggest post /search-suggest`. Using that operation means `apiClient.invoke`, as `vue-starter-template` does.
- Do not render a suggest dropdown for a one-character term.
- Do not read filters or sortings from `useProductSearchSuggest`. It does not re-export them — use `useProductSearchListing()`.
- Do not keep a local copy of the results or the total when you are on the shared listing.

## Testing Checklist

- Typing fewer than the minimum number of characters issues no request.
- Typing quickly issues one request after the debounce, not one per keystroke.
- A suggest search calls `searchPage post /search` with the term from `searchTerm`.
- A `search` key passed to `search()` does not reach the request body.
- A `loadMore()` call carries the search term, and its result is still filtered by it.
- A dropdown search sent with `"no-aggregations": "1"` returns products and an empty `aggregations` object. Sending `""` instead leaves the aggregations in place — assert on the aggregations, or the test passes without the flag doing anything.
- The dropdown and the results page render the same elements and total.
- `loading` is `true` on the dropdown while the results page is running a **single** search. Resolve two searches out of order and assert that the flag is not cleared by the first one — a test with one mocked request never reaches this.
- Two overlapping searches resolved out of order leave the listing holding the **later-requested** term's results, not the later-resolved one.
- A term deleted below the minimum length inside the debounce window issues no request at all.
- Seeding the results page with `setInitialListing` clears the applied listing the dropdown wrote.
- An empty result set renders the empty state rather than the previous results, and the previous term's products are not rendered while a new search is pending.
- Selecting a product calls the product detail operation with that product's id — `readProductDetailGet get /product/{productId}` when `cacheableReads` is on, as it is in `vue-starter-template`, and `readProductDetail post /product/{productId}` when it is off.
- A failing search does not overwrite the applied listing, so the results page behind keeps its products; the dropdown swaps its own list for the error message and announces it through `role="alert"`.
- A search that succeeds after an earlier one failed clears the error rather than leaving the banner over valid results.

## Related Links

- [Product Listing and Filters recipe](listing.html)
- [Language and Currency Switch recipe](../context/language-and-currency.html)
- [Product listing documentation](../../guides/e-commerce/product-listing.html)
- [Product detail page](../../guides/e-commerce/product-detail-page.html)
- [Caching best practices](../../best-practices/caching.html)
- [Helpers package](../../packages/helpers.html)
- [Composables reference](../../packages/composables/)
- [API client package](../../packages/api-client.html)
